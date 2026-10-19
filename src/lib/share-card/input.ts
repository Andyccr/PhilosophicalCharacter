import { publicFamily } from '@/lib/share-card/catalog';
import { msg } from '@/lib/share-card/copy';
import { WITHHELD_CODE, type ShareCardInput } from '@/lib/share-card/types';
import type { SharedProfile } from '@/lib/sharing/link';
import type { Locale } from '@/types/model';

function badgeLabel(locale: Locale, status: ShareCardInput['status']): string {
  const raw =
    status === 'definitive' ? msg(locale, 'definitive') : status === 'provisional' ? msg(locale, 'provisional') : msg(locale, 'withheld');
  return locale === 'en' ? raw.toUpperCase() : raw;
}

/**
 * Build the card from a parsed share link plus public catalog text.
 * Axis indices stay off the card (they are paid-only under PR #4).
 */
export function buildShareCardInput(profile: SharedProfile, locale: Locale, url: string): ShareCardInput {
  const status = profile.assignment.status;
  const catalog = publicFamily(profile.assignment.code, locale);

  if (status === 'withheld') {
    return {
      locale,
      status,
      badge: badgeLabel(locale, status),
      code: WITHHELD_CODE,
      title: msg(locale, 'withheld'),
      family: '',
      summary: msg(locale, 'withheldBody'),
      url,
      disclaimer: msg(locale, 'cardDisclaimer'),
    };
  }

  return {
    locale,
    status,
    badge: badgeLabel(locale, status),
    code: profile.assignment.code ?? WITHHELD_CODE,
    title: catalog?.typeName ?? msg(locale, 'withheld'),
    family: catalog?.familyName ?? '',
    summary: catalog?.rule ?? '',
    url,
    disclaimer: msg(locale, 'cardDisclaimer'),
  };
}
