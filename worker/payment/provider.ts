import { PREMIUM_PRODUCT } from '@/lib/api/contract';
import { paymentsAreLive, secretsReady, type Env } from '../env';
import { PaypalError, PaypalOrders } from './paypal';
import { PurchaseStore, type PurchaseRecord } from './store';
import { ORDER_ID, UnlockToken, hashEmail, normalizeEmail } from './token';

export interface VerifiedPurchase {
  record: PurchaseRecord;
  token: string;
  expiresAt: string;
}

/**
 * Single payment façade. Callers talk only to this class.
 * Lemon Squeezy later: add `static async handleWebhook(env, request)` and
 * branch on provider inside restore; do not change route handlers otherwise.
 */
export class PaymentProvider {
  static readonly id = 'paypal-orders' as const;

  static isConfigured(env: Env): boolean {
    return secretsReady(env);
  }

  static async createCheckout(
    env: Env,
    input: { returnUrl: string; cancelUrl: string },
  ): Promise<{ orderId: string; approvalUrl: string; live: boolean }> {
    if (!this.isConfigured(env)) throw new PaymentError('not_configured', 503);
    const order = await PaypalOrders.create(env, input);
    return { orderId: order.id, approvalUrl: order.approvalUrl, live: paymentsAreLive(env) };
  }

  static async capture(env: Env, orderId: string): Promise<VerifiedPurchase> {
    if (!this.isConfigured(env)) throw new PaymentError('not_configured', 503);
    if (!ORDER_ID.test(orderId)) throw new PaymentError('invalid_order', 400);
    const existing = await PurchaseStore.get(env.PURCHASES, orderId);
    if (existing) return this.issue(env, existing);
    let captured;
    try {
      captured = await PaypalOrders.capture(env, orderId);
    } catch (error) {
      if (error instanceof PaypalError) throw new PaymentError(error.code, error.status >= 500 ? 502 : 409);
      throw error;
    }
    if (captured.status !== 'COMPLETED') throw new PaymentError('not_completed', 409);
    if (captured.currency !== PREMIUM_PRODUCT.currency || captured.amount !== PREMIUM_PRODUCT.amount) {
      throw new PaymentError('amount_mismatch', 409);
    }
    const email = normalizeEmail(captured.email);
    if (!email || !email.includes('@')) throw new PaymentError('missing_payer', 409);
    const record: PurchaseRecord = {
      provider: 'paypal',
      orderId: captured.orderId,
      captureId: captured.captureId,
      emailHash: await hashEmail(email),
      amount: captured.amount,
      currency: 'EUR',
      createdAt: new Date().toISOString(),
      live: paymentsAreLive(env),
    };
    await PurchaseStore.put(env.PURCHASES, record);
    return this.issue(env, record);
  }

  /**
   * Restore requires both the PayPal payer email and the order id. The Worker
   * never sends email. A matching pair re-issues a token; mismatches return
   * the same 404 as an unknown order.
   */
  static async restore(env: Env, email: string, orderId: string): Promise<VerifiedPurchase | null> {
    if (!this.isConfigured(env)) throw new PaymentError('not_configured', 503);
    if (!ORDER_ID.test(orderId) || !normalizeEmail(email).includes('@')) return null;
    const record = await PurchaseStore.get(env.PURCHASES, orderId);
    if (!record) return null;
    const emailHash = await hashEmail(email);
    if (!(await hashesMatch(emailHash, record.emailHash))) return null;
    return this.issue(env, record);
  }

  static async issue(env: Env, record: PurchaseRecord): Promise<VerifiedPurchase> {
    const token = await UnlockToken.sign(env.UNLOCK_HMAC_KEY, record.orderId);
    const claims = await UnlockToken.verify(env.UNLOCK_HMAC_KEY, token);
    return {
      record,
      token,
      expiresAt: claims ? new Date(claims.exp * 1000).toISOString() : '',
    };
  }
}

export class PaymentError extends Error {
  constructor(
    readonly code: string,
    readonly status: number,
  ) {
    super(code);
    this.name = 'PaymentError';
  }
}

async function hashesMatch(left: string, right: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(left)),
    crypto.subtle.digest('SHA-256', encoder.encode(right)),
  ]);
  const x = new Uint8Array(a);
  const y = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < x.length; i += 1) diff |= x[i]! ^ y[i]!;
  return diff === 0;
}
