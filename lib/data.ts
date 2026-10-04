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
import { publicationRecords } from "@/lib/publications";

export type { Company } from "@/lib/domain/types";
export const companies = companyRecords;
export const industries = industryRecords;
export const research = researchRecords;
export const publications = publicationRecords;
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
  ["Industries", "/industries"],
  ["Industry Intelligence", "/industry-intelligence"],
  ["Sustainable Investing", "/sustainable-investing"],
  ["Research Library", "/research"],
  ["Publications", "/publications"],
  ["Data Explorer", "/explorer"],
  ["Insights", "/insights"],
  ["News & Analysis", "/news"],
  ["Trends", "/trends"],
  ["Interactive Maps", "/map"],
  ["Statistics Center", "/statistics"],
  ["Methodology", "/methodology"],
  ["About", "/about"],
  ["Contact", "/contact"],
] as const;
