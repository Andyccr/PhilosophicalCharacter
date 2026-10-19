import { afterEach, describe, expect, it, vi } from 'vitest';
import { PREMIUM_PRODUCT } from '@/lib/api/contract';
import type { Env } from '../../worker/env';
import { PaymentProvider } from '../../worker/payment/provider';
import { PaypalOrders } from '../../worker/payment/paypal';

function kv() {
  const data = new Map<string, string>();
  return {
    get: async (key: string) => data.get(key) ?? null,
    put: async (key: string, value: string) => {
      data.set(key, value);
    },
    data,
  };
}

function env(store = kv()): Env {
  return {
    ASSETS: { fetch: async () => new Response(null, { status: 404 }) },
    PURCHASES: store,
    PAYPAL_CLIENT_ID: 'client',
    PAYPAL_CLIENT_SECRET: 'secret',
    UNLOCK_HMAC_KEY: 'test-unlock-hmac-key-32-bytes-min',
    PAYPAL_ENV: 'sandbox',
    PAYMENTS_LIVE: 'false',
  };
}

describe('PaymentProvider (PayPal mocked)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates a sandbox order and does not use the live API while PAYMENTS_LIVE is false', async () => {
    const fetchImpl = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      expect(url).toContain('api-m.sandbox.paypal.com');
      expect(url).not.toContain('api-m.paypal.com/v');
      if (url.endsWith('/v1/oauth2/token')) {
        return Response.json({ access_token: 'access' });
      }
      return Response.json({
        id: '5O190127TN364715T',
        links: [{ rel: 'payer-action', href: 'https://www.paypal.com/checkoutnow?token=5O190127TN364715T' }],
      });
    });
    vi.spyOn(globalThis, 'fetch').mockImplementation(fetchImpl);
    const created = await PaymentProvider.createCheckout(env(), {
      returnUrl: 'https://example.com/results',
      cancelUrl: 'https://example.com/results',
    });
    expect(created.live).toBe(false);
    expect(created.orderId).toBe('5O190127TN364715T');
    expect(created.approvalUrl).toContain('paypal.com');
  });

  it('captures a completed EUR 4.99 order, records it, and issues a token', async () => {
    vi.spyOn(PaypalOrders, 'capture').mockResolvedValue({
      orderId: '5O190127TN364715T',
      captureId: 'CAP-1',
      email: 'Buyer@Example.com',
      amount: PREMIUM_PRODUCT.amount,
      currency: PREMIUM_PRODUCT.currency,
      status: 'COMPLETED',
    });
    const store = kv();
    const unlocked = await PaymentProvider.capture(env(store), '5O190127TN364715T');
    expect(unlocked.token.includes('.')).toBe(true);
    expect(store.data.get('order:5O190127TN364715T')).toContain('CAP-1');
    const restored = await PaymentProvider.restore(env(store), 'buyer@example.com', '5O190127TN364715T');
    expect(restored?.record.orderId).toBe('5O190127TN364715T');
    expect(await PaymentProvider.restore(env(store), 'other@example.com', '5O190127TN364715T')).toBeNull();
  });

  it('refuses a completed capture with the wrong amount', async () => {
    vi.spyOn(PaypalOrders, 'capture').mockResolvedValue({
      orderId: '5O190127TN364715T',
      captureId: 'CAP-1',
      email: 'buyer@example.com',
      amount: '1.00',
      currency: 'EUR',
      status: 'COMPLETED',
    });
    await expect(PaymentProvider.capture(env(), '5O190127TN364715T')).rejects.toMatchObject({ code: 'amount_mismatch' });
  });
});
