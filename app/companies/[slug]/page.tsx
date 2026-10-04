import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { companies, companyDetails, research } from "@/lib/data";
import { Badge, Score } from "@/components/ui/primitives";
import { InteractiveLineChart, InteractiveRadarChart } from "@/components/impact/charts";
import { pageMetadata, serializeJsonLd, siteUrl } from "@/lib/metadata";
import { ProfileActions } from "@/components/impact/profile-actions";
import {
  ArrowUpRight,
  CheckCircle2,
  CircleAlert,
  ExternalLink,
  FileText,
  UserRound,
} from "lucide-react";
import { ActivityTracker } from "@/components/member/activity-tracker";
import { ReadingProgress } from "@/components/impact/research-tools";
import { CompanyLogo } from "@/components/impact/company-logo";
import { average, calculateIndustryStats } from "@/lib/industry-data";
import { analystObservations, companyRiskAnalysis } from "@/lib/company-intelligence";
import { CompanyRiskAnalysis } from "@/components/impact/company-risk-analysis";
import { currentResearchCycle, previousResearchCycle } from "@/data/research-cycles";
import { rankCompanies } from "@/lib/scoring";

// The expanded index contains 500+ detailed reports. Render profiles on demand
// instead of materializing every chart-heavy page during each deployment.
export const dynamic = "force-dynamic";

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
  const industryStats = calculateIndustryStats(companies, company.industry);
  const industryAverage = industryStats.averageScore ?? company.score;
  const industryRank =
    [...companies]
      .filter((item) => item.industry === company.industry)
      .sort((a, b) => b.score - a.score)
      .findIndex((item) => item.slug === company.slug) + 1;
  const impactRank = rankCompanies(companies).find((item) => item.company.slug === company.slug)!.rank;
  const industryMembers = companies.filter((item) => item.industry === company.industry);
  const pillarBenchmarks = Object.keys(company.pillars).map((pillar) => ({
    pillar,
    company: company.pillars[pillar as keyof typeof company.pillars],
    industry:
      average(industryMembers.map((item) => item.pillars[pillar as keyof typeof item.pillars])) ??
      company.pillars[pillar as keyof typeof company.pillars],
  }));
  const riskAnalysis = companyRiskAnalysis(company, companies);
  const observations = analystObservations(company, companies);
  const relatedArticles = research
    .filter((article) =>
      article.tags.some(
        (tag) =>
          tag.toLowerCase() === company.industry.toLowerCase() ||
          company.industry.toLowerCase().includes(tag.toLowerCase()),
      ),
    )
    .concat(research)
    .filter(
      (article, index, list) => list.findIndex((item) => item.slug === article.slug) === index,
    )
    .slice(0, 3);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${company.name} Corporate Responsibility Profile`,
    description: company.summary,
    url: `${siteUrl}/companies/${company.slug}`,
    dateModified: company.lastReviewed,
    creator: { "@id": `${siteUrl}/#organization` },
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: {
      "@type": "Organization",
      name: company.name,
      tickerSymbol: company.ticker,
      url: company.website,
    },
    variableMeasured: [
      "Corporate responsibility score",
      "Environmental score",
      "Ethics score",
      "Philanthropy score",
      "Financial responsibility score",
    ],
  };
  return (
    <section className="page-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
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
      <div className="mt-6 border-l-2 border-cyan bg-cyan/[.04] px-4 py-3 text-sm text-slate-300">
        <strong className="text-white">
          Research Cycle: {currentResearchCycle.dateLabel} ·{" "}
          {currentResearchCycle.status === "complete" ? "Complete" : "Updating"}
        </strong>
        <span className="mt-1 block text-xs leading-5 text-slate-500">
          Current score published in {previousResearchCycle.dateLabel}. This profile remains under
          evidence review and will not receive a new score until validation is complete.
        </span>
      </div>
      <div className="mt-8 border-y py-8 md:py-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="flex items-start gap-6">
            <CompanyLogo
              name={company.name}
              website={company.website}
              logo={company.logo}
              size="xl"
              priority
              className="shadow-xl shadow-black/20"
            />
            <div>
              <Link
                href={`/industries/${company.industrySlug}`}
                className="focus-ring inline-flex"
                aria-label={`View ${company.industry} industry research`}
              >
                <Badge>{company.industry}</Badge>
              </Link>
              <h1 className="display mt-4 text-4xl md:text-5xl">{company.name}</h1>
              <p className="mt-3 text-zinc-400">
                Fortune #{company.fortuneRank ?? "—"} · {company.ticker} · {company.headquarters}
              </p>
              <dl className="mt-5 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-zinc-500">CEO</dt>
                  <dd className="mt-1 font-medium text-white">{company.executive?.name}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-zinc-500">Founded</dt>
                  <dd className="mt-1 font-medium text-white">
                    {company.founded ?? "Insufficient public information available."}
                  </dd>
                  {company.founding?.modernEstablished && (
                    <dd className="mt-1 text-xs text-zinc-500">
                      Modern company established: {company.founding.modernEstablished}
                    </dd>
                  )}
                </div>
              </dl>
            </div>
          </div>
          <div className="border-l-2 border-cyan pl-6">
            <p className="text-xs uppercase tracking-wider text-zinc-400">CSR score</p>
            <Score score={company.score} grade={company.grade} />
          </div>
        </div>
        <p className="mt-10 text-xs uppercase tracking-[.18em] text-cyan">Executive summary</p>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-300 md:text-xl">
          {company.executiveSummary ?? company.summary}
        </p>
      </div>
      <div className="mt-7">
        <ProfileActions name={company.name} slug={company.slug} />
      </div>
      <nav
        aria-label="Company report sections"
        className="sticky top-[4.4rem] z-20 mt-8 overflow-x-auto border-y bg-ink/95 px-1"
      >
        <div className="flex min-w-max gap-7 py-4 text-sm text-zinc-400">
          {[
            ["performance", "Performance"],
            ["overview", "Overview"],
            ["leadership", "Leadership"],
            ["initiatives", "Initiatives"],
            ["risks", "Risks"],
            ["news", "News"],
            ["sources", "Sources"],
          ].map(([id, label]) => (
            <a key={id} href={`#${id}`} className="focus-ring transition hover:text-cyan">
              {label}
            </a>
          ))}
        </div>
      </nav>
      <section id="overview" className="mt-14 grid scroll-mt-40 gap-5 lg:grid-cols-[1.25fr_.75fr]">
        <article className="surface-card">
          <p className="text-xs uppercase tracking-[.18em] text-cyan">Company overview</p>
          <h2 className="display mt-3 text-3xl">Business context and responsibility.</h2>
          <p className="mt-6 leading-8 text-zinc-300">{company.overview ?? company.summary}</p>
        </article>
        <article id="leadership" className="surface-card scroll-mt-40">
          <p className="text-xs uppercase tracking-[.18em] text-cyan">Executive leadership</p>
          <div className="mt-6 flex items-start gap-4">
            <div className="relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-xl border bg-white/[.04] text-zinc-500">
              {company.executive?.headshot ? (
                <Image
                  src={company.executive.headshot}
                  alt={`Portrait of ${company.executive.name}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                <UserRound className="size-8" aria-hidden="true" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{company.executive?.name}</h2>
              <p className="mt-1 text-sm text-cyan">{company.executive?.title}</p>
              <p className="mt-1 text-xs text-zinc-500">
                {company.executive?.appointedYear
                  ? `Appointed ${company.executive.appointedYear}`
                  : "Appointment year pending verification"}
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-7 text-zinc-400">{company.executive?.biography}</p>
          <div className="mt-5 flex items-center justify-between gap-3 border-t pt-4 text-xs">
            <span
              className={
                company.executive?.status === "verified" ? "text-emerald-400" : "text-amber-400"
              }
            >
              {company.executive?.status === "verified"
                ? "Source verified"
                : "Verification in progress"}
            </span>
            <a
              href={company.executive?.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex items-center gap-1.5 text-cyan hover:text-white"
            >
              Leadership source <ExternalLink className="size-3" />
            </a>
          </div>
        </article>
      </section>
      <div id="performance" className="mt-14 grid scroll-mt-40 gap-5 lg:grid-cols-[1.2fr_.8fr]">
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
        <h2 id="pillar-heading" className="sr-only">
          CSR pillar scores
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Object.entries(company.pillars).map(([pillar, value]) => (
            <article key={pillar} className="surface-card p-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-sm font-semibold text-slate-300">{pillar}</h3>
                <strong className="text-2xl text-cyan">{value}</strong>
              </div>
              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
                <span
                  className="score-fill block h-full rounded-full bg-gradient-to-r from-accent to-cyan"
                  style={{ width: `${value}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-zinc-500">Score out of 100</p>
            </article>
          ))}
        </div>
      </section>
      <dl className="mt-5 grid gap-4 rounded-2xl border bg-panel p-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <Stat label="Ticker" value={company.ticker} />
        <Stat label="CEO" value={company.executive!.name} />
        <Stat
          label="Founded"
          value={
            company.founded !== null
              ? String(company.founded)
              : "Insufficient public information available."
          }
          href={company.founding?.sourceUrl}
        />
        <Stat label="Employees" value={company.employees.toLocaleString()} />
        <Stat label="Revenue" value={`$${company.revenueBillions}B`} />
        <Stat
          label="Market cap"
          value={company.marketCapBillions ? `$${company.marketCapBillions}B` : "Research pending"}
        />
        <Stat label="Industry rank" value={`#${industryRank}`} />
        <Stat label="Impact Horizon rank" value={`#${impactRank}`} />
        <Stat
          label={`Fortune ${company.fortuneRankYear}`}
          value={company.fortuneRank ? `#${company.fortuneRank}` : "Not ranked"}
        />
        <Stat
          label="State"
          value={company.headquarters.split(", ").at(-1) ?? company.headquarters}
        />
        <Stat
          label="Website"
          value={new URL(company.website).hostname.replace("www.", "")}
          href={company.website}
        />
      </dl>
      <p className="mt-3 text-xs text-zinc-500">
        Fortune rank and leadership are displayed with their source year and latest review date.
        Expanded profiles may retain historical structural facts and modeled Impact Horizon
        responsibility values pending analyst review.
      </p>
      <section className="mt-5 grid gap-5 lg:grid-cols-2">
        <article className="surface-card">
          <p className="text-xs uppercase tracking-wider text-cyan">Industry overview</p>
          <h2 className="mt-5 text-2xl font-semibold">
            <Link href={`/industries/${company.industrySlug}`} className="hover:text-cyan">
              {company.industry} responsibility context
            </Link>
          </h2>
          <p className="mt-4 leading-7 text-zinc-400">
            The published {company.industry.toLowerCase()} cohort contains {industryMembers.length}{" "}
            companies with an average CSR score of {industryAverage.toFixed(1)}. Comparisons
            emphasize disclosure quality, verified outcomes, and sector-specific operating risks.
          </p>
        </article>
        <article className="surface-card">
          <p className="text-xs uppercase tracking-wider text-cyan">Competitive position</p>
          <h2 className="mt-5 text-2xl font-semibold">
            Ranked #{industryRank} in its published peer group.
          </h2>
          <p className="mt-4 leading-7 text-zinc-400">
            {company.name} scores {Math.abs(company.score - industryAverage).toFixed(1)} points{" "}
            {company.score >= industryAverage ? "above" : "below"} its industry average. Score and
            rank movement are unavailable until the current review produces a second validated
            cycle snapshot.
          </p>
        </article>
      </section>
      <section className="mt-16">
        <p className="text-xs uppercase tracking-[.18em] text-cyan">Industry benchmarks</p>
        <h2 className="display mt-3 text-4xl">Performance against published peers.</h2>
        <div className="mt-7 overflow-hidden rounded-[1.5rem] border bg-panel">
          {pillarBenchmarks.map((item) => (
            <div
              key={item.pillar}
              className="grid gap-3 border-b p-5 last:border-0 sm:grid-cols-[1fr_2fr_auto] sm:items-center"
            >
              <strong>{item.pillar}</strong>
              <div className="relative h-2 overflow-visible rounded-full bg-white/10">
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent to-cyan"
                  style={{ width: `${item.company}%` }}
                />
                <span
                  className="absolute inset-y-[-3px] w-px bg-white"
                  style={{ left: `${item.industry}%` }}
                />
              </div>
              <span className="text-sm text-zinc-400">
                {item.company} <small>vs {item.industry.toFixed(1)}</small>
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-zinc-500">
          White markers show the published industry average.
        </p>
      </section>
      <section className="mt-16">
        <p className="text-xs uppercase tracking-[.18em] text-cyan">
          Opportunities for improvement
        </p>
        <h2 className="display mt-3 text-4xl">Forward-looking priorities.</h2>
        <p className="mt-4 max-w-3xl leading-7 text-zinc-400">
          These recommendations reflect sector best practices and research priorities. They are
          constructive opportunities, not claims that a program is absent or that current
          performance is deficient.
        </p>
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {company.opportunities?.map((item, index) => (
            <article key={item} className="surface-card flex gap-4">
              <span className="grid size-8 shrink-0 place-items-center rounded-full border border-cyan/30 bg-cyan/10 text-xs font-semibold text-cyan">
                {index + 1}
              </span>
              <p className="leading-7 text-zinc-300">{item}</p>
            </article>
          ))}
        </div>
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
            const milestoneIndex =
              index - (company.historicalScores.length - company.initiatives.length);
            const milestone = milestoneIndex >= 0 ? company.initiatives[milestoneIndex] : undefined;
            return (
              <li key={point.year} className="surface-card">
                <span className="text-xs text-cyan">{point.year}</span>
                <strong className="display mt-4 block text-4xl">{point.score.toFixed(1)}</strong>
                <p className="mt-3 text-sm text-zinc-400">
                  {delta === null
                    ? "Baseline research cycle established."
                    : `${delta >= 0 ? "+" : ""}${delta.toFixed(1)} points from prior cycle.`}
                </p>
                {milestone && (
                  <p className="mt-5 border-t pt-4 text-xs leading-5 text-zinc-500">
                    Milestone: {milestone.title}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      </section>
      <section id="initiatives" className="mt-16 scroll-mt-40">
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
          {!details.initiatives.length && (
            <p className="rounded-2xl border bg-panel p-6 text-zinc-400">
              Insufficient public information available.
            </p>
          )}
        </div>
      </section>
      <CompanyRiskAnalysis
        companyName={company.name}
        profile={riskAnalysis.profile}
        risks={riskAnalysis.risks}
      />
      <section className="mt-16" aria-labelledby="analyst-observations-title">
        <p className="text-xs uppercase tracking-[.18em] text-cyan">Analyst observation</p>
        <h2 id="analyst-observations-title" className="display mt-3 text-4xl">
          Analyst Observations
        </h2>
        <p className="mt-4 max-w-3xl leading-7 text-zinc-400">
          Research-based interpretation of the current Impact Horizon dataset. These observations
          are analytical judgments, not company-reported facts.
        </p>
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {observations.map((observation, index) => (
            <article className="rounded-2xl border bg-panel p-6" key={observation.label}>
              <span className="text-xs text-zinc-600">AO-{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 font-semibold text-cyan">{observation.label}</h3>
              <p className="mt-3 leading-7 text-zinc-300">{observation.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section id="news" className="mt-20 scroll-mt-40">
        <p className="text-xs uppercase tracking-[.18em] text-cyan">Recent intelligence</p>
        <h2 className="display mt-3 text-4xl md:text-5xl">News and platform updates.</h2>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {company.recentNews.map((item) => (
            <article key={item.headline} className="premium-card group">
              <span className="text-xs uppercase tracking-wider text-cyan">
                {item.publication ?? "Company update"} · {item.publishedAt}
              </span>
              <h3 className="mt-5 text-xl font-semibold leading-snug transition group-hover:text-cyan">
                {item.headline}
              </h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{item.summary}</p>
              {item.url && (
                <a
                  href={item.url}
                  target={item.url.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="focus-ring mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan hover:text-white"
                >
                  {item.status === "sample" ? "Research methodology" : "Original source"}
                  <ExternalLink className="size-3.5" />
                </a>
              )}
            </article>
          ))}
          {!company.recentNews.length && (
            <p className="rounded-2xl border bg-panel p-6 text-zinc-400">
              Insufficient public information available.
            </p>
          )}
        </div>
        <div className="mt-12 border-t pt-8">
          <p className="text-xs uppercase tracking-[.18em] text-cyan">Related research articles</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {relatedArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/research/${article.slug}`}
                className="premium-card group"
              >
                <span className="text-xs uppercase tracking-wider text-cyan">
                  {article.category} · {article.read}
                </span>
                <h3 className="mt-5 text-xl font-semibold leading-snug group-hover:text-cyan">
                  {article.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{article.excerpt}</p>
                <span className="mt-5 inline-flex text-sm font-semibold text-cyan">
                  Read more →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section
        id="sources"
        className="mt-20 grid scroll-mt-40 gap-8 border-t pt-12 lg:grid-cols-[1.2fr_.8fr]"
      >
        <div>
          <p className="text-xs uppercase tracking-[.18em] text-cyan">Source citations</p>
          <h2 className="display mt-3 text-4xl">Evidence reviewed.</h2>
          <ol className="mt-7 divide-y overflow-hidden rounded-2xl border bg-panel">
            {[
              ...details.sources,
              ...(company.founding
                ? [
                    {
                      title: company.founding.sourceTitle,
                      publisher: "Open company-history reference",
                      year: company.founding.year,
                      url: company.founding.sourceUrl,
                      accessed: company.founding.verifiedAt,
                    },
                  ]
                : []),
            ].map((source, index) => (
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
        <div className="space-y-10">
          <div>
            <p className="text-xs uppercase tracking-[.18em] text-cyan">Key documents</p>
            <div className="mt-7 space-y-3">
              {company.keyDocuments?.map((document) => (
                <a
                  key={document.title}
                  href={document.url}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring flex items-center justify-between rounded-xl border bg-panel p-4 hover:border-cyan/30"
                >
                  <span>
                    <strong className="block text-sm">{document.title}</strong>
                    <small className="text-zinc-500">
                      {document.publisher} ·{" "}
                      {document.status === "verified"
                        ? "Verified destination"
                        : "Document discovery link"}
                    </small>
                  </span>
                  <ExternalLink className="size-4 text-cyan" />
                </a>
              ))}
            </div>
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
                    <span className="flex items-center gap-3">
                      <CompanyLogo name={peer.name} website={peer.website} logo={peer.logo} />
                      <span>
                        <strong className="block">{peer.name}</strong>
                        <small className="text-zinc-500">{peer.industry}</small>
                      </span>
                    </span>
                    <ArrowUpRight className="size-4 text-cyan" />
                  </Link>
                ))}
            </div>
          </div>
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
