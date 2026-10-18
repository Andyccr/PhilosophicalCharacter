/**
 * ReportData builder for the paid print report.
 *
 * Philosophical strings come from existing repo data. UI chrome not yet in
 * `messages.ts` lives in `REPORT_LABELS` and is read defensively so a later
 * messages PR can land in either order.
 *
 * Privacy: this module maps an `AssessmentResult` that the Worker reconstructs
 * from indices + tension ids. It does not score raw answers.
 */
import { getArchetype } from '@/data/archetypes';
import { families } from '@/data/archetypes/families';
import { dimensions } from '@/data/dimensions';
import { philosophers } from '@/data/philosophers/profiles';
import { readings } from '@/data/readings';
import { getTensionRule } from '@/data/tensions/rules';
import { standingIssues } from '@/data/tensions/standing';
import { getTradition } from '@/data/traditions/catalog';
import { radarGeometry } from '@/lib/charts/radar';
import { describeScore, disagreementLabel, narrativeFor } from '@/lib/interpretation/describe';
import { messages, type Messages } from '@/lib/localization/messages';
import { htmlLang } from '@/lib/localization/path';
import { DIMENSION_IDS, scoringConfig, scoringDocumentation } from '@/lib/scoring/config';
import type { AssessmentResult, Locale, Localized, TensionKind } from '@/types/model';

export const REPORT_SCHEMA_VERSION = '1.0.0';

/**
 * Keys a later `messages.ts` PR should add (flat, same shape as existing strings).
 * This file reads them when present and falls back otherwise.
 */
export const EXPECTED_REPORT_MESSAGE_KEYS = [
  'reportTitle',
  'generatedOn',
  'languageName',
  'languageLabel',
  'answeredLabel',
  'uncertainLabel',
  'reportIdLabel',
  'philosophersNote',
  'versionLabel',
  'philosophersRelated',
  'tensionKindLogicalInconsistency',
  'tensionKindPhilosophicalDisagreement',
  'tensionKindApparentTension',
  'tensionKindContextDependent',
  'tensionKindUnresolvedUncertainty',
] as const;

/** UI chrome only. Move into messages.ts under the keys above. */
export const REPORT_LABELS: Record<(typeof EXPECTED_REPORT_MESSAGE_KEYS)[number], Localized> = {
  reportTitle: { en: 'Philosophical profile report', zh: '哲学剖面报告' },
  generatedOn: { en: 'Generated', zh: '生成日期' },
  languageName: { en: 'English', zh: '中文' },
  languageLabel: { en: 'Language', zh: '语言' },
  answeredLabel: { en: 'Questions answered', zh: '已答题目' },
  uncertainLabel: { en: '“I cannot determine”', zh: '“我无法判断”' },
  reportIdLabel: { en: 'Report', zh: '报告编号' },
  philosophersNote: {
    en: 'Listed because their traditions overlap with the traditions of this code. A link is thematic. It is not a similarity score.',
    zh: '列出的原因是其传统与这一代码的传统有交集。这种联系是主题性的，不是相似度分数。',
  },
  versionLabel: { en: 'Model / question bank', zh: '模型 / 题库版本' },
  philosophersRelated: {
    en: 'Philosophers from related traditions',
    zh: '思想传统相近的哲学家',
  },
  tensionKindLogicalInconsistency: { en: 'logical-inconsistency', zh: 'logical-inconsistency' },
  tensionKindPhilosophicalDisagreement: { en: 'philosophical-disagreement', zh: 'philosophical-disagreement' },
  tensionKindApparentTension: { en: 'apparent-tension', zh: 'apparent-tension' },
  tensionKindContextDependent: { en: 'context-dependent', zh: 'context-dependent' },
  tensionKindUnresolvedUncertainty: { en: 'unresolved-uncertainty', zh: 'unresolved-uncertainty' },
};

const TENSION_KIND_KEYS: Record<TensionKind, (typeof EXPECTED_REPORT_MESSAGE_KEYS)[number]> = {
  'logical-inconsistency': 'tensionKindLogicalInconsistency',
  'philosophical-disagreement': 'tensionKindPhilosophicalDisagreement',
  'apparent-tension': 'tensionKindApparentTension',
  'context-dependent': 'tensionKindContextDependent',
  'unresolved-uncertainty': 'tensionKindUnresolvedUncertainty',
};

const pick = (value: Localized, locale: Locale) => value[locale];

function readMessage(m: Messages, key: string, fallback: string): string {
  const value = (m as unknown as Record<string, unknown>)[key];
  return typeof value === 'string' && value.length > 0 ? value : fallback;
}

function chrome(m: Messages, locale: Locale, key: (typeof EXPECTED_REPORT_MESSAGE_KEYS)[number]): string {
  return readMessage(m, key, pick(REPORT_LABELS[key], locale));
}

export interface BuildOptions {
  locale: Locale;
  generatedAt?: Date;
  reportId?: string;
  siteUrl?: string;
  assetBaseUrl?: string;
  radarSize?: number;
  philosopherLimit?: number;
}

function radarAnchor(x: number, cx: number): 'start' | 'middle' | 'end' {
  if (Math.abs(x - cx) < 1) return 'middle';
  return x > cx ? 'start' : 'end';
}

export function buildReportData(result: AssessmentResult, options: BuildOptions) {
  const { locale } = options;
  const m = messages[locale];
  const generatedAt = options.generatedAt ?? new Date();
  const siteUrl = options.siteUrl ?? 'https://noema.andyccr.workers.dev';
  const size = options.radarSize ?? 320;

  const { assignment } = result;
  const archetype = assignment.code ? getArchetype(assignment.code) : undefined;
  const family = archetype ? families[archetype.familyId] : undefined;

  const statusLabel =
    assignment.status === 'definitive' ? m.definitive : assignment.status === 'provisional' ? m.provisional : m.withheld;
  const statusBody =
    assignment.status === 'withheld' ? m.withheldBody : assignment.status === 'provisional' ? m.provisionalBody : null;

  const dimensionRows = DIMENSION_IDS.map((id) => {
    const def = dimensions[id];
    const s = result.dimensions[id];
    return {
      id,
      plainName: pick(def.plainName, locale),
      technicalName: pick(def.technicalName, locale),
      showTechnical: pick(def.technicalName, locale) !== pick(def.plainName, locale),
      leftLetter: def.leftLetter,
      rightLetter: def.rightLetter,
      leftPole: pick(def.leftPole, locale),
      rightPole: pick(def.rightPole, locale),
      question: pick(def.question, locale),
      score: s.score,
      scoreDisplay: s.score === null ? '—' : String(s.score),
      hasScore: s.score !== null,
      inclination: s.inclination,
      isLeft: s.inclination === 'left',
      isRight: s.inclination === 'right',
      isMixed: s.inclination === 'mixed',
      isInsufficient: s.inclination === 'insufficient',
      split: (s.inconsistency ?? 0) >= scoringConfig.inconsistencyMixed,
      describe: describeScore(s, locale),
      narrative: narrativeFor(s, locale),
      disagreement: disagreementLabel(s, locale),
      inconsistency: s.inconsistency,
      coverage: s.coverage,
      coverageDisplay: `${s.directionalCount}/${s.applicableCount}`,
      directionalCount: s.directionalCount,
      applicableCount: s.applicableCount,
      uncertainCount: s.uncertainCount,
      alternativeCount: s.alternativeCount,
      skippedCount: s.skippedCount,
      letter: archetype ? archetype.letters[id] : null,
      codePole: archetype ? pick(archetype.poles[id] === 'left' ? def.leftPole : def.rightPole, locale) : null,
    };
  });

  const geo = radarGeometry(
    DIMENSION_IDS.map((id) => result.dimensions[id].score),
    size,
  );
  const radar = {
    size,
    center: size / 2,
    rings: geo.rings,
    polygon: geo.polygon,
    hasPolygon: geo.polygon !== null,
    axes: geo.axes.map((axis, index) => ({
      dimension: axis.dimension,
      label: dimensionRows[index]!.plainName,
      scoreDisplay: dimensionRows[index]!.scoreDisplay,
      x: round(axis.x),
      y: round(axis.y),
      labelX: round(axis.labelX),
      labelY: round(axis.labelY),
      anchor: radarAnchor(axis.labelX, size / 2),
    })),
  };

  const tensions = result.tensions.flatMap((t) => {
    const rule = getTensionRule(t.id);
    if (!rule) return [];
    const kindKey = TENSION_KIND_KEYS[t.kind] ?? TENSION_KIND_KEYS[rule.kind];
    return [
      {
        id: t.id,
        kind: kindKey ? chrome(m, locale, kindKey) : t.kind,
        dimensions: t.dimensions,
        dimensionNames: t.dimensions.map((d) => pick(dimensions[d].plainName, locale)).join(' · '),
        problem: pick(rule.problem, locale),
        explanation: pick(rule.explanation, locale),
        because: pick(rule.because, locale),
        alternatives: pick(rule.alternatives, locale),
        followUp: pick(rule.followUp, locale),
        tradition: pick(rule.tradition, locale),
        experimentSlug: rule.experimentSlug ?? null,
        sources: rule.sources,
      },
    ];
  });

  const standing = (archetype?.standingIssueIds ?? []).flatMap((id) => {
    const issue = standingIssues.find((item) => item.id === id);
    return issue
      ? [
          {
            id,
            kind: issue.kind,
            title: pick(issue.title, locale),
            explanation: pick(issue.explanation, locale),
            alternatives: pick(issue.alternatives, locale),
            sources: issue.sources,
          },
        ]
      : [];
  });

  const traditionSlugs = archetype?.traditionSlugs ?? [];
  const traditionList = traditionSlugs.flatMap((slug, index) => {
    const tr = getTradition(slug);
    const dim = DIMENSION_IDS[index];
    return tr
      ? [
          {
            slug,
            name: pick(tr.name, locale),
            summary: pick(tr.summary, locale),
            viaDimension: dim ?? null,
            viaDimensionName: dim ? pick(dimensions[dim].plainName, locale) : null,
            url: `${siteUrl}${locale === 'en' ? '/en' : ''}/traditions/${slug}`,
          },
        ]
      : [];
  });

  const philosopherList =
    traditionSlugs.length === 0
      ? []
      : philosophers
          .map((p, order) => ({
            p,
            order,
            overlap: p.traditionSlugs.filter((s) => traditionSlugs.includes(s)),
          }))
          .filter((x) => x.overlap.length > 0)
          .sort((a, b) => b.overlap.length - a.overlap.length || a.order - b.order)
          .slice(0, options.philosopherLimit ?? 6)
          .map(({ p, overlap }) => ({
            slug: p.slug,
            name: pick(p.name, locale),
            dates: pick(p.dates, locale),
            themes: p.themes.map((theme) => pick(theme, locale)).join(locale === 'zh' ? '、' : ', '),
            readingNote: pick(p.readingNote, locale),
            sharedTraditions: overlap
              .map((s) => {
                const t = getTradition(s);
                return t ? pick(t.name, locale) : s;
              })
              .join(locale === 'zh' ? '、' : ', '),
            overlapCount: overlap.length,
          }));

  const readingList = (archetype?.readingIds ?? [])
    .flatMap((id) => {
      const work = readings.find((item) => item.id === id);
      return work ? [{ id, citation: pick(work.citation, locale), topic: pick(work.topic, locale) }] : [];
    })
    .map((item, index) => ({ ...item, n: String(index + 1).padStart(2, '0') }));

  const dateLabel = new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(generatedAt);

  return {
    schemaVersion: REPORT_SCHEMA_VERSION,
    locale,
    htmlLang: htmlLang(locale),
    isZh: locale === 'zh',
    generatedAt: generatedAt.toISOString(),
    generatedDateLabel: dateLabel,
    reportId: options.reportId ?? null,
    modelVersion: result.modelVersion,
    questionVersion: result.questionVersion,
    assetBaseUrl: options.assetBaseUrl ?? './',
    site: { name: 'NOEMA', url: siteUrl, host: siteUrl.replace(/^https?:\/\//, '') },
    assignment: {
      status: assignment.status,
      isDefinitive: assignment.status === 'definitive',
      isProvisional: assignment.status === 'provisional',
      isWithheld: assignment.status === 'withheld',
      statusLabel,
      statusBody,
      code: assignment.code,
      codeSpaced: assignment.code ? assignment.code.split('').join(' · ') : null,
      reasons: assignment.reasons.map((r) => pick(r, locale)),
    },
    archetype: archetype
      ? {
          code: archetype.code,
          name: pick(archetype.name, locale),
          thesis: pick(archetype.thesis, locale),
          worldview: archetype.worldview.map((v) => pick(v, locale)),
          strengths: archetype.strengths.map((v) => pick(v, locale)),
          blindSpots: archetype.blindSpots.map((v) => pick(v, locale)),
          pairingPressure: pick(archetype.pairingPressure, locale),
          reflection: archetype.reflection.map((v) => pick(v, locale)),
          url: `${siteUrl}${locale === 'en' ? '/en' : ''}/types/${archetype.code.toLowerCase()}`,
        }
      : null,
    family: family
      ? {
          id: family.id,
          name: pick(family.name, locale),
          rule: pick(family.rule, locale),
          essay: pick(family.essay, locale),
        }
      : null,
    dimensions: dimensionRows,
    radar,
    tensions,
    hasTensions: tensions.length > 0,
    standingIssues: standing,
    traditions: traditionList,
    philosophers: philosopherList,
    readings: readingList,
    stats: {
      answeredCount: result.answeredCount,
      skippedCount: result.skippedCount,
      uncertainCount: result.uncertainCount,
      totalQuestions: result.totalQuestions,
    },
    methodology: scoringDocumentation.map((s) => ({ heading: pick(s.heading, locale), body: pick(s.body, locale) })),
    labels: {
      cardKicker: m.cardKicker,
      premiumTitle: m.premiumTitle,
      dimensions: m.dimensions,
      indexLabel: m.indexLabel,
      coverageLabel: m.coverageLabel,
      disagreement: m.disagreement,
      codeLabel: m.codeLabel,
      familyLabel: m.familyLabel,
      legend: m.legend,
      worldview: m.worldview,
      strengths: m.strengths,
      blindSpots: m.blindSpots,
      pressure: m.pressure,
      reflection: m.reflection,
      tensions: m.tensions,
      noTensions: m.noTensions,
      standing: m.standing,
      relatedAxes: m.relatedAxes,
      traditionsTitle: m.traditionsTitle,
      philosophers: chrome(m, locale, 'philosophersRelated'),
      readingsTitle: m.readingsTitle,
      methodTitle: m.methodTitle,
      methodLead: m.methodLead,
      notDiagnosis: m.notDiagnosis,
      cardDisclaimer: m.cardDisclaimer,
      atlasLead: m.atlasLead,
      families: m.families,
      atlas: m.atlas,
      method: m.method,
      reportTitle: chrome(m, locale, 'reportTitle'),
      generatedOn: chrome(m, locale, 'generatedOn'),
      languageName: chrome(m, locale, 'languageName'),
      languageLabel: chrome(m, locale, 'languageLabel'),
      answeredLabel: chrome(m, locale, 'answeredLabel'),
      uncertainLabel: chrome(m, locale, 'uncertainLabel'),
      reportIdLabel: chrome(m, locale, 'reportIdLabel'),
      philosophersNote: chrome(m, locale, 'philosophersNote'),
      versionLabel: chrome(m, locale, 'versionLabel'),
    },
  };
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}

export type ReportData = ReturnType<typeof buildReportData>;
