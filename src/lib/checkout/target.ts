import { localePath } from '@/lib/localization/path';
import type { Locale } from '@/types/model';

/**
 * Paths the Worker PayPal order should return to after approval or cancel.
 * `/checkout` itself only starts the order; unlock happens on `/results`.
 */
export function checkoutReturnPath(locale: Locale): string {
  return localePath(locale, '/results');
}

export function checkoutCancelPath(locale: Locale): string {
  return localePath(locale, '/results');
}
