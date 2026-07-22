import { Explorer } from "@/components/impact/explorer";
import { SectionTitle } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "CSR Explorer",
  "Discover companies aligned with your CSR priorities.",
  "/explorer",
);
export default function ExplorerPage() {
  return (
    <section className="page-shell">
      <SectionTitle
        eyebrow="Find your fit"
        title={
          <>
            Explore by <em className="text-cyan">what matters.</em>
          </>
        }
        text="Make the index your own with transparent, adjustable priorities."
      />
      <div className="mt-12">
        <Explorer />
      </div>
    </section>
  );
}
