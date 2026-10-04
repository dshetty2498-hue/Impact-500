"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUp, ChevronRight, Home } from "lucide-react";
import { useEffect, useState } from "react";

const labels: Record<string, string> = {
  companies: "Companies",
  research: "Research",
  publications: "Reports",
  annual: "Annual report",
  leaderboard: "Leaderboard",
  explorer: "Data explorer",
  map: "Headquarters map",
};

function titleCase(value: string) {
  return (
    labels[value] ?? value.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
  );
}

export function PageTools() {
  const path = usePathname();
  const [showTop, setShowTop] = useState(false);
  const segments = path.split("/").filter(Boolean);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {segments.length > 0 && (
        <div className="border-b border-white/[.06] bg-white/[.012]">
          <nav
            aria-label="Breadcrumb"
            className="mx-auto flex min-h-10 max-w-[94rem] items-center gap-1 overflow-x-auto px-5 text-xs text-slate-500 sm:px-8 xl:px-10"
          >
            <Link href="/" className="focus-ring rounded p-1.5 hover:text-white" aria-label="Home">
              <Home className="size-3.5" />
            </Link>
            {segments.map((segment, index) => {
              const href = `/${segments.slice(0, index + 1).join("/")}`;
              const current = index === segments.length - 1;
              return (
                <span key={href} className="flex min-w-max items-center gap-1">
                  <ChevronRight className="size-3 text-slate-700" />
                  {current ? (
                    <span aria-current="page" className="max-w-56 truncate py-2 text-slate-300">
                      {titleCase(segment)}
                    </span>
                  ) : (
                    <Link href={href} className="focus-ring rounded px-1.5 py-2 hover:text-white">
                      {titleCase(segment)}
                    </Link>
                  )}
                </span>
              );
            })}
          </nav>
        </div>
      )}
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="focus-ring fixed bottom-5 right-5 z-40 grid size-11 place-items-center rounded-full border border-white/15 bg-panel/95 text-slate-300 shadow-xl backdrop-blur hover:-translate-y-0.5 hover:border-cyan/40 hover:text-white"
          aria-label="Back to top"
        >
          <ArrowUp className="size-4" />
        </button>
      )}
    </>
  );
}
