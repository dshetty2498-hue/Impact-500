import { CompanyTable } from "@/components/impact/company-table";
import { SectionTitle } from "@/components/ui/primitives";
import { companies } from "@/lib/data";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Company Research Directory",
  "Search corporate responsibility profiles by company, industry, headquarters, score, and evidence coverage.",
  "/companies",
);

export default function CompaniesPage() {
  return (
    <section className="page-shell">
      <SectionTitle
        eyebrow="Company research directory"
        title="Corporate responsibility profiles"
        text={`Search ${companies.length.toLocaleString()} company records by name, industry, headquarters, score, grade, and evidence coverage.`}
      />
      <div className="mt-12">
        <CompanyTable />
      </div>
    </section>
  );
}
