import { DIMENSION_IDS, POLE_LETTERS, classifyInclination, poleFromIndex, scoringConfig } from '@/lib/scoring/config';
import type { Assignment, DimensionId, Localized } from '@/types/model';

const CODE = /^[MI][ER][CD][DL][FC][IC]$/;

export interface SharedProfile {
  scores: Record<DimensionId, number | null>;
  disagreement: Record<DimensionId, boolean>;
  assignment: Assignment;
}

function reason(en: string, zh: string): Localized {
  return { en, zh };
}

export function assignmentFromShared(
  scores: Record<DimensionId, number | null>,
  disagreement: Record<DimensionId, boolean>,
): Assignment {
  const dimensions = Object.fromEntries(
    DIMENSION_IDS.map((id) => {
      const score = scores[id];
      const inclination = classifyInclination({
        score,
        coverage: score === null ? 0 : 1,
        directionalCount: score === null ? 0 : scoringConfig.minDirectional,
        inconsistency: disagreement[id] ? scoringConfig.inconsistencyMixed : 0,
      });
      return [id, { score, inclination }];
    }),
  ) as Record<DimensionId, { score: number | null; inclination: ReturnType<typeof classifyInclination> }>;

  const letters = DIMENSION_IDS.map((id) => POLE_LETTERS[id][poleFromIndex(dimensions[id].score)]);
  const code = letters.join('');
  const missing = DIMENSION_IDS.some((id) => dimensions[id].score === null || dimensions[id].inclination === 'insufficient');
  const mixed = DIMENSION_IDS.some((id) => dimensions[id].inclination === 'mixed');
  const reasons: Localized[] = [];
  if (missing) {
    reasons.push(
      reason(
        'A shared view is missing a directional index. The code still names a pole on every axis, treating a missing index as the midpoint (the right pole).',
        '分享视图缺少一个方向指数。代码仍会为每一轴标出一极：缺少指数时按中点处理，归入右极。',
      ),
    );
  }
  if (mixed) {
    reasons.push(
      reason(
        'At least one shared index is mixed or marked as internally split. The code is only the nearest pole.',
        '至少有一个分享指数是混合的，或被标为内部分裂。代码只是较近的一极。',
      ),
    );
  }
  if (reasons.length === 0) return { status: 'definitive', code, reasons: [] };
  return { status: 'provisional', code, reasons };
}

export function buildShareHash(profile: SharedProfile): string {
  const scores = DIMENSION_IDS.map((id) => {
    const score = profile.scores[id];
    return score === null ? 'x' : String(score);
  }).join('.');
  const flags = DIMENSION_IDS.map((id) => (profile.disagreement[id] ? '1' : '0')).join('');
  return `v=1&n=${scores}&g=${flags}`;
}

export function parseShareHash(hash: string): SharedProfile | null {
  const body = hash.startsWith('#') ? hash.slice(1) : hash;
  const params = new URLSearchParams(body);
  if (params.get('v') !== '1') return null;
  const rawScores = params.get('n');
  const rawFlags = params.get('g');
  if (!rawScores || rawFlags === null || !/^[01]{6}$/.test(rawFlags)) return null;
  const pieces = rawScores.split('.');
  if (pieces.length !== 6) return null;
  const scores = {} as Record<DimensionId, number | null>;
  const disagreement = {} as Record<DimensionId, boolean>;
  for (let index = 0; index < DIMENSION_IDS.length; index += 1) {
    const id = DIMENSION_IDS[index];
    const piece = pieces[index];
    const flag = rawFlags[index];
    if (!id || piece === undefined || flag === undefined) return null;
    if (piece === 'x') scores[id] = null;
    else if (/^(100|[1-9]?\d)$/.test(piece)) scores[id] = Number(piece);
    else return null;
    disagreement[id] = flag === '1';
  }
  const assignment = assignmentFromShared(scores, disagreement);
  if (params.has('c')) {
    const claimed = params.get('c') ?? '';
    if (claimed !== '' && !CODE.test(claimed)) return null;
  }
  return { scores, disagreement, assignment };
}

export function shareUrl(origin: string, path: string, profile: SharedProfile): string {
  return `${origin}${path}#${buildShareHash(profile)}`;
}
