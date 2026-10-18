import {
  API,
  authorizationHeader,
  type CaptureRequest,
  type CreateCheckoutRequest,
  type CreateCheckoutResponse,
  type PaidProfile,
  type ProfileRequest,
  type RestoreRequest,
  type UnlockResponse,
} from '@/lib/api/contract';

export class PaymentClient {
  static async createCheckout(input: CreateCheckoutRequest): Promise<CreateCheckoutResponse> {
    return this.post<CreateCheckoutResponse>(API.checkout, input);
  }

  static async capture(input: CaptureRequest): Promise<UnlockResponse> {
    return this.post<UnlockResponse>(API.capture, input);
  }

  static async restore(input: RestoreRequest): Promise<UnlockResponse> {
    return this.post<UnlockResponse>(API.restore, input);
  }

  static async fetchProfile(token: string, body: ProfileRequest): Promise<PaidProfile> {
    const response = await fetch(API.profile, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...authorizationHeader(token) },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new ApiError(response.status, await readError(response));
    return (await response.json()) as PaidProfile;
  }

  static async reportPdfStatus(token: string, lang: 'en' | 'zh'): Promise<number> {
    const response = await fetch(`${API.reportPdf}?lang=${lang}`, {
      headers: authorizationHeader(token),
    });
    return response.status;
  }

  private static async post<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(path, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new ApiError(response.status, await readError(response));
    return (await response.json()) as T;
  }
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
  ) {
    super(code);
    this.name = 'ApiError';
  }
}

async function readError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string };
    return body.error ?? `http_${response.status}`;
  } catch {
    return `http_${response.status}`;
  }
}
