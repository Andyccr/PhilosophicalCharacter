import { describe, expect, it } from 'vitest';
import { cloudflareAnalyticsToken } from '@/lib/analytics/cloudflare';

describe('Cloudflare Web Analytics gating', () => {
  it('emits nothing when the token is unset', () => {
    expect(cloudflareAnalyticsToken(undefined, '1')).toBeNull();
    expect(cloudflareAnalyticsToken('', '1')).toBeNull();
    expect(cloudflareAnalyticsToken('   ', '1')).toBeNull();
  });

  it('emits nothing outside Workers Builds even if a token is present', () => {
    expect(cloudflareAnalyticsToken('site-token', undefined)).toBeNull();
    expect(cloudflareAnalyticsToken('site-token', '')).toBeNull();
    expect(cloudflareAnalyticsToken('site-token', 'true')).toBeNull();
  });

  it('returns the token only on a Workers Builds production-style build', () => {
    expect(cloudflareAnalyticsToken('site-token', '1')).toBe('site-token');
    expect(cloudflareAnalyticsToken('  site-token  ', '1')).toBe('site-token');
  });
});
