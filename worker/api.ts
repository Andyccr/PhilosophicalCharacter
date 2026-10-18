import { API, PREMIUM_PRODUCT, type ProfileRequest } from '@/lib/api/contract';
import { DIMENSION_IDS } from '@/lib/scoring/config';
import { PaidContent } from './content/profile';
import { paymentsAreLive, secretsReady, type Env } from './env';
import { PaymentError, PaymentProvider } from './payment/provider';
import { ORDER_ID, UnlockToken } from './payment/token';
import type { Assignment, Inclination, Locale } from '@/types/model';

const MAX_BODY = 32_768;
const INCLINATIONS: Inclination[] = ['left', 'right', 'mixed', 'insufficient'];

export async function handleApi(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors() });
  try {
    if (path === API.checkout && request.method === 'POST') return await checkout(request, env);
    if (path === API.capture && request.method === 'POST') return await capture(request, env);
    if (path === API.profile && request.method === 'POST') return await profile(request, env);
    if (path === API.restore && request.method === 'POST') return await restore(request, env);
    if (path === API.reportPdf && request.method === 'GET') return await reportPdf(request, env, url);
    return json({ error: 'not_found' }, 404);
  } catch (error) {
    if (error instanceof PaymentError) return json({ error: error.code }, error.status);
    return json({ error: 'internal' }, 500);
  }
}

async function checkout(request: Request, env: Env): Promise<Response> {
  if (!secretsReady(env)) return json({ error: 'not_configured', message: 'PayPal secrets are not set.' }, 503);
  const body = await readJson(request);
  const origin = requestOrigin(request);
  const returnPath = safePath(asString(body.returnPath), '/results');
  const cancelPath = safePath(asString(body.cancelPath), returnPath);
  const created = await PaymentProvider.createCheckout(env, {
    returnUrl: `${origin}${returnPath}`,
    cancelUrl: `${origin}${cancelPath}`,
  });
  return json({
    orderId: created.orderId,
    approvalUrl: created.approvalUrl,
    live: created.live,
  });
}

async function capture(request: Request, env: Env): Promise<Response> {
  if (!secretsReady(env)) return json({ error: 'not_configured' }, 503);
  const body = await readJson(request);
  const orderId = asString(body.orderId);
  const unlocked = await PaymentProvider.capture(env, orderId);
  return json({ token: unlocked.token, orderId: unlocked.record.orderId, expiresAt: unlocked.expiresAt });
}

async function profile(request: Request, env: Env): Promise<Response> {
  const claims = await requireToken(request, env);
  if (!claims) return json({ error: 'unauthorized' }, 401);
  const parsed = parseProfileRequest(await readJson(request));
  if (!parsed) return json({ error: 'invalid_profile' }, 400);
  return json(PaidContent.assemble(parsed));
}

async function restore(request: Request, env: Env): Promise<Response> {
  if (!secretsReady(env)) return json({ error: 'not_configured' }, 503);
  const body = await readJson(request);
  const unlocked = await PaymentProvider.restore(env, asString(body.email), asString(body.orderId));
  if (!unlocked) return json({ error: 'not_found' }, 404);
  return json({ token: unlocked.token, orderId: unlocked.record.orderId, expiresAt: unlocked.expiresAt });
}

async function reportPdf(request: Request, env: Env, url: URL): Promise<Response> {
  const claims = await requireToken(request, env);
  if (!claims) return json({ error: 'unauthorized' }, 401);
  const lang = url.searchParams.get('lang') === 'en' ? 'en' : 'zh';
  return json(
    {
      error: 'not_implemented',
      delivery: 'print',
      lang,
      product: PREMIUM_PRODUCT.id,
      live: paymentsAreLive(env),
      message: 'The paid report is JSON plus a print stylesheet. The Worker does not generate PDF.',
    },
    501,
  );
}

async function requireToken(request: Request, env: Env) {
  if (!env.UNLOCK_HMAC_KEY) return null;
  const header = request.headers.get('authorization') ?? '';
  const match = /^Bearer\s+(\S+)$/i.exec(header);
  if (!match?.[1]) return null;
  return UnlockToken.verify(env.UNLOCK_HMAC_KEY, match[1]);
}

async function readJson(request: Request): Promise<Record<string, unknown>> {
  const length = Number(request.headers.get('content-length') ?? '0');
  if (length > MAX_BODY) throw new PaymentError('payload_too_large', 413);
  const text = await request.text();
  if (text.length > MAX_BODY) throw new PaymentError('payload_too_large', 413);
  if (!text) return {};
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new PaymentError('invalid_json', 400);
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new PaymentError('invalid_json', 400);
  return parsed as Record<string, unknown>;
}

function parseProfileRequest(body: Record<string, unknown>): ProfileRequest | null {
  const locale: Locale | null = body.locale === 'en' ? 'en' : body.locale === 'zh' ? 'zh' : null;
  if (!locale) return null;
  const assignment = parseAssignment(body.assignment);
  if (!assignment) return null;
  const rawDimensions = body.dimensions;
  if (!isRecord(rawDimensions)) return null;
  const dimensions = {} as ProfileRequest['dimensions'];
  for (const id of DIMENSION_IDS) {
    const row = rawDimensions[id];
    if (!isRecord(row)) return null;
    const inclination = row.inclination;
    if (typeof inclination !== 'string' || !INCLINATIONS.includes(inclination as Inclination)) return null;
    dimensions[id] = {
      score: row.score === null || typeof row.score === 'number' ? (row.score as number | null) : null,
      inclination: inclination as Inclination,
      inconsistency: typeof row.inconsistency === 'number' ? row.inconsistency : null,
      directionalCount: numberOrZero(row.directionalCount),
      applicableCount: numberOrZero(row.applicableCount),
    };
  }
  const tensionIds = Array.isArray(body.tensionIds)
    ? body.tensionIds.filter((id): id is string => typeof id === 'string' && id.length < 80).slice(0, 16)
    : [];
  return { locale, assignment, dimensions, tensionIds };
}

function parseAssignment(value: unknown): Assignment | null {
  if (!isRecord(value)) return null;
  const status = value.status;
  if (status !== 'definitive' && status !== 'provisional' && status !== 'withheld') return null;
  const code = value.code === null || typeof value.code === 'string' ? (value.code as string | null) : null;
  const reasons = Array.isArray(value.reasons)
    ? value.reasons.filter(isRecord).map((reason) => ({
        en: asString(reason.en),
        zh: asString(reason.zh),
      }))
    : [];
  return { status, code, reasons };
}

function requestOrigin(request: Request): string {
  const url = new URL(request.url);
  const origin = request.headers.get('origin');
  if (origin) {
    try {
      const parsed = new URL(origin);
      if (parsed.protocol === 'https:' || parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
        return parsed.origin;
      }
    } catch {
      /* use request origin */
    }
  }
  return url.origin;
}

function safePath(path: string, fallback: string): string {
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('://') || path.includes('\\')) return fallback;
  return path;
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function numberOrZero(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...cors(),
    },
  });
}

function cors(): Record<string, string> {
  return {
    'access-control-allow-headers': 'authorization, content-type',
    'access-control-allow-methods': 'GET, POST, OPTIONS',
  };
}

export { ORDER_ID };
