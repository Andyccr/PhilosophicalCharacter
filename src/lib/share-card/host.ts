/**
 * Host printed on the share card. Never hardcode a workers.dev sample.
 * Prefer the runtime host; fall back to import.meta.env.SITE (Astro `site`).
 * PR #3 replaces the stale default site with the single production origin.
 */
export function shareCardHost(runtimeHost?: string, configuredSite?: string): string {
  const live = runtimeHost?.trim();
  if (live) return live.replace(/\/$/, '');

  const site = (configuredSite ?? (typeof import.meta.env.SITE === 'string' ? import.meta.env.SITE : '')).trim();
  if (!site) return '';
  try {
    return new URL(site).host;
  } catch {
    return site.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }
}

export function runtimeShareCardHost(): string {
  if (typeof window !== 'undefined' && window.location.host) return shareCardHost(window.location.host);
  return shareCardHost(undefined, import.meta.env.SITE);
}
