import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

// Exercise the full committed fallback payload, including its wide table labels.
test("city snapshot tables scroll within the dashboard and preserve CSV export", async ({ page }) => {
  const rates = JSON.parse(await readFile("public/data/housing/v1/rates.json", "utf8"));
  for (const city of ["toronto", "vancouver", "montreal", "calgary", "edmonton", "winnipeg"]) {
    const rent = JSON.parse(await readFile(`public/data/housing/v1/${city}.json`, "utf8"));
    await page.route(`**/api/housing/${city}`, (route) => route.fulfill({
      contentType: "application/json",
      headers: { "X-Data-Cache": "SNAPSHOT", "X-Data-Source": "snapshot" },
      body: JSON.stringify({
        city: { slug: city, name: city, province: "" },
        generatedAt: rent.generatedAt, rent: rent.rent, rates: rates.rates,
        sources: [rent.source, rates.source],
      }),
    }));
    await page.goto(`/housing/${city}/`);
    const consent = page.getByRole("button", { name: "Do not allow", exact: true });
    if (await consent.isVisible()) await consent.click();
    await expect(page.locator(".data-state")).toHaveText("Validated snapshot");
    await expect(page.locator(".interactive-chart canvas")).toHaveCount(2);
    await page.getByText("View all chart values as a table", { exact: true }).click();
    const series = [rent.rent.oneBedroom, rent.rent.twoBedroom, rates.rates.prime,
      rates.rates.mortgageOneYear, rates.rates.mortgageThreeYear, rates.rates.mortgageFiveYear];
    await expect(page.locator(".data-table tbody tr")).toHaveCount(
      series.reduce((count, item) => count + item.points.length, 0),
    );
    await expect.poll(() => page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )).toBeLessThanOrEqual(1);
    const table = page.locator(".table-scroll");
    const geometry = await table.evaluate((el) => {
      el.scrollLeft = el.scrollWidth;
      return { width: el.clientWidth, content: el.scrollWidth, left: el.scrollLeft };
    });
    if (geometry.content > geometry.width) expect(geometry.left).toBeGreaterThan(0);
    const downloaded = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download chart data as CSV" }).click();
    const download = await downloaded;
    expect(download.suggestedFilename()).toBe(`mortgage-compass-${city}-housing-data.csv`);
    const csv = await readFile((await download.path())!, "utf8");
    expect(csv).toContain("Mortgage Compass city data");
    expect(csv).toContain("One-bedroom asking rent");
    expect(csv).toContain("Five-year conventional mortgage rate");
  }
});
