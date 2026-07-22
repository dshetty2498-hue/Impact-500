"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Search, SlidersHorizontal } from "lucide-react";
import { companies } from "@/lib/data";
import { Score } from "@/components/ui/primitives";

type SortMode = "score-desc" | "score-asc" | "alphabetical" | "newest" | "improved" | "fortune";

export function CompanyTable({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("All");
  const [grade, setGrade] = useState("All");
  const [scoreRange, setScoreRange] = useState("0");
  const [revenue, setRevenue] = useState("0");
  const [size, setSize] = useState("0");
  const [headquarters, setHeadquarters] = useState("");
  const [researchOnly, setResearchOnly] = useState(false);
  const [pillarMinimums, setPillarMinimums] = useState({
    environmental: 0,
    philanthropy: 0,
    ethics: 0,
    financial: 0,
  });
  const [sort, setSort] = useState<SortMode>("score-desc");
  const [advanced, setAdvanced] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = compact ? 6 : 20;
  const industries = useMemo(() => [...new Set(companies.map((c) => c.industry))], []);
  const grades = useMemo(() => [...new Set(companies.map((c) => c.grade))], []);
  const rows = useMemo(() => {
    const filtered = companies.filter((company) => {
      const haystack =
        `${company.name} ${company.ticker} ${company.industry} ${company.headquarters} ${Object.entries(company.pillars).map(([pillar, score]) => `${pillar} ${score}`).join(" ")} ${company.fortuneRank ? `fortune ${company.fortuneRank}` : "not ranked private"}`.toLowerCase();
      return (
        (industry === "All" || company.industry === industry) &&
        (grade === "All" || company.grade === grade) &&
        company.score >= Number(scoreRange) &&
        company.revenueBillions >= Number(revenue) &&
        company.employees >= Number(size) &&
        (!headquarters ||
          company.headquarters.toLowerCase().includes(headquarters.toLowerCase())) &&
        (!researchOnly || company.sources.length > 0) &&
        company.pillars.Environmental >= pillarMinimums.environmental &&
        company.pillars.Philanthropy >= pillarMinimums.philanthropy &&
        company.pillars.Ethics >= pillarMinimums.ethics &&
        company.pillars["Financial responsibility"] >= pillarMinimums.financial &&
        haystack.includes(query.toLowerCase())
      );
    });
    return filtered.sort((a, b) => {
      if (sort === "score-asc") return a.score - b.score;
      if (sort === "alphabetical") return a.name.localeCompare(b.name);
      if (sort === "newest") return b.lastReviewed.localeCompare(a.lastReviewed);
      if (sort === "improved") return b.change - a.change;
      if (sort === "fortune") return (a.fortuneRank ?? 9999) - (b.fortuneRank ?? 9999);
      return b.score - a.score;
    });
  }, [
    grade,
    headquarters,
    industry,
    pillarMinimums,
    query,
    researchOnly,
    revenue,
    scoreRange,
    size,
    sort,
  ]);
  const pages = Math.max(1, Math.ceil(rows.length / perPage));
  const visible = compact
    ? rows.slice(0, perPage)
    : rows.slice((page - 1) * perPage, page * perPage);
  const update =
    (setter: (value: string) => void) =>
    (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      setter(event.target.value);
      setPage(1);
    };
  const exportCsv = () => {
    const escape = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
    const content = [
      "Rank,Company,Ticker,Industry,Headquarters,Fortune Rank,Fortune Year,Revenue ($B),Employees,Score,Grade,Trend",
      ...rows.map((company, index) =>
        [
          index + 1,
          company.name,
          company.ticker,
          company.industry,
          company.headquarters,
          company.fortuneRank ?? "Not ranked",
          company.fortuneRankYear,
          company.revenueBillions,
          company.employees,
          company.score,
          company.grade,
          company.change,
        ]
          .map(escape)
          .join(","),
      ),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "impact500-company-research.csv";
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="enterprise-table overflow-hidden rounded-[1.75rem] border bg-panel/80 shadow-2xl shadow-black/20 backdrop-blur-sm">
      <div className="border-b bg-white/[.018] p-5 md:p-6">
        <div className="flex flex-col gap-3 lg:flex-row">
          <label className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
            <span className="sr-only">Search companies, industries, or tickers</span>
            <input
              value={query}
              onChange={update(setQuery)}
              placeholder="Search company, ticker, industry, or location"
              className="focus-ring w-full rounded-xl border bg-ink/60 py-3.5 pl-10 pr-3 text-sm shadow-inner shadow-black/10 transition hover:border-white/20"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <select
              value={industry}
              onChange={update(setIndustry)}
              aria-label="Filter by industry"
              className="focus-ring min-w-36 flex-1 rounded-xl border bg-ink/60 px-4 py-3.5 text-sm transition hover:border-white/20"
            >
              <option>All</option>
              {industries.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select
              value={grade}
              onChange={update(setGrade)}
              aria-label="Filter by grade"
              className="focus-ring rounded-xl border bg-ink/60 px-4 py-3.5 text-sm transition hover:border-white/20"
            >
              <option>All</option>
              {grades.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            {!compact && (
              <button
                onClick={() => setAdvanced((value) => !value)}
                aria-expanded={advanced}
                className="button-secondary"
              >
                <SlidersHorizontal className="size-4" /> Filters
              </button>
            )}
            {!compact && (
              <button onClick={exportCsv} className="button-secondary">
                <Download className="size-4" /> CSV
              </button>
            )}
          </div>
        </div>
        {!compact && advanced && (
          <div className="mt-4 grid gap-3 rounded-xl border bg-ink/40 p-4 sm:grid-cols-2 lg:grid-cols-5">
            <FilterSelect
              label="Minimum score"
              value={scoreRange}
              onChange={update(setScoreRange)}
              options={[
                ["Any", "0"],
                ["70+", "70"],
                ["80+", "80"],
                ["90+", "90"],
              ]}
            />
            <FilterSelect
              label="Minimum revenue"
              value={revenue}
              onChange={update(setRevenue)}
              options={[
                ["Any", "0"],
                ["$10B+", "10"],
                ["$100B+", "100"],
                ["$500B+", "500"],
              ]}
            />
            <FilterSelect
              label="Company size"
              value={size}
              onChange={update(setSize)}
              options={[
                ["Any", "0"],
                ["10K+", "10000"],
                ["100K+", "100000"],
                ["500K+", "500000"],
              ]}
            />
            <label className="text-xs text-zinc-500">
              Headquarters
              <input
                value={headquarters}
                onChange={update(setHeadquarters)}
                placeholder="State or city"
                className="focus-ring mt-2 w-full rounded-lg border bg-panel px-3 py-2 text-sm text-white"
              />
            </label>
            <label className="text-xs text-zinc-500">
              Sort by
              <select
                value={sort}
                onChange={update((value) => setSort(value as SortMode))}
                className="focus-ring mt-2 w-full rounded-lg border bg-panel px-3 py-2 text-sm text-white"
              >
                <option value="score-desc">Highest score</option>
                <option value="score-asc">Lowest score</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="newest">Newest research</option>
                <option value="improved">Most improved</option>
                <option value="fortune">Fortune rank</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={researchOnly}
                onChange={(event) => {
                  setResearchOnly(event.target.checked);
                  setPage(1);
                }}
                className="accent-cyan"
              />{" "}
              Research available
            </label>
            {(
              [
                ["environmental", "Environmental"],
                ["philanthropy", "Philanthropy"],
                ["ethics", "Ethics"],
                ["financial", "Financial responsibility"],
              ] as const
            ).map(([key, label]) => (
              <label className="text-xs text-zinc-500" key={key}>
                {label}
                <span className="mt-2 flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="95"
                    step="5"
                    value={pillarMinimums[key]}
                    onChange={(event) => {
                      setPillarMinimums({ ...pillarMinimums, [key]: Number(event.target.value) });
                      setPage(1);
                    }}
                    className="min-w-0 flex-1 accent-cyan"
                    aria-label={`Minimum ${label} score`}
                  />
                  <span className="w-7 text-right text-cyan">{pillarMinimums[key]}</span>
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
      <div className="sticky top-[5.25rem] z-10 hidden grid-cols-[3rem_1.3fr_.7fr_1fr_1.1fr_.6fr] gap-5 border-b bg-panel/95 px-6 py-4 text-xs font-semibold uppercase tracking-[.14em] text-zinc-400 backdrop-blur md:grid">
        <span>Rank</span>
        <span>Company</span>
        <span>Ticker</span>
        <span>Industry</span>
        <span>Score</span>
        <span>Trend</span>
      </div>
      <div className="divide-y">
        {visible.map((company) => (
          <Link
            href={`/companies/${company.slug}`}
            key={company.slug}
            className="focus-ring group grid gap-5 px-6 py-6 transition duration-300 hover:bg-gradient-to-r hover:from-accent/[.07] hover:to-transparent md:grid-cols-[3rem_1.3fr_.7fr_1fr_1.1fr_.6fr] md:items-center"
          >
            <span className="text-sm text-zinc-600">
              {String(rows.indexOf(company) + 1).padStart(2, "0")}
            </span>
            <span>
              <strong className="block text-base font-semibold tracking-tight transition group-hover:text-cyan md:text-lg">{company.name}</strong>
              <small className="text-zinc-500 md:hidden">
                {company.ticker} · {company.industry}
              </small>
            </span>
            <span className="hidden text-sm text-zinc-400 md:block">{company.ticker}</span>
            <span className="hidden text-sm text-zinc-400 md:block">{company.industry}</span>
            <span className="flex items-center gap-3">
              <span className="hidden h-1.5 flex-1 overflow-hidden rounded-full bg-white/10 lg:block">
                <span
                  className="score-fill block h-full rounded-full bg-gradient-to-r from-accent via-blue-400 to-cyan shadow-[0_0_12px_rgb(110_231_249/.25)]"
                  style={{ width: `${company.score}%` }}
                />
              </span>
              <Score score={company.score} grade={company.grade} />
            </span>
            <span className="text-sm font-medium text-emerald-400">+{company.change}% ↗</span>
          </Link>
        ))}
        {!visible.length && (
          <div className="p-12 text-center">
            <p className="font-medium">No companies match these filters</p>
            <button
              onClick={() => {
                setQuery("");
                setIndustry("All");
                setGrade("All");
                setScoreRange("0");
                setRevenue("0");
                setSize("0");
                setHeadquarters("");
                setResearchOnly(false);
                setPillarMinimums({ environmental: 0, philanthropy: 0, ethics: 0, financial: 0 });
              }}
              className="mt-3 text-sm text-cyan"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
      {!compact && rows.length > 0 && (
        <div className="flex items-center justify-between border-t px-5 py-4">
          <p className="text-xs text-zinc-500">
            Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, rows.length)} of{" "}
            {rows.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((value) => value - 1)}
              aria-label="Previous page"
              className="focus-ring rounded-lg border p-2 disabled:opacity-30"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="text-xs text-zinc-400">
              {page} / {pages}
            </span>
            <button
              disabled={page === pages}
              onClick={() => setPage((value) => value + 1)}
              aria-label="Next page"
              className="focus-ring rounded-lg border p-2 disabled:opacity-30"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: [string, string][];
}) {
  return (
    <label className="text-xs text-zinc-500">
      {label}
      <select
        value={value}
        onChange={onChange}
        className="focus-ring mt-2 w-full rounded-lg border bg-panel px-3 py-2 text-sm text-white"
      >
        {options.map(([name, option]) => (
          <option value={option} key={option}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
}
