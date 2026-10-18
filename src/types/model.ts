export const LOCALES = ['en', 'zh'] as const;
export type Locale = (typeof LOCALES)[number];

export interface Localized {
  en: string;
  zh: string;
}

export const DIMENSION_IDS = [
  'ontology',
  'epistemology',
  'ethics',
  'agency',
  'meaning',
  'society',
] as const;

export type DimensionId = (typeof DIMENSION_IDS)[number];

export type PoleSide = 'left' | 'right';

export type QuestionType = 'likert' | 'scenario' | 'thought-experiment' | 'forced-choice';

export type ResponseKind = 'directional' | 'uncertain' | 'alternative';

export interface QuestionOption {
  id: string;
  label: Localized;
  kind: ResponseKind;
  weights?: Partial<Record<DimensionId, number>>;
  alternativeTag?: string;
}

export interface ReferenceLink {
  label: string;
  href: string;
}

export interface Question {
  id: string;
  version: string;
  type: QuestionType;
  theme: Localized;
  prompt: Localized;
  options: QuestionOption[];
  dimensions: DimensionId[];
  primaryDimension?: DimensionId;
  rationale: Localized;
  references?: ReferenceLink[];
  reverseKeyed?: boolean;
  tags: string[];
}

export type Inclination = 'left' | 'right' | 'mixed' | 'insufficient';

export interface DimensionScore {
  dimension: DimensionId;
  score: number | null;
  inclination: Inclination;
  coverage: number;
  applicableCount: number;
  directionalCount: number;
  uncertainCount: number;
  alternativeCount: number;
  skippedCount: number;
  inconsistency: number | null;
  signedSum: number;
  minSum: number;
  maxSum: number;
  leftCount: number;
  rightCount: number;
  alternativeTags: Record<string, number>;
}

export type AssignmentStatus = 'definitive' | 'provisional' | 'withheld';

export interface Assignment {
  status: AssignmentStatus;
  code: string | null;
  reasons: Localized[];
}

export type TensionKind =
  | 'logical-inconsistency'
  | 'philosophical-disagreement'
  | 'apparent-tension'
  | 'context-dependent'
  | 'unresolved-uncertainty';

export interface ActivatedTension {
  id: string;
  kind: TensionKind;
  dimensions: DimensionId[];
}

export interface AssessmentResult {
  modelVersion: string;
  questionVersion: string;
  dimensions: Record<DimensionId, DimensionScore>;
  assignment: Assignment;
  tensions: ActivatedTension[];
  answeredCount: number;
  skippedCount: number;
  uncertainCount: number;
  totalQuestions: number;
  invalidAnswerIds: string[];
}

export type FamilyId =
  | 'explorers'
  | 'harmonists'
  | 'creators'
  | 'pragmatists'
  | 'seekers'
  | 'guardians'
  | 'transcendents'
  | 'architects';

export interface Archetype {
  code: string;
  poles: Record<DimensionId, PoleSide>;
  letters: Record<DimensionId, string>;
  familyId: FamilyId;
  name: Localized;
  thesis: Localized;
  worldview: Localized[];
  strengths: Localized[];
  blindSpots: Localized[];
  pairingPressure: Localized;
  reflection: Localized[];
  traditionSlugs: string[];
  readingIds: string[];
  standingIssueIds: string[];
  seoTitle: Localized;
  seoDescription: Localized;
}

export interface DimensionDefinition {
  id: DimensionId;
  plainName: Localized;
  technicalName: Localized;
  leftLetter: string;
  rightLetter: string;
  leftPole: Localized;
  rightPole: Localized;
  question: Localized;
  summary: Localized;
  leftEssay: Localized;
  rightEssay: Localized;
  mixedEssay: Localized;
  notThis: Localized[];
  relatedTraditionSlugs: string[];
  relatedPhilosopherSlugs: string[];
}

export interface Philosopher {
  slug: string;
  name: Localized;
  dates: Localized;
  datesNote?: Localized;
  traditionSlugs: string[];
  themes: Localized[];
  biography: Localized;
  works: Array<{ title: Localized; detail: Localized }>;
  questions: Localized[];
  dimensions: DimensionId[];
  readingNote: Localized;
  references: ReferenceLink[];
}

export interface Tradition {
  slug: string;
  name: Localized;
  summary: Localized;
  essay: Localized;
  dimensions: DimensionId[];
  philosopherSlugs: string[];
  references: ReferenceLink[];
}

export interface ThoughtExperiment {
  slug: string;
  title: Localized;
  attribution: Localized;
  summary: Localized;
  essay: Localized[];
  dimensions: DimensionId[];
  questionIds: string[];
  references: ReferenceLink[];
}

export interface Article {
  slug: string;
  title: Localized;
  description: Localized;
  sections: Array<{ heading: Localized; body: Localized }>;
}

export interface GlossaryEntry {
  id: string;
  term: Localized;
  definition: Localized;
}

export interface ReadingWork {
  id: string;
  citation: Localized;
  topic: Localized;
  matches: Array<{ dimension: DimensionId; side: PoleSide }>;
}

export interface FamilyDefinition {
  id: FamilyId;
  name: Localized;
  rule: Localized;
  essay: Localized;
}

export interface TensionRule {
  id: string;
  kind: TensionKind;
  dimensions: DimensionId[];
  problem: Localized;
  explanation: Localized;
  alternatives: Localized;
  followUp: Localized;
  experimentSlug?: string;
  tradition: Localized;
  because: Localized;
  sources: ReferenceLink[];
  activates: (result: AssessmentResult) => boolean;
}

export interface StandingIssue {
  id: string;
  kind: TensionKind;
  dimensions: DimensionId[];
  title: Localized;
  explanation: Localized;
  alternatives: Localized;
  sources: ReferenceLink[];
  applies: (poles: Record<DimensionId, PoleSide>) => boolean;
}

export interface PremiumSection {
  id: string;
  title: Localized;
  body: Localized;
}

export type CheckoutResult =
  | { status: 'not_configured'; messageKey: 'notConfigured' }
  | { status: 'redirect'; url: string }
  | { status: 'unavailable'; messageKey: 'unavailable' };
