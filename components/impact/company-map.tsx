"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { companies } from "@/lib/data";

const coordinates: Record<string, { x: number; y: number; region: string; country: string }> = {
  microsoft: { x: 13, y: 26, region: "West", country: "United States" },
  salesforce: { x: 10, y: 48, region: "West", country: "United States" },
  patagonia: { x: 14, y: 59, region: "West", country: "United States" },
  cisco: { x: 11, y: 51, region: "West", country: "United States" },
  nike: { x: 10, y: 31, region: "West", country: "United States" },
  walmart: { x: 55, y: 60, region: "South", country: "United States" },
  apple: { x: 11, y: 53, region: "West", country: "United States" },
  target: { x: 61, y: 34, region: "Midwest", country: "United States" },
};
const regions: Record<string, string> = {
  WA: "West", OR: "West", CA: "West", NV: "West", ID: "West", MT: "West", WY: "West", UT: "West", CO: "West", AZ: "West", NM: "West",
  ND: "Midwest", SD: "Midwest", NE: "Midwest", KS: "Midwest", MN: "Midwest", IA: "Midwest", MO: "Midwest", WI: "Midwest", IL: "Midwest", IN: "Midwest", MI: "Midwest", OH: "Midwest",
  TX: "South", OK: "South", AR: "South", LA: "South", KY: "South", TN: "South", MS: "South", AL: "South", WV: "South", VA: "South", NC: "South", SC: "South", GA: "South", FL: "South", DC: "South",
  ME: "Northeast", NH: "Northeast", VT: "Northeast", MA: "Northeast", RI: "Northeast", CT: "Northeast", NY: "Northeast", NJ: "Northeast", PA: "Northeast", DE: "Northeast", MD: "Northeast",
};
function pointFor(company: (typeof companies)[number]) {
  if (coordinates[company.slug]) return coordinates[company.slug];
  const state = company.location.split(", ").at(-1) ?? "";
  const region = regions[state] ?? "Other";
  const bases = { West: [20, 34], Midwest: [52, 31], South: [61, 45], Northeast: [78, 25], Other: [48, 36] } as const;
  const seed = [...company.slug].reduce((sum, character) => sum + character.charCodeAt(0), 0);
  const [baseX, baseY] = bases[region as keyof typeof bases] ?? bases.Other;
  return { x: baseX + (seed % 15) - 7, y: baseY + ((seed * 7) % 15) - 7, region, country: "United States" };
}

export function CompanyMap() {
  const [industry, setIndustry] = useState("All");
  const [grade, setGrade] = useState("All");
  const [region, setRegion] = useState("All");
  const [active, setActive] = useState<string | null>(null);
  const rows = useMemo(
    () =>
      companies.filter(
        (company) =>
          (industry === "All" || company.industry === industry) &&
          (grade === "All" || company.grade === grade) &&
          (region === "All" || pointFor(company).region === region),
      ),
    [grade, industry, region],
  );
  const selected = companies.find((company) => company.slug === active);
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <Filter
          label="Industry"
          value={industry}
          set={setIndustry}
          values={[...new Set(companies.map((company) => company.industry))]}
        />
        <Filter
          label="CSR grade"
          value={grade}
          set={setGrade}
          values={[...new Set(companies.map((company) => company.grade))]}
        />
        <Filter
          label="Region"
          value={region}
          set={setRegion}
          values={[...new Set(companies.map((company) => pointFor(company).region))].filter((item) => item !== "Other")}
        />
      </div>
      <div className="relative mt-6 aspect-[16/8] min-h-80 overflow-hidden rounded-2xl border bg-panel">
        <svg
          viewBox="0 0 100 60"
          className="absolute inset-0 size-full"
          role="img"
          aria-label={`Map showing ${rows.length} company headquarters`}
        >
          <defs>
            <pattern id="map-grid" width="5" height="5" patternUnits="userSpaceOnUse">
              <path
                d="M 5 0 L 0 0 0 5"
                fill="none"
                stroke="rgba(255,255,255,.045)"
                strokeWidth=".2"
              />
            </pattern>
            <radialGradient id="map-glow">
              <stop stopColor="#3b82f6" stopOpacity=".22" />
              <stop offset="1" stopColor="#07111F" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100" height="60" fill="url(#map-grid)" />
          <ellipse cx="48" cy="31" rx="49" ry="28" fill="url(#map-glow)" />
          <path
            d="M5 18 L16 12 29 17 40 14 51 20 61 17 69 22 83 20 94 27 87 39 74 42 65 50 51 47 43 53 31 45 17 47 9 37 Z"
            fill="#111a31"
            stroke="rgba(110,231,249,.25)"
            strokeWidth=".5"
          />
          {rows.map((company) => {
            const point = pointFor(company);
            return (
              <g
                key={company.slug}
                role="button"
                tabIndex={0}
                aria-label={`${company.name}, ${company.headquarters}`}
                onClick={() => setActive(company.slug)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") setActive(company.slug);
                }}
                className="cursor-pointer outline-none"
              >
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={active === company.slug ? 2.2 : 1.4}
                  fill={active === company.slug ? "#ffffff" : "#60a5fa"}
                  stroke="#07111F"
                  strokeWidth=".6"
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="3"
                  fill="none"
                  stroke="#60a5fa"
                  strokeOpacity=".25"
                />
              </g>
            );
          })}
        </svg>
        <div className="absolute bottom-4 left-4 rounded-lg border bg-ink/85 px-3 py-2 text-xs text-zinc-400 backdrop-blur">
          {rows.length} headquarters · United States coverage
        </div>
        {selected && (
          <div className="absolute right-4 top-4 w-64 rounded-xl border bg-ink/95 p-5 shadow-2xl backdrop-blur">
            <button
              onClick={() => setActive(null)}
              aria-label="Close company preview"
              className="absolute right-3 top-2 text-zinc-500"
            >
              ×
            </button>
            <p className="text-xs text-cyan">
              {selected.ticker} · {selected.industry}
            </p>
            <h2 className="mt-2 text-lg font-semibold">{selected.name}</h2>
            <p className="mt-2 flex gap-2 text-xs text-zinc-500">
              <MapPin className="size-3" /> {selected.headquarters}
            </p>
            <div className="mt-4 flex items-end justify-between">
              <strong className="display text-3xl text-cyan">{selected.score}</strong>
              <span className="rounded-full border px-2 py-1 text-xs">{selected.grade}</span>
            </div>
            <Link
              href={`/companies/${selected.slug}`}
              className="button-primary mt-5 w-full justify-center"
            >
              Open profile
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
function Filter({
  label,
  value,
  set,
  values,
}: {
  label: string;
  value: string;
  set: (value: string) => void;
  values: string[];
}) {
  return (
    <label className="text-xs text-zinc-500">
      {label}
      <select
        value={value}
        onChange={(event) => set(event.target.value)}
        className="focus-ring ml-2 rounded-lg border bg-panel px-3 py-2 text-sm text-white"
      >
        <option>All</option>
        {values.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </label>
  );
}
