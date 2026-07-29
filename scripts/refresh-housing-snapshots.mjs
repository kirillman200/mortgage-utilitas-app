import { mkdir, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = join(projectRoot, "public", "data", "housing", "v1");
const statCanEndpoint =
  "https://www150.statcan.gc.ca/t1/wds/rest/getDataFromCubePidCoordAndLatestNPeriods";
const bankEndpoint =
  "https://www.bankofcanada.ca/valet/observations/V80691311,V80691333,V80691334,V80691335,V39079/json?recent=120";
const cities = [
  ["toronto", 27],
  ["vancouver", 41],
  ["montreal", 7],
  ["calgary", 32],
  ["edmonton", 33],
  ["winnipeg", 29],
];

async function fetchJson(url, init = {}) {
  let lastError;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(15_000),
      });
      if (response.ok) return response.json();
      if (response.status !== 409 && response.status !== 429 && response.status < 500) {
        throw new Error(`${url} returned ${response.status}`);
      }
      lastError = new Error(`${url} returned ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
  }
  throw lastError ?? new Error(`Unable to fetch ${url}`);
}

function validatePoints(points, minimumPoints, minimumValue, maximumValue, label) {
  if (!Array.isArray(points) || points.length < minimumPoints || points.length > 1_000) {
    throw new Error(`${label} has an incomplete observation set`);
  }
  const dates = new Set();
  let previousDate = "";
  for (const point of points) {
    if (
      !/^\d{4}-\d{2}(?:-\d{2})?$/.test(point.date) ||
      !Number.isFinite(point.value) ||
      point.value < minimumValue ||
      point.value > maximumValue ||
      dates.has(point.date) ||
      (previousDate && point.date <= previousDate)
    ) {
      throw new Error(`${label} failed snapshot validation`);
    }
    dates.add(point.date);
    previousDate = point.date;
  }
  return points;
}

function statCanSeries(result, label) {
  if (
    result?.status !== "SUCCESS" ||
    result?.object?.responseStatusCode !== 0 ||
    !Array.isArray(result.object.vectorDataPoint)
  ) {
    throw new Error(`${label} was unavailable from Statistics Canada`);
  }
  const points = result.object.vectorDataPoint
    .flatMap((point) => {
      const value = Number(point.value);
      return point.refPer && Number.isFinite(value)
        ? [{
            date: point.refPer,
            value,
            ...(point.statusCode === 7 ? { estimated: true } : {}),
          }]
        : [];
    })
    .sort((left, right) => left.date.localeCompare(right.date));
  validatePoints(points, 4, 100, 20_000, label);
  return { label, unit: "CAD", points };
}

function bankSeries(observations, code, label) {
  const points = observations
    .flatMap((observation) => {
      const value = Number(observation?.[code]?.v);
      return observation?.d && Number.isFinite(value)
        ? [{ date: observation.d, value }]
        : [];
    })
    .sort((left, right) => left.date.localeCompare(right.date));
  validatePoints(points, 8, 0, 30, label);
  return { label, unit: "percent", points };
}

async function fetchRates(generatedAt) {
  const payload = await fetchJson(bankEndpoint, {
    headers: { Accept: "application/json" },
  });
  if (!Array.isArray(payload.observations)) {
    throw new Error("Bank of Canada observations were unavailable");
  }
  return {
    generatedAt,
    rates: {
      prime: bankSeries(payload.observations, "V80691311", "Prime rate"),
      mortgageOneYear: bankSeries(
        payload.observations,
        "V80691333",
        "One-year conventional mortgage rate",
      ),
      mortgageThreeYear: bankSeries(
        payload.observations,
        "V80691334",
        "Three-year conventional mortgage rate",
      ),
      mortgageFiveYear: bankSeries(
        payload.observations,
        "V80691335",
        "Five-year conventional mortgage rate",
      ),
      policy: bankSeries(payload.observations, "V39079", "Policy interest rate"),
    },
    source: {
      name: "Bank of Canada Valet API",
      url: "https://www.bankofcanada.ca/valet-api-how-to/",
      note: "Daily policy, prime, and conventional posted mortgage-rate series.",
    },
  };
}

async function fetchRent(citySlug, geographyId, generatedAt) {
  const coordinates = [
    {
      productId: 46100092,
      coordinate: `${geographyId}.2.1.0.0.0.0.0.0.0`,
      latestN: 8,
    },
    {
      productId: 46100092,
      coordinate: `${geographyId}.3.1.0.0.0.0.0.0.0`,
      latestN: 8,
    },
  ];
  const payload = await fetchJson(statCanEndpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(coordinates),
  });
  if (!Array.isArray(payload) || payload.length !== 2) {
    throw new Error(`Statistics Canada returned an invalid ${citySlug} payload`);
  }
  return {
    citySlug,
    generatedAt,
    rent: {
      oneBedroom: statCanSeries(payload[0], "One-bedroom asking rent"),
      twoBedroom: statCanSeries(payload[1], "Two-bedroom asking rent"),
    },
    source: {
      name: "Statistics Canada table 46-10-0092-01",
      url: "https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=4610009201",
      note: "Quarterly advertised asking rents, not rents paid by all existing tenants.",
    },
  };
}

async function writeAtomic(filename, value) {
  const destination = join(outputDirectory, filename);
  const temporary = `${destination}.${Date.now()}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temporary, destination);
}

const generatedAt = new Date().toISOString();
const [rates, ...rentSnapshots] = await Promise.all([
  fetchRates(generatedAt),
  ...cities.map(([slug, geographyId]) =>
    fetchRent(slug, geographyId, generatedAt),
  ),
]);

await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  writeAtomic("rates.json", rates),
  ...rentSnapshots.map((snapshot) =>
    writeAtomic(`${snapshot.citySlug}.json`, snapshot),
  ),
]);

console.log(
  `Wrote validated housing snapshots for rates and ${rentSnapshots.length} cities.`,
);
