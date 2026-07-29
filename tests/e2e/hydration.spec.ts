import { expect, test } from "@playwright/test";

test("calculator island hydrates without browser errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/calculators/payment/");
  await page.waitForTimeout(2000);
  const ssr = await page.locator("astro-island").getAttribute("ssr");
  expect({ ssr, errors }).toEqual({ ssr: null, errors: [] });
  await expect(page.getByLabel("Home price")).toBeEnabled();
});

test("Worker-backed housing API is present during local serving", async ({ request }) => {
  const response = await request.get("/api/housing/not-a-city");
  expect(response.status()).toBe(404);
  expect(response.headers()["content-type"]).toContain("application/json");
  expect(response.headers()["x-data-cache"]).toBe("ERROR");
  await expect(response.json()).resolves.toEqual({
    error: "City data is unavailable.",
  });
});
