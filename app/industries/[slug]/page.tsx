import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { industries, companies, methodologySections, news, reports, research } from "@/lib/data";
import {
  InteractiveBarChart,
  InteractiveLineChart,
  InteractivePieChart,
  InteractiveRadarChart,
} from "@/components/impact/charts";
import { pageMetadata } from "@/lib/metadata";
import { IndustryActions } from "@/components/impact/industry-actions";
import { CompanyLogo } from "@/components/impact/company-logo";
import { GradeBadge } from "@/components/ui/primitives";
import {
  IndustryCompanyDirectory,
  IndustryTrendExplorer,
} from "@/components/impact/industry-tools";
import { calculateIndustryStats, formatIndustryNumber, validNumber } from "@/lib/industry-data";
import { companyRiskAnalysis, industryRiskLandscape } from "@/lib/company-intelligence";
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
  const stats = calculateIndustryStats(companies, industry.name);
  const members = stats.companies;
  if (!members.length) notFound();
  const mostImproved = stats.mostImproved;
  const pillarAverage = (key: keyof (typeof members)[number]["pillars"]) =>
    stats.pillarAverages[key];
  const founded = members.filter((company) => company.founded);
  const largestEmployer = [...members]
    .filter((company) => validNumber(company.employees) && company.employees > 0)
    .sort((a, b) => b.employees - a.employees)[0];
  const highestRevenue = [...members]
    .filter((company) => validNumber(company.revenueBillions) && company.revenueBillions > 0)
    .sort((a, b) => b.revenueBillions - a.revenueBillions)[0];
  const scoreDistribution = [
    { name: "A (90–100)", value: members.filter((company) => company.score >= 90).length },
    {
      name: "B (80–89)",
      value: members.filter((company) => company.score >= 80 && company.score < 90).length,
    },
    {
      name: "C (70–79)",
      value: members.filter((company) => company.score >= 70 && company.score < 80).length,
    },
    {
      name: "D (60–69)",
      value: members.filter((company) => company.score >= 60 && company.score < 70).length,
    },
    { name: "F (below 60)", value: members.filter((company) => company.score < 60).length },
  ].filter((item) => item.value);
  const states = Object.entries(
    members.reduce<Record<string, number>>((result, company) => {
      const state = company.headquarters.split(", ").at(-1) ?? "Other";
      result[state] = (result[state] ?? 0) + 1;
      return result;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);
  const articles = research.filter((article) =>
    article.tags.some((tag) => tag.toLowerCase() === industry.name.toLowerCase()),
  );
  const relatedNews = news.filter((item) => item.industrySlug === industry.slug);
  const pillarChartData = [
    { subject: "Environment", value: stats.pillarAverages.Environmental },
    { subject: "Ethics", value: stats.pillarAverages.Ethics },
    { subject: "Philanthropy", value: stats.pillarAverages.Philanthropy },
    { subject: "Financial", value: stats.pillarAverages["Financial responsibility"] },
  ];
  const hasPillarData = pillarChartData.every((item) => validNumber(item.value));
  const strongestPillar = Object.entries(stats.pillarAverages)
    .filter((entry): entry is [string, number] => validNumber(entry[1]))
    .sort((a, b) => b[1] - a[1])[0];
  const riskLandscape = industryRiskLandscape(members, companies);
  const industryRiskSources = [
    ...new Map(
      members
        .flatMap((company) => companyRiskAnalysis(company, companies).risks)
        .map((risk) => [risk.source.url, risk.source]),
    ).values(),
  ];
  const sources = [
    ...new Map(
      members.flatMap((company) => company.sources).map((source) => [source.url, source]),
    ).values(),
  ];
  return (
    <section className="page-shell">
      <Link href="/industries" className="text-sm text-cyan">
        ← All industries
      </Link>
      <p className="mt-10 text-xs uppercase tracking-[.18em] text-cyan">Industry research</p>
      <h1 className="display mt-4 text-5xl md:text-6xl">{industry.name}</h1>
      <p className="mt-6 max-w-3xl text-xl leading-8 text-zinc-300">{industry.description}</p>
      <IndustryActions slug={industry.slug} name={industry.name} />
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <Link href="/insights" className="text-cyan hover:underline">
          View Industry Insights →
        </Link>
        <Link href="/leaderboard" className="text-cyan hover:underline">
          Compare this industry →
        </Link>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Fortune 500 companies" value={String(members.length)} />
        <Metric label="Average CSR score" value={formatIndustryNumber(stats.averageScore)} />
        <Metric label="Highest CSR score" value={formatIndustryNumber(stats.highestScore)} />
        <Metric label="Lowest CSR score" value={formatIndustryNumber(stats.lowestScore)} />
        <Metric label="Median CSR score" value={formatIndustryNumber(stats.medianScore)} />
        <Metric
          label="Environmental average"
          value={formatIndustryNumber(pillarAverage("Environmental"))}
        />
        <Metric label="Ethics average" value={formatIndustryNumber(pillarAverage("Ethics"))} />
        <Metric
          label="Philanthropy average"
          value={formatIndustryNumber(pillarAverage("Philanthropy"))}
        />
        <Metric
          label="Financial responsibility"
          value={formatIndustryNumber(pillarAverage("Financial responsibility"))}
        />
        <Metric label="Governance average" value="Data unavailable" />
        <Metric label="Top-ranked company" value={stats.leader?.name ?? "Data unavailable"} />
        <Metric label="Most improved company" value={mostImproved?.name ?? "Data unavailable"} />
        <Metric
          label="Average year founded"
          value={
            founded.length
              ? String(
                  Math.round(
                    founded.reduce((sum, company) => sum + (company.founded ?? 0), 0) /
                      founded.length,
                  ),
                )
              : "Data unavailable"
          }
        />
        <Metric label="Largest employer" value={largestEmployer?.name ?? "Data unavailable"} />
        <Metric label="Highest revenue" value={highestRevenue?.name ?? "Data unavailable"} />
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-500">
        Governance is discussed in qualitative research but is not a separately scored pillar in the
        current Impact Horizon dataset, so no governance average is reported.
      </p>
      {stats.leader && (
        <Link
          href={`/companies/${stats.leader.slug}`}
          className="premium-card group mt-8 flex flex-col gap-5 sm:flex-row sm:items-center"
        >
          <CompanyLogo
            name={stats.leader.name}
            website={stats.leader.website}
            logo={stats.leader.logo}
            size="xl"
          />
          <span className="min-w-0 flex-1">
            <span className="text-xs uppercase tracking-wider text-cyan">
              Current industry leader
            </span>
            <strong className="display mt-2 block text-3xl group-hover:text-cyan">
              {stats.leader.name}
            </strong>
            <span className="mt-3 block text-sm text-slate-400">
              Fortune #{stats.leader.fortuneRank} · {stats.leader.headquarters}
            </span>
          </span>
          <span className="flex items-center gap-4">
            <strong className="display text-3xl text-cyan">{stats.leader.score.toFixed(1)}</strong>
            <GradeBadge score={stats.leader.score} />
          </span>
        </Link>
      )}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="surface-card">
          <InteractiveBarChart
            title="Company ranking"
            data={members.map((company) => ({ label: company.name, score: company.score }))}
            series={[{ key: "score", label: "CSR score" }]}
          />
        </div>
        <div className="surface-card">
          {stats.trend.length ? (
            <InteractiveLineChart
              area
              title="Industry score trend"
              data={stats.trend.map((point) => ({ label: String(point.year), score: point.score }))}
              series={[{ key: "score", label: "Industry average" }]}
            />
          ) : (
            <DataUnavailable message="Historical data unavailable" />
          )}
        </div>
      </div>
      <div className="mt-16">
        <IndustryTrendExplorer companies={members} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="surface-card">
          {hasPillarData ? (
            <InteractiveRadarChart
              title="Responsibility profile"
              data={pillarChartData as { subject: string; value: number }[]}
            />
          ) : (
            <DataUnavailable message="Pillar data is unavailable for this industry." />
          )}
        </div>
        <div className="surface-card">
          <InteractivePieChart title="Score distribution" data={scoreDistribution} />
        </div>
        <div className="surface-card">
          <InteractiveBarChart
            title="Headquarters distribution"
            data={states.slice(0, 10).map(([label, count]) => ({ label, count }))}
            series={[{ key: "count", label: "Companies" }]}
            domain={[0, Math.max(...states.map(([, count]) => count), 1)]}
          />
        </div>
      </div>
      <div className="mt-16">
        <IndustryCompanyDirectory companies={members} />
      </div>
      <section
        className="mt-16 grid gap-8 lg:grid-cols-2"
        aria-labelledby="industry-overview-title"
      >
        <article className="surface-card">
          <p className="text-xs uppercase tracking-wider text-cyan">Industry overview</p>
          <h2 id="industry-overview-title" className="display mt-3 text-4xl">
            How the sector operates
          </h2>
          <div className="mt-5 space-y-5 leading-7 text-slate-300">
            <p>
              <strong>What it does.</strong> {industry.description}
            </p>
            <p>
              <strong>Economic importance.</strong> The published Fortune 500 cohort includes{" "}
              {members.length} companies, led by{" "}
              {members
                .slice(0, 3)
                .map((company) => company.name)
                .join(", ")}
              . Their scale connects the sector to employment, investment, supply chains, customers,
              and communities.
            </p>
            <p>
              <strong>Responsibility challenges.</strong> Current research priorities include{" "}
              {industry.keyIssues.join(", ").toLowerCase()}.
            </p>
            <p>
              <strong>Current trends and future outlook.</strong> {industry.outlook}
            </p>
            <p>
              <strong>Regulation and emerging technology.</strong> Requirements vary by market and
              company. Impact Horizon evaluates public evidence rather than providing a universal
              regulatory conclusion; company filings and current regulator guidance should be
              reviewed for specific obligations.
            </p>
          </div>
        </article>
        <article className="surface-card">
          <p className="text-xs uppercase tracking-wider text-cyan">
            Data · analysis · interpretation
          </p>
          <h2 className="display mt-3 text-4xl">Why the score looks this way</h2>
          <dl className="mt-6 space-y-5">
            <div>
              <dt className="font-semibold text-cyan">Data</dt>
              <dd className="mt-2 leading-7 text-slate-300">
                The cohort average is {formatIndustryNumber(stats.averageScore)} across{" "}
                {members.length} scored companies. The strongest available average pillar is{" "}
                {strongestPillar?.[0] ?? "data unavailable"}.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-cyan">Analysis</dt>
              <dd className="mt-2 leading-7 text-slate-300">
                The spread from {formatIndustryNumber(stats.lowestScore)} to{" "}
                {formatIndustryNumber(stats.highestScore)} indicates that company-level evidence and
                implementation differ within the same operating context.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-cyan">Interpretation</dt>
              <dd className="mt-2 leading-7 text-slate-300">
                Sector averages are useful benchmarks, not verdicts. Readers should examine pillar
                scores, disclosures, sources, and company circumstances before drawing conclusions.
              </dd>
            </div>
          </dl>
        </article>
      </section>
      <section className="mt-16" aria-labelledby="industry-risk-title">
        <p className="text-xs uppercase tracking-wider text-amber-300">Impact Horizon analysis</p>
        <h2 id="industry-risk-title" className="display mt-3 text-4xl">
          Industry Risk Landscape
        </h2>
        <p className="mt-4 max-w-3xl leading-7 text-slate-400">
          Categories are generated from the same company records used above. They identify
          sector-relevant exposure and peer-position signals—not incidents, allegations, or changes
          to company CSR scores.
        </p>
        <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_1fr]">
          <article className="surface-card">
            <h3 className="text-xl font-semibold">Most common risk categories</h3>
            <div className="mt-5 space-y-4">
              {riskLandscape.common.map((risk) => (
                <div key={risk.category}>
                  <div className="flex justify-between gap-4 text-sm">
                    <span>{risk.category}</span>
                    <span className="text-cyan">
                      {risk.count} companies · {risk.share}%
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <span className="block h-full bg-cyan" style={{ width: `${risk.share}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </article>
          <article className="surface-card">
            <h3 className="text-xl font-semibold">Companies with elevated modeled exposure</h3>
            {riskLandscape.exposed.length ? (
              <div className="mt-5 space-y-3">
                {riskLandscape.exposed.map(({ company, analysis }) => (
                  <Link
                    key={company.slug}
                    href={`/companies/${company.slug}#risks`}
                    className="flex items-center justify-between gap-4 border-b pb-3 text-sm last:border-0"
                  >
                    <span>{company.name}</span>
                    <span className="text-amber-300">{analysis.profile} Risk</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-sm text-slate-400">No elevated peer signals were identified.</p>
            )}
          </article>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <article className="surface-card">
            <h3 className="text-xl font-semibold">Industry-wide and emerging risks</h3>
            <p className="mt-4 leading-7 text-slate-400">
              The most persistent shared categories are{" "}
              {riskLandscape.common
                .slice(0, 3)
                .map((item) => item.category)
                .join(", ")}
              . Cyber resilience, changing disclosure expectations, workforce capability, and
              value-chain traceability remain areas to monitor where they appear in company profiles.
            </p>
            <p className="mt-4 text-sm leading-6 text-slate-500">
              Potential CSR implication: weak controls can affect Environmental, Ethics,
              Philanthropy, or Financial Responsibility evidence, but exposure alone is never used
              as an automatic score deduction.
            </p>
          </article>
          <article className="surface-card">
            <h3 className="text-xl font-semibold">Supporting risk references</h3>
            <ul className="mt-4 space-y-3">
              {industryRiskSources.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-cyan hover:text-white"
                  >
                    {source.title} · {source.organization} ↗
                  </a>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
      <section className="mt-16" aria-labelledby="industry-analyst-title">
        <p className="text-xs uppercase tracking-wider text-cyan">Analyst observation</p>
        <h2 id="industry-analyst-title" className="display mt-3 text-4xl">
          Analyst Observations
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Observation
            title="Why the average looks this way"
            text={`The ${formatIndustryNumber(stats.averageScore)} average reflects ${members.length} company records. ${strongestPillar ? `${strongestPillar[0]} is the strongest aggregate pillar at ${formatIndustryNumber(strongestPillar[1])}.` : "Pillar data is unavailable."}`}
          />
          <Observation
            title="Major strength"
            text={
              stats.leader
                ? `${stats.leader.name} sets the current peer benchmark at ${formatIndustryNumber(stats.leader.score)}, showing the upper end of disclosed performance in this cohort.`
                : "Insufficient public information available."
            }
          />
          <Observation
            title="Major weakness"
            text={`The ${formatIndustryNumber(stats.highestScore)}–${formatIndustryNumber(stats.lowestScore)} score range signals uneven evidence and implementation across companies.`}
          />
          <Observation
            title="Notable company differences"
            text={`The median is ${formatIndustryNumber(stats.medianScore)}. Company-level profiles should be reviewed because the average can obscure material pillar differences.`}
          />
          <Observation
            title="Emerging trend"
            text={
              stats.trend.length > 1
                ? `The published industry series moved from ${formatIndustryNumber(stats.trend[0].score)} to ${formatIndustryNumber(stats.trend.at(-1)?.score ?? null)} across available research cycles.`
                : "Historical data unavailable."
            }
          />
          <Observation
            title="Area to monitor"
            text={`${riskLandscape.common[0]?.category ?? "Risk evidence"} is the most common modeled exposure. Readers should follow the linked company and public sources for evidence updates.`}
          />
        </div>
      </section>
      <section className="mt-16" aria-labelledby="opportunities-title">
        <p className="text-xs uppercase tracking-wider text-cyan">Constructive priorities</p>
        <h2 id="opportunities-title" className="display mt-3 text-4xl">
          Opportunities for improvement
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            "Improve supply-chain transparency and publish measurable supplier outcomes.",
            "Increase comparable emissions and resource-use disclosure with consistent baselines.",
            "Strengthen workforce development reporting and connect programs to outcomes.",
            "Clarify board oversight, ethics controls, and responsibility governance.",
            "Report community investment outcomes in addition to spending or activity totals.",
          ].map((opportunity) => (
            <p
              key={opportunity}
              className="rounded-xl border bg-panel p-5 text-sm leading-6 text-slate-300"
            >
              {opportunity}
            </p>
          ))}
        </div>
      </section>
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
      <section className="mt-14" aria-labelledby="connected-research-title">
        <p className="text-xs uppercase tracking-wider text-cyan">Connected research</p>
        <h2 id="connected-research-title" className="display mt-3 text-4xl">
          Continue the evidence trail
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reports.slice(0, 2).map((report) => (
            <Link key={report.slug} href={report.href} className="premium-card">
              <strong>{report.title}</strong>
              <span className="mt-2 block text-sm text-slate-400">
                Annual report and publication
              </span>
            </Link>
          ))}
          {relatedNews.slice(0, 2).map((item) => (
            <Link key={item.slug} href={`/news/${item.slug}`} className="premium-card">
              <strong>{item.headline}</strong>
              <span className="mt-2 block text-sm text-slate-400">Recent industry news</span>
            </Link>
          ))}
          {methodologySections.slice(0, 2).map((item) => (
            <Link key={item.slug} href={`/methodology#${item.slug}`} className="premium-card">
              <strong>{item.title}</strong>
              <span className="mt-2 block text-sm text-slate-400">Methodology reference</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="mt-14 border-t pt-10" aria-labelledby="industry-sources-title">
        <p className="text-xs uppercase tracking-wider text-cyan">Sources</p>
        <h2 id="industry-sources-title" className="display mt-3 text-4xl">
          Evidence used in this cohort
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-400">
          Industry statistics are calculated from the company records above. The underlying source
          citations remain attached to each company record and update with the shared dataset.
        </p>
        <ul className="mt-6 grid gap-3 md:grid-cols-2">
          {sources.slice(0, 20).map((source) => (
            <li key={source.url} className="rounded-xl border bg-panel p-4 text-sm">
              <a
                href={source.url}
                className="font-semibold hover:text-cyan"
                target={source.url.startsWith("http") ? "_blank" : undefined}
                rel={source.url.startsWith("http") ? "noreferrer" : undefined}
              >
                {source.title}
              </a>
              <span className="mt-1 block text-xs text-slate-500">
                {source.publisher} · {source.year}
              </span>
            </li>
          ))}
        </ul>
      </section>
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

function DataUnavailable({ message }: { message: string }) {
  return (
    <div
      className="grid min-h-64 place-items-center text-center text-sm text-slate-400"
      role="status"
    >
      {message}
    </div>
  );
}

function Observation({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-xl border bg-panel p-5">
      <h3 className="font-semibold text-cyan">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
    </article>
  );
}
