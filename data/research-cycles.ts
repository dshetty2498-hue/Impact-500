import type { ResearchCycle } from "@/lib/domain/types";

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
  {
    id: "2026-sep-oct",
    name: "September–October 2026 research cycle",
    dateLabel: "September–October 2026",
    previousCycleId: "2026-jul-aug",
    status: "updating",
    companiesReviewed: 0,
    companiesWithUpdatedScores: 0,
    beganAt: "2026-09-29",
    completedAt: null,
    methodologyVersion: "4.2",
    note: "Source review and indicator-level scoring are in progress. Previously published scores remain visible until validation is complete.",
  },
] as const satisfies readonly ResearchCycle[];

export const currentResearchCycle = researchCycles.at(-1)!;
export const previousResearchCycle = researchCycles.find(
  (cycle) => cycle.id === currentResearchCycle.previousCycleId,
)!;
