import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { companies, news, research } from "@/lib/data";
import { articleMetadata, serializeJsonLd, siteUrl } from "@/lib/metadata";
import { ReadingProgress } from "@/components/impact/research-tools";
import { CompanyLogo } from "@/components/impact/company-logo";

export function generateStaticParams() {
  return news.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = news.find((entry) => entry.slug === slug);
  return item
    ? articleMetadata(item.headline, item.summary, `/news/${item.slug}`, {
        authors: [item.author ?? "Impact500 Research Desk"],
        publishedTime: item.publishedAt,
      })
    : {};
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = news.find((entry) => entry.slug === slug);
  if (!item) notFound();
  const company = item.companySlug
    ? companies.find((entry) => entry.slug === item.companySlug)
    : undefined;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.headline,
    description: item.summary,
    datePublished: item.publishedAt,
    author: { "@type": "Organization", name: item.author ?? "Impact500 Research Desk" },
    publisher: { "@id": `${siteUrl}/#organization` },
    mainEntityOfPage: `${siteUrl}/news/${item.slug}`,
  };
  return (
    <article className="page-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <ReadingProgress />
      <Link href="/news" className="text-sm text-cyan">
        ← Research newsroom
      </Link>
      <header className="mt-10 max-w-5xl border-b pb-12">
        <p className="text-xs uppercase tracking-[.18em] text-cyan">
          {item.category} · {item.publication}
        </p>
        <h1 className="display mt-6 max-w-5xl text-4xl leading-tight md:text-6xl">
          {item.headline}
        </h1>
        <p className="mt-7 max-w-3xl text-xl leading-9 text-zinc-300">{item.summary}</p>
        <p className="mt-6 flex items-center gap-2 text-sm text-zinc-500">
          <CalendarDays className="size-4" /> {item.publishedAt} · By {item.author}
        </p>
      </header>
      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <main className="max-w-4xl space-y-8 text-lg leading-9 text-zinc-300">
          {item.body?.map((paragraph) => (
            <p key={paragraph.slice(0, 60)}>{paragraph}</p>
          ))}
          {item.sourceUrl && (
            <a href={item.sourceUrl} className="button-secondary" target="_blank" rel="noreferrer">
              Original publication <ArrowUpRight className="size-4" />
            </a>
          )}
        </main>
        <aside className="space-y-6">
          <section className="rounded-2xl border bg-panel p-6">
            <p className="text-xs uppercase tracking-wider text-cyan">Key takeaways</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-400">
              {item.keyTakeaways?.map((takeaway) => (
                <li key={takeaway}>→ {takeaway}</li>
              ))}
            </ul>
          </section>
          {company && (
            <Link
              href={`/companies/${company.slug}`}
              className="flex items-center gap-3 rounded-2xl border bg-panel p-5"
            >
              <CompanyLogo name={company.name} website={company.website} logo={company.logo} />
              <span>
                <strong className="block">{company.name}</strong>
                <small className="text-zinc-500">CEO {company.executive?.name}</small>
              </span>
            </Link>
          )}
        </aside>
      </div>
      <section className="mt-20">
        <p className="text-xs uppercase tracking-wider text-cyan">Recommended reading</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {research.slice(0, 3).map((article) => (
            <Link key={article.slug} href={`/research/${article.slug}`} className="premium-card">
              <strong>{article.title}</strong>
              <p className="mt-3 text-sm text-zinc-500">{article.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
