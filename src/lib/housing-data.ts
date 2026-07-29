import type { HousingCity } from "../data/housing-cities";

const STATCAN_ENDPOINT =
  "https://www150.statcan.gc.ca/t1/wds/rest/getDataFromCubePidCoordAndLatestNPeriods";
const BANK_OF_CANADA_ENDPOINT =
  "https://www.bankofcanada.ca/valet/observations/V80691311,V80691333,V80691334,V80691335,V39079/json?recent=120";
const MAX_RESPONSE_BYTES = 1_000_000;
const MAX_SERIES_POINTS = 1_000;

export const HOUSING_CACHE_SECONDS = 6 * 60 * 60;
export const HOUSING_STALE_SECONDS = 7 * 24 * 60 * 60;

export interface HousingDataPoint {
  date: string;
  value: number;
  estimated?: boolean;
}

export interface HousingSeries {
  label: string;
  unit: "CAD" | "percent";
  points: HousingDataPoint[];
}

export interface HousingSource {
  name: string;
  url: string;
  note: string;
}

export interface HousingRentData {
  citySlug: string;
  generatedAt: string;
  rent: {
    oneBedroom: HousingSeries;
    twoBedroom: HousingSeries;
  };
  source: HousingSource;
}

export interface HousingRatesData {
  generatedAt: string;
  rates: {
    prime: HousingSeries;
    mortgageOneYear: HousingSeries;
    mortgageThreeYear: HousingSeries;
    mortgageFiveYear: HousingSeries;
    policy: HousingSeries;
  };
  source: HousingSource;
}

export interface HousingData {
  city: Pick<HousingCity, "slug" | "name" | "province">;
  generatedAt: string;
  sourceGeneratedAt: {
    rent: string;
    rates: string;
  };
  rent: HousingRentData["rent"];
  rates: HousingRatesData["rates"];
  sources: HousingSource[];
}

interface StatCanObservation {
  refPer?: string;
  value?: number | string;
  statusCode?: number;
}

interface BankObservation {
  d?: string;
  V80691311?: { v?: string };
  V80691333?: { v?: string };
  V80691334?: { v?: string };
  V80691335?: { v?: string };
  V39079?: { v?: string };
}

async function readBoundedJson(response: Response): Promise<unknown> {
  if (!response.ok) {
    throw new Error(`Upstream request failed with status ${response.status}`);
  }

  const contentLength = Number(response.headers.get("content-length") ?? 0);
  if (contentLength > MAX_RESPONSE_BYTES) {
    throw new Error("Upstream response exceeded the allowed size");
  }

  const bytes = await response.arrayBuffer();
  if (bytes.byteLength > MAX_RESPONSE_BYTES) {
    throw new Error("Upstream response exceeded the allowed size");
  }

  return JSON.parse(new TextDecoder().decode(bytes)) as unknown;
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function fetchWithRetry(
  input: string,
  init: RequestInit,
  fetcher: typeof fetch,
): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetcher(input, {
        ...init,
        signal: AbortSignal.timeout(8_000),
      });
      const retryable = response.status === 409 || response.status === 429 || response.status >= 500;
      if (!retryable || attempt === 1) return response;
      await response.body?.cancel();
    } catch (error) {
      lastError = error;
      if (attempt === 1) throw error;
    }
    await wait(250 * (attempt + 1));
  }
  throw lastError ?? new Error("Upstream request failed");
}

function numberValue(value: unknown): number | undefined {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}(?:-\d{2})?$/.test(value)) return false;
  const normalized = value.length === 7 ? `${value}-01` : value;
  return !Number.isNaN(Date.parse(`${normalized}T00:00:00Z`));
}

function validateSeries(
  series: HousingSeries,
  minimumPoints: number,
  minimumValue: number,
  maximumValue: number,
): HousingSeries {
  if (
    !series.label ||
    series.points.length < minimumPoints ||
    series.points.length > MAX_SERIES_POINTS
  ) {
    throw new Error(`${series.label || "Public data"} has an incomplete observation set`);
  }

  const dates = new Set<string>();
  let previousDate = "";
  for (const point of series.points) {
    if (
      !isValidDate(point.date) ||
      !Number.isFinite(point.value) ||
      point.value < minimumValue ||
      point.value > maximumValue ||
      dates.has(point.date) ||
      (previousDate && point.date <= previousDate)
    ) {
      throw new Error(`${series.label} failed field validation`);
    }
    dates.add(point.date);
    previousDate = point.date;
  }

  return series;
}

function parseStatCanSeries(payload: unknown, label: string): HousingSeries {
  if (!Array.isArray(payload)) {
    throw new Error("Statistics Canada returned an unexpected response");
  }

  const firstResult = payload[0] as
    | {
        status?: string;
        object?: {
          responseStatusCode?: number;
          vectorDataPoint?: StatCanObservation[];
        };
      }
    | undefined;
  const observations = firstResult?.object?.vectorDataPoint;
  if (
    firstResult?.status !== "SUCCESS" ||
    firstResult.object?.responseStatusCode !== 0 ||
    !Array.isArray(observations)
  ) {
    throw new Error("Statistics Canada data points were unavailable");
  }

  const points = observations
    .map((observation): HousingDataPoint | undefined => {
      const value = numberValue(observation.value);
      if (!observation.refPer || value === undefined) return undefined;
      return {
        date: observation.refPer,
        value,
        estimated: observation.statusCode === 7 || undefined,
      };
    })
    .filter((point): point is HousingDataPoint => point !== undefined)
    .sort((a, b) => a.date.localeCompare(b.date));

  return validateSeries({ label, unit: "CAD", points }, 4, 100, 20_000);
}

function parseBankSeries(
  observations: BankObservation[],
  code: keyof Omit<BankObservation, "d">,
  label: string,
): HousingSeries {
  const points = observations
    .map((observation): HousingDataPoint | undefined => {
      const value = numberValue(observation[code]?.v);
      if (!observation.d || value === undefined) return undefined;
      return { date: observation.d, value };
    })
    .filter((point): point is HousingDataPoint => point !== undefined)
    .sort((a, b) => a.date.localeCompare(b.date));

  return validateSeries({ label, unit: "percent", points }, 8, 0, 30);
}

export async function fetchFreshHousingRent(
  city: HousingCity,
  fetcher: typeof fetch = fetch,
): Promise<HousingRentData> {
  const coordinates = [
    {
      productId: 46100092,
      coordinate: `${city.statCanGeographyId}.2.1.0.0.0.0.0.0.0`,
      latestN: 8,
    },
    {
      productId: 46100092,
      coordinate: `${city.statCanGeographyId}.3.1.0.0.0.0.0.0.0`,
      latestN: 8,
    },
  ];

  const response = await fetchWithRetry(
    STATCAN_ENDPOINT,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(coordinates),
    },
    fetcher,
  );
  const payload = (await readBoundedJson(response)) as unknown[];

  return {
    citySlug: city.slug,
    generatedAt: new Date().toISOString(),
    rent: {
      oneBedroom: parseStatCanSeries([payload[0]], "One-bedroom asking rent"),
      twoBedroom: parseStatCanSeries([payload[1]], "Two-bedroom asking rent"),
    },
    source: {
      name: "Statistics Canada table 46-10-0092-01",
      url: "https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=4610009201",
      note: "Quarterly advertised asking rents, not rents paid by all existing tenants.",
    },
  };
}

export async function fetchFreshHousingRates(
  fetcher: typeof fetch = fetch,
): Promise<HousingRatesData> {
  const response = await fetchWithRetry(
    BANK_OF_CANADA_ENDPOINT,
    { headers: { Accept: "application/json" } },
    fetcher,
  );
  const payload = (await readBoundedJson(response)) as {
    observations?: BankObservation[];
  };
  if (!Array.isArray(payload.observations)) {
    throw new Error("Bank of Canada returned an unexpected response");
  }

  return {
    generatedAt: new Date().toISOString(),
    rates: {
      prime: parseBankSeries(payload.observations, "V80691311", "Prime rate"),
      mortgageOneYear: parseBankSeries(
        payload.observations,
        "V80691333",
        "One-year conventional mortgage rate",
      ),
      mortgageThreeYear: parseBankSeries(
        payload.observations,
        "V80691334",
        "Three-year conventional mortgage rate",
      ),
      mortgageFiveYear: parseBankSeries(
        payload.observations,
        "V80691335",
        "Five-year conventional mortgage rate",
      ),
      policy: parseBankSeries(
        payload.observations,
        "V39079",
        "Policy interest rate",
      ),
    },
    source: {
      name: "Bank of Canada Valet API",
      url: "https://www.bankofcanada.ca/valet-api-how-to/",
      note: "Daily policy, prime, and conventional posted mortgage-rate series.",
    },
  };
}

export function combineHousingData(
  city: HousingCity,
  rentData: HousingRentData,
  ratesData: HousingRatesData,
): HousingData {
  if (rentData.citySlug !== city.slug) {
    throw new Error("Rent snapshot does not match the requested city");
  }
  const generatedAt =
    Date.parse(rentData.generatedAt) <= Date.parse(ratesData.generatedAt)
      ? rentData.generatedAt
      : ratesData.generatedAt;
  return {
    city: {
      slug: city.slug,
      name: city.name,
      province: city.province,
    },
    generatedAt,
    sourceGeneratedAt: {
      rent: rentData.generatedAt,
      rates: ratesData.generatedAt,
    },
    rent: rentData.rent,
    rates: ratesData.rates,
    sources: [rentData.source, ratesData.source],
  };
}

export async function fetchFreshHousingData(
  city: HousingCity,
  fetcher: typeof fetch = fetch,
): Promise<HousingData> {
  const [rentData, ratesData] = await Promise.all([
    fetchFreshHousingRent(city, fetcher),
    fetchFreshHousingRates(fetcher),
  ]);
  return combineHousingData(city, rentData, ratesData);
}

function isSeries(
  value: unknown,
  expectedUnit: HousingSeries["unit"],
  minimumPoints: number,
): value is HousingSeries {
  if (!value || typeof value !== "object") return false;
  const series = value as Partial<HousingSeries>;
  if (
    typeof series.label !== "string" ||
    series.unit !== expectedUnit ||
    !Array.isArray(series.points) ||
    series.points.length < minimumPoints ||
    series.points.length > MAX_SERIES_POINTS
  ) {
    return false;
  }
  return series.points.every(
    (point) =>
      point &&
      typeof point === "object" &&
      typeof point.date === "string" &&
      isValidDate(point.date) &&
      typeof point.value === "number" &&
      Number.isFinite(point.value),
  );
}

export function isHousingRentData(value: unknown): value is HousingRentData {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<HousingRentData>;
  return Boolean(
    candidate.citySlug &&
      candidate.generatedAt &&
      !Number.isNaN(Date.parse(candidate.generatedAt)) &&
      isSeries(candidate.rent?.oneBedroom, "CAD", 4) &&
      isSeries(candidate.rent?.twoBedroom, "CAD", 4) &&
      candidate.source?.url,
  );
}

export function isHousingRatesData(value: unknown): value is HousingRatesData {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<HousingRatesData>;
  return Boolean(
    candidate.generatedAt &&
      !Number.isNaN(Date.parse(candidate.generatedAt)) &&
      isSeries(candidate.rates?.prime, "percent", 8) &&
      isSeries(candidate.rates?.mortgageOneYear, "percent", 8) &&
      isSeries(candidate.rates?.mortgageThreeYear, "percent", 8) &&
      isSeries(candidate.rates?.mortgageFiveYear, "percent", 8) &&
      isSeries(candidate.rates?.policy, "percent", 8) &&
      candidate.source?.url,
  );
}

export function isHousingData(value: unknown): value is HousingData {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<HousingData>;
  return Boolean(
    candidate.city?.slug &&
      candidate.generatedAt &&
      isSeries(candidate.rent?.oneBedroom, "CAD", 4) &&
      isSeries(candidate.rent?.twoBedroom, "CAD", 4) &&
      isSeries(candidate.rates?.prime, "percent", 8) &&
      isSeries(candidate.rates?.mortgageOneYear, "percent", 8) &&
      isSeries(candidate.rates?.mortgageThreeYear, "percent", 8) &&
      isSeries(candidate.rates?.mortgageFiveYear, "percent", 8) &&
      isSeries(candidate.rates?.policy, "percent", 8),
  );
}
