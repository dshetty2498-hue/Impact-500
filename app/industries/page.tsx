import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { industries, companies } from "@/lib/data";
import { SectionTitle } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Industry Research",
  "Explore CSR performance, trends, and research by industry.",
  "/industries",
);
export default function IndustriesPage() {
  return (
    <section className="page-shell">
      <SectionTitle
        eyebrow="Industry intelligence"
        title="Sector performance in context."
        text="Explore comparable scores, leaders, risks, and research themes across the Impact500 universe."
      />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {industries.map((industry) => {
          const members = companies.filter((company) => company.industrySlug === industry.slug);
          const average = members.reduce((sum, company) => sum + company.score, 0) / members.length;
          const leader = [...members].sort((a, b) => b.score - a.score)[0];
          return (
            <Link
              href={`/industries/${industry.slug}`}
              key={industry.slug}
              className="premium-card group"
            >
              <p className="text-xs uppercase tracking-wider text-cyan">
                {members.length} companies evaluated
              </p>
              <h2 className="display mt-6 text-3xl">{industry.name}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{industry.description}</p>
              <dl className="mt-8 grid grid-cols-2 gap-4 border-t pt-5">
                <div>
                  <dt className="text-xs text-zinc-600">Average score</dt>
                  <dd className="mt-1 text-2xl font-semibold">{average.toFixed(1)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-zinc-600">Sector leader</dt>
                  <dd className="mt-1 font-semibold">{leader?.name}</dd>
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
