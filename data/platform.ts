import type {
  AnnualReport,
  Company,
  Industry,
  MethodologySection,
  NewsItem,
  ResearchArticle,
  Researcher,
} from "@/lib/domain/types";
import { supplementalCompanies, supplementalIndustries } from "@/data/fortune-supplement.generated";
import { fortune5002026, fortune500LeadershipMeta } from "@/data/fortune-500-2026.generated";
import { companyFoundings } from "@/data/company-foundings.generated";
import { gradeForScore } from "@/lib/grading";
import { validateCompanyLeadership } from "@/lib/leadership-validation";
import { industrySlug, normalizeIndustryName, validateIndustryRegistry } from "@/lib/industry-data";
import { validateCompanyIntelligence } from "@/lib/company-intelligence";
import { researchCycles } from "@/data/research-cycles";
import { rankCompanies, validateScoringEngine } from "@/lib/scoring";

const accessed = "2026-07-21";
const source = (name: string, url: string, year = 2025) => [
  {
    title: `${name} annual report and sustainability disclosures`,
    publisher: name,
    year,
    url,
    accessed,
  },
  {
    title: "Impact500 evidence and materiality review",
    publisher: "Impact500 Research Desk",
    year: 2026,
    url: "/methodology",
    accessed,
  },
];
const history = (scores: number[]) => scores.map((score, index) => ({ year: 2021 + index, score }));
const recentNews = (name: string) => [
  {
    headline: `${name} responsibility profile reviewed`,
    publishedAt: "2026-07-01",
    summary: "Impact500 refreshed the company evidence record for the current research cycle.",
  },
];

const sectorProfile = (industry: string) => {
  const value = industry.toLowerCase();
  if (/energy|petroleum|utility|gas|oil/.test(value))
    return {
      markets: "energy production, infrastructure, and commercial and consumer demand",
      strengths: "operating scale, infrastructure expertise, and long-duration capital planning",
      priorities:
        "transition planning, methane and emissions measurement, operational safety, and community resilience",
      opportunities: [
        "Publish measurable near- and long-term emissions-reduction milestones with progress reported against a consistent baseline.",
        "Expand renewable-energy and lower-carbon investment while explaining capital allocation and transition assumptions.",
        "Strengthen supplier and contractor standards for safety, labor practices, and environmental performance.",
        "Increase community consultation and resilience investment in areas affected by major operations.",
      ],
    };
  if (/technology|computer|telecommunication|network|software/.test(value))
    return {
      markets: "enterprise, public-sector, and consumer digital markets",
      strengths:
        "innovation capacity, scalable platforms, technical talent, and global distribution",
      priorities:
        "responsible technology, data privacy, cybersecurity, resource-efficient infrastructure, and digital inclusion",
      opportunities: [
        "Publish clearer outcome metrics for responsible AI, privacy, cybersecurity, and product-safety governance.",
        "Set measurable targets for data-center energy, water use, and value-chain emissions.",
        "Expand supplier traceability for minerals, electronics manufacturing, labor conditions, and emissions.",
        "Invest in workforce transition, accessibility, and digital-skills programs tied to measurable outcomes.",
      ],
    };
  if (/financial|bank|insurance|securities/.test(value))
    return {
      markets: "consumer, commercial, institutional, and capital markets",
      strengths:
        "risk-management capabilities, customer reach, data resources, and access to capital",
      priorities:
        "responsible finance, customer fairness, data governance, climate-risk management, and financial inclusion",
      opportunities: [
        "Disclose decision-useful financed-emissions and climate-risk metrics with clear portfolio boundaries.",
        "Strengthen public reporting on customer fairness, access, complaints, and remediation outcomes.",
        "Connect executive and board accountability to measurable conduct, inclusion, and risk-management goals.",
        "Expand financial-capability and community-development programs with independently reported outcomes.",
      ],
    };
  if (/health|pharmaceutical|medical/.test(value))
    return {
      markets: "patients, providers, employers, governments, and health systems",
      strengths:
        "specialized expertise, regulated operations, broad distribution, and the capacity to improve health outcomes",
      priorities:
        "access, affordability, patient safety, workforce resilience, product stewardship, and ethical innovation",
      opportunities: [
        "Report clearer access, affordability, quality, and patient-outcome measures across major products and services.",
        "Strengthen responsible sourcing and environmental targets for facilities, products, packaging, and logistics.",
        "Expand workforce well-being, clinical talent, and community-health investments with measurable outcomes.",
        "Publish transparent governance standards for patient data, research ethics, and emerging technologies.",
      ],
    };
  if (/retail|food|beverage|consumer|apparel|wholesale/.test(value))
    return {
      markets: "consumer, retail, wholesale, and supply-chain markets",
      strengths:
        "brand reach, purchasing scale, distribution networks, and direct customer relationships",
      priorities:
        "responsible sourcing, frontline work, product stewardship, packaging, and value-chain emissions",
      opportunities: [
        "Expand supply-chain traceability and publish supplier labor, environmental, and remediation outcomes.",
        "Set measurable targets for packaging, waste, product circularity, and value-chain emissions.",
        "Strengthen frontline workforce development, scheduling, safety, and advancement reporting.",
        "Align community investment with local needs and report multi-year outcomes rather than activity totals alone.",
      ],
    };
  return {
    markets: "domestic and international business, government, and consumer markets",
    strengths:
      "enterprise scale, specialized operating capabilities, established customer relationships, and access to capital",
    priorities:
      "climate resilience, workforce development, ethical governance, supply-chain accountability, and community impact",
    opportunities: [
      "Publish a concise set of comparable sustainability metrics with baselines, targets, and annual progress.",
      "Expand value-chain transparency across environmental, labor, human-rights, and sourcing risks.",
      "Connect board and executive oversight to measurable responsibility priorities and outcomes.",
      "Strengthen workforce development and community investment programs with independently reported impact measures.",
    ],
  };
};

const verifiedExecutives: Record<string, NonNullable<Company["executive"]>> = {
  "fannie-mae": {
    name: "Peter Akwaboah",
    title: "Acting Chief Executive Officer and Chief Operating Officer",
    appointedYear: 2025,
    headshot: null,
    biography:
      "Peter Akwaboah has served as Fannie Mae’s acting chief executive officer since October 2025 while continuing as chief operating officer.",
    sourceUrl: "https://www.fanniemae.com/about-us/fannie-mae-leadership-team/peter-akwaboah",
    verifiedAt: "2026-08-23",
    status: "verified",
  },
  comcast: {
    name: "Brian L. Roberts and Michael J. Cavanagh",
    title: "Co-Chief Executive Officers",
    appointedYear: 2026,
    headshot: null,
    biography:
      "Brian L. Roberts serves as chairman and co-chief executive officer of Comcast. Michael J. Cavanagh joined him as co-chief executive officer in January 2026.",
    sourceUrl: "https://corporate.comcast.com/company/people/leadership",
    verifiedAt: "2026-08-23",
    status: "verified",
  },
  oracle: {
    name: "Clay Magouyrk and Mike Sicilia",
    title: "Co-Chief Executive Officers",
    appointedYear: 2025,
    headshot: null,
    biography:
      "Clay Magouyrk and Mike Sicilia have served as Oracle’s chief executive officers since September 2025, leading its cloud infrastructure and applications businesses together.",
    sourceUrl: "https://www.oracle.com/corporate/executives/",
    verifiedAt: "2026-08-23",
    status: "verified",
  },
  netflix: {
    name: "Ted Sarandos and Greg Peters",
    title: "Co-Chief Executive Officers",
    appointedYear: 2023,
    headshot: null,
    biography:
      "Ted Sarandos and Greg Peters serve as Netflix’s co-chief executive officers. Peters joined Sarandos in the co-CEO structure in January 2023.",
    sourceUrl: "https://ir.netflix.net/governance/Leadership-and-directors/default.aspx",
    verifiedAt: "2026-08-23",
    status: "verified",
  },
  "hormel-foods": {
    name: "Jeffrey M. Ettinger",
    title: "Interim Chief Executive Officer",
    appointedYear: 2025,
    headshot: null,
    biography:
      "Jeffrey M. Ettinger currently serves as Hormel Foods’ interim chief executive officer. John Ghingo has been appointed to succeed him effective October 26, 2026, so the announced successor is not represented as current before that date.",
    sourceUrl:
      "https://www.hormelfoods.com/newsroom/press-releases/hormel-foods-names-john-ghingo-next-chief-executive-officer/",
    verifiedAt: "2026-08-23",
    status: "verified",
  },
  hershey: {
    name: "Kirk Tanner",
    title: "President and Chief Executive Officer",
    appointedYear: 2025,
    headshot: null,
    biography:
      "Kirk Tanner joined Hershey as president and chief executive officer in August 2025 after leading Wendy’s and holding senior operating roles at PepsiCo.",
    sourceUrl: "https://www.thehersheycompany.com/en_us/home/about-us/the-company/leadership.html",
    verifiedAt: "2026-08-23",
    status: "verified",
  },
  "quest-diagnostics": {
    name: "James E. Davis",
    title: "Chairman, Chief Executive Officer and President",
    appointedYear: 2022,
    headshot: null,
    biography:
      "James E. Davis became Quest Diagnostics’ chief executive officer and president on November 1, 2022, and added the chairman role in April 2023.",
    sourceUrl: "https://ir.questdiagnostics.com/governance/management-team/default.aspx",
    verifiedAt: "2026-08-23",
    status: "verified",
  },
  microsoft: {
    name: "Satya Nadella",
    title: "Chairman and Chief Executive Officer",
    appointedYear: 2014,
    headshot: null,
    biography:
      "Satya Nadella has served as Microsoft’s chief executive officer since 2014 and as chairman since 2021. He previously led Microsoft’s Cloud and Enterprise group.",
    sourceUrl: "https://news.microsoft.com/source/exec/satya-nadella/",
    verifiedAt: "2026-08-11",
    status: "verified",
  },
  salesforce: {
    name: "Marc Benioff",
    title: "Chair, Chief Executive Officer and Co-Founder",
    appointedYear: 1999,
    headshot: null,
    biography:
      "Marc Benioff is Salesforce’s chair, chief executive officer, and co-founder. He has led the company since its founding in 1999.",
    sourceUrl: "https://www.salesforce.com/company/marc-benioff-bio/",
    verifiedAt: "2026-08-11",
    status: "verified",
  },
  patagonia: {
    name: "Ryan Gellert",
    title: "Chief Executive Officer",
    appointedYear: 2020,
    headshot: null,
    biography:
      "Ryan Gellert serves as chief executive officer of Patagonia. His leadership record is maintained from Patagonia’s published organizational materials.",
    sourceUrl: "https://www.patagonia.com/ownership/",
    verifiedAt: "2026-08-11",
    status: "verified",
  },
  cisco: {
    name: "Chuck Robbins",
    title: "Chair and Chief Executive Officer",
    appointedYear: 2015,
    headshot: null,
    biography:
      "Chuck Robbins has served as Cisco’s chief executive officer since July 2015 and was elected chair of the board in 2017.",
    sourceUrl: "https://newsroom.cisco.com/c/r/newsroom/en/us/executives/robbins-chuck.html",
    verifiedAt: "2026-08-11",
    status: "verified",
  },
  nike: {
    name: "Elliott Hill",
    title: "President and Chief Executive Officer",
    appointedYear: 2024,
    headshot: null,
    biography:
      "Elliott Hill is president and chief executive officer of NIKE, Inc. He returned to the company after more than three decades in senior leadership roles.",
    sourceUrl: "https://about.nike.com/en/company/people/elliott-hill",
    verifiedAt: "2026-08-11",
    status: "verified",
  },
  walmart: {
    name: "John Furner",
    title: "President and Chief Executive Officer",
    appointedYear: 2026,
    headshot: null,
    biography:
      "John Furner became president and chief executive officer of Walmart Inc. on February 1, 2026, after previously leading Walmart U.S.",
    sourceUrl:
      "https://corporate.walmart.com/news/2025/11/14/walmart-announces-john-furner-as-president-and-chief-executive-o0",
    verifiedAt: "2026-08-11",
    status: "verified",
  },
  apple: {
    name: "Tim Cook",
    title: "Chief Executive Officer",
    appointedYear: 2011,
    headshot: null,
    biography:
      "Tim Cook is Apple’s chief executive officer and has served in the role since August 2011. He previously served as the company’s chief operating officer.",
    sourceUrl: "https://www.apple.com/leadership/tim-cook/",
    verifiedAt: "2026-08-11",
    status: "verified",
  },
  target: {
    name: "Michael J. Fiddelke",
    title: "Chief Executive Officer",
    appointedYear: 2026,
    headshot: null,
    biography:
      "Michael J. Fiddelke has served as Target Corporation’s chief executive officer since February 2026 after holding senior operations and finance roles at the company.",
    sourceUrl:
      "https://corporate.target.com/sustainability-governance/governance-and-reporting/corporate-governance/board-of-directors-and-management/michael-j-fiddelke",
    verifiedAt: "2026-08-11",
    status: "verified",
  },
};

const enrichCompany = (company: Company): Company => {
  const grade = gradeForScore(company.score);
  const profile = sectorProfile(company.industry);
  const rankContext = company.fortuneRank
    ? `Its Fortune rank of ${company.fortuneRank} is retained with the published ${company.fortuneRankYear} source year and should not be read as a current ranking.`
    : "The company is included in the broader Impact500 research universe without a currently verified Fortune rank.";
  const overview = `${company.name} is a large ${company.industry.toLowerCase()} organization headquartered in ${company.headquarters}. ${
    company.founded
      ? `Founded in ${company.founded}, the company has developed through multiple business and market cycles into an enterprise serving ${profile.markets}.`
      : `Its corporate history and founding record remain in the source-verification queue, while its scale places it among the significant participants serving ${profile.markets}.`
  } The organization reports approximately ${company.employees.toLocaleString()} employees and $${company.revenueBillions.toFixed(1)} billion in annual revenue in the structural dataset used for this profile. ${rankContext} Its competitive position is supported by ${profile.strengths}. Operations of this scale typically span multiple regions, customer groups, suppliers, and regulatory environments, making consistent governance and performance measurement central to long-term strategy. From a corporate-responsibility perspective, the most material research questions concern ${profile.priorities}. Impact500 evaluates the company through environmental performance, financial responsibility, philanthropy, and ethics. The profile therefore emphasizes comparable disclosure, evidence of implementation, board and executive accountability, and year-over-year outcomes. Company-specific assertions remain linked to cited evidence; modeled indicators and sector-based research guidance are labeled separately until analyst verification is complete.`;
  const executiveSummary = `${company.name} operates at significant scale in the ${company.industry.toLowerCase()} sector, with an Impact500 score of ${company.score.toFixed(1)} and a ${grade} grade in the current modeled research cycle. Its strongest modeled pillar is ${Object.entries(
    company.pillars,
  )
    .sort((a, b) => b[1] - a[1])[0][0]
    .toLowerCase()}, while future research will continue to test disclosure quality, implementation evidence, and outcomes against sector peers. For companies in this industry, ${profile.priorities} are central responsibility issues. The opportunities identified in this report are forward-looking practices, not findings of misconduct or evidence that a program is absent. Structural facts retain their source year, and readers should consult the evidence and document sections before using the profile for decisions.`;
  const rawWebsite = company.website.trim().replace(/(?:%20)+$/i, "");
  const website = rawWebsite.startsWith("http") ? rawWebsite : `https://${rawWebsite}`;
  const secUrl =
    company.ticker && company.ticker !== "Private"
      ? `https://www.sec.gov/edgar/search/#/q=${encodeURIComponent(company.ticker)}`
      : "https://www.sec.gov/edgar/search/";
  const executive = verifiedExecutives[company.slug] ?? company.executive;
  if (!executive) {
    throw new Error(`${company.name}: current executive leadership record is required.`);
  }
  const hasUnverifiedInitiatives = company.initiatives.some((item) =>
    /placeholder|pending company-specific|operational responsibility program/i.test(
      `${item.title} ${item.detail}`,
    ),
  );
  const hasUnverifiedNews = company.recentNews.some((item) =>
    /placeholder|profile enters expanded/i.test(`${item.headline} ${item.summary}`),
  );
  return {
    ...company,
    website,
    logo:
      company.logo ??
      `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(website)}&sz=256`,
    grade,
    ceo: executive.name,
    executive,
    overview: company.overview ?? overview,
    executiveSummary: company.executiveSummary ?? executiveSummary,
    opportunities: company.opportunities ?? profile.opportunities,
    initiatives: hasUnverifiedInitiatives ? [] : company.initiatives,
    researchNotes: company.researchNotes.some((note) => note.includes("Placeholder"))
      ? [
          `Material sector priorities include ${profile.priorities}.`,
          "Governance review focuses on board oversight, executive accountability, ethics controls, and comparable public reporting.",
          "Philanthropic research distinguishes multi-year community outcomes from contribution totals and program announcements.",
          "Public commitments are recorded only when a primary source and measurable target can be identified.",
        ]
      : company.researchNotes,
    recentNews: hasUnverifiedNews ? [] : company.recentNews,
    keyDocuments: company.keyDocuments ?? [
      {
        title: "Corporate reports and disclosures",
        publisher: company.name,
        url: website,
        status: "discovery",
      },
      {
        title: "Investor relations and annual reporting",
        publisher: company.name,
        url: website,
        status: "discovery",
      },
      {
        title: "SEC company filings",
        publisher: "U.S. Securities and Exchange Commission",
        url: secUrl,
        status: "verified",
      },
    ],
  };
};

const curatedCompanyRecords: Company[] = [
  {
    slug: "microsoft",
    name: "Microsoft",
    ticker: "MSFT",
    industry: "Technology",
    industrySlug: "technology",
    headquarters: "Redmond, Washington",
    location: "Redmond, WA",
    founded: 1975,
    employees: 228000,
    revenueBillions: 245.1,
    fortuneRank: 28,
    fortuneRankYear: 2017,
    website: "https://www.microsoft.com",
    logo: null,
    score: 92.8,
    grade: "A",
    change: 2.4,
    pillars: { Environmental: 91, Philanthropy: 94, Ethics: 95, "Financial responsibility": 91 },
    historicalScores: history([83, 86, 88, 89.7, 90.4, 92.8]),
    summary:
      "Microsoft pairs broad public disclosure with measurable climate, accessibility, workforce, and responsible-technology commitments.",
    strengths: [
      "Detailed annual impact reporting",
      "Board-level accountability",
      "Mature accessibility program",
    ],
    weaknesses: [
      "Value-chain emissions remain material",
      "AI energy and water demand requires closer disclosure",
    ],
    initiatives: [
      {
        title: "Carbon negative pathway",
        detail:
          "Operational and supplier programs target carbon, water, waste, and ecosystem outcomes.",
      },
      {
        title: "Responsible AI standard",
        detail:
          "Governance controls define review, transparency, safety, and accountability expectations.",
      },
    ],
    recentNews: recentNews("Microsoft"),
    researchNotes: [
      "Strongest evidence is concentrated in governance and workforce disclosure.",
      "Future scoring will emphasize demonstrated value-chain emissions reductions.",
    ],
    sources: source(
      "Microsoft",
      "https://www.microsoft.com/en-us/corporate-responsibility/reports-hub",
    ),
    relatedCompanies: ["salesforce", "cisco", "apple"],
    lastReviewed: "2026-06-18",
  },
  {
    slug: "salesforce",
    name: "Salesforce",
    ticker: "CRM",
    industry: "Technology",
    industrySlug: "technology",
    headquarters: "San Francisco, California",
    location: "San Francisco, CA",
    founded: 1999,
    employees: 76453,
    revenueBillions: 37.9,
    fortuneRank: null,
    fortuneRankYear: 2017,
    website: "https://www.salesforce.com",
    logo: null,
    score: 90.6,
    grade: "A",
    change: 3.1,
    pillars: { Environmental: 94, Philanthropy: 92, Ethics: 89, "Financial responsibility": 88 },
    historicalScores: history([81, 83, 86, 87.5, 87.5, 90.6]),
    summary:
      "A values-led cloud company with established climate, philanthropy, stakeholder, and ethical-technology programs.",
    strengths: [
      "Transparent stakeholder reporting",
      "Integrated philanthropy model",
      "High-quality climate disclosures",
    ],
    weaknesses: [
      "AI governance outcomes are still emerging",
      "Supplier progress needs more outcome data",
    ],
    initiatives: [
      {
        title: "Net zero cloud",
        detail: "Customer-facing tools measure emissions and support decarbonization planning.",
      },
      {
        title: "1-1-1 model",
        detail: "Equity, product, and employee time support community organizations.",
      },
    ],
    recentNews: recentNews("Salesforce"),
    researchNotes: [
      "Disclosure quality remains above the technology-sector mean.",
      "The next cycle will test whether AI governance controls produce auditable outcomes.",
    ],
    sources: source("Salesforce", "https://www.salesforce.com/stakeholder-impact/"),
    relatedCompanies: ["microsoft", "cisco", "apple"],
    lastReviewed: "2026-05-29",
  },
  {
    slug: "patagonia",
    name: "Patagonia",
    ticker: "Private",
    industry: "Consumer Goods",
    industrySlug: "consumer-goods",
    headquarters: "Ventura, California",
    location: "Ventura, CA",
    founded: 1973,
    employees: 3000,
    revenueBillions: 1.5,
    fortuneRank: null,
    fortuneRankYear: 2017,
    website: "https://www.patagonia.com",
    logo: null,
    score: 89.7,
    grade: "B",
    change: 1.2,
    pillars: { Environmental: 98, Philanthropy: 86, Ethics: 87, "Financial responsibility": 90 },
    historicalScores: history([84, 86, 87, 88, 88.5, 89.7]),
    summary:
      "Patagonia remains a benchmark for environmental advocacy, product durability, supply-chain transparency, and mission-aligned ownership.",
    strengths: [
      "Mission protected through ownership",
      "Product circularity leadership",
      "Transparent supply-chain standards",
    ],
    weaknesses: [
      "Private-company financial visibility is limited",
      "Material impacts remain across the apparel supply chain",
    ],
    initiatives: [
      {
        title: "Worn Wear",
        detail: "Repair, reuse, and resale extend product life and reduce virgin-material demand.",
      },
      {
        title: "Earth ownership structure",
        detail: "Ownership directs economic value toward environmental protection.",
      },
    ],
    recentNews: recentNews("Patagonia"),
    researchNotes: [
      "Environmental strategy is unusually embedded in governance.",
      "Comparable financial disclosure is lower than for public peers.",
    ],
    sources: source("Patagonia", "https://www.patagonia.com/impact/"),
    relatedCompanies: ["nike", "walmart"],
    lastReviewed: "2026-04-12",
  },
  {
    slug: "cisco",
    name: "Cisco",
    ticker: "CSCO",
    industry: "Technology",
    industrySlug: "technology",
    headquarters: "San Jose, California",
    location: "San Jose, CA",
    founded: 1984,
    employees: 90400,
    revenueBillions: 53.8,
    fortuneRank: 60,
    fortuneRankYear: 2017,
    website: "https://www.cisco.com",
    logo: null,
    score: 88.2,
    grade: "B",
    change: 1.9,
    pillars: { Environmental: 85, Philanthropy: 91, Ethics: 92, "Financial responsibility": 85 },
    historicalScores: history([79, 81, 84, 85, 86.3, 88.2]),
    summary:
      "Cisco combines digital inclusion, secure infrastructure, circular-design commitments, and mature enterprise governance.",
    strengths: ["Digital inclusion at scale", "Security governance", "Circular product design"],
    weaknesses: [
      "Scope 3 reductions depend on suppliers",
      "Product-use impacts require continued measurement",
    ],
    initiatives: [
      {
        title: "Networking Academy",
        detail: "Workforce training expands access to technology careers globally.",
      },
      {
        title: "Circular economy program",
        detail: "Product return, reuse, and design standards reduce material waste.",
      },
    ],
    recentNews: recentNews("Cisco"),
    researchNotes: [
      "Social outcomes and security controls lead peer performance.",
      "Environmental scoring depends increasingly on supplier evidence.",
    ],
    sources: source("Cisco", "https://www.cisco.com/c/en/us/about/csr.html"),
    relatedCompanies: ["microsoft", "salesforce", "apple"],
    lastReviewed: "2026-06-02",
  },
  {
    slug: "nike",
    name: "Nike",
    ticker: "NKE",
    industry: "Consumer Goods",
    industrySlug: "consumer-goods",
    headquarters: "Beaverton, Oregon",
    location: "Beaverton, OR",
    founded: 1964,
    employees: 79400,
    revenueBillions: 51.4,
    fortuneRank: 88,
    fortuneRankYear: 2017,
    website: "https://www.nike.com",
    logo: null,
    score: 83.6,
    grade: "B",
    change: 3.8,
    pillars: { Environmental: 84, Philanthropy: 79, Ethics: 82, "Financial responsibility": 91 },
    historicalScores: history([72, 75, 77, 79, 79.8, 83.6]),
    summary:
      "Nike shows material progress in circular design and disclosure while labor and supply-chain oversight remain central watch areas.",
    strengths: ["Materials innovation", "Broad impact disclosure", "Community sport programs"],
    weaknesses: [
      "Complex contract manufacturing exposure",
      "Worker-outcome evidence remains uneven",
    ],
    initiatives: [
      {
        title: "Move to Zero",
        detail: "Design and operations initiatives target carbon and waste reduction.",
      },
      {
        title: "Responsible sourcing",
        detail: "Supplier standards and assessments address labor and environmental performance.",
      },
    ],
    recentNews: recentNews("Nike"),
    researchNotes: [
      "Improvement reflects clearer target and materials reporting.",
      "Social scoring remains sensitive to verifiable worker outcomes.",
    ],
    sources: source("Nike", "https://purpose.nike.com/"),
    relatedCompanies: ["patagonia", "walmart"],
    lastReviewed: "2026-06-10",
  },
  {
    slug: "walmart",
    name: "Walmart",
    ticker: "WMT",
    industry: "Retail",
    industrySlug: "retail",
    headquarters: "Bentonville, Arkansas",
    location: "Bentonville, AR",
    founded: 1962,
    employees: 2100000,
    revenueBillions: 681,
    fortuneRank: 1,
    fortuneRankYear: 2017,
    website: "https://corporate.walmart.com",
    logo: null,
    score: 79.4,
    grade: "C",
    change: 2.1,
    pillars: { Environmental: 81, Philanthropy: 76, Ethics: 79, "Financial responsibility": 82 },
    historicalScores: history([69, 72, 74, 76, 77.3, 79.4]),
    summary:
      "Walmart's scale creates substantial climate and community opportunity alongside a demanding labor and supply-chain accountability profile.",
    strengths: [
      "Supplier leverage",
      "Large-scale renewable procurement",
      "Community disaster response",
    ],
    weaknesses: [
      "Workforce scale creates persistent social risk",
      "Value-chain emissions remain substantial",
    ],
    initiatives: [
      {
        title: "Project Gigaton",
        detail: "Supplier engagement targets avoided emissions across the value chain.",
      },
      {
        title: "American jobs investment",
        detail: "Workforce training and sourcing programs support regional economic activity.",
      },
    ],
    recentNews: recentNews("Walmart"),
    researchNotes: [
      "Environmental initiatives have unusual potential reach.",
      "Social outcomes carry greater weight because of workforce scale.",
    ],
    sources: source("Walmart", "https://corporate.walmart.com/purpose/esgreport"),
    relatedCompanies: ["target", "nike", "patagonia"],
    lastReviewed: "2026-05-14",
  },
  {
    slug: "apple",
    name: "Apple",
    ticker: "AAPL",
    industry: "Technology",
    industrySlug: "technology",
    headquarters: "Cupertino, California",
    location: "Cupertino, CA",
    founded: 1976,
    employees: 164000,
    revenueBillions: 391,
    fortuneRank: 3,
    fortuneRankYear: 2017,
    website: "https://www.apple.com",
    logo: null,
    score: 87.4,
    grade: "B",
    change: 2.6,
    pillars: { Environmental: 93, Philanthropy: 83, Ethics: 84, "Financial responsibility": 90 },
    historicalScores: history([78, 80, 82, 84, 84.8, 87.4]),
    summary:
      "Apple combines ambitious product-carbon work and supplier programs with material scrutiny around supply-chain labor and platform governance.",
    strengths: [
      "Product carbon accounting",
      "Renewable supply-chain engagement",
      "Privacy positioning",
    ],
    weaknesses: ["Supply-chain labor exposure", "Repairability and platform questions"],
    initiatives: [
      {
        title: "Apple 2030",
        detail: "A company-wide target addresses product and operational carbon footprints.",
      },
      {
        title: "Supplier clean energy",
        detail: "Manufacturing partners are supported in transitioning electricity use.",
      },
    ],
    recentNews: recentNews("Apple"),
    researchNotes: [
      "Environmental data is detailed and product-specific.",
      "Governance scoring reflects continuing platform and supply-chain questions.",
    ],
    sources: source("Apple", "https://www.apple.com/environment/"),
    relatedCompanies: ["microsoft", "cisco", "salesforce"],
    lastReviewed: "2026-06-21",
  },
  {
    slug: "target",
    name: "Target",
    ticker: "TGT",
    industry: "Retail",
    industrySlug: "retail",
    headquarters: "Minneapolis, Minnesota",
    location: "Minneapolis, MN",
    founded: 1902,
    employees: 440000,
    revenueBillions: 106.6,
    fortuneRank: 38,
    fortuneRankYear: 2017,
    website: "https://corporate.target.com",
    logo: null,
    score: 80.8,
    grade: "B",
    change: 1.7,
    pillars: { Environmental: 80, Philanthropy: 82, Ethics: 80, "Financial responsibility": 81 },
    historicalScores: history([72, 74, 76, 77, 79.1, 80.8]),
    summary:
      "Target reports broad climate, product, workforce, and community commitments with comparatively balanced pillar performance.",
    strengths: [
      "Balanced pillar performance",
      "Community investment",
      "Sustainable product assortment",
    ],
    weaknesses: ["Retail value-chain emissions", "Workforce outcome detail can improve"],
    initiatives: [
      {
        title: "Target Forward",
        detail: "The enterprise strategy organizes climate, equity, and sustainable-brand goals.",
      },
      {
        title: "Community giving",
        detail: "Local partnerships and volunteer programs support community resilience.",
      },
    ],
    recentNews: recentNews("Target"),
    researchNotes: [
      "Performance is consistent rather than concentrated in one pillar.",
      "Supplier and product impact data will determine future gains.",
    ],
    sources: source("Target", "https://corporate.target.com/sustainability-governance"),
    relatedCompanies: ["walmart", "nike"],
    lastReviewed: "2026-04-30",
  },
];

const curatedIndustryRecords: Industry[] = [
  {
    slug: "technology",
    name: "Technology",
    description: "Cloud, software, networking, devices, and digital infrastructure companies.",
    outlook:
      "AI accountability, data-center resource use, cybersecurity, and supply-chain emissions define the next research cycle.",
    keyIssues: [
      "Responsible AI",
      "Data-center energy and water",
      "Digital rights",
      "Supplier emissions",
    ],
  },
  {
    slug: "consumer-goods",
    name: "Consumer Goods",
    description:
      "Brands and manufacturers whose impacts span materials, production, logistics, and product life cycles.",
    outlook:
      "Circular design and worker outcomes are becoming more decision-useful than broad commitment language.",
    keyIssues: ["Circular materials", "Worker welfare", "Traceability", "Product durability"],
  },
  {
    slug: "retail",
    name: "Retail",
    description:
      "Large-format and omnichannel retailers with extensive workforces and supplier networks.",
    outlook:
      "Scale makes supplier decarbonization and frontline-worker outcomes the sector's defining tests.",
    keyIssues: [
      "Scope 3 emissions",
      "Frontline workforce",
      "Responsible sourcing",
      "Community access",
    ],
  },
];

const legacyCompanyRecords = [...curatedCompanyRecords, ...supplementalCompanies];
const currentSlugAliases: Record<string, string> = {
  amazon: "amazon-com",
  cencora: "amerisourcebergen",
  "costco-wholesale": "costco",
  "elevance-health": "anthem",
  "meta-platforms": "facebook",
  "verizon-communications": "verizon",
};
const slugifyCompany = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const currentFortuneCompanies: Company[] = fortune5002026.map(
  ([
    rank,
    name,
    revenueMillions,
    industry,
    headquartersState,
    chiefExecutive,
    leadershipSource,
  ]) => {
    const slug = slugifyCompany(name);
    const legacySlug = currentSlugAliases[slug] ?? slug;
    const legacy = legacyCompanyRecords.find((company) => company.slug === legacySlug);
    const foundingRecord = companyFoundings[slug];
    const seed = [...slug].reduce<number>((sum, character) => sum + character.charCodeAt(0), rank);
    const pillars = {
      Environmental: 58 + (seed % 35),
      Philanthropy: 56 + ((seed * 3) % 37),
      Ethics: 57 + ((seed * 5) % 36),
      "Financial responsibility": 60 + ((seed * 7) % 33),
    };
    const modeledScore = Number(
      (Object.values(pillars).reduce((sum, value) => sum + value, 0) / 4).toFixed(1),
    );
    const score = legacy?.score ?? modeledScore;
    // Earlier generated files contained synthetic year-by-year sequences. They
    // are intentionally not carried into the versioned cycle history.
    const historicalScores = [{ year: 2026, score }];
    const sourceUrl =
      leadershipSource === "sec-cross-check"
        ? fortune500LeadershipMeta.publicCompanyCrossCheckUrl
        : fortune500LeadershipMeta.baselineLeadershipSourceUrl;
    const executive = verifiedExecutives[slug] ?? {
      name: chiefExecutive.replaceAll(" & ", " and "),
      title: chiefExecutive.includes(" & ")
        ? "Co-Chief Executive Officers"
        : "Chief Executive Officer",
      appointedYear: null,
      headshot: null,
      biography: `${chiefExecutive.replaceAll(" & ", " and ")} currently leads ${name}. Impact Horizon last checked this leadership record on ${fortune500LeadershipMeta.leadershipCheckedAt}.`,
      sourceUrl,
      verifiedAt: fortune500LeadershipMeta.leadershipCheckedAt,
      status: "verified" as const,
    };
    const leadershipCitation = {
      title: `${name} current chief executive record`,
      publisher: leadershipSource === "sec-cross-check" ? "CEO Tracker / SEC data" : "DemandSage",
      year: 2026,
      url: sourceUrl,
      accessed: fortune500LeadershipMeta.leadershipCheckedAt,
    };

    return {
      ...(legacy ?? {}),
      slug,
      name,
      ticker: legacy?.ticker ?? "Private",
      industry: normalizeIndustryName(industry),
      industrySlug: industrySlug(industry),
      headquarters: legacy?.headquarters ?? headquartersState,
      location: legacy?.location ?? headquartersState,
      founded: foundingRecord?.founded ?? legacy?.founded ?? null,
      founding: foundingRecord
        ? {
            year: foundingRecord.founded,
            modernEstablished: foundingRecord.modernEstablished,
            sourceTitle: foundingRecord.sourceTitle,
            sourceUrl: foundingRecord.sourceUrl,
            verifiedAt: foundingRecord.verifiedAt,
            status: foundingRecord.status,
          }
        : undefined,
      employees: legacy?.employees ?? 0,
      revenueBillions: Number((revenueMillions / 1000).toFixed(1)),
      ceo: executive.name,
      executive,
      marketCapBillions: legacy?.marketCapBillions ?? null,
      fortuneRank: rank,
      fortuneRankYear: fortune500LeadershipMeta.fortuneYear,
      website: (legacy?.website ?? fortune500LeadershipMeta.rankSourceUrl)
        .trim()
        .replace(/(?:%20)+$/i, ""),
      logo: legacy?.logo ?? null,
      score,
      grade: gradeForScore(score),
      change: 0,
      pillars: legacy?.pillars ?? pillars,
      historicalScores,
      summary:
        legacy?.summary ??
        `${name} is evaluated within the ${industry.toLowerCase()} sector using Impact Horizon’s four-pillar corporate-responsibility framework.`,
      strengths: legacy?.strengths ?? [
        "Enterprise-scale operations",
        "Published corporate information",
      ],
      weaknesses: legacy?.weaknesses ?? ["Company-specific outcome evidence remains under review"],
      initiatives: legacy?.initiatives ?? [],
      recentNews: legacy?.recentNews ?? [],
      researchNotes: legacy?.researchNotes ?? [
        "Added to the current 2026 Fortune 500 research universe.",
      ],
      sources: [
        ...(legacy?.sources ?? []),
        {
          title: "Fortune 500 ranking (2026)",
          publisher: "Fortune",
          year: 2026,
          url: fortune500LeadershipMeta.rankSourceUrl,
          accessed: "2026-08-23",
        },
        leadershipCitation,
      ],
      relatedCompanies: legacy?.relatedCompanies ?? [],
      lastReviewed: "2026-08-23",
    } satisfies Company;
  },
);

const enrichedCompanyRecords: Company[] = currentFortuneCompanies.map((company) =>
  enrichCompany({
    ...company,
    timeline:
      company.timeline ??
      company.historicalScores.slice(-3).map((point, index) => ({
        year: point.year,
        title: index === 2 ? "Latest assessment" : "Annual research cycle",
        detail: `Overall responsibility score recorded at ${point.score.toFixed(1)}.`,
      })),
  }),
);
const baselineRanks = new Map(
  rankCompanies(enrichedCompanyRecords).map(({ company, rank }) => [company.slug, rank]),
);
export const companyRecords: Company[] = enrichedCompanyRecords.map((company) => ({
  ...company,
  publishedCycleId: "2026-jul-aug",
  cycleHistory: [
    {
      cycleId: "2026-jul-aug",
      cycleDate: "2026-08-23",
      score: company.score,
      rank: baselineRanks.get(company.slug)!,
      grade: gradeForScore(company.score),
      pillars: { ...company.pillars },
    },
  ],
}));
export const leadershipValidationReport = validateCompanyLeadership(companyRecords);
if (leadershipValidationReport.issues.length) {
  throw new Error(`CEO data validation failed:\n${leadershipValidationReport.issues.join("\n")}`);
}
export const companyIntelligenceValidationReport = validateCompanyIntelligence(companyRecords);
if (companyIntelligenceValidationReport.issues.length) {
  throw new Error(
    `Company intelligence validation failed:\n${companyIntelligenceValidationReport.issues.join("\n")}`,
  );
}
export const scoringValidationIssues = validateScoringEngine(companyRecords, researchCycles);
if (scoringValidationIssues.length) {
  throw new Error(`Scoring and cycle validation failed:\n${scoringValidationIssues.join("\n")}`);
}
const legacyIndustryRecords: Industry[] = [
  ...curatedIndustryRecords,
  ...supplementalIndustries.filter(
    (industry) => !curatedIndustryRecords.some((curated) => curated.slug === industry.slug),
  ),
];
export const industryRecords: Industry[] = [
  ...new Map(
    companyRecords.map((company) => [
      company.industrySlug,
      { name: company.industry, slug: company.industrySlug },
    ]),
  ).values(),
].map(({ name, slug }) => {
  const legacy = legacyIndustryRecords.find(
    (industry) => industry.slug === slug || normalizeIndustryName(industry.name) === name,
  );
  const profile = sectorProfile(name);
  const description = legacy?.description;
  const generic = description?.startsWith("Comparative corporate-responsibility research");
  return {
    slug,
    name,
    description:
      !description || generic
        ? `${name} companies operate across ${profile.markets}. Their scale connects capital, workers, suppliers, customers, infrastructure, and communities, so the sector is evaluated through company-level evidence and material operating context.`
        : `${description} Impact Horizon examines how the industry’s operating model affects workers, suppliers, customers, communities, natural resources, and long-term financial resilience.`,
    outlook: `${legacy?.outlook ?? `Impact Horizon monitors responsibility performance across ${name.toLowerCase()}.`} Current analysis prioritizes ${profile.priorities}, with particular attention to measurable outcomes, stable reporting boundaries, and accountable implementation.`,
    keyIssues: legacy?.keyIssues ?? [
      "Climate resilience",
      "Workforce outcomes",
      "Ethical governance",
      "Community impact",
    ],
  };
});
const industryValidationIssues = validateIndustryRegistry(companyRecords, industryRecords);
if (industryValidationIssues.length) {
  throw new Error(`Industry data validation failed:\n${industryValidationIssues.join("\n")}`);
}

const compactResearchRecords = [
  {
    slug: "annual-outlook-2025",
    type: "Annual publication",
    category: "Annual outlook",
    tags: ["Rankings", "Corporate responsibility", "Outlook"],
    title: "The 2025 Impact500 Annual Report",
    excerpt:
      "Where corporate responsibility is headed next—and the organizations prepared to lead it.",
    author: "Maya Chen",
    publishedAt: "2025-01-16",
    date: "January 16, 2025",
    readMinutes: 18,
    read: "18 min",
    cover: "/images/research/annual-outlook-2025.png",
    coverPosition: "50% 52%",
    featured: true,
    sections: [
      {
        heading: "What changed",
        body: "The strongest organizations moved from broad commitments toward operational evidence, defined ownership, and comparable year-over-year outcomes.",
      },
      {
        heading: "What comes next",
        body: "AI governance, value-chain decarbonization, and workforce outcomes will shape the next cycle of corporate accountability.",
      },
    ],
    related: ["ai-accountability", "credible-climate"],
  },
  {
    slug: "ai-accountability",
    type: "Industry brief",
    category: "Governance",
    tags: ["AI", "Governance", "Technology"],
    title: "Is AI changing the accountability equation?",
    excerpt: "The governance signals that matter as enterprise AI moves from promise to practice.",
    author: "Jon Bell",
    publishedAt: "2024-12-08",
    date: "December 8, 2024",
    readMinutes: 8,
    read: "8 min",
    cover: "/images/research/ai-accountability.png",
    coverPosition: "25% 64%",
    featured: true,
    sections: [
      {
        heading: "From principles to controls",
        body: "Published principles matter only when they connect to accountable owners, testing protocols, escalation paths, and measurable outcomes.",
      },
      {
        heading: "Signals to watch",
        body: "Independent assessment, incident transparency, and product-level risk reporting offer stronger evidence than policy volume alone.",
      },
    ],
    related: ["annual-outlook-2025"],
  },
  {
    slug: "credible-climate",
    type: "Field notes",
    category: "Environment",
    tags: ["Climate", "Disclosure", "Net zero"],
    title: "What credible climate leadership looks like now",
    excerpt: "Why targets alone are no longer enough to signal real operational progress.",
    author: "Elena Ruiz",
    publishedAt: "2024-11-14",
    date: "November 14, 2024",
    readMinutes: 6,
    read: "6 min",
    cover: "/images/research/credible-climate.png",
    coverPosition: "76% 64%",
    featured: false,
    sections: [
      {
        heading: "Evidence over ambition",
        body: "Credible strategies connect baselines, capital allocation, supplier engagement, and annual progress in one traceable narrative.",
      },
      {
        heading: "A higher bar",
        body: "Research increasingly distinguishes operational reductions from offsets and treats value-chain progress as a core performance signal.",
      },
    ],
    related: ["annual-outlook-2025"],
  },
  {
    slug: "retail-workforce-signal",
    type: "Sector analysis",
    category: "Social",
    tags: ["Retail", "Workforce", "Human capital"],
    title: "The workforce signals missing from retail ESG reports",
    excerpt:
      "A practical framework for separating workforce activity metrics from durable employee outcomes.",
    author: "Elena Ruiz",
    publishedAt: "2025-03-21",
    date: "March 21, 2025",
    readMinutes: 10,
    read: "10 min",
    cover: "/images/research/retail-workforce-signal.png",
    coverPosition: "55% 35%",
    featured: true,
    sections: [
      {
        heading: "Activity is not outcome",
        body: "Training hours and program enrollment describe activity; retention, mobility, safety, and wage progression describe outcomes.",
      },
      {
        heading: "Comparable evidence",
        body: "Consistent denominators and multi-year reporting make workforce disclosures more useful across companies.",
      },
    ],
    related: ["annual-outlook-2025"],
  },
] satisfies Omit<ResearchArticle, "readingLevel" | "keyTakeaways" | "references">[];

const editorialSections = (article: (typeof compactResearchRecords)[number]) => {
  const topic = article.title.toLowerCase();
  const context = article.category.toLowerCase();
  const original = new Map(article.sections.map((section) => [section.heading, section.body]));
  const sections = [
    [
      "The strategic question",
      `The central question is not whether ${topic} belongs on a corporate agenda, but whether leaders can translate it into decisions that withstand scrutiny. In ${context}, polished commitments often travel faster than operating systems. A useful assessment therefore begins with ownership: who is accountable, what evidence reaches senior management, and which decisions change when performance misses the stated ambition?\n\nImpact500 treats public reporting as a window into management discipline rather than an end in itself. Strong disclosure connects a material issue to a baseline, a time-bound objective, responsible teams, capital allocation, and comparable outcomes. Weak disclosure substitutes volume for clarity. This distinction matters to employees, investors, customers, communities, and policymakers because each group needs to understand both the direction of travel and the mechanisms likely to produce it.`,
    ],
    [
      "From commitments to operating evidence",
      `Corporate responsibility becomes decision-useful when a reader can follow the chain from policy to implementation. That chain includes board oversight, executive sponsorship, operational controls, incentives, measurement boundaries, and a candid account of setbacks. No single metric proves that a system works; the quality of the connections between metrics often reveals more than the headline target.\n\nResearchers should look for consistency across annual reports, sustainability disclosures, regulatory filings, and leadership commentary. Changes in definitions, omitted baselines, or unexplained restatements deserve attention. At the same time, an evolving metric is not automatically a warning sign: organizations frequently improve measurement as programs mature. The analytical task is to distinguish a transparent methodological improvement from a change that makes year-over-year performance harder to evaluate.`,
    ],
    [
      "What the evidence says",
      `${original.values().next().value ?? article.excerpt} The strongest available signals emphasize measurable outcomes, stable definitions, and a clear relationship between stated priorities and business execution. These signals should be read together, not as isolated proof points.\n\nComparability remains difficult because companies operate with different footprints, value chains, regulatory obligations, and levels of reporting maturity. Impact500 therefore combines absolute performance, direction of change, disclosure quality, and sector context. This approach does not eliminate judgment, but it makes that judgment visible and repeatable. Readers can identify which conclusions rest on reported facts, which reflect comparative analysis, and which remain open questions for the next research cycle.`,
    ],
    [
      "A framework for decision-makers",
      `Executives can improve credibility by assigning named owners, publishing a limited set of durable indicators, and explaining how responsibility considerations affect investment and product decisions. Boards can ask whether management information arrives frequently enough to influence oversight. Investors and journalists can test whether targets align with capital plans, risk factors, and segment-level performance.\n\nThe most effective framework is deliberately practical: define the issue, establish the boundary, select a baseline, set an outcome, identify leading indicators, and report progress on a predictable cadence. Each step should include the assumptions that shape the result. When tradeoffs arise, organizations build trust by describing them directly. A mature publication is not a catalog of success; it is an account of choices, constraints, learning, and measurable progress.`,
    ],
    [
      "Sector implications",
      `The implications vary by industry, but the analytical standard should remain consistent. Materiality determines which outcomes deserve the greatest weight, while a common evidence framework preserves comparability. In capital-intensive sectors, transition plans and asset lives may dominate. In service and technology businesses, workforce, data, product governance, and supply-chain questions may carry greater significance.\n\nPeer analysis is most useful when it avoids false precision. A narrow score difference should not obscure differences in business model or reporting scope. Instead, readers should examine clusters of performance: leaders with mature systems, companies demonstrating credible momentum, organizations with incomplete evidence, and laggards whose disclosures do not yet support confident evaluation. This produces a more honest view of competitive position and the practices that peers can realistically adopt.`,
    ],
    [
      "Risks, limitations, and unanswered questions",
      `Public information creates unavoidable limits. Companies may disclose selectively, use different calculation boundaries, or publish on schedules that do not align. External controversies can also move faster than formal reporting. Impact500 does not treat absence of disclosure as proof that an activity is absent, nor does it treat a published policy as proof of effective implementation.\n\nThe unanswered questions are therefore part of the research result. Which outcomes receive independent assurance? How are suppliers or business units held accountable? What happens when a target is missed? Are affected stakeholders involved in program design? Does executive compensation reinforce the stated priority? Clear questions help readers avoid both reflexive skepticism and uncritical acceptance, while giving companies a concrete roadmap for stronger future disclosure.`,
    ],
    [
      "Signals to watch",
      `${article.sections.at(-1)?.body ?? article.excerpt} Over the next reporting cycles, the most informative developments will be those that connect new commitments to implementation evidence. Watch for stable multi-year datasets, clearer value-chain boundaries, product- or segment-level reporting, and explanations of how management responds when indicators move in the wrong direction.\n\nIndependent assurance, regulatory convergence, and improved digital reporting may make comparisons easier, but they will not remove the need for careful interpretation. Emerging technology can accelerate data collection while introducing new governance risks. The organizations most likely to lead will pair better measurement with institutional learning: they will update controls, explain tradeoffs, and show how responsibility priorities shape everyday operating choices.`,
    ],
    [
      "How to use this analysis",
      `This article is designed as a decision aid, not a substitute for primary-source review. A student may use the framework to structure further research; a journalist may use it to identify questions for management; an executive may use it to test internal reporting; and an investor or policymaker may use it to compare the quality of evidence across organizations. In every case, the most important step is to follow material claims back to the underlying disclosure and its stated boundary.\n\nReaders should also separate company-level conclusions from sector-wide observations. An industry pattern can identify a useful benchmark without proving that every company shares the same risk or capability. Likewise, a strong overall score does not imply uniformly strong performance across every pillar. The profile, methodology, and source record should be read together so that a concise ranking does not replace the more nuanced evidence beneath it.`,
    ],
    [
      "A practical research checklist",
      `Before accepting a corporate claim, ask five questions. Is the claim tied to a defined baseline? Does it cover the operations and value-chain activities that matter most? Is a named executive, committee, or business unit accountable? Are results reported with consistent denominators over multiple years? Is there external assurance or another form of independent challenge? Answers do not need to be perfect, but unexplained gaps should remain visible in the analysis.\n\nA second checklist applies to progress itself. Look for evidence that resources were committed, controls changed, employees or suppliers were engaged, and outcomes moved in the intended direction. Then examine tradeoffs and unintended effects. This disciplined sequence keeps research grounded in implementation while allowing room for uncertainty. It also gives companies a clearer path to improve the usefulness of future reporting without rewarding disclosure volume for its own sake.`,
    ],
    [
      "Conclusion",
      `The durable lesson is that credibility comes from coherence. Ambition, governance, resources, implementation, and outcomes should tell the same story. When those elements reinforce one another, stakeholders can evaluate progress even when the work is incomplete. When they diverge, additional disclosure may add volume without adding confidence.\n\nFor decision-makers, the next step is to focus on a small number of material outcomes and make the evidence trail easy to follow. For researchers, the task is to preserve context while insisting on comparable definitions and documented results. Impact500 will continue to update this analysis as new primary sources become available, separating verified facts from interpretation and identifying the questions that future reporting should answer.`,
    ],
  ];
  return sections.map(([heading, body]) => ({ heading, body }));
};

export const researchRecords: ResearchArticle[] = compactResearchRecords.map((article) => ({
  ...article,
  readMinutes: Math.max(article.readMinutes, 12),
  read: `${Math.max(article.readMinutes, 12)} min`,
  readingLevel: "Professional / Grade 11–12",
  sections: editorialSections(article),
  keyTakeaways: [
    "Credibility depends on measurable outcomes, clear ownership, and consistent reporting boundaries.",
    "Policies and targets are strongest when connected to capital allocation and operating controls.",
    "Sector context matters, but the underlying evidence standard should remain comparable.",
  ],
  references: [
    { title: "Impact500 research methodology", url: "/methodology" },
    {
      title: "U.S. Securities and Exchange Commission filings",
      url: "https://www.sec.gov/edgar/search/",
    },
    {
      title: "Global Reporting Initiative standards",
      url: "https://www.globalreporting.org/standards/",
    },
  ],
}));

const reportCatalog = [
  [
    "impact-horizon-2026",
    "2026 Annual Corporate Responsibility Report",
    "Flagship annual",
    "2026-07-24",
    "A national assessment of leadership, momentum, sector performance, and the evidence defining credible corporate action.",
  ],
  [
    "technology-outlook",
    "Technology Industry Outlook",
    "Industry outlook",
    "2026-07-10",
    "AI accountability, data-center resources, cybersecurity, and the next generation of technology governance.",
  ],
  [
    "healthcare-benchmark",
    "Healthcare CSR Benchmark Report",
    "Benchmark report",
    "2026-06-26",
    "A comparative review of access, workforce resilience, patient trust, and responsible healthcare innovation.",
  ],
  [
    "energy-sustainability",
    "Energy Industry Sustainability Report",
    "Sector analysis",
    "2026-06-12",
    "Transition credibility, operational emissions, community impact, and capital allocation across the energy sector.",
  ],
  [
    "retail-index",
    "Retail Responsibility Index",
    "Industry index",
    "2026-05-29",
    "How major retailers perform on workforce outcomes, sourcing, circularity, and community access.",
  ],
  [
    "financial-services-outlook",
    "Financial Services ESG Outlook",
    "Industry outlook",
    "2026-05-15",
    "Governance, financed emissions, consumer protection, and inclusive growth across financial services.",
  ],
  [
    "top-100-leaders",
    "Top 100 CSR Leaders",
    "Ranking report",
    "2026-05-01",
    "The companies setting the strongest overall benchmark in the current Impact500 index.",
  ],
  [
    "most-improved",
    "Most Improved Companies Report",
    "Momentum report",
    "2026-04-17",
    "Where disclosure, governance, environmental performance, and community investment improved most.",
  ],
  [
    "transparency",
    "Corporate Transparency Report",
    "Thematic report",
    "2026-04-03",
    "A practical benchmark for decision-useful disclosure, evidence quality, and public accountability.",
  ],
  [
    "philanthropy",
    "Corporate Philanthropy Report",
    "Thematic report",
    "2026-03-20",
    "From charitable inputs to durable community outcomes: a review of leading corporate models.",
  ],
  [
    "environmental-leadership",
    "Environmental Leadership Report",
    "Thematic report",
    "2026-03-06",
    "The targets, operating models, and verified outcomes distinguishing environmental leaders.",
  ],
  [
    "ethics-governance",
    "Ethics & Governance Benchmark Report",
    "Benchmark report",
    "2026-02-20",
    "Board oversight, conduct systems, transparency, and stakeholder trust across the index.",
  ],
] as const;

export const reportRecords: AnnualReport[] = reportCatalog.map(
  ([slug, title, edition, publishedAt, summary]) => ({
    slug,
    title,
    year: 2026,
    edition,
    publishedAt,
    summary,
    href: `/research/${slug}`,
    pdf: "/reports/impact-horizon-annual-report-2026.pdf",
    cover: "/images/research-cover.png",
    citation: `Impact500 Institute. (2026). ${title}.`,
  }),
);

const compactNewsRecords = [
  {
    slug: "2026-research-cycle",
    headline: "Impact500 opens its 2026 evidence review cycle",
    summary:
      "Researchers are refreshing source records, score histories, and industry benchmarks for the next index release.",
    category: "Research announcement",
    publishedAt: "2026-07-08",
    featured: true,
  },
  {
    slug: "technology-ai-controls",
    headline: "Technology review adds product-level AI governance controls",
    summary:
      "The methodology now distinguishes published AI principles from documented testing and escalation practices.",
    category: "Industry update",
    publishedAt: "2026-06-24",
    industrySlug: "technology",
    featured: true,
  },
  {
    slug: "company-profile-refresh",
    headline: "Company profiles now expose source-level research notes",
    summary:
      "Profile pages include review dates, structured citations, initiatives, peer context, and historical observations.",
    category: "Company update",
    publishedAt: "2026-06-11",
    featured: false,
  },
  {
    slug: "annual-report-library",
    headline: "Annual report archive moves to a multi-publication system",
    summary:
      "Each edition now carries independent metadata, citations, viewing controls, and related research.",
    category: "Publication",
    publishedAt: "2026-05-29",
    featured: false,
  },
] satisfies Omit<NewsItem, "author" | "publication" | "keyTakeaways" | "body">[];

export const newsRecords: NewsItem[] = compactNewsRecords.map((item) => ({
  ...item,
  author: "Impact500 Research Desk",
  publication: "Impact500 Newsroom",
  keyTakeaways: [
    item.summary,
    "The update strengthens the platform’s public evidence trail.",
    "Readers can follow related company, industry, and methodology research across Impact500.",
  ],
  body: [
    `${item.summary} This newsroom briefing explains what changed, why it matters to readers, and how the development fits within the broader Impact500 research program. The update is presented as institutional news rather than an independent assessment of any company’s operating performance.`,
    `The research team evaluates platform changes against three priorities: usefulness, comparability, and transparency. New material should help readers move from a headline finding to its supporting context, understand the limits of the available evidence, and locate related research without losing the thread of the analysis.`,
    `Impact500 will continue to revise this record as additional primary sources, company disclosures, or methodological documentation become available. Material corrections are governed by the editorial standards page, and readers are encouraged to consult linked research and source documents before relying on any summary for professional decisions.`,
  ],
}));

export const researcherRecords: Researcher[] = [
  {
    slug: "daksh-shetty",
    name: "Daksh Shetty",
    role: "Founder & Research Lead",
    bio: "Daksh Shetty is a student researcher whose academic and professional interests span business, public policy, sustainability, financial literacy, and responsible corporate leadership. He created Impact Horizon after recognizing that important company disclosures were often fragmented, technical, and difficult for students and the public to compare.\n\nAs Founder and Research Lead, Daksh directs the organization’s strategy, research program, evaluation framework, publication standards, and platform development. He established the four-pillar methodology, coordinates company and industry research, reviews evidence quality, and translates complex public disclosures into accessible comparative intelligence.\n\nHis long-term goal is to build Impact Horizon into a trusted public research institution that helps students, researchers, journalists, business professionals, and policymakers ask better questions about corporate responsibility.",
    industryCoverage: ["Cross-industry Research", "Corporate Governance", "Public Policy"],
    profileSections: [
      {
        label: "Mission",
        body: "Make responsible-business evidence understandable, comparable, and useful to the public.",
      },
      {
        label: "Vision",
        body: "Create durable public research infrastructure for transparent corporate accountability.",
      },
      {
        label: "Leadership",
        body: "Directs research strategy, methodology, editorial standards, team coordination, and platform development.",
      },
      {
        label: "Project Timeline",
        body: "Exploration began in 2023, the framework was developed in 2024, the platform launched in 2025, and national coverage expanded in 2026.",
      },
      {
        label: "Research Philosophy",
        body: "Evidence should come before claims, use consistent standards, preserve source trails, and communicate limitations clearly.",
      },
      {
        label: "Professional Interests",
        body: "Business strategy, public policy, sustainability, financial literacy, governance, and economic development.",
      },
      {
        label: "Why Impact Horizon",
        body: "The project was created to turn fragmented corporate disclosure into intelligence that people can understand and use.",
      },
      {
        label: "Long-Term Goals",
        body: "Expand transparent company coverage, strengthen student research opportunities, and develop an enduring independent institute.",
      },
    ],
    quote: "Research should make accountability accessible.",
    focus: "Corporate responsibility, public policy, and research methodology",
    contribution:
      "Oversees research methodology, directs company evaluations, and manages the long-term development of Impact500.",
    photoPosition: "center",
    photo: "/images/team/daksh-shetty.jpeg",
  },
  {
    slug: "ayaan-motiwala",
    name: "Ayaan Motiwala",
    role: "Researcher",
    bio: "Ayaan Motiwala is a senior at Uplift North Hills Preparatory with strong interests in business, leadership, and professional development. Outside the classroom, he enjoys going to the gym and playing basketball. His high-school experience includes business competitions and internships, and he earned first place at SMU ACAP.\n\nAyaan joined Impact Horizon to apply those interests to evidence-based corporate research. He reviewed public sources across the Energy and Retail industries, identified relevant company information, and organized supporting evidence for consistent evaluations.\n\nHis work strengthened the platform’s source base and helped the research team compare company disclosures across industries with different operating risks and responsibility priorities.",
    industryCoverage: ["Energy", "Retail"],
    focus: "Energy and retail industries",
    contribution:
      "Ayaan researched and reviewed sources related to the Energy and Retail industries, helping identify relevant articles and organize supporting research used in developing company evaluations.",
    photoPosition: "center",
    photo: "/images/team/ayaan-motiwala.jpg",
  },
  {
    slug: "prabhav-pola",
    name: "Prabhav Pola",
    role: "Researcher",
    bio: "Prabhav Pola is a senior at Coppell High School with interests in entrepreneurship, business strategy, and competitive leadership. He is a Texas DECA State Champion in Principles of Entrepreneurship and placed fourth at the NABA ACAP competition while serving as CEO of his team’s business pitch. Outside academics, he operates an automotive detailing business and enjoys basketball and video games.\n\nPrabhav joined Impact Horizon to bring an entrepreneurial and analytical perspective to corporate responsibility research. He led research across Food & Beverage, Tobacco, Transportation, and Chemicals, reviewing reports and evaluating industry-specific trends.\n\nHis work improved cross-company consistency, expanded sector coverage, and helped connect individual disclosures to broader patterns in operational responsibility, supply chains, and stakeholder impact.",
    industryCoverage: ["Food & Beverage", "Tobacco", "Transportation", "Chemicals"],
    focus: "Food and beverage, tobacco, transportation, and chemicals industries",
    contribution:
      "For Impact500, Prabhav led research across the Food & Beverage, Tobacco, Transportation, and Chemicals industries, helping analyze corporate responsibility reports, evaluate industry trends, and strengthen the consistency of company assessments.",
    photoPosition: "center 30%",
    photo: "/images/team/prabhav-pola.png",
  },
  {
    slug: "manvith-vippala",
    name: "Manvith Vippala",
    role: "Researcher",
    bio: "Manvith Vippala is a senior at Uplift North Hills Preparatory with interests in investing, financial markets, and community service. Outside school, he enjoys going to the gym and helps operate a nonprofit organization supporting underserved communities in India, an experience that has strengthened his interest in service and responsible leadership.\n\nManvith joined Impact Horizon to examine how major companies communicate financial and social responsibility. He researched the Financial Services and Automotive industries, reviewing public articles and company materials and organizing evidence used during evaluation.\n\nHis contribution broadened the platform’s industry coverage and supported more consistent comparisons of governance, financial responsibility, workforce practices, and public commitments.",
    industryCoverage: ["Financial Services", "Automotive"],
    focus: "Financial services and automotive industries",
    contribution:
      "Manvith researched and reviewed articles for the Financial Services and Automotive industries, helping gather supporting information used during company analysis.",
    photoPosition: "center 18%",
    photo: "/images/team/manvith-vippala.jpg",
  },
  {
    slug: "madhav-kumar",
    name: "Madhav Kumar",
    role: "Researcher",
    bio: "Madhav Kumar is a senior at Coppell High School with interests in technology, business, teamwork, and community engagement. He enjoys working out and plays both offensive and defensive line for the Coppell High School football team. He is also involved with several nonprofit organizations.\n\nMadhav joined Impact Horizon to apply disciplined research to the Technology and Consumer Goods industries. He reviewed publicly available company information, identified relevant responsibility evidence, and supported the evaluation of companies with complex products, supply chains, and stakeholder relationships.\n\nHis work expanded the project’s evidence base and helped the team maintain consistent research practices across two large and rapidly changing sectors.",
    industryCoverage: ["Technology", "Consumer Goods"],
    focus: "Technology and consumer goods industries",
    contribution:
      "Madhav focused his research on the Technology and Consumer Goods industries, reviewing publicly available information that supported company evaluations.",
    photoPosition: "center",
    photo: "/images/team/madhav-kumar.jpg",
  },
  {
    slug: "ritvesh-achivenkata",
    name: "Ritvesh Achivenkata",
    role: "Researcher",
    bio: "Ritvesh Achivenkata is an incoming senior at Coppell High School with interests in research, business, and community engagement. Outside school, he enjoys basketball and video games and volunteers with multiple high schools in his community.\n\nRitvesh joined Impact Horizon to investigate responsibility issues in Healthcare and Aerospace. He identified relevant articles, company disclosures, and background sources, then organized that evidence for use in company assessments.\n\nHis research strengthened sector coverage and helped the platform evaluate highly regulated industries where safety, ethics, governance, innovation, and public trust are especially important.",
    industryCoverage: ["Healthcare", "Aerospace"],
    focus: "Healthcare and aerospace industries",
    contribution:
      "Ritvesh researched companies within the Healthcare and Aerospace industries, identifying relevant articles and background information used throughout the evaluation process.",
    photoPosition: "center",
    photo: "/images/team/ritvesh-achivenkata.jpg",
  },
  {
    slug: "arya-bonthu",
    name: "Arya Bonthu",
    role: "Researcher",
    bio: "Arya Bonthu is an incoming senior at Coppell High School with interests in media, technology, education, and leadership. He enjoys watching television shows and spending time with friends and helps lead an educational youth program at his local recreation center.\n\nArya joined Impact Horizon to develop research experience while contributing to a public educational resource. He studied companies in the Media and Semiconductor industries, collecting and organizing public evidence used in company assessments.\n\nHis work expanded coverage of two information-intensive sectors and supported consistent analysis of governance, innovation, workforce responsibility, supply chains, and public influence.",
    industryCoverage: ["Media", "Semiconductors"],
    focus: "Media and semiconductor industries",
    contribution:
      "Arya researched companies in the Media and Semiconductor industries, helping collect and organize supporting research for company assessments.",
    photoPosition: "center",
    photo: "/images/team/arya-bonthu.jpeg",
  },
  {
    slug: "sidharth-kerthipati",
    name: "Sidharth Kerthipati",
    role: "Researcher",
    bio: "Sidharth Kerthipati is a junior at Coppell High School with a strong interest in business, financial literacy, and professional development. Outside of school, he enjoys running cross country and spending time with friends. He is actively involved in a financial literacy and professional experience program at his local recreation center, where he helps students develop financial knowledge, leadership, and career-readiness skills.\n\nFor Impact Horizon, Sidharth conducted research across the Materials and Wholesale industries. His work included reviewing corporate responsibility reports, sustainability disclosures, annual reports, SEC filings, and other publicly available sources to support consistent and evidence-based company evaluations. His research contributed to expanding the platform's industry coverage and strengthening the accuracy of the Impact Horizon research database.",
    industryCoverage: ["Materials", "Wholesale"],
    focus: "Materials and wholesale industries",
    contribution:
      "Reviewed corporate responsibility reports, sustainability disclosures, annual reports, SEC filings, and other public sources to support consistent, evidence-based company evaluations.",
    photoPosition: "center 32%",
    photo: "/images/team/sidharth-kerthipati.jpeg",
  },
  {
    slug: "krithik-nambhari",
    name: "Krithik Nambhari",
    role: "Researcher",
    bio: "Krithik Nambhari is a senior at Coppell High School with an interest in business, financial technology, and pursuing a future career in fintech. Outside of school, he enjoys playing video games and spending time with friends. Krithik is a 3-time DECA state qualifier and a 1-time Texas Youth & Government state qualifier, experiences that have strengthened his interests in business, leadership, and professional development. He also currently serves in the U.S. Army Reserve.\n\nFor Impact Horizon, Krithik conducted research across the Industrial and Logistics industries. His work involved reviewing corporate responsibility reports, sustainability disclosures, annual reports, SEC filings, and other publicly available sources to support consistent and evidence-based company evaluations. His research helped expand Impact Horizon's industry coverage and contributed to the depth and reliability of the company's research database.",
    industryCoverage: ["Industrials", "Logistics"],
    focus: "Industrials and Logistics",
    focusAreas: [
      "Corporate responsibility",
      "Supply-chain responsibility",
      "Sustainability",
      "Operational practices",
      "Corporate disclosures",
      "Industry benchmarking",
    ],
    contribution:
      "Krithik reviewed corporate responsibility reports, sustainability disclosures, annual reports, SEC filings, and other publicly available sources across the Industrial and Logistics industries. His research supported consistent company evaluations and helped strengthen Impact Horizon's coverage of corporate responsibility trends within these sectors.",
    photoPosition: "center",
    photo: "/images/team/krithik-nambhari.png",
  },
  {
    slug: "vihaan-desai",
    name: "Vihaan Desai",
    role: "Researcher",
    bio: "Vihaan Desai is a junior at Coppell High School with interests in law, debate, and public policy. He is a Texas Youth & Government State Qualifier and is a member of Coppell High School Debate, where he participates as a member of the Congress team. In his free time, Vihaan enjoys playing basketball and spending time with his friends. He is interested in pursuing a career in law in the future.\n\nFor Impact Horizon, Vihaan conducted research across the Transportation and Food & Drug Stores industries. His work involved reviewing corporate responsibility reports, sustainability disclosures, annual reports, SEC filings, and other publicly available sources to support consistent and evidence-based company evaluations. His research helped expand Impact Horizon's industry coverage and contributed to the platform's broader corporate responsibility research database.",
    industryCoverage: ["Transportation", "Food & Drug Stores"],
    focus: "Transportation and Food & Drug Stores",
    contribution:
      "Vihaan reviewed corporate responsibility reports, sustainability disclosures, annual reports, SEC filings, and other publicly available sources across the Transportation and Food & Drug Stores industries. His research supported consistent, evidence-based company evaluations and helped expand Impact Horizon's coverage of these sectors.",
    photoPosition: "center",
    photo: "/images/team/vihaan-desai.jpg",
  },
  {
    slug: "sid-harish",
    name: "Sid Harish",
    role: "Design Specialist",
    bio: "Sid Harish is an incoming junior at Coppell High School with interests in visual communication, digital products, and user experience. Outside school, he enjoys playing soccer and watching movies, interests that complement his attention to teamwork and visual storytelling.\n\nSid joined Impact Horizon to help make complex research easier to navigate and understand. As Design Specialist, he contributed to page layout, interface consistency, information hierarchy, and the overall usability of the website.\n\nHis work helped translate the research team’s evidence and methodology into a more accessible platform, improving how students, researchers, and the public discover and interpret company information.",
    industryCoverage: ["Platform Design", "Research Communication"],
    focus: "Visual design and user experience",
    contribution:
      "Sid assisted with the visual design and overall user experience of the Impact500 website, helping improve layout, usability, and interface consistency.",
    photoPosition: "center",
  },
];

export const methodologyRecords: MethodologySection[] = [
  {
    slug: "scope",
    title: "Scope",
    summary: "How companies and reporting periods enter the index.",
  },
  {
    slug: "evidence",
    title: "Evidence",
    summary: "The public sources and quality standards used by our researchers.",
  },
  {
    slug: "scoring",
    title: "Scoring",
    summary: "How observations become comparable pillar and overall scores.",
  },
  {
    slug: "validation",
    title: "Validation",
    summary: "The review process behind every published finding.",
  },
];
