import { describe, expect, it } from 'vitest';
import { handleApi } from '../../worker/api';
import type { Env } from '../../worker/env';
import { UnlockToken } from '../../worker/payment/token';

function env(): Env {
  return {
    ASSETS: { fetch: async () => new Response(null, { status: 404 }) },
    PURCHASES: {
      get: async () => null,
      put: async () => undefined,
    },
    PAYPAL_CLIENT_ID: 'client',
    PAYPAL_CLIENT_SECRET: 'secret',
    UNLOCK_HMAC_KEY: 'test-unlock-hmac-key-32-bytes-min',
    PAYPAL_ENV: 'sandbox',
    PAYMENTS_LIVE: 'false',
  };
}

describe('Worker API routes', () => {
  it('rejects report.pdf without a token and stubs it with 501 after a valid token', async () => {
    const missing = await handleApi(new Request('https://example.com/api/report.pdf?lang=en'), env());
    expect(missing.status).toBe(401);
    const token = await UnlockToken.sign('test-unlock-hmac-key-32-bytes-min', '5O190127TN364715T');
    const stub = await handleApi(
      new Request('https://example.com/api/report.pdf?lang=zh', {
        headers: { authorization: `Bearer ${token}` },
      }),
      env(),
    );
    expect(stub.status).toBe(501);
    const body = (await stub.json()) as { error: string; delivery: string; lang: string };
    expect(body.error).toBe('not_implemented');
    expect(body.delivery).toBe('print');
    expect(body.lang).toBe('zh');
  });

  it('does not read or set cookies', async () => {
    const token = await UnlockToken.sign('test-unlock-hmac-key-32-bytes-min', '5O190127TN364715T');
    const response = await handleApi(
      new Request('https://example.com/api/report.pdf?lang=en', {
        headers: { authorization: `Bearer ${token}`, cookie: 'should-be-ignored=1' },
      }),
      env(),
    );
    expect(response.headers.get('set-cookie')).toBeNull();
  });
});
