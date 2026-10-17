import type { ResearchCycle } from "@/lib/domain/types";
import { currentResearchCyclePackage } from "@/data/current-research-cycle.generated";
import { publishedResearchCycles } from "@/data/research-cycle-history.generated";

/**
 * Append-only publication-cycle registry. A cycle remains `updating` until the
 * evidence audit, scoring run, and validation report have all completed.
 */
export const researchCycles = [
  {
    id: "2026-jul-aug",
    name: "July–August 2026 baseline",
    dateLabel: "July–August 2026",
    previousCycleId: null,
    status: "complete",
    companiesReviewed: 500,
    companiesWithUpdatedScores: 500,
    beganAt: "2026-07-01",
    completedAt: "2026-08-23",
    methodologyVersion: "4.2",
    note: "Baseline publication retained for historical comparison.",
  },
  ...publishedResearchCycles.filter(
    (cycle) => cycle.id !== currentResearchCyclePackage.cycle.id && cycle.id !== "2026-jul-aug",
  ),
  currentResearchCyclePackage.cycle,
] as const satisfies readonly ResearchCycle[];

export const currentResearchCycle = researchCycles.at(-1)!;
export const previousResearchCycle = researchCycles.find(
  (cycle) => cycle.id === currentResearchCycle.previousCycleId,
)!;
