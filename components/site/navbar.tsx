"use client";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const active = (href: string) => (href === "/" ? path === href : path.startsWith(href));
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Link href="/" className="focus-ring text-xl font-bold tracking-tight">
          <span className="mr-1 inline-grid size-6 place-items-center rounded bg-accent text-sm">
            i
          </span>
          impact<span className="text-cyan">500</span>
        </Link>
        <nav className="hidden items-center gap-3 xl:flex" aria-label="Main navigation">
          <Link
            href="/"
            className={cn(
              "focus-ring text-xs text-zinc-400 transition hover:text-white",
              active("/") && "text-white",
            )}
          >
            Home
          </Link>
          {navItems.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              aria-current={active(href) ? "page" : undefined}
              className={cn(
                "focus-ring text-xs text-zinc-400 transition hover:text-white",
                active(href) && "text-white",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/search"
            aria-label="Search Impact500"
            className="focus-ring rounded-md p-2 text-zinc-300 hover:bg-white/10"
          >
            <Search className="size-4" />
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
          className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-white/10 px-5 py-4 xl:hidden"
          aria-label="Mobile navigation"
        >
          <Link
            onClick={() => setOpen(false)}
            href="/"
            className="focus-ring block rounded px-3 py-3 text-zinc-300 hover:bg-white/5"
          >
            Home
          </Link>
          {navItems.map(([label, href]) => (
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
