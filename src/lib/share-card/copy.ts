import { messages, type Messages } from '@/lib/localization/messages';
import type { Locale } from '@/types/model';

/** Keys the results UI wants that are not yet in messages.ts. Listed in the PR for 程序员. */
export const PENDING_COPY = {
  lockedKicker: { en: 'Full report', zh: '完整报告' },
  lockedTitle: { en: 'What the full reading includes', zh: '完整解读仍封着' },
  lockedLead: {
    en: 'After a verified PayPal capture, the Worker returns the packaged reading. It is not on this page, and it is not on the share card.',
    zh: 'PayPal 扣款经 Worker 核实之后，才会返回这份打包的解读。它不在本页的免费预览里，也不会出现在分享卡片上。',
  },
  lockedItemAxes: {
    en: 'Directional indices on the six axes, with coverage and disagreement notes.',
    zh: '六个轴上的方向指数，以及覆盖与分歧说明。',
  },
  lockedItemTensions: {
    en: 'Tension notes for combinations this profile has to sit with.',
    zh: '这一组合需要坐下来看的张力说明。',
  },
  lockedItemPhilosophers: {
    en: 'Philosophers from related traditions, described in words as thematic neighbors. This is not a similarity score.',
    zh: '思想传统相近的哲学家，用文字说明他们是主题上的近邻。这不是相似分数。',
  },
  lockedItemWorldview: {
    en: 'The worldview essay, pairing pressure, and questions for reflection.',
    zh: '世界观短文、配对中的压力，以及供反省的问题。',
  },
  lockedItemReadings: {
    en: 'A short reading list. Related traditions are described in words, never as a similarity score.',
    zh: '一份短的阅读书目。相关传统用文字说明，不会给出相似度。',
  },
  shareCardTitle: { en: 'Share card', zh: '分享卡片' },
  shareLandscape: { en: 'Landscape 1200×630', zh: '横向 1200×630' },
  sharePortrait: { en: 'Portrait 1080×1440', zh: '竖向 1080×1440' },
  downloadLandscape: { en: 'Download landscape PNG', zh: '下载横向 PNG' },
  downloadPortrait: { en: 'Download portrait PNG', zh: '下载竖向 PNG' },
  shareCardShare: { en: 'Share the card', zh: '分享卡片' },
  shareCardHint: {
    en: 'Drawn on this device from the score link. It never includes answers or paid copy.',
    zh: '在这台设备上按分数链接绘制。它不包含回答，也不包含付费文案。',
  },
} as const;

export type PendingCopyKey = keyof typeof PENDING_COPY;

export function msg(locale: Locale, key: keyof Messages): string {
  return messages[locale][key];
}

export function pending(locale: Locale, key: PendingCopyKey): string {
  const table = messages[locale] as Record<string, string>;
  const value = table[key];
  if (typeof value === 'string' && value.length > 0) return value;
  return PENDING_COPY[key][locale];
}
