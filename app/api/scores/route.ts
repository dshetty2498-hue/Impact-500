import { apiSuccess } from "@/lib/api";
import { platformRepository } from "@/lib/repositories/platform";
export function GET() {
  return apiSuccess(
    platformRepository
      .companies()
      .map(({ slug, name, industry, score, grade, pillars, historicalScores, lastReviewed }) => ({
        slug,
        name,
        industry,
        score,
        grade,
        pillars,
        historicalScores,
        lastReviewed,
      })),
  );
}
