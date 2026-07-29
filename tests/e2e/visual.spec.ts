import { expect, test } from "@playwright/test";

test("key pages render for visual review", async ({ page }, testInfo) => {
  const mobile = testInfo.project.name.startsWith("mobile");
  await page.goto(mobile ? "/guides/how-to-get-preapproved-for-mortgage/" : "/");
  await expect(page.locator("h1")).toBeVisible();
  await page.screenshot({
    path: `.tmp/${mobile ? "article-mobile" : "home-desktop"}.png`,
    fullPage: true
  });
});

test("breadcrumbs sit directly below the page hero", async ({ page }) => {
  await page.goto("/housing/toronto/");
  const hero = await page.locator(".page-hero").boundingBox();
  const breadcrumbs = await page.locator(".breadcrumbs").boundingBox();
  expect(hero).not.toBeNull();
  expect(breadcrumbs).not.toBeNull();
  expect(breadcrumbs!.y).toBeGreaterThanOrEqual(hero!.y + hero!.height - 1);
  expect(breadcrumbs!.y - (hero!.y + hero!.height)).toBeLessThanOrEqual(1);
});

test("calculator breadcrumbs remain visible between the hero and workspace", async ({ page }) => {
  await page.goto("/calculators/payment/");
  const breadcrumbNav = page.locator(".breadcrumbs");
  const hero = await page.locator(".page-hero").boundingBox();
  const breadcrumbs = await breadcrumbNav.boundingBox();
  const workspace = await page.locator(".workbench").boundingBox();

  await expect(breadcrumbNav).toBeVisible();
  await expect(breadcrumbNav.getByText("Home")).toBeVisible();
  await expect(breadcrumbNav.getByText("Calculators")).toBeVisible();
  await expect(breadcrumbNav.getByText("Mortgage Payment Calculator")).toBeVisible();
  expect(hero).not.toBeNull();
  expect(breadcrumbs).not.toBeNull();
  expect(workspace).not.toBeNull();
  expect(breadcrumbs!.y).toBeGreaterThanOrEqual(hero!.y + hero!.height - 1);
  expect(workspace!.y).toBeGreaterThanOrEqual(breadcrumbs!.y + breadcrumbs!.height);
});
