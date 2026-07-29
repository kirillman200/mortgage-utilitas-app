import { describe, expect, it } from "vitest";
import { HOUSING_CITIES } from "../data/housing-cities";
import { fetchFreshHousingData } from "./housing-data";

describe("public housing data adapter", () => {
  it("maps Statistics Canada and Bank of Canada responses into bounded series", async () => {
    const requestedUrls: string[] = [];
    const fetcher: typeof fetch = async (input) => {
      const url = String(input);
      requestedUrls.push(url);
      if (url.includes("statcan.gc.ca")) {
        return Response.json([
          {
            status: "SUCCESS",
            object: {
              responseStatusCode: 0,
              vectorDataPoint: [
                { refPer: "2025-07", value: 2180, statusCode: 0 },
                { refPer: "2025-10", value: 2140, statusCode: 0 },
                { refPer: "2026-01", value: 2100, statusCode: 0 },
                { refPer: "2026-04", value: 2150, statusCode: 7 },
              ],
            },
          },
          {
            status: "SUCCESS",
            object: {
              responseStatusCode: 0,
              vectorDataPoint: [
                { refPer: "2025-07", value: 2680, statusCode: 0 },
                { refPer: "2025-10", value: 2720, statusCode: 0 },
                { refPer: "2026-01", value: 2750, statusCode: 0 },
                { refPer: "2026-04", value: 2800, statusCode: 0 },
              ],
            },
          },
        ]);
      }

      return Response.json({
        observations: Array.from({ length: 8 }, (_, index) => ({
          d: `2026-0${index + 1}-21`,
          V80691311: { v: "4.45" },
          V80691333: { v: "5.49" },
          V80691334: { v: "6.05" },
          V80691335: { v: "6.09" },
          V39079: { v: "2.25" },
        })),
      });
    };

    const toronto = HOUSING_CITIES.find((city) => city.slug === "toronto");
    expect(toronto).toBeDefined();
    const result = await fetchFreshHousingData(toronto!, fetcher);

    expect(result.city.name).toBe("Toronto");
    expect(result.rent.oneBedroom.points).toHaveLength(4);
    expect(result.rent.oneBedroom.points[3]).toMatchObject({
      value: 2150,
      estimated: true,
    });
    expect(result.rates.mortgageFiveYear.points[0]?.value).toBe(6.09);
    expect(result.rates.policy.points[0]?.value).toBe(2.25);
    expect(result.sources).toHaveLength(2);
    expect(requestedUrls.some((url) => url.includes("recent=120"))).toBe(true);
  });

  it("rejects oversized upstream responses before parsing", async () => {
    const fetcher: typeof fetch = async () =>
      new Response("{}", { headers: { "Content-Length": "1000001" } });
    await expect(
      fetchFreshHousingData(HOUSING_CITIES[0]!, fetcher),
    ).rejects.toThrow(/allowed size/);
  });

  it("retries transient upstream failures once", async () => {
    const attempts = new Map<string, number>();
    const fetcher: typeof fetch = async (input) => {
      const url = String(input);
      const count = (attempts.get(url) ?? 0) + 1;
      attempts.set(url, count);
      if (count === 1) return new Response("Unavailable", { status: 503 });

      if (url.includes("statcan.gc.ca")) {
        return Response.json([
          {
            status: "SUCCESS",
            object: {
              responseStatusCode: 0,
              vectorDataPoint: Array.from({ length: 4 }, (_, index) => ({
                refPer: `2025-${String(index * 3 + 1).padStart(2, "0")}`,
                value: 2150 + index,
              })),
            },
          },
          {
            status: "SUCCESS",
            object: {
              responseStatusCode: 0,
              vectorDataPoint: Array.from({ length: 4 }, (_, index) => ({
                refPer: `2025-${String(index * 3 + 1).padStart(2, "0")}`,
                value: 2800 + index,
              })),
            },
          },
        ]);
      }

      return Response.json({
        observations: Array.from({ length: 8 }, (_, index) => ({
          d: `2026-0${index + 1}-21`,
          V80691311: { v: "4.45" },
          V80691333: { v: "5.49" },
          V80691334: { v: "6.05" },
          V80691335: { v: "6.09" },
          V39079: { v: "2.25" },
        })),
      });
    };

    await expect(
      fetchFreshHousingData(HOUSING_CITIES[0]!, fetcher),
    ).resolves.toMatchObject({ city: { slug: "toronto" } });
    expect([...attempts.values()]).toEqual([2, 2]);
  });
});
