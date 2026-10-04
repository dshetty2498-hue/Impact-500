import type { Company } from "@/lib/domain/types";

const placeholderPattern =
  /^(?:unknown|n\/?a|not yet verified|ceo tbd|tbd|blank|executive record in verification)?$/i;
const allowedSharedNames = new Set(["Kevin Murphy"]);

export type LeadershipValidationReport = {
  checked: number;
  valid: number;
  issues: string[];
  reviewedSharedNames: { name: string; companies: string[] }[];
};

export function validateCompanyLeadership(
  companies: readonly Company[],
): LeadershipValidationReport {
  const issues: string[] = [];
  const slugs = new Set<string>();
  const ranks = new Map<number, string[]>();
  const leaders = new Map<string, string[]>();

  if (companies.length !== 500)
    issues.push(`Expected 500 companies; received ${companies.length}.`);

  for (const company of companies) {
    if (slugs.has(company.slug)) issues.push(`Duplicate company slug: ${company.slug}.`);
    slugs.add(company.slug);

    if (company.fortuneRank === null || company.fortuneRank < 1 || company.fortuneRank > 500) {
      issues.push(`${company.name}: invalid Fortune rank.`);
    } else {
      ranks.set(company.fortuneRank, [...(ranks.get(company.fortuneRank) ?? []), company.name]);
    }

    const executive = company.executive;
    const name = executive?.name.trim() ?? "";
    if (!name || placeholderPattern.test(name)) issues.push(`${company.name}: missing CEO name.`);
    if (company.ceo !== name)
      issues.push(`${company.name}: CEO summary and executive record differ.`);
    if (!executive?.title.trim() || placeholderPattern.test(executive.title.trim())) {
      issues.push(`${company.name}: missing CEO title.`);
    }
    if (!executive?.sourceUrl.startsWith("http")) {
      issues.push(`${company.name}: leadership source is missing or invalid.`);
    }
    if (executive?.status !== "verified") {
      issues.push(`${company.name}: leadership record is not verified.`);
    }
    if (!/^2026-\d{2}-\d{2}$/.test(executive?.verifiedAt ?? "")) {
      issues.push(`${company.name}: leadership review date is stale or invalid.`);
    }
    if (name) leaders.set(name, [...(leaders.get(name) ?? []), company.name]);
  }

  const reviewedSharedNames = [...leaders.entries()]
    .filter(([, companyNames]) => companyNames.length > 1)
    .map(([name, companyNames]) => ({ name, companies: companyNames }));
  for (const duplicate of reviewedSharedNames) {
    if (!allowedSharedNames.has(duplicate.name)) {
      issues.push(
        `Unreviewed duplicate CEO name ${duplicate.name}: ${duplicate.companies.join(", ")}.`,
      );
    }
  }

  return {
    checked: companies.length,
    valid: companies.length - new Set(issues.map((issue) => issue.split(":")[0])).size,
    issues,
    reviewedSharedNames,
  };
}
