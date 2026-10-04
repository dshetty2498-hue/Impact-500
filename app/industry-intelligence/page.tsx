import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { companies, industries } from "@/lib/data";
import { InteractiveBarChart } from "@/components/impact/charts";
import { SectionTitle } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/metadata";
import { IndustryComparison } from "@/components/impact/industry-tools";
import { average, calculateAllIndustryStats, formatIndustryNumber } from "@/lib/industry-data";

export const metadata = pageMetadata(
  "Industry Intelligence",
  "Industry benchmarks, trends, company rankings, and corporate responsibility analytics.",
  "/industry-intelligence",
);

export default function IndustryIntelligencePage() {
  const industryBySlug = new Map(industries.map((industry) => [industry.slug, industry]));
  const sectors = calculateAllIndustryStats(companies)
    .map((stats) => ({ ...stats, details: industryBySlug.get(stats.slug)! }))
    .sort((a, b) => b.companyCount - a.companyCount);
  const platformAverage = average(companies.map((company) => company.score));

  return (
    <main className="page-shell">
      <SectionTitle
        eyebrow="Primary research resource"
        title="Industry Intelligence"
        text="Understand how corporate responsibility differs across sectors through comparable benchmarks, public-company evidence, emerging trends, and interactive analytics."
      />
      <div className="mt-10 grid border-y sm:grid-cols-3">
        <Metric label="Industries covered" value={String(sectors.length)} />
        <Metric label="Companies evaluated" value={String(companies.length)} />
        <Metric label="Platform average" value={formatIndustryNumber(platformAverage)} />
      </div>
      <section className="surface-card mt-8">
        <InteractiveBarChart
          title="Average CSR score by industry"
          description="Comparable sector averages based on companies currently covered by Impact Horizon."
          data={sectors.map((sector) => ({
            label: sector.name,
            score: sector.averageScore!,
          }))}
          series={[{ key: "score", label: "Average CSR" }]}
        />
      </section>
      <IndustryComparison
        industries={sectors.map((sector) => ({
          slug: sector.slug,
          name: sector.name,
          score: sector.averageScore!,
          change: average(sector.companies.map((company) => company.change))!,
          pillars: {
            Environmental: sector.pillarAverages.Environmental!,
            Ethics: sector.pillarAverages.Ethics!,
            Philanthropy: sector.pillarAverages.Philanthropy!,
            "Financial responsibility": sector.pillarAverages["Financial responsibility"]!,
          },
        }))}
      />
      <section className="mt-14">
        <p className="text-xs font-semibold uppercase tracking-[.22em] text-cyan">
          Industry directory
        </p>
        <h2 className="display mt-4 text-4xl md:text-5xl">Research every sector in context.</h2>
        <div className="mt-8 divide-y border-y">
          {sectors.map((sector) => (
            <article
              key={sector.slug}
              className="grid gap-5 py-7 lg:grid-cols-[1.1fr_1.4fr_.7fr_auto] lg:items-start"
            >
              <div>
                <p className="text-xs uppercase tracking-wider text-cyan">
                  {sector.companyCount} companies
                </p>
                <h3 className="display mt-3 text-2xl">{sector.name}</h3>
              </div>
              <div>
                <p className="text-sm leading-6 text-zinc-400">{sector.details.description}</p>
                <p className="mt-3 text-xs leading-5 text-zinc-500">
                  Focus: {sector.details.keyIssues.slice(0, 3).join(" · ")}
                </p>
              </div>
              <dl className="grid grid-cols-2 gap-5 lg:grid-cols-1">
                <div>
                  <dt className="text-xs text-zinc-500">Average score</dt>
                  <dd className="mt-1 text-xl font-semibold tabular-nums">
                    {formatIndustryNumber(sector.averageScore)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-zinc-500">Current leader</dt>
                  <dd className="mt-1 text-sm font-semibold">
                    {sector.leader?.name ?? "Data unavailable"}
                  </dd>
                </div>
              </dl>
              <Link href={`/industries/${sector.slug}`} className="link-arrow">
                Open analysis <ArrowUpRight className="size-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b px-1 py-5 sm:border-b-0 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0">
      <strong className="display block text-3xl text-cyan">{value}</strong>
      <p className="mt-2 text-xs uppercase tracking-wider text-zinc-500">{label}</p>
    </div>
  );
}
