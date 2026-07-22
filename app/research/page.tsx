import { ResearchLibrary } from "@/components/impact/research-library";
import { SectionTitle } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Research Library",
  "Search Impact500 research by category, author, tag, and publication date.",
  "/research",
);
export default function ResearchPage() {
  return (
    <section className="page-shell">
      <SectionTitle
        eyebrow="Research library"
        title={
          <>
            Evidence with <em className="text-cyan">consequence.</em>
          </>
        }
        text="Original reporting, sector analysis, and annual publications—organized for exploration and future growth."
      />
      <ResearchLibrary />
    </section>
  );
}
