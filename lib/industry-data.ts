import type { Company, Industry } from "@/lib/domain/types";

const exactAliases: Record<string, string> = {
  healthcare: "Health Care",
  "health-care": "Health Care",
  "internet services & retailing": "Internet Services and Retailing",
  "motor vehicles and parts": "Motor Vehicles & Parts",
  "scientific, photographic and control equipment":
    "Scientific, Photographic and Control Equipment",
};

const comparisonKey = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

export function normalizeIndustryName(value: string): string {
  const cleaned = value.trim().replace(/\s+/g, " ");
  return exactAliases[cleaned.toLowerCase()] ?? cleaned;
}

export function industrySlug(value: string): string {
  return comparisonKey(normalizeIndustryName(value)).replace(/\s+/g, "-");
}

export function industriesMatch(left: string, right: string): boolean {
  return comparisonKey(normalizeIndustryName(left)) === comparisonKey(normalizeIndustryName(right));
}

export function validNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function average(values: readonly unknown[]): number | null {
  const valid = values.filter(validNumber);
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : null;
}

export function median(values: readonly unknown[]): number | null {
  const valid = values.filter(validNumber).sort((a, b) => a - b);
  if (!valid.length) return null;
  const middle = Math.floor(valid.length / 2);
  return valid.length % 2 ? valid[middle] : (valid[middle - 1] + valid[middle]) / 2;
}

export const formatIndustryNumber = (value: number | null, digits = 1) =>
  validNumber(value) ? value.toFixed(digits) : "Data unavailable";

export type IndustryStats = {
  name: string;
  slug: string;
  companies: Company[];
  companyCount: number;
  averageScore: number | null;
  medianScore: number | null;
  highestScore: number | null;
  lowestScore: number | null;
  pillarAverages: {
    Environmental: number | null;
    "Financial responsibility": number | null;
    Philanthropy: number | null;
    Ethics: number | null;
    Governance: number | null;
  };
  leader: Company | null;
  lowestPerformer: Company | null;
  mostImproved: Company | null;
  trend: { year: number; score: number }[];
};

export function calculateIndustryStats(
  allCompanies: readonly Company[],
  industryName: string,
): IndustryStats {
  const name = normalizeIndustryName(industryName);
  const companies = allCompanies
    .filter((company) => industriesMatch(company.industry, name))
    .sort((a, b) => {
      if (!validNumber(a.score)) return 1;
      if (!validNumber(b.score)) return -1;
      return b.score - a.score || a.name.localeCompare(b.name);
    });
  const scored = companies.filter((company) => validNumber(company.score));
  const leader = scored[0] ?? null;
  const lowestPerformer = scored.at(-1) ?? null;
  const improved = companies
    .filter(
      (company) =>
        validNumber(company.change) &&
        company.historicalScores.filter((point) => validNumber(point.score)).length >= 2,
    )
    .sort((a, b) => b.change - a.change);
  const years = [
    ...new Set(
      companies.flatMap((company) =>
        company.historicalScores
          .filter((point) => validNumber(point.year) && validNumber(point.score))
          .map((point) => point.year),
      ),
    ),
  ].sort((a, b) => a - b);
  const trend = years.flatMap((year) => {
    const score = average(
      companies.map(
        (company) => company.historicalScores.find((point) => point.year === year)?.score,
      ),
    );
    return score === null ? [] : [{ year, score }];
  });

  return {
    name,
    slug: industrySlug(name),
    companies,
    companyCount: companies.length,
    averageScore: average(scored.map((company) => company.score)),
    medianScore: median(scored.map((company) => company.score)),
    highestScore: leader?.score ?? null,
    lowestScore: lowestPerformer?.score ?? null,
    pillarAverages: {
      Environmental: average(companies.map((company) => company.pillars.Environmental)),
      "Financial responsibility": average(
        companies.map((company) => company.pillars["Financial responsibility"]),
      ),
      Philanthropy: average(companies.map((company) => company.pillars.Philanthropy)),
      Ethics: average(companies.map((company) => company.pillars.Ethics)),
      Governance: null,
    },
    leader,
    lowestPerformer,
    mostImproved: improved[0] ?? null,
    trend,
  };
}

export function calculateAllIndustryStats(companies: readonly Company[]): IndustryStats[] {
  return [...new Set(companies.map((company) => normalizeIndustryName(company.industry)))]
    .map((name) => calculateIndustryStats(companies, name))
    .filter((stats) => stats.companyCount > 0)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function validateIndustryRegistry(
  companies: readonly Company[],
  industries: readonly Industry[],
): string[] {
  const issues: string[] = [];
  const slugs = new Set<string>();
  for (const industry of industries) {
    if (slugs.has(industry.slug)) issues.push(`Duplicate industry slug: ${industry.slug}`);
    slugs.add(industry.slug);
    const stats = calculateIndustryStats(companies, industry.name);
    if (!stats.companyCount) issues.push(`${industry.name}: no companies`);
    for (const [label, value] of Object.entries({
      average: stats.averageScore,
      median: stats.medianScore,
      highest: stats.highestScore,
      lowest: stats.lowestScore,
      environmental: stats.pillarAverages.Environmental,
      financial: stats.pillarAverages["Financial responsibility"],
      philanthropy: stats.pillarAverages.Philanthropy,
      ethics: stats.pillarAverages.Ethics,
    })) {
      if (!validNumber(value)) issues.push(`${industry.name}: invalid ${label} statistic`);
    }
    if (!stats.leader) issues.push(`${industry.name}: no top company`);
    if (!stats.lowestPerformer) issues.push(`${industry.name}: no lowest-performing company`);
  }
  for (const company of companies) {
    const canonicalSlug = industrySlug(company.industry);
    if (company.industrySlug !== canonicalSlug) {
      issues.push(`${company.name}: industry slug does not match its canonical industry`);
    }
    if (!slugs.has(canonicalSlug)) issues.push(`${company.name}: missing industry route`);
  }
  return issues;
}

export function resolveIndustryCoverage(
  coverage: string,
  availableIndustries: readonly { name: string; slug: string }[],
) {
  const aliases: Record<string, string[]> = {
    aerospace: ["Aerospace & Defense"],
    automotive: ["Motor Vehicles & Parts"],
    "financial services": ["Diversified Financials", "Commercial Banks"],
    healthcare: ["Health Care: Insurance and Managed Care", "Health Care: Medical Facilities"],
    logistics: ["Transportation and Logistics", "Mail, Package, and Freight Delivery"],
    retail: ["General Merchandisers", "Specialty Retailers: Other"],
    technology: ["Computer Software", "Information Technology Services"],
    tobacco: ["Tobacco"],
    wholesale: ["Wholesalers: Diversified", "Wholesalers: Health Care"],
    "food & beverage": ["Food Consumer Products", "Beverages"],
  };
  const wanted = [coverage, ...(aliases[coverage.toLowerCase()] ?? [])];
  return availableIndustries.find((industry) =>
    wanted.some(
      (candidate) =>
        industriesMatch(industry.name, candidate) || industry.slug === industrySlug(candidate),
    ),
  );
}
