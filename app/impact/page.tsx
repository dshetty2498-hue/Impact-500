import { InstituteNav } from "@/components/institute/institute-nav";
import { MetricCounter } from "@/components/impact/home-sections";
import { SectionTitle } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/metadata";
import { companies } from "@/lib/data";

export const metadata = pageMetadata("Project Impact", "Impact500 research and platform activity at a glance.", "/impact");

export default function ImpactPage() {
  const metrics = [[companies.length, "", "Company profiles"], [companies.length * 4, "+", "Modeled CSR indicators"], [6800, "+", "Research hours (illustrative)"], [4, "", "Reports published"], [36, "", "Research articles"], [new Set(companies.map((company) => company.industry)).size, "", "Industries covered"], [9, "", "Platform versions"], [12000, "+", "Research visits (illustrative)"]] as const;
  return <main className="page-shell"><InstituteNav /><SectionTitle eyebrow="Project impact" title={<>Research infrastructure, <em className="text-cyan">measured.</em></>} text="A transparent view of the scope, activity, and development of the Impact500 initiative." /><div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">{metrics.map(([value, suffix, label]) => <MetricCounter key={label} value={value} suffix={suffix} label={label} />)}</div><section className="surface-card mt-16"><p className="text-xs uppercase tracking-wider text-cyan">How to read these figures</p><h2 className="mt-5 text-3xl font-semibold">Activity is not the same as impact.</h2><p className="mt-5 max-w-4xl leading-8 text-zinc-400">These measures describe the scale of the research program and platform. They do not claim causal social outcomes. Visitor figures remain illustrative until privacy-preserving production analytics are connected and independently reviewed.</p></section></main>;
}
