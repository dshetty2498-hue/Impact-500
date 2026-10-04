"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  ["Home", "/"],
  ["Leaderboard", "/leaderboard"],
  ["Industries", "/industries"],
  ["Compare", "/compare"],
  ["Map", "/map"],
  ["Research", "/research"],
  ["Reports", "/publications"],
  ["Methodology", "/methodology"],
  ["About", "/about"],
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const active = (href: string) =>
    href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`);

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        window.location.assign("/search");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b bg-[#0b1118]/95">
      <div className="mx-auto flex h-[4.4rem] max-w-[92rem] items-center gap-6 px-5 sm:px-8 xl:px-10">
        <Link href="/" className="focus-ring shrink-0" aria-label="Impact Horizon home">
          <span className="display block text-[1.28rem] leading-none">Impact Horizon</span>
          <span className="mt-1.5 block text-[.57rem] font-semibold uppercase tracking-[.22em] text-slate-500">
            Corporate responsibility research
          </span>
        </Link>

        <nav className="ml-auto hidden items-stretch gap-2 xl:flex" aria-label="Main navigation">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              aria-current={active(href) ? "page" : undefined}
              className={cn("nav-link", active(href) && "nav-link-active")}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center xl:ml-2">
          <Link
            href="/search"
            className="focus-ring flex min-h-10 items-center gap-2 border-l border-white/15 px-4 text-sm text-slate-400 hover:text-white"
            aria-label="Search Impact Horizon"
          >
            <Search className="size-4 text-cyan" />
            <span className="hidden sm:inline">Search</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="focus-ring grid size-11 place-items-center xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          className="max-h-[calc(100dvh-4.4rem)] overflow-y-auto border-t bg-[#0b1118] px-5 py-3 sm:px-8 xl:hidden"
          aria-label="Mobile navigation"
        >
          {links.map(([label, href], index) => (
            <Link
              href={href}
              key={href}
              className={cn(
                "focus-ring flex items-center justify-between border-b py-4 text-base",
                active(href) ? "text-cyan" : "text-slate-200",
              )}
            >
              <span>{label}</span>
              <span className="text-xs tabular-nums text-slate-600">
                {String(index + 1).padStart(2, "0")}
              </span>
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
