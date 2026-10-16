import { describe, expect, it } from 'vitest';
import { questions } from '@/data/questions/bank';
import { DIMENSION_IDS, classifyInclination } from '@/lib/scoring/config';
import { primaryPoleAnswers, scoreAssessment } from '@/lib/scoring/score';

describe('scoring', () => {
  it('classifies the documented thresholds', () => {
    const base = { coverage: 1, directionalCount: 6, inconsistency: 0 };
    expect(classifyInclination({ ...base, score: 39 })).toBe('left');
    expect(classifyInclination({ ...base, score: 40 })).toBe('mixed');
    expect(classifyInclination({ ...base, score: 60 })).toBe('mixed');
    expect(classifyInclination({ ...base, score: 61 })).toBe('right');
    expect(classifyInclination({ ...base, score: 50 })).toBe('mixed');
    expect(classifyInclination({ ...base, score: null })).toBe('insufficient');
    expect(classifyInclination({ score: 10, coverage: 0.2, directionalCount: 1, inconsistency: 0 })).toBe('insufficient');
    expect(classifyInclination({ ...base, score: 30, inconsistency: 0.5 })).toBe('mixed');
    expect(classifyInclination({ ...base, score: 10, inconsistency: 0.8 })).toBe('left');
  });

  it('scores a full left primary profile at 0 and a full right profile at 100', () => {
    const left = scoreAssessment(primaryPoleAnswers('left'));
    const right = scoreAssessment(primaryPoleAnswers('right'));
    for (const dimension of DIMENSION_IDS) {
      expect(left.dimensions[dimension].score).toBe(0);
      expect(left.dimensions[dimension].inclination).toBe('left');
      expect(right.dimensions[dimension].score).toBe(100);
      expect(right.dimensions[dimension].inclination).toBe('right');
    }
    expect(left.assignment).toMatchObject({ status: 'definitive', code: 'MECDFI' });
    expect(right.assignment).toMatchObject({ status: 'definitive', code: 'IRDLCC' });
  });

  it('does not treat skips or uncertainty as 50', () => {
    const skipped = scoreAssessment({});
    const uncertain = scoreAssessment(Object.fromEntries(questions.map((question) => [question.id, 'u'])));
    for (const dimension of DIMENSION_IDS) {
      expect(skipped.dimensions[dimension].score).toBeNull();
      expect(uncertain.dimensions[dimension].score).toBeNull();
      expect(uncertain.dimensions[dimension].uncertainCount).toBeGreaterThan(0);
    }
    expect(skipped.assignment.status).toBe('withheld');
    expect(uncertain.assignment.status).toBe('withheld');
    expect(skipped.assignment.code).toBeNull();
  });

  it('is deterministic and ignores unknown answers', () => {
    const answers = { ...primaryPoleAnswers('left'), 'not-a-question': 'a', 'ont-01': 'nope' };
    const first = scoreAssessment(answers);
    const second = scoreAssessment(answers);
    expect(first).toEqual(second);
    expect([...first.invalidAnswerIds].sort()).toEqual(['not-a-question', 'ont-01']);
  });

  it('records compatibilist answers without moving them to the midpoint', () => {
    const answers = primaryPoleAnswers('left');
    answers['age-04'] = 'c';
    const result = scoreAssessment(answers);
    expect(result.dimensions.agency.alternativeTags.compatibilism).toBe(1);
    expect(result.tensions.some((tension) => tension.id === 'compatibilist-responsibility')).toBe(true);
    expect(result.dimensions.agency.score).not.toBe(50);
  });
});
