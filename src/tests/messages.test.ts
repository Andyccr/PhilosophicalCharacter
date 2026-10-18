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

  it('uses philosophersRelated for the nearby-traditions heading', () => {
    expect(messages.zh.philosophersRelated).toBe('思想传统相近的哲学家');
    expect(messages.en.philosophersRelated).toBe('Philosophers from nearby traditions');
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
