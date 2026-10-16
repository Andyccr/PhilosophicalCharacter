import { describe, expect, it } from 'vitest';
import { archetypes, archetypesInFamily } from '@/data/archetypes';
import { FAMILY_ORDER, families } from '@/data/archetypes/families';
import { allCodes } from '@/data/archetypes/compose';
import { philosophers } from '@/data/philosophers/profiles';
import { traditions } from '@/data/traditions/catalog';
import { articles, glossary } from '@/data/articles/catalog';
import { experiments } from '@/data/experiments/catalog';
import { tensionRules } from '@/data/tensions/rules';
import { primaryPoleAnswers, scoreAssessment } from '@/lib/scoring/score';

const requiredPhilosophers = [
  'plato',
  'aristotle',
  'descartes',
  'locke',
  'hume',
  'kant',
  'mill',
  'nietzsche',
  'kierkegaard',
  'sartre',
  'camus',
  'beauvoir',
  'arendt',
  'rawls',
  'nagel',
  'confucius',
  'mencius',
  'zhuangzi',
  'mozi',
  'nagarjuna',
];

describe('archetypes and content', () => {
  it('covers every code exactly once', () => {
    expect(archetypes.map((archetype) => archetype.code)).toEqual(allCodes());
    expect(new Set(archetypes.map((item) => item.thesis.en)).size).toBe(64);
    expect(new Set(archetypes.map((item) => item.name.zh)).size).toBe(64);
  });

  it('maps families by the documented three-axis rule', () => {
    for (const family of FAMILY_ORDER) {
      expect(archetypesInFamily(family)).toHaveLength(8);
      expect(families[family].essay.zh).toMatch(/\p{Script=Han}/u);
    }
    expect(archetypes.find((item) => item.code === 'MECDFI')?.familyId).toBe('explorers');
    expect(archetypes.find((item) => item.code === 'IRDLCC')?.familyId).toBe('architects');
  });

  it('includes the required philosophers and non-Western traditions', () => {
    expect(philosophers.map((philosopher) => philosopher.slug).sort()).toEqual([...requiredPhilosophers].sort());
    for (const philosopher of philosophers) {
      expect(philosopher.biography.en.length).toBeGreaterThan(120);
      expect(philosopher.biography.zh).toMatch(/\p{Script=Han}/u);
      expect(philosopher.references.length).toBeGreaterThan(0);
      expect(philosopher.works.length).toBeGreaterThan(0);
    }
    expect(traditions.map((tradition) => tradition.slug)).toEqual(
      expect.arrayContaining(['confucianism', 'mohism', 'madhyamaka', 'daoist-philosophy']),
    );
    expect(experiments.length).toBeGreaterThanOrEqual(6);
    expect(articles.length).toBeGreaterThanOrEqual(6);
    expect(glossary.length).toBeGreaterThanOrEqual(12);
  });

  it('activates the named tensions for the profiles that should trigger them', () => {
    const left = scoreAssessment(primaryPoleAnswers('left'));
    const right = scoreAssessment(primaryPoleAnswers('right'));
    expect(left.tensions.map((tension) => tension.id)).toContain('determinism-responsibility');
    expect(left.tensions.map((tension) => tension.id)).toContain('consequentialism-rights');
    expect(right.tensions.map((tension) => tension.id)).toContain('created-meaning-objective-duty');
    expect(tensionRules.some((rule) => rule.kind === 'logical-inconsistency')).toBe(false);
    expect(new Set(tensionRules.map((rule) => rule.kind)).size).toBeGreaterThanOrEqual(4);
  });
});
