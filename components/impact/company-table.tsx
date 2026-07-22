"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { companies } from "@/lib/data";
import { Score } from "@/components/ui/primitives";

export function CompanyTable() {
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("All");
  const rows = useMemo(
    () =>
      companies.filter(
        (c) =>
          (industry === "All" || c.industry === industry) &&
          c.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [query, industry],
  );
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-panel">
      <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search companies"
          placeholder="Search companies"
          className="focus-ring min-w-0 flex-1 rounded-lg border bg-white/5 px-3 py-2 text-sm"
        />
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="focus-ring rounded-lg border bg-white/5 px-3 py-2 text-sm"
        >
          <option>All</option>
          {[...new Set(companies.map((c) => c.industry))].map((i) => (
            <option key={i}>{i}</option>
          ))}
        </select>
      </div>
      <div className="divide-y divide-white/10">
        {rows.map((company, i) => (
          <Link
            href={`/companies/${company.slug}`}
            key={company.slug}
            className="focus-ring grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 p-4 transition hover:bg-white/5"
          >
            <span className="text-sm text-zinc-500">{String(i + 1).padStart(2, "0")}</span>
            <span>
              <strong className="block">{company.name}</strong>
              <small className="text-zinc-500">{company.industry}</small>
            </span>
            <Score score={company.score} grade={company.grade} />
          </Link>
        ))}
        {!rows.length && (
          <p className="p-10 text-center text-zinc-400">No companies match those filters.</p>
        )}
      </div>
    </div>
  );
}
