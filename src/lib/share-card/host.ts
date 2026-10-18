/**
 * Host printed on the share card. Never hardcode a production origin.
 * Prefer import.meta.env.SITE (Astro `site`, the canonical origin PR #3 introduces)
 * so a Pages deploy still names the Workers host, where checkout works.
 * Fall back to the runtime host only when SITE is empty or loopback.
 */
export function shareCardHost(runtimeHost?: string, configuredSite?: string): string {
  const site = (configuredSite ?? (typeof import.meta.env.SITE === 'string' ? import.meta.env.SITE : '')).trim();
  const fromSite = hostFromSite(site);
  if (fromSite && !isLocalLikeHost(fromSite)) return fromSite;

  const live = runtimeHost?.trim().replace(/\/$/, '') ?? '';
  return live;
}

export function runtimeShareCardHost(): string {
  const runtime = typeof window !== 'undefined' ? window.location.host : undefined;
  return shareCardHost(runtime, typeof import.meta.env.SITE === 'string' ? import.meta.env.SITE : undefined);
}

function hostFromSite(site: string): string {
  if (!site) return '';
  try {
    return new URL(site).host;
  } catch {
    return site.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }
}

function isLocalLikeHost(host: string): boolean {
  const name = hostnameOf(host);
  return name === 'localhost' || name === '127.0.0.1' || name === '::1' || name === '0.0.0.0';
}

function hostnameOf(host: string): string {
  const trimmed = host.trim().toLowerCase();
  if (trimmed.startsWith('[')) {
    const close = trimmed.indexOf(']');
    if (close > 0) return trimmed.slice(1, close);
  }
  return trimmed.replace(/:\d+$/, '');
}
