import { describe, expect, it } from 'vitest';
import { families } from '@/data/archetypes/families';
import { getPublicType } from '@/data/archetypes/public';
import { drawShareCard, type Canvas2D } from '@/lib/share-card/draw';
import { shareCardHost } from '@/lib/share-card/host';
import { buildShareCardInput } from '@/lib/share-card/input';
import { wrapLines } from '@/lib/share-card/text';
import { LAYOUTS, WITHHELD_CODE } from '@/lib/share-card/types';
import { assignmentFromShared, parseShareHash, type SharedProfile } from '@/lib/sharing/link';
import { DIMENSION_IDS } from '@/lib/scoring/config';

function shared(scores: Array<number | null>, flags = '000000'): SharedProfile {
  const profile = parseShareHash(`#v=1&n=${scores.map((score) => (score === null ? 'x' : String(score))).join('.')}&g=${flags}`);
  if (!profile) throw new Error('hash');
  return profile;
}

function recorder(): Canvas2D & { fills: string[]; texts: string[] } {
  const fills: string[] = [];
  const texts: string[] = [];
  const ctx: Canvas2D & { fills: string[]; texts: string[] } = {
    fills,
    texts,
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    font: '',
    textAlign: 'left',
    textBaseline: 'alphabetic',
    beginPath() {},
    closePath() {},
    moveTo() {},
    lineTo() {},
    arcTo() {},
    fill() {},
    stroke() {},
    fillRect() {
      fills.push(String(this.fillStyle));
    },
    fillText(text: string) {
      texts.push(text);
    },
    measureText(text: string) {
      return { width: [...text].length * 10 } as TextMetrics;
    },
  };
  return ctx;
}

describe('share card input', () => {
  it('uses public catalog fields and omits axis bars', () => {
    const profile = shared([12, 12, 12, 12, 12, 12]);
    expect(profile.assignment.status).toBe('definitive');
    expect(profile.assignment.code).toBe('MECDFI');
    const input = buildShareCardInput(profile, 'en', 'example.test');
    const published = getPublicType('MECDFI');
    expect(input.code).toBe('MECDFI');
    expect(input.title).toBe(published?.name.en);
    expect(input.family).toBe(families.explorers.name.en);
    expect(input.summary).toBe(families.explorers.rule.en);
    expect(input.summary).not.toBe(published?.thesis.en);
    expect(input.badge).toBe('DEFINITIVE PROFILE');
    expect(input.url).toBe('example.test');
    expect(input).not.toHaveProperty('rows');
    expect(JSON.stringify(input)).not.toContain('ont-01');
    expect(JSON.stringify(input)).not.toContain('worldview');
  });

  it('marks a provisional code with the outlined-badge copy and keeps the type name', () => {
    const profile = shared([45, 12, 12, 12, 12, 12]);
    expect(profile.assignment.status).toBe('provisional');
    const zh = buildShareCardInput(profile, 'zh', 'host.example');
    expect(zh.status).toBe('provisional');
    expect(zh.code).toBe(profile.assignment.code);
    expect(zh.badge).toBe('暂定的剖面');
    expect(zh.title).toBe(getPublicType(profile.assignment.code)?.name.zh);
  });

  it('uses withheld copy and em-dash code when no archetype is assigned', () => {
    const profile = shared([null, 12, 12, 12, 12, 12]);
    expect(profile.assignment.status).toBe('withheld');
    const input = buildShareCardInput(profile, 'en', 'host.example');
    expect(input.code).toBe(WITHHELD_CODE);
    expect(input.title).toBe('No archetype assigned');
    expect(input.family).toBe('');
    expect(input.summary).toContain('too little directional evidence');
  });

  it('rebuilds from a share hash without answers', () => {
    const parsed = parseShareHash('#v=1&n=88.88.88.88.88.88&g=000000');
    expect(parsed?.assignment.code).toBe('IRDLCC');
    const input = buildShareCardInput(parsed!, 'zh', 'philosophicalcharacter.andyycrccrhjuswcax.workers.dev');
    expect(input.family).toBe(families.architects.name.zh);
    expect(input.summary).toBe(families.architects.rule.zh);
    expect(JSON.stringify(input)).not.toContain('age-04');
  });
});

describe('share card host', () => {
  it('prefers the runtime host and never hardcodes the stale sample', () => {
    expect(shareCardHost('philosophicalcharacter.andyycrccrhjuswcax.workers.dev')).toBe(
      'philosophicalcharacter.andyycrccrhjuswcax.workers.dev',
    );
    expect(shareCardHost(undefined, 'https://philosophicalcharacter.andyycrccrhjuswcax.workers.dev/')).toBe(
      'philosophicalcharacter.andyycrccrhjuswcax.workers.dev',
    );
    expect(shareCardHost('localhost:4321', 'https://noema.andyccr.workers.dev')).toBe('localhost:4321');
    expect(shareCardHost()).not.toBe('noema.andyccr.workers.dev');
  });
});

describe('share card drawing', () => {
  it('paints public text at both sizes and does not draw tendency bars', () => {
    const input = buildShareCardInput(shared([12, 12, 12, 12, 12, 12]), 'en', 'results.example');
    for (const format of ['landscape', 'portrait'] as const) {
      const ctx = recorder();
      drawShareCard(ctx, input, format);
      const painted = ctx.texts.join('');
      expect(painted).toContain('NOEMA');
      expect(painted).toContain('MECDFI');
      expect(painted).toContain(input.title);
      expect(painted).toContain(input.family);
      expect(painted).toContain('results.example');
      expect(painted).not.toContain('track');
      expect(JSON.stringify(ctx.texts)).not.toContain('leftLetter');
      expect(LAYOUTS[format].width).toBe(format === 'landscape' ? 1200 : 1080);
    }
  });

  it('adds a superscript star only when the assignment is provisional', () => {
    const provisional = buildShareCardInput(shared([45, 12, 12, 12, 12, 12]), 'zh', 'host.example');
    const ctx = recorder();
    drawShareCard(ctx, provisional, 'landscape');
    expect(ctx.texts).toContain('*');
    const definitive = recorder();
    drawShareCard(definitive, buildShareCardInput(shared([12, 12, 12, 12, 12, 12]), 'en', 'host.example'), 'landscape');
    expect(definitive.texts).not.toContain('*');
  });
});

describe('share card wrapping', () => {
  it('clamps Han and Latin strings with an ellipsis', () => {
    const byCount = (text: string) => [...text].length;
    expect(wrapLines('abcdefghij', 5, 2, byCount).join('|')).toMatch(/…$/);
    expect(wrapLines('物理主义、被发现的意义，以及个人优先。', 8, 2, byCount)).toHaveLength(2);
    expect(wrapLines('物理主义、被发现的意义，以及个人优先。', 8, 2, byCount).at(-1)).toMatch(/…$/);
  });
});

describe('shared assignment helper still matches the card', () => {
  it('keeps DIMENSION_IDS order', () => {
    const scores = Object.fromEntries(DIMENSION_IDS.map((id) => [id, 12])) as SharedProfile['scores'];
    const flags = Object.fromEntries(DIMENSION_IDS.map((id) => [id, false])) as SharedProfile['disagreement'];
    expect(assignmentFromShared(scores, flags).code).toBe('MECDFI');
  });
});
