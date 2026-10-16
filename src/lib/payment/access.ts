export const ACCESS_KEY = 'noema.access.v1';

export interface PaymentAccess {
  transactionId: string;
  status: 'Completed';
  unlockedAt: string;
}

export type PaypalReturn =
  | { ok: true; transactionId: string }
  | { ok: false; reason: 'absent' | 'incomplete' | 'not_completed' };

const TX_ID = /^[A-Za-z0-9]{10,30}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parsePaypalReturn(search: string): PaypalReturn {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const status = (params.get('st') ?? params.get('payment_status') ?? '').trim();
  const transactionId = (params.get('tx') ?? params.get('txn_id') ?? '').trim();
  if (!status && !transactionId) return { ok: false, reason: 'absent' };
  if (status.toLowerCase() !== 'completed') return { ok: false, reason: 'not_completed' };
  if (!TX_ID.test(transactionId)) return { ok: false, reason: 'incomplete' };
  return { ok: true, transactionId };
}

export function readAccess(storage: Pick<Storage, 'getItem'> | undefined): PaymentAccess | null {
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
  if (!isRecord(parsed) || parsed.status !== 'Completed' || typeof parsed.transactionId !== 'string') return null;
  if (!TX_ID.test(parsed.transactionId)) return null;
  return {
    transactionId: parsed.transactionId,
    status: 'Completed',
    unlockedAt: typeof parsed.unlockedAt === 'string' ? parsed.unlockedAt : '',
  };
}

export function writeAccess(
  storage: Pick<Storage, 'setItem'> | undefined,
  transactionId: string,
): PaymentAccess | null {
  if (!storage || !TX_ID.test(transactionId)) return null;
  const access: PaymentAccess = {
    transactionId,
    status: 'Completed',
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
  for (const key of ['tx', 'txn_id', 'st', 'payment_status', 'amt', 'cc', 'cm', 'sig', 'item_number']) {
    url.searchParams.delete(key);
  }
  const search = url.searchParams.toString();
  return `${url.pathname}${search ? `?${search}` : ''}${url.hash}`;
}
