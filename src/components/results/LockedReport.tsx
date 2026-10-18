import { BipolarBars, RadarChart } from '@/components/charts/Charts';
import type { PaidProfile } from '@/lib/api/contract';
import { messages } from '@/lib/localization/messages';
import { localePath } from '@/lib/localization/path';
import { DIMENSION_IDS } from '@/lib/scoring/config';
import type { Locale } from '@/types/model';

export function LockedReport({ locale, profile }: { locale: Locale; profile: PaidProfile }) {
  const m = messages[locale];
  const rows = profile.axes.map((axis) => ({
    id: axis.id,
    left: axis.leftPole,
    right: axis.rightPole,
    score: axis.score,
    text: axis.description,
    label: axis.label,
  }));

  return (
    <div className="paid-report mt-10 print:mt-0" data-testid="results">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <RadarChart
          scores={DIMENSION_IDS.map((id) => profile.axes.find((axis) => axis.id === id)?.score ?? null)}
          labels={DIMENSION_IDS.map((id) => profile.axes.find((axis) => axis.id === id)?.label ?? id)}
          caption={m.legend}
        />
        <div>
          <BipolarBars rows={rows} />
          <p className="mt-4 text-sm text-muted">{m.legend}</p>
        </div>
      </div>

      <table className="mt-8 w-full text-left text-sm">
        <caption className="sr-only">{m.indexLabel}</caption>
        <thead>
          <tr className="border-b border-line">
            <th className="py-2 font-medium">{m.dimensions}</th>
            <th className="py-2 font-medium">{m.indexLabel}</th>
            <th className="py-2 font-medium">{m.coverageLabel}</th>
          </tr>
        </thead>
        <tbody>
          {profile.axes.map((axis) => (
            <tr key={axis.id} className="border-b border-line">
              <td className="py-2">{axis.label}</td>
              <td className="py-2">{axis.score ?? '—'}</td>
              <td className="py-2">{`${axis.directionalCount}/${axis.applicableCount}`}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <section className="mt-10 grid gap-6">
        {profile.axes.map((axis) => (
          <section key={axis.id}>
            <h2 className="serif text-2xl">{axis.label}</h2>
            <p className="mt-2">{axis.narrative}</p>
            <p className="mt-2 text-sm text-muted">{axis.disagreement}</p>
          </section>
        ))}
      </section>

      {profile.worldview.length > 0 && (
        <section className="mt-12">
          <h2 className="serif text-3xl">{m.worldview}</h2>
          {profile.worldview.map((paragraph) => (
            <p key={paragraph} className="mt-4 max-w-3xl">
              {paragraph}
            </p>
          ))}
          <h2 className="serif mt-8 text-2xl">{m.strengths}</h2>
          <ul className="mt-3 list-disc pl-5">
            {profile.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h2 className="serif mt-8 text-2xl">{m.blindSpots}</h2>
          <ul className="mt-3 list-disc pl-5">
            {profile.blindSpots.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {profile.pairingPressure && (
            <>
              <h2 className="serif mt-8 text-2xl">{m.pressure}</h2>
              <p className="mt-3 max-w-3xl">{profile.pairingPressure}</p>
            </>
          )}
          <h2 className="serif mt-8 text-2xl">{m.reflection}</h2>
          <ol className="mt-3 list-decimal pl-5">
            {profile.reflection.map((item) => (
              <li key={item} className="mt-2">
                {item}
              </li>
            ))}
          </ol>
          {profile.typePath && (
            <p className="mt-6">
              <a href={profile.typePath}>{profile.name}</a>
            </p>
          )}
        </section>
      )}

      <section className="mt-12">
        <h2 className="serif text-3xl">{m.tensions}</h2>
        {profile.tensions.length === 0 && <p className="mt-3">{m.noTensions}</p>}
        <div className="mt-4 grid gap-4">
          {profile.tensions.map((tension) => (
            <article key={tension.id} className="frame p-5" data-kind={tension.kind}>
              <p className="kicker">{tension.kind}</p>
              <h3 className="serif mt-2 text-2xl">{tension.problem}</h3>
              <p className="mt-3">{tension.explanation}</p>
              <p className="mt-3 text-sm text-muted">{tension.because}</p>
              <p className="mt-3">{tension.alternatives}</p>
            </article>
          ))}
          {profile.standing.map((issue) => (
            <article key={issue.id} className="border-t border-line pt-4">
              <h3 className="serif text-xl">{issue.title}</h3>
              <p className="mt-2">{issue.explanation}</p>
            </article>
          ))}
        </div>
      </section>

      {profile.readings.length > 0 && (
        <section className="mt-12">
          <h2 className="serif text-3xl">{m.readingsTitle}</h2>
          <ul className="mt-4 grid gap-3">
            {profile.readings.map((work) => (
              <li key={work.id}>
                {work.citation} — {work.topic}
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="no-print mt-8 text-sm text-muted">{m.printHint}</p>
      <div className="no-print mt-3">
        <button type="button" className="btn secondary" onClick={() => window.print()}>
          {m.printReport}
        </button>
        <a className="btn secondary mt-3 ml-3 inline-flex" href={localePath(locale, '/premium')}>
          {m.premium}
        </a>
      </div>
    </div>
  );
}
