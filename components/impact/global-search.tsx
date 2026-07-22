"use client";
import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { ArrowRight, Clock3, LoaderCircle, Search, TrendingUp, X } from "lucide-react";
import {
  companies,
  industries,
  methodologySections,
  news,
  reports,
  research,
  team,
} from "@/lib/data";
import { SectionTitle } from "@/components/ui/primitives";

const instituteIndex = [
  ["Building Impact500", "Project history design evolution development roadmap", "/building-impact500"],
  ["Research Team", "Founder researchers contributors team", "/team"],
  ["Project Impact", "Research hours companies data points platform versions", "/impact"],
  ["Technical Architecture", "Frontend backend database search hosting deployment", "/architecture"],
  ["Editorial Standards", "Citation fact checking corrections transparency", "/editorial-standards"],
  ["Press and Media", "Media kit brand assets press contact", "/media"],
  ["Partnerships", "Academic business research volunteer guest researchers", "/partnerships"],
].map(([title, search, href]) => ({ title, search, meta: "Institute", href }));

const index = [
  ...companies.map((c) => ({
    title: c.name,
    search: `${c.name} ${c.ticker} ${c.industry} ${c.location} ${c.headquarters} ${c.grade} ${c.score} ${Object.entries(c.pillars).map(([pillar, score]) => `${pillar} ${score}`).join(" ")} ${c.fortuneRank ? `Fortune rank ${c.fortuneRank} Fortune ${c.fortuneRankYear}` : "private company not Fortune ranked"}`,
    meta: `Company · ${c.ticker} · ${c.industry} · ${c.grade} · ${c.score}${c.fortuneRank ? ` · Fortune #${c.fortuneRank}` : ""}`,
    href: `/companies/${c.slug}`,
  })),
  ...research.map((a) => ({
    title: a.title,
    search: `${a.title} ${a.type} ${a.excerpt}`,
    meta: `Research · ${a.type}`,
    href: `/research/${a.slug}`,
  })),
  ...reports.map((r) => ({
    title: r.title,
    search: `${r.title} annual report ${r.year}`,
    meta: `Report · ${r.year}`,
    href: r.href,
  })),
  ...team.map((m) => ({
    title: m.name,
    search: `${m.name} ${m.role} ${m.bio}`,
    meta: `Team · ${m.role}`,
    href: `/about#${m.slug}`,
  })),
  ...methodologySections.map((m) => ({
    title: m.title,
    search: `${m.title} ${m.summary} methodology`,
    meta: "Methodology",
    href: `/methodology#${m.slug}`,
  })),
  ...industries.map((industry) => ({
    title: industry.name,
    search: `${industry.name} ${industry.description} ${industry.keyIssues.join(" ")}`,
    meta: "Industry research",
    href: `/industries/${industry.slug}`,
  })),
  ...news.map((item) => ({
    title: item.headline,
    search: `${item.headline} ${item.summary} ${item.category}`,
    meta: `News · ${item.category}`,
    href: `/news#${item.slug}`,
  })),
  ...instituteIndex,
];
const popular = ["MSFT", "Technology", "A+", "Climate", "Annual report", "Validation"];
function Highlight({ text, query }: { text: string; query: string }) {
  const position = text.toLowerCase().indexOf(query.toLowerCase());
  if (position < 0 || !query) return <>{text}</>;
  return (
    <>
      {text.slice(0, position)}
      <mark className="rounded bg-cyan/15 text-cyan">
        {text.slice(position, position + query.length)}
      </mark>
      {text.slice(position + query.length)}
    </>
  );
}
export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const deferred = useDeferredValue(query.trim().toLowerCase());
  const isFiltering = query.trim().toLowerCase() !== deferred;
  useEffect(() => {
    try {
      setRecent(JSON.parse(localStorage.getItem("impact500-recent") ?? "[]"));
    } catch {
      setRecent([]);
    }
  }, []);
  const results = useMemo(
    () =>
      deferred.length < 2
        ? []
        : index.filter((item) => item.search.toLowerCase().includes(deferred)).slice(0, 20),
    [deferred],
  );
  useEffect(() => setActive(0), [deferred]);
  const remember = (value: string) => {
    const next = [value, ...recent.filter((item) => item !== value)].slice(0, 5);
    setRecent(next);
    localStorage.setItem("impact500-recent", JSON.stringify(next));
    window.dispatchEvent(
      new CustomEvent("impact500:search", {
        detail: { query: value, resultCount: results.length, timestamp: Date.now() },
      }),
    );
  };
  return (
    <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 md:py-24">
      <SectionTitle
        eyebrow="Global search"
        title="Find the evidence."
        text="Search companies, industries, reports, articles, researchers, and methodology."
      />
      <div className="relative mt-10">
        {isFiltering ? (
          <LoaderCircle className="absolute left-5 top-1/2 size-5 -translate-y-1/2 animate-spin text-cyan" />
        ) : (
          <Search className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-cyan" />
        )}
        <input
          role="combobox"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setQuery("");
              return;
            }
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActive((current) => Math.min(current + 1, results.length - 1));
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setActive((current) => Math.max(current - 1, 0));
            }
            if (event.key === "Enter" && results[active]) {
              remember(query);
              window.location.href = results[active].href;
            }
          }}
          aria-label="Search Impact500"
          aria-controls="search-results"
          aria-activedescendant={results[active] ? `result-${active}` : undefined}
          placeholder="Try “technology”, “climate”, or “validation”…"
          aria-autocomplete="list"
          aria-expanded={deferred.length >= 2}
          className="focus-ring w-full rounded-2xl border bg-panel py-5 pl-14 pr-14 text-lg shadow-2xl shadow-black/20 hover:border-white/20"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="focus-ring absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-2 text-zinc-500 hover:bg-white/5 hover:text-white"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
      <div
        id="search-results"
        role="listbox"
        className="mt-5 overflow-hidden rounded-2xl border bg-panel"
        aria-live="polite"
        aria-busy={isFiltering}
      >
        {deferred.length >= 2 ? (
          results.length ? (
            results.map((result, index) => (
              <Link
                id={`result-${index}`}
                role="option"
                aria-selected={index === active}
                onMouseEnter={() => setActive(index)}
                onClick={() => remember(query)}
                href={result.href}
                key={`${result.meta}-${result.href}`}
                className={`focus-ring flex items-center gap-4 border-b p-5 transition duration-200 last:border-0 ${index === active ? "bg-accent/[.09]" : "hover:bg-white/[.035]"}`}
              >
                <span className="min-w-0 flex-1">
                  <strong className="block truncate text-lg">
                    <Highlight text={result.title} query={query} />
                  </strong>
                  <span className="mt-1 block text-sm text-zinc-500">{result.meta}</span>
                </span>
                <ArrowRight className="size-4 text-zinc-600" />
              </Link>
            ))
          ) : (
            <div className="p-12 text-center"><p className="font-semibold text-white">No results for “{query}”.</p><p className="mt-2 text-sm text-zinc-500">Try a company ticker, industry, research topic, or methodology term.</p></div>
          )
        ) : (
          <div className="grid gap-px bg-white/10 sm:grid-cols-2">
            <div className="bg-panel p-6">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                <TrendingUp className="size-4" />
                Popular searches
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {popular.map((item) => (
                  <button
                    onClick={() => setQuery(item)}
                    key={item}
                    className="chip"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-panel p-6">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                <Clock3 className="size-4" />
                Recent searches
              </p>
              {recent.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {recent.map((item) => (
                    <button
                      onClick={() => setQuery(item)}
                      key={item}
                      className="chip"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-zinc-600">Your recent searches will appear here.</p>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between gap-4 text-xs text-zinc-500"><span>{deferred.length >= 2 ? `${results.length} results` : "Type at least two characters"}</span><span>Use ↑ ↓ to navigate · Enter to open · Esc to clear</span></div>
    </section>
  );
}
