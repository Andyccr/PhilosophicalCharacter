import type { ProfileRequest } from '@/lib/api/contract';
import { DIMENSION_IDS } from '@/lib/scoring/config';
import type { AssessmentResult, Locale } from '@/types/model';

/** Client-safe: scores, tension ids, and cover counts. No tension copy. */
export function profileRequestFromResult(locale: Locale, result: AssessmentResult): ProfileRequest {
  return {
    locale,
    assignment: result.assignment,
    dimensions: Object.fromEntries(
      DIMENSION_IDS.map((id) => {
        const row = result.dimensions[id];
        return [
          id,
          {
            score: row.score,
            inclination: row.inclination,
            inconsistency: row.inconsistency,
            directionalCount: row.directionalCount,
            applicableCount: row.applicableCount,
          },
        ];
      }),
    ) as ProfileRequest['dimensions'],
    tensionIds: result.tensions.map((tension) => tension.id),
    stats: {
      answeredCount: result.answeredCount,
      skippedCount: result.skippedCount,
      uncertainCount: result.uncertainCount,
      totalQuestions: result.totalQuestions,
    },
  };
}
