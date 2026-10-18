import type { FreePreview as FreePreviewData } from '@/lib/api/contract';
import { messages } from '@/lib/localization/messages';
import type { Locale } from '@/types/model';

export function FreePreview({ locale, preview }: { locale: Locale; preview: FreePreviewData }) {
  const m = messages[locale];
  const badge =
    preview.assignmentStatus === 'definitive'
      ? m.definitive
      : preview.assignmentStatus === 'provisional'
        ? m.provisional
        : m.withheld;
  return (
    <section data-testid="free-preview">
      <p className="kicker">{badge}</p>
      <h1 className="serif mt-3 text-4xl md:text-6xl">{preview.name ?? m.withheld}</h1>
      {preview.code && (
        <p className="mono mt-3 text-lg text-iris" aria-label={m.codeLabel}>
          {preview.code.split('').join(' · ')}
        </p>
      )}
      {preview.familyName && (
        <p className="mt-2 text-muted">
          {m.familyLabel}: {preview.familyName}
        </p>
      )}
      <p className="mt-4 max-w-3xl">{preview.summary}</p>
      {preview.reasons.map((reason) => (
        <p key={reason} className="mt-2 text-sm text-muted">
          {reason}
        </p>
      ))}
      <p className="mt-4 text-sm">{m.notDiagnosis}</p>
    </section>
  );
}
