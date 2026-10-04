import { SectionTitle } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/metadata";
import { MethodologyFramework } from "@/components/impact/methodology-framework";
import { gradingScale } from "@/lib/grading";
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
    "More than 2,000 articles and 2,000 Fortune 500 CSR data points are reviewed against documented research standards.",
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
    <section className="page-shell research-document">
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
      <section
        className="mt-14 grid border-y sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Research scope"
      >
        {[
          ["2,000+", "Articles reviewed"],
          ["2,000+", "Fortune 500 CSR data points audited"],
          ["5", "People in the core validation team"],
          ["4", "Scored responsibility pillars"],
        ].map(([value, label]) => (
          <div key={label} className="border-b p-5 lg:border-b-0 lg:border-r lg:last:border-r-0">
            <strong className="display block text-3xl text-cyan">{value}</strong>
            <span className="mt-2 block text-sm leading-6 text-zinc-400">{label}</span>
          </div>
        ))}
      </section>
      <div className="mt-14 divide-y border-y">
        {steps.map(([number, id, title, text]) => (
          <article
            id={id}
            className="grid scroll-mt-24 gap-3 py-6 md:grid-cols-[5rem_12rem_1fr] md:items-baseline"
            key={number}
          >
            <span className="text-xs tabular-nums text-cyan">{number}</span>
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="leading-7 text-zinc-400">{text}</p>
          </article>
        ))}
      </div>
      <div className="mt-16 border-t pt-7">
        <h2 className="display text-3xl">The four pillars</h2>
        <div className="mt-6 grid border-y md:grid-cols-4">
          {["Environmental", "Financial responsibility", "Philanthropy", "Ethics"].map((pillar) => (
            <div className="border-b p-5 md:border-b-0 md:border-r md:last:border-r-0" key={pillar}>
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
      <section className="mt-16 grid gap-10 border-t pt-7 lg:grid-cols-[.65fr_1.35fr]">
        <div>
          <p className="editorial-kicker">Data documentation</p>
          <h2 className="display mt-4 text-3xl">Sources and variables</h2>
          <p className="mt-4 leading-7 text-zinc-400">
            Researchers preserve the source, reporting year, access date, measurement boundary, and
            verification status so every published observation can be traced back to evidence.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] border-y text-left text-sm">
            <thead className="border-b text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="py-4 pr-5">Documentation</th>
                <th className="py-4">Included evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y text-zinc-300">
              <tr>
                <th className="py-5 pr-5 font-semibold">Data sources</th>
                <td className="py-5 leading-6">
                  Annual reports, sustainability and CSR reports, SEC filings, governance documents,
                  company disclosures, regulator records, and credible independent reporting.
                </td>
              </tr>
              <tr>
                <th className="py-5 pr-5 font-semibold">Variables</th>
                <td className="py-5 leading-6">
                  Company, industry, reporting period, indicator, unit, value, baseline, target,
                  outcome, source URL, assurance status, and analyst confidence.
                </td>
              </tr>
              <tr>
                <th className="py-5 pr-5 font-semibold">Evidence treatment</th>
                <td className="py-5 leading-6">
                  Missing evidence is separated from negative evidence; modeled values and
                  unverified claims remain visibly labeled.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section className="mt-16 border-t pt-7" aria-labelledby="risk-method-title">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-amber-300">
          Qualitative risk methodology
        </p>
        <h2 id="risk-method-title" className="display mt-3 text-3xl">
          How Risk Profiles are determined
        </h2>
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <article className="surface-card">
            <h3 className="font-semibold">1. Sector relevance</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Each industry maps only to material categories supported by government or regulatory
              research. A category is an exposure lens, not evidence of an incident.
            </p>
          </article>
          <article className="surface-card">
            <h3 className="font-semibold">2. Peer-position signal</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              The related CSR pillar is compared with the live industry average. Ten or more points
              below peers is labeled High; four to under ten below is Elevated. A Moderate category
              may be Low when it is ten or more points above peers.
            </p>
          </article>
          <article className="surface-card">
            <h3 className="font-semibold">3. Overall profile</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              The overall qualitative profile equals the highest displayed category. It is not a
              numerical risk score, prediction, legal conclusion, or automatic CSR-score deduction.
            </p>
          </article>
        </div>
      </section>
      <section className="mt-16 border-t pt-7" aria-labelledby="grading-scale-title">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-cyan">
          Standardized interpretation
        </p>
        <h2 id="grading-scale-title" className="display mt-3 text-3xl">
          Grading scale
        </h2>
        <p className="mt-4 max-w-3xl leading-7 text-zinc-400">
          Overall scores translate to one of five letter grades. Decimal scores use the same
          boundaries: a score of 89.9 is a B, while 90.0 is an A.
        </p>
        <div className="mt-7 grid border-y sm:grid-cols-2 lg:grid-cols-5">
          {gradingScale.map((item) => (
            <article
              key={item.grade}
              className={`border-b p-5 lg:border-b-0 lg:border-r lg:last:border-r-0 ${item.badgeClass}`}
            >
              <div className="flex items-start justify-between gap-3">
                <strong className="display text-4xl">{item.grade}</strong>
                <span className="border-current/20 rounded-full border px-2 py-1 text-[.65rem] font-semibold uppercase tracking-wider">
                  {item.color}
                </span>
              </div>
              <p className="mt-5 text-lg font-semibold">{item.range}</p>
              <p className="mt-1 text-xs opacity-80">{item.label}</p>
            </article>
          ))}
        </div>
      </section>
      <div className="mt-20">
        <MethodologyFramework />
      </div>
      <section className="mt-20 grid border-y lg:grid-cols-3">
        <article className="surface-card">
          <p className="text-xs uppercase tracking-wider text-cyan">Limitations</p>
          <h2 className="mt-5 text-2xl font-semibold">What the index cannot claim.</h2>
          <p className="mt-4 leading-7 text-zinc-400">
            Public evidence is incomplete and uneven. Scores describe documented performance within
            a defined model, not every dimension of corporate conduct.
          </p>
        </article>
        <article className="surface-card">
          <p className="text-xs uppercase tracking-wider text-cyan">Research principles</p>
          <h2 className="mt-5 text-2xl font-semibold">Comparable, transparent, revisable.</h2>
          <p className="mt-4 leading-7 text-zinc-400">
            Every conclusion must be traceable to evidence, consistently evaluated, and open to
            revision when stronger information appears.
          </p>
        </article>
        <article className="surface-card">
          <p className="text-xs uppercase tracking-wider text-cyan">Version history</p>
          <h2 className="mt-5 text-2xl font-semibold">Framework 4.2 · 2026</h2>
          <p className="mt-4 leading-7 text-zinc-400">
            The current release strengthens outcome validation, source freshness, AI governance, and
            cross-sector normalization.
          </p>
        </article>
      </section>
    </section>
  );
}
