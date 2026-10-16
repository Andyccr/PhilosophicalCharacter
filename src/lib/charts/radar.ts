import { DIMENSION_IDS } from '@/lib/scoring/config';

export interface RadarPoint {
  dimension: (typeof DIMENSION_IDS)[number];
  x: number;
  y: number;
  labelX: number;
  labelY: number;
}

function point(index: number, radius: number, cx: number, cy: number): { x: number; y: number } {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / DIMENSION_IDS.length;
  return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
}

export function radarGeometry(scores: Array<number | null>, size = 320): {
  axes: RadarPoint[];
  polygon: string | null;
  rings: string[];
} {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.36;
  const axes = DIMENSION_IDS.map((dimension, index) => {
    const outer = point(index, radius, cx, cy);
    const label = point(index, radius + 28, cx, cy);
    return { dimension, x: outer.x, y: outer.y, labelX: label.x, labelY: label.y };
  });
  const rings = [0.35, 0.7, 1].map((scale) =>
    DIMENSION_IDS.map((_, index) => {
      const spot = point(index, radius * scale, cx, cy);
      return `${spot.x},${spot.y}`;
    }).join(' '),
  );
  const polygon = scores.every((score) => score !== null)
    ? scores
        .map((score, index) => {
          const spot = point(index, radius * ((score ?? 0) / 100), cx, cy);
          return `${spot.x},${spot.y}`;
        })
        .join(' ')
    : null;
  return { axes, polygon, rings };
}
