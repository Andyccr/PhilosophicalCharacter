import { DIMENSION_IDS } from '@/lib/scoring/config';
import { radarGeometry } from '@/lib/charts/radar';

export function RadarChart({
  scores,
  labels,
  caption,
}: {
  scores: Array<number | null>;
  labels: string[];
  caption: string;
}) {
  const geometry = radarGeometry(scores);
  const order = DIMENSION_IDS.map((id, index) => ({ id, label: labels[index] ?? id }));
  return (
    <figure>
      <svg viewBox="0 0 320 320" role="img" aria-label={caption} className="mx-auto w-full max-w-md">
        {geometry.rings.map((ring) => (
          <polygon key={ring} points={ring} fill="none" stroke="currentColor" opacity="0.25" />
        ))}
        {geometry.axes.map((axis) => (
          <g key={axis.dimension} data-dimension={axis.dimension}>
            <line x1="160" y1="160" x2={axis.x} y2={axis.y} stroke="currentColor" opacity="0.35" />
          </g>
        ))}
        {geometry.polygon && <polygon points={geometry.polygon} fill="currentColor" opacity="0.18" stroke="currentColor" />}
        {order.map((item, index) => {
          const axis = geometry.axes[index];
          if (!axis) return null;
          return (
            <text key={item.id} x={axis.labelX} y={axis.labelY} textAnchor="middle" fontSize="11" fill="currentColor">
              {item.label}
            </text>
          );
        })}
      </svg>
      <figcaption className="sr-only">{caption}</figcaption>
    </figure>
  );
}

export function BipolarBars({
  rows,
}: {
  rows: Array<{ id: string; left: string; right: string; score: number | null; text: string }>;
}) {
  return (
    <div className="grid gap-5">
      {rows.map((row) => (
        <div key={row.id}>
          <div className="mb-1 flex justify-between gap-3 text-sm">
            <span>{row.left}</span>
            <span>{row.right}</span>
          </div>
          <div className="relative h-2 bg-line" data-dimension={row.id}>
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gold" />
            {row.score !== null && (
              <div className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 bg-iris" style={{ left: `${row.score}%` }} />
            )}
          </div>
          <p className="mt-1 text-sm text-muted">{row.text}</p>
        </div>
      ))}
    </div>
  );
}
