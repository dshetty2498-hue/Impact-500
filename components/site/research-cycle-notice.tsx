"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import type { ResearchCycle } from "@/lib/domain/types";

export function ResearchCycleNotice({
  cycle,
  previousCycle,
}: {
  cycle: ResearchCycle;
  previousCycle: ResearchCycle;
}) {
  const storageKey = `impact-horizon-cycle-notice:${cycle.id}`;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(sessionStorage.getItem(storageKey) !== "dismissed");
  }, [storageKey]);

  if (!visible || cycle.status !== "updating") return null;

  return (
    <aside
      role="status"
      aria-labelledby="research-cycle-notice-title"
      className="border-b border-cyan/30 bg-[#101d28]"
    >
      <div className="mx-auto grid max-w-[88rem] gap-5 px-5 py-6 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-start xl:px-10">
        <div className="max-w-5xl">
          <p className="text-[.68rem] font-semibold uppercase tracking-[.18em] text-cyan">
            Official research update
          </p>
          <h2 id="research-cycle-notice-title" className="display mt-2 text-2xl">
            Impact Horizon is conducting its latest bi-monthly research cycle.
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
            Our research team is reviewing company evidence across the Fortune 500. Scores,
            rankings, profiles, industry intelligence, and findings may change only after the new
            evidence has passed methodology and data-integrity checks.
          </p>
          <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-xs text-slate-400">
            <div><dt className="inline text-slate-500">Research cycle: </dt><dd className="inline text-white">{cycle.dateLabel}</dd></div>
            <div><dt className="inline text-slate-500">Previous cycle: </dt><dd className="inline text-white">{previousCycle.dateLabel}</dd></div>
            <div><dt className="inline text-slate-500">Status: </dt><dd className="inline font-semibold text-amber-300">Research in progress</dd></div>
          </dl>
          <Link href="/research-cycles" className="mt-4 inline-flex text-sm font-semibold text-cyan hover:text-white">
            View cycle methodology and status →
          </Link>
        </div>
        <button
          type="button"
          className="focus-ring absolute right-4 mt-0 rounded border border-white/15 p-2 text-slate-300 hover:border-cyan/50 hover:text-white lg:static"
          aria-label="Dismiss research-cycle update"
          onClick={() => {
            sessionStorage.setItem(storageKey, "dismissed");
            setVisible(false);
          }}
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
