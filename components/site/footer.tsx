import Link from "next/link";
import { navItems } from "@/lib/data";
import { Newsletter } from "@/components/site/newsletter";
import { instituteLinks } from "@/components/institute/institute-nav";
import { currentResearchCycle } from "@/data/research-cycles";
export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink">
      <div className="mx-auto grid max-w-[88rem] gap-12 px-5 py-16 sm:grid-cols-2 sm:px-8 lg:grid-cols-[1.15fr_.7fr_.7fr_1.25fr] xl:px-10">
        <div>
          <Link href="/" className="focus-ring display text-2xl">
            Impact Horizon
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-zinc-400">
            Independent research making corporate responsibility evidence comparable, transparent,
            and useful.
          </p>
          <a
            className="focus-ring mt-6 inline-block border-b border-cyan/40 pb-1 text-sm text-cyan"
            href="mailto:dshetty2498@gmail.com"
          >
            dshetty2498@gmail.com
          </a>
        </div>
        <div>
          <h2 className="text-sm font-medium">Quick links</h2>
          <div className="mt-4 grid gap-2">
            {navItems.slice(0, 6).map(([l, h]) => (
              <Link
                className="focus-ring w-fit text-sm text-zinc-400 hover:translate-x-0.5 hover:text-white"
                href={h}
                key={h}
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-medium">Institute</h2>
          <div className="mt-4 grid gap-2">
            {instituteLinks.slice(1, 6).map(([l, h]) => (
              <Link
                className="focus-ring w-fit text-sm text-zinc-400 hover:translate-x-0.5 hover:text-white"
                href={h}
                key={h}
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="display text-2xl">Research briefings</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Receive new research, reports, industry findings, and methodology updates.
          </p>
          <Newsletter />
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-6">
        <div className="mx-auto flex max-w-[88rem] flex-col justify-between gap-3 text-xs text-zinc-500 sm:flex-row">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <span>© {new Date().getFullYear()} Impact Horizon Research Institute</span>
            <Link href="/research-cycles" className="hover:text-white">
              Research Cycle: {currentResearchCycle.dateLabel} · Status:{" "}
              {currentResearchCycle.status === "complete" ? "Complete" : "Updating"}
            </Link>
          </div>
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
