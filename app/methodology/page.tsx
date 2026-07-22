import { SectionTitle } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/metadata";
import { MethodologyFramework } from "@/components/impact/methodology-framework";
export const metadata = pageMetadata(
  "Methodology",
  "How Impact500 evaluates corporate responsibility.",
  "/methodology",
);
const steps = [
  [
    "01",
    "scope",
    "Scope",
    "We assess Fortune 500-scale companies using consistently available public evidence.",
  ],
  [
    "02",
    "evidence",
    "Evidence",
    "More than 800 published pillar values are structured for review against documented research standards.",
  ],
  [
    "03",
    "scoring",
    "Scoring",
    "Pillar-level outcomes are normalized and weighted into an interpretable overall score.",
  ],
  [
    "04",
    "validation",
    "Validation",
    "A five-person research team reviews material findings, sources, and limitations.",
  ],
];
export default function Methodology() {
  return (
    <section className="page-shell">
      <SectionTitle
        eyebrow="How we work"
        title={
          <>
            Rigorous by design.
            <br />
            <em className="text-cyan">Human by nature.</em>
          </>
        }
        text="A transparent research framework for measuring the decisions behind corporate responsibility."
      />
      <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border bg-white/10 md:grid-cols-2">
        {steps.map(([number, id, title, text]) => (
          <article id={id} className="scroll-mt-24 bg-panel p-7" key={number}>
            <span className="text-cyan">{number}</span>
            <h2 className="mt-8 text-2xl font-semibold">{title}</h2>
            <p className="mt-3 leading-7 text-zinc-400">{text}</p>
          </article>
        ))}
      </div>
      <div className="mt-12 rounded-2xl border bg-panel p-8">
        <h2 className="text-2xl font-semibold">The four pillars</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {["Environmental", "Financial responsibility", "Philanthropy", "Ethics"].map((pillar) => (
            <div className="rounded-xl border border-white/10 bg-ink p-4" key={pillar}>
              <h3 className="font-medium text-cyan">{pillar}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Comparable indicators, outcome quality, disclosure, and external validation.
              </p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm leading-6 text-zinc-500">
          Scores are research tools, not investment advice. Every model has limitations; our
          methodology documents them plainly.
        </p>
      </div>
      <div className="mt-20">
        <MethodologyFramework />
      </div>
      <section className="mt-20 grid gap-5 lg:grid-cols-3">
        <article className="surface-card"><p className="text-xs uppercase tracking-wider text-cyan">Limitations</p><h2 className="mt-5 text-2xl font-semibold">What the index cannot claim.</h2><p className="mt-4 leading-7 text-zinc-400">Public evidence is incomplete and uneven. Scores describe documented performance within a defined model, not every dimension of corporate conduct.</p></article>
        <article className="surface-card"><p className="text-xs uppercase tracking-wider text-cyan">Research principles</p><h2 className="mt-5 text-2xl font-semibold">Comparable, transparent, revisable.</h2><p className="mt-4 leading-7 text-zinc-400">Every conclusion must be traceable to evidence, consistently evaluated, and open to revision when stronger information appears.</p></article>
        <article className="surface-card"><p className="text-xs uppercase tracking-wider text-cyan">Version history</p><h2 className="mt-5 text-2xl font-semibold">Framework 4.2 · 2026</h2><p className="mt-4 leading-7 text-zinc-400">The current release strengthens outcome validation, source freshness, AI governance, and cross-sector normalization.</p></article>
      </section>
    </section>
  );
}
