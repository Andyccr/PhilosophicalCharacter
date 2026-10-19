import { expect, test } from '@playwright/test';

const APPROVAL = 'https://www.paypal.com/checkoutnow?token=TESTORDER';

test('checkout pages are noindex and start a Worker PayPal order', async ({ page }) => {
  await page.route('**/api/checkout', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ orderId: 'TESTORDER', approvalUrl: APPROVAL }),
    });
  });
  await page.route('https://www.paypal.com/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<!doctype html><title>paypal-stub</title><p>paypal-stub</p>',
    });
  });

  for (const path of ['/checkout', '/en/checkout']) {
    await page.goto(path);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.getByTestId('checkout-fallback')).toBeVisible();
    await expect(page).toHaveURL(/paypal\.com\/checkoutnow\?token=TESTORDER/);
    await expect(page.locator('html')).not.toContainText('cloudflareinsights');
  }
});

test('pay button goes to /checkout, which redirects to the approval URL', async ({ page }) => {
  await page.route('**/api/checkout', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ orderId: 'TESTORDER', approvalUrl: APPROVAL }),
    });
  });
  await page.route('https://www.paypal.com/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<!doctype html><title>paypal-stub</title><p>paypal-stub</p>',
    });
  });

  await page.goto('/en/premium');
  await expect(page.getByTestId('paypal-checkout')).toHaveAttribute('href', '/en/checkout');
  await page.getByTestId('paypal-checkout').click();
  await expect(page).toHaveURL(/paypal\.com\/checkoutnow\?token=TESTORDER/);
});

test('Chinese checkout path is unprefixed', async ({ page }) => {
  await page.route('**/api/checkout', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ orderId: 'TESTORDER', approvalUrl: APPROVAL }),
    });
  });
  await page.route('https://www.paypal.com/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<!doctype html><title>paypal-stub</title><p>paypal-stub</p>',
    });
  });

  await page.goto('/premium');
  await expect(page.getByTestId('paypal-checkout')).toHaveAttribute('href', '/checkout');
  await page.getByTestId('paypal-checkout').click();
  await expect(page).toHaveURL(/paypal\.com\/checkoutnow\?token=TESTORDER/);
});
