import { useEffect, useMemo, useState } from 'react';
import { getArchetype } from '@/data/archetypes';
import { families } from '@/data/archetypes/families';
import { dimensions } from '@/data/dimensions';
import { readings } from '@/data/readings';
import { getTensionRule } from '@/data/tensions/rules';
import { standingIssues } from '@/data/tensions/standing';
import { BipolarBars, RadarChart } from '@/components/charts/Charts';
import { disagreementLabel, describeScore, narrativeFor } from '@/lib/interpretation/describe';
import { messages } from '@/lib/localization/messages';
import { localePath } from '@/lib/localization/path';
import { clearPaypalQuery, parsePaypalReturn, readAccess, writeAccess, type PaymentAccess } from '@/lib/payment/access';
import { parseShareHash, shareUrl, type SharedProfile } from '@/lib/sharing/link';
import { shareCardSvg, type ShareCardInput } from '@/lib/sharing/card';
import { DIMENSION_IDS, scoringConfig } from '@/lib/scoring/config';
import { scoreAssessment } from '@/lib/scoring/score';
import { browserStorage, clearSession, readSession } from '@/lib/storage/session';
import { Paywall } from '@/components/results/Paywall';
import type { AssessmentResult, DimensionId, Locale } from '@/types/model';

function profileFromResult(result: AssessmentResult): SharedProfile {
  return {
    scores: Object.fromEntries(DIMENSION_IDS.map((id) => [id, result.dimensions[id].score])) as SharedProfile['scores'],
    disagreement: Object.fromEntries(
      DIMENSION_IDS.map((id) => [id, (result.dimensions[id].inconsistency ?? 0) >= scoringConfig.inconsistencyMixed]),
    ) as SharedProfile['disagreement'],
    assignment: result.assignment,
  };
}

function sameScores(a: SharedProfile, b: SharedProfile): boolean {
  return DIMENSION_IDS.every((id) => a.scores[id] === b.scores[id] && a.disagreement[id] === b.disagreement[id]);
}

export function ResultsApp({ locale }: { locale: Locale }) {
  const m = messages[locale];
  const [ready, setReady] = useState(false);
  const [localResult, setLocalResult] = useState<AssessmentResult | null>(null);
  const [localAnswers, setLocalAnswers] = useState<Record<string, string> | null>(null);
  const [shared, setShared] = useState<SharedProfile | null>(null);
  const [status, setStatus] = useState('');
  const [shareField, setShareField] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [access, setAccess] = useState<PaymentAccess | null>(null);
  const [paymentNotice, setPaymentNotice] = useState('');

  useEffect(() => {
    const storage = browserStorage();
    const returned = parsePaypalReturn(window.location.search);
    if (returned.ok) {
      setAccess(writeAccess(storage, returned.transactionId));
      window.history.replaceState({}, '', clearPaypalQuery(window.location.href));
    } else {
      setAccess(readAccess(storage));
      if (returned.reason === 'not_completed') setPaymentNotice(m.payPending);
    }
    const stored = readSession(storage);
    const local = stored.ok ? scoreAssessment(stored.session.answers) : null;
    const parsed = parseShareHash(window.location.hash);
    if (stored.ok) setLocalAnswers(stored.session.answers);
    setLocalResult(local);
    if (parsed && local && sameScores(parsed, profileFromResult(local))) setShared(null);
    else setShared(parsed);
    setReady(true);
  }, [m.payPending]);

  const view = useMemo(() => {
    if (shared) return { kind: 'shared' as const, profile: shared };
    if (localResult) return { kind: 'local' as const, result: localResult };
    return { kind: 'empty' as const };
  }, [shared, localResult]);

  if (!ready) return <p className="mx-auto max-w-3xl px-4 py-16">{m.loading}</p>;
  if (view.kind === 'empty') {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="serif text-4xl">{m.noResultTitle}</h1>
        <p className="mt-4">{m.noResultBody}</p>
        <a className="btn mt-6" href={localePath(locale, '/test')}>{m.start}</a>
      </section>
    );
  }
  if (!access) return <Paywall locale={locale} notice={paymentNotice} />;

  const profile = view.kind === 'shared' ? view.profile : profileFromResult(view.result);
  const archetype = profile.assignment.code ? getArchetype(profile.assignment.code) : undefined;
  const family = archetype ? families[archetype.familyId] : undefined;
  const title = archetype ? archetype.name[locale] : m.withheld;
  const badge = profile.assignment.status === 'definitive' ? m.definitive : profile.assignment.status === 'provisional' ? m.provisional : m.withheld;
  const rows = DIMENSION_IDS.map((id) => {
    const dimension = dimensions[id];
    const score = profile.scores[id];
    const localScore = view.kind === 'local' ? view.result.dimensions[id] : null;
    return {
      id,
      left: dimension.leftPole[locale],
      right: dimension.rightPole[locale],
      score,
      text: localScore ? describeScore(localScore, locale) : `${dimension.plainName[locale]}: ${score === null ? '—' : score}`,
      label: dimension.plainName[locale],
    };
  });

  const cardInput: ShareCardInput = {
    kicker: m.cardKicker,
    title,
    code: archetype ? archetype.code.split('').join(' · ') : '—',
    family: family ? family.name[locale] : '',
    summary: archetype ? archetype.thesis[locale] : m.withheldBody,
    rows: rows.map((row) => ({ label: row.label, value: row.score === null ? '—' : String(row.score) })),
    disclaimer: m.cardDisclaimer,
    badge,
  };

  function urlForShare(): string {
    return shareUrl(window.location.origin, localePath(locale, '/results'), profile);
  }

  async function copyLink() {
    const url = urlForShare();
    setShareField(url);
    try {
      await navigator.clipboard.writeText(url);
      setStatus(m.copied);
    } catch {
      setStatus(m.copyFailed);
    }
  }

  function download(filename: string, blob: Blob) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function downloadSvg() {
    download('noema-profile.svg', new Blob([shareCardSvg(cardInput)], { type: 'image/svg+xml' }));
  }

  async function downloadPng() {
    try {
      await document.fonts.ready;
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 760;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('canvas');
      const image = new Image();
      const svg = shareCardSvg(cardInput);
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const src = URL.createObjectURL(blob);
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error('image'));
        image.src = src;
      });
      context.drawImage(image, 0, 0);
      URL.revokeObjectURL(src);
      const png = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!png) throw new Error('png');
      download('noema-profile.png', png);
    } catch {
      setStatus(m.pngFailed);
    }
  }

  async function nativeShare() {
    const url = urlForShare();
    if (!navigator.share) {
      await copyLink();
      return;
    }
    try {
      await navigator.share({ title: `NOEMA — ${title}`, text: m.cardDisclaimer, url });
    } catch {
      setStatus(m.copyFailed);
    }
  }

  function exportAnswers() {
    if (!localAnswers) return;
    download(
      'noema-answers.json',
      new Blob([JSON.stringify({ notice: m.exportWarning, answers: localAnswers }, null, 2)], { type: 'application/json' }),
    );
  }

  return (
    <article className="mx-auto max-w-5xl px-4 py-12" data-testid="results">
      {view.kind === 'shared' && (
        <p className="mb-6 border border-line p-4" role="status">{m.sharedBanner}{' '}
          {localResult && <a href={localePath(locale, '/results')}>{m.myResult}</a>}
        </p>
      )}
      <p className="kicker">{badge}</p>
      <h1 className="serif mt-3 text-4xl md:text-6xl">{title}</h1>
      {archetype && <p className="mono mt-3 text-lg text-iris" aria-label={m.codeLabel}>{archetype.code.split('').join(' · ')}</p>}
      {family && <p className="mt-2 text-muted">{m.familyLabel}: {family.name[locale]}</p>}
      <p className="mt-4 max-w-3xl">{profile.assignment.status === 'withheld' ? m.withheldBody : profile.assignment.status === 'provisional' ? m.provisionalBody : archetype?.thesis[locale]}</p>
      {profile.assignment.reasons.map((reason) => <p key={reason.en} className="mt-2 text-sm text-muted">{reason[locale]}</p>)}
      <p className="mt-4 text-sm">{m.notDiagnosis}</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <RadarChart scores={DIMENSION_IDS.map((id) => profile.scores[id])} labels={DIMENSION_IDS.map((id) => dimensions[id].plainName[locale])} caption={m.legend} />
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
          {DIMENSION_IDS.map((id: DimensionId) => {
            const localScore = view.kind === 'local' ? view.result.dimensions[id] : null;
            return (
              <tr key={id} className="border-b border-line">
                <td className="py-2">{dimensions[id].plainName[locale]}</td>
                <td className="py-2">{profile.scores[id] ?? '—'}</td>
                <td className="py-2">{localScore ? `${localScore.directionalCount}/${localScore.applicableCount}` : '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {view.kind === 'local' && (
        <section className="mt-10 grid gap-6">
          {DIMENSION_IDS.map((id) => (
            <section key={id}>
              <h2 className="serif text-2xl">{dimensions[id].plainName[locale]}</h2>
              <p className="mt-2">{narrativeFor(view.result.dimensions[id], locale)}</p>
              <p className="mt-2 text-sm text-muted">{disagreementLabel(view.result.dimensions[id], locale)}</p>
            </section>
          ))}
        </section>
      )}

      {archetype && (
        <section className="mt-12">
          <h2 className="serif text-3xl">{m.worldview}</h2>
          {archetype.worldview.map((paragraph) => <p key={paragraph.en} className="mt-4 max-w-3xl">{paragraph[locale]}</p>)}
          <h2 className="serif mt-8 text-2xl">{m.strengths}</h2>
          <ul className="mt-3 list-disc pl-5">{archetype.strengths.map((item) => <li key={item.en}>{item[locale]}</li>)}</ul>
          <h2 className="serif mt-8 text-2xl">{m.blindSpots}</h2>
          <ul className="mt-3 list-disc pl-5">{archetype.blindSpots.map((item) => <li key={item.en}>{item[locale]}</li>)}</ul>
          <h2 className="serif mt-8 text-2xl">{m.pressure}</h2>
          <p className="mt-3 max-w-3xl">{archetype.pairingPressure[locale]}</p>
          <h2 className="serif mt-8 text-2xl">{m.reflection}</h2>
          <ol className="mt-3 list-decimal pl-5">{archetype.reflection.map((item) => <li key={item.en} className="mt-2">{item[locale]}</li>)}</ol>
          <p className="mt-6"><a href={localePath(locale, `/types/${archetype.code.toLowerCase()}`)}>{archetype.name[locale]}</a></p>
        </section>
      )}

      <section className="mt-12">
        <h2 className="serif text-3xl">{m.tensions}</h2>
        {view.kind === 'local' && view.result.tensions.length === 0 && <p className="mt-3">{m.noTensions}</p>}
        <div className="mt-4 grid gap-4">
          {(view.kind === 'local' ? view.result.tensions : []).map((tension) => {
            const rule = getTensionRule(tension.id);
            if (!rule) return null;
            return (
              <article key={tension.id} className="frame p-5" data-kind={rule.kind}>
                <p className="kicker">{rule.kind}</p>
                <h3 className="serif mt-2 text-2xl">{rule.problem[locale]}</h3>
                <p className="mt-3">{rule.explanation[locale]}</p>
                <p className="mt-3 text-sm text-muted">{tension.because[locale]}</p>
                <p className="mt-3">{rule.alternatives[locale]}</p>
              </article>
            );
          })}
          {archetype?.standingIssueIds.map((id) => {
            const issue = standingIssues.find((item) => item.id === id);
            if (!issue) return null;
            return (
              <article key={id} className="border-t border-line pt-4">
                <h3 className="serif text-xl">{issue.title[locale]}</h3>
                <p className="mt-2">{issue.explanation[locale]}</p>
              </article>
            );
          })}
        </div>
      </section>

      {archetype && (
        <section className="mt-12">
          <h2 className="serif text-3xl">{m.readingsTitle}</h2>
          <ul className="mt-4 grid gap-3">
            {archetype.readingIds.map((id) => {
              const work = readings.find((item) => item.id === id);
              if (!work) return null;
              return <li key={id}>{work.citation[locale]} — {work.topic[locale]}</li>;
            })}
          </ul>
        </section>
      )}

      <div className="mt-10 flex flex-wrap gap-3" data-share-url={shareField}>
        <button type="button" className="btn" onClick={() => void copyLink()} data-testid="copy-link">{m.copyLink}</button>
        <button type="button" className="btn secondary" onClick={() => void nativeShare()}>{m.shareNative}</button>
        <button type="button" className="btn secondary" onClick={downloadSvg} data-testid="download-svg">{m.downloadSvg}</button>
        <button type="button" className="btn secondary" onClick={() => void downloadPng()}>{m.downloadPng}</button>
        <a className="btn secondary" href={localePath(locale, '/premium')}>{m.premium}</a>
        <button type="button" className="btn secondary" onClick={() => setConfirm(true)} data-testid="retake">{m.retake}</button>
        {view.kind === 'local' && <button type="button" className="btn secondary" onClick={exportAnswers}>{m.exportAnswers}</button>}
        <button type="button" className="btn secondary" onClick={() => { clearSession(browserStorage()); setStatus(m.deleted); }}>{m.deleteLocal}</button>
      </div>
      {view.kind === 'local' && <p className="mt-3 text-sm text-muted">{m.exportWarning}</p>}
      {status && <p className="mt-3" role="status">{status}</p>}
      {shareField && <input className="mt-3 w-full border border-line bg-transparent p-2" readOnly value={shareField} aria-label={m.copyLink} />}
      {confirm && (
        <div className="mt-4 border border-line p-4" role="dialog" aria-modal="true">
          <p>{m.retakeConfirm}</p>
          <div className="mt-3 flex gap-3">
            <button type="button" className="btn" data-testid="confirm-retake" onClick={() => { clearSession(browserStorage()); window.location.assign(localePath(locale, '/test')); }}>{m.confirmRetake}</button>
            <button type="button" className="btn secondary" onClick={() => setConfirm(false)}>{m.cancel}</button>
          </div>
        </div>
      )}
    </article>
  );
}
