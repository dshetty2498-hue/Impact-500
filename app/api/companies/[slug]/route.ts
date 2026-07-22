import { apiNotFound, apiSuccess } from "@/lib/api";
import { platformRepository } from "@/lib/repositories/platform";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const company = platformRepository.company((await params).slug);
  return company ? apiSuccess(company) : apiNotFound("Company");
}
