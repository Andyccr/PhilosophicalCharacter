import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import Mustache from 'mustache';
import { buildReportData, EXPECTED_REPORT_MESSAGE_KEYS } from '@/lib/report/buildReportData';
import { assessmentFromProfileRequest } from '@/lib/report/fromRequest';
import { profileRequestFromResult } from '@/lib/report/profileRequest';
import { renderReportFromRequest, renderReportHtml, REPORT_TEMPLATE } from '@/lib/report/render';
import type { AssessmentResult } from '@/types/model';

const sampleResult = JSON.parse(
  readFileSync(new URL('./fixtures/report/sample-assessment-result.json', import.meta.url), 'utf8'),
) as AssessmentResult;

const sampleZh = JSON.parse(
  readFileSync(new URL('./fixtures/report/sample-data-zh.json', import.meta.url), 'utf8'),
) as Record<string, unknown>;

const sampleOptions = {
  locale: 'zh' as const,
  generatedAt: new Date('2026-10-18T16:00:00.000Z'),
  reportId: 'SAMPLE-0001',
  siteUrl: 'https://example.com',
  assetBaseUrl: 'https://example.com/',
};

describe('buildReportData', () => {
  it('maps the IRDDCC sample onto existing repo content without forking copy', () => {
    const data = buildReportData(sampleResult, sampleOptions);
    const expected = sampleZh;

    expect(data.schemaVersion).toBe('1.0.0');
    expect(data.assignment).toMatchObject(expected.assignment as object);
    expect(data.archetype).toMatchObject({
      code: 'IRDDCC',
      name: '宪制的观念论者',
      thesis: (expected.archetype as { thesis: string }).thesis,
    });
    expect(data.family).toMatchObject({ id: 'architects', name: '建筑师' });
    expect(data.dimensions.map((row) => row.score)).toEqual([87, 83, 78, 13, 82, 78]);
    expect(data.tensions.map((row) => row.id)).toEqual([
      'created-meaning-objective-duty',
      'compatibilist-responsibility',
    ]);
    expect(data.tensions[0]?.because).toBe(
      '你的意义指数偏向创造，而你的道德指数偏向义务与约束。',
    );
    expect(data.tensions[1]?.because).toBe(
      '你至少选择了一次相容论式的描述。这一回答被记下，并且没有被换算成能动性指数上的一个点。',
    );
    expect(data.philosophers.map((row) => row.slug)).toEqual(
      (expected.philosophers as Array<{ slug: string }>).map((row) => row.slug),
    );
    expect(data.readings.map((row) => row.id)).toEqual(
      (expected.readings as Array<{ id: string }>).map((row) => row.id),
    );
    expect(data.stats).toEqual({ answeredCount: 48, skippedCount: 0, uncertainCount: 0, totalQuestions: 48 });
    expect(data.labels.philosophers).toBe('思想传统相近的哲学家');
    expect(data.labels.philosophersNote).toContain('不是相似度分数');
    expect(data.labels.atlasLead).toContain('不是相似分数');
    expect(data.site.url).toBe('https://example.com');
    expect(JSON.stringify(data)).not.toContain('ont-01');
    expect(JSON.stringify(data)).not.toContain('age-04');
    expect(JSON.stringify(data)).not.toContain('andyccr.workers.dev');
    expect(JSON.stringify(data)).not.toContain('andyycrccrhjuswcax');
  });

  it('keeps the English philosophers heading thematic, never a similarity ranking', () => {
    const data = buildReportData(sampleResult, { ...sampleOptions, locale: 'en' });
    expect(data.labels.philosophers).toBe('Philosophers from related traditions');
    expect(data.labels.philosophers.toLowerCase()).not.toContain('similar');
    expect(data.labels.philosophersNote.toLowerCase()).toContain('thematic');
    expect(data.labels.philosophersNote.toLowerCase()).toContain('not a similarity score');
  });

  it('does not default site.url to a workers.dev host', () => {
    const data = buildReportData(sampleResult, { locale: 'zh', generatedAt: sampleOptions.generatedAt });
    expect(data.site.url).not.toContain('workers.dev');
    expect(data.assetBaseUrl).toMatch(/\/$/);
    expect(`${data.assetBaseUrl}fonts/fonts.css`).toContain('/fonts/fonts.css');
  });

  it('lists the messages.ts keys a later PR should add', () => {
    expect([...EXPECTED_REPORT_MESSAGE_KEYS]).toEqual([
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
    ]);
  });
});

describe('ProfileRequest reconstruction', () => {
  it('rebuilds report data from indices and tension ids, not answers', () => {
    const request = profileRequestFromResult('zh', sampleResult);
    expect(request).not.toHaveProperty('answers');
    expect(request.tensionIds).toEqual(['created-meaning-objective-duty', 'compatibilist-responsibility']);
    expect(request.stats?.answeredCount).toBe(48);

    const rebuilt = assessmentFromProfileRequest(request);
    const fromFull = buildReportData(sampleResult, sampleOptions);
    const fromRequest = buildReportData(rebuilt, sampleOptions);

    expect(fromRequest.assignment.code).toBe(fromFull.assignment.code);
    expect(fromRequest.archetype?.name).toBe(fromFull.archetype?.name);
    expect(fromRequest.tensions.map((row) => row.id)).toEqual(fromFull.tensions.map((row) => row.id));
    expect(fromRequest.tensions.map((row) => row.because)).toEqual(fromFull.tensions.map((row) => row.because));
    expect(fromRequest.philosophers.map((row) => row.slug)).toEqual(fromFull.philosophers.map((row) => row.slug));
    expect(fromRequest.dimensions.map((row) => row.scoreDisplay)).toEqual(
      fromFull.dimensions.map((row) => row.scoreDisplay),
    );
  });
});

describe('Mustache HTML render', () => {
  it('renders a print-ready zh page under the Workers Free 10 ms CPU budget', () => {
    const request = profileRequestFromResult('zh', sampleResult);
    const started = performance.now();
    let html = '';
    const rounds = 20;
    for (let i = 0; i < rounds; i += 1) {
      html = renderReportFromRequest(request, {
        generatedAt: sampleOptions.generatedAt,
        reportId: '5O190127TN364715T',
        siteUrl: 'https://example.com',
        assetBaseUrl: 'https://example.com/',
      });
    }
    const elapsedMs = (performance.now() - started) / rounds;
    expect(html).toContain('宪制的观念论者');
    expect(html).toContain('思想传统相近的哲学家');
    expect(html).toContain('https://example.com/fonts/fonts.css');
    expect(html).toContain('PingFang SC');
    expect(html).toContain('Microsoft YaHei');
    expect(html).toContain('打印 / 存为 PDF');
    expect(html).not.toContain('ont-01');
    expect(html).not.toContain('{{{');
    expect(elapsedMs).toBeLessThan(10);
  });

  it('HTML-escapes values through Mustache', () => {
    const rendered = Mustache.render(REPORT_TEMPLATE, {
      htmlLang: 'en',
      locale: 'en',
      labels: { reportTitle: '<script>x</script>', languageName: 'English' },
      assignment: { statusLabel: 'Definitive' },
      stats: { answeredCount: 0, totalQuestions: 48 },
      radar: { rings: [], axes: [] },
      dimensions: [],
      tensions: [],
      standingIssues: [],
      traditions: [],
      philosophers: [],
      readings: [],
      methodology: [],
    });
    expect(rendered).toContain('&lt;script&gt;x&lt;/script&gt;');
    expect(rendered).not.toContain('<script>x</script>');
    expect(rendered).not.toContain('<script>');
  });

  it('renderReportHtml matches the builder output for the sample', () => {
    const html = renderReportHtml(sampleResult, sampleOptions);
    expect(html).toContain('I · R · D · D · C · C');
    expect(html).toContain('建筑师');
  });
});
