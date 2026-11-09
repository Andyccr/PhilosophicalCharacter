import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('public/_headers', () => {
  const headers = readFileSync(resolve(process.cwd(), 'public/_headers'), 'utf8');
  const csp = headers.split('\n').find((line) => line.includes('Content-Security-Policy')) ?? '';

  it('allows Astro inline hydration scripts so /test can render questions', () => {
    expect(csp).toMatch(/script-src[^;]*'self'[^;]*'unsafe-inline'/);
  });
});
