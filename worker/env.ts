export interface PurchaseKV {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

export interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  PURCHASES: PurchaseKV;
  PAYPAL_CLIENT_ID: string;
  PAYPAL_CLIENT_SECRET: string;
  UNLOCK_HMAC_KEY: string;
  /** `sandbox` (default) or `live`. Ignored unless PAYMENTS_LIVE is `true`. */
  PAYPAL_ENV?: string;
  /** Must be the string `true` to use live PayPal. Defaults to off. */
  PAYMENTS_LIVE?: string;
}

export function paymentsAreLive(env: Env): boolean {
  return env.PAYMENTS_LIVE === 'true' && env.PAYPAL_ENV === 'live';
}

export function paypalApiBase(env: Env): string {
  return paymentsAreLive(env) ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
}

export function secretsReady(env: Env): boolean {
  return Boolean(env.PAYPAL_CLIENT_ID && env.PAYPAL_CLIENT_SECRET && env.UNLOCK_HMAC_KEY);
}
