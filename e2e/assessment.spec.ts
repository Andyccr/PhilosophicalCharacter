import { expect, test } from '@playwright/test';

test('first visit defaults to Chinese without a saved preference', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('你不只是一种人格类型');
  await expect(page).toHaveURL(/\/$/);
});

test('legacy /zh URLs redirect onto the Chinese default routes', async ({ page }) => {
  await page.goto('/zh');
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('你不只是一种人格类型');
});

test('saved English preference is respected on the default route', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('noema.locale', 'en');
  });
  await page.goto('/');
  await expect(page).toHaveURL(/\/en\/?$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('You are more than a personality type.');
});

test('saved Chinese preference is respected on English URLs', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('noema.locale', 'zh');
  });
  await page.goto('/en');
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('你不只是一种人格类型');
});

test('homepage, questionnaire, results, share, and retake', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('You are more than a personality type.');
  await page.getByTestId('start').click();
  await expect(page.getByTestId('assessment')).toBeVisible();
  await expect(page.getByText('Directional index')).toHaveCount(0);

  await page.locator('input[type="radio"]').first().check();
  await page.getByTestId('next').click();
  await expect(page.getByText('Question 2 of 48')).toBeVisible();
  await page.getByRole('button', { name: 'Back' }).click();
  await expect(page.getByText('Question 1 of 48')).toBeVisible();
  await expect(page.locator('input[type="radio"]').first()).toBeChecked();

  await page.reload();
  await expect(page.getByText('Question 1 of 48')).toBeVisible();
  await expect(page.locator('input[type="radio"]').first()).toBeChecked();

  for (let step = 0; step < 47; step += 1) {
    await page.locator('input[type="radio"]').first().check();
    await page.getByTestId('next').click();
  }
  await page.locator('input[type="radio"]').first().check();
  await page.getByTestId('finish').click();

  await expect(page.getByTestId('paywall')).toBeVisible();
  await expect(page.getByTestId('paypal-checkout')).toHaveAttribute(
    'href',
    'https://www.paypal.com/ncp/payment/RXABC8JDX86YQ',
  );
  await expect(page.getByText('Directional index')).toHaveCount(0);
  await expect(page.getByText('Payment successful')).toHaveCount(0);

  await page.goto('/en/results?tx=8K123456789012345&st=Pending');
  await expect(page.getByTestId('paywall')).toBeVisible();
  await expect(page.getByText('not marked this payment as completed')).toBeVisible();

  await page.goto('/en/results?tx=8K123456789012345&st=Completed&amt=4.99&cc=EUR');
  await expect(page.getByTestId('results')).toBeVisible();
  await expect(page).not.toHaveURL(/tx=/);
  await expect(page.getByText('Not a measure of personality', { exact: false })).toBeVisible();
  await page.getByTestId('copy-link').click();
  const field = page.getByLabel('Copy score link');
  await expect(field).toBeVisible();
  const link = await field.inputValue();
  expect(link).toContain('#v=1');
  expect(link).not.toContain('ont-01');
  expect(link).not.toContain('age-04');

  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('download-svg').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain('.svg');

  await page.getByTestId('retake').click();
  await page.getByTestId('confirm-retake').click();
  await expect(page.getByText('Question 1 of 48')).toBeVisible();
  await expect(page.locator('input[type="radio"]').first()).not.toBeChecked();
});

test('language switcher saves English and later visits keep it', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'English', exact: true }).click();
  await expect(page).toHaveURL(/\/en\/?$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.goto('/');
  await expect(page).toHaveURL(/\/en\/?$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('You are more than a personality type.');
});

test('chinese home and mobile navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('你不只是一种人格类型');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByText('菜单', { exact: true }).click();
  await expect(page.getByRole('link', { name: '问卷' }).last()).toBeVisible();
});

test('unpaid profile stays sealed and checkout opens PayPal', async ({ page }) => {
  await page.goto('/en/premium');
  await expect(page.getByTestId('paywall')).toBeVisible();
  await expect(page.getByTestId('paypal-checkout')).toHaveAttribute(
    'href',
    'https://www.paypal.com/ncp/payment/RXABC8JDX86YQ',
  );
  await expect(page.getByText('Payment successful')).toHaveCount(0);
  await expect(page.getByText('Directional index')).toHaveCount(0);
});
