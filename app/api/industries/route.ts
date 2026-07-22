import { apiSuccess } from "@/lib/api";
import { platformRepository } from "@/lib/repositories/platform";
export function GET() {
  return apiSuccess(platformRepository.industries());
}
