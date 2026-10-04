import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { companies, industries } from "@/lib/data";
import { pageMetadata } from "@/lib/metadata";
import { SectionTitle } from "@/components/ui/primitives";

export const metadata = pageMetadata(
  "Statistics Center",
  "Key figures, leaders, distributions, and downloadable context from Impact500.",
  "/statistics",
);

export default function StatisticsPage() {
  const avg = companies.reduce((s, c) => s + c.score, 0) / companies.length;
  const improved = companies.filter((c) => c.change > 0).length;
  const leaders = [...companies].sort((a, b) => b.score - a.score).slice(0, 10);
  return (
    <main className="page-shell">
      <SectionTitle
        eyebrow="Statistics center"
        title={
          <>
            The research universe, <em className="text-cyan">in numbers.</em>
          </>
        }
        text="A concise statistical reference for the scope, distribution, and current leaders in Impact500 coverage."
      />
      <section className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          [companies.length, "Company profiles"],
          [industries.length, "Covered industries"],
          [avg.toFixed(1), "Average score"],
          [`${Math.round((improved / companies.length) * 100)}%`, "Positive momentum"],
        ].map(([v, l]) => (
          <article key={l} className="metric-card">
            <strong className="display text-4xl text-cyan md:text-5xl">{v}</strong>
            <p className="mt-3 text-sm text-slate-400">{l}</p>
          </article>
        ))}
      </section>
      <section className="surface-card mt-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-cyan">Current leaders</p>
            <h2 className="display mt-4 text-4xl">Top ten companies</h2>
          </div>
          <Link href="/dashboard" className="link-arrow">
            Open analytics dashboard <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-8 divide-y divide-white/10">
          {leaders.map((c, i) => (
            <Link
              key={c.slug}
              href={`/companies/${c.slug}`}
              className="grid grid-cols-[3rem_1fr_auto] items-center gap-4 py-4 hover:pl-2"
            >
              <span className="text-sm text-slate-500">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <strong className="block">{c.name}</strong>
                <small className="text-slate-500">{c.industry}</small>
              </span>
              <strong className="text-xl text-cyan">{c.score.toFixed(1)}</strong>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
