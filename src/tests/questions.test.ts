import { describe, expect, it } from 'vitest';
import { questions } from '@/data/questions/bank';
import { DIMENSION_IDS } from '@/lib/scoring/config';
import type { DimensionId } from '@/types/model';

describe('question bank', () => {
  it('has 48 unique questions', () => {
    expect(questions).toHaveLength(48);
    expect(new Set(questions.map((question) => question.id)).size).toBe(48);
  });

  it('has six primary questions on each dimension and twelve cross questions', () => {
    for (const dimension of DIMENSION_IDS) {
      const primary = questions.filter((question) => question.primaryDimension === dimension);
      expect(primary).toHaveLength(6);
      expect(primary.every((question) => question.dimensions.length === 1)).toBe(true);
    }
    const cross = questions.filter((question) => question.primaryDimension === undefined);
    expect(cross).toHaveLength(12);
    expect(cross.every((question) => question.dimensions.length >= 2)).toBe(true);
  });

  it('reaches both poles on every primary dimension', () => {
    for (const dimension of DIMENSION_IDS) {
      const weights = questions
        .filter((question) => question.primaryDimension === dimension)
        .flatMap((question) =>
          question.options.flatMap((option) => {
            const weight = option.weights?.[dimension];
            return weight === undefined ? [] : [weight];
          }),
        );
      expect(Math.min(...weights)).toBeLessThan(0);
      expect(Math.max(...weights)).toBeGreaterThan(0);
    }
  });

  it('keeps uncertainty and alternatives out of the weights', () => {
    for (const question of questions) {
      expect(question.version).toBe('1.0.0');
      expect(question.options.some((option) => option.kind === 'uncertain')).toBe(true);
      for (const option of question.options) {
        if (option.kind === 'uncertain' || option.kind === 'alternative') {
          expect(option.weights).toBeUndefined();
        }
        if (option.kind === 'alternative') expect(option.alternativeTag).toBeTruthy();
        if (option.kind === 'directional') {
          expect(option.weights).toBeTruthy();
          for (const [dimension, weight] of Object.entries(option.weights ?? {})) {
            expect(question.dimensions.includes(dimension as DimensionId)).toBe(true);
            expect(weight).toBeGreaterThanOrEqual(-2);
            expect(weight).toBeLessThanOrEqual(2);
          }
        }
        expect(option.label.en.trim().length).toBeGreaterThan(0);
        expect(option.label.zh.trim().length).toBeGreaterThan(0);
      }
      expect(question.prompt.zh).toMatch(/\p{Script=Han}/u);
    }
  });

  it('reverse-keys a substantial share of likert items', () => {
    const likert = questions.filter((question) => question.type === 'likert');
    const reversed = likert.filter((question) => question.reverseKeyed);
    expect(reversed.length / likert.length).toBeGreaterThanOrEqual(0.4);
    const sample = questions.find((question) => question.id === 'ont-01');
    expect(sample?.reverseKeyed).toBe(true);
    const agree = sample?.options.find((option) => option.id === 'sa');
    expect(agree?.weights?.ontology).toBe(-2);
  });
});
