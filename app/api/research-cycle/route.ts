import { apiSuccess } from "@/lib/api";
import { companies } from "@/lib/data";
import { currentResearchCycle, previousResearchCycle, researchCycles } from "@/data/research-cycles";
import { summarizeResearchCycle } from "@/lib/research-cycle";

export function GET() {
  return apiSuccess({
    current: currentResearchCycle,
    previous: previousResearchCycle,
    history: researchCycles,
    summary: summarizeResearchCycle(companies, currentResearchCycle, previousResearchCycle),
  });
}
