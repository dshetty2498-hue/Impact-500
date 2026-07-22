import Link from "next/link";
import { ArrowRight, BarChart3, BookOpen, Search } from "lucide-react";
import { CompanyTable } from "@/components/impact/company-table";
import { Badge, SectionTitle } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { research } from "@/lib/data";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Impact500 | Corporate responsibility, made legible",
  "Independent intelligence on corporate social responsibility across America's most influential companies.",
  "/",
);

export default function HomePage() {
  return (
    <>
      <section className="grid-bg relative overflow-hidden border-b border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-24 md:py-36">
          <Reveal>
            <Badge>Independent CSR intelligence · 2025 edition</Badge>
            <h1 className="display mt-7 max-w-4xl text-5xl leading-[.98] md:text-8xl">
              Corporate responsibility,
              <br />
              <em className="text-cyan">made legible.</em>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-zinc-400">
              The definitive index for understanding how America’s most influential companies show
              up for people, planet, and progress.
            </p>
            <Link
              href="/search"
              className="focus-ring mt-9 flex max-w-xl items-center gap-3 rounded-xl border border-white/15 bg-panel/90 px-4 py-4 text-zinc-400 transition hover:border-cyan/50"
            >
              <Search className="size-5 text-cyan" />
              Search a Fortune 500 company <ArrowRight className="ml-auto size-5" />
            </Link>
          </Reveal>
          <div className="mt-16 grid max-w-3xl grid-cols-2 gap-5 border-t border-white/10 pt-7 sm:grid-cols-4">
            {[
              ["500", "companies assessed"],
              ["2,000+", "data points"],
              ["83", "industries analyzed"],
              ["12", "years of research"],
            ].map(([n, l]) => (
              <div key={l}>
                <strong className="text-2xl text-cyan">{n}</strong>
                <span className="mt-1 block text-xs text-zinc-500">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="mb-10 flex items-end justify-between gap-6">
          <SectionTitle
            eyebrow="The 2025 index"
            title={
              <>
                Leaders in <em className="text-cyan">impact.</em>
              </>
            }
          />
          <Link href="/leaderboard" className="text-sm text-cyan hover:text-white">
            Full leaderboard →
          </Link>
        </div>
        <CompanyTable />
      </section>
      <section className="border-y border-white/10 bg-panel/40">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[.85fr_1.15fr]">
          <SectionTitle
            eyebrow="A closer look"
            title={
              <>
                The state of <em className="text-cyan">responsibility.</em>
              </>
            }
            text="Progress is no longer defined by promises, but by proof."
          />
          <div className="rounded-2xl border border-white/10 bg-ink p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm">Index score by pillar</p>
              <BarChart3 className="text-cyan" />
            </div>
            <div className="mt-10 flex h-44 items-end justify-between gap-3">
              {[58, 61, 64, 66, 69, 70, 71].map((h, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-accent to-cyan"
                    style={{ height: `${h * 2}px` }}
                  />
                  <span className="text-xs text-zinc-500">{2019 + i}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-emerald-400">
              ↗ 22.3% average improvement since the index began
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="mb-10 flex items-end justify-between">
          <SectionTitle
            eyebrow="From our newsroom"
            title={
              <>
                Research with <em className="text-cyan">consequence.</em>
              </>
            }
          />
          <Link href="/research" className="text-sm text-cyan">
            Browse library →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {research.map((article) => (
            <Link
              href={`/research/${article.slug}`}
              key={article.slug}
              className="focus-ring group rounded-2xl border border-white/10 bg-panel p-6 transition hover:-translate-y-1 hover:border-cyan/30"
            >
              <BookOpen className="size-5 text-cyan" />
              <p className="mt-10 text-xs uppercase tracking-wider text-zinc-500">
                {article.type} · {article.read}
              </p>
              <h2 className="mt-3 text-xl font-semibold group-hover:text-cyan">{article.title}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{article.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
