import { describe, expect, it } from 'vitest';
import { nextIndexAfterChoice } from '@/lib/assessment/advance';
import { assessmentItems } from '@/data/questions/view';

describe('questionnaire advance', () => {
  it('moves forward until the last item, then stays', () => {
    expect(nextIndexAfterChoice(0, 48)).toBe(1);
    expect(nextIndexAfterChoice(46, 48)).toBe(47);
    expect(nextIndexAfterChoice(47, 48)).toBe(47);
    expect(nextIndexAfterChoice(-1, 48)).toBe(0);
    expect(nextIndexAfterChoice(0, 0)).toBe(0);
  });

  it('sends only the active locale’s wording to the questionnaire island', () => {
    const zh = assessmentItems('zh');
    const en = assessmentItems('en');
    expect(zh).toHaveLength(48);
    expect(zh[0]?.prompt).toMatch(/\p{Script=Han}/u);
    expect(en[0]?.prompt).toMatch(/physical process/i);
    expect(JSON.stringify(zh)).not.toContain('physical process');
    expect(JSON.stringify(en[0])).not.toContain('weights');
  });
});
