"use client";

import { useState } from "react";
import { ChevronDown, ExternalLink, ShieldAlert } from "lucide-react";
import type { CompanyRisk, RiskLevel } from "@/lib/company-intelligence";

const levelColor: Record<RiskLevel, string> = {
  Low: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  Moderate: "text-sky-300 border-sky-300/30 bg-sky-300/10",
  Elevated: "text-amber-300 border-amber-300/30 bg-amber-300/10",
  High: "text-rose-300 border-rose-300/30 bg-rose-300/10",
};

export function CompanyRiskAnalysis({
  companyName,
  profile,
  risks,
}: {
  companyName: string;
  profile: RiskLevel;
  risks: CompanyRisk[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <section id="risks" className="mt-16 scroll-mt-40" aria-labelledby="risk-analysis-title">
      <div className="flex flex-col gap-5 border-y py-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs uppercase tracking-[.18em] text-amber-300">
            <ShieldAlert className="size-4" /> Impact Horizon analysis
          </p>
          <h2 id="risk-analysis-title" className="display mt-3 text-4xl">Risk Analysis</h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-400">
            Sector-relevant exposures for {companyName}, interpreted against the current peer data.
            Inclusion is not evidence that an adverse event occurred and does not change the CSR score.
          </p>
          <p className="mt-4 text-sm text-slate-300">
            Risk profile: <strong className="text-white">{profile} Risk</strong>
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="company-risk-details"
          className="button-secondary shrink-0"
        >
          {open ? "Hide Risk Analysis" : "View Risk Analysis"}
          <ChevronDown className={`size-4 transition ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
      {open && (
        <div id="company-risk-details" className="mt-7 grid gap-5 lg:grid-cols-2">
          {risks.map((risk) => (
            <article className="surface-card" key={risk.category}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    {risk.frameworkPillar} framework connection
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">{risk.category}</h3>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${levelColor[risk.level]}`}>
                  {risk.level}
                </span>
              </div>
              <dl className="mt-6 space-y-5 text-sm leading-6">
                <div>
                  <dt className="font-semibold text-white">Why It Matters</dt>
                  <dd className="mt-1 text-slate-400">{risk.whyItMatters}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-white">Company Data & Evidence</dt>
                  <dd className="mt-1 text-slate-400">{risk.evidence}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-cyan">Impact Horizon Analysis</dt>
                  <dd className="mt-1 text-slate-300">{risk.analysis}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-white">Potential Implication</dt>
                  <dd className="mt-1 text-slate-400">{risk.potentialImplication}</dd>
                </div>
              </dl>
              <a
                href={risk.source.url}
                target="_blank"
                rel="noreferrer"
                className="focus-ring mt-6 inline-flex items-center gap-2 border-t pt-5 text-sm text-cyan hover:text-white"
              >
                {risk.source.title} · {risk.source.organization}
                <ExternalLink className="size-3.5" />
              </a>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
