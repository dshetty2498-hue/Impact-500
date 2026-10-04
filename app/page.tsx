import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, Search } from "lucide-react";
import { CompanyLogo } from "@/components/impact/company-logo";
import { GradeBadge } from "@/components/ui/primitives";
import { companies, reports, research, team } from "@/lib/data";
import { pageMetadata } from "@/lib/metadata";
import { calculateAllIndustryStats, formatIndustryNumber } from "@/lib/industry-data";
import { currentResearchCycle } from "@/data/research-cycles";
import { rankCompanies } from "@/lib/scoring";

export const metadata = pageMetadata(
  "Impact Horizon | Corporate responsibility research",
  "Transparent corporate responsibility research across America's largest companies and industries.",
  "/",
);

const primaryResearch = [
  [
    "Full company directory",
    "/leaderboard#company-directory",
    "Search and filter 500+ company research profiles",
  ],
  ["Impact500 ranking", "/leaderboard", "Compare scores, grades, and change"],
  ["Industry research", "/industries", "Understand sector performance and risk"],
  ["Research library", "/research", "Read analysis, briefs, and evidence reviews"],
  ["Compare companies", "/compare", "Compare scores, pillars, and company evidence"],
  ["U.S. headquarters map", "/map", "Explore companies by state, industry, and score"],
] as const;

export default function HomePage() {
  const ranked = rankCompanies(companies).map(({ company }) => company);
  const industryGroups = calculateAllIndustryStats(companies)
    .sort((a, b) => b.companyCount - a.companyCount)
    .slice(0, 5);
  const latestReport = [...reports].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))[0];

  return (
    <>
      <section className="border-b bg-[#0d151e]">
        <div className="mx-auto grid max-w-[88rem] gap-12 px-5 py-16 sm:px-8 md:py-24 lg:grid-cols-[1.35fr_.65fr] lg:items-end xl:px-10">
          <div>
            <p className="editorial-kicker">Independent research institute · 2026 index</p>
            <Link
              href="/research-cycles"
              className="mt-4 inline-flex border-l-2 border-cyan pl-3 text-xs font-semibold uppercase tracking-[.14em] text-cyan"
            >
              Latest Research Cycle: {currentResearchCycle.dateLabel} ·{" "}
              {currentResearchCycle.status === "complete" ? "Complete" : "Updating"}
            </Link>
            <h1 className="display mt-6 max-w-5xl text-5xl leading-[.98] sm:text-6xl lg:text-[5.25rem]">
              Impact Horizon
            </h1>
            <p className="display mt-4 max-w-4xl text-3xl leading-tight text-slate-300 sm:text-4xl">
              Corporate responsibility research, made transparent.
            </p>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-400">
              We turn public disclosures, filings, and reported outcomes into comparable research on
              America&apos;s largest companies—so readers can see the evidence behind every finding.
            </p>
          </div>
          <dl className="grid grid-cols-2 border-y lg:grid-cols-1">
            <Stat value={companies.length.toLocaleString()} label="Company profiles" />
            <Stat
              value={String(new Set(companies.map((company) => company.industry)).size)}
              label="Industries"
            />
            <Stat value="2" label="Versioned research cycles" />
            <Stat value="4" label="Responsibility pillars" />
          </dl>
        </div>
      </section>

      <section className="border-b">
        <div className="mx-auto max-w-[88rem] px-5 py-10 sm:px-8 xl:px-10">
          <Link
            href="/search"
            className="focus-ring group flex min-h-20 items-center border-b-2 border-white/30 text-left hover:border-cyan"
          >
            <Search className="mr-5 size-6 shrink-0 text-cyan" />
            <span className="min-w-0 flex-1 text-lg text-slate-300 sm:text-2xl">
              Search a company, industry, executive, topic, or report
            </span>
            <span className="hidden text-sm font-semibold text-cyan sm:inline">
              Search database
            </span>
          </Link>
          <nav
            className="grid border-b md:grid-cols-2 xl:grid-cols-4"
            aria-label="Primary research"
          >
            {primaryResearch.map(([label, href, description], index) => (
              <Link
                key={href}
                href={href}
                className="group border-b px-0 py-6 md:border-r md:px-5 md:first:pl-0 xl:border-b-0"
              >
                <span className="text-[.68rem] tabular-nums text-slate-600">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <strong className="mt-2 block text-base font-semibold group-hover:text-cyan">
                  {label}
                </strong>
                <span className="mt-2 block text-sm leading-6 text-slate-500">{description}</span>
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="section-shell">
        <SectionHeader
          number="01"
          kicker="Current findings"
          title="What the latest research shows"
          description="A concise reading of the current index. Findings are directional and should be interpreted alongside source quality and methodology notes."
          href="/insights"
          linkLabel="Read all insights"
        />
        <div className="mt-12 divide-y border-y">
          <Finding
            number="01"
            title={`${ranked[0].name} leads the published index`}
            text={`Its modeled score of ${ranked[0].score.toFixed(1)} is the strongest in the current research universe, with performance evaluated across four responsibility pillars.`}
            href={`/companies/${ranked[0].slug}`}
          />
          <Finding
            number="02"
            title={`${currentResearchCycle.dateLabel} review is underway`}
            text="Score and rank movement will remain unavailable until two validated, versioned publication snapshots exist. Synthetic historical movement is not used."
            href="/research-cycles"
          />
          <Finding
            number="03"
            title="Disclosure quality remains uneven"
            text="The index distinguishes missing evidence from negative evidence and makes verification status visible rather than rewarding disclosure volume alone."
            href="/methodology"
          />
        </div>
      </section>

      <section className="border-y bg-[#0d151e]">
        <div className="section-shell">
          <SectionHeader
            number="02"
            kicker="Impact500 ranking"
            title="Leading companies"
            description="A scannable view of the highest published scores. Open a company profile for the full evidence record, history, and limitations."
            href="/leaderboard"
            linkLabel="View full leaderboard"
          />
          <div className="mt-10 overflow-x-auto border-t">
            <table className="w-full min-w-[46rem] text-left">
              <thead className="border-b text-[.68rem] uppercase tracking-[.14em] text-slate-500">
                <tr>
                  <th className="py-4 pr-4 font-semibold">Rank</th>
                  <th className="py-4 pr-4 font-semibold">Company</th>
                  <th className="py-4 pr-4 font-semibold">CEO</th>
                  <th className="py-4 pr-4 font-semibold">Industry</th>
                  <th className="py-4 pr-4 font-semibold">Headquarters</th>
                  <th className="py-4 pr-4 text-right font-semibold">Score</th>
                  <th className="py-4 text-right font-semibold">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {ranked.slice(0, 6).map((company, index) => (
                  <tr key={company.slug} className="group hover:bg-white/[.025]">
                    <td className="py-4 pr-4 text-sm tabular-nums text-slate-500">
                      {String(index + 1).padStart(2, "0")}
                    </td>
                    <td className="py-4 pr-4">
                      <Link
                        href={`/companies/${company.slug}`}
                        className="flex items-center gap-3 font-semibold group-hover:text-cyan"
                      >
                        <CompanyLogo
                          name={company.name}
                          website={company.website}
                          logo={company.logo}
                        />
                        {company.name}
                      </Link>
                    </td>
                    <td className="py-4 pr-4 text-sm text-slate-300">{company.executive?.name}</td>
                    <td className="py-4 pr-4 text-sm text-slate-400">
                      <Link
                        href={`/industries/${company.industrySlug}`}
                        className="hover:text-cyan hover:underline"
                      >
                        {company.industry}
                      </Link>
                    </td>
                    <td className="py-4 pr-4 text-sm text-slate-400">{company.headquarters}</td>
                    <td className="py-4 pr-4 text-right text-lg font-semibold tabular-nums">
                      {company.score.toFixed(1)}
                    </td>
                    <td className="py-4 text-right">
                      <GradeBadge score={company.score} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <SectionHeader
          number="03"
          kicker="Sector intelligence"
          title="Industry signals"
          description="Sector context matters. These summaries show cohort size, average performance, and the current leader without collapsing different operating realities into one story."
          href="/industries"
          linkLabel="Explore industries"
        />
        <div className="mt-10 divide-y border-y">
          {industryGroups.map((group) => (
            <Link
              key={group.slug}
              href={`/industries/${group.slug}`}
              className="grid gap-3 py-5 hover:bg-white/[.02] sm:grid-cols-[1.5fr_.55fr_.55fr_1fr] sm:items-center"
            >
              <strong className="text-lg">{group.name}</strong>
              <span className="text-sm text-slate-500">{group.companyCount} companies</span>
              <span className="text-sm tabular-nums text-slate-300">
                {formatIndustryNumber(group.averageScore)} average
              </span>
              <span className="text-sm text-slate-400 sm:text-right">
                Leader:{" "}
                <span className="text-slate-200">{group.leader?.name ?? "Data unavailable"}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y bg-[#0d151e]">
        <div className="section-shell">
          <SectionHeader
            number="04"
            kicker="Latest research"
            title="Analysis and evidence reviews"
            description="Long-form research designed to be read, cited, and challenged."
            href="/research"
            linkLabel="Open research library"
          />
          <div className="mt-12 grid gap-8 lg:grid-cols-[1.35fr_.65fr]">
            {research[0] && (
              <Link
                href={`/research/${research[0].slug}`}
                className="group border-b pb-8 lg:border-b-0"
              >
                <div className="relative aspect-[16/8] overflow-hidden bg-panel">
                  <Image
                    src={research[0].cover}
                    fill
                    priority
                    sizes="(max-width:1024px) 100vw, 65vw"
                    style={{ objectPosition: research[0].coverPosition }}
                    className="object-cover opacity-80 transition group-hover:opacity-100"
                    alt={`Cover for ${research[0].title}`}
                  />
                </div>
                <p className="editorial-kicker mt-6">
                  {research[0].category} · {research[0].date}
                </p>
                <h3 className="display mt-3 max-w-4xl text-3xl leading-tight group-hover:text-cyan md:text-4xl">
                  {research[0].title}
                </h3>
                <p className="mt-4 max-w-3xl leading-7 text-slate-400">{research[0].excerpt}</p>
              </Link>
            )}
            <div className="divide-y border-y lg:border-t-0">
              {research.slice(1, 4).map((article) => (
                <Link
                  href={`/research/${article.slug}`}
                  key={article.slug}
                  className="group block py-6 first:pt-0"
                >
                  <p className="text-[.68rem] uppercase tracking-wider text-cyan">
                    {article.category} · {article.read}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold leading-snug group-hover:text-cyan">
                    {article.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500">{article.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="grid gap-10 border-y py-10 lg:grid-cols-[.72fr_1.28fr] lg:items-center">
          <div className="relative aspect-[4/5] max-h-[34rem] overflow-hidden bg-panel">
            <Image
              src={latestReport.cover}
              fill
              sizes="(max-width:1024px) 100vw, 35vw"
              className="object-cover"
              alt={`${latestReport.title} cover`}
            />
          </div>
          <div>
            <p className="editorial-kicker">Annual report · {latestReport.year}</p>
            <h2 className="display mt-5 text-4xl leading-tight md:text-5xl">
              {latestReport.title}
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              {latestReport.summary}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={latestReport.href} className="button-primary">
                Read the report <ArrowRight className="size-4" />
              </Link>
              <a href={latestReport.pdf} download className="button-secondary">
                Download PDF <Download className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-[#0d151e]">
        <div className="section-shell grid gap-12 lg:grid-cols-2">
          <div>
            <p className="editorial-kicker">Methodology</p>
            <h2 className="display mt-5 text-4xl leading-tight">
              The score is only the beginning.
            </h2>
            <p className="mt-5 max-w-xl leading-8 text-slate-400">
              Impact Horizon documents scope, evidence standards, weighting, validation, and
              limitations. Readers can see where the model is strong—and where judgment remains.
            </p>
            <Link href="/methodology" className="link-arrow mt-7">
              Review the methodology <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="border-t pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
            <p className="editorial-kicker">Research team</p>
            <h2 className="display mt-5 text-4xl leading-tight">Research has authors.</h2>
            <p className="mt-5 max-w-xl leading-8 text-slate-400">
              Meet the {team.length}-person team responsible for evidence review, industry coverage,
              methodology development, and publication standards.
            </p>
            <Link href="/team" className="link-arrow mt-7">
              Meet the research team <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-b px-0 py-4 last:border-b-0 lg:grid lg:grid-cols-[6rem_1fr] lg:items-baseline">
      <dt className="display text-2xl text-white">{value}</dt>
      <dd className="mt-1 text-xs uppercase tracking-wider text-slate-500 lg:mt-0">{label}</dd>
    </div>
  );
}

function SectionHeader({
  number,
  kicker,
  title,
  description,
  href,
  linkLabel,
}: {
  number: string;
  kicker: string;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <header className="grid gap-5 border-t pt-6 lg:grid-cols-[5rem_1fr_1fr]">
      <span className="text-xs tabular-nums text-slate-600">{number}</span>
      <div>
        <p className="editorial-kicker">{kicker}</p>
        <h2 className="display mt-4 text-3xl leading-tight md:text-4xl">{title}</h2>
      </div>
      <div className="lg:pt-7">
        <p className="max-w-xl leading-7 text-slate-400">{description}</p>
        <Link href={href} className="link-arrow mt-5">
          {linkLabel} <ArrowRight className="size-4" />
        </Link>
      </div>
    </header>
  );
}

function Finding({
  number,
  title,
  text,
  href,
}: {
  number: string;
  title: string;
  text: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group grid gap-4 py-7 md:grid-cols-[5rem_.8fr_1.2fr_auto] md:items-start"
    >
      <span className="text-xs tabular-nums text-cyan">{number}</span>
      <h3 className="text-xl font-semibold leading-snug group-hover:text-cyan">{title}</h3>
      <p className="max-w-2xl leading-7 text-slate-400">{text}</p>
      <ArrowRight className="mt-1 hidden size-4 text-slate-600 md:block" />
    </Link>
  );
}
