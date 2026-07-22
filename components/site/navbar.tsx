"use client";
import Link from "next/link";
import { BarChart3, Menu, Search, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const primaryNav = [
  ["Leaderboard", "/leaderboard"],
  ["Compare", "/compare"],
  ["CSR Explorer", "/explorer"],
  ["Why CSR & ESG?", "/why-csr"],
  ["Research", "/research"],
  ["Annual Report", "/annual-report"],
  ["Methodology", "/methodology"],
  ["About", "/about"],
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => {
    const openSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        window.location.assign("/search");
      }
    };
    window.addEventListener("keydown", openSearch);
    return () => window.removeEventListener("keydown", openSearch);
  }, []);
  const active = (href: string) => (href === "/" ? path === href : path.startsWith(href));
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/75 shadow-lg shadow-black/10 backdrop-blur-2xl supports-[backdrop-filter]:bg-ink/65">
      <div className="mx-auto flex h-20 max-w-[100rem] items-center gap-5 px-5 sm:px-8 xl:px-10">
        <Link
          href="/"
          className="focus-ring flex shrink-0 items-center gap-3"
          aria-label="Impact500 home"
        >
          <span className="inline-grid size-11 place-items-center rounded-xl bg-sky-500 text-white shadow-lg shadow-sky-500/20">
            <BarChart3 className="size-6" />
          </span>
          <span><span className="display block text-[1.65rem] leading-6 tracking-tight">Impact<span className="text-emerald-400">500</span></span><small className="mt-1 block text-[.58rem] font-medium uppercase tracking-[.28em] text-slate-500">CSR Research</small></span>
        </Link>
        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex" aria-label="Main navigation">
          <Link
            href="/"
            className={cn(
              "focus-ring rounded-xl px-4 py-3 text-[.95rem] font-medium text-slate-400 hover:bg-sky-500/10 hover:text-white",
              active("/") && "bg-sky-500/20 text-white",
            )}
          >
            Home
          </Link>
          {primaryNav.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              aria-current={active(href) ? "page" : undefined}
              className={cn(
                "focus-ring rounded-xl px-3 py-3 text-[.95rem] font-medium leading-tight text-slate-400 hover:bg-sky-500/10 hover:text-white",
                active(href) && "bg-sky-500/20 text-white",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/search"
            aria-label="Search Impact500"
            className="focus-ring flex items-center gap-2 rounded-xl border border-white/15 bg-white/[.035] px-3.5 py-2.5 text-sm text-slate-500 hover:border-sky-400/40 hover:text-slate-200"
          >
            <Search className="size-4" />
            <span className="hidden 2xl:inline">Search companies, industries…</span>
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="focus-ring rounded-md p-2 xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-menu"
          className="max-h-[calc(100vh-5.25rem)] overflow-y-auto border-t border-white/10 bg-ink/90 px-5 py-4 backdrop-blur-2xl xl:hidden"
          aria-label="Mobile navigation"
        >
          <Link
            onClick={() => setOpen(false)}
            href="/"
            className="focus-ring block rounded px-3 py-3 text-zinc-300 hover:bg-white/5"
          >
            Home
          </Link>
          {primaryNav.map(([label, href]) => (
            <Link
              onClick={() => setOpen(false)}
              key={href}
              href={href}
              aria-current={active(href) ? "page" : undefined}
              className={cn(
                "focus-ring block rounded px-3 py-3 text-zinc-300 hover:bg-white/5 hover:text-white",
                active(href) && "bg-white/5 text-white",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
