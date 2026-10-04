"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Company } from "@/lib/domain/types";
import { CompanyLogo } from "@/components/impact/company-logo";
import { InteractiveLineChart, MultiRadarChart } from "@/components/impact/charts";
import { average, formatIndustryNumber } from "@/lib/industry-data";

type IndustrySummary = {
  slug: string;
  name: string;
  score: number;
  change: number;
  pillars: Company["pillars"];
};

export function IndustryTrendExplorer({ companies }: { companies: Company[] }) {
  const [range, setRange] = useState(5);
  const years = useMemo(
    () =>
      [
        ...new Set(companies.flatMap((company) => company.historicalScores.map((p) => p.year))),
      ].sort(),
    [companies],
  );
  const availableYears = years.slice(-range);
  const data = availableYears.flatMap((year) => {
    const score = average(
      companies.map(
        (company) => company.historicalScores.find((point) => point.year === year)?.score,
      ),
    );
    return score === null ? [] : [{ label: String(year), score }];
  });
  const unavailable = range > years.length;

  return (
    <section aria-labelledby="industry-trends-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-cyan">Industry trends</p>
          <h2 id="industry-trends-title" className="display mt-3 text-4xl">
            Performance over time
          </h2>
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Select trend time range">
          {[5, 10, 15, 20, 25].map((years) => (
            <button
              key={years}
              type="button"
              aria-pressed={range === years}
              onClick={() => setRange(years)}
              className={
                range === years ? "button-primary px-3 py-2" : "button-secondary px-3 py-2"
              }
            >
              {years}-year
            </button>
          ))}
        </div>
      </div>
      {unavailable && (
        <p
          className="mt-5 rounded-xl border border-amber-300/30 bg-amber-300/5 p-4 text-sm text-amber-100"
          role="status"
        >
          A {range}-year series is unavailable. The chart shows all {years.length} published annual
          observations without estimating missing years.
        </p>
      )}
      <div className="surface-card mt-6">
        {data.length ? (
          <InteractiveLineChart
            area
            title="Historical CSR score"
            description="Annual average calculated from published company score histories in this industry."
            data={data}
            series={[{ key: "score", label: "Industry average" }]}
          />
        ) : (
          <p className="grid min-h-64 place-items-center text-sm text-slate-400">
            Historical data unavailable
          </p>
        )}
      </div>
      <p className="mt-4 text-sm text-slate-400">
        Historical pillar-level series are unavailable in the current dataset; environmental,
        ethics, philanthropy, and financial-responsibility trends are therefore not estimated.
      </p>
    </section>
  );
}

export function IndustryCompanyDirectory({ companies }: { companies: Company[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("score-desc");
  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return [...companies]
      .filter((company) =>
        `${company.name} ${company.headquarters} ${company.ceo ?? ""} ${company.founded ?? ""}`
          .toLowerCase()
          .includes(normalized),
      )
      .sort((a, b) => {
        if (sort === "rank-asc") return (a.fortuneRank ?? Infinity) - (b.fortuneRank ?? Infinity);
        if (sort === "name-asc") return a.name.localeCompare(b.name);
        if (sort === "trend-desc") return b.change - a.change;
        if (sort === "founded-asc") return (a.founded ?? Infinity) - (b.founded ?? Infinity);
        if (sort === "founded-desc") return (b.founded ?? 0) - (a.founded ?? 0);
        return b.score - a.score;
      });
  }, [companies, query, sort]);
  const industryRanks = useMemo(
    () =>
      new Map(
        [...companies]
          .sort((a, b) => b.score - a.score)
          .map((company, index) => [company.slug, index + 1]),
      ),
    [companies],
  );

  return (
    <section aria-labelledby="company-directory-title">
      <p className="text-xs uppercase tracking-wider text-cyan">Company directory</p>
      <h2 id="company-directory-title" className="display mt-3 text-4xl">
        Companies in this industry
      </h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="grid gap-2 text-sm text-slate-300">
          Search companies
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="form-control"
            placeholder="Company, headquarters, or CEO"
          />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          Sort by
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="form-control"
          >
            <option value="score-desc">CSR score</option>
            <option value="rank-asc">Fortune rank</option>
            <option value="trend-desc">Trend</option>
            <option value="name-asc">Company name</option>
            <option value="founded-asc">Founded: oldest first</option>
            <option value="founded-desc">Founded: newest first</option>
          </select>
        </label>
      </div>
      <p className="mt-4 text-sm text-slate-400" role="status">
        Showing {visible.length} of {companies.length} companies.
      </p>
      <div className="mt-5 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[94rem] text-left text-sm">
          <thead className="bg-white/[.04] text-xs uppercase tracking-wider text-slate-400">
            <tr>
              <th className="p-4">Rank</th>
              <th className="p-4">Company</th>
              <th className="p-4">Fortune rank</th>
              <th className="p-4">CSR score</th>
              <th className="p-4">Grade</th>
              <th className="p-4">Environmental</th>
              <th className="p-4">Financial</th>
              <th className="p-4">Philanthropy</th>
              <th className="p-4">Ethics</th>
              <th className="p-4">Headquarters</th>
              <th className="p-4">CEO</th>
              <th className="p-4">Founded</th>
              <th className="p-4">Profile</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((company) => (
              <tr key={company.slug} className="border-t border-white/10">
                <td className="p-4 tabular-nums text-slate-500">
                  {industryRanks.get(company.slug) ?? "Data unavailable"}
                </td>
                <th className="p-4 font-medium">
                  <Link
                    href={`/companies/${company.slug}`}
                    className="flex items-center gap-3 hover:text-cyan"
                  >
                    <CompanyLogo
                      name={company.name}
                      website={company.website}
                      logo={company.logo}
                    />
                    {company.name}
                  </Link>
                </th>
                <td className="p-4">{company.fortuneRank ?? "Data unavailable"}</td>
                <td className="p-4">{formatIndustryNumber(company.score)}</td>
                <td className="p-4">{company.grade || "Data unavailable"}</td>
                <td className="p-4">{formatIndustryNumber(company.pillars.Environmental)}</td>
                <td className="p-4">
                  {formatIndustryNumber(company.pillars["Financial responsibility"])}
                </td>
                <td className="p-4">{formatIndustryNumber(company.pillars.Philanthropy)}</td>
                <td className="p-4">{formatIndustryNumber(company.pillars.Ethics)}</td>
                <td className="p-4">{company.headquarters}</td>
                <td className="p-4">{company.executive?.name ?? "Data unavailable"}</td>
                <td className="p-4">{company.founded ?? "Data unavailable"}</td>
                <td className="p-4">
                  <Link
                    className="button-secondary whitespace-nowrap px-3 py-2"
                    href={`/companies/${company.slug}`}
                  >
                    View profile<span className="sr-only"> for {company.name}</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function IndustryComparison({ industries }: { industries: IndustrySummary[] }) {
  const defaults = industries.slice(0, 3).map((industry) => industry.slug);
  const [selected, setSelected] = useState(defaults);
  const compared = selected
    .map((slug) => industries.find((industry) => industry.slug === slug))
    .filter((value): value is IndustrySummary => Boolean(value));
  const data = [
    ["CSR score", (item: IndustrySummary) => item.score],
    ["Environmental", (item: IndustrySummary) => item.pillars.Environmental],
    ["Financial", (item: IndustrySummary) => item.pillars["Financial responsibility"]],
    ["Philanthropy", (item: IndustrySummary) => item.pillars.Philanthropy],
    ["Ethics", (item: IndustrySummary) => item.pillars.Ethics],
  ].map(([subject, getter]) => ({
    subject: String(subject),
    ...Object.fromEntries(
      compared.map((item) => [item.slug, (getter as (i: IndustrySummary) => number)(item)]),
    ),
  }));

  return (
    <section className="surface-card mt-10" aria-labelledby="industry-comparison-title">
      <h2 id="industry-comparison-title" className="display text-4xl">
        Compare industries
      </h2>
      <p className="mt-3 text-sm text-slate-400">
        Select up to three industries for a comparable current-score view.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <label key={index} className="grid gap-2 text-sm text-slate-300">
            Industry {index + 1}
            <select
              className="form-control"
              value={selected[index] ?? ""}
              onChange={(event) => {
                const next = [...selected];
                next[index] = event.target.value;
                setSelected(next);
              }}
            >
              {industries.map((industry) => (
                <option key={industry.slug} value={industry.slug}>
                  {industry.name}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div className="mt-7">
        <MultiRadarChart
          title="Industry responsibility comparison"
          description="Current averages calculated from the published companies in each selected industry. Governance is unavailable as a separate scored pillar."
          data={data}
          series={compared.map((industry) => ({ key: industry.slug, label: industry.name }))}
        />
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Historical growth:{" "}
        {compared
          .map((item) => `${item.name} ${item.change >= 0 ? "+" : ""}${item.change.toFixed(1)}`)
          .join(" · ")}
      </p>
    </section>
  );
}
