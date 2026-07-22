import { BarChart3, Cloud, Database, Filter, Layers3, Search, Server, Workflow } from "lucide-react";
import { InstituteNav } from "@/components/institute/institute-nav";
import { SectionTitle } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Technical Architecture", "How the Impact500 research platform is designed and operated.", "/architecture");

const layers = [
  [Layers3, "Frontend", "Next.js and React render accessible, responsive research experiences."],
  [Server, "Application layer", "Server components and typed repositories separate presentation from data access."],
  [Database, "Research data", "A relational schema preserves companies, evidence, scores, citations, and member activity."],
  [Search, "Search index", "A normalized client index enables immediate discovery across the published corpus."],
  [Filter, "Analysis tools", "Deterministic filters and weighting controls support reproducible exploration."],
  [BarChart3, "Visualization", "Responsive chart components share accessible labels, export behavior, and color tokens."],
  [Cloud, "Hosting", "Edge delivery, optimized images, caching, and security headers support production use."],
  [Workflow, "Deployment", "Versioned source, automated checks, and environment-specific configuration protect releases."],
] as const;

export default function ArchitecturePage() {
  return <main className="page-shell"><InstituteNav /><SectionTitle eyebrow="Technical architecture" title={<>Infrastructure for <em className="text-cyan">credible research.</em></>} text="A modular platform designed to keep evidence, analysis, publishing, and user experience understandable as the initiative grows." /><section className="mt-16 overflow-hidden rounded-[2rem] border bg-panel p-6 md:p-10"><div className="grid items-center gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr]"><DiagramNode title="Public evidence" text="Reports · filings · research" /><DiagramArrow /><DiagramNode title="Research platform" text="Collect · validate · score" accent /><DiagramArrow /><DiagramNode title="Published intelligence" text="Profiles · tools · reports" /></div></section><section className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{layers.map(([Icon, title, text], index) => <article className="premium-card" key={title}><span className="flex items-center justify-between"><Icon className="size-6 text-cyan" /><small className="text-zinc-500">0{index + 1}</small></span><h2 className="mt-8 text-xl font-semibold">{title}</h2><p className="mt-4 leading-7 text-zinc-400">{text}</p></article>)}</section><section className="surface-card mt-16 grid gap-8 lg:grid-cols-2"><div><p className="text-xs uppercase tracking-wider text-cyan">Future scalability</p><h2 className="mt-5 text-3xl font-semibold">Scale evidence before complexity.</h2></div><div className="grid gap-4 sm:grid-cols-2">{["Database-backed full-text search", "Queued evidence ingestion", "Immutable score releases", "Privacy-preserving analytics"].map((item) => <div key={item} className="rounded-xl border bg-ink/50 p-4 text-sm text-slate-300">{item}</div>)}</div></section></main>;
}

function DiagramNode({ title, text, accent = false }: { title: string; text: string; accent?: boolean }) { return <div className={`rounded-2xl border p-6 text-center ${accent ? "border-cyan/30 bg-accent/10" : "bg-ink/60"}`}><strong className="text-lg">{title}</strong><p className="mt-2 text-sm text-zinc-400">{text}</p></div>; }
function DiagramArrow() { return <div className="mx-auto h-8 w-px bg-gradient-to-b from-cyan to-transparent lg:h-px lg:w-12 lg:bg-gradient-to-r" aria-hidden="true" />; }
