import {
  allCodes,
  blindSpotsFor,
  codeFromPoles,
  familyOfCode,
  polesFromCode,
  pressureFor,
  reflectionFor,
  worldviewFor,
  strengthsFor,
} from '@/data/archetypes/compose';
import { families } from '@/data/archetypes/families';
import { idealSeeds } from '@/data/archetypes/ideal-seeds';
import { physicalSeeds } from '@/data/archetypes/physical-seeds';
import { readingsFor, traditionsFor } from '@/data/readings';
import { standingIssuesFor } from '@/data/tensions/standing';
import { POLE_LETTERS } from '@/lib/scoring/config';
import type { Archetype, ArchetypeSeed, DimensionId } from '@/types/model';

const seeds: ArchetypeSeed[] = [...physicalSeeds, ...idealSeeds];

function build(seed: ArchetypeSeed): Archetype {
  const poles = polesFromCode(seed.code);
  if (codeFromPoles(poles) !== seed.code) throw new Error(`Code round-trip failed for ${seed.code}`);
  const familyId = familyOfCode(seed.code);
  const letters = Object.fromEntries(
    (Object.keys(poles) as DimensionId[]).map((dimension) => [dimension, POLE_LETTERS[dimension][poles[dimension]]]),
  ) as Record<DimensionId, string>;
  return {
    code: seed.code,
    poles,
    letters,
    familyId,
    name: seed.name,
    thesis: seed.thesis,
    worldview: worldviewFor(poles),
    strengths: strengthsFor(poles),
    blindSpots: blindSpotsFor(poles),
    pairingPressure: pressureFor(poles),
    reflection: reflectionFor(poles),
    traditionSlugs: traditionsFor(poles),
    readingIds: readingsFor(poles).map((work) => work.id),
    standingIssueIds: standingIssuesFor(poles).map((issue) => issue.id),
    seoTitle: {
      en: `${seed.name.en} (${seed.code}) — a NOEMA philosophical profile`,
      zh: `${seed.name.zh}（${seed.code}）— NOEMA 哲学剖面`,
    },
    seoDescription: seed.thesis,
  };
}

export function validateArchetypeRegistry(list: Archetype[]): void {
  const expected = allCodes();
  if (list.length !== 64) throw new Error(`Expected 64 archetypes, found ${list.length}`);
  const seen = new Set<string>();
  list.forEach((archetype, index) => {
    const expectedCode = expected[index];
    if (!expectedCode || archetype.code !== expectedCode) {
      throw new Error(`Archetype ${index} is ${archetype.code}, expected ${expectedCode ?? 'none'}`);
    }
    if (seen.has(archetype.code)) throw new Error(`Duplicate code ${archetype.code}`);
    seen.add(archetype.code);
    if (!families[archetype.familyId]) throw new Error(`Missing family ${archetype.familyId}`);
    for (const value of [archetype.name, archetype.thesis, archetype.seoTitle, archetype.seoDescription, archetype.pairingPressure]) {
      if (!value.en.trim() || !value.zh.trim()) throw new Error(`Empty text on ${archetype.code}`);
    }
  });
  const names = new Set(list.map((item) => item.name.en));
  const zhNames = new Set(list.map((item) => item.name.zh));
  const theses = new Set(list.map((item) => item.thesis.en));
  const zhTheses = new Set(list.map((item) => item.thesis.zh));
  if (names.size !== 64 || zhNames.size !== 64 || theses.size !== 64 || zhTheses.size !== 64) {
    throw new Error('Archetype names or theses are not unique');
  }
}

export const archetypes: Archetype[] = seeds.map(build);
validateArchetypeRegistry(archetypes);

const byCode = new Map(archetypes.map((archetype) => [archetype.code, archetype]));

export function getArchetype(code: string): Archetype | undefined {
  return byCode.get(code.toUpperCase());
}

export function archetypesInFamily(familyId: Archetype['familyId']): Archetype[] {
  return archetypes.filter((archetype) => archetype.familyId === familyId);
}
