import { getPaymentProvider, PREMIUM_PRODUCT } from '@/lib/payment/provider';

/**
 * Checkout destination for `/checkout`.
 *
 * Today this is the hosted PayPal URL from the payment provider module.
 * Orders v2 hook: replace the body of this function (or the bundled script in
 * `CheckoutRedirect.astro`) so `/checkout` POSTs to `/api/checkout` and
 * redirects to the returned approval URL. Keep the page route and pay-button
 * href (`/checkout`, `/en/checkout`) unchanged.
 */
export function checkoutRedirectUrl(): string | null {
  const result = getPaymentProvider().beginCheckout(PREMIUM_PRODUCT.id);
  return result.status === 'redirect' ? result.url : null;
}
