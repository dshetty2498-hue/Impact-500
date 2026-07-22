import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Building2,
  Download,
  Map,
  Scale,
  Search,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { MetricCounter } from "@/components/impact/home-sections";
import { Badge, SectionTitle } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { companies, reports, research } from "@/lib/data";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Impact500 | Corporate responsibility intelligence",
  "Independent intelligence on corporate social responsibility across America's largest companies.",
  "/",
);

const tools = [
  [BarChart3, "CSR Explorer", "Explore normalized performance across four responsibility pillars.", "/explorer"],
  [SlidersHorizontal, "Custom Ranking Builder", "Create a ranking shaped by the issues that matter to you.", "/explorer#ranking-builder"],
  [Scale, "Company Comparison", "Compare company scores, trends, evidence, and priorities side by side.", "/compare"],
  [Map, "Interactive US Map", "Discover corporate responsibility performance by region and headquarters.", "/map"],
] as const;

export default function HomePage() {
  const latestReport = [...reports].sort((a, b) => b.year - a.year)[0];
  const leaders = [...companies].sort((a, b) => b.score - a.score);
  const improved = [...companies].sort((a, b) => b.change - a.change)[0];
  const industryLeader = leaders.find((company) => company.industry === leaders[0]?.industry) ?? leaders[0];

  return (
    <>
      <section className="grid-bg hero-glow relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/[.12] via-transparent to-ink" />
        <div className="relative mx-auto max-w-[100rem] px-5 py-24 sm:px-8 lg:py-36 xl:px-10">
          <Reveal>
            <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
              <Badge><Sparkles className="mr-1.5 size-3" />Independent corporate responsibility research</Badge>
              <h1 className="display mt-8 text-5xl leading-[.96] sm:text-7xl lg:text-8xl xl:text-[6.5rem]">
                Understanding Corporate Responsibility Across <em className="headline-gradient">America&apos;s Largest Companies</em>
              </h1>
              <p className="mt-8 max-w-4xl text-lg leading-8 text-slate-300 md:text-2xl md:leading-9">
                Impact500 transforms public evidence into clear, comparable intelligence for researchers, investors, students, executives, and communities.
              </p>
              <Link href="/search" className="focus-ring group mt-10 flex w-full max-w-4xl items-center gap-4 rounded-2xl border border-white/15 bg-panel/85 px-6 py-5 text-left text-slate-300 shadow-2xl shadow-black/30 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-cyan/50">
                <Search className="size-5 text-cyan" /><span>Search companies, industries, reports, and evidence</span><kbd className="ml-auto hidden rounded-lg border bg-ink px-2.5 py-1 text-xs sm:block">⌘ K</kbd>
              </Link>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/leaderboard" className="button-primary">Explore Rankings <ArrowRight className="size-4" /></Link>
                <Link href="/explorer" className="button-secondary">CSR Explorer</Link>
                <Link href="/explorer#ranking-builder" className="button-secondary">Build Your Own Ranking</Link>
                <Link href="/compare" className="button-secondary">Compare Companies</Link>
              </div>
            </div>
          </Reveal>
          <div className="mt-20 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <MetricCounter value={companies.length} label="Published profiles" />
            <MetricCounter value={companies.length * 4} suffix="+" label="Modeled CSR indicators" />
            <MetricCounter value={6} label="Research cycles" />
            <MetricCounter value={new Set(companies.map((company) => company.industry)).size} label="Industries represented" />
          </div>
        </div>
      </section>

      <section className="section-shell">
        <SectionTitle eyebrow="Featured research" title={<>The signals shaping <em className="text-cyan">responsible business.</em></>} text="A concise view of leaders, momentum, sector performance, and current research." />
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          <InsightCard eyebrow="Top CSR leader" title={leaders[0].name} metric={leaders[0].score.toFixed(1)} href={`/companies/${leaders[0].slug}`} icon={Building2} />
          <InsightCard eyebrow="Most improved" title={improved.name} metric={`+${improved.change}%`} href={`/companies/${improved.slug}`} icon={TrendingUp} />
          <InsightCard eyebrow="Industry leader" title={industryLeader.industry} metric={industryLeader.name} href={`/industries/${industryLeader.industrySlug}`} icon={BarChart3} />
          <InsightCard eyebrow="Trending research" title={research[0].title} metric={research[0].read} href={`/research/${research[0].slug}`} icon={BookOpen} />
          <InsightCard eyebrow="Annual report" title={latestReport.title} metric={`${latestReport.year} edition`} href="/annual-report" icon={BookOpen} />
        </div>
      </section>

      <section className="border-y bg-panel/35">
        <div className="section-shell">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><SectionTitle eyebrow="Top CSR companies" title={<>Leadership across the <em className="text-cyan">expanded index.</em></>} text={`A preview of the highest modeled scores across ${companies.length} published profiles.`} /><Link href="/leaderboard" className="link-arrow">View complete leaderboard <ArrowRight className="size-4" /></Link></div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {leaders.slice(0, 6).map((company, index) => <Link key={company.slug} href={`/companies/${company.slug}`} className="premium-card group flex items-center gap-5"><span className="display text-3xl text-zinc-500">{String(index + 1).padStart(2, "0")}</span><span className="min-w-0 flex-1"><strong className="block truncate text-xl group-hover:text-cyan">{company.name}</strong><small className="mt-1 block text-zinc-500">{company.industry} · {company.ticker}</small></span><span className="text-right"><strong className="text-2xl text-cyan">{company.score.toFixed(1)}</strong><small className="block text-zinc-500">{company.grade}</small></span></Link>)}
          </div>
          <p className="mt-5 text-xs leading-6 text-zinc-500">Expanded-company CSR scores are modeled demonstration values pending source-level analyst verification.</p>
        </div>
      </section>

      <section>
        <div className="section-shell">
          <SectionTitle eyebrow="Interactive tools" title={<>Research that works <em className="text-cyan">the way you do.</em></>} text="Move from a broad market view to a decision-ready comparison in a few steps." />
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {tools.map(([Icon, title, text, href]) => (
              <Link key={title} href={href} className="premium-card group min-h-72">
                <span className="grid size-12 place-items-center rounded-2xl border border-accent/30 bg-accent/10 text-cyan"><Icon className="size-6" /></span>
                <h3 className="mt-10 text-2xl font-semibold tracking-tight">{title}</h3>
                <p className="mt-4 leading-7 text-slate-400">{text}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-cyan">Open tool <ArrowRight className="size-4 transition group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell pt-0">
        <div className="grid-bg relative overflow-hidden rounded-[2rem] border bg-gradient-to-br from-accent/20 via-elevated to-panel p-8 shadow-2xl shadow-accent/10 md:p-14 lg:grid lg:grid-cols-[1fr_.65fr] lg:items-center lg:gap-12">
          <div><p className="text-xs uppercase tracking-[.2em] text-cyan">Featured annual report · {latestReport.year}</p><h2 className="display mt-5 text-4xl md:text-6xl">A definitive account of corporate responsibility.</h2><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{latestReport.summary}</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/annual-report" className="button-primary"><BookOpen className="size-4" />Read the report</Link><a href={latestReport.pdf} download className="button-secondary"><Download className="size-4" />Download PDF</a></div></div>
          <div className="relative mt-10 aspect-[4/3] overflow-hidden rounded-2xl border shadow-2xl lg:mt-0"><Image src={latestReport.cover} fill sizes="(max-width:1024px) 100vw, 40vw" className="object-cover" alt={`${latestReport.title} cover`} /><div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" /></div>
        </div>
      </section>

      <section className="section-shell">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><SectionTitle eyebrow="Latest research" title={<>Independent analysis with <em className="text-cyan">consequence.</em></>} text="Long-form research, industry analysis, and case studies grounded in cited evidence." /><Link href="/research" className="link-arrow">View all research <ArrowRight className="size-4" /></Link></div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {research.slice(0, 3).map((article, index) => (
            <Link href={`/research/${article.slug}`} key={article.slug} className="focus-ring group overflow-hidden rounded-[1.75rem] border bg-panel shadow-2xl shadow-black/15 transition duration-300 hover:-translate-y-1 hover:border-cyan/30">
              <div className="relative aspect-[16/10] overflow-hidden"><Image src={article.cover} fill priority={index === 0} sizes="(max-width:1024px) 100vw, 33vw" style={{ objectPosition: article.coverPosition }} className="object-cover transition duration-700 group-hover:scale-105" alt="" /><div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent" /></div>
              <div className="p-7"><p className="text-xs uppercase tracking-[.18em] text-cyan">{article.category} · {article.date}</p><h3 className="mt-5 text-2xl font-semibold leading-snug transition group-hover:text-cyan">{article.title}</h3><p className="mt-4 line-clamp-3 leading-7 text-slate-400">{article.excerpt}</p><span className="mt-7 block text-sm text-slate-500">{article.read} read · {article.author}</span></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y bg-panel/35"><div className="section-shell"><SectionTitle eyebrow="About Impact500" title={<>Built for broad access. <em className="text-cyan">Designed for serious inquiry.</em></>} text="Impact500 is a long-term research initiative making corporate responsibility evidence more comparable, transparent, and useful." /><div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4"><MetricCounter value={companies.length} label="Company profiles" /><MetricCounter value={companies.length * 4} suffix="+" label="CSR indicators" /><MetricCounter value={6} label="Research cycles" /><MetricCounter value={new Set(companies.map((company) => company.industry)).size} label="Industries" /></div><Link href="/about" className="button-secondary mt-8">Learn about the institute <ArrowRight className="size-4" /></Link></div></section>

      <section className="section-shell"><div className="grid-bg rounded-[2rem] border bg-elevated/70 p-8 text-center md:p-14"><p className="text-xs uppercase tracking-[.2em] text-cyan">Join the research initiative</p><h2 className="display mx-auto mt-5 max-w-4xl text-4xl md:text-6xl">Help make corporate responsibility more transparent.</h2><p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">Explore the evidence, understand the framework, and bring better questions to the institutions shaping public life.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/about" className="button-primary">About Impact500 <ArrowRight className="size-4" /></Link><Link href="/methodology" className="button-secondary">Learn about methodology</Link></div></div></section>
    </>
  );
}

function InsightCard({ eyebrow, title, metric, href, icon: Icon }: { eyebrow: string; title: string; metric: string; href: string; icon: typeof Building2 }) {
  return <Link href={href} className="premium-card group"><span className="flex items-center justify-between"><Icon className="size-5 text-cyan" /><ArrowRight className="size-4 text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan" /></span><p className="mt-8 text-xs uppercase tracking-[.16em] text-slate-500">{eyebrow}</p><h3 className="mt-3 text-xl font-semibold leading-snug group-hover:text-cyan">{title}</h3><strong className="mt-5 block text-lg text-cyan">{metric}</strong></Link>;
}
