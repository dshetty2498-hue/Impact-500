export type PillarScores = {
  Environmental: number;
  Philanthropy: number;
  Ethics: number;
  "Financial responsibility": number;
};

export type LetterGrade = "A" | "B" | "C" | "D" | "F";

export type ResearchCycleStatus = "updating" | "complete";

export type ResearchCycle = {
  id: string;
  name: string;
  dateLabel: string;
  previousCycleId: string | null;
  status: ResearchCycleStatus;
  companiesReviewed: number;
  companiesWithUpdatedScores: number;
  beganAt: string;
  completedAt: string | null;
  methodologyVersion: string;
  note: string;
};

export type CompanyCycleSnapshot = {
  cycleId: string;
  cycleDate: string;
  score: number;
  rank: number;
  grade: LetterGrade;
  pillars: PillarScores;
};

export type SourceCitation = {
  title: string;
  publisher: string;
  year: number;
  url: string;
  accessed: string;
};

export type CompanyFounding = {
  year: number;
  modernEstablished?: number;
  sourceTitle: string;
  sourceUrl: string;
  verifiedAt: string;
  status: "verified";
};

export type Company = {
  slug: string;
  name: string;
  ticker: string;
  industry: string;
  industrySlug: string;
  headquarters: string;
  location: string;
  founded: number | null;
  founding?: CompanyFounding;
  employees: number;
  revenueBillions: number;
  ceo?: string;
  executive?: {
    name: string;
    title: string;
    appointedYear: number | null;
    headshot: string | null;
    biography: string;
    sourceUrl: string;
    verifiedAt: string;
    status: "verified" | "pending";
  };
  marketCapBillions?: number | null;
  fortuneRank: number | null;
  fortuneRankYear: number;
  website: string;
  logo: string | null;
  score: number;
  grade: string;
  change: number;
  pillars: PillarScores;
  historicalScores: { year: number; score: number }[];
  summary: string;
  executiveSummary?: string;
  overview?: string;
  opportunities?: string[];
  strengths: string[];
  weaknesses: string[];
  initiatives: { title: string; detail: string }[];
  recentNews: {
    headline: string;
    publishedAt: string;
    summary: string;
    publication?: string;
    url?: string;
    status?: "verified" | "sample";
  }[];
  keyDocuments?: {
    title: string;
    publisher: string;
    url: string;
    status: "verified" | "discovery";
  }[];
  researchNotes: string[];
  sources: SourceCitation[];
  relatedCompanies: string[];
  timeline?: { year: number; title: string; detail: string }[];
  lastReviewed: string;
  publishedCycleId?: string;
  cycleHistory?: CompanyCycleSnapshot[];
};

export type Industry = {
  slug: string;
  name: string;
  description: string;
  outlook: string;
  keyIssues: string[];
};

export type ResearchArticle = {
  slug: string;
  type: string;
  category: string;
  tags: string[];
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  date: string;
  readMinutes: number;
  read: string;
  readingLevel: string;
  cover: string;
  coverPosition: string;
  featured: boolean;
  sections: { heading: string; body: string }[];
  keyTakeaways: string[];
  references: { title: string; url: string }[];
  related: string[];
};

export type PublicationSource = {
  title: string;
  organization: string;
  date: string;
  url: string;
  category:
    | "Impact Horizon Data"
    | "Corporate Sources"
    | "Government Sources"
    | "Standards and Nonprofit Sources";
};

export type ResearchFinding = {
  finding: string;
  evidence: string;
  analysis: string;
  whyItMatters: string;
};

export type ResearchPublication = ResearchArticle & {
  researchQuestion: string;
  thesis: string;
  scope: string;
  methodologyNote: string;
  findings: ResearchFinding[];
  recommendations: string[];
  limitations: string[];
  sources: PublicationSource[];
  companySlugs: string[];
  industrySlugs: string[];
  isReport: boolean;
};

export type AnnualReport = {
  slug: string;
  title: string;
  year: number;
  edition: string;
  publishedAt: string;
  summary: string;
  href: string;
  pdf: string;
  cover: string;
  citation: string;
};

export type NewsItem = {
  slug: string;
  headline: string;
  summary: string;
  category: "Company update" | "Industry update" | "Research announcement" | "Publication";
  publishedAt: string;
  companySlug?: string;
  industrySlug?: string;
  featured: boolean;
  author?: string;
  publication?: string;
  sourceUrl?: string;
  keyTakeaways?: string[];
  body?: string[];
};

export type Researcher = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  industryCoverage?: string[];
  profileSections?: { label: string; body: string }[];
  quote?: string;
  focus: string;
  focusAreas?: string[];
  contribution: string;
  photoPosition: string;
  photo?: string;
};

export type MethodologySection = { slug: string; title: string; summary: string };
