import { messages } from '@/lib/localization/messages';
import { localePath } from '@/lib/localization/path';
import type { Locale } from '@/types/model';

export function Paywall({ locale, notice }: { locale: Locale; notice?: string }) {
  const m = messages[locale];
  return (
    <section className="mx-auto max-w-3xl px-4 py-16" data-testid="paywall">
      <p className="kicker">{m.payKicker}</p>
      <h1 className="serif mt-4 text-4xl leading-tight md:text-6xl">{m.payTitle}</h1>
      <p className="mt-6 max-w-2xl text-lg">{m.payBody}</p>
      <p className="mt-4">{m.payPrice}</p>
      {notice && (
        <p className="mt-4 border border-line p-4" role="status">
          {notice}
        </p>
      )}
      <a className="btn mt-8" data-testid="paypal-checkout" href={localePath(locale, '/checkout')}>
        {m.payAction}
      </a>
      <p className="mt-6 max-w-2xl text-sm text-muted">{m.payReturn}</p>
      <p className="mt-3 text-sm">{m.notDiagnosis}</p>
    </section>
  );
}
