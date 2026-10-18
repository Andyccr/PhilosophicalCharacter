import { expect, test } from '@playwright/test';

const DEFINITIVE = '#v=1&n=12.12.12.12.12.12&g=000000';
const PROVISIONAL = '#v=1&n=45.12.12.12.12.12&g=000000';

test('English share view shows the free preview, locked tease, and both card sizes', async ({ page }) => {
  await page.goto(`/en/results${DEFINITIVE}`);
  await expect(page.getByTestId('free-preview')).toBeVisible();
  await expect(page.getByTestId('free-preview')).toContainText('MECDFI');
  await expect(page.getByTestId('free-preview')).toContainText('Measured Inquirer');
  await expect(page.getByTestId('free-preview')).toContainText('Explorers');
  await expect(page.getByText('Directional index')).toHaveCount(0);
  await expect(page.getByTestId('paywall')).toBeVisible();
  await expect(page.getByTestId('paypal-checkout')).toHaveAttribute('href', '/en/checkout');
  await expect(page.getByTestId('locked-section')).toContainText('Philosophers from related traditions');
  await expect(page.getByTestId('locked-section')).toContainText('not a similarity score');
  await expect(page.getByTestId('share-card')).toHaveAttribute('data-ready', 'true');
  await expect(page.getByTestId('share-card-landscape')).toHaveAttribute('width', '1200');
  await expect(page.getByTestId('share-card-landscape')).toHaveAttribute('height', '630');
  await expect(page.getByTestId('share-card-portrait')).toHaveAttribute('width', '1080');
  await expect(page.getByTestId('share-card-portrait')).toHaveAttribute('height', '1440');

  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('download-png-portrait').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/portrait\.png$/);
});

test('Chinese share view uses family rule copy and does not invent a similarity score', async ({ page }) => {
  await page.goto(`/results${DEFINITIVE}`);
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(page.getByTestId('free-preview')).toContainText('审慎的探究者');
  await expect(page.getByTestId('free-preview')).toContainText('探问者');
  await expect(page.getByTestId('free-preview')).toContainText('物理主义、被发现的意义，以及个人优先。');
  await expect(page.getByTestId('paypal-checkout')).toHaveAttribute('href', '/checkout');
  await expect(page.getByTestId('locked-section')).toContainText('思想传统相近的哲学家');
  await expect(page.getByTestId('locked-section')).toContainText('不是相似分数');
  await expect(page.getByTestId('share-card')).toHaveAttribute('data-ready', 'true');
});

test('provisional shared codes show the marker and keep indices off the page', async ({ page }) => {
  await page.goto(`/en/results${PROVISIONAL}`);
  await expect(page.getByTestId('free-preview')).toContainText('*');
  await expect(page.getByTestId('free-preview')).toContainText('Provisional profile');
  await expect(page.getByText('Directional index')).toHaveCount(0);
  await expect(page.getByTestId('results')).toHaveCount(0);
});
