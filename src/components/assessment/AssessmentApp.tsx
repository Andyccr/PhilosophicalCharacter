import { useEffect, useState } from 'react';
import { questions } from '@/data/questions/bank';
import { fill, messages } from '@/lib/localization/messages';
import { localePath } from '@/lib/localization/path';
import { browserStorage, clearSession, readSession, writeSession, type SavedSession } from '@/lib/storage/session';
import { QUESTION_VERSION } from '@/data/questions/bank';
import { MODEL_VERSION } from '@/lib/scoring/config';
import type { Locale } from '@/types/model';

export function AssessmentApp({ locale }: { locale: Locale }) {
  const m = messages[locale];
  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showWhy, setShowWhy] = useState(false);
  const [notice, setNotice] = useState('');
  const [corrupt, setCorrupt] = useState(false);

  useEffect(() => {
    const read = readSession(browserStorage());
    if (read.ok) {
      setAnswers(read.session.answers);
      setIndex(Math.min(read.session.index, questions.length - 1));
    } else if (read.reason === 'corrupt') setCorrupt(true);
    setReady(true);
  }, []);

  const fallback = questions[0];
  if (!fallback) throw new Error('The question bank is empty.');
  const question = questions[index] ?? fallback;

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
    setNotice(saved.ok ? m.savedLocal : m.saveFailed);
  }

  function choose(optionId: string) {
    const next = { ...answers, [question.id]: optionId };
    setAnswers(next);
    persist(index, next);
  }

  function go(nextIndex: number) {
    setShowWhy(false);
    setIndex(nextIndex);
    persist(nextIndex, answers);
  }

  function skip() {
    const next = { ...answers };
    delete next[question.id];
    setAnswers(next);
    const following = Math.min(questions.length - 1, index + 1);
    setIndex(following);
    persist(following, next);
  }

  function finish() {
    persist(index, answers);
    window.location.assign(localePath(locale, '/results'));
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      const number = Number(event.key);
      const option = question.options[number - 1];
      if (option) choose(option.id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!ready) return <p className="mx-auto max-w-3xl px-4 py-16">{m.loading}</p>;

  const selected = answers[question.id];
  const last = index === questions.length - 1;

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
      <p className="kicker">{fill(m.questionOf, { current: index + 1, total: questions.length })}</p>
      <div
        className="mt-3 h-1 bg-line"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={questions.length}
        aria-valuenow={index + 1}
        aria-valuetext={fill(m.questionOf, { current: index + 1, total: questions.length })}
      >
        <div className="h-full bg-iris" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
      </div>
      <form
        className="mt-8"
        onSubmit={(event) => {
          event.preventDefault();
          if (last) finish();
          else if (selected) go(index + 1);
        }}
      >
        <fieldset>
          <legend className="serif text-3xl leading-tight md:text-4xl">{question.prompt[locale]}</legend>
          <p className="mt-3 text-sm text-muted">{question.theme[locale]}</p>
          <div className="mt-6 grid gap-3">
            {question.options.map((option, optionIndex) => (
              <label key={option.id} className="frame flex cursor-pointer gap-3 p-4">
                <input
                  type="radio"
                  name={question.id}
                  value={option.id}
                  checked={selected === option.id}
                  onChange={() => choose(option.id)}
                />
                <span>
                  <span className="mono mr-2 text-xs text-gold">{optionIndex + 1}</span>
                  {option.label[locale]}
                </span>
              </label>
            ))}
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
            <button type="submit" className="btn" data-testid="finish">{m.finish}</button>
          ) : (
            <button type="submit" className="btn" disabled={!selected} data-testid="next">{m.next}</button>
          )}
          <button type="button" className="btn secondary" onClick={() => setShowWhy((value) => !value)}>
            {showWhy ? m.hideWhy : m.showWhy}
          </button>
        </div>
        {showWhy && <p className="prose mt-6 text-sm">{question.rationale[locale]}</p>}
      </form>
    </div>
  );
}
