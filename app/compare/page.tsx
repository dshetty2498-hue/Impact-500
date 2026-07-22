import { CompanyComparison } from "@/components/impact/company-comparison";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Compare Companies",
  "Compare corporate responsibility scores and pillars side by side.",
  "/compare",
);
export default function ComparePage() {
  return <CompanyComparison />;
}
