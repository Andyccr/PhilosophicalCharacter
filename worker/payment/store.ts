import type { PurchaseKV } from '../env';
import { ORDER_ID } from './token';

export interface PurchaseRecord {
  provider: 'paypal';
  orderId: string;
  captureId: string;
  emailHash: string;
  amount: string;
  currency: 'EUR';
  createdAt: string;
  live: boolean;
}

export class PurchaseStore {
  static orderKey(orderId: string): string {
    return `order:${orderId}`;
  }

  static payerKey(emailHash: string): string {
    return `payer:${emailHash}`;
  }

  static async get(kv: PurchaseKV, orderId: string): Promise<PurchaseRecord | null> {
    if (!ORDER_ID.test(orderId)) return null;
    const raw = await kv.get(this.orderKey(orderId));
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as PurchaseRecord;
      if (parsed.provider !== 'paypal' || parsed.orderId !== orderId) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  static async put(kv: PurchaseKV, record: PurchaseRecord): Promise<void> {
    await kv.put(this.orderKey(record.orderId), JSON.stringify(record));
    const payerKey = this.payerKey(record.emailHash);
    const existing = await kv.get(payerKey);
    let orderIds: string[] = [];
    if (existing) {
      try {
        const parsed = JSON.parse(existing) as unknown;
        if (Array.isArray(parsed)) orderIds = parsed.filter((item): item is string => typeof item === 'string');
      } catch {
        orderIds = [];
      }
    }
    if (!orderIds.includes(record.orderId)) orderIds.push(record.orderId);
    await kv.put(payerKey, JSON.stringify(orderIds));
  }
}
