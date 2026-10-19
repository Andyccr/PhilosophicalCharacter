import { idealSeeds } from '@/data/archetypes/ideal-seeds';
import { physicalSeeds } from '@/data/archetypes/physical-seeds';
import { DIMENSION_IDS, POLE_LETTERS } from '@/lib/scoring/config';
import type { DimensionId, FamilyId, Localized, PoleSide } from '@/types/model';

/**
 * Catalog fields that the results island may bundle: code, name, thesis, family.
 * Worldview, strengths, standing issues, and other paid copy live in
 * `archetypes/index.ts` and must not be imported from client islands.
 */
const FAMILY_FROM_LETTERS: Record<string, FamilyId> = {
  MFI: 'explorers',
  MFC: 'harmonists',
  MCI: 'creators',
  MCC: 'pragmatists',
  IFI: 'seekers',
  IFC: 'guardians',
  ICI: 'transcendents',
  ICC: 'architects',
};

export const FAMILY_NAMES: Record<FamilyId, Localized> = {
  explorers: { en: 'Explorers', zh: '探问者' },
  harmonists: { en: 'Harmonists', zh: '协和者' },
  creators: { en: 'Creators', zh: '创作者' },
  pragmatists: { en: 'Pragmatists', zh: '实践者' },
  seekers: { en: 'Seekers', zh: '寻求者' },
  guardians: { en: 'Guardians', zh: '守护者' },
  transcendents: { en: 'Transcendents', zh: '超越者' },
  architects: { en: 'Architects', zh: '建筑师' },
};

export interface PublicType {
  code: string;
  name: Localized;
  thesis: Localized;
  familyId: FamilyId;
}

function familyIdFromCode(code: string): FamilyId {
  const key = `${code[0] ?? ''}${code[4] ?? ''}${code[5] ?? ''}`;
  const familyId = FAMILY_FROM_LETTERS[key];
  if (!familyId) throw new Error(`No family for ${code}`);
  return familyId;
}

export const publicTypes: PublicType[] = [...physicalSeeds, ...idealSeeds].map((seed) => ({
  code: seed.code,
  name: seed.name,
  thesis: seed.thesis,
  familyId: familyIdFromCode(seed.code),
}));

const byCode = new Map(publicTypes.map((item) => [item.code, item]));

export function getPublicType(code: string | null | undefined): PublicType | undefined {
  if (!code) return undefined;
  return byCode.get(code.toUpperCase());
}

export function polesFromPublicCode(code: string): Record<DimensionId, PoleSide> | undefined {
  const letters = code.toUpperCase().split('');
  if (letters.length !== DIMENSION_IDS.length) return undefined;
  const poles = {} as Record<DimensionId, PoleSide>;
  for (let index = 0; index < DIMENSION_IDS.length; index += 1) {
    const dimension = DIMENSION_IDS[index]!;
    const letter = letters[index];
    const marks = POLE_LETTERS[dimension];
    if (letter === marks.left) poles[dimension] = 'left';
    else if (letter === marks.right) poles[dimension] = 'right';
    else return undefined;
  }
  return poles;
}

export const AXIS_LABELS: Record<DimensionId, { plainName: Localized; leftPole: Localized; rightPole: Localized }> = {
  ontology: {
    plainName: { en: 'Reality', zh: '实在' },
    leftPole: { en: 'Physicalism', zh: '物理主义' },
    rightPole: { en: 'Idealism', zh: '观念论' },
  },
  epistemology: {
    plainName: { en: 'Knowledge', zh: '知识' },
    leftPole: { en: 'Empiricism', zh: '经验论' },
    rightPole: { en: 'Rationalism', zh: '理性论' },
  },
  ethics: {
    plainName: { en: 'Morality', zh: '道德' },
    leftPole: { en: 'Consequentialism', zh: '后果论' },
    rightPole: { en: 'Deontology', zh: '义务论' },
  },
  agency: {
    plainName: { en: 'Freedom', zh: '自由' },
    leftPole: { en: 'Determinism', zh: '决定论' },
    rightPole: { en: 'Libertarian free will', zh: '自由意志论' },
  },
  meaning: {
    plainName: { en: 'Meaning', zh: '意义' },
    leftPole: { en: 'Discovery', zh: '发现' },
    rightPole: { en: 'Creation', zh: '创造' },
  },
  society: {
    plainName: { en: 'Social life', zh: '社会生活' },
    leftPole: { en: 'Individual priority', zh: '个人优先' },
    rightPole: { en: 'Communal priority', zh: '共同体优先' },
  },
};
