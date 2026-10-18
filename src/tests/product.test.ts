import { describe, expect, it } from 'vitest';
import { clearSession, readSession, writeSession, type StorageLike } from '@/lib/storage/session';
import { parseShareHash, shareUrl } from '@/lib/sharing/link';
import { shareCardSvg } from '@/lib/sharing/card';
import { PREMIUM_PRODUCT } from '@/lib/payment/provider';
import { localePath } from '@/lib/localization/path';
import { primaryPoleAnswers, scoreAssessment } from '@/lib/scoring/score';
import { DIMENSION_IDS } from '@/lib/scoring/config';

function memory(): StorageLike {
  const data = new Map<string, string>();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
    removeItem: (key) => {
      data.delete(key);
    },
  };
}

describe('persistence, sharing, and payment', () => {
  it('round-trips a session and reports corrupt data', () => {
    const storage = memory();
    expect(readSession(storage).ok).toBe(false);
    const saved = writeSession(storage, {
      modelVersion: '1.0.0',
      questionVersion: '1.0.0',
      locale: 'zh',
      index: 4,
      answers: { 'ont-01': 'sa' },
      updatedAt: '2026-10-14T00:00:00.000Z',
    });
    expect(saved.ok).toBe(true);
    const read = readSession(storage);
    expect(read.ok).toBe(true);
    if (read.ok) expect(read.session.index).toBe(4);
    storage.setItem('noema.assessment.v1', '{');
    expect(readSession(storage)).toEqual({ ok: false, reason: 'corrupt' });
    expect(clearSession(storage).ok).toBe(true);
    expect(readSession(storage)).toEqual({ ok: false, reason: 'empty' });
  });

  it('shares scores without question ids', () => {
    const result = scoreAssessment(primaryPoleAnswers('right'));
    const profile = {
      scores: Object.fromEntries(DIMENSION_IDS.map((id) => [id, result.dimensions[id].score])) as Record<
        (typeof DIMENSION_IDS)[number],
        number | null
      >,
      disagreement: Object.fromEntries(DIMENSION_IDS.map((id) => [id, false])) as Record<
        (typeof DIMENSION_IDS)[number],
        boolean
      >,
      assignment: result.assignment,
    };
    const url = shareUrl('https://noema.example', localePath('zh', '/results'), profile);
    expect(url).toContain('/results#');
    expect(url).not.toContain('ont-01');
    expect(url).not.toContain('age-04');
    const parsed = parseShareHash(url.split('#')[1] ?? '');
    expect(parsed?.assignment).toMatchObject({ status: 'definitive', code: 'IRDLCC' });
    expect(localePath('zh', '/types/mecdfl')).toBe('/types/mecdfl');
    expect(localePath('en', '/types/mecdfl')).toBe('/en/types/mecdfl');
    expect(localePath('zh', '/')).toBe('/');
    expect(localePath('en', '/')).toBe('/en');
  });

  it('renders a share card without private answers', () => {
    const svg = shareCardSvg({
      kicker: 'NOEMA',
      title: 'Measured Inquirer <script>',
      code: 'MECDFI',
      family: 'Explorers',
      summary: 'A public summary.',
      rows: [{ label: 'Reality', value: '0' }],
      disclaimer: 'Not a diagnosis.',
      badge: 'Definitive',
    });
    expect(svg).toContain('MECDFI');
    expect(svg).toContain('Not a diagnosis.');
    expect(svg).toContain('&lt;script&gt;');
    expect(svg).not.toContain('ont-01');
  });

  it('lists the premium product without inventing a paid status', () => {
    expect(PREMIUM_PRODUCT).toEqual({
      id: 'noema-report',
      priceEur: 4.99,
      currency: 'EUR',
      amount: '4.99',
    });
    expect(JSON.stringify(PREMIUM_PRODUCT)).not.toContain('paid');
    expect(JSON.stringify(PREMIUM_PRODUCT)).not.toContain('success');
  });
});
