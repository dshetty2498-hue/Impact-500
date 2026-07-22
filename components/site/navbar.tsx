"use client";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navItems } from "@/lib/data";
import { cn } from "@/lib/utils";
import { AccountLink } from "@/components/auth/account-link";

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
      <div className="mx-auto flex h-[5.25rem] max-w-[100rem] items-center justify-between px-5 sm:px-8 xl:px-10">
        <Link
          href="/"
          className="focus-ring text-2xl font-bold tracking-tight"
          aria-label="Impact500 home"
        >
          <span className="mr-1.5 inline-grid size-8 place-items-center rounded-lg bg-accent text-base shadow-lg shadow-accent/25">
            i
          </span>
          impact<span className="text-cyan">500</span>
        </Link>
        <nav className="hidden items-center gap-1 xl:flex" aria-label="Main navigation">
          <Link
            href="/"
            className={cn(
              "focus-ring rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition duration-200 hover:bg-white/[.045] hover:text-white",
              active("/") && "bg-white/[.055] text-white",
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
                "focus-ring rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition duration-200 hover:bg-white/[.045] hover:text-white",
                active(href) && "bg-white/[.055] text-white",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <AccountLink configured={Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)} />
          <Link
            href="/search"
            aria-label="Search Impact500"
            className="focus-ring rounded-xl p-2.5 text-zinc-300 transition hover:-translate-y-0.5 hover:bg-white/10"
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
