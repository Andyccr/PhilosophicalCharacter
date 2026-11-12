import { useEffect, useRef, useState } from 'react';
import { nextIndexAfterChoice, type AssessmentItem } from '@/lib/assessment/advance';
import { fill, messages } from '@/lib/localization/messages';
import { localePath } from '@/lib/localization/path';
import { browserStorage, clearSession, readSession, writeSession, type SavedSession } from '@/lib/storage/session';
import { MODEL_VERSION, QUESTION_VERSION } from '@/lib/versions';
import type { Locale } from '@/types/model';

export function AssessmentApp({ locale, items }: { locale: Locale; items: AssessmentItem[] }) {
  const m = messages[locale];
  const total = items.length;
  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showWhy, setShowWhy] = useState(false);
  const [notice, setNotice] = useState('');
  const [corrupt, setCorrupt] = useState(false);
  const answersRef = useRef(answers);
  const indexRef = useRef(index);
  const prefetchedRef = useRef(false);
  const chooseRef = useRef<(optionId: string) => void>(() => {});
  answersRef.current = answers;
  indexRef.current = index;

  useEffect(() => {
    const read = readSession(browserStorage());
    if (read.ok) {
      setAnswers(read.session.answers);
      setIndex(Math.min(read.session.index, Math.max(0, total - 1)));
    } else if (read.reason === 'corrupt') setCorrupt(true);
    setReady(true);
  }, [total]);

  const fallback = items[0];
  if (!fallback) throw new Error('The question bank is empty.');
  const question = items[index] ?? fallback;
  const selected = answers[question.id];
  const last = index === total - 1;

  function persist(nextIndex: number, nextAnswers: Record<string, string>) {
    const session: SavedSession = {
      modelVersion: MODEL_VERSION,
      questionVersion: QUESTION_VERSION,
      locale,
      index: nextIndex,
      answers: nextAnswers,
      updatedAt: new Date().toISOString(),
    };
    const saved = writeSession(browserStorage(), session);
    if (!saved.ok) setNotice(m.saveFailed);
    else if (notice) setNotice('');
  }

  function choose(optionId: string) {
    const current = items[indexRef.current] ?? fallback;
    const nextAnswers = { ...answersRef.current, [current.id]: optionId };
    const currentIndex = indexRef.current;
    const nextIndex = nextIndexAfterChoice(currentIndex, total);
    setAnswers(nextAnswers);
    if (nextIndex !== currentIndex) {
      setShowWhy(false);
      setIndex(nextIndex);
    }
    persist(nextIndex, nextAnswers);
  }
  chooseRef.current = choose;

  function go(nextIndex: number) {
    const clamped = Math.min(Math.max(0, nextIndex), Math.max(0, total - 1));
    setShowWhy(false);
    setIndex(clamped);
    persist(clamped, answersRef.current);
  }

  function skip() {
    const current = items[indexRef.current] ?? fallback;
    const nextAnswers = { ...answersRef.current };
    delete nextAnswers[current.id];
    const following = nextIndexAfterChoice(indexRef.current, total);
    setAnswers(nextAnswers);
    setShowWhy(false);
    setIndex(following);
    persist(following, nextAnswers);
  }

  function finish() {
    persist(indexRef.current, answersRef.current);
    window.location.assign(localePath(locale, '/results'));
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      const number = Number(event.key);
      const current = items[indexRef.current] ?? fallback;
      const option = current.options[number - 1];
      if (option) chooseRef.current(option.id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [items, fallback]);

  useEffect(() => {
    if (prefetchedRef.current || index < total - 3) return;
    prefetchedRef.current = true;
    const href = localePath(locale, '/results');
    if (document.querySelector(`link[rel="prefetch"][href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  }, [index, locale, total]);

  if (!ready) return <p className="mx-auto max-w-3xl px-4 py-16">{m.loading}</p>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10" data-testid="assessment">
      {corrupt && (
        <p className="mb-6 border border-line p-4" role="alert">
          {m.corruptSession}{' '}
          <button
            type="button"
            className="btn secondary ml-2"
            onClick={() => {
              clearSession(browserStorage());
              setCorrupt(false);
            }}
          >
            {m.clearSession}
          </button>
        </p>
      )}
      <p className="kicker">{fill(m.questionOf, { current: index + 1, total })}</p>
      <div
        className="mt-3 h-1 bg-line"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={index + 1}
        aria-valuetext={fill(m.questionOf, { current: index + 1, total })}
      >
        <div className="h-full bg-iris" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>
      <form
        className="mt-8"
        onSubmit={(event) => {
          event.preventDefault();
          if (last) finish();
          else if (selected) go(index + 1);
        }}
      >
        <fieldset key={question.id}>
          <legend className="serif text-3xl leading-tight md:text-4xl">{question.prompt}</legend>
          <p className="mt-3 text-sm text-muted">{question.theme}</p>
          <div className="mt-6 grid gap-3">
            {question.options.map((option, optionIndex) => {
              const isSelected = selected === option.id;
              return (
                <label
                  key={option.id}
                  className="option-choice frame flex cursor-pointer gap-3 p-4"
                  data-selected={isSelected ? 'true' : 'false'}
                  data-testid="assessment-option"
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option.id}
                    checked={isSelected}
                    onChange={() => choose(option.id)}
                    onClick={() => {
                      if (isSelected) choose(option.id);
                    }}
                  />
                  <span>
                    <span className="mono mr-2 text-xs text-gold">{optionIndex + 1}</span>
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
        <p className="mt-4 text-sm text-muted">{m.uncertainHelp}</p>
        <p className="text-sm text-muted">{m.keysHelp}</p>
        {notice && <p className="mt-3 text-sm">{notice}</p>}
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className="btn secondary" onClick={() => go(index - 1)} disabled={index === 0}>
            {m.back}
          </button>
          <button type="button" className="btn secondary" onClick={skip}>
            {m.skipQuestion}
          </button>
          {last ? (
            <button type="submit" className="btn" data-testid="finish">
              {m.finish}
            </button>
          ) : (
            <button type="submit" className="btn" disabled={!selected} data-testid="next">
              {m.next}
            </button>
          )}
          <button type="button" className="btn secondary" onClick={() => setShowWhy((value) => !value)}>
            {showWhy ? m.hideWhy : m.showWhy}
          </button>
        </div>
        {showWhy && <p className="prose mt-6 text-sm">{question.rationale}</p>}
      </form>
    </div>
  );
}
