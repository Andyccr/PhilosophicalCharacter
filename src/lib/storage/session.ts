import { MODEL_VERSION } from '@/lib/scoring/config';
import { QUESTION_VERSION } from '@/data/questions/bank';
import type { Locale } from '@/types/model';

export const STORAGE_KEY = 'noema.assessment.v1';
export const THEME_KEY = 'noema.theme';

export interface SavedSession {
  modelVersion: string;
  questionVersion: string;
  locale: Locale;
  index: number;
  answers: Record<string, string>;
  updatedAt: string;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export type SessionRead =
  | { ok: true; session: SavedSession }
  | { ok: false; reason: 'unavailable' | 'empty' | 'corrupt' | 'invalid' };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function readSession(storage: StorageLike | undefined): SessionRead {
  if (!storage) return { ok: false, reason: 'unavailable' };
  let raw: string | null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return { ok: false, reason: 'unavailable' };
  }
  if (raw === null || raw.trim() === '') return { ok: false, reason: 'empty' };
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, reason: 'corrupt' };
  }
  if (!isRecord(parsed) || !isRecord(parsed.answers)) return { ok: false, reason: 'invalid' };
  if (parsed.locale !== 'en' && parsed.locale !== 'zh') return { ok: false, reason: 'invalid' };
  if (typeof parsed.index !== 'number' || !Number.isInteger(parsed.index) || parsed.index < 0) {
    return { ok: false, reason: 'invalid' };
  }
  const answers: Record<string, string> = {};
  for (const [key, value] of Object.entries(parsed.answers)) {
    if (typeof value !== 'string') return { ok: false, reason: 'invalid' };
    answers[key] = value;
  }
  return {
    ok: true,
    session: {
      modelVersion: typeof parsed.modelVersion === 'string' ? parsed.modelVersion : MODEL_VERSION,
      questionVersion: typeof parsed.questionVersion === 'string' ? parsed.questionVersion : QUESTION_VERSION,
      locale: parsed.locale,
      index: parsed.index,
      answers,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : '',
    },
  };
}

export function writeSession(storage: StorageLike | undefined, session: SavedSession): { ok: true } | { ok: false; reason: 'unavailable' | 'quota' } {
  if (!storage) return { ok: false, reason: 'unavailable' };
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(session));
    return { ok: true };
  } catch (error) {
    const name = error instanceof DOMException ? error.name : '';
    if (name === 'QuotaExceededError') return { ok: false, reason: 'quota' };
    return { ok: false, reason: 'unavailable' };
  }
}

export function clearSession(storage: StorageLike | undefined): { ok: true } | { ok: false; reason: 'unavailable' } {
  if (!storage) return { ok: false, reason: 'unavailable' };
  try {
    storage.removeItem(STORAGE_KEY);
    return { ok: true };
  } catch {
    return { ok: false, reason: 'unavailable' };
  }
}

export function browserStorage(): StorageLike | undefined {
  if (typeof localStorage === 'undefined') return undefined;
  return localStorage;
}
