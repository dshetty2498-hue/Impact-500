import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { research } from "@/lib/data";
import { pageMetadata } from "@/lib/metadata";
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
  const article = research.find((a) => a.slug === slug);
  if (!article) notFound();
  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <Link href="/research" className="text-sm text-cyan">
        ← Research library
      </Link>
      <p className="mt-10 text-xs uppercase tracking-[.18em] text-cyan">
        {article.type} · {article.date} · {article.read} read
      </p>
      <h1 className="display mt-5 text-5xl leading-tight md:text-6xl">{article.title}</h1>
      <p className="mt-7 text-xl leading-8 text-zinc-300">{article.excerpt}</p>
      <div className="mt-12 space-y-6 text-lg leading-8 text-zinc-400">
        <p>
          Impact500 research connects public disclosure with durable outcomes. We use a consistent
          evidence standard so readers can distinguish stated intent from observable progress.
        </p>
        <h2 className="text-2xl font-semibold text-white">What the evidence suggests</h2>
        <p>
          Leadership is increasingly visible in governance, implementation, and the quality of
          reported outcomes—not simply the number of commitments a company can make.
        </p>
        <p>
          This publication is part of the Impact500 research library and will be updated as
          underlying evidence changes.
        </p>
      </div>
    </article>
  );
}
