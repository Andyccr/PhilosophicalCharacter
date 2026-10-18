import { describe, expect, it } from 'vitest';
import { UnlockToken, hashEmail, normalizeEmail } from '../../worker/payment/token';

const SECRET = 'test-unlock-hmac-key-32-bytes-min';

describe('UnlockToken', () => {
  it('round-trips a signed token and rejects tampering', async () => {
    const token = await UnlockToken.sign(SECRET, '5O190127TN364715T', 1_700_000_000_000);
    const claims = await UnlockToken.verify(SECRET, token, 1_700_000_000_000);
    expect(claims?.o).toBe('5O190127TN364715T');
    expect(claims?.v).toBe(1);
    const [payload, sig] = token.split('.');
    expect(await UnlockToken.verify(SECRET, `${payload}.aaaa`, 1_700_000_000_000)).toBeNull();
    expect(await UnlockToken.verify('other-key-other-key-other-key-32', token, 1_700_000_000_000)).toBeNull();
    expect(sig).toBeTruthy();
  });

  it('rejects an expired token', async () => {
    const token = await UnlockToken.sign(SECRET, '5O190127TN364715T', 1_000_000_000_000);
    expect(await UnlockToken.verify(SECRET, token, 2_000_000_000_000)).toBeNull();
  });

  it('hashes emails in a stable, case-insensitive way', async () => {
    expect(normalizeEmail('  PayPal@Example.COM ')).toBe('paypal@example.com');
    expect(await hashEmail('A@b.co')).toBe(await hashEmail('a@b.co'));
    expect(await hashEmail('a@b.co')).not.toBe(await hashEmail('c@d.co'));
  });
});
