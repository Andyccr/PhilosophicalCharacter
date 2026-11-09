import { describe, expect, it } from 'vitest';
import { allCodes } from '@/data/archetypes/compose';
import { featuredPhilosopher, rankPhilosophers } from '@/lib/interpretation/correspondence';

describe('philosopher correspondence', () => {
  it('gives every six-letter code at least one matching philosopher', () => {
    for (const code of allCodes()) {
      const ranked = rankPhilosophers(code);
      expect(ranked.length, code).toBeGreaterThan(0);
      expect(featuredPhilosopher(code)?.slug, code).toBeTruthy();
    }
  });
});
