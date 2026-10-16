import { DIMENSION_IDS, POLE_LETTERS, classifyInclination, nearestSide, scoringConfig } from '@/lib/scoring/config';
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

  if (DIMENSION_IDS.some((id) => dimensions[id].score === null || dimensions[id].inclination === 'insufficient')) {
    return {
      status: 'withheld',
      code: null,
      reasons: [
        reason(
          'A shared view is missing a directional index, so no archetype is assigned from it.',
          '分享视图缺少一个方向指数，因此不据此指派原型。',
        ),
      ],
    };
  }

  const letters: string[] = [];
  for (const id of DIMENSION_IDS) {
    const score = dimensions[id].score;
    if (score === null) {
      return { status: 'withheld', code: null, reasons: [] };
    }
    const side = nearestSide(score);
    if (side === null) {
      return {
        status: 'withheld',
        code: null,
        reasons: [
          reason(
            'An index sits at the midpoint, so the shared view has no nearest pole.',
            '有一个指数落在中点，因此分享视图没有较近的一极。',
          ),
        ],
      };
    }
    letters.push(POLE_LETTERS[id][side]);
  }

  const code = letters.join('');
  if (DIMENSION_IDS.some((id) => dimensions[id].inclination === 'mixed')) {
    return {
      status: 'provisional',
      code,
      reasons: [
        reason(
          'At least one shared index is mixed or marked as internally split. The code is only the nearest pole.',
          '至少有一个分享指数是混合的，或被标为内部分裂。代码只是较近的一极。',
        ),
      ],
    };
  }
  return { status: 'definitive', code, reasons: [] };
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
