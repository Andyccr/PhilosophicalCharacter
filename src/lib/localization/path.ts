import type { Locale, Localized } from '@/types/model';

export function text(locale: Locale, value: Localized): string {
  return value[locale];
}

export function localePath(locale: Locale, path: string): string {
  const withSlash = path.startsWith('/') ? path : `/${path}`;
  const stripped = withSlash === '/' ? '/' : withSlash.replace(/\/$/, '');
  if (locale === 'en') return stripped;
  return stripped === '/' ? '/zh' : `/zh${stripped}`;
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'zh' : 'en';
}

export function htmlLang(locale: Locale): string {
  return locale === 'zh' ? 'zh-Hans' : 'en';
}

export function siteOrigin(): string {
  const site = import.meta.env.SITE;
  if (typeof site === 'string' && site.length > 0) return site.replace(/\/$/, '');
  return 'https://noema.example';
}

export function absoluteUrl(path: string): string {
  return new URL(path, `${siteOrigin()}/`).toString();
}
