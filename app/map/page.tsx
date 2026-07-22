import { CompanyMap } from "@/components/impact/company-map";
import { SectionTitle } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Company Headquarters Map",
  "Explore Impact500 companies by headquarters, region, industry, and CSR grade.",
  "/map",
);
export default function MapPage() {
  return (
    <section className="page-shell">
      <SectionTitle
        eyebrow="Geographic intelligence"
        title="Corporate responsibility, mapped."
        text="Explore the geographic footprint of covered companies and move directly from headquarters to company research."
      />
      <div className="mt-10">
        <CompanyMap />
      </div>
    </section>
  );
}
