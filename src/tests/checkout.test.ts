import { describe, expect, it } from 'vitest';
import { checkoutRedirectUrl } from '@/lib/checkout/target';
import { localePath } from '@/lib/localization/path';
import { includeInSitemap } from '@/lib/seo/sitemap';

describe('checkout entry', () => {
  it('reads the hosted checkout URL from the payment provider module', () => {
    expect(checkoutRedirectUrl()).toBe('https://www.paypal.com/ncp/payment/RXABC8JDX86YQ');
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
