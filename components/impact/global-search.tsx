"use client";
import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { companies, methodologySections, reports, research, team } from "@/lib/data";
import { SectionTitle } from "@/components/ui/primitives";

const index = [
  ...companies.map((c) => ({
    title: c.name,
    search: `${c.name} ${c.industry} ${c.location}`,
    meta: `Company · ${c.industry}`,
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
];

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query.trim().toLowerCase());
  const results = useMemo(
    () =>
      deferred.length < 2
        ? []
        : index.filter((item) => item.search.toLowerCase().includes(deferred)).slice(0, 20),
    [deferred],
  );
  return (
    <section className="mx-auto max-w-4xl px-5 py-16">
      <SectionTitle
        eyebrow="Global search"
        title="Find the evidence."
        text="Search companies, industries, reports, articles, researchers, and methodology."
      />
      <input
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search Impact500"
        placeholder="Try “technology”, “climate”, or “validation”…"
        className="focus-ring mt-10 w-full rounded-xl border bg-panel px-5 py-4 text-lg"
      />
      <div className="mt-6 overflow-hidden rounded-2xl border bg-panel" aria-live="polite">
        {deferred.length >= 2 ? (
          results.length ? (
            results.map((r) => (
              <Link
                href={r.href}
                key={`${r.meta}-${r.href}`}
                className="focus-ring block border-b p-5 last:border-0 hover:bg-white/5"
              >
                <strong>{r.title}</strong>
                <span className="mt-1 block text-sm text-zinc-500">{r.meta}</span>
              </Link>
            ))
          ) : (
            <p className="p-10 text-center text-zinc-400">No results for “{query}”.</p>
          )
        ) : (
          <p className="p-10 text-center text-zinc-500">
            Enter at least two characters to search the complete library.
          </p>
        )}
      </div>
    </section>
  );
}
