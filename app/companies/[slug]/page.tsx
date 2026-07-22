import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { companies } from "@/lib/data";
import { Badge, Score } from "@/components/ui/primitives";
import { InteractiveLineChart, InteractiveRadarChart } from "@/components/impact/charts";
import { pageMetadata } from "@/lib/metadata";
export function generateStaticParams() {
  return companies.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const company = companies.find((c) => c.slug === slug);
  return company
    ? pageMetadata(`${company.name} CSR Profile`, company.summary, `/companies/${company.slug}`)
    : pageMetadata(
        "Company profile",
        "Impact500 corporate responsibility profile.",
        `/companies/${slug}`,
      );
}
export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const company = companies.find((c) => c.slug === slug);
  if (!company) notFound();
  const trend = [68, 72, 75, 79, 81, company.score];
  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <Link className="text-sm text-cyan" href="/leaderboard">
        ← Leaderboard
      </Link>
      <div className="mt-8 flex flex-col justify-between gap-6 md:flex-row">
        <div>
          <Badge>{company.industry}</Badge>
          <h1 className="display mt-5 text-5xl">{company.name}</h1>
          <p className="mt-3 text-zinc-400">{company.location} · 2025 profile</p>
        </div>
        <div className="rounded-2xl border border-cyan/30 bg-cyan/10 px-7 py-5">
          <p className="text-xs uppercase tracking-wider text-zinc-400">CSR score</p>
          <Score score={company.score} grade={company.grade} />
        </div>
      </div>
      <p className="mt-10 max-w-2xl text-lg leading-8 text-zinc-300">{company.summary}</p>
      <div className="mt-14 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <div className="rounded-2xl border bg-panel p-6">
          <InteractiveLineChart
            area
            title="Historical score"
            description="Impact500 score from 2020 through 2025."
            data={trend.map((score, index) => ({ label: String(2020 + index), score }))}
            series={[{ key: "score", label: "Score" }]}
          />
        </div>
        <div className="rounded-2xl border bg-panel p-6">
          <InteractiveRadarChart
            title="Pillar performance"
            description={`${company.name} score across four responsibility pillars.`}
            data={Object.entries(company.pillars).map(([subject, value]) => ({ subject, value }))}
          />
        </div>
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <article className="rounded-2xl border p-6">
          <h2 className="font-semibold">Strengths</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Clear targets, consistently disclosed performance, and accountable executive ownership.
          </p>
        </article>
        <article className="rounded-2xl border p-6">
          <h2 className="font-semibold">Watch areas</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Continued reporting depth and independent validation remain material to future scores.
          </p>
        </article>
      </div>
    </section>
  );
}
