import {
  companyRecords,
  industryRecords,
  methodologyRecords,
  newsRecords,
  reportRecords,
  researchRecords,
  researcherRecords,
} from "@/data/platform";
import type { Company } from "@/lib/domain/types";

export type CompanyQuery = {
  query?: string;
  industry?: string;
  grade?: string;
  minScore?: number;
  maxScore?: number;
  minRevenue?: number;
  maxRevenue?: number;
  minEmployees?: number;
  headquarters?: string;
  researchAvailable?: boolean;
  sort?: "score-desc" | "score-asc" | "alphabetical" | "newest" | "improved" | "fortune";
};

const normalize = (value: string) => value.trim().toLowerCase();

export function queryCompanies(filters: CompanyQuery = {}): Company[] {
  const query = normalize(filters.query ?? "");
  const rows = companyRecords.filter((company) => {
    const haystack =
      `${company.name} ${company.ticker} ${company.industry} ${company.headquarters} ${company.grade} ${Object.entries(company.pillars).map(([pillar, score]) => `${pillar} ${score}`).join(" ")} ${company.fortuneRank ? `fortune ${company.fortuneRank}` : "not ranked private"}`.toLowerCase();
    return (
      (!query || haystack.includes(query)) &&
      (!filters.industry || company.industrySlug === filters.industry) &&
      (!filters.grade || company.grade === filters.grade) &&
      (filters.minScore === undefined || company.score >= filters.minScore) &&
      (filters.maxScore === undefined || company.score <= filters.maxScore) &&
      (filters.minRevenue === undefined || company.revenueBillions >= filters.minRevenue) &&
      (filters.maxRevenue === undefined || company.revenueBillions <= filters.maxRevenue) &&
      (filters.minEmployees === undefined || company.employees >= filters.minEmployees) &&
      (!filters.headquarters ||
        normalize(company.headquarters).includes(normalize(filters.headquarters))) &&
      (!filters.researchAvailable || company.sources.length > 0)
    );
  });
  return rows.sort((a, b) => {
    switch (filters.sort) {
      case "score-asc":
        return a.score - b.score;
      case "alphabetical":
        return a.name.localeCompare(b.name);
      case "newest":
        return b.lastReviewed.localeCompare(a.lastReviewed);
      case "improved":
        return b.change - a.change;
      case "fortune":
        return (a.fortuneRank ?? 9999) - (b.fortuneRank ?? 9999);
      default:
        return b.score - a.score;
    }
  });
}

export const platformRepository = {
  companies: queryCompanies,
  company: (slug: string) => companyRecords.find((item) => item.slug === slug),
  industries: () => industryRecords,
  industry: (slug: string) => industryRecords.find((item) => item.slug === slug),
  research: () => researchRecords,
  article: (slug: string) => researchRecords.find((item) => item.slug === slug),
  reports: () => reportRecords,
  report: (slug: string) => reportRecords.find((item) => item.slug === slug),
  news: () => newsRecords,
  researchers: () => researcherRecords,
  methodology: () => methodologyRecords,
};
