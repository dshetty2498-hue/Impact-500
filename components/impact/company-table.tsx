"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { companies } from "@/lib/data";
import { GradeBadge } from "@/components/ui/primitives";
import { CompanyLogo } from "@/components/impact/company-logo";
import { gradingScale } from "@/lib/grading";
import { rankCompanies } from "@/lib/scoring";

const publishedRanks = new Map(
  rankCompanies(companies).map(({ company, rank }) => [company.slug, rank]),
);

type SortMode =
  | "score-desc"
  | "score-asc"
  | "alphabetical"
  | "newest"
  | "founded-oldest"
  | "founded-newest"
  | "fortune"
  | "headquarters"
  | "environmental"
  | "financial"
  | "ethics"
  | "philanthropy";

export function CompanyTable({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("All");
  const [grade, setGrade] = useState("All");
  const [scoreRange, setScoreRange] = useState("0");
  const [revenue, setRevenue] = useState("0");
  const [size, setSize] = useState("0");
  const [state, setState] = useState("All");
  const [headquarters, setHeadquarters] = useState("");
  const [foundedSince, setFoundedSince] = useState("0");
  const [researchOnly, setResearchOnly] = useState(false);
  const [pillarMinimums, setPillarMinimums] = useState({
    environmental: 0,
    philanthropy: 0,
    ethics: 0,
    financial: 0,
  });
  const [sort, setSort] = useState<SortMode>("score-desc");
  const [fortuneBand, setFortuneBand] = useState("All");
  const [advanced, setAdvanced] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = compact ? 6 : 20;
  const industries = useMemo(() => [...new Set(companies.map((c) => c.industry))], []);
  const states = useMemo(
    () =>
      [...new Set(companies.map((company) => company.location.split(", ").at(-1) ?? ""))]
        .filter(Boolean)
        .sort(),
    [],
  );
  const grades = gradingScale.map((item) => item.grade);
  const rows = useMemo(() => {
    const filtered = companies.filter((company) => {
      const haystack =
        `${company.name} ${company.ticker} ${company.executive?.name ?? ""} ${company.industry} ${company.headquarters} ${Object.entries(
          company.pillars,
        )
          .map(([pillar, score]) => `${pillar} ${score}`)
          .join(
            " ",
          )} ${company.fortuneRank ? `fortune ${company.fortuneRank}` : "not ranked private"}`.toLowerCase();
      return (
        (industry === "All" || company.industry === industry) &&
        (fortuneBand === "All" ||
          (company.fortuneRank !== null &&
            company.fortuneRank >= Number(fortuneBand.split("-")[0]) &&
            company.fortuneRank <= Number(fortuneBand.split("-")[1]))) &&
        (grade === "All" || company.grade === grade) &&
        company.score >= Number(scoreRange) &&
        company.revenueBillions >= Number(revenue) &&
        company.employees >= Number(size) &&
        (foundedSince === "0" ||
          (company.founded !== null && company.founded >= Number(foundedSince))) &&
        (state === "All" || company.location.split(", ").at(-1) === state) &&
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
      if (sort === "founded-oldest") return (a.founded ?? 9999) - (b.founded ?? 9999);
      if (sort === "founded-newest") return (b.founded ?? 0) - (a.founded ?? 0);
      if (sort === "fortune") return (a.fortuneRank ?? 9999) - (b.fortuneRank ?? 9999);
      if (sort === "headquarters") return a.headquarters.localeCompare(b.headquarters);
      if (sort === "environmental") return b.pillars.Environmental - a.pillars.Environmental;
      if (sort === "financial")
        return b.pillars["Financial responsibility"] - a.pillars["Financial responsibility"];
      if (sort === "ethics") return b.pillars.Ethics - a.pillars.Ethics;
      if (sort === "philanthropy") return b.pillars.Philanthropy - a.pillars.Philanthropy;
      return b.score - a.score;
    });
  }, [
    grade,
    fortuneBand,
    foundedSince,
    headquarters,
    industry,
    pillarMinimums,
    query,
    researchOnly,
    revenue,
    scoreRange,
    size,
    state,
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
      "Rank,Company,Ticker,CEO,CEO Title,Founded,Industry,Headquarters,Fortune Rank,Fortune Year,Revenue ($B),Employees,Score,Grade,Trend",
      ...rows.map((company, index) =>
        [
          publishedRanks.get(company.slug) ?? index + 1,
          company.name,
          company.ticker,
          company.executive?.name ?? "",
          company.executive?.title ?? "",
          company.founded ?? "Insufficient public information available",
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
    link.download = "impact-horizon-company-research.csv";
    link.click();
    URL.revokeObjectURL(url);
  };
  const clearFilters = () => {
    setQuery("");
    setIndustry("All");
    setGrade("All");
    setScoreRange("0");
    setRevenue("0");
    setSize("0");
    setState("All");
    setHeadquarters("");
    setFoundedSince("0");
    setFortuneBand("All");
    setResearchOnly(false);
    setPillarMinimums({ environmental: 0, philanthropy: 0, ethics: 0, financial: 0 });
    setSort("score-desc");
    setPage(1);
  };
  const activeFilterCount = [
    query,
    industry !== "All",
    grade !== "All",
    fortuneBand !== "All",
    scoreRange !== "0",
    revenue !== "0",
    size !== "0",
    state !== "All",
    headquarters,
    foundedSince !== "0",
    researchOnly,
    ...Object.values(pillarMinimums).map(Boolean),
  ].filter(Boolean).length;
  return (
    <div className="enterprise-table overflow-hidden border bg-panel/35">
      <div className="border-b p-5 md:p-6">
        {!compact && (
          <div className="mb-5 flex gap-2 overflow-x-auto pb-1" aria-label="Fortune rank range">
            {["All", "1-100", "101-200", "201-300", "301-400", "401-500"].map((band) => (
              <button
                key={band}
                onClick={() => {
                  setFortuneBand(band);
                  setPage(1);
                }}
                className={`focus-ring min-w-max border-b-2 px-3 py-2 text-xs font-semibold ${fortuneBand === band ? "border-cyan text-cyan" : "border-transparent text-slate-400"}`}
              >
                {band === "All" ? "Full Fortune 500" : band}
              </button>
            ))}
          </div>
        )}
        <div className="flex flex-col gap-3 lg:flex-row">
          <label className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
            <span className="sr-only">Search companies, industries, or tickers</span>
            <input
              value={query}
              onChange={update(setQuery)}
              placeholder="Search company, ticker, industry, or location"
              className="form-control w-full py-3.5 pl-12 pr-3"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <select
              value={industry}
              onChange={update(setIndustry)}
              aria-label="Filter by industry"
              className="form-control min-w-36 flex-1"
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
              className="form-control"
            >
              <option>All</option>
              {grades.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select
              value={sort}
              onChange={update((value) => setSort(value as SortMode))}
              aria-label="Sort companies"
              className="form-control min-w-40 flex-1"
            >
              <option value="score-desc">Highest score</option>
              <option value="score-asc">Lowest score</option>
              <option value="alphabetical">A–Z</option>
              <option value="newest">Recently reviewed</option>
              <option value="founded-oldest">Founded: oldest first</option>
              <option value="founded-newest">Founded: newest first</option>
              <option value="fortune">Fortune rank</option>
              <option value="headquarters">Headquarters</option>
              <option value="environmental">Environmental leaders</option>
              <option value="financial">Financial responsibility leaders</option>
              <option value="ethics">Ethics leaders</option>
              <option value="philanthropy">Philanthropy leaders</option>
            </select>
            {!compact && (
              <button
                onClick={() => setAdvanced((value) => !value)}
                aria-expanded={advanced}
                className="button-secondary"
              >
                <SlidersHorizontal className="size-4" /> Filters
                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-cyan px-2 py-0.5 text-[.65rem] text-ink">
                    {activeFilterCount}
                  </span>
                )}
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
          <div className="mt-4 grid gap-5 border-t bg-ink/30 p-5 sm:grid-cols-2 lg:grid-cols-4">
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
            <FilterSelect
              label="Founded since"
              value={foundedSince}
              onChange={update(setFoundedSince)}
              options={[
                ["Any year", "0"],
                ["1900", "1900"],
                ["1950", "1950"],
                ["2000", "2000"],
              ]}
            />
            <FilterSelect
              label="State"
              value={state}
              onChange={update(setState)}
              options={[
                ["All states", "All"],
                ...states.map((item): [string, string] => [item, item]),
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
        <div className="mt-4 flex flex-col gap-3 border-t border-white/[.07] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400" aria-live="polite">
            <strong className="text-white">{rows.length.toLocaleString()}</strong> of{" "}
            {companies.length.toLocaleString()} companies
            {query && (
              <>
                {" "}
                matching <span className="text-cyan">“{query}”</span>
              </>
            )}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {!query &&
              industry === "All" &&
              ["Technology", "Financials", "Energy", "Health Care"].map((item) =>
                industries.includes(item) ? (
                  <button
                    key={item}
                    onClick={() => {
                      setIndustry(item);
                      setPage(1);
                    }}
                    className="chip !px-3 !py-1.5 text-xs"
                  >
                    {item}
                  </button>
                ) : null,
              )}
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 text-xs text-cyan"
              >
                <RotateCcw className="size-3.5" /> Reset filters
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="sticky top-[4.4rem] z-10 hidden grid-cols-[3rem_1.5fr_1.1fr_.7fr_1fr_1.1fr_.8fr_.7fr] gap-5 border-b bg-[#111922] px-6 py-4 text-xs font-semibold uppercase tracking-[.14em] text-zinc-400 md:grid">
        <span>Rank</span>
        <span>Company</span>
        <span>CEO</span>
        <span>Founded</span>
        <span>Industry</span>
        <span>Headquarters</span>
        <span>Score</span>
        <span>Grade</span>
      </div>
      <div className="divide-y">
        {visible.map((company) => (
          <div
            key={company.slug}
            className="group grid gap-5 px-6 py-5 transition hover:bg-white/[.025] md:grid-cols-[3rem_1.5fr_1.1fr_.7fr_1fr_1.1fr_.8fr_.7fr] md:items-center"
          >
            <span className="text-sm text-zinc-600">
              {String(publishedRanks.get(company.slug) ?? "—").padStart(2, "0")}
            </span>
            <Link
              href={`/companies/${company.slug}`}
              className="focus-ring flex min-w-0 items-center gap-3"
            >
              <CompanyLogo name={company.name} website={company.website} logo={company.logo} />
              <span className="min-w-0 flex-1">
                <strong className="block truncate text-base font-semibold tracking-tight transition group-hover:text-cyan md:text-lg">
                  {company.name}
                </strong>
                <small className="text-zinc-500">{company.ticker}</small>
                <small className="block truncate text-zinc-500 md:hidden">
                  CEO: {company.executive?.name}
                </small>
                <small className="block text-zinc-500 md:hidden">
                  Founded: {company.founded ?? "Data unavailable"}
                </small>
              </span>
            </Link>
            <span className="hidden text-sm text-zinc-300 md:block">{company.executive?.name}</span>
            <span className="hidden text-sm text-zinc-400 md:block">
              {company.founded ?? "Data unavailable"}
            </span>
            <Link
              href={`/industries/${company.industrySlug}`}
              className="focus-ring hidden text-sm text-zinc-400 hover:text-cyan hover:underline md:block"
            >
              {company.industry}
            </Link>
            <span className="hidden text-sm text-zinc-400 md:block">{company.headquarters}</span>
            <span className="flex items-center gap-3">
              <span className="hidden h-1 flex-1 overflow-hidden bg-white/10 lg:block">
                <span className="block h-full bg-cyan" style={{ width: `${company.score}%` }} />
              </span>
              <strong className="min-w-12 text-right text-lg tabular-nums text-cyan">
                {company.score.toFixed(1)}
              </strong>
            </span>
            <GradeBadge score={company.score} />
          </div>
        ))}
        {!visible.length && (
          <div className="p-12 text-center">
            <p className="font-medium">No companies match these filters</p>
            <button onClick={clearFilters} className="mt-3 text-sm text-cyan">
              Clear all filters
            </button>
          </div>
        )}
      </div>
      {!compact && rows.length > 0 && (
        <div className="flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
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
            <span className="min-w-16 text-center text-xs text-zinc-400">
              Page {page} of {pages}
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
