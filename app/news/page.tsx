import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { news } from "@/lib/data";
import { SectionTitle } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Research News",
  "Impact500 research announcements, company updates, sector developments, and publication releases.",
  "/news",
);
export default function NewsPage() {
  const featured = news.filter((item) => item.featured);
  return (
    <section className="page-shell">
      <SectionTitle
        eyebrow="Research desk"
        title="News and research updates."
        text="Publication releases, methodology changes, company-profile updates, and signals from across the research program."
      />
      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        {featured.map((item) => (
          <article key={item.slug} id={item.slug} className="premium-card">
            <p className="text-xs uppercase tracking-wider text-cyan">Featured · {item.category}</p>
            <h2 className="display mt-6 text-3xl">{item.headline}</h2>
            <p className="mt-4 leading-7 text-zinc-400">{item.summary}</p>
            <p className="mt-8 flex items-center gap-2 text-xs text-zinc-500">
              <CalendarDays className="size-4" />{" "}
              {new Date(item.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC",
              })}
            </p>
          </article>
        ))}
      </div>
      <div className="mt-12">
        <h2 className="text-xl font-semibold">All updates</h2>
        <div className="mt-5 divide-y overflow-hidden rounded-2xl border bg-panel">
          {news.map((item) => (
            <Link
              href={`#${item.slug}`}
              key={item.slug}
              className="grid gap-3 p-6 hover:bg-white/[.03] md:grid-cols-[10rem_1fr_auto] md:items-center"
            >
              <span className="text-xs text-cyan">{item.category}</span>
              <span>
                <strong className="block">{item.headline}</strong>
                <small className="mt-1 block text-zinc-500">{item.summary}</small>
              </span>
              <time className="text-xs text-zinc-600">{item.publishedAt}</time>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
