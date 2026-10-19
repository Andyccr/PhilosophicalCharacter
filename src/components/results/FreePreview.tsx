import { ShareCard } from '@/components/results/share-card/ShareCard';
import type { FreePreview as FreePreviewData } from '@/lib/api/contract';
import { publicFamily } from '@/lib/share-card/catalog';
import { messages } from '@/lib/localization/messages';
import type { ShareCardInput } from '@/lib/share-card/types';
import type { Locale } from '@/types/model';

export function FreePreview({
  locale,
  preview,
  card,
}: {
  locale: Locale;
  preview: FreePreviewData;
  card?: ShareCardInput;
}) {
  const m = messages[locale];
  const badge =
    preview.assignmentStatus === 'definitive'
      ? m.definitive
      : preview.assignmentStatus === 'provisional'
        ? m.provisional
        : m.withheld;
  const family = publicFamily(preview.code, locale);
  const code = preview.code ?? (preview.assignmentStatus === 'withheld' ? '——————' : null);

  return (
    <section data-testid="free-preview">
      <p className="kicker">{badge}</p>
      {code && (
        <p className="mono mt-6 text-3xl text-iris md:text-5xl" aria-label={m.codeLabel}>
          {code}
          {preview.provisional && (
            <sup className="ml-1 text-2xl" aria-label={m.provisional}>
              *
            </sup>
          )}
        </p>
      )}
      <h1 className="serif mt-4 text-4xl md:text-5xl">{preview.name ?? m.withheld}</h1>
      {family && (
        <p className="mt-3">
          {m.familyLabel}: {family.familyName}
        </p>
      )}
      {family && <p className="mt-2 max-w-3xl text-muted">{family.rule}</p>}
      {preview.provisional && <p className="mt-3 text-sm">{m.provisionalBody}</p>}
      {preview.reasons.map((reason) => (
        <p key={reason} className="mt-2 text-sm text-muted">
          {reason}
        </p>
      ))}
      <p className="mt-4 text-sm">{m.notDiagnosis}</p>
      {card && <ShareCard locale={locale} input={card} />}
    </section>
  );
}
