export type Company = {
  slug: string;
  name: string;
  industry: string;
  location: string;
  score: number;
  grade: string;
  change: number;
  pillars: Record<string, number>;
  summary: string;
};

export const companies: Company[] = [
  {
    slug: "microsoft",
    name: "Microsoft",
    industry: "Technology",
    location: "Redmond, WA",
    score: 92.8,
    grade: "A+",
    change: 2.4,
    pillars: { Environment: 91, People: 94, Ethics: 95, Community: 91 },
    summary:
      "Responsible innovation backed by measurable climate, accessibility, and workforce commitments.",
  },
  {
    slug: "salesforce",
    name: "Salesforce",
    industry: "Technology",
    location: "San Francisco, CA",
    score: 90.6,
    grade: "A",
    change: 3.1,
    pillars: { Environment: 94, People: 92, Ethics: 89, Community: 88 },
    summary: "A values-led cloud company with mature stakeholder accountability.",
  },
  {
    slug: "patagonia",
    name: "Patagonia",
    industry: "Consumer Goods",
    location: "Ventura, CA",
    score: 89.7,
    grade: "A",
    change: 1.2,
    pillars: { Environment: 98, People: 86, Ethics: 87, Community: 90 },
    summary: "An enduring benchmark for environmental stewardship and transparent governance.",
  },
  {
    slug: "cisco",
    name: "Cisco",
    industry: "Technology",
    location: "San Jose, CA",
    score: 88.2,
    grade: "A",
    change: 1.9,
    pillars: { Environment: 85, People: 91, Ethics: 92, Community: 85 },
    summary: "Digital inclusion and secure, responsible technology at enterprise scale.",
  },
  {
    slug: "nike",
    name: "Nike",
    industry: "Consumer Goods",
    location: "Beaverton, OR",
    score: 83.6,
    grade: "B+",
    change: 3.8,
    pillars: { Environment: 84, People: 79, Ethics: 82, Community: 91 },
    summary: "Material progress in circular design alongside ongoing supply-chain scrutiny.",
  },
  {
    slug: "walmart",
    name: "Walmart",
    industry: "Retail",
    location: "Bentonville, AR",
    score: 79.4,
    grade: "B+",
    change: 2.1,
    pillars: { Environment: 81, People: 76, Ethics: 79, Community: 82 },
    summary: "Scale creates outsized opportunity and an equally high bar for accountability.",
  },
];

export const research = [
  {
    slug: "annual-outlook-2025",
    type: "Annual publication",
    title: "The 2025 Impact500 Annual Report",
    excerpt:
      "Where corporate responsibility is headed next—and the organizations prepared to lead it.",
    date: "January 2025",
    read: "18 min",
  },
  {
    slug: "ai-accountability",
    type: "Industry brief",
    title: "Is AI changing the accountability equation?",
    excerpt: "The governance signals that matter as enterprise AI moves from promise to practice.",
    date: "December 2024",
    read: "8 min",
  },
  {
    slug: "credible-climate",
    type: "Field notes",
    title: "What credible climate leadership looks like now",
    excerpt: "Why targets alone are no longer enough to signal real operational progress.",
    date: "November 2024",
    read: "6 min",
  },
];

export const team = [
  {
    slug: "maya-chen",
    name: "Maya Chen",
    role: "Research Director",
    bio: "Leads the institute’s evidence strategy and cross-industry research program.",
  },
  {
    slug: "jon-bell",
    name: "Jon Bell",
    role: "Methodology Lead",
    bio: "Designs transparent scoring systems and validation standards.",
  },
  {
    slug: "elena-ruiz",
    name: "Elena Ruiz",
    role: "Industry Researcher",
    bio: "Studies how corporate commitments translate into measurable outcomes.",
  },
];

export const methodologySections = [
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

export const reports = [
  {
    slug: "impact500-2025",
    title: "The 2025 Impact500 Annual Report",
    year: 2025,
    href: "/annual-report",
    pdf: "/reports/impact500-annual-report-2025.pdf",
  },
];

export const navItems = [
  ["Leaderboard", "/leaderboard"],
  ["Compare", "/compare"],
  ["CSR Explorer", "/explorer"],
  ["Research", "/research"],
  ["Annual Report", "/annual-report"],
  ["Methodology", "/methodology"],
  ["Why CSR & ESG", "/why-csr"],
  ["About", "/about"],
] as const;
