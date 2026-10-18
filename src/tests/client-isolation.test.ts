import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { PaidContent } from '../../worker/content/profile';
import { primaryPoleAnswers, scoreAssessment } from '@/lib/scoring/score';
import { freePreview } from '@/lib/interpretation/preview';

const islandFiles = [
  'src/components/results/ResultsApp.tsx',
  'src/components/results/PremiumPreview.tsx',
  'src/components/results/Paywall.tsx',
  'src/components/results/FreePreview.tsx',
  'src/components/results/LockedReport.tsx',
  'src/components/results/CompareApp.tsx',
  'src/components/results/share-card/ShareCard.tsx',
  'src/lib/share-card/input.ts',
  'src/lib/share-card/catalog.ts',
  'src/lib/share-card/draw.ts',
];

describe('paid copy stays off the results islands', () => {
  it('does not import archetype essays, dimension essays, or tension copy', () => {
    const sources = islandFiles.map((file) => readFileSync(file, 'utf8')).join('\n');
    expect(sources).not.toMatch(/from '@\/data\/archetypes'/);
    expect(sources).not.toContain("from '@/data/dimensions'");
    expect(sources).not.toContain("from '@/data/tensions/rules'");
    expect(sources).not.toContain("from '@/data/tensions/standing'");
    expect(sources).not.toContain("from '@/lib/interpretation/describe'");
    expect(sources).not.toContain('paypal.com/ncp/payment');
    expect(sources).not.toContain('noema.andyccr.workers.dev');
  });

  it('free preview is code, family, and summary without axis indices', () => {
    const result = scoreAssessment(primaryPoleAnswers('right'));
    const preview = freePreview('en', result.assignment, 'withheld');
    expect(preview.code).toBe('IRDLCC');
    expect(preview.familyId).toBe('architects');
    expect(preview.provisional).toBe(false);
    expect(preview.familyName).toBe('Architects');
    expect(preview.summary?.length).toBeGreaterThan(40);
    expect(JSON.stringify(preview)).not.toContain('directional');
    expect(preview).not.toHaveProperty('axes');
  });

  it('Worker assembler returns narratives only after a profile request', () => {
    const result = scoreAssessment(primaryPoleAnswers('left'));
    const paid = PaidContent.assemble({
      locale: 'en',
      assignment: result.assignment,
      dimensions: Object.fromEntries(
        Object.entries(result.dimensions).map(([id, row]) => [
          id,
          {
            score: row.score,
            inclination: row.inclination,
            inconsistency: row.inconsistency,
            directionalCount: row.directionalCount,
            applicableCount: row.applicableCount,
          },
        ]),
      ) as Parameters<typeof PaidContent.assemble>[0]['dimensions'],
      tensionIds: result.tensions.map((tension) => tension.id),
    });
    expect(paid.code).toBe('MECDFI');
    expect(paid.axes).toHaveLength(6);
    expect(paid.worldview.length).toBeGreaterThan(0);
    expect(paid.tensions.some((item) => item.id === 'determinism-responsibility')).toBe(true);
  });
});
