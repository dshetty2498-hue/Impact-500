import type { Company, PillarScores } from "@/lib/domain/types";

export type RiskLevel = "Low" | "Moderate" | "Elevated" | "High";
export type RiskCategory =
  | "Environmental Risk"
  | "Supply Chain Risk"
  | "Regulatory Risk"
  | "Governance Risk"
  | "Workforce Risk"
  | "Reputational Risk"
  | "Financial Responsibility Risk"
  | "Technology / Cyber Risk"
  | "Geopolitical Risk";

export type CompanyRisk = {
  category: RiskCategory;
  level: RiskLevel;
  frameworkPillar: keyof PillarScores;
  whyItMatters: string;
  evidence: string;
  analysis: string;
  potentialImplication: string;
  source: { title: string; organization: string; url: string };
};

type RiskTemplate = Omit<CompanyRisk, "level" | "evidence" | "analysis"> & {
  baseLevel: Exclude<RiskLevel, "High">;
  context: string;
};

const sources = {
  environmental: {
    title: "Greenhouse Gas Reporting Program",
    organization: "U.S. Environmental Protection Agency",
    url: "https://www.epa.gov/ghgreporting",
  },
  supplyChain: {
    title: "Comply Chain: Business Tools for Labor Compliance in Global Supply Chains",
    organization: "U.S. Department of Labor",
    url: "https://www.dol.gov/agencies/ilab/comply-chain",
  },
  regulatory: {
    title: "How to Read a 10-K: Risk Factors",
    organization: "U.S. Securities and Exchange Commission",
    url: "https://www.sec.gov/answers/reada10k.htm",
  },
  governance: {
    title: "Corporate Governance",
    organization: "U.S. Securities and Exchange Commission",
    url: "https://www.sec.gov/spotlight/corporategovernance.shtml",
  },
  workforce: {
    title: "Workplace safety and health data",
    organization: "Occupational Safety and Health Administration",
    url: "https://www.osha.gov/data",
  },
  reputation: {
    title: "Guides for the Use of Environmental Marketing Claims",
    organization: "Federal Trade Commission",
    url: "https://www.ftc.gov/legal-library/browse/rules/green-guides",
  },
  finance: {
    title: "Fair Lending Report of the Consumer Financial Protection Bureau 2024",
    organization: "Consumer Financial Protection Bureau",
    url: "https://www.consumerfinance.gov/data-research/research-reports/fair-lending-report-of-the-consumer-financial-protection-bureau-2024/",
  },
  cyber: {
    title: "Cross-Sector Cybersecurity Performance Goals",
    organization: "Cybersecurity and Infrastructure Security Agency",
    url: "https://www.cisa.gov/cross-sector-cybersecurity-performance-goals",
  },
  geopolitical: {
    title: "Country Commercial Guides",
    organization: "International Trade Administration",
    url: "https://www.trade.gov/country-commercial-guides",
  },
} as const;

const templates: Record<RiskCategory, RiskTemplate> = {
  "Environmental Risk": {
    category: "Environmental Risk",
    baseLevel: "Elevated",
    frameworkPillar: "Environmental",
    context: "The sector can have material energy, emissions, water, waste, or physical-climate exposure.",
    whyItMatters: "Environmental performance can affect operating continuity, capital needs, disclosure credibility, and community relationships.",
    potentialImplication: "Weak measurement or transition planning could increase operating, compliance, financing, or reputation pressure.",
    source: sources.environmental,
  },
  "Supply Chain Risk": {
    category: "Supply Chain Risk",
    baseLevel: "Elevated",
    frameworkPillar: "Ethics",
    context: "The sector relies on extended supplier, contractor, logistics, or sourcing networks.",
    whyItMatters: "Limited traceability can obscure labor, human-rights, environmental, resilience, and product-quality exposure.",
    potentialImplication: "A control failure could disrupt supply, raise remediation costs, or weaken stakeholder confidence.",
    source: sources.supplyChain,
  },
  "Regulatory Risk": {
    category: "Regulatory Risk",
    baseLevel: "Elevated",
    frameworkPillar: "Ethics",
    context: "The sector operates under material licensing, safety, market-conduct, reporting, or product requirements.",
    whyItMatters: "Changes in rules or weak compliance controls can affect market access, costs, and stakeholder outcomes.",
    potentialImplication: "Control gaps or changing obligations could require remediation, investment, or changes to products and operations.",
    source: sources.regulatory,
  },
  "Governance Risk": {
    category: "Governance Risk",
    baseLevel: "Moderate",
    frameworkPillar: "Ethics",
    context: "Large, complex organizations depend on clear oversight, incentives, controls, and escalation channels.",
    whyItMatters: "Board and executive governance determines whether responsibility commitments influence real operating decisions.",
    potentialImplication: "Unclear accountability could slow issue detection, corrective action, and credible disclosure.",
    source: sources.governance,
  },
  "Workforce Risk": {
    category: "Workforce Risk",
    baseLevel: "Moderate",
    frameworkPillar: "Ethics",
    context: "The operating model depends on a substantial, distributed, specialized, or frontline workforce.",
    whyItMatters: "Safety, retention, skills, scheduling, and employee voice can materially affect execution and social impact.",
    potentialImplication: "Persistent workforce gaps could affect continuity, service quality, costs, and trust.",
    source: sources.workforce,
  },
  "Reputational Risk": {
    category: "Reputational Risk",
    baseLevel: "Moderate",
    frameworkPillar: "Ethics",
    context: "The business has direct consumer visibility or makes public product and responsibility claims.",
    whyItMatters: "Trust depends on claims being specific, substantiated, and consistent with disclosed outcomes.",
    potentialImplication: "A gap between claims and evidence could reduce customer, employee, or investor confidence.",
    source: sources.reputation,
  },
  "Financial Responsibility Risk": {
    category: "Financial Responsibility Risk",
    baseLevel: "Elevated",
    frameworkPillar: "Financial responsibility",
    context: "The business influences access to credit, insurance, investment, payment, or other essential financial products.",
    whyItMatters: "Product fairness, customer outcomes, access, and risk governance are central responsibility concerns.",
    potentialImplication: "Weak customer-outcome controls could create compliance, remediation, and trust costs.",
    source: sources.finance,
  },
  "Technology / Cyber Risk": {
    category: "Technology / Cyber Risk",
    baseLevel: "Elevated",
    frameworkPillar: "Ethics",
    context: "The company depends on digital systems, sensitive data, connected products, or critical technology infrastructure.",
    whyItMatters: "Security, privacy, resilience, and responsible-technology controls affect customers and business continuity.",
    potentialImplication: "A material control failure could disrupt operations, expose data, or require costly remediation.",
    source: sources.cyber,
  },
  "Geopolitical Risk": {
    category: "Geopolitical Risk",
    baseLevel: "Moderate",
    frameworkPillar: "Financial responsibility",
    context: "The sector often depends on cross-border markets, specialized inputs, trade routes, or international regulation.",
    whyItMatters: "Trade restrictions, conflict, sanctions, and market fragmentation can change sourcing and operating assumptions.",
    potentialImplication: "Concentration or abrupt policy changes could increase costs or interrupt access to inputs and markets.",
    source: sources.geopolitical,
  },
};

const categorySet = (industry: string): RiskCategory[] => {
  const value = industry.toLowerCase();
  if (/petroleum|energy|utility|utilities|mining|chemical|metals|forest|pipeline/.test(value))
    return ["Environmental Risk", "Regulatory Risk", "Workforce Risk", "Reputational Risk"];
  if (/bank|insurance|financial|securities|diversified financial|real estate/.test(value))
    return ["Financial Responsibility Risk", "Regulatory Risk", "Technology / Cyber Risk", "Governance Risk"];
  if (/computer|software|internet|telecommunication|semiconductor|network|electronics/.test(value))
    return ["Technology / Cyber Risk", "Supply Chain Risk", "Governance Risk", "Geopolitical Risk"];
  if (/health|pharmaceutical|medical/.test(value))
    return ["Regulatory Risk", "Technology / Cyber Risk", "Supply Chain Risk", "Workforce Risk"];
  if (/retail|apparel|food|beverage|wholesale|consumer|household|restaurant/.test(value))
    return ["Supply Chain Risk", "Workforce Risk", "Reputational Risk", "Environmental Risk"];
  if (/aerospace|transport|airline|automotive|motor vehicle|logistics|shipping|railroad/.test(value))
    return ["Environmental Risk", "Supply Chain Risk", "Workforce Risk", "Geopolitical Risk"];
  return ["Governance Risk", "Workforce Risk", "Technology / Cyber Risk"];
};

const average = (values: number[]) =>
  values.length ? values.reduce((total, value) => total + value, 0) / values.length : null;

const adjustedLevel = (base: RiskTemplate["baseLevel"], delta: number | null): RiskLevel => {
  if (delta !== null && delta <= -10) return "High";
  if (delta !== null && delta <= -4) return "Elevated";
  if (delta !== null && delta >= 10 && base === "Moderate") return "Low";
  return base;
};

export function companyRiskAnalysis(company: Company, allCompanies: readonly Company[]) {
  const peers = allCompanies.filter((item) => item.industrySlug === company.industrySlug);
  const risks = categorySet(company.industry).map((category): CompanyRisk => {
    const template = templates[category];
    const companyValue = company.pillars[template.frameworkPillar];
    const peerValue = average(
      peers
        .map((item) => item.pillars[template.frameworkPillar])
        .filter((value) => Number.isFinite(value)),
    );
    const delta = peerValue === null ? null : companyValue - peerValue;
    const comparison =
      peerValue === null
        ? "A reliable peer comparison is not currently available."
        : `${template.frameworkPillar} is ${companyValue.toFixed(1)}, ${Math.abs(delta!).toFixed(1)} points ${delta! >= 0 ? "above" : "below"} the ${company.industry} average of ${peerValue.toFixed(1)}.`;
    return {
      ...template,
      level: adjustedLevel(template.baseLevel, delta),
      evidence: `${template.context} Impact Horizon company data: ${comparison}`,
      analysis: `Impact Horizon treats this as an exposure to monitor, not evidence that an adverse event has occurred. The level combines sector relevance with the company’s related pillar position against current peers and does not alter the CSR score.`,
    };
  });
  const order: Record<RiskLevel, number> = { Low: 0, Moderate: 1, Elevated: 2, High: 3 };
  const profile = risks.reduce<RiskLevel>(
    (current, risk) => (order[risk.level] > order[current] ? risk.level : current),
    "Low",
  );
  return { profile, risks };
}

export function analystObservations(company: Company, allCompanies: readonly Company[]) {
  const peers = allCompanies
    .filter((item) => item.industrySlug === company.industrySlug)
    .sort((a, b) => b.score - a.score);
  const peerAverage = average(peers.map((item) => item.score));
  const pillars = Object.entries(company.pillars).sort((a, b) => b[1] - a[1]) as [
    keyof PillarScores,
    number,
  ][];
  const latest = company.historicalScores.at(-1);
  const previous = company.historicalScores.at(-2);
  const trend = latest && previous ? latest.score - previous.score : null;
  const rank = peers.findIndex((item) => item.slug === company.slug) + 1;
  const risk = companyRiskAnalysis(company, allCompanies).risks[0];
  return [
    {
      label: "Major strength",
      text: `${pillars[0][0]} is the strongest current pillar at ${pillars[0][1].toFixed(1)}. This is a comparative signal from the Impact Horizon dataset, not an external assurance opinion.`,
    },
    {
      label: "Important gap",
      text: `${pillars.at(-1)![0]} is the lowest current pillar at ${pillars.at(-1)![1].toFixed(1)} and is the clearest area for deeper source review.`,
    },
    {
      label: "Trend",
      text:
        trend === null
          ? "Historical data is unavailable."
          : `The latest published research cycle moved ${trend >= 0 ? "+" : ""}${trend.toFixed(1)} points. The change describes the dataset and does not by itself establish causation.`,
    },
    {
      label: "Industry context",
      text:
        peerAverage === null
          ? "A reliable industry comparison is unavailable."
          : `${company.name} ranks ${rank || "outside the ranked set"} of ${peers.length} ${company.industry} companies and scores ${Math.abs(company.score - peerAverage).toFixed(1)} points ${company.score >= peerAverage ? "above" : "below"} the peer average.`,
    },
    {
      label: "Area to monitor",
      text: `${risk.category} is the leading sector-relevant watch area in this profile. Its inclusion identifies research exposure, not a finding of misconduct.`,
    },
    {
      label: "Potential opportunity",
      text: company.opportunities?.[0] ?? "Insufficient public information available.",
    },
  ];
}

export function industryRiskLandscape(members: readonly Company[], allCompanies: readonly Company[]) {
  const analyses = members.map((company) => ({
    company,
    analysis: companyRiskAnalysis(company, allCompanies),
  }));
  const counts = new Map<RiskCategory, number>();
  for (const { analysis } of analyses)
    for (const risk of analysis.risks) counts.set(risk.category, (counts.get(risk.category) ?? 0) + 1);
  const common = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category, count]) => ({ category, count, share: Math.round((count / members.length) * 100) }));
  const exposed = analyses
    .filter(({ analysis }) => analysis.profile === "High" || analysis.profile === "Elevated")
    .sort((a, b) => a.company.score - b.company.score)
    .slice(0, 6);
  return { common, exposed };
}

export function validateCompanyIntelligence(companies: readonly Company[]) {
  const issues: string[] = [];
  for (const company of companies) {
    if (company.founded !== null && (!Number.isInteger(company.founded) || company.founded < 1500))
      issues.push(`${company.name}: invalid founded year`);
    if (!company.executive?.name) issues.push(`${company.name}: missing CEO`);
    if (!company.industry) issues.push(`${company.name}: missing industry`);
    if (!Number.isFinite(company.score)) issues.push(`${company.name}: invalid CSR score`);
    const analysis = companyRiskAnalysis(company, companies);
    if (!analysis.risks.length) issues.push(`${company.name}: missing risk analysis`);
    if (!analystObservations(company, companies).length)
      issues.push(`${company.name}: missing analyst observations`);
    if (!company.sources.length) issues.push(`${company.name}: missing sources`);
    if (/placeholder|not yet verified|\bunknown\b|\bceo tbd\b/i.test(JSON.stringify(company)))
      issues.push(`${company.name}: placeholder text detected`);
  }
  return {
    checked: companies.length,
    foundedResolved: companies.filter((company) => company.founded !== null).length,
    foundedUnresolved: companies.filter((company) => company.founded === null).map((item) => item.slug),
    issues,
  };
}
