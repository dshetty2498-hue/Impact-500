const pillars = [
  ["Environmental", "25%", "Climate, resource use, operations, and measurable outcomes"],
  [
    "Financial responsibility",
    "25%",
    "Long-term resilience, stakeholder value, and responsible allocation",
  ],
  ["Philanthropy", "25%", "Community investment, participation, and documented public benefit"],
  ["Ethics", "25%", "Governance, conduct, accountability, and external validation"],
] as const;

const workflow = [
  ["01", "Collect", "Public filings, reports, company disclosures, and independent evidence."],
  ["02", "Classify", "Researchers map observations to a defined indicator and reporting period."],
  ["03", "Evaluate", "Evidence is assessed for outcome quality, continuity, and assurance."],
  ["04", "Normalize", "Metrics are made comparable while preserving material sector context."],
  ["05", "Validate", "Material findings receive methodological and editorial review."],
  ["06", "Publish", "Scores, sources, limitations, and review dates are released together."],
] as const;

const faqs = [
  [
    "How often are scores updated?",
    "Impact Horizon opens a bi-monthly research cycle, but publishes score changes only after source review and integrity validation are complete. Material corrections may be issued between publications.",
  ],
  [
    "Can companies influence their score?",
    "Companies may submit public evidence or corrections, but cannot purchase placement, suppress findings, or influence model weights.",
  ],
  [
    "How do you handle missing data?",
    "Missing evidence is distinguished from negative evidence. Confidence and disclosure quality are evaluated separately before normalization.",
  ],
  [
    "Are scores investment recommendations?",
    "No. Impact500 scores are comparative research tools and are not investment, legal, or compliance advice.",
  ],
] as const;

export function MethodologyFramework() {
  return (
    <div className="space-y-20">
      <section className="grid gap-10 border-t pt-7 lg:grid-cols-[.65fr_1.35fr]">
        <div>
          <p className="editorial-kicker">Weighting model</p>
          <h2 className="display mt-4 text-4xl">Four lenses. One comparable score.</h2>
          <p className="mt-5 leading-7 text-slate-400">
            Equal pillar weights make the model legible. Indicator-level treatment still accounts
            for evidence strength, reporting continuity, and sector materiality.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] border-y text-left">
            <thead className="border-b text-[.68rem] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-4 font-semibold">Pillar</th>
                <th className="py-4 font-semibold">Weight</th>
                <th className="py-4 font-semibold">Research scope</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pillars.map(([name, weight, scope]) => (
                <tr key={name}>
                  <th className="py-5 pr-5 font-semibold text-slate-100">{name}</th>
                  <td className="py-5 pr-5 font-semibold tabular-nums text-cyan">{weight}</td>
                  <td className="py-5 text-sm leading-6 text-slate-400">{scope}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-6 border-l-2 border-cyan pl-5">
            <p className="font-mono text-sm text-slate-300">
              Overall score = Σ (pillar score × 0.25)
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Scores are rounded to one decimal place after aggregation.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-10 border-t pt-7 lg:grid-cols-[.65fr_1.35fr]">
        <div>
          <p className="editorial-kicker">Pillar rubric</p>
          <h2 className="display mt-4 text-4xl">How evidence becomes a pillar score</h2>
          <p className="mt-5 leading-7 text-slate-400">
            Each pillar uses the same evidence-quality questions while allowing material indicators
            to reflect the operating realities of the company’s industry.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[38rem] border-y text-left text-sm">
            <thead className="border-b text-[.68rem] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-4 pr-5">Rubric dimension</th>
                <th className="py-4">Research test</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-300">
              {[
                [
                  "Commitment",
                  "Is there a defined policy, baseline, scope, and time-bound objective?",
                ],
                [
                  "Governance",
                  "Is ownership assigned and does oversight reach executives or the board?",
                ],
                [
                  "Implementation",
                  "Are resources, controls, programs, and operating changes documented?",
                ],
                [
                  "Outcome",
                  "Are comparable results reported over time against the stated objective?",
                ],
                [
                  "Verification",
                  "Is the evidence current, traceable, and independently assured where appropriate?",
                ],
              ].map(([dimension, test]) => (
                <tr key={dimension}>
                  <th className="py-5 pr-5 font-semibold text-white">{dimension}</th>
                  <td className="py-5 leading-6">{test}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="border-t pt-7">
        <p className="editorial-kicker">Research workflow</p>
        <h2 className="display mt-4 text-4xl">From source to published finding</h2>
        <ol className="mt-9 divide-y border-y">
          {workflow.map(([number, title, text]) => (
            <li
              key={title}
              className="grid gap-3 py-5 sm:grid-cols-[4rem_10rem_1fr] sm:items-baseline"
            >
              <span className="text-xs tabular-nums text-cyan">{number}</span>
              <strong>{title}</strong>
              <span className="leading-7 text-slate-400">{text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-10 border-t pt-7 lg:grid-cols-[.65fr_1.35fr]">
        <div>
          <p className="editorial-kicker">Questions and limitations</p>
          <h2 className="display mt-4 text-4xl">Answered plainly</h2>
        </div>
        <div className="divide-y border-y">
          {faqs.map(([question, answer], index) => (
            <details key={question} open={index === 0} className="group py-5">
              <summary className="cursor-pointer list-none font-semibold marker:hidden">
                <span className="flex items-center justify-between gap-5">
                  {question}
                  <span className="text-cyan group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-4 max-w-3xl leading-7 text-slate-400">{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
