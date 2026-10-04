import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Calendar, Clock, Download, FileText, Quote } from "lucide-react";
import { reports, research } from "@/lib/data";
import { pageMetadata } from "@/lib/metadata";
import { SectionTitle } from "@/components/ui/primitives";

export const metadata = pageMetadata(
  "Publications",
  "White papers, annual reports, briefs, and methodology papers from Impact500.",
  "/publications",
);

const formats = [
  "White Papers",
  "Industry Reports",
  "Annual Reports",
  "Research Briefs",
  "Methodology Papers",
  "Executive Summaries",
  "Corporate Trend Reports",
];

export default function PublicationsPage() {
  return (
    <main className="page-shell">
      <SectionTitle
        eyebrow="Impact500 publications"
        title={
          <>
            Research designed to be <em className="text-cyan">used.</em>
          </>
        }
        text="A growing collection of decision-ready publications, from executive briefs to the institute’s flagship annual assessment."
      />
      <div className="mt-10 flex flex-wrap gap-2">
        {formats.map((format) => (
          <span key={format} className="chip">
            {format}
          </span>
        ))}
      </div>
      <section className="mt-16 grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
        <article className="grid-bg rounded-[2rem] border bg-gradient-to-br from-accent/25 to-panel p-8 md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald-400">
            Flagship publication · Expanded digital edition
          </p>
          <h2 className="display mt-6 text-4xl md:text-6xl">{reports[0].title}</h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{reports[0].summary}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={reports[0].href} className="button-primary">
              <BookOpen className="size-4" />
              Read report
            </Link>
            <a href={reports[0].pdf} download className="button-secondary">
              <Download className="size-4" />
              Download
            </a>
          </div>
        </article>
        <aside className="surface-card">
          <FileText className="size-7 text-cyan" />
          <p className="mt-8 text-xs uppercase tracking-wider text-slate-500">
            Publication standard
          </p>
          <h2 className="mt-4 text-2xl font-semibold">Transparent by design.</h2>
          <ul className="mt-6 space-y-4 text-sm leading-6 text-slate-300">
            {[
              "Executive summary and key findings",
              "Navigable table of contents",
              "Accessible charts and data notes",
              "References and citation guidance",
              "Download-ready publication view",
            ].map((item) => (
              <li key={item} className="border-l-2 border-cyan/40 pl-4">
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </section>
      <section className="mt-20">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[.2em] text-cyan">Research report library</p>
            <h2 className="display mt-4 text-4xl md:text-5xl">
              Briefings for consequential decisions.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-400">
            Every publication includes an executive summary, structured contents, analytical
            exhibits, references, and a ready-to-use citation.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {reports.map((report, index) => (
            <article
              id={report.slug}
              key={report.slug}
              className="group scroll-mt-28 overflow-hidden rounded-2xl border bg-panel"
            >
              <div className="relative aspect-[16/8] overflow-hidden">
                <Image
                  src={report.cover}
                  alt={`${report.title} cover`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover opacity-65 transition duration-500 group-hover:scale-105 group-hover:opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent" />
                <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-ink/80 px-3 py-1 text-[.65rem] uppercase tracking-wider text-cyan backdrop-blur">
                  {report.edition}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold leading-snug">{report.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{report.summary}</p>
                <div className="mt-5 flex flex-wrap gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    {report.publishedAt}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5" />
                    {12 + (index % 5) * 3} min read
                  </span>
                </div>
                <div className="mt-6 flex gap-2">
                  <Link href={report.href} className="button-primary flex-1">
                    Read <ArrowRight className="size-4" />
                  </Link>
                  <a
                    href={report.pdf}
                    download
                    aria-label={`Download ${report.title}`}
                    className="button-secondary px-4"
                  >
                    <Download className="size-4" />
                  </a>
                </div>
                <details className="mt-5 border-t pt-4 text-xs text-slate-500">
                  <summary className="flex cursor-pointer items-center gap-2 hover:text-white">
                    <Quote className="size-3.5" /> Citation
                  </summary>
                  <p className="mt-3 leading-5">{report.citation}</p>
                </details>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="mt-20">
        <p className="text-xs uppercase tracking-[.2em] text-cyan">Latest releases</p>
        <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {research.map((item) => (
            <Link key={item.slug} href={`/research/${item.slug}`} className="premium-card group">
              <span className="text-xs uppercase tracking-wider text-cyan">{item.type}</span>
              <h2 className="mt-6 text-xl font-semibold leading-snug group-hover:text-cyan">
                {item.title}
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-400">{item.excerpt}</p>
              <span className="mt-7 flex items-center gap-2 text-sm font-semibold text-cyan">
                View publication <ArrowRight className="size-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
