import { InstituteNav } from "@/components/institute/institute-nav";
import { TeamGrid } from "@/components/impact/team-grid";
import { SectionTitle } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Research Team", "The researchers and contributors building Impact500.", "/team");

export default function TeamPage() {
  const groups = [["Design contributors", "Editorial systems, information design, accessibility, and data visualization."], ["Engineering contributors", "Research infrastructure, frontend systems, data models, search, and deployment."], ["Future contributors", "Domain experts, student researchers, reviewers, and public-interest collaborators."]] as const;
  return <main className="page-shell"><InstituteNav /><SectionTitle eyebrow="People" title={<>A multidisciplinary <em className="text-cyan">research team.</em></>} text="Impact500 brings together research, methodology, editorial judgment, design, and engineering." /><div className="mt-14"><TeamGrid /></div><section className="mt-20 grid gap-5 md:grid-cols-3">{groups.map(([title, text]) => <article key={title} className="surface-card"><p className="text-xs uppercase tracking-wider text-cyan">Contributor group</p><h2 className="mt-5 text-2xl font-semibold">{title}</h2><p className="mt-4 leading-7 text-zinc-400">{text}</p><p className="mt-7 text-sm text-slate-500">Contributor profiles are published with consent as the program grows.</p></article>)}</section></main>;
}
