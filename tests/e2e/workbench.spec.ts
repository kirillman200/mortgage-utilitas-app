import { expect, test } from "@playwright/test";

test("all calculator tabs render a usable result", async ({ page }) => {
  await page.goto("/calculators/payment/");
  await expect(page.getByRole("heading", { name: "Payment plan" })).toBeVisible();
  await expect(page.getByLabel("Home price")).toHaveValue("650000");
  await expect(page.locator(".hero-result strong")).not.toContainText("$0");
  await expect(page.locator(".calculator-chart canvas")).toBeVisible();
  const tabs = ["Payment", "Afford", "Payoff", "Refinance", "Schedule", "Closing", "Rent vs buy", "Stress", "Reverse"];
  for (const name of tabs) {
    await page.getByRole("tab", { name }).click();
    await expect(page.locator(".hero-result")).toBeVisible();
    await expect(page.locator(".hero-result strong")).not.toHaveText("");
  }
});

test("changing calculator tabs does not move the page", async ({ page }) => {
  await page.goto("/calculators/payment/");
  const tabs = page.locator(".tool-tabs");
  await tabs.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, -100));
  const before = await page.evaluate(() => window.scrollY);
  await page.getByRole("tab", { name: "Afford" }).click();
  await page.waitForTimeout(400);
  const after = await page.evaluate(() => window.scrollY);
  expect(Math.abs(after - before)).toBeLessThanOrEqual(2);
});

test("city page renders live metrics and graphs from its API", async ({ page }) => {
  const point = (date: string, value: number) => ({ date, value });
  const series = (label: string, unit: "CAD" | "percent", values: number[]) => ({
    label,
    unit,
    points: values.map((value, index) =>
      point(new Date(Date.UTC(2024, index * 3, 1)).toISOString().slice(0, 10), value),
    ),
  });
  await page.route("**/api/housing/toronto", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      headers: {
        "X-Data-Cache": "SNAPSHOT",
        "X-Data-Source": "snapshot",
        "X-Data-Age": "3600",
      },
      body: JSON.stringify({
        city: { slug: "toronto", name: "Toronto", province: "Ontario" },
        generatedAt: "2026-07-28T12:00:00.000Z",
        rent: {
          oneBedroom: series("One-bedroom asking rent", "CAD", [1800, 1840, 1880, 1920, 1980, 2040, 2080, 2120, 2150]),
          twoBedroom: series("Two-bedroom asking rent", "CAD", [2400, 2450, 2500, 2550, 2610, 2670, 2720, 2760, 2800]),
        },
        rates: {
          prime: series("Prime rate", "percent", [7.2, 7.2, 6.95, 6.7, 6.45, 5.95, 5.45, 4.95, 4.45]),
          mortgageOneYear: series("One-year conventional mortgage rate", "percent", [7.74, 7.64, 7.24, 6.99, 6.74, 6.39, 5.99, 5.69, 5.49]),
          mortgageThreeYear: series("Three-year conventional mortgage rate", "percent", [6.94, 6.89, 6.74, 6.59, 6.45, 6.34, 6.22, 6.12, 6.05]),
          mortgageFiveYear: series("Five-year conventional mortgage rate", "percent", [6.79, 6.74, 6.69, 6.59, 6.49, 6.34, 6.22, 6.14, 6.09]),
          policy: series("Policy interest rate", "percent", [5, 5, 4.75, 4.25, 3.75, 3.25, 2.75, 2.5, 2.25]),
        },
        sources: [],
      }),
    });
  });

  await page.goto("/housing/toronto/");
  await expect(page.getByRole("heading", { name: "Current Toronto housing signals" })).toBeVisible();
  await expect(page.locator(".metric-grid strong").filter({ hasText: "$2,150" })).toBeVisible();
  await expect(page.locator(".interactive-chart canvas")).toHaveCount(2);
  await expect(page.locator(".data-warnings")).toContainText("validated static snapshot");
  await expect(page.locator(".chart-interpretation")).toHaveCount(2);

  const rentChart = page.locator(".interactive-chart").first();
  await rentChart.getByRole("button", { name: "1Y" }).click();
  await expect(rentChart.getByRole("button", { name: "1Y" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(rentChart.locator(".chart-meta")).toContainText("10 public observations");
  await expect(rentChart.locator(".chart-readout")).toContainText("$2,150");

  const rateChart = page.locator(".interactive-chart").nth(1);
  await rateChart.getByRole("button", { name: "6M" }).click();
  await expect(rateChart.locator(".chart-meta")).toContainText("12 public observations");
  await expect(rateChart.locator(".chart-readout")).toContainText("4.45%");

  const cityDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download chart data as CSV" }).click();
  const downloaded = await cityDownload;
  const downloadedPath = await downloaded.path();
  expect(downloadedPath).toBeTruthy();
  const csv = await import("node:fs/promises").then((fs) =>
    fs.readFile(downloadedPath!, "utf8"),
  );
  expect(csv).toContain("Mortgage Compass city data");
  expect(csv).toContain("One-bedroom asking rent");
});

test("save, load, compare, share, and reset controls respond", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/calculators/payment/");
  const price = page.getByLabel("Home price");
  await price.fill("725000");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("saved");
  await price.fill("600000");
  await page.getByRole("button", { name: "Load", exact: true }).click();
  await expect(price).toHaveValue("725000");
  await page.getByRole("button", { name: "Pin comparison" }).click();
  await expect(page.locator(".comparison-card")).toBeVisible();
  await page.getByRole("button", { name: "Share link" }).click();
  await expect(page.getByRole("status")).toContainText(/copied|shared/i);
  await page.getByRole("button", { name: "Reset" }).click();
  await expect(page).toHaveURL(/\/calculators\/payment\/$/);
});

test("CSV export includes the production app URL", async ({ page }) => {
  await page.goto("/calculators/payment/");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download CSV" }).click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).toBeTruthy();
  const content = await import("node:fs/promises").then((fs) => fs.readFile(path!, "utf8"));
  expect(content).toContain("https://mortgage.utilitas.app");
  expect(content).toContain("Mortgage Compass export");
});

test("PDF export downloads a PDF", async ({ page }) => {
  test.slow();
  await page.goto("/calculators/payment/");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download PDF" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/mortgage-compass-payment\.pdf$/);
  await expect(page.getByRole("status")).toContainText("PDF downloaded");
});

test("mobile layout has no horizontal page overflow", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"), "Mobile navigation check");
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.locator("summary[aria-label='Open navigation']").click();
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
});
