"use client";
import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { publications } from "@/lib/data";

export function ResearchLibrary() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [year, setYear] = useState("All");
  const deferred = useDeferredValue(query.toLowerCase());
  const categories = ["All", ...new Set(publications.map((article) => article.category))];
  const years = ["All", ...new Set(publications.map((article) => article.publishedAt.slice(0, 4)))];
  const results = useMemo(
    () =>
      publications.filter(
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
      <div className="flex flex-col gap-3 border-y py-4 sm:flex-row">
        <label className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <span className="sr-only">Search publications</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="form-control w-full py-3 pl-12 pr-3"
            placeholder="Search titles, authors, tags, and topics"
          />
        </label>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Filter by category"
          className="form-control"
        >
          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select
          value={year}
          onChange={(event) => setYear(event.target.value)}
          aria-label="Filter by publication year"
          className="form-control"
        >
          {years.map((item) => (
            <option key={item}>{item === "All" ? "All years" : item}</option>
          ))}
        </select>
      </div>
      <p className="mt-5 text-sm text-zinc-500" aria-live="polite">
        {results.length} publication{results.length === 1 ? "" : "s"}
      </p>
      <div className="mt-5 divide-y border-y">
        {results.map((article, index) => (
          <Link
            className="group grid gap-6 py-7 md:grid-cols-[3rem_13rem_1fr] md:items-start"
            key={article.slug}
            href={`/research/${article.slug}`}
          >
            <span className="text-xs tabular-nums text-slate-600">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="relative aspect-[16/10] overflow-hidden bg-panel">
              <Image
                src={article.cover}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover opacity-80 transition group-hover:opacity-100"
                style={{ objectPosition: article.coverPosition }}
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-cyan">
                {article.category} · {article.date}
              </p>
              <h2 className="display mt-3 text-2xl leading-tight group-hover:text-cyan">
                {article.title}
              </h2>
              <p className="mt-3 max-w-3xl leading-7 text-zinc-400">{article.excerpt}</p>
              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                {article.tags.map((tag) => (
                  <span className="text-xs text-zinc-500" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mt-5 text-xs text-zinc-500">
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
