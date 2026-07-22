"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { companies } from "@/lib/data";
import { Score } from "@/components/ui/primitives";
const pillarKeys = ["Environmental", "Philanthropy", "Ethics", "Financial responsibility"] as const;
export function Explorer() {
  const [weights, setWeights] = useState<Record<string, number>>({
    Environmental: 75,
    Philanthropy: 55,
    Ethics: 90,
    "Financial responsibility": 60,
  });
  const matches = useMemo(
    () =>
      companies
        .map((c) => ({
          ...c,
          match:
            Object.entries(weights).reduce(
              (sum, [key, weight]) => sum + c.pillars[key as keyof typeof c.pillars] * weight,
              0,
            ) / Object.values(weights).reduce((sum, n) => sum + n, 0),
        }))
        .sort((a, b) => b.match - a.match)
        .slice(0, 3),
    [weights],
  );
  return (
    <div className="grid overflow-hidden rounded-2xl border border-white/10 bg-panel lg:grid-cols-2">
      <div className="border-b border-white/10 p-6 lg:border-b-0 lg:border-r">
        <h2 className="text-xl font-semibold">What matters to you?</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Adjust each priority. Your recommendations recalculate instantly.
        </p>
        <div className="mt-8 space-y-6">
          {pillarKeys.map((key) => (
            <label key={key} className="block">
              <span className="mb-2 flex justify-between text-sm">
                <span>{key}</span>
                <span className="text-cyan">{weights[key]}%</span>
              </span>
              <input
                className="w-full accent-[#60A5FA]"
                type="range"
                min="0"
                max="100"
                value={weights[key]}
                onChange={(e) => setWeights({ ...weights, [key]: Number(e.target.value) })}
                aria-label={`${key} priority`}
              />
            </label>
          ))}
        </div>
      </div>
      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-cyan">
          Your strongest matches
        </p>
        <div className="mt-5 space-y-3">
          {matches.map((company, index) => (
            <Link
              href={`/companies/${company.slug}`}
              key={company.slug}
              className="focus-ring flex items-center justify-between rounded-xl border border-white/10 p-4 hover:bg-white/5"
            >
              <span>
                <small className="mr-3 text-zinc-500">0{index + 1}</small>
                <strong>{company.name}</strong>
                <small className="ml-2 text-zinc-500">{company.industry}</small>
              </span>
              <Score score={company.match} grade={company.grade} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
