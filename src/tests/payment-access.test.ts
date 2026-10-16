import { describe, expect, it } from 'vitest';
import { clearPaypalQuery, parsePaypalReturn, readAccess, writeAccess } from '@/lib/payment/access';

function memory() {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
  };
}

describe('PayPal return', () => {
  it('ignores a normal visit and a pending payment', () => {
    expect(parsePaypalReturn('')).toEqual({ ok: false, reason: 'absent' });
    expect(parsePaypalReturn('?st=Pending&tx=8K123456789012345')).toEqual({ ok: false, reason: 'not_completed' });
    expect(parsePaypalReturn('?st=Completed')).toEqual({ ok: false, reason: 'incomplete' });
    expect(parsePaypalReturn('?paid=1')).toEqual({ ok: false, reason: 'absent' });
  });

  it('accepts a completed transaction id and stores only that', () => {
    const parsed = parsePaypalReturn('?tx=8K123456789012345&st=Completed&amt=4.99&cc=EUR');
    expect(parsed).toEqual({ ok: true, transactionId: '8K123456789012345' });
    const storage = memory();
    const access = writeAccess(storage, '8K123456789012345');
    expect(access?.status).toBe('Completed');
    expect(readAccess(storage)?.transactionId).toBe('8K123456789012345');
    expect(clearPaypalQuery('https://noema.example/results?tx=8K123456789012345&st=Completed#v=1')).toBe('/results#v=1');
  });
});
