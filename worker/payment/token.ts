export interface TokenClaims {
  v: 1;
  o: string;
  iat: number;
  exp: number;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const TOKEN_TTL_SECONDS = 180 * 24 * 60 * 60;

export class UnlockToken {
  static async sign(secret: string, orderId: string, now = Date.now()): Promise<string> {
    const claims: TokenClaims = {
      v: 1,
      o: orderId,
      iat: Math.floor(now / 1000),
      exp: Math.floor(now / 1000) + TOKEN_TTL_SECONDS,
    };
    const payload = b64url(encoder.encode(JSON.stringify(claims)));
    const signature = await hmac(secret, payload);
    return `${payload}.${b64url(signature)}`;
  }

  static async verify(secret: string, token: string, now = Date.now()): Promise<TokenClaims | null> {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [payload, sig] = parts;
    if (!payload || !sig) return null;
    let expected: ArrayBuffer;
    try {
      expected = await hmac(secret, payload);
    } catch {
      return null;
    }
    let provided: Uint8Array;
    try {
      provided = b64urlDecode(sig);
    } catch {
      return null;
    }
    if (!(await macEqual(new Uint8Array(expected), provided))) return null;
    let claims: TokenClaims;
    try {
      claims = JSON.parse(decoder.decode(b64urlDecode(payload))) as TokenClaims;
    } catch {
      return null;
    }
    if (claims.v !== 1 || typeof claims.o !== 'string' || !ORDER_ID.test(claims.o)) return null;
    if (typeof claims.exp !== 'number' || claims.exp * 1000 <= now) return null;
    if (typeof claims.iat !== 'number') return null;
    return claims;
  }
}

export const ORDER_ID = /^[A-Za-z0-9-]{8,36}$/;

async function hmac(secret: string, payload: string): Promise<ArrayBuffer> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return crypto.subtle.sign('HMAC', key, encoder.encode(payload));
}

async function macEqual(expected: Uint8Array, provided: Uint8Array): Promise<boolean> {
  const [left, right] = await Promise.all([sha256(expected), sha256(provided)]);
  const a = new Uint8Array(left);
  const b = new Uint8Array(right);
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i]! ^ b[i]!;
  return diff === 0;
}

function sha256(bytes: Uint8Array): Promise<ArrayBuffer> {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return crypto.subtle.digest('SHA-256', copy);
}

function b64url(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let bin = '';
  for (let i = 0; i < view.length; i += 1) bin += String.fromCharCode(view[i]!);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function b64urlDecode(value: string): Uint8Array {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '=='.slice((value.length + 3) % 4);
  const bin = atob(padded);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
  return out;
}

export async function hashEmail(email: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(normalizeEmail(email)));
  return b64url(digest);
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
