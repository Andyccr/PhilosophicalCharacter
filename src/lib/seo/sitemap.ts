/** Pages that must not appear in sitemap.xml (paywall, checkout funnel, error). */
export function includeInSitemap(page: string): boolean {
  if (page.includes('/404')) return false;
  if (/\/results\/?$/.test(page)) return false;
  if (/\/checkout\/?$/.test(page)) return false;
  return true;
}
