"use client";
import { useMemo, useState } from "react";
import { Download, Plus, X } from "lucide-react";
import { companies } from "@/lib/data";
import {
  InteractiveBarChart,
  InteractiveLineChart,
  MultiRadarChart,
} from "@/components/impact/charts";
import { SectionTitle } from "@/components/ui/primitives";
import { useMemberData } from "@/components/member/member-data";

export function CompanyComparison() {
  const [selected, setSelected] = useState(["microsoft", "salesforce"]);
  const { recordActivity } = useMemberData();
  const compared = selected
    .map((slug) => companies.find((company) => company.slug === slug))
    .filter(Boolean) as typeof companies;
  const ranks = useMemo(
    () =>
      new Map(
        [...companies]
          .sort((a, b) => b.score - a.score)
          .map((company, index) => [company.slug, index + 1]),
      ),
    [],
  );
  const addCompany = () => {
    const available = companies.find((company) => !selected.includes(company.slug));
    if (available && selected.length < 6) setSelected([...selected, available.slug]);
  };
  const savePdf = () => {
    recordActivity({
      type: "comparison",
      slug: selected.join("-vs-"),
      title: compared.map((company) => company.name).join(" vs. "),
      href: "/compare",
    });
    window.print();
  };
  return (
    <section className="page-shell">
      <SectionTitle
        eyebrow="Comparative analysis"
        title="Compare up to six companies."
        text="Inspect scores, percentiles, trends, initiatives, and pillar performance through one consistent research lens."
      />
      <div className="mt-10 flex flex-wrap gap-3">
        {selected.map((value, index) => (
          <label key={`${value}-${index}`} className="relative">
            <span className="sr-only">Company {index + 1}</span>
            <select
              aria-label={`Company ${index + 1}`}
              className="focus-ring min-w-52 rounded-lg border bg-panel px-4 py-3 pr-10"
              value={value}
              onChange={(event) =>
                setSelected(
                  selected.map((item, itemIndex) =>
                    itemIndex === index ? event.target.value : item,
                  ),
                )
              }
            >
              {companies.map((company) => (
                <option
                  disabled={selected.includes(company.slug) && company.slug !== value}
                  value={company.slug}
                  key={company.slug}
                >
                  {company.name} ({company.ticker})
                </option>
              ))}
            </select>
            {selected.length > 2 && (
              <button
                onClick={() => setSelected(selected.filter((_, itemIndex) => itemIndex !== index))}
                aria-label={`Remove ${compared[index]?.name}`}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-zinc-500 hover:text-white"
              >
                <X className="size-4" />
              </button>
            )}
          </label>
        ))}
        {selected.length < 6 && (
          <button onClick={addCompany} className="button-secondary">
            <Plus className="size-4" /> Add company
          </button>
        )}
        <button onClick={savePdf} className="button-secondary">
          <Download className="size-4" /> Download PDF
        </button>
      </div>
      <div className="mt-7 overflow-x-auto rounded-2xl border">
        <div
          className="grid min-w-[720px]"
          style={{ gridTemplateColumns: `12rem repeat(${compared.length}, minmax(9rem, 1fr))` }}
        >
          <div className="border-b bg-panel p-5" />
          {compared.map((company) => (
            <strong className="border-b bg-panel p-5 text-center" key={company.slug}>
              {company.name}
            </strong>
          ))}
          {[
            ["Overall score", ...compared.map((company) => company.score)],
            ["Industry rank", ...compared.map((company) => `#${ranks.get(company.slug)}`)],
            [
              "Index percentile",
              ...compared.map(
                (company) =>
                  `${Math.round((1 - ((ranks.get(company.slug) ?? 1) - 1) / companies.length) * 100)}th`,
              ),
            ],
            ["Revenue", ...compared.map((company) => `$${company.revenueBillions}B`)],
            ["Employees", ...compared.map((company) => company.employees.toLocaleString())],
            ...Object.keys(compared[0]?.pillars ?? {}).map((pillar) => [
              pillar,
              ...compared.map((company) => company.pillars[pillar as keyof typeof company.pillars]),
            ]),
          ].map((row) => (
            <div className="contents" key={String(row[0])}>
              {row.map((value, index) => (
                <div
                  className={`border-b p-5 ${index ? "text-center font-semibold text-cyan" : "text-zinc-400"}`}
                  key={`${row[0]}-${index}`}
                >
                  {value}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-panel p-6">
          <MultiRadarChart
            title="Responsibility profile"
            description="Shape comparison across all Impact500 pillars."
            data={Object.keys(compared[0]?.pillars ?? {}).map((subject) => ({
              subject,
              ...Object.fromEntries(
                compared.map((company) => [
                  company.name,
                  company.pillars[subject as keyof typeof company.pillars],
                ]),
              ),
            }))}
            series={compared.map((company) => ({ key: company.name, label: company.name }))}
          />
        </div>
        <div className="rounded-2xl border bg-panel p-6">
          <InteractiveBarChart
            title="Pillar comparison"
            description="Direct comparison across the four Impact500 pillars."
            data={Object.keys(compared[0]?.pillars ?? {}).map((label) => ({
              label,
              ...Object.fromEntries(
                compared.map((company) => [
                  company.name,
                  company.pillars[label as keyof typeof company.pillars],
                ]),
              ),
            }))}
            series={compared.map((company) => ({ key: company.name, label: company.name }))}
          />
        </div>
        <div className="rounded-2xl border bg-panel p-6">
          <InteractiveLineChart
            title="Historical trend"
            description="Published Impact500 scores by research cycle."
            data={[2021, 2022, 2023, 2024, 2025, 2026].map((year) => ({
              label: String(year),
              ...Object.fromEntries(
                compared.map((company) => [
                  company.name,
                  company.historicalScores.find((point) => point.year === year)?.score ?? 0,
                ]),
              ),
            }))}
            series={compared.map((company) => ({ key: company.name, label: company.name }))}
          />
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {compared.map((company) => (
          <article className="rounded-2xl border bg-panel p-6" key={company.slug}>
            <p className="text-xs uppercase tracking-wider text-cyan">
              {company.ticker} · Research context
            </p>
            <h2 className="mt-3 text-xl font-semibold">{company.name}</h2>
            <h3 className="mt-6 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Strengths
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-zinc-400">
              {company.strengths.slice(0, 2).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h3 className="mt-6 text-xs font-semibold uppercase tracking-wider text-amber-400">
              Watch areas
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-zinc-400">
              {company.weaknesses.slice(0, 2).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h3 className="mt-6 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Key initiative
            </h3>
            <p className="mt-3 text-sm text-zinc-400">{company.initiatives[0]?.title}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
