import type { LetterGrade, PillarScores } from "@/lib/domain/types";

export const PILLARS: readonly (keyof PillarScores)[];
export const RUBRIC_DIMENSIONS: readonly [
  "Commitment",
  "Governance",
  "Implementation",
  "Outcome",
  "Verification",
];
export const PILLAR_WEIGHTS: Readonly<Record<keyof PillarScores, number>>;
export const RUBRIC_WEIGHTS: Readonly<Record<(typeof RUBRIC_DIMENSIONS)[number], number>>;

export type EvidenceSource = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  publishedOn?: string | null;
  accessedOn: string;
  type: "filing" | "report" | "news" | "government" | "company" | "industry";
  manualVerifiedOn?: string;
  manualVerificationNote?: string;
};

export type RubricObservation = {
  score: number;
  evidence: string;
  analysis: string;
  sourceIds: string[];
};

export type ResearchAssessment = {
  companySlug: string;
  cycleId: string;
  reviewer: string;
  reviewedOn: string;
  sources: EvidenceSource[];
  facts: Record<string, { value: unknown; sourceIds: string[]; unavailableReason?: string }>;
  pillars: Record<
    keyof PillarScores,
    Record<(typeof RUBRIC_DIMENSIONS)[number], RubricObservation>
  >;
  analysis: Record<
    "strengths" | "concerns" | "changes" | "trends" | "monitor" | "opportunities",
    string
  >;
  initiatives?: { title: string; detail: string; sourceIds: string[] }[];
  recentNews?: {
    headline: string;
    publishedAt: string;
    summary: string;
    publication: string;
    url: string;
    sourceIds: string[];
  }[];
};

export function gradeForScore(score: number): LetterGrade;
export function calculateOverallScore(pillars: PillarScores): number;
export function calculatePillarScore(
  observations: Record<(typeof RUBRIC_DIMENSIONS)[number], RubricObservation>,
): number;
export function calculateAssessmentScore(assessment: ResearchAssessment): {
  pillars: PillarScores;
  score: number;
  grade: LetterGrade;
};
export function validateAssessment(assessment: ResearchAssessment, cycleId: string): string[];
export function rankScoredCompanies<T extends { name: string; score: number }>(
  companies: readonly T[],
): (T & { rank: number })[];
