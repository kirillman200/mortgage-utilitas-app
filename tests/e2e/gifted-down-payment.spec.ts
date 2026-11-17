import { expect, test } from '@playwright/test';

test('gift checklist and CAD ledger render with contextual links on every viewport', async ({ page }) => {
  await page.goto('/guides/gifted-down-payment-canada/');
  await expect(page).toHaveTitle('Gifted Down Payment in Canada: Documents to Prepare');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('table')).toHaveCount(2);
  await expect(page.locator('table').first().locator('tbody tr')).toHaveCount(7);
  await expect(page.locator('table').last().getByRole('row', { name: 'Cash buffer after those costs $6,000 $18,000 - $12,000', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'mortgage preapproval checklist', exact: true })).toHaveAttribute('href', '/guides/how-to-get-preapproved-for-mortgage/');
  await expect(page.getByRole('link', { name: 'closing-cost planner', exact: true })).toHaveAttribute('href', '/calculators/closing-costs/');
  await expect(page.locator('a', { hasText: "CMHC's mortgage application checklist" }).first()).toBeVisible();
  await expect(page.locator('details.faq-item')).toHaveCount(4);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByText('Does a gift letter replace bank statements?', { exact: true }).click();
  await expect(page.getByText('Prepare both the letter and the financial records the lender requests.', { exact: false })).toBeVisible();
  await page.goto('/guides/how-to-get-preapproved-for-mortgage/');
  await page.getByRole('link', { name: 'gifted down payment document checklist', exact: true }).click();
  await expect(page).toHaveURL(/\/guides\/gifted-down-payment-canada\/$/);
});
