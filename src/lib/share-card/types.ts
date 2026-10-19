import type { AssignmentStatus, Locale } from '@/types/model';

export type ShareCardFormat = 'landscape' | 'portrait';
export type ShareCardStatus = AssignmentStatus;

/** Public share-card fields. Axis bars are intentionally omitted (paid-only indices). */
export interface ShareCardInput {
  locale: Locale;
  status: ShareCardStatus;
  badge: string;
  code: string;
  title: string;
  family: string;
  summary: string;
  url: string;
  disclaimer: string;
}

export interface ShareCardLayout {
  format: ShareCardFormat;
  width: number;
  height: number;
  margin: number;
  wordmark: { x: number; y: number; size: number; tracking: number };
  badge: {
    right: number;
    y: number;
    size: number;
    tracking: number;
    trackingZh: number;
    pillHeight: number;
    pillRadius: number;
    pillPad: number;
    stroke: number;
  };
  rule: { x: number; y: number; width: number; height: number };
  code: { x: number; y: number; size: number; tracking: number; starSize: number; starDy: number; starDx: number };
  title: { x: number; y: number; size: number; minSize: number; maxWidth: number; lineHeight: number; maxLines: number };
  family: { x: number; dy: number; size: number };
  summary: { x: number; dy: number; size: number; lineHeight: number; maxWidth: number; maxLines: number };
  divider: { x1: number; x2: number; y: number };
  url: { x: number; y: number; size: number };
  disclaimer: { right: number; y: number; size: number };
}

export const COLORS = {
  paper: '#F3F0E8',
  ink: '#111318',
  muted: '#3E4148',
  accent: '#3F3A78',
  line: 'rgba(17,19,24,0.16)',
} as const;

export const FONTS = {
  serif: '"Source Serif 4", "Noto Serif SC", serif',
  sans: '"Source Sans 3", "Noto Sans SC", sans-serif',
  mono: '"IBM Plex Mono", ui-monospace, monospace',
} as const;

export const WITHHELD_CODE = '——————';

export const LAYOUTS: Record<ShareCardFormat, ShareCardLayout> = {
  landscape: {
    format: 'landscape',
    width: 1200,
    height: 630,
    margin: 72,
    wordmark: { x: 72, y: 96, size: 24, tracking: 7.2 },
    badge: {
      right: 1128,
      y: 96,
      size: 15,
      tracking: 2.4,
      trackingZh: 1,
      pillHeight: 34,
      pillRadius: 17,
      pillPad: 16,
      stroke: 1.5,
    },
    rule: { x: 72, y: 150, width: 40, height: 4 },
    code: { x: 72, y: 262, size: 104, tracking: 8, starSize: 44, starDy: -47, starDx: 8 },
    title: { x: 72, y: 334, size: 44, minSize: 34, maxWidth: 560, lineHeight: 44, maxLines: 1 },
    family: { x: 72, dy: 48, size: 22 },
    summary: { x: 72, dy: 38, size: 21, lineHeight: 31, maxWidth: 548, maxLines: 2 },
    divider: { x1: 72, x2: 1128, y: 540 },
    url: { x: 72, y: 580, size: 16 },
    disclaimer: { right: 1128, y: 580, size: 16 },
  },
  portrait: {
    format: 'portrait',
    width: 1080,
    height: 1440,
    margin: 96,
    wordmark: { x: 96, y: 150, size: 30, tracking: 9 },
    badge: {
      right: 984,
      y: 150,
      size: 18,
      tracking: 2.8,
      trackingZh: 1,
      pillHeight: 42,
      pillRadius: 21,
      pillPad: 20,
      stroke: 1.5,
    },
    rule: { x: 96, y: 290, width: 56, height: 6 },
    code: { x: 96, y: 470, size: 150, tracking: 12, starSize: 63, starDy: -68, starDx: 12 },
    title: { x: 96, y: 584, size: 64, minSize: 48, maxWidth: 888, lineHeight: 76, maxLines: 2 },
    family: { x: 96, dy: 70, size: 30 },
    summary: { x: 96, dy: 52, size: 28, lineHeight: 42, maxWidth: 888, maxLines: 3 },
    divider: { x1: 96, x2: 984, y: 1310 },
    url: { x: 96, y: 1362, size: 22 },
    disclaimer: { right: 984, y: 1362, size: 22 },
  },
};
