import type { ActivatedTension, AssessmentResult, DimensionId, TensionKind } from '@/types/model';

export interface TensionDetector {
  id: string;
  kind: TensionKind;
  dimensions: DimensionId[];
  activates: (result: AssessmentResult) => boolean;
}

/** Predicates only. Copy for each id lives in `rules.ts` (Worker / SSG). */
export const tensionDetectors: TensionDetector[] = [
  {
    id: 'determinism-responsibility',
    kind: 'apparent-tension',
    dimensions: ['agency', 'ethics'],
    activates: (result) =>
      result.dimensions.agency.inclination === 'left' &&
      (result.dimensions.agency.alternativeTags.compatibilism ?? 0) === 0 &&
      result.dimensions.ethics.directionalCount >= 3,
  },
  {
    id: 'consequentialism-rights',
    kind: 'philosophical-disagreement',
    dimensions: ['ethics', 'society'],
    activates: (result) =>
      result.dimensions.ethics.inclination === 'left' && result.dimensions.society.inclination === 'left',
  },
  {
    id: 'rationalism-uncertainty',
    kind: 'unresolved-uncertainty',
    dimensions: ['epistemology'],
    activates: (result) =>
      result.dimensions.epistemology.inclination === 'right' &&
      result.dimensions.epistemology.uncertainCount >= 2,
  },
  {
    id: 'created-meaning-objective-duty',
    kind: 'apparent-tension',
    dimensions: ['meaning', 'ethics'],
    activates: (result) =>
      result.dimensions.meaning.inclination === 'right' && result.dimensions.ethics.inclination === 'right',
  },
  {
    id: 'autonomy-communion',
    kind: 'context-dependent',
    dimensions: ['society'],
    activates: (result) => {
      const social = result.dimensions.society;
      return (
        social.inclination === 'mixed' ||
        (social.inconsistency !== null && social.inconsistency >= 0.45 && social.directionalCount >= 3)
      );
    },
  },
  {
    id: 'physicalism-consciousness',
    kind: 'apparent-tension',
    dimensions: ['ontology'],
    activates: (result) =>
      result.dimensions.ontology.inclination === 'left' &&
      result.dimensions.ontology.inconsistency !== null &&
      result.dimensions.ontology.inconsistency >= 0.35,
  },
  {
    id: 'compatibilist-responsibility',
    kind: 'philosophical-disagreement',
    dimensions: ['agency'],
    activates: (result) => (result.dimensions.agency.alternativeTags.compatibilism ?? 0) >= 1,
  },
  {
    id: 'nihilist-meaning',
    kind: 'unresolved-uncertainty',
    dimensions: ['meaning'],
    activates: (result) => (result.dimensions.meaning.alternativeTags.nihilism ?? 0) >= 1,
  },
];

const byId = new Map(tensionDetectors.map((detector) => [detector.id, detector]));

export function detectorById(id: string): TensionDetector['activates'] {
  const detector = byId.get(id);
  if (!detector) throw new Error(`Unknown tension detector ${id}`);
  return detector.activates;
}

export function activateTensions(result: AssessmentResult): ActivatedTension[] {
  return tensionDetectors
    .filter((detector) => detector.activates(result))
    .map((detector) => ({
      id: detector.id,
      kind: detector.kind,
      dimensions: detector.dimensions,
    }));
}
