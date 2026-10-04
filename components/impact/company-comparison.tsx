"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Check, Download, Plus, Search, X } from "lucide-react";
import { companies } from "@/lib/data";
import {
  InteractiveBarChart,
  InteractiveLineChart,
  MultiRadarChart,
} from "@/components/impact/charts";
import { SectionTitle } from "@/components/ui/primitives";
import { useMemberData } from "@/components/member/member-data";
import { CompanyLogo } from "@/components/impact/company-logo";
import { rankCompanies } from "@/lib/scoring";
import { companyRiskAnalysis } from "@/lib/company-intelligence";
import { currentResearchCycle, previousResearchCycle } from "@/data/research-cycles";

export function CompanyComparison() {
  const [selected, setSelected] = useState(["microsoft", "salesforce"]);
  const { recordActivity } = useMemberData();
  const compared = selected
    .map((slug) => companies.find((company) => company.slug === slug))
    .filter(Boolean) as typeof companies;
  const ranks = useMemo(
    () =>
      new Map(
        rankCompanies(companies).map(({ company, rank }) => [company.slug, rank]),
      ),
    [],
  );
  const addCompany = () => {
    const available = companies.find((company) => !selected.includes(company.slug));
    if (available && selected.length < 6) setSelected([...selected, available.slug]);
  };
  const historicalYears = useMemo(
    () =>
      [...new Set(compared.flatMap((company) => company.historicalScores.map((point) => point.year)))].sort(),
    [compared],
  );
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
          <div key={`${value}-${index}`} className="relative flex items-center gap-1">
            <CompanyPicker
              value={value}
              selected={selected}
              label={`Company ${index + 1}`}
              onChange={(next) =>
                setSelected(selected.map((item, itemIndex) => (itemIndex === index ? next : item)))
              }
            />
            {selected.length > 2 && (
              <button
                onClick={() => setSelected(selected.filter((_, itemIndex) => itemIndex !== index))}
                aria-label={`Remove ${compared[index]?.name}`}
                className="focus-ring rounded-lg border p-3 text-zinc-500 hover:border-rose-400/30 hover:text-rose-300"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
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
            <strong
              className="flex flex-col items-center gap-3 border-b bg-panel p-5 text-center"
              key={company.slug}
            >
              <CompanyLogo
                name={company.name}
                website={company.website}
                logo={company.logo}
                size="lg"
              />
              {company.name}
            </strong>
          ))}
          {[
            ["Published cycle", ...compared.map(() => previousResearchCycle.dateLabel)],
            [
              "Current review",
              ...compared.map(() =>
                currentResearchCycle.status === "complete" ? "Complete" : "Pending validation",
              ),
            ],
            ["CEO", ...compared.map((company) => company.executive?.name ?? "")],
            ["CEO title", ...compared.map((company) => company.executive?.title ?? "")],
            [
              "Founded",
              ...compared.map((company) => company.founded ?? "Data unavailable"),
            ],
            ["Published overall score", ...compared.map((company) => company.score)],
            ["Published index rank", ...compared.map((company) => `#${ranks.get(company.slug)}`)],
            [
              "Score change (last publication)",
              ...compared.map((company) => `${company.change > 0 ? "+" : ""}${company.change}`),
            ],
            [
              "Risk profile",
              ...compared.map((company) => companyRiskAnalysis(company, companies).profile),
            ],
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
            data={historicalYears.map((year) => ({
              label: String(year),
              ...Object.fromEntries(
                compared.map((company) => [
                  company.name,
                  company.historicalScores.find((point) => point.year === year)?.score,
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
            <CompanyLogo
              name={company.name}
              website={company.website}
              logo={company.logo}
              size="lg"
            />
            <p className="text-xs uppercase tracking-wider text-cyan">
              {company.ticker} · Research context
            </p>
            <h2 className="mt-3 text-xl font-semibold">{company.name}</h2>
            <p className="mt-2 text-sm text-zinc-400">
              <span className="text-zinc-500">CEO:</span> {company.executive?.name}
            </p>
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
            <Link
              href={`/companies/${company.slug}`}
              className="mt-6 inline-flex text-sm font-semibold text-cyan hover:text-white"
            >
              View company profile →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

function CompanyPicker({
  value,
  selected,
  label,
  onChange,
}: {
  value: string;
  selected: string[];
  label: string;
  onChange: (slug: string) => void;
}) {
  const current = companies.find((company) => company.slug === value);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const options = useMemo(() => {
    const term = query.trim().toLowerCase();
    return companies
      .filter(
        (company) =>
          (!selected.includes(company.slug) || company.slug === value) &&
          (!term ||
            `${company.name} ${company.ticker} ${company.executive?.name ?? ""} ${company.industry}`
              .toLowerCase()
              .includes(term)),
      )
      .slice(0, 12);
  }, [query, selected, value]);
  return (
    <div className="relative">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((state) => !state)}
        className="focus-ring min-w-56 rounded-xl border bg-panel px-4 py-3 text-left hover:border-cyan/40"
      >
        <strong className="block text-sm">{current?.name}</strong>
        <small className="text-zinc-500">
          {current?.ticker} · {current?.industry}
        </small>
      </button>
      {open && (
        <div className="absolute left-0 top-[calc(100%+.5rem)] z-40 w-80 overflow-hidden rounded-2xl border bg-ink p-2 shadow-2xl shadow-black/40">
          <label className="relative block">
            <span className="sr-only">Search companies</span>
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => event.key === "Escape" && setOpen(false)}
              placeholder="Search 500+ companies…"
              className="focus-ring w-full rounded-xl border bg-panel py-3 pl-9 pr-3 text-sm"
            />
          </label>
          <div className="mt-2 max-h-72 overflow-y-auto">
            {options.map((company) => (
              <button
                type="button"
                key={company.slug}
                onClick={() => {
                  onChange(company.slug);
                  setOpen(false);
                  setQuery("");
                }}
                className="focus-ring flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left hover:bg-white/5"
              >
                <span className="flex items-center gap-3">
                  <CompanyLogo name={company.name} website={company.website} logo={company.logo} />
                  <span>
                    <strong className="block text-sm">{company.name}</strong>
                    <small className="text-zinc-500">
                      {company.ticker} · {company.industry}
                    </small>
                  </span>
                </span>
                {company.slug === value && <Check className="size-4 text-cyan" />}
              </button>
            ))}
            {!options.length && (
              <p className="px-3 py-6 text-center text-sm text-zinc-500">No companies found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
