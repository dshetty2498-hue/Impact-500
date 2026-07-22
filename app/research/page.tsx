import Link from "next/link";
import { research } from "@/lib/data";
import { pageMetadata } from "@/lib/metadata";
import { SectionTitle } from "@/components/ui/primitives";
export const metadata = pageMetadata(
  "Research",
  "Independent research on corporate responsibility and ESG performance.",
  "/research",
);
export default function ResearchPage() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <SectionTitle
        eyebrow="Research library"
        title={
          <>
            Evidence with <em className="text-cyan">consequence.</em>
          </>
        }
        text="Original reporting, sector analysis, and annual publications that make corporate claims comparable."
      />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {research.map((article) => (
          <Link
            className="focus-ring rounded-2xl border bg-panel p-7 transition hover:border-cyan/50"
            key={article.slug}
            href={`/research/${article.slug}`}
          >
            <p className="text-xs uppercase tracking-wider text-cyan">
              {article.type} · {article.date}
            </p>
            <h2 className="mt-8 text-2xl font-semibold">{article.title}</h2>
            <p className="mt-4 text-sm leading-6 text-zinc-400">{article.excerpt}</p>
            <span className="mt-8 block text-sm text-cyan">Read analysis →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
