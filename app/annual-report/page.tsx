import Image from "next/image";
import Link from "next/link";
import { ReportActions } from "@/components/impact/report-actions";
import { SectionTitle } from "@/components/ui/primitives";
import { reports, research } from "@/lib/data";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Annual Report Library",
  "Read, cite, print, and download Impact500 annual reports.",
  "/annual-report",
);
export default async function AnnualReport({
  searchParams,
}: {
  searchParams: Promise<{ report?: string }>;
}) {
  const requested = (await searchParams).report;
  const report =
    reports.find((item) => item.slug === requested) ??
    [...reports].sort((a, b) => b.year - a.year)[0];
  return (
    <section className="page-shell">
      <SectionTitle
        eyebrow="Annual publications"
        title={
          <>
            Impact500 <em className="text-cyan">report library.</em>
          </>
        }
        text="Read the current index findings or move between editions as the research archive grows."
      />
      <div className="mt-8 flex flex-wrap gap-2" aria-label="Report editions">
        {reports.map((item) => (
          <Link
            key={item.slug}
            href={`/annual-report?report=${item.slug}`}
            aria-current={item.slug === report.slug ? "page" : undefined}
            className={item.slug === report.slug ? "button-primary" : "button-secondary"}
          >
            {item.year} edition
          </Link>
        ))}
      </div>
      <div className="surface-card mt-10 grid gap-8 md:grid-cols-[auto_1fr] md:items-center">
        <div className="relative aspect-[4/5] w-32 overflow-hidden rounded-lg">
          <Image
            src={report.cover}
            fill
            sizes="128px"
            className="object-cover"
            alt={`${report.title} cover`}
          />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-cyan">Publication details</p>
          <h1 className="display mt-3 text-4xl md:text-5xl">{report.title}</h1>
          <p className="mt-3 text-sm text-zinc-400">{report.summary}</p>
          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-zinc-600">Published</dt>
              <dd className="mt-1">{report.publishedAt}</dd>
            </div>
            <div>
              <dt className="text-zinc-600">Edition</dt>
              <dd className="mt-1">{report.edition}</dd>
            </div>
            <div>
              <dt className="text-zinc-600">Citation</dt>
              <dd className="mt-1">{report.citation}</dd>
            </div>
          </dl>
          <ReportActions pdf={report.pdf} slug={report.slug} title={report.title} />
        </div>
      </div>
      <div className="mt-10 overflow-hidden rounded-[1.75rem] border bg-panel shadow-2xl shadow-black/20 print:border-0">
        <div id="report-viewer">
          <iframe
            title={report.title}
            src={`${report.pdf}#view=FitH`}
            className="h-[78vh] w-full bg-white"
          />
        </div>
        <div className="p-6 text-sm text-zinc-400 print:hidden">
          If the viewer does not load, use the download or open-in-new-tab controls above.
        </div>
      </div>
      <section className="mt-16">
        <p className="text-xs uppercase tracking-[.18em] text-cyan">Recommended reading</p>
        <h2 className="display mt-3 text-4xl">Continue the research.</h2>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {research.slice(0, 3).map((article) => (
            <Link
              key={article.slug}
              href={`/research/${article.slug}`}
              className="premium-card group"
            >
              <span className="text-xs text-cyan">
                {article.type} · {article.read}
              </span>
              <h3 className="mt-6 text-lg font-semibold group-hover:text-cyan">{article.title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-500">{article.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}
