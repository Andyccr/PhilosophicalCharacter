import { describe, expect, it } from 'vitest';
import {
  htmlLang,
  localePath,
  localeRedirect,
  pathLocale,
  resolveLocale,
  stripLocalePrefix,
} from '@/lib/localization/path';

describe('locale routing and first-visit default', () => {
  it('treats Chinese as the unprefixed default locale', () => {
    expect(localePath('zh', '/')).toBe('/');
    expect(localePath('zh', '/results')).toBe('/results');
    expect(localePath('en', '/')).toBe('/en');
    expect(localePath('en', '/types/mecdfl')).toBe('/en/types/mecdfl');
    expect(pathLocale('/')).toBe('zh');
    expect(pathLocale('/test')).toBe('zh');
    expect(pathLocale('/en')).toBe('en');
    expect(pathLocale('/en/test')).toBe('en');
    expect(stripLocalePrefix('/en/results')).toBe('/results');
    expect(stripLocalePrefix('/zh/results')).toBe('/results');
  });

  it('sets html lang to zh-CN on Chinese pages and en on English pages', () => {
    expect(htmlLang('zh')).toBe('zh-CN');
    expect(htmlLang('en')).toBe('en');
  });

  it('defaults to Chinese on first visit when no language preference is saved', () => {
    expect(resolveLocale(null)).toBe('zh');
    expect(resolveLocale(undefined)).toBe('zh');
    expect(resolveLocale('')).toBe('zh');
    expect(localeRedirect('/', null)).toBeNull();
    expect(localeRedirect('/test', null)).toBeNull();
    expect(localeRedirect('/en', null)).toBeNull();
  });

  it('does not take the browser language as the default', () => {
    expect(resolveLocale(null, 'en')).toBe('zh');
    expect(resolveLocale(null, 'en-US')).toBe('zh');
    expect(resolveLocale('en-US', 'en-US')).toBe('zh');
    expect(resolveLocale('fr-FR', 'fr')).toBe('zh');
  });

  it('respects an explicitly saved English or Chinese preference', () => {
    expect(resolveLocale('en')).toBe('en');
    expect(resolveLocale('zh')).toBe('zh');
    expect(localeRedirect('/', 'en')).toBe('/en');
    expect(localeRedirect('/test', 'en')).toBe('/en/test');
    expect(localeRedirect('/en', 'en')).toBeNull();
    expect(localeRedirect('/en/test', 'zh')).toBe('/test');
    expect(localeRedirect('/', 'zh')).toBeNull();
  });

  it('rewrites leftover /zh URLs onto the Chinese default routes', () => {
    expect(localeRedirect('/zh', null)).toBe('/');
    expect(localeRedirect('/zh/test', null)).toBe('/test');
    expect(localeRedirect('/zh', 'en')).toBe('/en');
    expect(localeRedirect('/zh/results', 'zh')).toBe('/results');
  });
});
