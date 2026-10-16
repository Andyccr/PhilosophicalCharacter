import type { CheckoutResult, PaymentProvider } from '@/types/model';

export const PREMIUM_PRODUCT = {
  id: 'noema-report',
  priceEur: 4.99,
  currency: 'EUR' as const,
};

/** Public PayPal hosted checkout. This is not an API secret. */
export const PAYPAL_CHECKOUT_URL = 'https://www.paypal.com/ncp/payment/RXABC8JDX86YQ';

const redirect: CheckoutResult = { status: 'redirect', url: PAYPAL_CHECKOUT_URL };

export const paypalProvider: PaymentProvider = {
  id: 'paypal-ncp',
  isConfigured: () => true,
  beginCheckout: () => redirect,
};

export function getPaymentProvider(): PaymentProvider {
  return paypalProvider;
}
