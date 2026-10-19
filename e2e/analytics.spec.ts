import { expect, test } from '@playwright/test';

test('default local/dev build does not inject Cloudflare Web Analytics', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('script[data-cf-beacon]')).toHaveCount(0);
  await expect(page.locator('script[src*="cloudflareinsights"]')).toHaveCount(0);
});
