import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, BookOpen, Download, Quote } from "lucide-react";
import { InteractiveBarChart, InteractiveLineChart } from "@/components/impact/charts";
import { ReportActions } from "@/components/impact/report-actions";
import { companies, industries, reports, research } from "@/lib/data";
import { pageMetadata } from "@/lib/metadata";
import { gradingScale } from "@/lib/grading";
import { CompanyLogo } from "@/components/impact/company-logo";
import { average, calculateAllIndustryStats, formatIndustryNumber } from "@/lib/industry-data";

export const metadata = pageMetadata(
  "2026 Annual Corporate Responsibility Report",
  "The flagship Impact500 assessment of corporate responsibility.",
  "/annual-report",
);

const chapters = [
  ["01", "Letter from the Founder", "Why comparable public evidence matters now."],
  ["02", "Executive Summary", "The decisions, signals, and findings that define this edition."],
  [
    "03",
    "State of Corporate Responsibility",
    "How the field is shifting from commitments to demonstrated outcomes.",
  ],
  ["04", "Methodology Overview", "The framework behind scope, evidence, scoring, and validation."],
  [
    "05",
    "Data Collection Process",
    "How researchers identify, review, and preserve source evidence.",
  ],
  ["06", "Research Principles", "Independence, comparability, transparency, and proportionality."],
  ["07", "National Trends", "Six cycles of change across the published universe."],
  ["08", "Industry Rankings", "Comparative performance across major sectors."],
  ["09", "Industry Deep Dives", "Material issues and evidence patterns by sector."],
  ["10", "Top Performing Companies", "The organizations setting the current benchmark."],
  ["11", "Most Improved Companies", "Where year-over-year momentum is strongest."],
  ["12", "Historical Trends", "Longitudinal signals across the four-pillar framework."],
  ["13", "Environmental Analysis", "Climate, resources, circularity, and value-chain performance."],
  ["14", "Governance Analysis", "Oversight, accountability, disclosure, and resilience."],
  ["15", "Community Investment", "From philanthropic activity to measurable public outcomes."],
  ["16", "Ethics Analysis", "Controls, conduct, transparency, and stakeholder trust."],
  ["17", "Statistical Highlights", "Distribution, concentration, momentum, and outliers."],
  ["18", "Case Studies", "Operational approaches with transferable lessons."],
  ["19", "Research Insights", "What the evidence suggests—and what it cannot yet prove."],
  ["20", "Emerging Trends", "AI accountability, transition plans, and workforce outcomes."],
  ["21", "Future Outlook", "Questions likely to define the next assessment cycle."],
  ["22", "Appendix", "Coverage notes, calculation detail, and research limitations."],
  ["23", "Glossary", "Definitions for frequently used research and reporting terms."],
  ["24", "References", "Source categories and citation guidance."],
];

export default function AnnualReportPage() {
  const report = reports[0];
  const leaders = [...companies].sort((a, b) => b.score - a.score);
  const years = [2026];
  const trend = years.map((year) => ({
    label: String(year),
    score: average(
      companies.map(
        (company) => company.historicalScores.find((point) => point.year === year)?.score,
      ),
    )!,
  }));
  const sectorScores = calculateAllIndustryStats(companies)
    .flatMap((industry) =>
      industry.averageScore === null
        ? []
        : [{ label: industry.name, score: industry.averageScore }],
    )
    .sort((a, b) => b.score - a.score);
  return (
    <main>
      <section className="grid-bg relative overflow-hidden border-b bg-gradient-to-br from-[#0c2031] via-ink to-[#081827]">
        <div className="page-shell grid min-h-[720px] items-center gap-14 lg:grid-cols-[1.1fr_.65fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.32em] text-emerald-400">
              Flagship research · Expanded 2026 edition · 72-page digital experience
            </p>
            <h1 className="display mt-7 text-5xl leading-[.95] sm:text-7xl lg:text-[5.5rem]">
              The state of corporate responsibility.
            </h1>
            <p className="mt-8 max-w-3xl text-xl leading-9 text-slate-300">
              A national assessment of leadership, momentum, industry performance, and the evidence
              defining credible corporate action.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#read" className="button-primary">
                <BookOpen className="size-4" />
                Read the report
              </a>
              <a href={report.pdf} download className="button-secondary">
                <Download className="size-4" />
                Download publication
              </a>
            </div>
            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-4 border-t pt-7">
              <Stat value={companies.length.toString()} label="companies" />
              <Stat value={industries.length.toString()} label="industries" />
              <Stat value="1" label="versioned baseline" />
            </div>
          </div>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[1.5rem] border shadow-2xl shadow-sky-500/15">
            <Image
              src={report.cover}
              alt={`${report.title} cover`}
              fill
              priority
              sizes="420px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <p className="absolute bottom-8 left-8 text-xs uppercase tracking-[.22em] text-white">
              Impact500 Institute
            </p>
          </div>
        </div>
      </section>
      <div id="read" className="page-shell">
        <section className="grid gap-10 lg:grid-cols-[.68fr_1.32fr]">
          <div>
            <p className="text-xs uppercase tracking-[.2em] text-cyan">Executive summary</p>
            <h2 className="display mt-5 text-4xl md:text-6xl">
              Evidence is becoming the strategy.
            </h2>
          </div>
          <div className="space-y-5 text-lg leading-9 text-slate-300">
            <p>
              Corporate responsibility is entering a more demanding phase. Stakeholders increasingly
              expect companies to connect ambition with ownership, investment, implementation, and
              comparable outcomes.
            </p>
            <p>
              Across the published universe, leading organizations distinguish themselves less by
              the volume of commitments they make than by the quality of evidence they sustain. The
              published baseline establishes a comparison point, while the open research cycle is
              reviewing value-chain data, workforce outcomes, and community-impact measurement.
            </p>
          </div>
        </section>
        <section className="mt-20 rounded-[2rem] border bg-panel/50 p-7 md:p-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-cyan">Contents</p>
              <h2 className="display mt-3 text-4xl">Inside the report</h2>
            </div>
            <ArrowDown className="size-6 text-slate-500" />
          </div>
          <div className="mt-8 grid gap-x-10 md:grid-cols-2">
            {chapters.map(([n, title, text]) => (
              <div key={n} className="grid grid-cols-[2.5rem_1fr] gap-4 border-t py-5">
                <span className="text-xs text-cyan">{n}</span>
                <span>
                  <strong className="block">{title}</strong>
                  <small className="mt-1 block leading-5 text-slate-500">{text}</small>
                </span>
              </div>
            ))}
          </div>
        </section>
        <section className="mt-20 grid gap-6 lg:grid-cols-2">
          <div className="surface-card">
            <InteractiveLineChart
              area
              title="National performance trend"
              description="Published 2026 baseline; comparable movement is not yet available."
              data={trend}
              series={[{ key: "score", label: "Index average" }]}
            />
          </div>
          <div className="surface-card">
            <InteractiveBarChart
              title="Industry rankings"
              description="Average current score by covered industry."
              data={sectorScores}
              series={[{ key: "score", label: "Average score" }]}
            />
          </div>
        </section>
        <section className="mt-20">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[.2em] text-cyan">Score legend</p>
              <h2 className="display mt-3 text-4xl">Standardized grading scale.</h2>
            </div>
            <Link href="/methodology#grading-scale-title" className="link-arrow">
              View full methodology <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-5">
            {gradingScale.map((item) => (
              <div key={item.grade} className={`rounded-xl border p-5 ${item.badgeClass}`}>
                <strong className="display text-3xl">{item.grade}</strong>
                <span className="mt-3 block text-sm font-semibold">{item.range}</span>
                <span className="mt-1 block text-xs opacity-75">{item.color}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {leaders.slice(0, 2).map((company) => (
              <Link
                key={company.slug}
                href={`/companies/${company.slug}`}
                className="premium-card flex items-center gap-4"
              >
                <CompanyLogo
                  name={company.name}
                  website={company.website}
                  logo={company.logo}
                  size="lg"
                />
                <span>
                  <strong className="block text-lg">{company.name}</strong>
                  <small className="text-zinc-500">
                    CEO {company.executive?.name} · {company.industry} · {company.score.toFixed(1)}
                  </small>
                </span>
              </Link>
            ))}
          </div>
        </section>
        <section className="mt-20">
          <p className="text-xs uppercase tracking-[.2em] text-cyan">Statistical highlights</p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ReportMetric
              label="Index leader"
              value={leaders[0].name}
              detail={leaders[0].score.toFixed(1)}
            />
            <ReportMetric
              label="Score movement"
              value="Pending"
              detail="Requires second validated snapshot"
            />
            <ReportMetric
              label="Average score"
              value={formatIndustryNumber(average(companies.map((company) => company.score)))}
              detail="Published baseline"
            />
            <ReportMetric
              label="Evidence points"
              value={`${(companies.length * 4).toLocaleString()}+`}
              detail="Published pillar observations"
            />
          </div>
        </section>
        <section className="mt-20 grid gap-8 border-y py-16 lg:grid-cols-[.55fr_1.45fr]">
          <Quote className="size-10 text-cyan" />
          <blockquote className="display text-3xl leading-tight md:text-5xl">
            “Our purpose is not to reduce responsibility to a number. It is to make the evidence
            behind corporate decisions easier to examine, compare, and challenge.”
            <footer className="mt-7 font-sans text-sm not-italic text-slate-500">
              — Founder’s letter, 2026 edition
            </footer>
          </blockquote>
        </section>
        <section className="mt-20">
          <p className="text-xs uppercase tracking-[.2em] text-cyan">Continue the research</p>
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {research.slice(0, 3).map((item) => (
              <Link key={item.slug} href={`/research/${item.slug}`} className="premium-card">
                <span className="text-xs text-cyan">{item.type}</span>
                <h2 className="mt-5 text-xl font-semibold">{item.title}</h2>
                <p className="mt-4 text-sm leading-6 text-slate-400">{item.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
        <section className="surface-card mt-20">
          <p className="text-xs uppercase tracking-wider text-cyan">Publication details</p>
          <h2 className="mt-5 text-3xl font-semibold">{report.title}</h2>
          <p className="mt-4 text-slate-400">{report.citation}</p>
          <ReportActions pdf={report.pdf} slug={report.slug} title={report.title} />
        </section>
        <details className="mt-8 rounded-2xl border bg-panel/50 p-6">
          <summary className="cursor-pointer font-semibold">Open embedded publication file</summary>
          <iframe
            title={report.title}
            src={`${report.pdf}#view=FitH`}
            className="mt-6 h-[78vh] w-full bg-white"
          />
        </details>
      </div>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <strong className="display text-3xl text-cyan">{value}</strong>
      <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">{label}</p>
    </div>
  );
}
function ReportMetric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="metric-card">
      <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
      <strong className="mt-5 block text-2xl">{value}</strong>
      <span className="mt-3 block text-sm text-cyan">{detail}</span>
    </article>
  );
}
