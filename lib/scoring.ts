import type {
  Company,
  LetterGrade,
  PillarScores,
  ResearchCycle,
} from "@/lib/domain/types";
import { gradeForScore } from "@/lib/grading";

export const PILLAR_WEIGHTS = {
  Environmental: 0.25,
  "Financial responsibility": 0.25,
  Philanthropy: 0.25,
  Ethics: 0.25,
} as const satisfies Record<keyof PillarScores, number>;

export function calculateOverallScore(pillars: PillarScores): number {
  const score = (Object.keys(PILLAR_WEIGHTS) as (keyof PillarScores)[]).reduce(
    (sum, pillar) => sum + pillars[pillar] * PILLAR_WEIGHTS[pillar],
    0,
  );
  return Number(score.toFixed(1));
}

export type RankedCompany = {
  company: Company;
  rank: number;
  grade: LetterGrade;
};

/**
 * Scores determine order. Exact ties are resolved by company name so every
 * company has a stable, reproducible ordinal position from 1 through 500.
 */
export function rankCompanies(companies: readonly Company[]): RankedCompany[] {
  return [...companies]
    .sort((left, right) => right.score - left.score || left.name.localeCompare(right.name))
    .map((company, index) => ({
      company,
      rank: index + 1,
      grade: gradeForScore(company.score),
    }));
}

export function validateScoringEngine(
  companies: readonly Company[],
  cycles: readonly ResearchCycle[],
): string[] {
  const issues: string[] = [];
  const slugs = new Set<string>();
  const rankings = rankCompanies(companies);

  if (companies.length !== 500) issues.push(`Expected 500 companies; received ${companies.length}.`);
  for (const company of companies) {
    if (slugs.has(company.slug)) issues.push(`${company.name}: duplicate company slug.`);
    slugs.add(company.slug);
    if (!company.name.trim()) issues.push(`${company.slug}: missing company name.`);
    if (!company.industry.trim()) issues.push(`${company.name}: missing industry.`);
    if (!Number.isFinite(company.score) || company.score < 0 || company.score > 100) {
      issues.push(`${company.name}: invalid overall score.`);
    }
    if (company.grade !== gradeForScore(company.score)) {
      issues.push(`${company.name}: grade does not match the shared grading scale.`);
    }
    for (const [pillar, value] of Object.entries(company.pillars)) {
      if (!Number.isFinite(value) || value < 0 || value > 100) {
        issues.push(`${company.name}: invalid ${pillar} score.`);
      }
    }
    if (company.fortuneRank !== null) {
      if (!Number.isInteger(company.fortuneRank) || company.fortuneRank < 1 || company.fortuneRank > 500) {
        issues.push(`${company.name}: Fortune rank is outside the published 1–500 range.`);
      }
    }
    if (!company.executive?.name.trim()) issues.push(`${company.name}: missing CEO.`);
    if (!company.website.startsWith("http")) issues.push(`${company.name}: invalid website.`);
  }
  rankings.forEach(({ rank }, index) => {
    if (rank !== index + 1) issues.push(`Invalid leaderboard rank at position ${index + 1}.`);
  });
  if (new Set(cycles.map((cycle) => cycle.id)).size !== cycles.length) {
    issues.push("Duplicate research-cycle identifier.");
  }
  if (cycles.filter((cycle) => cycle.status === "updating").length > 1) {
    issues.push("More than one research cycle is marked updating.");
  }
  for (const cycle of cycles.filter((item) => item.status === "complete")) {
    if (!cycle.completedAt) issues.push(`${cycle.id}: completed cycle is missing a completion date.`);
    if (cycle.companiesReviewed !== companies.length) {
      issues.push(`${cycle.id}: completed cycle does not include every company.`);
    }
  }
  const currentCycle = cycles.at(-1);
  if (currentCycle?.status === "complete") {
    for (const company of companies) {
      if (!company.cycleHistory?.some((snapshot) => snapshot.cycleId === currentCycle.id)) {
        issues.push(`${company.name}: missing snapshot for completed cycle ${currentCycle.id}.`);
      }
    }
  }
  return issues;
}
