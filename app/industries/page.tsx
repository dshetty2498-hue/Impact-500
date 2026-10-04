import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { industries, companies } from "@/lib/data";
import { SectionTitle } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/metadata";
import { calculateAllIndustryStats, formatIndustryNumber } from "@/lib/industry-data";
export const metadata = pageMetadata(
  "Industry Research",
  "Explore CSR performance, trends, and research by industry.",
  "/industries",
);
export default function IndustriesPage() {
  const industryStats = new Map(
    calculateAllIndustryStats(companies).map((stats) => [stats.slug, stats]),
  );
  return (
    <section className="page-shell">
      <SectionTitle
        eyebrow="Industry intelligence"
        title="Sector performance in context."
        text="Explore comparable scores, leaders, risks, and research themes across the Impact500 universe."
      />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {industries.map((industry) => {
          const stats = industryStats.get(industry.slug);
          if (!stats) return null;
          return (
            <Link
              href={`/industries/${industry.slug}`}
              key={industry.slug}
              className="premium-card group"
            >
              <p className="text-xs uppercase tracking-wider text-cyan">
                {stats.companyCount} companies evaluated
              </p>
              <h2 className="display mt-6 text-3xl">{industry.name}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{industry.description}</p>
              <dl className="mt-8 grid grid-cols-2 gap-4 border-t pt-5">
                <div>
                  <dt className="text-xs text-zinc-600">Average score</dt>
                  <dd className="mt-1 text-2xl font-semibold">
                    {formatIndustryNumber(stats.averageScore)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-zinc-600">Sector leader</dt>
                  <dd className="mt-1 font-semibold">{stats.leader?.name ?? "Data unavailable"}</dd>
                </div>
              </dl>
              <span className="mt-7 flex items-center gap-2 text-sm text-cyan">
                View research <ArrowUpRight className="size-4" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
