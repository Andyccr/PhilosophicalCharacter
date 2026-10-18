/**
 * Public API contract for the results/checkout UI.
 *
 * Transport: JSON over same-origin `/api/*`. No cookies. Send the unlock
 * token as `Authorization: Bearer <token>` (never a cookie, query string, or
 * localStorage-only header the Worker cannot see).
 *
 * Calendar of callers:
 * - Results / premium islands own the fetch wiring in this repository.
 * - A later `/checkout` page should call `POST /api/checkout` with the same
 *   body; do not add a second payment entrypoint.
 * - Visual restyle of the results islands is owned by a UI contributor; do
 *   not change field names here to match layout.
 */
import type {
  Assignment,
  AssignmentStatus,
  DimensionId,
  FamilyId,
  Inclination,
  Locale,
  TensionKind,
} from '@/types/model';

export const PREMIUM_PRODUCT = {
  id: 'noema-report',
  priceEur: 4.99,
  currency: 'EUR' as const,
  amount: '4.99',
} as const;

export const UNLOCK_HEADER = 'Authorization';

/** localStorage key for the HMAC unlock token. Not a cookie. */
export const ACCESS_KEY = 'noema.access.v1';

export interface UnlockRecord {
  version: 1;
  token: string;
  orderId: string;
  unlockedAt: string;
}

/**
 * Free preview is computed on the device from scoring + the public catalog.
 * Axis indices, coverage, essays, worldview, and tension copy are not included.
 */
export interface FreePreview {
  locale: Locale;
  code: string | null;
  familyId: FamilyId | null;
  familyName: string | null;
  name: string | null;
  /** Shareable one-paragraph thesis. Also published on `/types/[code]`. */
  summary: string | null;
  assignmentStatus: AssignmentStatus;
  /** True when the six-letter code is the nearer pole, not a settled type. */
  provisional: boolean;
  reasons: string[];
}

export interface ProfileAxisInput {
  score: number | null;
  inclination: Inclination;
  inconsistency: number | null;
  directionalCount: number;
  applicableCount: number;
}

/**
 * Body for `POST /api/profile`. Answers stay on the device; send scores and
 * already-detected tension ids only.
 */
export interface ProfileRequest {
  locale: Locale;
  assignment: Assignment;
  dimensions: Record<DimensionId, ProfileAxisInput>;
  tensionIds: string[];
}

export interface PaidAxis {
  id: DimensionId;
  label: string;
  leftPole: string;
  rightPole: string;
  score: number | null;
  directionalCount: number;
  applicableCount: number;
  description: string;
  narrative: string;
  disagreement: string;
}

export interface PaidTension {
  id: string;
  kind: TensionKind;
  problem: string;
  explanation: string;
  because: string;
  alternatives: string;
}

export interface PaidStanding {
  id: string;
  title: string;
  explanation: string;
}

export interface PaidReading {
  id: string;
  citation: string;
  topic: string;
}

/** JSON returned by `POST /api/profile` for a valid unlock token. */
export interface PaidProfile {
  locale: Locale;
  assignment: Assignment;
  code: string | null;
  name: string | null;
  familyId: FamilyId | null;
  familyName: string | null;
  summary: string | null;
  axes: PaidAxis[];
  worldview: string[];
  strengths: string[];
  blindSpots: string[];
  pairingPressure: string | null;
  reflection: string[];
  tensions: PaidTension[];
  standing: PaidStanding[];
  readings: PaidReading[];
  typePath: string | null;
}

export interface CreateCheckoutRequest {
  /** Site-relative path PayPal should return to, e.g. `/results` or `/en/results`. */
  returnPath: string;
  cancelPath: string;
}

export interface CreateCheckoutResponse {
  orderId: string;
  approvalUrl: string;
  live: false | true;
}

export interface CaptureRequest {
  orderId: string;
}

export interface UnlockResponse {
  token: string;
  orderId: string;
  expiresAt: string;
}

export interface RestoreRequest {
  email: string;
  orderId: string;
}

export interface ApiErrorBody {
  error: string;
  message?: string;
}

export const API = {
  checkout: '/api/checkout',
  capture: '/api/capture',
  profile: '/api/profile',
  restore: '/api/restore',
  reportPdf: '/api/report.pdf',
} as const;

export function authorizationHeader(token: string): { Authorization: string } {
  return { Authorization: `Bearer ${token}` };
}
