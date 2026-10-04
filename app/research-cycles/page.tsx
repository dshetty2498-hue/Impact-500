import Link from "next/link";
import { CheckCircle2, Clock3 } from "lucide-react";
import { researchCycles, currentResearchCycle } from "@/data/research-cycles";
import { companies } from "@/lib/data";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Research cycles",
  "Version history and publication status for Impact Horizon company research.",
  "/research-cycles",
);

export default function ResearchCyclesPage() {
  return (
    <section className="page-shell research-document">
      <p className="editorial-kicker">Versioned research</p>
      <h1 className="display mt-5 max-w-4xl text-5xl">Research-cycle status and history</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">
        Impact Horizon preserves completed publications and opens a new version before source review
        begins. An updating cycle never overwrites the last published score.
      </p>

      <section className="mt-12 border-y bg-[#0d151e] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-cyan">Current cycle</p>
            <h2 className="display mt-3 text-3xl">{currentResearchCycle.name}</h2>
            <p className="mt-3 max-w-3xl leading-7 text-slate-400">{currentResearchCycle.note}</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 border border-amber-300/30 px-3 py-2 text-sm font-semibold text-amber-300">
            <Clock3 className="size-4" /> Updating
          </span>
        </div>
        <dl className="mt-8 grid gap-5 border-t pt-6 sm:grid-cols-2 lg:grid-cols-4">
          <CycleMetric label="Cycle began" value="September 29, 2026" />
          <CycleMetric label="Universe" value={`${companies.length} companies`} />
          <CycleMetric label="Evidence reviews completed" value={`${currentResearchCycle.companiesReviewed}`} />
          <CycleMetric label="Validated score updates" value={`${currentResearchCycle.companiesWithUpdatedScores}`} />
        </dl>
      </section>

      <section className="mt-16">
        <h2 className="display text-3xl">Publication history</h2>
        <div className="mt-7 divide-y border-y">
          {[...researchCycles].reverse().map((cycle) => (
            <article key={cycle.id} className="grid gap-4 py-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="flex items-center gap-3">
                  {cycle.status === "complete" ? (
                    <CheckCircle2 className="size-4 text-emerald-400" aria-hidden="true" />
                  ) : (
                    <Clock3 className="size-4 text-amber-300" aria-hidden="true" />
                  )}
                  <h3 className="font-semibold">{cycle.name}</h3>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-500">{cycle.note}</p>
              </div>
              <dl className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs md:text-right">
                <div><dt className="text-slate-500">Status</dt><dd className="mt-1 text-white">{cycle.status === "complete" ? "Complete" : "Updating"}</dd></div>
                <div><dt className="text-slate-500">Methodology</dt><dd className="mt-1 text-white">v{cycle.methodologyVersion}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 border-t pt-8">
        <h2 className="display text-3xl">Publication gate</h2>
        <ol className="mt-6 grid gap-5 md:grid-cols-3">
          {[
            ["01", "Evidence review", "Material observations require a traceable source, reporting period, and verification status."],
            ["02", "Scoring and ranking", "The shared engine applies the four equal pillar weights, grading thresholds, and deterministic ranking order."],
            ["03", "Integrity validation", "The cycle closes only after company, score, ranking, route, and cross-site consistency checks pass."],
          ].map(([number, title, body]) => (
            <li key={number} className="border-t-2 border-cyan pt-5">
              <span className="text-xs text-cyan">{number}</span>
              <h3 className="mt-3 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
            </li>
          ))}
        </ol>
        <Link href="/methodology" className="mt-8 inline-flex text-sm font-semibold text-cyan hover:text-white">
          Read the complete methodology →
        </Link>
      </section>
    </section>
  );
}

function CycleMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-slate-500">{label}</dt>
      <dd className="mt-2 text-xl font-semibold text-white">{value}</dd>
    </div>
  );
}
