import { PREMIUM_PRODUCT } from '@/lib/api/contract';
import { paypalApiBase, type Env } from '../env';

export interface PaypalOrder {
  id: string;
  approvalUrl: string;
}

export interface PaypalCapture {
  orderId: string;
  captureId: string;
  email: string;
  amount: string;
  currency: string;
  status: string;
}

type FetchFn = typeof fetch;

export class PaypalOrders {
  static async create(
    env: Env,
    input: { returnUrl: string; cancelUrl: string },
    fetchImpl: FetchFn = fetch,
  ): Promise<PaypalOrder> {
    const token = await this.accessToken(env, fetchImpl);
    const response = await fetchImpl(`${paypalApiBase(env)}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: { currency_code: PREMIUM_PRODUCT.currency, value: PREMIUM_PRODUCT.amount },
            description: 'NOEMA philosophical profile',
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              brand_name: 'NOEMA',
              user_action: 'PAY_NOW',
              return_url: input.returnUrl,
              cancel_url: input.cancelUrl,
            },
          },
        },
      }),
    });
    const body = (await response.json()) as {
      id?: string;
      links?: Array<{ rel?: string; href?: string }>;
    };
    if (!response.ok || !body.id) {
      throw new PaypalError('create_failed', response.status);
    }
    const approvalUrl =
      body.links?.find((link) => link.rel === 'payer-action')?.href ??
      body.links?.find((link) => link.rel === 'approve')?.href;
    if (!approvalUrl) throw new PaypalError('missing_approval', 502);
    return { id: body.id, approvalUrl };
  }

  static async capture(env: Env, orderId: string, fetchImpl: FetchFn = fetch): Promise<PaypalCapture> {
    const token = await this.accessToken(env, fetchImpl);
    const response = await fetchImpl(`${paypalApiBase(env)}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
        prefer: 'return=representation',
      },
    });
    const body = (await response.json()) as PaypalCaptureBody;
    if (!response.ok) throw new PaypalError('capture_failed', response.status);
    const capture = body.purchase_units?.[0]?.payments?.captures?.[0];
    const status = capture?.status ?? body.status ?? '';
    const amount = capture?.amount;
    const email = body.payer?.email_address ?? '';
    if (!capture?.id || !amount) throw new PaypalError('capture_incomplete', 502);
    return {
      orderId: body.id ?? orderId,
      captureId: capture.id,
      email,
      amount: amount.value ?? '',
      currency: amount.currency_code ?? '',
      status,
    };
  }

  static async accessToken(env: Env, fetchImpl: FetchFn = fetch): Promise<string> {
    const basic = btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`);
    const response = await fetchImpl(`${paypalApiBase(env)}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        authorization: `Basic ${basic}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    const body = (await response.json()) as { access_token?: string };
    if (!response.ok || !body.access_token) throw new PaypalError('oauth_failed', response.status);
    return body.access_token;
  }
}

interface PaypalCaptureBody {
  id?: string;
  status?: string;
  payer?: { email_address?: string };
  purchase_units?: Array<{
    payments?: {
      captures?: Array<{
        id?: string;
        status?: string;
        amount?: { currency_code?: string; value?: string };
      }>;
    };
  }>;
}

export class PaypalError extends Error {
  constructor(
    readonly code: string,
    readonly status: number,
  ) {
    super(code);
    this.name = 'PaypalError';
  }
}
