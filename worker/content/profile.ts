import { getArchetype } from '@/data/archetypes';
import { families } from '@/data/archetypes/families';
import { dimensions } from '@/data/dimensions';
import { readings } from '@/data/readings';
import { getTensionRule } from '@/data/tensions/rules';
import { standingIssues } from '@/data/tensions/standing';
import type { PaidProfile, ProfileRequest } from '@/lib/api/contract';
import { disagreementLabel, describeScore, narrativeFor } from '@/lib/interpretation/describe';
import { localePath } from '@/lib/localization/path';
import { DIMENSION_IDS } from '@/lib/scoring/config';
import type { DimensionScore } from '@/types/model';

export class PaidContent {
  static assemble(request: ProfileRequest): PaidProfile {
    const locale = request.locale === 'en' ? 'en' : 'zh';
    const code = request.assignment.code;
    const archetype = code ? getArchetype(code) : undefined;
    const family = archetype ? families[archetype.familyId] : undefined;
    const axes = DIMENSION_IDS.map((id) => {
      const input = request.dimensions[id];
      const score: DimensionScore = {
        dimension: id,
        score: input?.score ?? null,
        inclination: input?.inclination ?? 'insufficient',
        coverage: 0,
        applicableCount: input?.applicableCount ?? 0,
        directionalCount: input?.directionalCount ?? 0,
        uncertainCount: 0,
        alternativeCount: 0,
        skippedCount: 0,
        inconsistency: input?.inconsistency ?? null,
        signedSum: 0,
        minSum: 0,
        maxSum: 0,
        leftCount: 0,
        rightCount: 0,
        alternativeTags: {},
      };
      const dimension = dimensions[id];
      return {
        id,
        label: dimension.plainName[locale],
        leftPole: dimension.leftPole[locale],
        rightPole: dimension.rightPole[locale],
        score: score.score,
        directionalCount: score.directionalCount,
        applicableCount: score.applicableCount,
        description: describeScore(score, locale),
        narrative: narrativeFor(score, locale),
        disagreement: disagreementLabel(score, locale),
      };
    });

    return {
      locale,
      assignment: request.assignment,
      code: archetype?.code ?? null,
      name: archetype ? archetype.name[locale] : null,
      familyId: family?.id ?? null,
      familyName: family ? family.name[locale] : null,
      summary: archetype ? archetype.thesis[locale] : null,
      axes,
      worldview: archetype ? archetype.worldview.map((item) => item[locale]) : [],
      strengths: archetype ? archetype.strengths.map((item) => item[locale]) : [],
      blindSpots: archetype ? archetype.blindSpots.map((item) => item[locale]) : [],
      pairingPressure: archetype ? archetype.pairingPressure[locale] : null,
      reflection: archetype ? archetype.reflection.map((item) => item[locale]) : [],
      tensions: request.tensionIds.flatMap((id) => {
        const rule = getTensionRule(id);
        if (!rule) return [];
        return [
          {
            id: rule.id,
            kind: rule.kind,
            problem: rule.problem[locale],
            explanation: rule.explanation[locale],
            because: rule.because[locale],
            alternatives: rule.alternatives[locale],
          },
        ];
      }),
      standing: (archetype?.standingIssueIds ?? []).flatMap((id) => {
        const issue = standingIssues.find((item) => item.id === id);
        if (!issue) return [];
        return [{ id: issue.id, title: issue.title[locale], explanation: issue.explanation[locale] }];
      }),
      readings: (archetype?.readingIds ?? []).flatMap((id) => {
        const work = readings.find((item) => item.id === id);
        if (!work) return [];
        return [{ id: work.id, citation: work.citation[locale], topic: work.topic[locale] }];
      }),
      typePath: archetype ? localePath(locale, `/types/${archetype.code.toLowerCase()}`) : null,
    };
  }
}
