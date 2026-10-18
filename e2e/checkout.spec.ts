import { expect, test } from '@playwright/test';

const PAYPAL_CHECKOUT = 'https://www.paypal.com/ncp/payment/RXABC8JDX86YQ';

test('checkout pages are noindex and point at the provider URL', async ({ request }) => {
  for (const path of ['/checkout', '/en/checkout']) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status()).toBeLessThan(400);
    const html = await response.text();
    expect(html).toContain('noindex, nofollow');
    expect(html).toContain(PAYPAL_CHECKOUT);
    expect(html).toContain('data-testid="checkout-fallback"');
    expect(html).not.toContain('cloudflareinsights');
    expect(html).not.toContain('data-cf-beacon');
  }
});

test('pay button goes to /checkout, which redirects to the provider', async ({ page }) => {
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
  await expect(page).toHaveURL(/paypal\.com\/ncp\/payment\/RXABC8JDX86YQ/);
});

test('Chinese checkout path is unprefixed', async ({ page }) => {
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
  await expect(page).toHaveURL(/paypal\.com\/ncp\/payment\/RXABC8JDX86YQ/);
});
