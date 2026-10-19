import { describe, expect, it } from 'vitest';
import { checkoutCancelPath, checkoutReturnPath } from '@/lib/checkout/target';
import { localePath } from '@/lib/localization/path';
import { includeInSitemap } from '@/lib/seo/sitemap';

describe('checkout entry', () => {
  it('returns locale-aware results paths for PayPal return and cancel', () => {
    expect(checkoutReturnPath('zh')).toBe('/results');
    expect(checkoutReturnPath('en')).toBe('/en/results');
    expect(checkoutCancelPath('zh')).toBe('/results');
    expect(checkoutCancelPath('en')).toBe('/en/results');
  });

  it('uses locale-prefixed checkout paths for the pay button', () => {
    expect(localePath('zh', '/checkout')).toBe('/checkout');
    expect(localePath('en', '/checkout')).toBe('/en/checkout');
  });

  it('excludes checkout and results from the sitemap', () => {
    expect(includeInSitemap('https://example.test/checkout')).toBe(false);
    expect(includeInSitemap('https://example.test/en/checkout')).toBe(false);
    expect(includeInSitemap('https://example.test/results')).toBe(false);
    expect(includeInSitemap('https://example.test/en/results')).toBe(false);
    expect(includeInSitemap('https://example.test/privacy')).toBe(true);
    expect(includeInSitemap('https://example.test/en/privacy')).toBe(true);
  });
});
