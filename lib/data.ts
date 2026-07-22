/**
 * Compatibility facade for UI components. New server code should import the
 * repository so a database adapter can replace the seed without UI changes.
 */
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

export type { Company } from "@/lib/domain/types";
export const companies = companyRecords;
export const industries = industryRecords;
export const research = researchRecords;
export const reports = reportRecords;
export const news = newsRecords;
export const team = researcherRecords;
export const methodologySections = methodologyRecords;

export const companyDetails: Record<
  string,
  Pick<Company, "strengths" | "weaknesses" | "initiatives" | "sources" | "researchNotes">
> = Object.fromEntries(
  companies.map((company) => [
    company.slug,
    {
      strengths: company.strengths,
      weaknesses: company.weaknesses,
      initiatives: company.initiatives,
      sources: company.sources,
      researchNotes: company.researchNotes,
    },
  ]),
);

export const navItems = [
  ["Leaderboard", "/leaderboard"],
  ["Compare", "/compare"],
  ["Map", "/map"],
  ["Industries", "/industries"],
  ["Dashboard", "/dashboard"],
  ["Research", "/research"],
  ["News", "/news"],
  ["Annual Report", "/annual-report"],
  ["Methodology", "/methodology"],
  ["About", "/about"],
] as const;
