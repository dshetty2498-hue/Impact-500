import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { team, research } from "@/lib/data";
import { pageMetadata } from "@/lib/metadata";
import { ReadingProgress, ResearchActions } from "@/components/impact/research-tools";
export function generateStaticParams() {
  return research.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = research.find((item) => item.slug === slug);
  return article
    ? pageMetadata(article.title, article.excerpt, `/research/${article.slug}`)
    : pageMetadata("Research", "Independent Impact500 research.", `/research/${slug}`);
}
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = research.find((item) => item.slug === slug);
  if (!article) notFound();
  const author = team.find((member) => member.name === article.author);
  const related = article.related
    .map((relatedSlug) => research.find((item) => item.slug === relatedSlug))
    .filter(Boolean);
  const citation = `${article.author}. (${article.publishedAt.slice(0, 4)}). ${article.title}. Impact500 Institute.`;
  return (
    <article className="page-shell">
      <ReadingProgress />
      <Link href="/research" className="text-sm text-cyan">
        ← Research library
      </Link>
      <div className="mt-10 grid gap-12 xl:grid-cols-[minmax(0,1fr)_19rem]">
        <main>
          <p className="text-xs uppercase tracking-[.18em] text-cyan">
            {article.type} · {article.date} · {article.read} read
          </p>
          <h1 className="display mt-6 max-w-5xl text-5xl leading-[1.02] md:text-7xl xl:text-8xl">
            {article.title}
          </h1>
          <p className="mt-8 max-w-4xl text-xl leading-9 text-zinc-300 md:text-2xl">
            {article.excerpt}
          </p>
          <p className="mt-5 text-sm text-zinc-500">
            By {article.author} · {article.category} · {article.tags.join(" · ")}
          </p>
          <div className="mt-7">
            <ResearchActions slug={article.slug} title={article.title} />
          </div>
          <figure className="mt-12">
            <div className="relative aspect-[16/8] overflow-hidden rounded-[2rem] border shadow-2xl shadow-black/25">
              <Image
                src={article.cover}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 75vw"
                style={{ objectPosition: article.coverPosition }}
                className="object-cover"
                alt={`Cover image for ${article.title}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            </div>
            <figcaption className="mt-3 text-sm leading-6 text-zinc-500">Impact500 editorial illustration · {article.category}</figcaption>
          </figure>
          <div className="editorial-copy mt-16 max-w-4xl space-y-14 text-lg leading-9 text-zinc-300 md:text-xl">
            {article.sections.map((section, index) => (
              <section id={`section-${index + 1}`} className="scroll-mt-28" key={section.heading}>
                <h2 className="display text-3xl text-white md:text-4xl">{section.heading}</h2>
                <p className="mt-6">{section.body}</p>
              </section>
            ))}
          </div>
          <section className="mt-14 rounded-2xl border bg-panel p-6">
            <p className="text-xs uppercase tracking-wider text-cyan">References and citation</p>
            <p className="mt-4 text-sm leading-6 text-zinc-400">
              This analysis applies the Impact500 evidence standard to public disclosures and cited
              research records. Underlying evidence may be updated when disclosures change.
            </p>
            <code className="mt-5 block overflow-x-auto rounded-lg bg-ink p-4 text-xs text-zinc-300">
              {citation}
            </code>
          </section>
          {related.length > 0 && (
            <section className="mt-14">
              <p className="text-xs uppercase tracking-wider text-cyan">Related research</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {related.map(
                  (item) =>
                    item && (
                      <Link
                        href={`/research/${item.slug}`}
                        key={item.slug}
                        className="premium-card"
                      >
                        <strong>{item.title}</strong>
                        <p className="mt-3 text-sm text-zinc-500">{item.excerpt}</p>
                      </Link>
                    ),
                )}
              </div>
            </section>
          )}
        </main>
        <aside className="hidden xl:block">
          <div className="sticky top-28 space-y-7">
            <nav aria-label="Table of contents" className="rounded-2xl border bg-panel p-5">
              <p className="text-xs uppercase tracking-wider text-cyan">On this page</p>
              <ol className="mt-4 space-y-3">
                {article.sections.map((section, index) => (
                  <li key={section.heading}>
                    <a
                      href={`#section-${index + 1}`}
                      className="text-sm text-zinc-400 hover:text-white"
                    >
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            {author && (
              <section className="rounded-2xl border bg-panel p-5">
                <p className="text-xs uppercase tracking-wider text-zinc-500">About the author</p>
                <h2 className="mt-4 font-semibold">{author.name}</h2>
                <p className="mt-1 text-xs text-cyan">{author.role}</p>
                <p className="mt-4 text-sm leading-6 text-zinc-500">{author.bio}</p>
                <Link
                  href={`/about#${author.slug}`}
                  className="mt-4 inline-block text-xs text-cyan"
                >
                  Research profile →
                </Link>
              </section>
            )}
          </div>
        </aside>
      </div>
    </article>
  );
}
