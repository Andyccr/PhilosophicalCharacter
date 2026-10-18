import { families } from '@/data/archetypes/families';
import { getPublicType } from '@/data/archetypes/public';
import type { FamilyId, Locale } from '@/types/model';

export function publicFamily(code: string | null | undefined, locale: Locale): {
  familyId: FamilyId;
  familyName: string;
  rule: string;
  typeName: string;
} | null {
  const published = getPublicType(code);
  if (!published) return null;
  const family = families[published.familyId];
  return {
    familyId: published.familyId,
    familyName: family.name[locale],
    rule: family.rule[locale],
    typeName: published.name[locale],
  };
}
