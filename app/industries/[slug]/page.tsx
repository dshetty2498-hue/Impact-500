import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { industries, companies, research } from "@/lib/data";
import { InteractiveBarChart, InteractiveLineChart } from "@/components/impact/charts";
import { pageMetadata } from "@/lib/metadata";
import { IndustryActions } from "@/components/impact/industry-actions";
export function generateStaticParams() {
  return industries.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = industries.find((item) => item.slug === slug);
  return industry
    ? pageMetadata(
        `${industry.name} CSR Research`,
        industry.description,
        `/industries/${industry.slug}`,
      )
    : pageMetadata("Industry Research", "Impact500 industry research.", "/industries");
}
export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = industries.find((item) => item.slug === slug);
  if (!industry) notFound();
  const members = companies
    .filter((company) => company.industrySlug === industry.slug)
    .sort((a, b) => b.score - a.score);
  const average = members.reduce((sum, company) => sum + company.score, 0) / members.length;
  const articles = research.filter((article) =>
    article.tags.some((tag) => tag.toLowerCase() === industry.name.toLowerCase()),
  );
  return (
    <section className="page-shell">
      <Link href="/industries" className="text-sm text-cyan">
        ← All industries
      </Link>
      <p className="mt-10 text-xs uppercase tracking-[.18em] text-cyan">Industry research</p>
      <h1 className="display mt-4 text-5xl md:text-6xl">{industry.name}</h1>
      <p className="mt-6 max-w-3xl text-xl leading-8 text-zinc-300">{industry.description}</p>
      <IndustryActions slug={industry.slug} name={industry.name} />
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Metric label="Average CSR score" value={average.toFixed(1)} />
        <Metric label="Top company" value={members[0]?.name ?? "—"} />
        <Metric label="Companies evaluated" value={String(members.length)} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="surface-card">
          <InteractiveBarChart
            title="Company ranking"
            data={members.map((company) => ({ label: company.name, score: company.score }))}
            series={[{ key: "score", label: "CSR score" }]}
          />
        </div>
        <div className="surface-card">
          <InteractiveLineChart
            area
            title="Industry score trend"
            data={[2021, 2022, 2023, 2024, 2025, 2026].map((year) => ({
              label: String(year),
              score:
                members.reduce(
                  (sum, company) =>
                    sum +
                    (company.historicalScores.find((point) => point.year === year)?.score ?? 0),
                  0,
                ) / members.length,
            }))}
            series={[{ key: "score", label: "Industry average" }]}
          />
        </div>
      </div>
      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        <article>
          <p className="text-xs uppercase tracking-wider text-cyan">Research outlook</p>
          <h2 className="display mt-3 text-4xl">What we are watching.</h2>
          <p className="mt-5 leading-7 text-zinc-400">{industry.outlook}</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {industry.keyIssues.map((issue) => (
              <li className="rounded-xl border bg-panel p-4 text-sm" key={issue}>
                {issue}
              </li>
            ))}
          </ul>
        </article>
        <article>
          <p className="text-xs uppercase tracking-wider text-cyan">Research</p>
          <div className="mt-5 space-y-3">
            {articles.length ? (
              articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/research/${article.slug}`}
                  className="focus-ring block rounded-xl border bg-panel p-5 transition hover:-translate-y-0.5 hover:border-cyan/30"
                >
                  <strong>{article.title}</strong>
                  <p className="mt-2 text-sm text-zinc-500">{article.excerpt}</p>
                </Link>
              ))
            ) : (
              <p className="rounded-xl border p-6 text-zinc-500">
                Sector-specific publications are being prepared. Company evidence remains available
                above.
              </p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-card">
      <p className="text-xs uppercase tracking-wider text-zinc-500">{label}</p>
      <strong className="display mt-4 block text-3xl">{value}</strong>
    </div>
  );
}
