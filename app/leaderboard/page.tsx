import { CompanyTable } from "@/components/impact/company-table";
import { SectionTitle } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Leaderboard",
  "Ranked corporate responsibility performance across Impact500 companies.",
  "/leaderboard",
);
export default function LeaderboardPage() {
  return (
    <section className="page-shell">
      <SectionTitle
        eyebrow="Impact500 research index"
        title="The corporate responsibility leaderboard."
        text="A comparable view of verified performance, updated with each published research cycle."
      />
      <div className="mt-12">
        <CompanyTable />
      </div>
    </section>
  );
}
