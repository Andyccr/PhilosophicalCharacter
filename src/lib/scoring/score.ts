import { questions, QUESTION_VERSION } from '@/data/questions/bank';
import { activateTensions } from '@/data/tensions/detect';
import {
  DIMENSION_IDS,
  MODEL_VERSION,
  POLE_LETTERS,
  classifyInclination,
  poleFromIndex,
  roundIndex,
} from '@/lib/scoring/config';
import type {
  AssessmentResult,
  Assignment,
  DimensionId,
  DimensionScore,
  Localized,
  Question,
  QuestionOption,
} from '@/types/model';

const questionById = new Map(questions.map((question) => [question.id, question]));

function emptyTags(): Record<string, number> {
  return {};
}

function bump(tags: Record<string, number>, tag: string): void {
  tags[tag] = (tags[tag] ?? 0) + 1;
}

function optionWeight(option: QuestionOption, dimension: DimensionId): number | undefined {
  return option.weights?.[dimension];
}

function directionalBounds(question: Question, dimension: DimensionId): { min: number; max: number } | null {
  const values = question.options.flatMap((option) => {
    if (option.kind !== 'directional') return [];
    const weight = optionWeight(option, dimension);
    return weight === undefined ? [] : [weight];
  });
  if (values.length === 0) return null;
  return { min: Math.min(...values), max: Math.max(...values) };
}

function scoreDimension(dimension: DimensionId, answers: Record<string, string>): DimensionScore {
  const applicable = questions.filter((question) => question.dimensions.includes(dimension));
  let signedSum = 0;
  let minSum = 0;
  let maxSum = 0;
  let directionalCount = 0;
  let uncertainCount = 0;
  let alternativeCount = 0;
  let skippedCount = 0;
  let leftCount = 0;
  let rightCount = 0;
  const weights: number[] = [];
  const alternativeTags = emptyTags();

  for (const question of applicable) {
    const selected = answers[question.id];
    if (selected === undefined) {
      skippedCount += 1;
      continue;
    }
    const option = question.options.find((item) => item.id === selected);
    if (!option) {
      skippedCount += 1;
      continue;
    }
    if (option.kind === 'uncertain') {
      uncertainCount += 1;
      continue;
    }
    if (option.kind === 'alternative') {
      alternativeCount += 1;
      if (option.alternativeTag) bump(alternativeTags, option.alternativeTag);
      continue;
    }
    const chosen = optionWeight(option, dimension);
    const bounds = directionalBounds(question, dimension);
    if (chosen === undefined || !bounds) continue;
    directionalCount += 1;
    signedSum += chosen;
    minSum += bounds.min;
    maxSum += bounds.max;
    weights.push(chosen);
    if (chosen < 0) leftCount += 1;
    if (chosen > 0) rightCount += 1;
  }

  const span = maxSum - minSum;
  const score = directionalCount === 0 || span === 0 ? null : roundIndex(((signedSum - minSum) / span) * 100);
  const applicableCount = applicable.length;
  const coverage = applicableCount === 0 ? 0 : directionalCount / applicableCount;
  let inconsistency: number | null = null;
  if (weights.length >= 2) {
    const totalAbs = weights.reduce((sum, weight) => sum + Math.abs(weight), 0);
    if (totalAbs > 0) {
      inconsistency = 1 - Math.abs(signedSum) / totalAbs;
    }
  }

  return {
    dimension,
    score,
    inclination: classifyInclination({ score, coverage, directionalCount, inconsistency }),
    coverage,
    applicableCount,
    directionalCount,
    uncertainCount,
    alternativeCount,
    skippedCount,
    inconsistency,
    signedSum,
    minSum,
    maxSum,
    leftCount,
    rightCount,
    alternativeTags,
  };
}

function reason(en: string, zh: string): Localized {
  return { en, zh };
}

export function assignCode(dimensions: Record<DimensionId, DimensionScore>): Assignment {
  const letters = DIMENSION_IDS.map((id) => POLE_LETTERS[id][poleFromIndex(dimensions[id].score)]);
  const code = letters.join('');
  const missing = DIMENSION_IDS.some(
    (id) => dimensions[id].score === null || dimensions[id].inclination === 'insufficient',
  );
  const mixed = DIMENSION_IDS.some((id) => dimensions[id].inclination === 'mixed');
  const reasons: Localized[] = [];
  if (missing) {
    reasons.push(
      reason(
        'At least one axis does not have enough directional answers. The code still names a pole on every axis, treating a missing index as the midpoint (the right pole). It is not a settled classification.',
        '至少有一轴没有足够的方向性回答。代码仍会为每一轴标出一极：缺少指数时按中点处理，归入右极。这不是确定的分类。',
      ),
    );
  }
  if (mixed) {
    reasons.push(
      reason(
        'One or more axes are mixed or internally split. The code is the nearest pole on each axis, not a settled classification.',
        '有一轴或多轴处于混合或内部分裂。代码只是每一轴较近的一极，不是确定的分类。',
      ),
    );
  }
  if (reasons.length === 0) return { status: 'definitive', code, reasons: [] };
  return { status: 'provisional', code, reasons };
}

export function scoreAssessment(answers: Record<string, string>): AssessmentResult {
  const invalidAnswerIds: string[] = [];
  const accepted: Record<string, string> = {};
  for (const [questionId, optionId] of Object.entries(answers)) {
    const question = questionById.get(questionId);
    if (!question || !question.options.some((option) => option.id === optionId)) {
      invalidAnswerIds.push(questionId);
      continue;
    }
    accepted[questionId] = optionId;
  }

  const dimensions = Object.fromEntries(
    DIMENSION_IDS.map((id) => [id, scoreDimension(id, accepted)]),
  ) as Record<DimensionId, DimensionScore>;

  let answeredCount = 0;
  let skippedCount = 0;
  let uncertainCount = 0;
  for (const question of questions) {
    const selected = accepted[question.id];
    if (selected === undefined) {
      skippedCount += 1;
      continue;
    }
    answeredCount += 1;
    const option = question.options.find((item) => item.id === selected);
    if (option?.kind === 'uncertain') uncertainCount += 1;
  }

  const partial: AssessmentResult = {
    modelVersion: MODEL_VERSION,
    questionVersion: QUESTION_VERSION,
    dimensions,
    assignment: assignCode(dimensions),
    tensions: [],
    answeredCount,
    skippedCount,
    uncertainCount,
    totalQuestions: questions.length,
    invalidAnswerIds,
  };
  partial.tensions = activateTensions(partial);
  return partial;
}

export function primaryPoleAnswers(side: 'left' | 'right'): Record<string, string> {
  const answers: Record<string, string> = {};
  for (const question of questions) {
    const dimension = question.primaryDimension;
    if (!dimension) continue;
    let best: QuestionOption | null = null;
    let bestWeight = side === 'left' ? Infinity : -Infinity;
    for (const option of question.options) {
      const weight = option.weights?.[dimension];
      if (option.kind !== 'directional' || weight === undefined) continue;
      const better = side === 'left' ? weight < bestWeight : weight > bestWeight;
      if (better) {
        best = option;
        bestWeight = weight;
      }
    }
    if (best) answers[question.id] = best.id;
  }
  return answers;
}
