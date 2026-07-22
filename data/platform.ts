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
const recentNews = (name: string) => [{ headline: `${name} responsibility profile reviewed`, publishedAt: "2026-07-01", summary: "Impact500 refreshed the company evidence record for the current research cycle." }];

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
    grade: "A+",
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
    grade: "A+",
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
    grade: "A",
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
    grade: "A",
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
    grade: "A-",
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
    grade: "B+",
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
    grade: "A",
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
    grade: "A-",
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

export const companyRecords: Company[] = [...curatedCompanyRecords, ...supplementalCompanies];
export const industryRecords: Industry[] = [
  ...curatedIndustryRecords,
  ...supplementalIndustries.filter(
    (industry) => !curatedIndustryRecords.some((curated) => curated.slug === industry.slug),
  ),
];

export const researchRecords: ResearchArticle[] = [
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
    cover: "/images/research-cover.png",
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
    cover: "/images/research-cover.png",
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
    cover: "/images/research-cover.png",
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
    cover: "/images/research-cover.png",
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
];

export const reportRecords: AnnualReport[] = [
  {
    slug: "impact500-2025",
    title: "The 2025 Impact500 Annual Report",
    year: 2025,
    edition: "Fourth annual",
    publishedAt: "2025-01-16",
    summary:
      "The patterns, questions, and corporate decisions shaping the next phase of responsibility.",
    href: "/annual-report?report=impact500-2025",
    pdf: "/reports/impact500-annual-report-2025.pdf",
    cover: "/images/research-cover.png",
    citation: "Impact500 Institute. (2025). The 2025 Impact500 Annual Report.",
  },
];

export const newsRecords: NewsItem[] = [
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
];

export const researcherRecords: Researcher[] = [
  {
    slug: "daksh-shetty",
    name: "Daksh Shetty",
    role: "Founder & Lead Researcher",
    bio: "Leads the organization’s strategic vision, research program, and long-term platform development.",
    focus: "Corporate responsibility, public policy, and research methodology",
    contribution: "Oversees research methodology, directs company evaluations, and manages the long-term development of Impact500.",
    photoPosition: "center",
  },
  {
    slug: "ayaan-motiwala",
    name: "Ayaan Motiwala",
    role: "Senior Research Analyst",
    bio: "Specializes in corporate sustainability research, company profiling, and data validation.",
    focus: "Sustainability research, company profiling, and industry trends",
    contribution: "Supports evaluation consistency and contributes to industry trend analysis.",
    photoPosition: "center",
  },
  {
    slug: "manvith-vippala",
    name: "Manvith Vippala",
    role: "Research Analyst",
    bio: "Conducts corporate responsibility research and analyzes company disclosures.",
    focus: "Corporate disclosures and cross-industry evaluation",
    contribution: "Assists with maintaining standardized evaluation criteria across industries.",
    photoPosition: "center",
  },
  {
    slug: "madhav-kumar",
    name: "Madhav Kumar",
    role: "Research Analyst",
    bio: "Researches environmental initiatives, governance practices, and corporate transparency.",
    focus: "Environmental initiatives, governance, and transparency",
    contribution: "Supports the collection and verification of company data.",
    photoPosition: "center",
  },
  {
    slug: "ritvesh-achivenkata",
    name: "Ritvesh Achivenkata",
    role: "Research Analyst",
    bio: "Focuses on benchmarking corporate responsibility performance and reviewing public disclosures.",
    focus: "Benchmarking, public disclosures, and methodology",
    contribution: "Contributes to methodology refinement and comparative performance reviews.",
    photoPosition: "center",
  },
  {
    slug: "arya-bonthu",
    name: "Arya Bonthu",
    role: "Research Analyst",
    bio: "Supports company evaluations through data collection and comparative analysis.",
    focus: "Data collection, comparative analysis, and verification",
    contribution: "Verifies publicly available corporate information used in company evaluations.",
    photoPosition: "center",
  },
  {
    slug: "sid-harish",
    name: "Sid Harish",
    role: "Research Analyst",
    bio: "Assists with corporate research and quality assurance across the research database.",
    focus: "Corporate research, quality assurance, and database consistency",
    contribution: "Helps maintain consistency throughout the Impact500 research database.",
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
