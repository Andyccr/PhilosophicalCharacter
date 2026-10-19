import { PREMIUM_PRODUCT } from '@/lib/api/contract';
import { PaymentClient } from '@/lib/payment/client';
import type { CheckoutResult } from '@/types/model';

export { PREMIUM_PRODUCT };

export async function beginCheckout(returnPath: string, cancelPath = returnPath): Promise<CheckoutResult> {
  try {
    const created = await PaymentClient.createCheckout({ returnPath, cancelPath });
    return { status: 'redirect', url: created.approvalUrl };
  } catch (error) {
    const status = error instanceof Error && 'status' in error ? Number(error.status) : 0;
    if (status === 503) return { status: 'not_configured', messageKey: 'notConfigured' };
    return { status: 'unavailable', messageKey: 'unavailable' };
  }
}
