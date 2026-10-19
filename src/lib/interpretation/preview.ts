import { FAMILY_NAMES, getPublicType } from '@/data/archetypes/public';
import type { FreePreview } from '@/lib/api/contract';
import type { Assignment, Locale } from '@/types/model';

export function freePreview(locale: Locale, assignment: Assignment, withheldBody: string): FreePreview {
  const published = getPublicType(assignment.code);
  return {
    locale,
    code: assignment.code,
    familyId: published?.familyId ?? null,
    familyName: published ? FAMILY_NAMES[published.familyId][locale] : null,
    name: published ? published.name[locale] : null,
    summary: published ? published.thesis[locale] : withheldBody,
    assignmentStatus: assignment.status,
    provisional: assignment.status === 'provisional',
    reasons: assignment.reasons.map((reason) => reason[locale]),
  };
}
