import { ACCESS_KEY, type UnlockRecord } from '@/lib/api/contract';

export type { UnlockRecord };

export type PaypalReturn =
  | { kind: 'capture'; orderId: string }
  | { kind: 'none' };

const ORDER_ID = /^[A-Za-z0-9-]{8,36}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** PayPal Orders returns `token=<orderId>`. The old `st=Completed&tx=` query is ignored. */
export function parsePaypalReturn(search: string): PaypalReturn {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const orderId = (params.get('token') ?? params.get('orderId') ?? '').trim();
  if (ORDER_ID.test(orderId)) return { kind: 'capture', orderId };
  return { kind: 'none' };
}

export function readAccess(storage: Pick<Storage, 'getItem'> | undefined): UnlockRecord | null {
  if (!storage) return null;
  let raw: string | null;
  try {
    raw = storage.getItem(ACCESS_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isRecord(parsed) || parsed.version !== 1 || typeof parsed.token !== 'string' || typeof parsed.orderId !== 'string') {
    return null;
  }
  if (!parsed.token.includes('.') || !ORDER_ID.test(parsed.orderId)) return null;
  return {
    version: 1,
    token: parsed.token,
    orderId: parsed.orderId,
    unlockedAt: typeof parsed.unlockedAt === 'string' ? parsed.unlockedAt : '',
  };
}

export function writeAccess(
  storage: Pick<Storage, 'setItem'> | undefined,
  token: string,
  orderId: string,
): UnlockRecord | null {
  if (!storage || !token.includes('.') || !ORDER_ID.test(orderId)) return null;
  const access: UnlockRecord = {
    version: 1,
    token,
    orderId,
    unlockedAt: new Date().toISOString(),
  };
  try {
    storage.setItem(ACCESS_KEY, JSON.stringify(access));
  } catch {
    return null;
  }
  return access;
}

export function clearPaypalQuery(href: string): string {
  const url = new URL(href);
  for (const key of [
    'tx',
    'txn_id',
    'st',
    'payment_status',
    'amt',
    'cc',
    'cm',
    'sig',
    'item_number',
    'token',
    'PayerID',
    'orderId',
  ]) {
    url.searchParams.delete(key);
  }
  const search = url.searchParams.toString();
  return `${url.pathname}${search ? `?${search}` : ''}${url.hash}`;
}
