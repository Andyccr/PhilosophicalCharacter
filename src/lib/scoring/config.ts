import type { DimensionId, Inclination, Localized } from '@/types/model';

export const MODEL_VERSION = '1.0.0';

/**
 * Design thresholds, not empirically validated cutoffs.
 * Classification uses the rounded directional index.
 *
 * - index < 40: left pole
 * - 40–60: mixed
 * - index > 60: right pole
 *
 * A score of 50 is the modeled midpoint of answered directional items.
 * It is not neutrality, and it is not produced by skipping or by "I cannot determine".
 */
export const scoringConfig = {
  leftMaxExclusive: 40,
  rightMinExclusive: 60,
  midpoint: 50,
  minCoverage: 0.5,
  minDirectional: 3,
  inconsistencyMixed: 0.5,
  inconsistencyBand: { min: 25, max: 75 },
} as const;

export const DIMENSION_IDS = [
  'ontology',
  'epistemology',
  'ethics',
  'agency',
  'meaning',
  'society',
] as const satisfies readonly DimensionId[];

export const POLE_LETTERS: Record<DimensionId, { left: string; right: string }> = {
  ontology: { left: 'M', right: 'I' },
  epistemology: { left: 'E', right: 'R' },
  ethics: { left: 'C', right: 'D' },
  agency: { left: 'D', right: 'L' },
  meaning: { left: 'F', right: 'C' },
  society: { left: 'I', right: 'C' },
};

export function roundIndex(raw: number): number {
  return Math.round(raw);
}

export function classifyInclination(input: {
  score: number | null;
  coverage: number;
  directionalCount: number;
  inconsistency: number | null;
}): Inclination {
  if (
    input.score === null ||
    input.directionalCount < scoringConfig.minDirectional ||
    input.coverage < scoringConfig.minCoverage
  ) {
    return 'insufficient';
  }
  const split =
    input.inconsistency !== null &&
    input.inconsistency >= scoringConfig.inconsistencyMixed &&
    input.score > scoringConfig.inconsistencyBand.min &&
    input.score < scoringConfig.inconsistencyBand.max;
  if (split) return 'mixed';
  if (input.score < scoringConfig.leftMaxExclusive) return 'left';
  if (input.score > scoringConfig.rightMinExclusive) return 'right';
  return 'mixed';
}

export function nearestSide(score: number): 'left' | 'right' {
  return score < scoringConfig.midpoint ? 'left' : 'right';
}

/** Missing indices are treated as the midpoint so a six-letter code can always be named. */
export function poleFromIndex(score: number | null): 'left' | 'right' {
  return nearestSide(score === null ? scoringConfig.midpoint : score);
}

export const scoringDocumentation: Array<{ heading: Localized; body: Localized }> = [
  {
    heading: { en: 'What the index is', zh: '这个指数是什么' },
    body: {
      en: 'Each axis is reported on a directional index from 0 to 100. Zero is the strongest modeled inclination toward the left pole. One hundred is the strongest modeled inclination toward the right pole. Fifty is the midpoint of the directional answers that were actually given. It is not a measure of neutrality, maturity, or uncertainty.',
      zh: '每一轴都用 0 到 100 的方向指数来呈现。0 表示模型所记录的、朝向左极的最强倾向；100 表示朝向右极的最强倾向。50 是已作答的方向性回答的中点，并不表示中立、成熟或不确定。',
    },
  },
  {
    heading: { en: 'What is left out of the number', zh: '什么不进入这个数字' },
    body: {
      en: 'A skipped question is unanswered. “I cannot determine” is a recorded response, counted separately, and it does not move the index. Neither one is entered as 50. Some answers are tagged as alternative positions, such as compatibilism or a nihilist reading of meaning. Those answers are also kept out of the index, because forcing them onto a pole would misdescribe them.',
      zh: '跳过的题目算作未答。“我无法判断”会被记下，并单独计数，但它不推动指数。二者都不会被记成 50。有些回答被标为替代立场，例如相容论，或对意义的虚无主义理解。这些回答也不进入指数，因为把它们硬塞进某一极会歪曲它们。',
    },
  },
  {
    heading: { en: 'How an answer moves an axis', zh: '一个回答如何推动一轴' },
    body: {
      en: 'Directional options carry integer weights on one or more axes. A positive weight pulls toward that axis’s right pole; a negative weight pulls toward the left pole. For the questions you answered directionally, the index rescales the sum of chosen weights against the most left-leaning and most right-leaning options on those same questions. Unanswered and non-directional responses do not sit in the denominator as if they were midpoints. The displayed index is that rescaled value, rounded to the nearest integer.',
      zh: '方向性选项在一个或多个轴上带有整数权重。正权重拉向该轴的右极，负权重拉向左极。指数只在你作出方向性回答的题目上，把所选权重之和，重新标度到这些题目最左与最右选项之间。未答和非方向性回答不会被放进分母、假装它们是中点。显示的指数是这一标度值四舍五入后的整数。',
    },
  },
  {
    heading: { en: 'Coverage, disagreement, and classification', zh: '覆盖、分歧与归类' },
    body: {
      en: 'Coverage is the share of applicable questions that received a directional answer. Disagreement is a descriptive ratio: one minus the absolute signed weight divided by the total absolute weight. It is not a probability and it is not a confidence percentage. Provisional thresholds, which are design assumptions, are: below 40, left pole; 40 to 60, mixed; above 60, right pole. If disagreement is at least 0.5 and the index lies strictly between 25 and 75, the axis is treated as mixed even when the index would otherwise fall outside 40 to 60. An axis is insufficient when there is no directional score, when fewer than three directional answers were given, or when coverage is under one half.',
      zh: '覆盖率是适用题目中得到方向性回答的比例。分歧是一个描述性比值：一减去“有符号权重的绝对值”除以“权重绝对值之和”。它不是概率，也不是置信百分比。暂定的阈值只是设计上的假定：低于 40 为左极，40 至 60 为混合，高于 60 为右极。若分歧至少为 0.5，且指数严格落在 25 与 75 之间，则即使指数本会落在 40 至 60 之外，该轴仍视为混合。若没有方向性分数、方向性回答少于三则，或覆盖率低于一半，该轴视为证据不足。',
    },
  },
  {
    heading: { en: 'From six indices to a code', zh: '从六个指数到一个代码' },
    body: {
      en: 'The six-letter code is a separate step from the numerical profile. On each axis the code names the nearer pole: an index below 50 is the left pole, and an index of 50 or above is the right pole. If every axis then falls clearly left or right, the code is definitive. If one or more axes are mixed, sit at 50, or lack a directional index, the code is still given and marked provisional. A missing index is treated as the midpoint for the code only; the numerical index itself still does not treat a skip or “I cannot determine” as 50. The eight families are an editorial map of ontology, meaning, and social priority. They are not discovered personality clusters.',
      zh: '六字母代码与数值剖面是分开的一步。每一轴的代码标出较近的一极：指数低于 50 归入左极，等于或高于 50 归入右极。若每一轴都明确落在左极或右极，代码是确定的。若有一轴或多轴处于混合、正好是 50，或缺少方向指数，代码仍会给出，并标为暂定。缺少指数时，只在生成代码时按中点处理；数值指数本身仍不会把跳过或“我无法判断”记成 50。八个家族是依据本体论、意义与社会优先所作的编辑分组，不是被发现的人格聚类。',
    },
  },
  {
    heading: { en: 'How this model could later be examined', zh: '这个模型以后可以怎样被检验' },
    body: {
      en: 'Nothing in the current release estimates reliability, validity, or population norms. A later study could preregister the item bank, recruit a sample that is not only self-selected website visitors, and report item difficulty and discrimination, test-retest stability, translation equivalence, and whether the six proposed axes are recoverable as dimensions. Cognitive interviews could test whether respondents understand each item as the editors intend. Differential item functioning could compare the English and Chinese wordings. Thresholds at 40 and 60 should be replaced only by cutoffs justified by that evidence. Until such a dataset exists, NOEMA does not report percentile ranks or confidence percentages. The present instrument is an exploratory philosophical questionnaire.',
      zh: '当前版本不估计信度、效度或人群常模。以后的研究可以预先登记题库，招募不只是网站自选访客的样本，并报告项目难度与区分度、重测稳定性、翻译等值性，以及所提出的六轴能否作为维度被恢复。认知访谈可以检验受访者是否按编者的意图理解题目。项目功能差异分析可以比较中英文表述。40 与 60 的阈值，只有在那种证据支持下才应被替换。在这样的数据存在之前，NOEMA 不报告百分位，也不报告置信百分比。目前的工具是一份探索性的哲学问卷。',
    },
  },
];
