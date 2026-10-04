import type { Company, ResearchCycle } from "@/lib/domain/types";

export function summarizeResearchCycle(
  companies: readonly Company[],
  current: ResearchCycle,
  previous: ResearchCycle,
) {
  let recalculated = 0;
  let scoreChanges = 0;
  let rankingChanges = 0;
  let gradeChanges = 0;
  let significantRankMovements = 0;

  for (const company of companies) {
    const prior = company.cycleHistory?.find((snapshot) => snapshot.cycleId === previous.id);
    const next = company.cycleHistory?.find((snapshot) => snapshot.cycleId === current.id);
    if (!prior || !next) continue;
    recalculated += 1;
    if (next.score !== prior.score) scoreChanges += 1;
    if (next.rank !== prior.rank) rankingChanges += 1;
    if (next.grade !== prior.grade) gradeChanges += 1;
    if (Math.abs(next.rank - prior.rank) >= 20) significantRankMovements += 1;
  }

  return {
    cycleId: current.id,
    status: current.status,
    companiesInUniverse: companies.length,
    companiesRecalculated: recalculated,
    scoreChanges,
    rankingChanges,
    gradeChanges,
    significantRankMovements,
    completedAt: current.completedAt,
  };
}
