import { companyRecords, industryRecords, reportRecords, researchRecords } from "@/data/platform";
import type {
  Company,
  PillarScores,
  PublicationSource,
  ResearchArticle,
  ResearchPublication,
} from "@/lib/domain/types";
import { average, median } from "@/lib/industry-data";

type TopicConfig = {
  question: string;
  thesis: string;
  lens: string;
  patterns?: RegExp;
  focus?: keyof PillarScores;
  recommendations: string[];
  external: PublicationSource[];
  cover?: string;
};

const generalSources: PublicationSource[] = [
  {
    title: "Impact Horizon research methodology",
    organization: "Impact Horizon",
    date: "2026",
    url: "/methodology",
    category: "Impact Horizon Data",
  },
  {
    title: "EDGAR company filings search",
    organization: "U.S. Securities and Exchange Commission",
    date: "Current database",
    url: "https://www.sec.gov/edgar/search/",
    category: "Government Sources",
  },
  {
    title: "GRI Standards",
    organization: "Global Reporting Initiative",
    date: "Current standards",
    url: "https://www.globalreporting.org/standards/",
    category: "Standards and Nonprofit Sources",
  },
];

const climateSources: PublicationSource[] = [
  {
    title: "Greenhouse Gas Reporting Program",
    organization: "U.S. Environmental Protection Agency",
    date: "Updated July 30, 2026",
    url: "https://www.epa.gov/ghgreporting",
    category: "Government Sources",
  },
  {
    title: "Find and Use GHGRP Data",
    organization: "U.S. Environmental Protection Agency",
    date: "2023 reporting year data",
    url: "https://www.epa.gov/ghgreporting/find-and-use-ghgrp-data",
    category: "Government Sources",
  },
  {
    title: "Guides for the Use of Environmental Marketing Claims",
    organization: "U.S. Federal Trade Commission",
    date: "October 11, 2012",
    url: "https://www.ftc.gov/legal-library/browse/rules/green-guides",
    category: "Government Sources",
  },
];

const aiSources: PublicationSource[] = [
  {
    title: "Artificial Intelligence Risk Management Framework (AI RMF 1.0)",
    organization: "National Institute of Standards and Technology",
    date: "January 26, 2023",
    url: "https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10",
    category: "Government Sources",
  },
];

const workforceSources: PublicationSource[] = [
  {
    title: "Employee Tenure in 2024",
    organization: "U.S. Bureau of Labor Statistics",
    date: "September 26, 2024",
    url: "https://www.bls.gov/news.release/tenure.htm",
    category: "Government Sources",
  },
];

const healthSources: PublicationSource[] = [
  {
    title: "Health Care Access and Quality",
    organization: "Healthy People 2030, U.S. Department of Health and Human Services",
    date: "Current objectives",
    url: "https://odphp.health.gov/healthypeople/objectives-and-data/browse-objectives/health-care-access-and-quality",
    category: "Government Sources",
  },
  {
    title: "Social Determinants of Health",
    organization: "Healthy People 2030, U.S. Department of Health and Human Services",
    date: "Current framework",
    url: "https://odphp.health.gov/healthypeople/priority-areas/social-determinants-health",
    category: "Government Sources",
  },
];

const financeSources: PublicationSource[] = [
  {
    title: "Fair Lending Report of the Consumer Financial Protection Bureau 2024",
    organization: "Consumer Financial Protection Bureau",
    date: "December 23, 2025",
    url: "https://www.consumerfinance.gov/data-research/research-reports/fair-lending-report-of-the-consumer-financial-protection-bureau-2024/",
    category: "Government Sources",
  },
];

const commonRecommendations = [
  "Publish a stable set of outcome measures with definitions, boundaries, baselines, and prior-year comparatives.",
  "Identify the board committee, executive owner, and operating teams accountable for each material objective.",
  "Connect public commitments to capital allocation, implementation milestones, and a candid account of missed targets.",
  "Preserve source links and explain restatements so readers can reproduce the evidence trail.",
];

const configs: Record<string, TopicConfig> = {
  "annual-outlook-2025": {
    question:
      "Which evidence signals most clearly separate mature corporate-responsibility systems from disclosure-led programs?",
    thesis:
      "Across the Impact Horizon universe, credibility is best indicated by coherence between governance, implementation, and measured outcomes—not by the volume of commitments published.",
    lens: "index-wide evidence maturity and year-over-year direction",
    recommendations: commonRecommendations,
    external: generalSources,
  },
  "ai-accountability": {
    question:
      "What public evidence demonstrates that enterprise AI principles have become accountable operating controls?",
    thesis:
      "Enterprise AI governance becomes decision-useful only when principles are connected to named ownership, documented testing, escalation, monitoring, and lifecycle risk decisions.",
    lens: "AI governance, digital infrastructure, privacy, testing, and accountability",
    patterns: /computer|technology|software|telecommunication|internet|electronics|semiconductor/i,
    focus: "Ethics",
    recommendations: [
      "Map AI systems by use case, affected stakeholder, material risk, and accountable business owner.",
      "Document testing, incident escalation, third-party model controls, and decisions to restrict or retire systems.",
      "Report product-level governance evidence without exposing security-sensitive implementation details.",
      ...commonRecommendations.slice(0, 2),
    ],
    external: [...generalSources, ...aiSources],
    cover: "/images/research/ai-accountability.png",
  },
  "credible-climate": {
    question:
      "Which disclosures make a corporate climate strategy credible as an operating plan rather than a target statement?",
    thesis:
      "Climate claims are most credible when companies disclose stable emissions boundaries, operational reductions, capital dependencies, value-chain limits, and transparent treatment of offsets.",
    lens: "climate targets, operating emissions, transition execution, and claims substantiation",
    focus: "Environmental",
    recommendations: [
      "Separate gross operational reductions from offsets and disclose both with consistent boundaries.",
      "Reconcile transition objectives with asset lives, procurement decisions, and planned capital expenditure.",
      "Use facility and sector data where available to test company-level narratives against operating context.",
      ...commonRecommendations.slice(0, 2),
    ],
    external: [...generalSources, ...climateSources],
    cover: "/images/research/credible-climate.png",
  },
  "retail-workforce-signal": {
    question:
      "Which workforce disclosures distinguish program activity from durable employee outcomes in large retail organizations?",
    thesis:
      "Retail workforce reporting becomes comparable when training and participation metrics are paired with retention, mobility, safety, wage progression, and consistent denominators.",
    lens: "retail workforce outcomes, supply chains, access, and community effects",
    patterns: /retail|merchandiser|wholesaler|food|beverage|apparel/i,
    focus: "Philanthropy",
    recommendations: [
      "Pair training inputs with retention, internal mobility, safety, and wage-progression outcomes.",
      "Report workforce measures with workforce coverage, employment status, geography, and consistent denominators.",
      "Explain how supplier labor expectations are monitored and what remediation follows identified gaps.",
      ...commonRecommendations.slice(0, 2),
    ],
    external: [...generalSources, ...workforceSources],
    cover: "/images/research/retail-workforce-signal.png",
  },
  "impact-horizon-2026": {
    question:
      "What does comparable public evidence reveal about corporate-responsibility leadership across the 2026 Fortune 500 universe?",
    thesis:
      "The strongest current performers combine balanced pillar results with traceable evidence and positive momentum; an overall score is most useful when read alongside its pillar profile, sources, and sector context.",
    lens: "the full 2026 Impact Horizon company universe",
    recommendations: commonRecommendations,
    external: generalSources,
    cover: "/images/research/annual-outlook-2025.png",
  },
  "technology-outlook": {
    question:
      "How should technology-sector responsibility be assessed as AI adoption and infrastructure demands expand together?",
    thesis:
      "Technology leadership depends on integrating product governance with environmental infrastructure, supply-chain, workforce, privacy, and cybersecurity evidence rather than treating AI ethics as a standalone policy topic.",
    lens: "technology products, digital infrastructure, AI risk, and supply-chain responsibility",
    patterns: /computer|technology|software|telecommunication|internet|electronics|semiconductor/i,
    focus: "Ethics",
    recommendations: [
      "Map AI systems by use case, affected stakeholder, material risk, and accountable business owner.",
      "Document testing, incident escalation, third-party model controls, and decisions to restrict or retire systems.",
      "Report product-level governance evidence without exposing security-sensitive implementation details.",
      ...commonRecommendations.slice(0, 2),
    ],
    external: [...generalSources, ...aiSources],
    cover: "/images/research/ai-accountability.png",
  },
  "healthcare-benchmark": {
    question:
      "Which public responsibility signals best connect healthcare corporate practice to access, trust, workforce resilience, and patient outcomes?",
    thesis:
      "Healthcare responsibility evidence is strongest when enterprise policies are connected to access, affordability, patient safety, workforce capacity, and measurable community-health context.",
    lens: "healthcare access, patient trust, workforce resilience, and responsible innovation",
    patterns: /health|pharmaceutical|medical/i,
    focus: "Ethics",
    recommendations: [
      "Report access and affordability outcomes with population, geography, and service boundaries.",
      "Connect workforce resilience measures to care quality, safety, and continuity.",
      "Publish governance for patient data, clinical technology, and responsible innovation.",
      ...commonRecommendations.slice(0, 2),
    ],
    external: [...generalSources, ...healthSources],
  },
  "energy-sustainability": {
    question:
      "Which evidence makes an energy-company transition strategy credible against its operating footprint and capital decisions?",
    thesis:
      "Energy transition credibility rests on measurable operational emissions, asset- and capital-level implementation, methane and community evidence, and transparent discussion of constraints.",
    lens: "energy operations, emissions, capital allocation, transition execution, and communities",
    patterns: /energy|petroleum|oil|gas|utility|mining|pipeline/i,
    focus: "Environmental",
    recommendations: [
      "Reconcile transition targets with asset plans, production assumptions, and capital allocation.",
      "Disclose operational and methane data with methods, boundaries, and relevant facility context.",
      "Report community engagement, remediation, and workforce-transition outcomes.",
      ...commonRecommendations.slice(0, 2),
    ],
    external: [...generalSources, ...climateSources],
    cover: "/images/research/credible-climate.png",
  },
  "retail-index": {
    question:
      "How do major retailers compare when workforce, sourcing, packaging, access, and community evidence are assessed together?",
    thesis:
      "Retail responsibility cannot be inferred from consumer-facing sustainability claims alone; credible leadership requires comparable workforce and supply-chain outcomes alongside environmental and community evidence.",
    lens: "retail workforces, sourcing, packaging, logistics, customers, and communities",
    patterns: /retail|merchandiser|wholesaler|food|beverage|apparel/i,
    focus: "Philanthropy",
    recommendations: [
      ...commonRecommendations,
      "Use product and packaging claims that are specific, bounded, and supported by competent evidence.",
    ],
    external: [...generalSources, ...workforceSources, ...climateSources.slice(2)],
    cover: "/images/research/retail-workforce-signal.png",
  },
  "financial-services-outlook": {
    question:
      "What constitutes decision-useful responsibility evidence for financial institutions whose largest impacts often occur through products and customers?",
    thesis:
      "Financial-services responsibility must connect governance and operational commitments to lending, customer treatment, access, financed impacts, and measurable product-level outcomes.",
    lens: "lending, insurance, customer fairness, inclusion, governance, and financed impacts",
    patterns: /bank|financial|insurance|securities/i,
    focus: "Financial responsibility",
    recommendations: [
      "Report customer-treatment, access, and product outcomes with relevant demographic and geographic context.",
      "Connect risk governance to lending, underwriting, investment, and third-party product decisions.",
      "Separate operational environmental footprints from financed or facilitated impacts.",
      ...commonRecommendations.slice(0, 2),
    ],
    external: [...generalSources, ...financeSources],
  },
  "top-100-leaders": {
    question:
      "Which companies set the strongest balanced benchmark in the current Impact Horizon index, and what evidence characteristics do they share?",
    thesis:
      "Index leadership is best understood as balanced, source-traceable performance across all four pillars; rank alone should not substitute for examining sector context and the underlying evidence record.",
    lens: "the 100 highest current scores across the company universe",
    recommendations: commonRecommendations,
    external: generalSources,
  },
  "most-improved": {
    question:
      "Where is recent score momentum strongest, and how should improvement be interpreted without overstating causality?",
    thesis:
      "Year-over-year improvement is a useful research signal when historical observations are comparable, but it indicates changed evidence and performance—not proof that any single initiative caused the change.",
    lens: "the 100 companies with the strongest latest-cycle score movement",
    recommendations: [
      "Explain the operational or disclosure changes associated with material year-over-year movement.",
      "Preserve prior values and methodology notes so improvement remains reproducible.",
      ...commonRecommendations,
    ],
    external: generalSources,
  },
  transparency: {
    question:
      "Which disclosure characteristics make corporate-responsibility evidence decision-useful and reproducible?",
    thesis:
      "Transparency quality depends on stable definitions, complete boundaries, linked primary sources, accountable ownership, and disclosure of setbacks—not document length.",
    lens: "source quality, comparability, governance, boundaries, and reproducibility",
    focus: "Ethics",
    recommendations: commonRecommendations,
    external: [...generalSources, ...climateSources.slice(2)],
  },
  philanthropy: {
    question:
      "How can corporate philanthropy reporting move from charitable inputs toward durable community outcomes?",
    thesis:
      "Philanthropy evidence is most useful when funding and volunteer inputs are connected to community-defined objectives, outcome measures, time horizons, and transparent limits on attribution.",
    lens: "community investment, stakeholder participation, outcomes, and attribution",
    focus: "Philanthropy",
    recommendations: [
      "Define the community outcome and baseline before selecting activity or spending indicators.",
      "Include community partners in program design and interpretation of results.",
      "Distinguish company contribution from outcomes affected by many institutions and conditions.",
      ...commonRecommendations.slice(0, 2),
    ],
    external: [...generalSources, ...healthSources.slice(1)],
  },
  "environmental-leadership": {
    question:
      "Which operating and disclosure signals distinguish current environmental leaders across industries?",
    thesis:
      "Environmental leadership requires verified operating outcomes, credible boundaries, capital alignment, and product or value-chain evidence; high-level targets alone are insufficient.",
    lens: "environmental pillar performance, trends, operating outcomes, and claims",
    focus: "Environmental",
    recommendations: [
      ...commonRecommendations,
      "Apply claims-substantiation controls to public environmental marketing.",
    ],
    external: [...generalSources, ...climateSources],
    cover: "/images/research/credible-climate.png",
  },
  "ethics-governance": {
    question:
      "What public evidence supports a credible assessment of ethics and governance systems across large companies?",
    thesis:
      "Ethics and governance maturity is indicated by accountable oversight, accessible reporting channels, transparent risk controls, response processes, and evidence that policies shape operating decisions.",
    lens: "ethics controls, board oversight, accountability, transparency, and stakeholder trust",
    focus: "Ethics",
    recommendations: [
      "Disclose oversight responsibilities, escalation pathways, and how material concerns reach the board.",
      "Report control effectiveness and response processes without compromising confidentiality.",
      ...commonRecommendations,
    ],
    external: [...generalSources, ...aiSources],
    cover: "/images/research/ai-accountability.png",
  },
};

function selectedCompanies(slug: string, config: TopicConfig) {
  let rows = config.patterns
    ? companyRecords.filter((company) => config.patterns!.test(company.industry))
    : [...companyRecords];
  if (slug === "top-100-leaders") rows = [...rows].sort((a, b) => b.score - a.score).slice(0, 100);
  if (slug === "most-improved") rows = [...rows].sort((a, b) => b.change - a.change).slice(0, 100);
  if (config.focus && !config.patterns) {
    rows = [...rows].sort((a, b) => b.pillars[config.focus!] - a.pillars[config.focus!]);
  }
  return rows.length ? rows : [...companyRecords];
}

const format = (value: number | null) => (value === null ? "Data unavailable" : value.toFixed(1));

function createPublication(
  base: ResearchArticle,
  config: TopicConfig,
  isReport: boolean,
): ResearchPublication {
  const cohort = selectedCompanies(base.slug, config);
  const scoreAverage = average(cohort.map((company) => company.score));
  const scoreMedian = median(cohort.map((company) => company.score));
  const pillarEntries = (Object.keys(cohort[0].pillars) as (keyof PillarScores)[])
    .map((pillar) => ({
      pillar,
      value: average(cohort.map((company) => company.pillars[pillar]))!,
    }))
    .sort((a, b) => b.value - a.value);
  const ranked = [...cohort].sort((a, b) => b.score - a.score);
  const improved = [...cohort].sort((a, b) => b.change - a.change);
  const sourceCount = new Set(
    cohort.flatMap((company) => company.sources.map((source) => source.url)),
  ).size;
  const industries = industryRecords.filter((industry) =>
    cohort.some((company) => company.industrySlug === industry.slug),
  );
  const findings = [
    {
      finding: `The cohort average is ${format(scoreAverage)}, with a median of ${format(scoreMedian)}.`,
      evidence: `Impact Horizon calculation from ${cohort.length} current company records; missing or non-finite scores are excluded by the shared calculator.`,
      analysis: `The relationship between average and median helps identify whether a small number of high or low observations is pulling the summary benchmark away from the center of the cohort.`,
      whyItMatters:
        "Readers can use both measures to avoid treating one aggregate as a complete description of company performance.",
    },
    {
      finding: `${pillarEntries[0].pillar} is the strongest average pillar at ${format(pillarEntries[0].value)}; ${pillarEntries.at(-1)!.pillar} is lowest at ${format(pillarEntries.at(-1)!.value)}.`,
      evidence: `Four pillar averages calculated from the same ${cohort.length} company records used for the overall benchmark.`,
      analysis: `The gap identifies where published evidence and modeled performance are comparatively strongest and where the cohort has the greatest room to improve. It does not establish causation.`,
      whyItMatters:
        "A balanced pillar view prevents a strong overall score from obscuring a material weakness.",
    },
    {
      finding: `${ranked[0].name} leads this defined cohort at ${ranked[0].score.toFixed(1)}, while the observed score range is ${(ranked[0].score - ranked.at(-1)!.score).toFixed(1)} points.`,
      evidence:
        "Current Impact Horizon overall scores, sorted only after invalid values are excluded.",
      analysis:
        "The spread demonstrates heterogeneity within the selected scope. Company differences should be examined through pillar scores, industry context, and source records rather than interpreted as a simple verdict.",
      whyItMatters:
        "A wide range can reveal transferable practices and evidence gaps that an average alone cannot show.",
    },
    {
      finding: `${improved[0].name} has the strongest latest-cycle movement in the cohort at ${improved[0].change >= 0 ? "+" : ""}${improved[0].change.toFixed(1)} points.`,
      evidence:
        "Difference between the two latest historical score observations stored in the shared company dataset.",
      analysis:
        "Movement is a directional signal. It may reflect changed performance, stronger evidence, or both; the dataset does not assign causal credit to a specific initiative.",
      whyItMatters:
        "Transparent interpretation avoids presenting correlation or score movement as proof of impact.",
    },
  ];
  const sections = [
    {
      heading: "Executive Summary",
      body: `This publication examines ${config.lens}. It uses the same company records that power the Impact Horizon Leaderboard, applying a defined cohort rather than a separate report dataset. The current scope contains ${cohort.length} companies across ${industries.length} represented industries, with an average CSR score of ${format(scoreAverage)} and a median of ${format(scoreMedian)}.\n\nThe analysis finds meaningful variation across companies and pillars. That variation is treated as a research question, not compressed into a claim that one score explains every dimension of responsibility. Each finding below identifies its evidence base, the analytical inference, and why the distinction matters for readers.`,
    },
    {
      heading: "Research Thesis",
      body: `${config.thesis}\n\nThis thesis matters because public corporate-responsibility information is abundant but uneven. A defensible publication must connect claims to a stable analytical scope, preserve uncertainty, and distinguish company disclosure from Impact Horizon interpretation. The thesis is tested through current scores, pillar patterns, historical direction, company source records, and authoritative external frameworks where they directly inform the subject.`,
    },
    {
      heading: "Research Question and Scope",
      body: `${config.question}\n\nThe unit of analysis is the company record. The cohort is explicitly limited to ${cohort.length} companies selected from the current Fortune 500 universe according to the publication’s stated subject. Results describe that cohort and should not be generalized to private companies, smaller enterprises, other countries, or unobserved operating outcomes without additional evidence.`,
    },
    {
      heading: "Methodology",
      body: `Impact Horizon applies its four-pillar framework—Environmental, Financial Responsibility, Philanthropy, and Ethics—to a common company schema. This publication calculates averages only from finite numeric observations, uses the median to describe the cohort center, sorts valid scores to identify comparison cases, and derives historical movement only from stored annual observations.\n\nThe method combines structured quantitative comparison with source review. A score is an analytical index, not an audit opinion, legal conclusion, investment recommendation, or proof of causation. Readers can review the public methodology and follow company-level source links from each case study.`,
    },
    {
      heading: "Data and Evidence",
      body: `The internal evidence base comprises ${cohort.length} current company profiles, ${cohort.length * 4} current pillar observations, available historical score records, and ${sourceCount} unique linked source locations attached to the cohort. Company records include Fortune rank, headquarters, leadership, overall and pillar scores, research notes, and citations when available.\n\nExternal references provide definitions, regulatory context, or reporting standards; they are not used to manufacture missing company outcomes. Corporate self-reporting is treated as evidence of what a company disclosed, not independent verification that every described program achieved its intended result.`,
    },
    {
      heading: "Key Findings",
      body: `Four findings emerge from the defined cohort: its central score benchmark, the balance among responsibility pillars, the range between current leaders and lower-scoring observations, and the direction of recent movement. Each is reproducible from the shared company dataset.\n\nThe findings are intentionally bounded. They establish comparative signals within Impact Horizon’s framework while preserving the difference between data, evidence, analysis, and interpretation. The detailed finding panels that follow make those layers explicit.`,
    },
    {
      heading: "Finding 1 — The Cohort Benchmark",
      body: `${findings[0].finding} ${findings[0].evidence}\n\nImpact Horizon Analysis: ${findings[0].analysis} Why it matters: ${findings[0].whyItMatters}`,
    },
    {
      heading: "Finding 2 — Pillar Balance",
      body: `${findings[1].finding} ${findings[1].evidence}\n\nImpact Horizon Analysis: ${findings[1].analysis} Why it matters: ${findings[1].whyItMatters}`,
    },
    {
      heading: "Finding 3 — Company Variation",
      body: `${findings[2].finding} ${findings[2].evidence}\n\nImpact Horizon Analysis: ${findings[2].analysis} Why it matters: ${findings[2].whyItMatters}`,
    },
    {
      heading: "Company Case Studies",
      body: `The case studies use the highest current score, strongest recent movement, and an observation near the cohort median to show different analytical perspectives. Selection is mechanical and reproducible; it is not a claim that these companies are universally exemplary or deficient.\n\nEach case links to its full company profile, pillar scores, research notes, and sources. Initiatives are discussed only when a linked company record contains them. Where outcome evidence is unavailable, the publication leaves that limitation visible rather than inferring a result.`,
    },
    {
      heading: "Comparative Analysis",
      body: `Comparison is most reliable when companies share a relevant operating context and the reader examines the entire score profile. The ${pillarEntries[0].pillar} average of ${format(pillarEntries[0].value)} and ${pillarEntries.at(-1)!.pillar} average of ${format(pillarEntries.at(-1)!.value)} show why a single overall rank cannot explain the cohort’s strengths and gaps.\n\nFortune rank measures revenue scale, not responsibility quality. Impact Horizon displays it as company context and does not incorporate rank as proof of responsibility performance. Industry pages provide the appropriate sector benchmark when business models differ materially within this publication’s scope.`,
    },
    {
      heading: "Implications",
      body: `For companies, the evidence favors a compact, traceable chain from material issue to ownership, resources, controls, and outcomes. For policymakers and standards bodies, the results illustrate why stable boundaries and machine-readable comparatives improve public accountability. For researchers, they demonstrate the value of retaining uncertainty instead of forcing unavailable evidence into a numeric claim.\n\nFor students and general readers, the central implication is methodological: begin with the source, identify what was actually measured, and separate that fact from the interpretation placed upon it. Rankings can guide investigation, but they should never end it.`,
    },
    {
      heading: "Recommendations",
      body: config.recommendations.map((item, index) => `${index + 1}. ${item}`).join("\n\n"),
    },
    {
      heading: "Limitations",
      body: `This analysis is constrained by public-data availability, self-reported corporate disclosures, different reporting calendars and boundaries, sector differences, and qualitative judgment within the scoring framework. Historical scores are available only for recorded research cycles, and methodology or source changes can affect comparability.\n\nAbsence of a disclosure is not proof that an activity did not occur. A published policy is not proof of implementation or impact. Source links can change after review, and external frameworks may be revised. These constraints limit causal claims and require readers to consult current primary documents before making consequential decisions.`,
    },
    {
      heading: "Conclusion",
      body: `${config.thesis}\n\nThe evidence supports using the cohort as a structured starting point for further investigation. The strongest next step is not a broader claim; it is a better evidence trail—updated company records, stable measures, explicit operating context, and transparent interpretation. Impact Horizon will recalculate the exhibits whenever the shared company dataset changes.`,
    },
  ];
  const caseRows = [ranked[0], improved[0], ranked[Math.floor(ranked.length / 2)]]
    .filter(
      (company, index, rows) => rows.findIndex((item) => item.slug === company.slug) === index,
    )
    .slice(0, 3);
  const corporateSources: PublicationSource[] = caseRows.flatMap((company) =>
    company.sources.slice(0, 2).map((source) => ({
      title: source.title,
      organization: source.publisher,
      date: String(source.year),
      url: source.url,
      category: "Corporate Sources" as const,
    })),
  );
  return {
    ...base,
    cover: config.cover ?? base.cover,
    readMinutes: Math.max(base.readMinutes, 28),
    read: `${Math.max(base.readMinutes, 28)} min`,
    sections,
    keyTakeaways: findings.slice(0, 3).map((finding) => finding.finding),
    researchQuestion: config.question,
    thesis: config.thesis,
    scope: `${cohort.length} companies across ${industries.length} industries represented in the current Impact Horizon dataset.`,
    methodologyNote:
      "All publication statistics are recalculated from the same company records used by the Leaderboard.",
    findings,
    recommendations: config.recommendations,
    limitations: [
      "Public disclosures may be incomplete, self-reported, or published on different schedules.",
      "Industry operating models and reporting boundaries limit direct comparability.",
      "Scores include structured research judgment and are not audits or legal findings.",
      "Historical coverage is limited to observations stored in the current company dataset.",
    ],
    sources: [...config.external, ...corporateSources].filter(
      (source, index, rows) => rows.findIndex((item) => item.url === source.url) === index,
    ),
    companySlugs: caseRows.map((company) => company.slug),
    industrySlugs: industries.slice(0, 8).map((industry) => industry.slug),
    isReport,
  };
}

const reportArticles: ResearchArticle[] = reportRecords.map((report) => ({
  slug: report.slug,
  type: report.edition,
  category: "Reports",
  tags: report.title.split(/\s+/).filter((word) => word.length > 4),
  title: report.title,
  excerpt: report.summary,
  author: "Impact Horizon Research Team",
  publishedAt: report.publishedAt,
  date: new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(`${report.publishedAt}T00:00:00Z`),
  ),
  readMinutes: 30,
  read: "30 min",
  readingLevel: "Professional / Grade 11–12",
  cover: report.cover,
  coverPosition: "center",
  featured: true,
  sections: [],
  keyTakeaways: [],
  references: [],
  related: [],
}));

export const publicationRecords: ResearchPublication[] = [
  ...researchRecords.map((article) =>
    createPublication(article, configs[article.slug] ?? configs["annual-outlook-2025"], false),
  ),
  ...reportArticles.map((article) =>
    createPublication(article, configs[article.slug] ?? configs["impact-horizon-2026"], true),
  ),
].map((publication, index, rows) => ({
  ...publication,
  related: [
    rows[(index - 1 + rows.length) % rows.length].slug,
    rows[(index + 1) % rows.length].slug,
  ],
}));

const publicationValidationIssues = publicationRecords.flatMap((publication) => {
  const issues: string[] = [];
  if (publication.sections.length < 15) issues.push("fewer than 15 substantive sections");
  if (!publication.sections.some((section) => section.heading === "Research Thesis")) {
    issues.push("missing Research Thesis section");
  }
  if (!publication.sections.some((section) => section.heading === "Key Findings")) {
    issues.push("missing Key Findings section");
  }
  if (publication.findings.length < 3) issues.push("fewer than three findings");
  if (!publication.recommendations.length) issues.push("missing recommendations");
  if (!publication.limitations.length) issues.push("missing limitations");
  if (!publication.sources.length) issues.push("missing sources");
  if (!publication.companySlugs.length) issues.push("missing company cases");
  if (/coming soon|lorem ipsum|placeholder/i.test(JSON.stringify(publication))) {
    issues.push("contains placeholder language");
  }
  return issues.map((issue) => `${publication.slug}: ${issue}`);
});
const duplicatePublicationSlugs = publicationRecords
  .map((publication) => publication.slug)
  .filter((slug, index, rows) => rows.indexOf(slug) !== index);
if (duplicatePublicationSlugs.length) {
  publicationValidationIssues.push(
    ...duplicatePublicationSlugs.map((slug) => `${slug}: duplicate publication route`),
  );
}
if (publicationValidationIssues.length) {
  throw new Error(`Publication validation failed:\n${publicationValidationIssues.join("\n")}`);
}

export const publicationCompanies = (publication: ResearchPublication): Company[] =>
  publication.companySlugs
    .map((slug) => companyRecords.find((company) => company.slug === slug))
    .filter((company): company is Company => Boolean(company));
