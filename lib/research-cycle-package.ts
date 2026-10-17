import type { Company, LetterGrade, PillarScores, ResearchCycle } from "@/lib/domain/types";
import type { ResearchAssessment } from "@/lib/scoring-engine.mjs";
import {
  calculateAssessmentScore,
  rankScoredCompanies,
  validateAssessment,
} from "@/lib/scoring-engine.mjs";
import { industrySlug, normalizeIndustryName } from "@/lib/industry-data";

export type ResearchCyclePackage = {
  cycle: ResearchCycle;
  assessments: ResearchAssessment[];
  generatedAt: string | null;
  integrityHash: string | null;
};

const fact = <T>(assessment: ResearchAssessment, key: string): T =>
  assessment.facts[key].value as T;

function seedBaselineHistory(
  baselineCompanies: readonly Company[],
  baselineCycleId: string,
  baselineCycleDate: string,
): Company[] {
  const baselineRank = new Map(
    rankScoredCompanies(baselineCompanies).map((company) => [company.slug, company.rank]),
  );
  return baselineCompanies.map((company) => ({
    ...company,
    publishedCycleId: baselineCycleId,
    cycleHistory: [
      {
        cycleId: baselineCycleId,
        cycleDate: baselineCycleDate,
        score: company.score,
        rank: baselineRank.get(company.slug)!,
        grade: company.grade as LetterGrade,
        pillars: { ...company.pillars },
      },
    ],
  }));
}

function applyCompletedPackage(
  previousCompanies: readonly Company[],
  researchPackage: ResearchCyclePackage,
): Company[] {
  if (researchPackage.cycle.status !== "complete") return [...previousCompanies];

  if (researchPackage.assessments.length !== previousCompanies.length) {
    throw new Error(
      `${researchPackage.cycle.id}: expected ${previousCompanies.length} assessments, received ${researchPackage.assessments.length}.`,
    );
  }
  const knownSlugs = new Set(previousCompanies.map((company) => company.slug));
  const assessmentBySlug = new Map<string, ResearchAssessment>();
  for (const assessment of researchPackage.assessments) {
    if (!knownSlugs.has(assessment.companySlug)) {
      throw new Error(`${researchPackage.cycle.id}: unknown company ${assessment.companySlug}.`);
    }
    if (assessmentBySlug.has(assessment.companySlug)) {
      throw new Error(`${researchPackage.cycle.id}: duplicate company ${assessment.companySlug}.`);
    }
    const issues = validateAssessment(assessment, researchPackage.cycle.id);
    if (issues.length) {
      throw new Error(`${assessment.companySlug}:\n${issues.join("\n")}`);
    }
    assessmentBySlug.set(assessment.companySlug, assessment);
  }

  const scored = previousCompanies.map((company) => {
    const assessment = assessmentBySlug.get(company.slug)!;
    const result = calculateAssessmentScore(assessment) as {
      pillars: PillarScores;
      score: number;
      grade: LetterGrade;
    };
    const sourceById = new Map(assessment.sources.map((source) => [source.id, source]));
    const ceoSource = sourceById.get(assessment.facts.ceo.sourceIds[0])!;
    const industry = normalizeIndustryName(fact<string>(assessment, "industry"));
    return {
      ...company,
      name: fact<string>(assessment, "companyName"),
      ticker: fact<string>(assessment, "ticker"),
      industry,
      industrySlug: industrySlug(industry),
      headquarters: fact<string>(assessment, "headquarters"),
      location: fact<string>(assessment, "headquarters"),
      founded: fact<number>(assessment, "founded"),
      employees: fact<number>(assessment, "employees"),
      revenueBillions: fact<number>(assessment, "revenueBillions"),
      marketCapBillions: assessment.facts.marketCapBillions
        ? fact<number | null>(assessment, "marketCapBillions")
        : company.marketCapBillions,
      fortuneRank: fact<number>(assessment, "fortuneRank"),
      fortuneRankYear: fact<number>(assessment, "fortuneRankYear"),
      website: fact<string>(assessment, "website"),
      logo: fact<string | null>(assessment, "logo"),
      ceo: fact<string>(assessment, "ceo"),
      executive: {
        name: fact<string>(assessment, "ceo"),
        title: fact<string>(assessment, "ceoTitle"),
        appointedYear: assessment.facts.ceoAppointedYear
          ? fact<number>(assessment, "ceoAppointedYear")
          : null,
        headshot: company.executive?.headshot ?? null,
        biography: assessment.analysis.changes,
        sourceUrl: ceoSource.url,
        verifiedAt: assessment.reviewedOn,
        status: "verified" as const,
      },
      score: result.score,
      grade: result.grade,
      change: Number((result.score - company.score).toFixed(1)),
      pillars: result.pillars,
      strengths: [assessment.analysis.strengths],
      weaknesses: [assessment.analysis.concerns],
      opportunities: [assessment.analysis.opportunities],
      initiatives: (assessment.initiatives ?? []).map(({ title, detail }) => ({ title, detail })),
      recentNews: (assessment.recentNews ?? []).map((item) => ({
        headline: item.headline,
        publishedAt: item.publishedAt,
        summary: item.summary,
        publication: item.publication,
        url: item.url,
        status: "verified" as const,
      })),
      researchNotes: [
        assessment.analysis.changes,
        assessment.analysis.trends,
        assessment.analysis.monitor,
      ],
      sources: assessment.sources.map((source) => ({
        title: source.title,
        publisher: source.publisher,
        year: Number((source.publishedOn ?? assessment.reviewedOn).slice(0, 4)),
        url: source.url,
        accessed: source.accessedOn,
      })),
      lastReviewed: assessment.reviewedOn,
      publishedCycleId: researchPackage.cycle.id,
    } satisfies Company;
  });

  const currentRank = new Map(
    rankScoredCompanies(scored).map((company) => [company.slug, company.rank]),
  );
  return scored.map((company) => ({
    ...company,
    cycleHistory: [
      ...(company.cycleHistory ?? []),
      {
        cycleId: researchPackage.cycle.id,
        cycleDate: researchPackage.cycle.completedAt!,
        score: company.score,
        rank: currentRank.get(company.slug)!,
        grade: company.grade as LetterGrade,
        pillars: { ...company.pillars },
      },
    ],
  }));
}

export function applyResearchCyclePackages(
  baselineCompanies: readonly Company[],
  publishedPackages: readonly ResearchCyclePackage[],
  currentPackage: ResearchCyclePackage,
  baselineCycleId: string,
  baselineCycleDate: string,
): Company[] {
  let companies = seedBaselineHistory(baselineCompanies, baselineCycleId, baselineCycleDate);
  const applied = new Set<string>();
  for (const researchPackage of [...publishedPackages, currentPackage]) {
    if (researchPackage.cycle.status !== "complete" || applied.has(researchPackage.cycle.id)) {
      continue;
    }
    companies = applyCompletedPackage(companies, researchPackage);
    applied.add(researchPackage.cycle.id);
  }
  return companies;
}
