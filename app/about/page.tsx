import { SectionTitle } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/metadata";
import { TeamGrid } from "@/components/impact/team-grid";
import { ResearchTimeline } from "@/components/impact/home-sections";
import { team } from "@/lib/data";
import { InstituteNav } from "@/components/institute/institute-nav";
import { Newsletter } from "@/components/site/newsletter";
export const metadata = pageMetadata(
  "About",
  "Meet the independent research institute behind Impact500.",
  "/about",
);
export default function About() {
  return (
    <section className="page-shell">
      <InstituteNav />
      <SectionTitle
        eyebrow="About Impact500"
        title={
          <>
            Clarity is a public
            <br />
            <em className="text-cyan">good.</em>
          </>
        }
        text="We are an independent research institute making corporate responsibility more legible to everyone affected by it."
      />
      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        <article className="surface-card">
          <p className="text-xs uppercase tracking-wider text-cyan">Our mission</p>
          <h2 className="mt-6 text-3xl font-semibold">Evidence that changes the conversation.</h2>
          <p className="mt-5 leading-7 text-zinc-400">
            Impact500 translates thousands of public signals into research that is clear enough to
            use and rigorous enough to trust.
          </p>
        </article>
        <article className="surface-card">
          <p className="text-xs uppercase tracking-wider text-cyan">Our vision</p>
          <h2 className="mt-6 text-3xl font-semibold">A shared language for accountability.</h2>
          <p className="mt-5 leading-7 text-zinc-400">
            We envision a public evidence infrastructure where corporate claims can be examined,
            compared, and understood without specialist access.
          </p>
        </article>
        <article className="surface-card">
          <p className="text-xs uppercase tracking-wider text-cyan">Founder</p>
          <h2 className="mt-6 text-3xl font-semibold">{team[0]?.name}</h2>
          <p className="mt-2 text-sm text-cyan">{team[0]?.role}</p>
          <p className="mt-5 leading-7 text-zinc-400">
            Impact500 began as a public-interest effort to make responsibility research more
            comparable, transparent, and useful.
          </p>
        </article>
      </div>
      <section className="mt-20">
        <p className="text-xs uppercase tracking-[.2em] text-cyan">Institutional commitments</p>
        <h2 className="display mt-4 text-4xl md:text-6xl">The principles behind the platform.</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Core values", "Clarity, independence, intellectual honesty, public access, and respect for evidence."],
            ["Research principles", "Comparable methods, documented judgment, proportional claims, and visible uncertainty."],
            ["Data transparency", "Traceable sources, review dates, methodology versions, and clear distinctions between evidence and analysis."],
            ["Editorial standards", "Independent conclusions, rigorous citations, fact checking, corrections, and conflict disclosure."],
          ].map(([title, text]) => <article key={title} className="premium-card"><h3 className="text-xl font-semibold">{title}</h3><p className="mt-4 leading-7 text-zinc-400">{text}</p></article>)}
        </div>
      </section>
      <h2 className="mt-16 text-3xl font-semibold">Meet the research team</h2>
      <p className="mt-3 max-w-2xl leading-7 text-zinc-400">
        A multidisciplinary group translating complex corporate evidence into comparable public
        intelligence.
      </p>
      <div className="mt-8">
        <TeamGrid />
      </div>
      <section className="mt-20">
        <p className="text-xs uppercase tracking-[.2em] text-cyan">Development milestones</p>
        <h2 className="display mt-4 text-4xl md:text-6xl">From research question to public platform.</h2>
        <div className="mt-14"><ResearchTimeline /></div>
      </section>
      <section className="surface-card mt-20 grid gap-8 lg:grid-cols-[.7fr_1.3fr]">
        <div><p className="text-xs uppercase tracking-[.2em] text-cyan">Future roadmap</p><h2 className="display mt-4 text-4xl">The next chapter.</h2></div>
        <div className="grid gap-5 sm:grid-cols-3">
          {["Broader sector coverage", "Deeper source transparency", "More participatory research tools"].map((item, index) => <div key={item} className="rounded-2xl border bg-ink/50 p-5"><span className="text-xs text-cyan">0{index + 1}</span><h3 className="mt-5 font-semibold">{item}</h3></div>)}
        </div>
      </section>
      <section className="mt-20 grid gap-6 lg:grid-cols-[1fr_.8fr]">
        <article className="surface-card"><p className="text-xs uppercase tracking-wider text-cyan">Annual goals · 2026</p><h2 className="mt-5 text-3xl font-semibold">Strengthen the evidence base.</h2><ol className="mt-6 grid gap-4 sm:grid-cols-2">{["Complete the next company review cycle", "Publish methodology version notes", "Expand sector source coverage", "Establish external research review"].map((goal, index) => <li key={goal} className="rounded-xl border bg-ink/50 p-4"><span className="text-xs text-cyan">0{index + 1}</span><p className="mt-3 text-sm text-slate-300">{goal}</p></li>)}</ol></article>
        <article className="grid-bg rounded-[1.5rem] border bg-accent/10 p-8"><p className="text-xs uppercase tracking-wider text-cyan">The Impact500 briefing</p><h2 className="mt-5 text-3xl font-semibold">Research updates without the noise.</h2><p className="mt-4 leading-7 text-zinc-400">Receive annual reports, industry insights, ranking releases, and major platform updates.</p><div className="mt-6"><Newsletter /></div></article>
      </section>
    </section>
  );
}
