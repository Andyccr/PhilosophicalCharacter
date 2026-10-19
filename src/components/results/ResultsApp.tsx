import { useEffect, useMemo, useState } from 'react';
import { FreePreview } from '@/components/results/FreePreview';
import { LockedReport } from '@/components/results/LockedReport';
import { Paywall } from '@/components/results/Paywall';
import type { PaidProfile, ProfileRequest, UnlockRecord } from '@/lib/api/contract';
import { freePreview } from '@/lib/interpretation/preview';
import { messages } from '@/lib/localization/messages';
import { localePath } from '@/lib/localization/path';
import { clearPaypalQuery, parsePaypalReturn, readAccess, writeAccess } from '@/lib/payment/access';
import { PaymentClient } from '@/lib/payment/client';
import { profileRequestFromResult } from '@/lib/report/profileRequest';
import { buildShareCardInput } from '@/lib/share-card/input';
import { runtimeShareCardHost } from '@/lib/share-card/host';
import { parseShareHash, shareUrl, type SharedProfile } from '@/lib/sharing/link';
import { DIMENSION_IDS, classifyInclination, scoringConfig } from '@/lib/scoring/config';
import { scoreAssessment } from '@/lib/scoring/score';
import { browserStorage, clearSession, readSession } from '@/lib/storage/session';
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

function sameScores(a: SharedProfile, b: SharedProfile): boolean {
  return DIMENSION_IDS.every((id) => a.scores[id] === b.scores[id] && a.disagreement[id] === b.disagreement[id]);
}

function requestFromShared(locale: Locale, profile: SharedProfile): ProfileRequest {
  return {
    locale,
    assignment: profile.assignment,
    dimensions: Object.fromEntries(
      DIMENSION_IDS.map((id) => {
        const score = profile.scores[id];
        return [
          id,
          {
            score,
            inclination: classifyInclination({
              score,
              coverage: score === null ? 0 : 1,
              directionalCount: score === null ? 0 : scoringConfig.minDirectional,
              inconsistency: profile.disagreement[id] ? scoringConfig.inconsistencyMixed : 0,
            }),
            inconsistency: profile.disagreement[id] ? scoringConfig.inconsistencyMixed : 0,
            directionalCount: score === null ? 0 : scoringConfig.minDirectional,
            applicableCount: scoringConfig.minDirectional,
          },
        ];
      }),
    ) as ProfileRequest['dimensions'],
    tensionIds: [],
  };
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
  const [access, setAccess] = useState<UnlockRecord | null>(null);
  const [paymentNotice, setPaymentNotice] = useState('');
  const [paid, setPaid] = useState<PaidProfile | null>(null);
  const [paidError, setPaidError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const storage = browserStorage();
    const returned = parsePaypalReturn(window.location.search);

    async function boot() {
      if (returned.kind === 'capture') {
        try {
          const unlocked = await PaymentClient.capture({ orderId: returned.orderId });
          if (!cancelled) setAccess(writeAccess(storage, unlocked.token, unlocked.orderId));
        } catch {
          if (!cancelled) {
            setAccess(readAccess(storage));
            setPaymentNotice(m.payPending);
          }
        }
        window.history.replaceState({}, '', clearPaypalQuery(window.location.href));
      } else {
        setAccess(readAccess(storage));
      }
      const stored = readSession(storage);
      const local = stored.ok ? scoreAssessment(stored.session.answers) : null;
      const parsed = parseShareHash(window.location.hash);
      if (cancelled) return;
      if (stored.ok) setLocalAnswers(stored.session.answers);
      setLocalResult(local);
      if (parsed && local && sameScores(parsed, profileFromResult(local))) setShared(null);
      else setShared(parsed);
      setReady(true);
    }

    void boot();
    return () => {
      cancelled = true;
    };
  }, [m.payPending]);

  const view = useMemo(() => {
    if (shared) return { kind: 'shared' as const, profile: shared };
    if (localResult) return { kind: 'local' as const, result: localResult };
    return { kind: 'empty' as const };
  }, [shared, localResult]);

  useEffect(() => {
    if (!access || view.kind === 'empty') {
      setPaid(null);
      return;
    }
    const body = view.kind === 'local' ? profileRequestFromResult(locale, view.result) : requestFromShared(locale, view.profile);
    let cancelled = false;
    setPaidError('');
    void PaymentClient.fetchProfile(access.token, body)
      .then((profile) => {
        if (!cancelled) setPaid(profile);
      })
      .catch(() => {
        if (!cancelled) {
          setPaid(null);
          setPaidError(m.unavailable);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [access, locale, m.unavailable, view]);

  if (!ready) return <p className="mx-auto max-w-3xl px-4 py-16">{m.loading}</p>;
  if (view.kind === 'empty') {
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

  const assignment = view.kind === 'shared' ? view.profile.assignment : view.result.assignment;
  const preview = freePreview(locale, assignment, m.withheldBody);
  const shareProfile = view.kind === 'shared' ? view.profile : profileFromResult(view.result);
  const card = buildShareCardInput(shareProfile, locale, runtimeShareCardHost());

  function urlForShare(): string {
    return shareUrl(window.location.origin, localePath(locale, '/results'), shareProfile);
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

  async function nativeShare() {
    const url = urlForShare();
    if (!navigator.share) {
      await copyLink();
      return;
    }
    try {
      await navigator.share({ title: `NOEMA — ${preview.name ?? m.withheld}`, text: m.cardDisclaimer, url });
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

  function unlock(token: string, orderId: string) {
    setAccess(writeAccess(browserStorage(), token, orderId));
    setPaymentNotice('');
  }

  return (
    <article className="mx-auto max-w-5xl px-4 py-12">
      {view.kind === 'shared' && (
        <p className="no-print mb-6 border border-line p-4" role="status">
          {m.sharedBanner} {localResult && <a href={localePath(locale, '/results')}>{m.myResult}</a>}
        </p>
      )}
      <FreePreview locale={locale} preview={preview} card={card} />
      {!access && <Paywall locale={locale} notice={paymentNotice} onUnlocked={unlock} />}
      {access && paidError && (
        <p className="no-print mt-6 border border-line p-4" role="alert">
          {paidError}
        </p>
      )}
      {access && !paid && !paidError && <p className="mt-8">{m.loading}</p>}
      {paid && access && (
        <LockedReport
          locale={locale}
          profile={paid}
          token={access.token}
          request={view.kind === 'local' ? profileRequestFromResult(locale, view.result) : requestFromShared(locale, view.profile)}
        />
      )}

      <div className="no-print mt-10 flex flex-wrap gap-3" data-share-url={shareField}>
        <button type="button" className="btn" onClick={() => void copyLink()} data-testid="copy-link">
          {m.copyLink}
        </button>
        <button type="button" className="btn secondary" onClick={() => void nativeShare()}>
          {m.shareNative}
        </button>
        <button type="button" className="btn secondary" onClick={() => setConfirm(true)} data-testid="retake">
          {m.retake}
        </button>
        {view.kind === 'local' && (
          <button type="button" className="btn secondary" onClick={exportAnswers}>
            {m.exportAnswers}
          </button>
        )}
        <button
          type="button"
          className="btn secondary"
          onClick={() => {
            clearSession(browserStorage());
            setStatus(m.deleted);
          }}
        >
          {m.deleteLocal}
        </button>
      </div>
      {view.kind === 'local' && <p className="no-print mt-3 text-sm text-muted">{m.exportWarning}</p>}
      {status && (
        <p className="no-print mt-3" role="status">
          {status}
        </p>
      )}
      {shareField && (
        <input className="no-print mt-3 w-full border border-line bg-transparent p-2" readOnly value={shareField} aria-label={m.copyLink} />
      )}
      {confirm && (
        <div className="no-print mt-4 border border-line p-4" role="dialog" aria-modal="true">
          <p>{m.retakeConfirm}</p>
          <div className="mt-3 flex gap-3">
            <button
              type="button"
              className="btn"
              data-testid="confirm-retake"
              onClick={() => {
                clearSession(browserStorage());
                window.location.assign(localePath(locale, '/test'));
              }}
            >
              {m.confirmRetake}
            </button>
            <button type="button" className="btn secondary" onClick={() => setConfirm(false)}>
              {m.cancel}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
