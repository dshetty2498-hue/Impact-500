import Link from "next/link";
import { navItems } from "@/lib/data";
import { Mail } from "lucide-react";
import { Newsletter } from "@/components/site/newsletter";
import { instituteLinks } from "@/components/institute/institute-nav";
export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink">
      <div className="mx-auto grid max-w-[100rem] gap-12 px-5 py-20 sm:grid-cols-2 sm:px-8 lg:grid-cols-[1.3fr_.8fr_.8fr_1.2fr] xl:px-10">
        <div>
          <Link href="/" className="focus-ring text-2xl font-bold tracking-tight">
            <span className="mr-1.5 inline-grid size-8 place-items-center rounded-lg bg-accent text-base text-white">i</span>impact<span className="text-cyan">500</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-zinc-400">
            Independent research making corporate responsibility impossible to ignore.
          </p>
          <div className="mt-5 flex gap-2">
            <a
              className="focus-ring rounded-xl border p-2.5 text-zinc-400 hover:-translate-y-0.5 hover:border-white/20 hover:text-white"
              href="mailto:research@impact500.org"
              aria-label="Email Impact500"
            >
              <Mail className="size-4" />
            </a>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-medium">Quick links</h2>
          <div className="mt-4 grid gap-2">
            {navItems.slice(0, 4).map(([l, h]) => (
              <Link className="focus-ring w-fit text-sm text-zinc-400 hover:translate-x-0.5 hover:text-white" href={h} key={h}>
                {l}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-medium">Institute</h2>
          <div className="mt-4 grid gap-2">
            {instituteLinks.slice(1, 6).map(([l, h]) => (
              <Link className="focus-ring w-fit text-sm text-zinc-400 hover:translate-x-0.5 hover:text-white" href={h} key={h}>
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
        <div className="mx-auto flex max-w-[100rem] flex-col justify-between gap-3 text-xs text-zinc-500 sm:flex-row">
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
