import { GlobalSearch } from "@/components/impact/global-search";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Search",
  "Search Impact500 companies, industries, reports, research, people, and methodology.",
  "/search",
);
export default function SearchPage() {
  return <GlobalSearch />;
}
