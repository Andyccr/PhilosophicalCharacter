import { getTensionRule } from '@/data/tensions/rules';
import type { ProfileRequest } from '@/lib/api/contract';
import { DIMENSION_IDS, MODEL_VERSION } from '@/lib/scoring/config';
import type { AssessmentResult, DimensionId, DimensionScore } from '@/types/model';

/** Keep in sync with `QUESTION_VERSION` in `src/data/questions/bank.ts`. Do not import the bank here — it would ship the item text into the Worker. */
const QUESTION_VERSION = '1.0.0';
const DEFAULT_TOTAL_QUESTIONS = 48;

/**
 * Rebuild the fields `buildReportData` needs from a verified `ProfileRequest`.
 * Indices and tension ids are accepted as submitted (the token already proves payment).
 * Answers are not part of the contract and are not reconstructed.
 */
export function assessmentFromProfileRequest(request: ProfileRequest): AssessmentResult {
  const dimensions = Object.fromEntries(
    DIMENSION_IDS.map((id) => [id, axisFromInput(id, request.dimensions[id])]),
  ) as Record<DimensionId, DimensionScore>;

  const tensions = request.tensionIds.flatMap((id) => {
    const rule = getTensionRule(id);
    if (!rule) return [];
    return [{ id: rule.id, kind: rule.kind, dimensions: [...rule.dimensions] }];
  });

  const stats = request.stats;
  const totalQuestions = stats?.totalQuestions ?? DEFAULT_TOTAL_QUESTIONS;
  return {
    modelVersion: MODEL_VERSION,
    questionVersion: QUESTION_VERSION,
    dimensions,
    assignment: request.assignment,
    tensions,
    answeredCount: stats?.answeredCount ?? 0,
    skippedCount: stats?.skippedCount ?? 0,
    uncertainCount: stats?.uncertainCount ?? 0,
    totalQuestions,
    invalidAnswerIds: [],
  };
}

function axisFromInput(id: DimensionId, input: ProfileRequest['dimensions'][DimensionId] | undefined): DimensionScore {
  const applicableCount = input?.applicableCount ?? 0;
  const directionalCount = input?.directionalCount ?? 0;
  return {
    dimension: id,
    score: input?.score ?? null,
    inclination: input?.inclination ?? 'insufficient',
    coverage: applicableCount > 0 ? directionalCount / applicableCount : 0,
    applicableCount,
    directionalCount,
    uncertainCount: 0,
    alternativeCount: 0,
    skippedCount: 0,
    inconsistency: input?.inconsistency ?? null,
    signedSum: 0,
    minSum: 0,
    maxSum: 0,
    leftCount: 0,
    rightCount: 0,
    alternativeTags: {},
  };
}
