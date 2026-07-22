import { ArrowRight, Blocks, Lightbulb, Palette, SearchCheck, ServerCog } from "lucide-react";
import Link from "next/link";
import { InstituteNav } from "@/components/institute/institute-nav";
import { ResearchTimeline } from "@/components/impact/home-sections";
import { SectionTitle } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Building Impact500", "The research, design, and engineering story behind Impact500.", "/building-impact500");

const challenges = [
  [SearchCheck, "Research challenge", "Turning uneven corporate disclosure into evidence that can be compared without hiding uncertainty."],
  [ServerCog, "Technical challenge", "Designing a durable data model that separates source records, observations, scores, and publications."],
  [Palette, "Design challenge", "Making serious research approachable without making it feel simplified or promotional."],
] as const;

export default function BuildingImpact500() {
  return (
    <main className="page-shell">
      <InstituteNav />
      <SectionTitle eyebrow="Flagship project story" title={<>Building <em className="text-cyan">Impact500.</em></>} text="A long-term effort to turn fragmented corporate-responsibility evidence into credible public research infrastructure." />
      <section className="mt-16 grid gap-6 lg:grid-cols-2">
        <article className="surface-card"><Lightbulb className="size-6 text-cyan" /><p className="mt-8 text-xs uppercase tracking-wider text-cyan">Why it started</p><h2 className="mt-4 text-3xl font-semibold">Important claims were difficult to compare.</h2><p className="mt-5 leading-8 text-slate-300">Corporate responsibility information lived across annual reports, filings, policy documents, and independent research. Impact500 began with a practical question: could that evidence become understandable without losing its complexity?</p></article>
        <article className="surface-card"><Blocks className="size-6 text-cyan" /><p className="mt-8 text-xs uppercase tracking-wider text-cyan">The problem</p><h2 className="mt-4 text-3xl font-semibold">Disclosure was abundant. Decision-ready context was not.</h2><p className="mt-5 leading-8 text-slate-300">The project establishes consistent definitions, preserves source provenance, and places company performance inside sector and historical context.</p></article>
      </section>
      <section className="mt-20"><p className="text-xs uppercase tracking-[.2em] text-cyan">Challenges encountered</p><h2 className="display mt-4 text-4xl md:text-6xl">Research, technology, and design evolved together.</h2><div className="mt-10 grid gap-5 lg:grid-cols-3">{challenges.map(([Icon, title, text]) => <article key={title} className="premium-card"><Icon className="size-6 text-cyan" /><h3 className="mt-8 text-xl font-semibold">{title}</h3><p className="mt-4 leading-7 text-zinc-400">{text}</p></article>)}</div></section>
      <section className="mt-20"><p className="text-xs uppercase tracking-[.2em] text-cyan">Development milestones</p><h2 className="display mt-4 text-4xl md:text-6xl">From idea to research platform.</h2><div className="mt-14"><ResearchTimeline /></div></section>
      <section className="mt-20"><p className="text-xs uppercase tracking-[.2em] text-cyan">Design evolution</p><h2 className="display mt-4 text-4xl md:text-6xl">A product learning to communicate evidence.</h2><div className="mt-10 grid gap-5 md:grid-cols-3">{[["v0.1", "Research notebook", "A source-first prototype for testing the evidence model."], ["v1.0", "Public index", "Comparable rankings, profiles, and methodology became a coherent public experience."], ["v2.0", "Research institute", "Editorial publishing, member tools, and institutional transparency joined the platform."]].map(([version, title, text], index) => <article key={version} className="overflow-hidden rounded-[1.5rem] border bg-panel"><div className="grid-bg relative aspect-[16/10] border-b bg-gradient-to-br from-accent/15 to-ink p-5"><span className="absolute left-5 top-5 rounded-full border bg-ink/70 px-3 py-1 text-xs text-cyan">{version}</span><div className={`absolute bottom-5 left-5 right-5 rounded-xl border bg-panel/90 p-4 ${index === 1 ? "translate-y-[-6px]" : ""}`}><div className="h-2 w-2/3 rounded bg-white/15" /><div className="mt-3 h-2 w-4/5 rounded bg-white/10" /></div></div><div className="p-6"><h3 className="text-xl font-semibold">{title}</h3><p className="mt-3 leading-7 text-zinc-400">{text}</p></div></article>)}</div></section>
      <section className="mt-20 grid gap-5 lg:grid-cols-2"><article className="surface-card"><p className="text-xs uppercase tracking-wider text-cyan">Lessons learned</p><h2 className="mt-5 text-3xl font-semibold">Trust is a product decision.</h2><ul className="mt-6 space-y-4 text-slate-300"><li>Methodology must be visible where conclusions appear.</li><li>Source provenance matters as much as the final score.</li><li>Editorial restraint makes complex evidence easier to use.</li><li>Every version should make uncertainty clearer.</li></ul></article><article className="surface-card"><p className="text-xs uppercase tracking-wider text-cyan">Reflection</p><h2 className="mt-5 text-3xl font-semibold">The work remains deliberately unfinished.</h2><p className="mt-6 leading-8 text-slate-300">Impact500 is designed to improve as disclosures, research practices, and public expectations change. Its roadmap prioritizes deeper evidence coverage, transparent revision histories, and collaboration with domain experts.</p><Link href="/partnerships" className="link-arrow mt-8">Contribute to the next phase <ArrowRight className="size-4" /></Link></article></section>
    </main>
  );
}
