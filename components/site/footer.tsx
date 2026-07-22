import Link from "next/link";
import { navItems } from "@/lib/data";
import { Linkedin, Mail } from "lucide-react";
import { Newsletter } from "@/components/site/newsletter";
export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#070b18]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_.8fr_.8fr_1.2fr]">
        <div>
          <Link href="/" className="focus-ring text-xl font-bold">
            <span className="mr-1 text-accent">i</span>impact<span className="text-cyan">500</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-zinc-400">
            Independent research making corporate responsibility impossible to ignore.
          </p>
          <div className="mt-5 flex gap-2">
            <a
              className="focus-ring rounded-md border p-2 text-zinc-400 hover:text-white"
              href="mailto:research@impact500.org"
              aria-label="Email Impact500"
            >
              <Mail className="size-4" />
            </a>
            <a
              className="focus-ring rounded-md border p-2 text-zinc-400 hover:text-white"
              href="https://www.linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Impact500 on LinkedIn"
            >
              <Linkedin className="size-4" />
            </a>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-medium">Quick links</h2>
          <div className="mt-4 grid gap-2">
            {navItems.slice(0, 4).map(([l, h]) => (
              <Link className="text-sm text-zinc-400 hover:text-white" href={h} key={h}>
                {l}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-medium">Research</h2>
          <div className="mt-4 grid gap-2">
            {navItems.slice(4, 8).map(([l, h]) => (
              <Link className="text-sm text-zinc-400 hover:text-white" href={h} key={h}>
                {l}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-medium">The briefing</h2>
          <p className="mt-4 text-sm text-zinc-400">
            Signal, not noise. Research delivered occasionally.
          </p>
          <Newsletter />
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-6">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-xs text-zinc-500 sm:flex-row">
          <span>© {new Date().getFullYear()} Impact500 Institute</span>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms of Use
            </Link>
            <Link href="/disclaimer" className="hover:text-white">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
