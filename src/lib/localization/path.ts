import { CLOUDFLARE_ORIGIN } from '@/lib/site';
import type { Locale, Localized } from '@/types/model';

export const DEFAULT_LOCALE: Locale = 'zh';
export const LOCALE_STORAGE_KEY = 'noema.locale';

export function text(locale: Locale, value: Localized): string {
  return value[locale];
}

export function localePath(locale: Locale, path: string): string {
  const withSlash = path.startsWith('/') ? path : `/${path}`;
  const stripped = withSlash === '/' ? '/' : withSlash.replace(/\/$/, '');
  if (locale === DEFAULT_LOCALE) return stripped;
  return stripped === '/' ? `/${locale}` : `/${locale}${stripped}`;
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'zh' : 'en';
}

export function htmlLang(locale: Locale): string {
  return locale === 'zh' ? 'zh-CN' : 'en';
}

export function isLocale(value: string | null | undefined): value is Locale {
  return value === 'en' || value === 'zh';
}

export function normalizePathname(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/$/, '') || '/';
}

export function stripLocalePrefix(pathname: string): string {
  const path = normalizePathname(pathname);
  if (path === '/en' || path === '/zh') return '/';
  if (path.startsWith('/en/') || path.startsWith('/zh/')) return path.slice(3);
  return path;
}

export function pathLocale(pathname: string): Locale {
  const path = normalizePathname(pathname);
  if (path === '/en' || path.startsWith('/en/')) return 'en';
  return DEFAULT_LOCALE;
}

export function isLegacyZhPath(pathname: string): boolean {
  const path = normalizePathname(pathname);
  return path === '/zh' || path.startsWith('/zh/');
}

/**
 * Resolve the UI locale. A stored `en` or `zh` value wins.
 * Anything else — including a browser language such as `en-US` — falls back to Chinese.
 */
export function resolveLocale(
  preference: string | null | undefined,
  _browserLanguage?: string | null,
): Locale {
  if (isLocale(preference)) return preference;
  return DEFAULT_LOCALE;
}

export function readLocalePreference(storage: { getItem(key: string): string | null } | undefined): Locale | null {
  if (!storage) return null;
  try {
    const value = storage.getItem(LOCALE_STORAGE_KEY);
    return isLocale(value) ? value : null;
  } catch {
    return null;
  }
}

export function writeLocalePreference(
  storage: { setItem(key: string, value: string): void } | undefined,
  locale: Locale,
): void {
  if (!storage) return;
  try {
    storage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    /* keep navigation working if storage is blocked */
  }
}

/**
 * Path to send the visitor to, or `null` if the current URL should stay.
 * No saved preference keeps Chinese default routes and explicit `/en` URLs as they are.
 * A saved preference remaps to that locale, including leftover `/zh` bookmarks.
 */
export function localeRedirect(pathname: string, preference: string | null | undefined): string | null {
  const path = normalizePathname(pathname);
  const rest = stripLocalePrefix(path);
  if (isLegacyZhPath(path)) {
    return localePath(resolveLocale(preference), rest);
  }
  if (!isLocale(preference)) return null;
  const dest = localePath(preference, rest);
  const current = localePath(pathLocale(path), rest);
  return dest === current ? null : dest;
}

export function siteOrigin(): string {
  const site = import.meta.env.SITE;
  if (typeof site === 'string' && site.length > 0) return site.replace(/\/$/, '');
  return CLOUDFLARE_ORIGIN;
}

export function absoluteUrl(path: string): string {
  return new URL(path, `${siteOrigin()}/`).toString();
}
