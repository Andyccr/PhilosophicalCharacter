import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { profileRequestFromResult } from '@/lib/report/profileRequest';
import type { AssessmentResult } from '@/types/model';
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

  it('renders print-ready HTML from indices after a valid token, without answers', async () => {
    const sampleResult = JSON.parse(
      readFileSync(new URL('./fixtures/report/sample-assessment-result.json', import.meta.url), 'utf8'),
    ) as AssessmentResult;
    const token = await UnlockToken.sign('test-unlock-hmac-key-32-bytes-min', '5O190127TN364715T');
    const missing = await handleApi(new Request('https://example.com/api/report', { method: 'POST' }), env());
    expect(missing.status).toBe(401);

    const body = {
      ...profileRequestFromResult('zh', sampleResult),
      answers: { 'ont-01': 'a', 'age-04': 'c' },
    };
    const started = performance.now();
    const response = await handleApi(
      new Request('https://example.com/api/report', {
        method: 'POST',
        headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
        body: JSON.stringify(body),
      }),
      env(),
    );
    const elapsedMs = performance.now() - started;
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/html');
    expect(response.headers.get('x-robots-tag')).toContain('noindex');
    const html = await response.text();
    expect(html).toContain('宪制的观念论者');
    expect(html).toContain('思想传统相近的哲学家');
    expect(html).toContain('https://example.com/fonts/fonts.css');
    expect(html).toContain('NOEMA · example.com');
    expect(html).not.toContain('andyccr.workers.dev');
    expect(html).toContain('5O190127TN364715T');
    expect(html).not.toContain('ont-01');
    expect(html).not.toContain('age-04');
    expect(elapsedMs).toBeLessThan(50);
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
