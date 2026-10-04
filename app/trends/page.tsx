import { InteractiveLineChart, InteractiveBarChart } from "@/components/impact/charts";
import { companies } from "@/lib/data";
import { pageMetadata } from "@/lib/metadata";
import { SectionTitle } from "@/components/ui/primitives";
import { average, calculateAllIndustryStats } from "@/lib/industry-data";

export const metadata = pageMetadata(
  "Corporate Responsibility Trends",
  "Historical performance and industry momentum across the Impact500 universe.",
  "/trends",
);

export default function TrendsPage() {
  const years = [2026];
  const trend = years.map((year) => ({
    label: String(year),
    score: average(
      companies.map(
        (company) => company.historicalScores.find((point) => point.year === year)?.score,
      ),
    )!,
  }));
  const industryData = calculateAllIndustryStats(companies)
    .flatMap((industry) =>
      industry.averageScore === null
        ? []
        : [{ label: industry.name, score: industry.averageScore }],
    )
    .sort((a, b) => b.score - a.score);
  return (
    <main className="page-shell">
      <SectionTitle
        eyebrow="Trend intelligence"
        title={
          <>
            Track change. Identify <em className="text-cyan">direction.</em>
          </>
        }
        text="The 2026 baseline is preserved while the next versioned cycle is reviewed. Directional claims will appear only after comparable validated snapshots exist."
      />
      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        <section className="surface-card">
          <InteractiveLineChart
            area
            title="Index trajectory"
            description="Average overall score across the published company universe."
            data={trend}
            series={[{ key: "score", label: "Index average" }]}
          />
        </section>
        <section className="surface-card">
          <InteractiveBarChart
            title="Sector comparison"
            description="Average current score by covered industry."
            data={industryData}
            series={[{ key: "score", label: "Average score" }]}
          />
        </section>
      </div>
      <section className="mt-16 grid gap-5 md:grid-cols-3">
        {[
          [
            "01",
            "Evidence is maturing",
            "More leading companies pair targets with comparable annual outcomes.",
          ],
          [
            "02",
            "Governance is widening",
            "AI, supply-chain, and climate accountability increasingly converge at board level.",
          ],
          [
            "03",
            "Community metrics lag",
            "Activity remains easier to find than durable, population-level outcomes.",
          ],
        ].map(([n, t, d]) => (
          <article key={n} className="premium-card">
            <span className="display text-3xl text-cyan">{n}</span>
            <h2 className="mt-8 text-2xl font-semibold">{t}</h2>
            <p className="mt-4 leading-7 text-slate-400">{d}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
