import { describe, expect, it } from 'vitest';
import { messages, tensionKindLabel } from '@/lib/localization/messages';
import type { TensionKind } from '@/types/model';

const kinds: TensionKind[] = [
  'logical-inconsistency',
  'philosophical-disagreement',
  'apparent-tension',
  'context-dependent',
  'unresolved-uncertainty',
];

const tensionKindKeys = [
  'tensionKindLogicalInconsistency',
  'tensionKindPhilosophicalDisagreement',
  'tensionKindApparentTension',
  'tensionKindContextDependent',
  'tensionKindUnresolvedUncertainty',
] as const;

const pr4RestorePrintKeys = [
  'restoreTitle',
  'restoreBody',
  'restoreEmail',
  'restoreOrder',
  'restoreAction',
  'restoreFailed',
  'printReport',
  'printHint',
] as const;

const makerReportKeys = [
  'reportTitle',
  'generatedOn',
  'languageName',
  'answeredLabel',
  'uncertainLabel',
  'reportIdLabel',
  'philosophersNote',
  'versionLabel',
  'printSavePdf',
] as const;

const pr6PendingCopy = {
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

describe('report UI strings for PR #4', () => {
  it('exposes restore/print keys PR #4 already reads', () => {
    for (const key of pr4RestorePrintKeys) {
      expect(messages.en[key].length).toBeGreaterThan(0);
      expect(messages.zh[key].length).toBeGreaterThan(0);
    }
  });

  it('exposes the nine Maker report keys under PR #4 names', () => {
    for (const key of makerReportKeys) {
      expect(messages.en[key].length).toBeGreaterThan(0);
      expect(messages.zh[key].length).toBeGreaterThan(0);
    }
    expect(messages.zh.reportTitle).toBe('哲学剖面报告');
    expect(messages.zh.generatedOn).toBe('生成日期');
    expect(messages.zh.languageName).toBe('中文');
    expect(messages.zh.languageLabel).toBe('语言');
    expect(messages.zh.answeredLabel).toBe('已答题目');
    expect(messages.zh.uncertainLabel).toBe('“我无法判断”');
    expect(messages.zh.reportIdLabel).toBe('报告编号');
    expect(messages.zh.philosophersNote).toBe(
      '列出的原因是其传统与这一代码的传统有交集。这种联系是主题性的，不是相似度分数。',
    );
    expect(messages.zh.versionLabel).toBe('模型 / 题库版本');
    expect(messages.zh.printSavePdf).toBe('打印 / 存为 PDF');
    expect(messages.en.printSavePdf).toBe('Print / Save as PDF');
  });

  it('uses philosophersRelated for the related-traditions heading', () => {
    expect(messages.zh.philosophersRelated).toBe('思想传统相近的哲学家');
    expect(messages.en.philosophersRelated).toBe('Philosophers from related traditions');
  });

  it('exposes PR #6 PENDING_COPY keys with the listed fallback wording', () => {
    for (const key of Object.keys(pr6PendingCopy) as Array<keyof typeof pr6PendingCopy>) {
      expect(messages.en[key]).toBe(pr6PendingCopy[key].en);
      expect(messages.zh[key]).toBe(pr6PendingCopy[key].zh);
    }
  });

  it('covers every TensionKind with the flat camelCase keys PR #4 will read', () => {
    for (const key of tensionKindKeys) {
      expect(messages.en[key].length).toBeGreaterThan(0);
      expect(messages.zh[key].length).toBeGreaterThan(0);
    }
    for (const kind of kinds) {
      expect(tensionKindLabel('en', kind)).toBeTruthy();
      expect(tensionKindLabel('zh', kind)).toBeTruthy();
    }
    expect(tensionKindLabel('en', 'apparent-tension')).toBe(messages.en.tensionKindApparentTension);
    expect(tensionKindLabel('zh', 'logical-inconsistency')).toBe(
      messages.zh.tensionKindLogicalInconsistency,
    );
  });
});
