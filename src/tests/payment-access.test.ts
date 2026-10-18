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
  it('ignores a normal visit, a pending hosted-link leftover, and a forged Completed tx', () => {
    expect(parsePaypalReturn('')).toEqual({ kind: 'none' });
    expect(parsePaypalReturn('?st=Pending&tx=8K123456789012345')).toEqual({ kind: 'none' });
    expect(parsePaypalReturn('?st=Completed&tx=8K123456789012345&amt=4.99&cc=EUR')).toEqual({ kind: 'none' });
    expect(parsePaypalReturn('?paid=1')).toEqual({ kind: 'none' });
  });

  it('extracts a PayPal order id for server capture and does not store it as access', () => {
    expect(parsePaypalReturn('?token=5O190127TN364715T&PayerID=ABC')).toEqual({
      kind: 'capture',
      orderId: '5O190127TN364715T',
    });
    const storage = memory();
    expect(readAccess(storage)).toBeNull();
    expect(clearPaypalQuery('https://noema.example/results?token=5O190127TN364715T&PayerID=ABC#v=1')).toBe('/results#v=1');
  });

  it('stores only a signed token pair, never a Completed status', () => {
    const storage = memory();
    const access = writeAccess(storage, 'aaa.bbb', '5O190127TN364715T');
    expect(access?.token).toBe('aaa.bbb');
    expect(readAccess(storage)?.orderId).toBe('5O190127TN364715T');
    expect(JSON.stringify(readAccess(storage))).not.toContain('Completed');
  });
});
