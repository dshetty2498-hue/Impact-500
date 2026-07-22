import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { companies, companyDetails } from "@/lib/data";
import { Badge, Score } from "@/components/ui/primitives";
import { InteractiveLineChart, InteractiveRadarChart } from "@/components/impact/charts";
import { pageMetadata } from "@/lib/metadata";
import { ProfileActions } from "@/components/impact/profile-actions";
import { ArrowUpRight, CheckCircle2, CircleAlert, FileText } from "lucide-react";
import { ActivityTracker } from "@/components/member/activity-tracker";
import { ReadingProgress } from "@/components/impact/research-tools";
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
  const details = companyDetails[company.slug];
  const industryPeers = companies.filter(
    (item) => item.industry === company.industry && item.slug !== company.slug,
  );
  const industryAverage =
    companies
      .filter((item) => item.industry === company.industry)
      .reduce((sum, item) => sum + item.score, 0) /
    companies.filter((item) => item.industry === company.industry).length;
  const industryRank =
    [...companies]
      .filter((item) => item.industry === company.industry)
      .sort((a, b) => b.score - a.score)
      .findIndex((item) => item.slug === company.slug) + 1;
  const industryMembers = companies.filter((item) => item.industry === company.industry);
  const pillarBenchmarks = Object.keys(company.pillars).map((pillar) => ({
    pillar,
    company: company.pillars[pillar as keyof typeof company.pillars],
    industry:
      industryMembers.reduce(
        (sum, item) => sum + item.pillars[pillar as keyof typeof item.pillars],
        0,
      ) / industryMembers.length,
  }));
  return (
    <section className="page-shell">
      <ReadingProgress />
      <ActivityTracker
        activity={{
          type: "view",
          slug: company.slug,
          title: company.name,
          href: `/companies/${company.slug}`,
        }}
      />
      <Link className="text-sm text-cyan" href="/leaderboard">
        ← Leaderboard
      </Link>
      <div className="relative mt-8 overflow-hidden rounded-[2rem] border bg-gradient-to-br from-accent/[.13] via-panel to-panel p-7 shadow-2xl shadow-black/20 md:p-10">
        <div className="pointer-events-none absolute right-0 top-0 size-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="flex items-start gap-5">
            <div className="grid size-16 shrink-0 place-items-center rounded-2xl border border-white/15 bg-white/[.07] text-2xl font-bold text-cyan shadow-xl md:size-20">
              {company.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <Badge>{company.industry}</Badge>
              <h1 className="display mt-5 text-5xl md:text-7xl">{company.name}</h1>
              <p className="mt-3 text-zinc-400">
                {company.ticker} · {company.headquarters} · reviewed {company.lastReviewed}
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-cyan/30 bg-cyan/10 px-8 py-6 shadow-xl shadow-accent/10 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-wider text-zinc-400">CSR score</p>
            <Score score={company.score} grade={company.grade} />
          </div>
        </div>
        <p className="relative mt-10 text-xs uppercase tracking-[.18em] text-cyan">Executive summary</p>
        <p className="relative mt-4 max-w-3xl text-lg leading-8 text-zinc-300 md:text-xl">
          {company.summary}
        </p>
      </div>
      <div className="mt-7">
        <ProfileActions name={company.name} slug={company.slug} />
      </div>
      <nav aria-label="Company report sections" className="sticky top-[5.25rem] z-20 mt-8 overflow-x-auto rounded-2xl border bg-ink/90 px-5 backdrop-blur-xl">
        <div className="flex min-w-max gap-7 py-4 text-sm text-zinc-400">
          {[["performance", "Performance"], ["initiatives", "Initiatives"], ["risks", "Risks"], ["sources", "Sources"], ["news", "News"]].map(([id, label]) => <a key={id} href={`#${id}`} className="focus-ring transition hover:text-cyan">{label}</a>)}
        </div>
      </nav>
      <div id="performance" className="scroll-mt-40 mt-14 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <div className="surface-card">
          <InteractiveLineChart
            area
            title="Historical score"
            description="Impact500 score across published research cycles."
            data={company.historicalScores.map(({ year, score }) => ({
              label: String(year),
              score,
            }))}
            series={[{ key: "score", label: "Score" }]}
          />
        </div>
        <div className="surface-card">
          <InteractiveRadarChart
            title="Pillar performance"
            description={`${company.name} score across four responsibility pillars.`}
            data={Object.entries(company.pillars).map(([subject, value]) => ({ subject, value }))}
          />
        </div>
      </div>
      <section aria-labelledby="pillar-heading" className="mt-5">
        <h2 id="pillar-heading" className="sr-only">CSR pillar scores</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Object.entries(company.pillars).map(([pillar, value]) => (
            <article key={pillar} className="surface-card p-6">
              <div className="flex items-center justify-between gap-4"><h3 className="text-sm font-semibold text-slate-300">{pillar}</h3><strong className="text-2xl text-cyan">{value}</strong></div>
              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10"><span className="score-fill block h-full rounded-full bg-gradient-to-r from-accent to-cyan" style={{ width: `${value}%` }} /></div>
              <p className="mt-3 text-xs text-zinc-500">Score out of 100</p>
            </article>
          ))}
        </div>
      </section>
      <dl className="mt-5 grid gap-4 rounded-2xl border bg-panel p-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        <Stat label="Ticker" value={company.ticker} />
        <Stat label="Founded" value={company.founded ? String(company.founded) : "Not published"} />
        <Stat label="Employees" value={company.employees.toLocaleString()} />
        <Stat label="Revenue" value={`$${company.revenueBillions}B`} />
        <Stat label="Industry rank" value={`#${industryRank}`} />
        <Stat label={`Fortune ${company.fortuneRankYear}`} value={company.fortuneRank ? `#${company.fortuneRank}` : "Not ranked"} />
        <Stat label="State" value={company.headquarters.split(", ").at(-1) ?? company.headquarters} />
        <Stat
          label="Website"
          value={new URL(company.website).hostname.replace("www.", "")}
          href={company.website}
        />
      </dl>
      <p className="mt-3 text-xs text-zinc-500">Fortune rank is displayed with its source year. Expanded profiles use historical structural facts and modeled Impact500 CSR values pending analyst verification.</p>
      <section className="mt-5 grid gap-5 lg:grid-cols-2">
        <article className="surface-card"><p className="text-xs uppercase tracking-wider text-cyan">Industry overview</p><h2 className="mt-5 text-2xl font-semibold">{company.industry} responsibility context</h2><p className="mt-4 leading-7 text-zinc-400">The published {company.industry.toLowerCase()} cohort contains {industryMembers.length} companies with an average CSR score of {industryAverage.toFixed(1)}. Comparisons emphasize disclosure quality, verified outcomes, and sector-specific operating risks.</p></article>
        <article className="surface-card"><p className="text-xs uppercase tracking-wider text-cyan">Competitive position</p><h2 className="mt-5 text-2xl font-semibold">Ranked #{industryRank} in its published peer group.</h2><p className="mt-4 leading-7 text-zinc-400">{company.name} scores {Math.abs(company.score - industryAverage).toFixed(1)} points {company.score >= industryAverage ? "above" : "below"} its industry average and changed {company.change > 0 ? "+" : ""}{company.change}% in the latest cycle.</p></article>
      </section>
      <section className="mt-16">
        <p className="text-xs uppercase tracking-[.18em] text-cyan">Industry benchmarks</p>
        <h2 className="display mt-3 text-4xl">Performance against published peers.</h2>
        <div className="mt-7 overflow-hidden rounded-[1.5rem] border bg-panel">
          {pillarBenchmarks.map((item) => (
            <div key={item.pillar} className="grid gap-3 border-b p-5 last:border-0 sm:grid-cols-[1fr_2fr_auto] sm:items-center">
              <strong>{item.pillar}</strong>
              <div className="relative h-2 overflow-visible rounded-full bg-white/10"><span className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent to-cyan" style={{ width: `${item.company}%` }} /><span className="absolute inset-y-[-3px] w-px bg-white" style={{ left: `${item.industry}%` }} /></div>
              <span className="text-sm text-zinc-400">{item.company} <small>vs {item.industry.toFixed(1)}</small></span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-zinc-500">White markers show the published industry average.</p>
      </section>
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
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <article className="rounded-2xl border bg-panel p-6">
          <p className="text-xs uppercase tracking-wider text-cyan">Industry context</p>
          <strong className="display mt-5 block text-4xl">{industryAverage.toFixed(1)}</strong>
          <p className="mt-2 text-sm text-zinc-500">{company.industry} average</p>
          <p
            className={`mt-5 text-sm ${company.score >= industryAverage ? "text-emerald-400" : "text-amber-400"}`}
          >
            {company.score >= industryAverage ? "Above" : "Below"} sector average by{" "}
            {Math.abs(company.score - industryAverage).toFixed(1)} points
          </p>
        </article>
        <article className="rounded-2xl border bg-panel p-6">
          <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-400">
            <CheckCircle2 className="size-4" />
            Key strengths
          </p>
          <ul className="mt-5 space-y-3">
            {details.strengths.map((item) => (
              <li key={item} className="text-sm leading-6 text-zinc-300">
                {item}
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border bg-panel p-6">
          <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400">
            <CircleAlert className="size-4" />
            Watch areas
          </p>
          <ul className="mt-5 space-y-3">
            {details.weaknesses.map((item) => (
              <li key={item} className="text-sm leading-6 text-zinc-300">
                {item}
              </li>
            ))}
          </ul>
        </article>
      </div>
      <section className="mt-16">
        <p className="text-xs uppercase tracking-[.18em] text-cyan">Historical timeline</p>
        <h2 className="display mt-3 text-4xl">Score history and CSR milestones.</h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {company.historicalScores.map((point, index) => {
            const previous = company.historicalScores[index - 1];
            const delta = previous ? point.score - previous.score : null;
            const milestoneIndex = index - (company.historicalScores.length - company.initiatives.length);
            const milestone = milestoneIndex >= 0 ? company.initiatives[milestoneIndex] : undefined;
            return <li key={point.year} className="surface-card"><span className="text-xs text-cyan">{point.year}</span><strong className="display mt-4 block text-4xl">{point.score.toFixed(1)}</strong><p className="mt-3 text-sm text-zinc-400">{delta === null ? "Baseline research cycle established." : `${delta >= 0 ? "+" : ""}${delta.toFixed(1)} points from prior cycle.`}</p>{milestone && <p className="mt-5 border-t pt-4 text-xs leading-5 text-zinc-500">Milestone: {milestone.title}</p>}</li>;
          })}
        </ol>
      </section>
      <section id="initiatives" className="scroll-mt-40 mt-16">
        <p className="text-xs uppercase tracking-[.18em] text-cyan">CSR initiatives</p>
        <h2 className="display mt-3 text-4xl">Programs under review.</h2>
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {details.initiatives.map((initiative, index) => (
            <article className="rounded-2xl border bg-panel p-6" key={initiative.title}>
              <span className="text-xs text-zinc-600">0{index + 1}</span>
              <h3 className="mt-6 text-xl font-semibold">{initiative.title}</h3>
              <p className="mt-3 leading-7 text-zinc-400">{initiative.detail}</p>
            </article>
          ))}
        </div>
      </section>
      <section id="risks" className="scroll-mt-40 mt-16">
        <p className="text-xs uppercase tracking-[.18em] text-amber-400">Risk and controversy review</p>
        <h2 className="display mt-3 text-4xl">Material issues under observation.</h2>
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {details.weaknesses.map((item, index) => (
            <article className="surface-card" key={item}>
              <span className="text-xs text-amber-400">RC-{String(index + 1).padStart(2, "0")}</span>
              <p className="mt-5 leading-7 text-zinc-300">{item}</p>
              <p className="mt-4 text-xs leading-5 text-zinc-500">Tracked as a research risk signal; inclusion does not imply a legal finding.</p>
            </article>
          ))}
        </div>
      </section>
      <section className="mt-16">
        <p className="text-xs uppercase tracking-[.18em] text-cyan">Research notes</p>
        <h2 className="display mt-3 text-4xl">Analyst observations.</h2>
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {details.researchNotes.map((note, index) => (
            <article className="rounded-2xl border bg-panel p-6" key={note}>
              <span className="text-xs text-zinc-600">RN-{String(index + 1).padStart(2, "0")}</span>
              <p className="mt-5 leading-7 text-zinc-300">{note}</p>
            </article>
          ))}
        </div>
      </section>
      <section id="sources" className="scroll-mt-40 mt-20 grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
        <div>
          <p className="text-xs uppercase tracking-[.18em] text-cyan">Source citations</p>
          <h2 className="display mt-3 text-4xl">Evidence reviewed.</h2>
          <ol className="mt-7 divide-y overflow-hidden rounded-2xl border bg-panel">
            {details.sources.map((source, index) => (
              <li className="flex gap-4 p-5" key={source.title}>
                <FileText className="mt-1 size-4 shrink-0 text-cyan" />
                <span>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring block text-sm font-semibold hover:text-cyan"
                  >
                    {source.title}
                  </a>
                  <span className="mt-1 block text-xs text-zinc-500">
                    {source.publisher} · {source.year} · Accessed {source.accessed} · Source{" "}
                    {index + 1}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[.18em] text-cyan">Related companies</p>
          <div className="mt-7 space-y-3">
            {(industryPeers.length
              ? industryPeers
              : companies.filter((item) => item.slug !== company.slug)
            )
              .slice(0, 3)
              .map((peer) => (
                <Link
                  key={peer.slug}
                  href={`/companies/${peer.slug}`}
                  className="focus-ring flex items-center justify-between rounded-xl border bg-panel p-4 hover:border-cyan/30"
                >
                  <span>
                    <strong className="block">{peer.name}</strong>
                    <small className="text-zinc-500">{peer.industry}</small>
                  </span>
                  <ArrowUpRight className="size-4 text-cyan" />
                </Link>
              ))}
          </div>
        </div>
      </section>
      <section id="news" className="scroll-mt-40 mt-20">
        <p className="text-xs uppercase tracking-[.18em] text-cyan">Recent intelligence</p>
        <h2 className="display mt-3 text-4xl md:text-5xl">News and platform updates.</h2>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {company.recentNews.map((item) => (
            <article key={item.headline} className="premium-card group">
              <span className="text-xs uppercase tracking-wider text-cyan">
                Company update · {item.publishedAt}
              </span>
              <h3 className="mt-5 text-xl font-semibold leading-snug transition group-hover:text-cyan">
                {item.headline}
              </h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{item.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

function Stat({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div>
      <dt className="text-xs text-zinc-600">{label}</dt>
      <dd className="mt-2 truncate font-semibold">
        {href ? (
          <a href={href} target="_blank" rel="noreferrer" className="text-cyan hover:underline">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
