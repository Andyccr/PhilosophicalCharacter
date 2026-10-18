import { useEffect, useState } from 'react';
import { FreePreview } from '@/components/results/FreePreview';
import { LockedReport } from '@/components/results/LockedReport';
import { Paywall } from '@/components/results/Paywall';
import type { PaidProfile, ProfileRequest, UnlockRecord } from '@/lib/api/contract';
import { freePreview } from '@/lib/interpretation/preview';
import { messages } from '@/lib/localization/messages';
import { localePath } from '@/lib/localization/path';
import { readAccess, writeAccess } from '@/lib/payment/access';
import { PaymentClient } from '@/lib/payment/client';
import { buildShareCardInput } from '@/lib/share-card/input';
import { runtimeShareCardHost } from '@/lib/share-card/host';
import { DIMENSION_IDS, scoringConfig } from '@/lib/scoring/config';
import { scoreAssessment } from '@/lib/scoring/score';
import { browserStorage, readSession } from '@/lib/storage/session';
import type { SharedProfile } from '@/lib/sharing/link';
import type { AssessmentResult, Locale } from '@/types/model';

function profileFromResult(result: AssessmentResult): SharedProfile {
  return {
    scores: Object.fromEntries(DIMENSION_IDS.map((id) => [id, result.dimensions[id].score])) as SharedProfile['scores'],
    disagreement: Object.fromEntries(
      DIMENSION_IDS.map((id) => [id, (result.dimensions[id].inconsistency ?? 0) >= scoringConfig.inconsistencyMixed]),
    ) as SharedProfile['disagreement'],
    assignment: result.assignment,
  };
}

export function PremiumPreview({ locale }: { locale: Locale }) {
  const m = messages[locale];
  const [ready, setReady] = useState(false);
  const [access, setAccess] = useState<UnlockRecord | null>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [paid, setPaid] = useState<PaidProfile | null>(null);

  useEffect(() => {
    const storage = browserStorage();
    setAccess(readAccess(storage));
    const stored = readSession(storage);
    if (stored.ok) setResult(scoreAssessment(stored.session.answers));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!access || !result) {
      setPaid(null);
      return;
    }
    const body: ProfileRequest = {
      locale,
      assignment: result.assignment,
      dimensions: Object.fromEntries(
        DIMENSION_IDS.map((id) => [
          id,
          {
            score: result.dimensions[id].score,
            inclination: result.dimensions[id].inclination,
            inconsistency: result.dimensions[id].inconsistency,
            directionalCount: result.dimensions[id].directionalCount,
            applicableCount: result.dimensions[id].applicableCount,
          },
        ]),
      ) as ProfileRequest['dimensions'],
      tensionIds: result.tensions.map((tension) => tension.id),
    };
    let cancelled = false;
    void PaymentClient.fetchProfile(access.token, body).then((profile) => {
      if (!cancelled) setPaid(profile);
    });
    return () => {
      cancelled = true;
    };
  }, [access, locale, result]);

  if (!ready) return <p className="mx-auto max-w-3xl px-4 py-16">{m.loading}</p>;
  if (!access) {
    return (
      <article className="mx-auto max-w-3xl px-4 py-12">
        <Paywall
          locale={locale}
          onUnlocked={(token, orderId) => setAccess(writeAccess(browserStorage(), token, orderId))}
        />
      </article>
    );
  }
  if (!result) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="serif text-4xl">{m.noResultTitle}</h1>
        <p className="mt-4">{m.noResultBody}</p>
        <a className="btn mt-6" href={localePath(locale, '/test')}>
          {m.start}
        </a>
      </section>
    );
  }

  const preview = freePreview(locale, result.assignment, m.withheldBody);
  const card = buildShareCardInput(profileFromResult(result), locale, runtimeShareCardHost());
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <p className="kicker">{m.premiumTitle}</p>
      <FreePreview locale={locale} preview={preview} card={card} />
      {paid && <LockedReport locale={locale} profile={paid} />}
    </article>
  );
}
