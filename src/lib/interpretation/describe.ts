import { dimensions } from '@/data/dimensions';
import type { DimensionScore, Inclination, Locale, Localized } from '@/types/model';

const inclinationLabel: Record<Inclination, Localized> = {
  left: { en: 'Toward the left pole', zh: '朝向左极' },
  right: { en: 'Toward the right pole', zh: '朝向右极' },
  mixed: { en: 'Mixed on this axis', zh: '这一轴上是混合的' },
  insufficient: { en: 'Not enough directional answers', zh: '方向性回答不足' },
};

export function disagreementLabel(score: DimensionScore, locale: Locale): string {
  if (score.inconsistency === null) {
    return locale === 'zh' ? '可比较的回答还不足以描述分歧。' : 'There are not enough comparable answers to describe disagreement.';
  }
  if (score.inconsistency < 0.25) {
    return locale === 'zh' ? '这一轴上的回答大体同向。' : 'Answers on this axis mostly agree in direction.';
  }
  if (score.inconsistency < 0.5) {
    return locale === 'zh' ? '有一些回答拉向另一边。' : 'Some answers pull the other way.';
  }
  return locale === 'zh' ? '这一轴上的回答明显拉向两边。' : 'Answers on this axis pull in both directions.';
}

export function describeScore(score: DimensionScore, locale: Locale): string {
  const dimension = dimensions[score.dimension];
  const lean = inclinationLabel[score.inclination][locale];
  if (score.score === null) return `${dimension.plainName[locale]}：${lean}`;
  const pole =
    score.inclination === 'left'
      ? dimension.leftPole[locale]
      : score.inclination === 'right'
        ? dimension.rightPole[locale]
        : locale === 'zh'
          ? '未单侧落定'
          : 'not settled on one side';
  return locale === 'zh'
    ? `${dimension.plainName[locale]}：方向指数 ${score.score}，${lean}（${pole}）。`
    : `${dimension.plainName[locale]}: directional index ${score.score}, ${lean.toLowerCase()} (${pole}).`;
}

export function narrativeFor(score: DimensionScore, locale: Locale): string {
  const dimension = dimensions[score.dimension];
  if (score.inclination === 'left') return dimension.leftEssay[locale];
  if (score.inclination === 'right') return dimension.rightEssay[locale];
  if (score.inclination === 'mixed') return dimension.mixedEssay[locale];
  return locale === 'zh'
    ? '这一轴没有足够的方向性回答来形成一段解释。跳过和“我无法判断”没有被算成中点。'
    : 'This axis does not have enough directional answers for an interpretation. Skips and “I cannot determine” were not counted as a midpoint.';
}
