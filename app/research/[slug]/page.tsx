import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { publications, companies, industries, team } from "@/lib/data";
import { articleMetadata, serializeJsonLd, siteUrl } from "@/lib/metadata";
import { ReadingProgress, ResearchActions } from "@/components/impact/research-tools";
import { CompanyLogo } from "@/components/impact/company-logo";
import { GradeBadge } from "@/components/ui/primitives";
import { InteractiveBarChart, InteractiveRadarChart } from "@/components/impact/charts";
import { average } from "@/lib/industry-data";

export function generateStaticParams() {
  return publications.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = publications.find((item) => item.slug === slug);
  return article
    ? articleMetadata(article.title, article.excerpt, `/research/${article.slug}`, {
        authors: [article.author],
        image: article.cover,
        publishedTime: article.publishedAt,
      })
    : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = publications.find((item) => item.slug === slug);
  if (!article) notFound();
  const articleIndex = publications.findIndex((item) => item.slug === slug);
  const previous = publications[(articleIndex - 1 + publications.length) % publications.length];
  const next = publications[(articleIndex + 1) % publications.length];
  const author = team.find((member) => member.name === article.author);
  const related = article.related
    .map((itemSlug) => publications.find((item) => item.slug === itemSlug))
    .filter((item): item is (typeof publications)[number] => Boolean(item));
  const relatedReports = publications
    .filter((item) => item.isReport && item.slug !== article.slug)
    .slice(0, 2);
  const relatedCompanies = article.companySlugs
    .map((itemSlug) => companies.find((company) => company.slug === itemSlug))
    .filter((company): company is (typeof companies)[number] => Boolean(company));
  const relatedIndustries = article.industrySlugs
    .map((itemSlug) => industries.find((industry) => industry.slug === itemSlug))
    .filter((industry): industry is (typeof industries)[number] => Boolean(industry));
  const pillarData = ["Environmental", "Financial responsibility", "Philanthropy", "Ethics"].map(
    (pillar) => ({
      subject: pillar === "Financial responsibility" ? "Financial" : pillar,
      value: average(
        relatedCompanies.map((company) => company.pillars[pillar as keyof typeof company.pillars]),
      )!,
    }),
  );
  const sourceCategories = [...new Set(article.sources.map((source) => source.category))];
  const citation = `${article.author}. (${article.publishedAt.slice(0, 4)}). ${article.title}. Impact Horizon.`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": article.isReport ? "Report" : "Article",
    headline: article.title,
    description: article.excerpt,
    image: `${siteUrl}${article.cover}`,
    datePublished: article.publishedAt,
    author: { "@type": article.isReport ? "Organization" : "Person", name: article.author },
    publisher: { "@id": `${siteUrl}/#organization` },
    mainEntityOfPage: `${siteUrl}/research/${article.slug}`,
  };

  return (
    <article className="overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <ReadingProgress />
      <header className="grid-bg border-b bg-gradient-to-br from-[#0a2233] via-ink to-[#07131f]">
        <div className="page-shell pb-14 pt-10 md:pb-20">
          <Link href="/research" className="text-sm text-cyan">
            ← Back to Research
          </Link>
          <div className="mt-10 grid items-end gap-10 xl:grid-cols-[minmax(0,1fr)_28rem]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.22em] text-cyan">
                {article.type} · {article.date} · {article.read} read
              </p>
              <h1 className="display mt-6 max-w-5xl text-5xl leading-[.98] md:text-7xl">
                {article.title}
              </h1>
              <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300 md:text-2xl">
                {article.excerpt}
              </p>
              <p className="mt-6 text-sm text-slate-500">
                By {article.author} · {article.category} · {article.readingLevel}
              </p>
              <div className="mt-7">
                <ResearchActions slug={article.slug} title={article.title} />
              </div>
            </div>
            <figure>
              <div className="relative aspect-[4/3] overflow-hidden border shadow-2xl shadow-black/30">
                <Image
                  src={article.cover}
                  fill
                  priority
                  sizes="(max-width: 1280px) 100vw, 448px"
                  style={{ objectPosition: article.coverPosition }}
                  className="object-cover"
                  alt={`Research cover for ${article.title}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent to-transparent" />
              </div>
              <figcaption className="mt-3 text-xs leading-5 text-slate-500">
                Editorial research visual supporting {article.category.toLowerCase()} analysis.
              </figcaption>
            </figure>
          </div>
        </div>
      </header>

      <div className="page-shell">
        <details className="border-y py-5 xl:hidden">
          <summary className="cursor-pointer font-semibold text-cyan">Table of contents</summary>
          <TableOfContents article={article} className="mt-5" />
        </details>
        <div className="grid gap-14 xl:grid-cols-[minmax(0,1fr)_19rem]">
          <main className="min-w-0">
            <section className="border-b py-14" aria-labelledby="research-design">
              <p className="text-xs uppercase tracking-[.2em] text-cyan">At a glance</p>
              <h2 id="research-design" className="display mt-4 text-4xl">
                Research design
              </h2>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                <Summary label="Research question" value={article.researchQuestion} />
                <Summary label="Scope" value={article.scope} />
                <Summary label="Data rule" value={article.methodologyNote} />
              </div>
            </section>

            <div className="editorial-copy max-w-4xl text-lg leading-9 text-slate-300 md:text-xl">
              {article.sections.map((section, index) => (
                <section
                  id={`section-${index + 1}`}
                  className="scroll-mt-28 border-b py-14"
                  key={section.heading}
                >
                  <p className="text-xs font-semibold uppercase tracking-[.2em] text-cyan">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="display mt-4 text-3xl text-white md:text-5xl">
                    {section.heading}
                  </h2>
                  <div className="mt-7 space-y-6">
                    {section.body.split("\n\n").map((paragraph) => (
                      <p key={paragraph.slice(0, 56)}>{paragraph}</p>
                    ))}
                  </div>
                  {index === 1 && (
                    <blockquote className="my-12 border-l-4 border-cyan pl-7 text-2xl font-medium leading-10 text-white md:text-3xl">
                      {article.thesis}
                      <footer className="mt-4 text-sm font-normal uppercase tracking-wider text-cyan">
                        Impact Horizon research thesis
                      </footer>
                    </blockquote>
                  )}
                  {index === 3 && <EvidenceProcess />}
                  {index === 4 && (
                    <div className="my-12 grid gap-6 lg:grid-cols-2">
                      <figure className="min-w-0 border-y py-6">
                        <InteractiveBarChart
                          title="Case-study company scores"
                          description="Current values from the live company dataset."
                          data={relatedCompanies.map((company) => ({
                            label: company.name,
                            score: company.score,
                          }))}
                          series={[{ key: "score", label: "CSR score" }]}
                        />
                        <figcaption className="mt-3 text-xs text-slate-500">
                          Impact Horizon Analysis · current research cycle
                        </figcaption>
                      </figure>
                      <figure className="min-w-0 border-y py-6">
                        <InteractiveRadarChart
                          title="Case-study pillar profile"
                          data={pillarData}
                        />
                        <figcaption className="mt-3 text-xs text-slate-500">
                          Average of selected case-study records; no missing values imputed.
                        </figcaption>
                      </figure>
                    </div>
                  )}
                  {index === 5 && <FindingPanels findings={article.findings} />}
                  {index === 9 && <CaseStudies companies={relatedCompanies} />}
                </section>
              ))}
            </div>

            <section id="sources" className="scroll-mt-28 border-b py-14">
              <p className="text-xs uppercase tracking-[.2em] text-cyan">Sources and references</p>
              <h2 className="display mt-4 text-4xl md:text-5xl">Follow the evidence.</h2>
              <p className="mt-5 max-w-3xl leading-7 text-slate-400">
                External sources provide standards and context. Corporate sources show what
                organizations disclosed; Impact Horizon calculations and interpretations are
                identified separately.
              </p>
              <code className="mt-7 block overflow-x-auto border-y bg-ink py-5 text-xs text-slate-300">
                {citation}
              </code>
              <div className="mt-10 space-y-10">
                {sourceCategories.map((category) => (
                  <section key={category}>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                      {category}
                    </h3>
                    <ol className="mt-4 divide-y border-y">
                      {article.sources
                        .filter((source) => source.category === category)
                        .map((source) => (
                          <li key={source.url} className="grid gap-2 py-4 md:grid-cols-[1fr_auto]">
                            <span>
                              <strong className="block">{source.title}</strong>
                              <span className="mt-1 block text-sm text-slate-500">
                                {source.organization} · {source.date}
                              </span>
                            </span>
                            <a
                              className="text-sm font-semibold text-cyan hover:underline"
                              href={source.url}
                              target={source.url.startsWith("http") ? "_blank" : undefined}
                              rel={source.url.startsWith("http") ? "noreferrer" : undefined}
                            >
                              Open source ↗
                            </a>
                          </li>
                        ))}
                    </ol>
                  </section>
                ))}
              </div>
            </section>

            <section className="py-14">
              <p className="text-xs uppercase tracking-[.2em] text-cyan">Continue exploring</p>
              <h2 className="display mt-4 text-4xl">Related research</h2>
              <div className="mt-7 grid gap-5 md:grid-cols-2">
                {related.map((item) => (
                  <Link href={`/research/${item.slug}`} key={item.slug} className="premium-card">
                    <span className="text-xs uppercase tracking-wider text-cyan">{item.type}</span>
                    <strong className="mt-4 block text-xl">{item.title}</strong>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{item.excerpt}</p>
                  </Link>
                ))}
              </div>
              <div className="mt-10 flex flex-wrap gap-2">
                {relatedIndustries.map((industry) => (
                  <Link key={industry.slug} href={`/industries/${industry.slug}`} className="chip">
                    {industry.name} →
                  </Link>
                ))}
              </div>
              <div className="mt-12 grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                    Related reports
                  </h3>
                  <div className="mt-4 space-y-3">
                    {relatedReports.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/research/${item.slug}`}
                        className="block border-t pt-3 text-sm text-slate-300 hover:text-cyan"
                      >
                        {item.title} →
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                    Related companies
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {relatedCompanies.map((company) => (
                      <Link key={company.slug} href={`/companies/${company.slug}`} className="chip">
                        {company.name} →
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <nav
              className="grid gap-4 border-y py-8 sm:grid-cols-2"
              aria-label="Article navigation"
            >
              <Link href={`/research/${previous.slug}`} className="group p-4 hover:bg-white/[.03]">
                <span className="text-xs uppercase tracking-wider text-slate-500">
                  ← Previous article
                </span>
                <strong className="mt-2 block group-hover:text-cyan">{previous.title}</strong>
              </Link>
              <Link
                href={`/research/${next.slug}`}
                className="group p-4 text-left hover:bg-white/[.03] sm:text-right"
              >
                <span className="text-xs uppercase tracking-wider text-slate-500">
                  Next article →
                </span>
                <strong className="mt-2 block group-hover:text-cyan">{next.title}</strong>
              </Link>
            </nav>
          </main>

          <aside className="hidden xl:block">
            <div className="sticky top-28 space-y-7">
              <nav aria-label="Table of contents" className="border-l pl-5">
                <p className="text-xs uppercase tracking-wider text-cyan">On this page</p>
                <TableOfContents article={article} className="mt-4" />
              </nav>
              {author && (
                <section className="border-t pt-6">
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    About the author
                  </p>
                  <h2 className="mt-4 font-semibold">{author.name}</h2>
                  <p className="mt-1 text-xs text-cyan">{author.role}</p>
                  <p className="mt-4 line-clamp-6 text-sm leading-6 text-slate-500">{author.bio}</p>
                  <Link
                    href={`/team#${author.slug}`}
                    className="mt-4 inline-block text-xs text-cyan"
                  >
                    Research profile →
                  </Link>
                </section>
              )}
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}

function TableOfContents({
  article,
  className = "",
}: {
  article: (typeof publications)[number];
  className?: string;
}) {
  return (
    <ol className={`space-y-2 ${className}`}>
      {article.sections.map((section, index) => (
        <li key={section.heading}>
          <a
            href={`#section-${index + 1}`}
            className="block text-sm text-slate-400 hover:text-white"
          >
            <span className="mr-2 text-slate-600">{String(index + 1).padStart(2, "0")}</span>
            {section.heading}
          </a>
        </li>
      ))}
      <li>
        <a href="#sources" className="block text-sm text-slate-400 hover:text-white">
          <span className="mr-2 text-slate-600">16</span>Sources
        </a>
      </li>
    </ol>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l border-cyan/40 pl-5">
      <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-3 text-sm leading-6 text-slate-300">{value}</p>
    </div>
  );
}

function EvidenceProcess() {
  return (
    <figure className="my-12 border-y py-8">
      <figcaption className="text-sm font-semibold text-white">
        Evidence-to-analysis process
      </figcaption>
      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        {[
          "Primary sources",
          "Structured company data",
          "Comparative calculation",
          "Bounded interpretation",
        ].map((label, index) => (
          <div key={label} className="border-t-2 border-cyan/50 pt-4">
            <span className="text-xs text-cyan">0{index + 1}</span>
            <strong className="mt-2 block text-sm">{label}</strong>
          </div>
        ))}
      </div>
    </figure>
  );
}

function FindingPanels({ findings }: { findings: (typeof publications)[number]["findings"] }) {
  return (
    <div className="my-12 space-y-8">
      {findings.map((finding, index) => (
        <article key={finding.finding} className="border-t pt-7">
          <p className="text-xs uppercase tracking-wider text-cyan">Finding {index + 1}</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">{finding.finding}</h3>
          <dl className="mt-6 grid gap-5 text-sm leading-7 md:grid-cols-3">
            <div>
              <dt className="font-semibold text-white">Evidence</dt>
              <dd className="mt-2 text-slate-400">{finding.evidence}</dd>
            </div>
            <div>
              <dt className="font-semibold text-white">Impact Horizon Analysis</dt>
              <dd className="mt-2 text-slate-400">{finding.analysis}</dd>
            </div>
            <div>
              <dt className="font-semibold text-white">Why it matters</dt>
              <dd className="mt-2 text-slate-400">{finding.whyItMatters}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );
}

function CaseStudies({ companies: rows }: { companies: typeof companies }) {
  return (
    <div className="my-12 space-y-6">
      {rows.map((company) => (
        <article
          key={company.slug}
          className="grid gap-6 border-y py-7 md:grid-cols-[auto_1fr_auto]"
        >
          <CompanyLogo
            name={company.name}
            website={company.website}
            logo={company.logo}
            size="lg"
          />
          <div>
            <h3 className="text-xl font-semibold text-white">{company.name}</h3>
            <p className="mt-2 text-sm text-slate-500">
              {company.industry} · Fortune #{company.fortuneRank ?? "Data unavailable"}
            </p>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Evidence: {company.sources[0]?.title ?? "Company source record unavailable"}. Impact
              Horizon Analysis: this case is included for its position in the mechanically selected
              cohort; review the full profile before drawing conclusions.
            </p>
            <p className="mt-3 text-sm text-slate-400">
              Pillars: Environmental {company.pillars.Environmental.toFixed(1)} · Financial{" "}
              {company.pillars["Financial responsibility"].toFixed(1)} · Philanthropy{" "}
              {company.pillars.Philanthropy.toFixed(1)} · Ethics {company.pillars.Ethics.toFixed(1)}
            </p>
            <Link
              href={`/companies/${company.slug}`}
              className="mt-4 inline-block text-sm text-cyan"
            >
              View Company Profile →
            </Link>
          </div>
          <div className="flex items-center gap-3 md:self-start">
            <strong className="display text-3xl text-cyan">{company.score.toFixed(1)}</strong>
            <GradeBadge score={company.score} />
          </div>
        </article>
      ))}
    </div>
  );
}
