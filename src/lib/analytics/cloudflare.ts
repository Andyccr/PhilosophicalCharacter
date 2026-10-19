/**
 * Cloudflare Web Analytics is a cookieless beacon. The token is a public site
 * token (safe to expose in HTML), not an API secret.
 *
 * Inject only when both are true:
 * - PUBLIC_CF_ANALYTICS_TOKEN is non-empty
 * - WORKERS_CI=1 (Workers Builds). GitHub Pages and local builds emit nothing.
 */
export function cloudflareAnalyticsToken(
  token: string | undefined,
  workersCi: string | undefined,
): string | null {
  if (workersCi !== '1') return null;
  const trimmed = token?.trim() ?? '';
  return trimmed.length > 0 ? trimmed : null;
}

export const CLOUDFLARE_ANALYTICS_SCRIPT = 'https://static.cloudflareinsights.com/beacon.min.js';
