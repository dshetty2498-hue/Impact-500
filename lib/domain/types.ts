export type PillarScores = {
  Environmental: number;
  Philanthropy: number;
  Ethics: number;
  "Financial responsibility": number;
};

export type SourceCitation = {
  title: string;
  publisher: string;
  year: number;
  url: string;
  accessed: string;
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
  employees: number;
  revenueBillions: number;
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
  strengths: string[];
  weaknesses: string[];
  initiatives: { title: string; detail: string }[];
  recentNews: { headline: string; publishedAt: string; summary: string }[];
  researchNotes: string[];
  sources: SourceCitation[];
  relatedCompanies: string[];
  lastReviewed: string;
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
  cover: string;
  coverPosition: string;
  featured: boolean;
  sections: { heading: string; body: string }[];
  related: string[];
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
};

export type Researcher = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  focus: string;
  contribution: string;
  photoPosition: string;
};

export type MethodologySection = { slug: string; title: string; summary: string };
