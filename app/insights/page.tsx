import Link from "next/link";
import { ArrowRight, Building2, Clock3, Leaf, Scale, Users } from "lucide-react";
import { companies, research } from "@/lib/data";
import { pageMetadata } from "@/lib/metadata";
import { SectionTitle } from "@/components/ui/primitives";

export const metadata = pageMetadata(
  "Insights",
  "Impact500 analysis of corporate responsibility leaders, momentum, and emerging signals.",
  "/insights",
);

export default function InsightsPage() {
  const leaders = [...companies].sort((a, b) => b.score - a.score);
  const pillars = [
    [Leaf, "Environmental leaders", "Environmental"],
    [Scale, "Ethics leaders", "Ethics"],
    [Users, "Community leaders", "Philanthropy"],
    [Building2, "Governance leaders", "Financial responsibility"],
  ] as const;
  return (
    <main className="page-shell">
      <SectionTitle
        eyebrow="Research insights"
        title={
          <>
            Signals beneath the <em className="text-cyan">headline score.</em>
          </>
        }
        text="Timely interpretation of performance, momentum, sector change, and the evidence shaping corporate accountability."
      />
      <section className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {pillars.map(([Icon, label, key]) => {
          const company = [...companies].sort((a, b) => b.pillars[key] - a.pillars[key])[0];
          return (
            <Link href={`/companies/${company.slug}`} key={label} className="metric-card group">
              <Icon className="size-5 text-cyan" />
              <p className="mt-8 text-xs uppercase tracking-wider text-slate-500">{label}</p>
              <h2 className="mt-3 text-xl font-semibold group-hover:text-cyan">{company.name}</h2>
              <p className="mt-2 text-xs text-zinc-500">CEO {company.executive?.name}</p>
              <strong className="mt-5 block text-3xl text-cyan">{company.pillars[key]}</strong>
            </Link>
          );
        })}
      </section>
      <section className="mt-20 grid gap-6 lg:grid-cols-2">
        <article className="surface-card">
          <p className="text-xs uppercase tracking-wider text-emerald-400">Performance signal</p>
          <h2 className="display mt-5 text-4xl">Leadership is becoming more operational.</h2>
          <p className="mt-6 leading-8 text-slate-300">
            The highest-performing profiles connect public commitments to accountable owners,
            measurable outcomes, and consistent year-over-year evidence.
          </p>
          <Link href={`/companies/${leaders[0].slug}`} className="link-arrow mt-8">
            Explore the current leader <ArrowRight className="size-4" />
          </Link>
        </article>
        <article className="surface-card">
          <Clock3 className="size-6 text-cyan" />
          <p className="mt-7 text-xs uppercase tracking-wider text-slate-500">Momentum watch</p>
          <h2 className="mt-4 text-3xl font-semibold">Movement pending validation</h2>
          <p className="mt-5 leading-7 text-slate-400">
            The platform will identify movement after the current cycle produces a second verified
            snapshot. Generated historical movement is excluded.
          </p>
        </article>
      </section>
      <section className="mt-20">
        <p className="text-xs uppercase tracking-[.2em] text-cyan">Analyst perspectives</p>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {research.slice(0, 3).map((item) => (
            <Link key={item.slug} href={`/research/${item.slug}`} className="premium-card">
              <span className="text-xs text-cyan">{item.category}</span>
              <h2 className="mt-5 text-2xl font-semibold">{item.title}</h2>
              <p className="mt-4 leading-7 text-slate-400">{item.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
