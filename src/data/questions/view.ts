import { questions } from '@/data/questions/bank';
import type { AssessmentItem } from '@/lib/assessment/advance';
import type { Locale } from '@/types/model';

export type { AssessmentItem };

/** Locale-only fields the questionnaire island needs. Keep weights and the other language off the client. */
export function assessmentItems(locale: Locale): AssessmentItem[] {
  return questions.map((question) => ({
    id: question.id,
    prompt: question.prompt[locale],
    theme: question.theme[locale],
    rationale: question.rationale[locale],
    options: question.options.map((option) => ({
      id: option.id,
      label: option.label[locale],
    })),
  }));
}
