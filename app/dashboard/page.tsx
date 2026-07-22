import Link from "next/link";
import { companies, industries } from "@/lib/data";
import {
  HeatMap,
  InteractiveBarChart,
  InteractiveBubbleChart,
  InteractiveLineChart,
  InteractivePieChart,
  InteractiveSankey,
  InteractiveTreemap,
} from "@/components/impact/charts";
import { SectionTitle } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "CSR Intelligence Dashboard",
  "Interactive Impact500 score distributions, trends, industry rankings, and company performance.",
  "/dashboard",
);
export default function DashboardPage() {
  const ranked = [...companies].sort((a, b) => b.score - a.score);
  const fastestImproving = [...companies].sort((a, b) => b.change - a.change);
  const industryData = industries.map((industry) => {
    const members = companies.filter((company) => company.industrySlug === industry.slug);
    return {
      label: industry.name,
      score: Number(
        (members.reduce((sum, company) => sum + company.score, 0) / members.length).toFixed(1),
      ),
    };
  });
  const gradeData = [...new Set(companies.map((company) => company.grade))].map((grade) => ({
    name: grade,
    value: companies.filter((company) => company.grade === grade).length,
  }));
  const stateNames = [...new Set(companies.map((company) => company.headquarters.split(", ").at(-1) ?? "Other"))];
  const stateData = stateNames.map((state) => {
    const members = companies.filter((company) => company.headquarters.endsWith(state));
    return { label: state, score: Number((members.reduce((sum, company) => sum + company.score, 0) / members.length).toFixed(1)) };
  }).sort((a, b) => b.score - a.score);
  const topStates = [...stateNames].sort((a, b) => companies.filter((company) => company.headquarters.endsWith(b)).length - companies.filter((company) => company.headquarters.endsWith(a)).length).slice(0, 8);
  const scoreDistribution = [["90–100", 90, 101], ["85–89.9", 85, 90], ["80–84.9", 80, 85], ["Below 80", 0, 80]].map(([name, low, high]) => ({ name: String(name), value: companies.filter((company) => company.score >= Number(low) && company.score < Number(high)).length }));
  const fortuneDistribution = [["Top 25", 1, 25], ["26–50", 26, 50], ["51–100", 51, 100], ["101–500", 101, 500]].map(([name, low, high]) => ({ name: String(name), value: companies.filter((company) => company.fortuneRank !== null && company.fortuneRank >= Number(low) && company.fortuneRank <= Number(high)).length }));
  const trendIndustries = [...industries].filter((industry) => companies.some((company) => company.industrySlug === industry.slug)).sort((a, b) => companies.filter((company) => company.industrySlug === b.slug).length - companies.filter((company) => company.industrySlug === a.slug).length).slice(0, 8);
  const industryTrendSeries = trendIndustries.map((industry) => ({ key: industry.slug, label: industry.name }));
  const industryTrends = [2021, 2022, 2023, 2024, 2025, 2026].map((year) => Object.fromEntries([["label", String(year)], ...trendIndustries.map((industry) => { const members = companies.filter((company) => company.industrySlug === industry.slug); return [industry.slug, Number((members.reduce((sum, company) => sum + (company.historicalScores.find((point) => point.year === year)?.score ?? 0), 0) / members.length).toFixed(1))]; })]));
  const regionalSeries = topStates.map((state) => ({ key: state.toLowerCase().replace(/[^a-z]+/g, "-"), label: state }));
  const regionalTrends = [2021, 2022, 2023, 2024, 2025, 2026].map((year) => Object.fromEntries([["label", String(year)], ...topStates.map((state) => { const members = companies.filter((company) => company.headquarters.endsWith(state)); return [state.toLowerCase().replace(/[^a-z]+/g, "-"), Number((members.reduce((sum, company) => sum + (company.historicalScores.find((point) => point.year === year)?.score ?? 0), 0) / members.length).toFixed(1))]; })]));
  return (
    <section className="page-shell">
      <SectionTitle
        eyebrow="Research dashboard"
        title="The index at a glance."
        text="Interactive views of company performance, score movement, industry context, and the shape of the research universe."
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          label="Companies"
          value={companies.length.toLocaleString()}
          detail="Published profiles"
        />
        <Metric
          label="Average score"
          value={(
            companies.reduce((sum, company) => sum + company.score, 0) / companies.length
          ).toFixed(1)}
          detail="Across the index"
        />
        <Metric
          label="Most improved"
          value={fastestImproving[0].name}
          detail={`+${fastestImproving[0].change} points`}
        />
        <Metric label="Industries" value={industries.length.toString()} detail="Active coverage" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Chart>
          <InteractiveBubbleChart
            title="Performance and momentum"
            description="Score, improvement, and revenue scale by company."
            data={companies.map((company) => ({
              name: company.name,
              x: company.score,
              y: company.change,
              size: company.revenueBillions,
            }))}
          />
        </Chart>
        <Chart>
          <InteractiveSankey
            title="Research evidence flow"
            description="How evidence moves from sources into comparative benchmarks."
          />
        </Chart>
        <Chart>
          <InteractivePieChart
            title="CSR grade distribution"
            description="Published companies grouped by current letter grade."
            data={gradeData}
          />
        </Chart>
        <Chart>
          <InteractiveBarChart
            title="Industry rankings"
            description="Average CSR score by industry."
            data={industryData}
            series={[{ key: "score", label: "Average score" }]}
          />
        </Chart>
        <Chart>
          <InteractiveBarChart title="State rankings" description="Average CSR score by headquarters state in the published sample." data={stateData} series={[{ key: "score", label: "Average score" }]} />
        </Chart>
        <Chart>
          <InteractivePieChart title="Fortune ranking distribution" description="Published companies grouped by historical Fortune rank; unranked companies are excluded." data={fortuneDistribution} />
        </Chart>
        <Chart>
          <InteractivePieChart title="CSR score distribution" description="Published companies grouped by current overall score." data={scoreDistribution} />
        </Chart>
        <Chart>
          <InteractiveBarChart title="Fastest improving companies" description="Latest research-cycle score movement." data={fastestImproving.map((company) => ({ label: company.ticker, change: company.change }))} series={[{ key: "change", label: "Change" }]} domain={[0, 5]} />
        </Chart>
        <Chart className="lg:col-span-2">
          <InteractiveLineChart title="Industry trends" description="Average historical score by published industry cohort." data={industryTrends} series={industryTrendSeries} />
        </Chart>
        <Chart className="lg:col-span-2">
          <InteractiveLineChart title="Regional trends" description="Average historical score by headquarters state in the published sample." data={regionalTrends} series={regionalSeries} />
        </Chart>
        <Chart>
          <InteractiveLineChart
            area
            title="Overall score trend"
            description="Average published score across research cycles."
            data={[2021, 2022, 2023, 2024, 2025, 2026].map((year) => ({
              label: String(year),
              score: Number(
                (
                  companies.reduce(
                    (sum, company) =>
                      sum +
                      (company.historicalScores.find((point) => point.year === year)?.score ?? 0),
                    0,
                  ) / companies.length
                ).toFixed(1),
              ),
            }))}
            series={[{ key: "score", label: "Index average" }]}
          />
        </Chart>
        <Chart>
          <InteractiveTreemap
            title="Company scale"
            description="Relative employee footprint across covered companies."
            data={companies.map((company) => ({ name: company.name, size: company.employees }))}
          />
        </Chart>
        <Chart className="lg:col-span-2">
          <HeatMap
            title="Pillar heat map"
            description="Current pillar scores across leading companies."
            data={ranked.slice(0, 6).map((company) => ({
              label: company.ticker,
              values: [...Object.values(company.pillars), company.score],
            }))}
          />
        </Chart>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        <Ranking title="Top performers" companies={ranked.slice(0, 4)} />
        <Ranking title="Bottom performers" companies={[...ranked].reverse().slice(0, 4)} />
      </div>
      <p className="mt-8 text-xs leading-6 text-zinc-500">Scope note: dashboards reflect {companies.length} published profiles, including 200 Fortune-ranked records. Expanded records use 2017 historical Fortune structural data and modeled Impact500 CSR values pending source-level analyst review; private or unranked companies are excluded from rank distributions.</p>
    </section>
  );
}
function Chart({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`surface-card content-auto ${className}`}>{children}</div>;
}
function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="metric-card">
      <p className="text-xs uppercase tracking-wider text-zinc-500">{label}</p>
      <strong className="display mt-4 block text-3xl">{value}</strong>
      <p className="mt-2 text-xs text-zinc-500">{detail}</p>
    </article>
  );
}
function Ranking({ title, companies: list }: { title: string; companies: typeof companies }) {
  return (
    <article className="surface-card">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-5 divide-y">
        {list.map((company, index) => (
          <Link
            href={`/companies/${company.slug}`}
            key={company.slug}
            className="focus-ring flex items-center gap-4 rounded-lg px-2 py-4 hover:bg-white/[.035] hover:text-cyan"
          >
            <span className="text-xs text-zinc-600">0{index + 1}</span>
            <strong className="flex-1">{company.name}</strong>
            <span>{company.score.toFixed(1)}</span>
          </Link>
        ))}
      </div>
    </article>
  );
}
