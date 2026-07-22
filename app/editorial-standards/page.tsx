import { CheckCircle2, FileCheck2, RefreshCw, Scale, SearchCheck, ShieldCheck } from "lucide-react";
import { InstituteNav } from "@/components/institute/institute-nav";
import { SectionTitle } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Editorial Standards", "Impact500 research, citation, review, and transparency policies.", "/editorial-standards");

const standards = [
  [SearchCheck, "Source selection", "We prioritize primary documents, regulatory filings, audited reports, and reputable independent research."],
  [FileCheck2, "Citation policy", "Material claims must be traceable to a named source with publisher, date, and access information."],
  [ShieldCheck, "Fact checking", "Names, dates, quantitative claims, and source links receive a separate verification pass before publication."],
  [RefreshCw, "Data updates", "Material changes trigger documented review. Review dates remain visible on company and publication records."],
  [Scale, "Editorial independence", "Scores follow published criteria. Commercial relationships do not determine coverage or conclusions."],
  [CheckCircle2, "Corrections", "Substantive corrections are made promptly and preserved in the relevant version record."],
] as const;

export default function EditorialStandardsPage() {
  return <main className="page-shell"><InstituteNav /><SectionTitle eyebrow="Editorial standards" title={<>Trust requires <em className="text-cyan">visible practices.</em></>} text="The principles governing evidence selection, verification, publication, correction, and institutional transparency." /><section className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{standards.map(([Icon, title, text]) => <article key={title} className="surface-card"><Icon className="size-6 text-cyan" /><h2 className="mt-7 text-2xl font-semibold">{title}</h2><p className="mt-4 leading-7 text-zinc-400">{text}</p></article>)}</section><section className="mt-20 grid gap-6 lg:grid-cols-3"><Policy title="Research quality standard" text="Claims should be specific, proportionate to the evidence, and clear about uncertainty or conflicting information." /><Policy title="Version control" text="Methodology and publication changes are associated with dated releases so readers can understand what changed." /><Policy title="Transparency policy" text="Impact500 distinguishes documented fact, analytical judgment, illustrative metrics, and future plans." /></section><section className="surface-card mt-16"><p className="text-xs uppercase tracking-wider text-cyan">Corrections and questions</p><h2 className="mt-5 text-3xl font-semibold">Research improves through scrutiny.</h2><p className="mt-5 max-w-3xl leading-8 text-zinc-400">Readers may submit source updates, correction requests, or methodological questions to research@impact500.org. Requests should identify the publication, claim, and supporting evidence.</p></section></main>;
}
function Policy({ title, text }: { title: string; text: string }) { return <article className="rounded-[1.5rem] border bg-panel p-7"><h2 className="text-xl font-semibold">{title}</h2><p className="mt-4 leading-7 text-zinc-400">{text}</p></article>; }
