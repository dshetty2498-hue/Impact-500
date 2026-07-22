"use client";
import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { research } from "@/lib/data";

export function ResearchLibrary() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [year, setYear] = useState("All");
  const deferred = useDeferredValue(query.toLowerCase());
  const categories = ["All", ...new Set(research.map((article) => article.category))];
  const years = ["All", ...new Set(research.map((article) => article.publishedAt.slice(0, 4)))];
  const results = useMemo(
    () =>
      research.filter(
        (article) =>
          (category === "All" || article.category === category) &&
          (year === "All" || article.publishedAt.startsWith(year)) &&
          `${article.title} ${article.excerpt} ${article.author} ${article.tags.join(" ")}`
            .toLowerCase()
            .includes(deferred),
      ),
    [category, deferred, year],
  );
  return (
    <div className="mt-10">
      <div className="flex flex-col gap-3 rounded-2xl border bg-panel p-4 sm:flex-row">
        <label className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <span className="sr-only">Search publications</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="focus-ring w-full rounded-xl border bg-ink/60 py-3 pl-10 pr-3"
            placeholder="Search titles, authors, tags, and topics"
          />
        </label>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Filter by category"
          className="focus-ring rounded-xl border bg-ink/60 px-4 py-3"
        >
          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select
          value={year}
          onChange={(event) => setYear(event.target.value)}
          aria-label="Filter by publication year"
          className="focus-ring rounded-xl border bg-ink/60 px-4 py-3"
        >
          {years.map((item) => (
            <option key={item}>{item === "All" ? "All years" : item}</option>
          ))}
        </select>
      </div>
      <p className="mt-5 text-sm text-zinc-500" aria-live="polite">
        {results.length} publication{results.length === 1 ? "" : "s"}
      </p>
      <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {results.map((article) => (
          <Link
            className="premium-card group overflow-hidden p-0"
            key={article.slug}
            href={`/research/${article.slug}`}
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={article.cover}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
                style={{ objectPosition: article.coverPosition }}
              />
            </div>
            <div className="p-6">
              <p className="text-xs uppercase tracking-wider text-cyan">
                {article.category} · {article.date}
              </p>
              <h2 className="mt-5 text-xl font-semibold group-hover:text-cyan">{article.title}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{article.excerpt}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span className="rounded-full border px-2.5 py-1 text-xs text-zinc-500" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mt-6 text-xs text-zinc-500">
                By {article.author} · {article.readMinutes} min read
              </p>
            </div>
          </Link>
        ))}
      </div>
      {!results.length && (
        <div className="mt-5 rounded-2xl border p-12 text-center">
          <p className="font-medium">No publications found</p>
          <button
            onClick={() => {
              setQuery("");
              setCategory("All");
              setYear("All");
            }}
            className="mt-3 text-sm text-cyan"
          >
            Reset search
          </button>
        </div>
      )}
    </div>
  );
}
