import { useEffect, useState } from 'react';
import { getArchetype } from '@/data/archetypes';
import { dimensions } from '@/data/dimensions';
import { getTensionRule } from '@/data/tensions/rules';
import { readings } from '@/data/readings';
import { Paywall } from '@/components/results/Paywall';
import { narrativeFor } from '@/lib/interpretation/describe';
import { messages } from '@/lib/localization/messages';
import { localePath } from '@/lib/localization/path';
import { readAccess } from '@/lib/payment/access';
import { DIMENSION_IDS } from '@/lib/scoring/config';
import { scoreAssessment } from '@/lib/scoring/score';
import { browserStorage, readSession } from '@/lib/storage/session';
import type { AssessmentResult, Locale } from '@/types/model';

export function PremiumPreview({ locale }: { locale: Locale }) {
  const m = messages[locale];
  const [ready, setReady] = useState(false);
  const [paid, setPaid] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  useEffect(() => {
    const storage = browserStorage();
    setPaid(readAccess(storage) !== null);
    const stored = readSession(storage);
    if (stored.ok) setResult(scoreAssessment(stored.session.answers));
    setReady(true);
  }, []);

  if (!ready) return <p className="mx-auto max-w-3xl px-4 py-16">{m.loading}</p>;
  if (!paid) return <Paywall locale={locale} />;
  if (!result) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="serif text-4xl">{m.noResultTitle}</h1>
        <p className="mt-4">{m.noResultBody}</p>
        <a className="btn mt-6" href={localePath(locale, '/test')}>{m.start}</a>
      </section>
    );
  }

  const archetype = result.assignment.code ? getArchetype(result.assignment.code) : undefined;
  return (
    <article className="mx-auto max-w-3xl px-4 py-12" data-testid="results">
      <p className="kicker">{m.premiumTitle}</p>
      {archetype && (
        <section className="mt-6">
          <h1 className="serif text-4xl">{archetype.name[locale]}</h1>
          <p className="mt-3">{archetype.thesis[locale]}</p>
        </section>
      )}
      <div className="mt-8 grid gap-8">
        {DIMENSION_IDS.map((id) => (
          <section key={id}>
            <h2 className="serif text-2xl">{dimensions[id].technicalName[locale]}</h2>
            <p className="mt-3">{narrativeFor(result.dimensions[id], locale)}</p>
          </section>
        ))}
        {result.tensions.map((tension) => {
          const rule = getTensionRule(tension.id);
          if (!rule) return null;
          return (
            <section key={tension.id}>
              <h2 className="serif text-2xl">{rule.problem[locale]}</h2>
              <p className="mt-3">{rule.explanation[locale]}</p>
              <p className="mt-3">{rule.alternatives[locale]}</p>
              <p className="mt-3">{rule.followUp[locale]}</p>
            </section>
          );
        })}
        {archetype && (
          <section>
            <h2 className="serif text-2xl">{m.readingsTitle}</h2>
            <ol className="mt-3 list-decimal pl-5">
              {archetype.readingIds.map((id) => {
                const work = readings.find((item) => item.id === id);
                return work ? <li key={id}>{work.citation[locale]}</li> : null;
              })}
            </ol>
          </section>
        )}
      </div>
      <p className="mt-8 text-sm">{m.notDiagnosis}</p>
    </article>
  );
}
