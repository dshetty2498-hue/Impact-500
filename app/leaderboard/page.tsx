import { CompanyTable } from "@/components/impact/company-table";
import { SectionTitle } from "@/components/ui/primitives";
import { companies } from "@/lib/data";
import { pageMetadata } from "@/lib/metadata";
import { currentResearchCycle, previousResearchCycle } from "@/data/research-cycles";
export const metadata = pageMetadata(
  "Leaderboard",
  "Ranked corporate responsibility performance across Impact500 companies.",
  "/leaderboard",
);
export default function LeaderboardPage() {
  const average = companies.reduce((sum, company) => sum + company.score, 0) / companies.length;
  const improving = companies.filter((company) => company.change > 0).length;
  const industries = new Set(companies.map((company) => company.industry)).size;
  return (
    <section className="page-shell">
      <SectionTitle
        eyebrow="Impact500 research index"
        title="The corporate responsibility leaderboard."
        text="A comparable view of verified performance, updated with each published research cycle."
      />
      <p className="mt-6 border-l-2 border-cyan pl-4 text-sm leading-6 text-slate-400">
        {currentResearchCycle.dateLabel} is {currentResearchCycle.status}. Rankings shown below are
        the last published results from {previousResearchCycle.dateLabel}; working-cycle values are
        withheld until validation is complete.
      </p>
      <div className="mt-10 grid grid-cols-2 border-y lg:grid-cols-4">
        {[
          [companies.length.toLocaleString(), "Company profiles"],
          [industries, "Industries"],
          [average.toFixed(1), "Index average"],
          [`${Math.round((improving / companies.length) * 100)}%`, "Improved in published cycle"],
        ].map(([value, label]) => (
          <div
            className="border-b px-1 py-5 last:border-b-0 lg:border-b-0 lg:border-r lg:px-5 lg:first:pl-0 lg:last:border-r-0"
            key={label}
          >
            <strong className="display block text-3xl text-cyan md:text-4xl">{value}</strong>
            <span className="mt-2 block text-xs uppercase tracking-wider text-slate-500">
              {label}
            </span>
          </div>
        ))}
      </div>
      <div id="company-directory" className="mt-12 scroll-mt-28">
        <div className="mb-6 grid gap-4 border-t pt-6 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <p className="text-xs uppercase tracking-[.18em] text-cyan">Full company directory</p>
            <h2 className="display mt-3 text-3xl md:text-4xl">View all companies.</h2>
          </div>
          <p className="max-w-2xl leading-7 text-slate-400">
            Search the complete company index, sort by CSR score or Fortune rank, and filter by
            industry, state, grade, company size, revenue, evidence coverage, or individual CSR
            pillars. Select any row to open its full research profile.
          </p>
        </div>
        <CompanyTable />
      </div>
    </section>
  );
}
