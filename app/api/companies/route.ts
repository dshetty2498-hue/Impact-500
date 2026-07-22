import { apiSuccess, finiteNumber } from "@/lib/api";
import { queryCompanies, type CompanyQuery } from "@/lib/repositories/platform";

export function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const data = queryCompanies({
    query: params.get("q") ?? undefined,
    industry: params.get("industry") ?? undefined,
    grade: params.get("grade") ?? undefined,
    minScore: finiteNumber(params.get("minScore")),
    maxScore: finiteNumber(params.get("maxScore")),
    minRevenue: finiteNumber(params.get("minRevenue")),
    maxRevenue: finiteNumber(params.get("maxRevenue")),
    minEmployees: finiteNumber(params.get("minEmployees")),
    headquarters: params.get("headquarters") ?? undefined,
    researchAvailable: params.get("research") === "true",
    sort: (params.get("sort") as CompanyQuery["sort"]) ?? undefined,
  });
  return apiSuccess(data);
}
