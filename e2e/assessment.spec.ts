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

  await expect(page.getByTestId('free-preview')).toBeVisible();
  await expect(page.getByTestId('paywall')).toBeVisible();
  await expect(page.getByTestId('paypal-checkout')).toBeVisible();
  await expect(page.getByTestId('paypal-checkout')).toHaveAttribute('href', '/en/checkout');
  await expect(page.getByTestId('locked-section')).toContainText('Philosophers from related traditions');
  await expect(page.getByTestId('locked-section')).toContainText('not a similarity score');
  await expect(page.getByTestId('share-card')).toBeVisible();
  await expect(page.getByTestId('share-card')).toHaveAttribute('data-ready', 'true');
  await expect(page.getByTestId('share-card-landscape')).toHaveAttribute('width', '1200');
  await expect(page.getByTestId('share-card-portrait')).toHaveAttribute('width', '1080');
  await expect(page.getByText('Directional index')).toHaveCount(0);
  await expect(page.getByText('Payment successful')).toHaveCount(0);

  await page.getByTestId('copy-link').click();
  await expect(page.getByLabel('Copy score link')).toBeVisible();
  expect(await page.getByLabel('Copy score link').inputValue()).toContain('#v=1');

  await page.goto('/en/results?tx=8K123456789012345&st=Completed&amt=4.99&cc=EUR');
  await expect(page.getByTestId('paywall')).toBeVisible();
  await expect(page.getByTestId('results')).toHaveCount(0);
  await expect(page.getByText('Directional index')).toHaveCount(0);

  await page.goto('/en/results?token=5O190127TN364715T');
  await expect(page.getByTestId('paywall')).toBeVisible();
  await expect(page.getByText('has not completed this payment')).toBeVisible();

  await page.route('**/api/profile', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockPaidProfile()),
    });
  });
  await page.addInitScript(() => {
    localStorage.setItem(
      'noema.access.v1',
      JSON.stringify({
        version: 1,
        token: 'testpayload.testsag',
        orderId: '5O190127TN364715T',
        unlockedAt: '2026-10-18T00:00:00.000Z',
      }),
    );
  });
  await page.goto('/en/results');
  await expect(page.getByTestId('results')).toBeVisible();
  await expect(page.getByText('Not a measure of personality', { exact: false })).toBeVisible();
  await page.getByTestId('copy-link').click();
  const field = page.getByLabel('Copy score link');
  await expect(field).toBeVisible();
  const link = await field.inputValue();
  expect(link).toContain('#v=1');
  expect(link).not.toContain('ont-01');
  expect(link).not.toContain('age-04');

  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('download-png-landscape').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain('.png');

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

test('unpaid profile stays sealed and checkout is not a hosted PayPal link', async ({ page }) => {
  await page.goto('/en/premium');
  await expect(page.getByTestId('paywall')).toBeVisible();
  await expect(page.getByTestId('paypal-checkout')).toBeVisible();
  await expect(page.getByTestId('paypal-checkout')).toHaveAttribute('href', '/en/checkout');
  await expect(page.getByText('Payment successful')).toHaveCount(0);
  await expect(page.getByText('Directional index')).toHaveCount(0);
});

function mockPaidProfile() {
  const axis = (id: string, label: string) => ({
    id,
    label,
    leftPole: 'Left',
    rightPole: 'Right',
    score: 12,
    directionalCount: 8,
    applicableCount: 8,
    description: `${label}: directional index 12`,
    narrative: `${label} narrative`,
    disagreement: 'Answers on this axis mostly agree in direction.',
  });
  return {
    locale: 'en',
    assignment: { status: 'definitive', code: 'MECDFI', reasons: [] },
    code: 'MECDFI',
    name: 'Measured Inquirer',
    familyId: 'explorers',
    familyName: 'Explorers',
    summary: 'A public summary.',
    axes: [
      axis('ontology', 'Reality'),
      axis('epistemology', 'Knowledge'),
      axis('ethics', 'Morality'),
      axis('agency', 'Freedom'),
      axis('meaning', 'Meaning'),
      axis('society', 'Social life'),
    ],
    worldview: ['A worldview paragraph.'],
    strengths: ['A strength.'],
    blindSpots: ['A blind spot.'],
    pairingPressure: 'A pressure.',
    reflection: ['A question?'],
    tensions: [],
    standing: [],
    readings: [],
    typePath: '/en/types/mecdfl',
  };
}
