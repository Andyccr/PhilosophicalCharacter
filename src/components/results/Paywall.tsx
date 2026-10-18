import { useState, type FormEvent } from 'react';
import { messages } from '@/lib/localization/messages';
import { localePath } from '@/lib/localization/path';
import { ApiError, PaymentClient } from '@/lib/payment/client';
import type { Locale } from '@/types/model';

export function Paywall({
  locale,
  notice,
  onUnlocked,
}: {
  locale: Locale;
  notice?: string;
  onUnlocked: (token: string, orderId: string) => void;
}) {
  const m = messages[locale];
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState('');

  async function checkout() {
    setBusy(true);
    setError('');
    try {
      const path = localePath(locale, '/results');
      const created = await PaymentClient.createCheckout({ returnPath: path, cancelPath: path });
      window.location.assign(created.approvalUrl);
    } catch (caught) {
      setBusy(false);
      if (caught instanceof ApiError && caught.status === 503) setError(m.notConfigured);
      else setError(m.unavailable);
    }
  }

  async function restore(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const unlocked = await PaymentClient.restore({ email, orderId });
      onUnlocked(unlocked.token, unlocked.orderId);
    } catch {
      setError(m.restoreFailed);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="no-print mt-10 border border-line p-6" data-testid="paywall">
      <p className="kicker">{m.payKicker}</p>
      <h2 className="serif mt-3 text-3xl">{m.payTitle}</h2>
      <p className="mt-4 max-w-2xl">{m.payBody}</p>
      <p className="mt-3">{m.payPrice}</p>
      {notice && (
        <p className="mt-4 border border-line p-4" role="status">
          {notice}
        </p>
      )}
      {error && (
        <p className="mt-4 border border-line p-4" role="alert">
          {error}
        </p>
      )}
      <button type="button" className="btn mt-6" data-testid="paypal-checkout" disabled={busy} onClick={() => void checkout()}>
        {m.payAction}
      </button>
      <p className="mt-4 max-w-2xl text-sm text-muted">{m.payReturn}</p>
      <form className="mt-8 grid gap-3" data-testid="restore-form" onSubmit={(event) => void restore(event)}>
        <p className="font-medium">{m.restoreTitle}</p>
        <p className="text-sm text-muted">{m.restoreBody}</p>
        <label className="text-sm">
          {m.restoreEmail}
          <input
            className="mt-1 w-full border border-line bg-transparent p-2"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className="text-sm">
          {m.restoreOrder}
          <input
            className="mt-1 w-full border border-line bg-transparent p-2"
            name="orderId"
            value={orderId}
            onChange={(event) => setOrderId(event.target.value)}
            required
          />
        </label>
        <button type="submit" className="btn secondary w-fit" disabled={busy} data-testid="restore-submit">
          {m.restoreAction}
        </button>
      </form>
    </section>
  );
}
