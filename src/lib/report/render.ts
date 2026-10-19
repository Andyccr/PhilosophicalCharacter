import Mustache from 'mustache';
import type { ProfileRequest } from '@/lib/api/contract';
import { buildReportData, type BuildOptions } from '@/lib/report/buildReportData';
import { assessmentFromProfileRequest } from '@/lib/report/fromRequest';
import template from './report-template.html';
import type { AssessmentResult } from '@/types/model';

export { template as REPORT_TEMPLATE };

/** Escape markup without turning `/` into `&#x2F;`, so font URLs in `href` stay fetchable. */
Mustache.escape = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export function renderReportHtml(result: AssessmentResult, options: BuildOptions): string {
  return Mustache.render(template, buildReportData(result, options));
}

export function renderReportFromRequest(
  request: ProfileRequest,
  options: Omit<BuildOptions, 'locale'>,
): string {
  return renderReportHtml(assessmentFromProfileRequest(request), {
    ...options,
    locale: request.locale,
  });
}
