export const PILLARS = ["Environmental", "Financial responsibility", "Philanthropy", "Ethics"];

export const RUBRIC_DIMENSIONS = [
  "Commitment",
  "Governance",
  "Implementation",
  "Outcome",
  "Verification",
];

export const PILLAR_WEIGHTS = Object.freeze(
  Object.fromEntries(PILLARS.map((pillar) => [pillar, 0.25])),
);

export const RUBRIC_WEIGHTS = Object.freeze(
  Object.fromEntries(RUBRIC_DIMENSIONS.map((dimension) => [dimension, 0.2])),
);

const rounded = (value) => Number(value.toFixed(1));

export function gradeForScore(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

export function calculateOverallScore(pillars) {
  return rounded(
    PILLARS.reduce((sum, pillar) => sum + pillars[pillar] * PILLAR_WEIGHTS[pillar], 0),
  );
}

export function calculatePillarScore(observations) {
  return rounded(
    RUBRIC_DIMENSIONS.reduce(
      (sum, dimension) => sum + observations[dimension].score * RUBRIC_WEIGHTS[dimension],
      0,
    ),
  );
}

export function calculateAssessmentScore(assessment) {
  const pillars = Object.fromEntries(
    PILLARS.map((pillar) => [pillar, calculatePillarScore(assessment.pillars[pillar])]),
  );
  const score = calculateOverallScore(pillars);
  return { pillars, score, grade: gradeForScore(score) };
}

export function validateAssessment(assessment, cycleId) {
  const issues = [];
  if (!assessment || typeof assessment !== "object") return ["Assessment must be an object."];
  if (!assessment.companySlug) issues.push("Missing companySlug.");
  if (assessment.cycleId !== cycleId) issues.push("cycleId does not match the active cycle.");
  if (!assessment.reviewer?.trim()) issues.push("Missing reviewer.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(assessment.reviewedOn ?? "")) {
    issues.push("reviewedOn must use YYYY-MM-DD.");
  }

  const sources = new Map();
  for (const source of assessment.sources ?? []) {
    if (!source.id?.trim()) {
      issues.push("A source is missing its id.");
      continue;
    }
    if (sources.has(source.id)) issues.push(`Duplicate source id ${source.id}.`);
    sources.set(source.id, source);
    if (!source.title?.trim()) issues.push(`${source.id}: missing source title.`);
    if (!source.publisher?.trim()) issues.push(`${source.id}: missing source publisher.`);
    if (!/^https:\/\//.test(source.url ?? ""))
      issues.push(`${source.id}: source URL must use HTTPS.`);
    if (!["filing", "report", "news", "government", "company", "industry"].includes(source.type)) {
      issues.push(`${source.id}: invalid source type.`);
    }
    if (source.publishedOn && !/^\d{4}-\d{2}-\d{2}$/.test(source.publishedOn)) {
      issues.push(`${source.id}: publishedOn must use YYYY-MM-DD.`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(source.accessedOn ?? "")) {
      issues.push(`${source.id}: accessedOn must use YYYY-MM-DD.`);
    }
    if (source.manualVerifiedOn && !/^\d{4}-\d{2}-\d{2}$/.test(source.manualVerifiedOn)) {
      issues.push(`${source.id}: manualVerifiedOn must use YYYY-MM-DD.`);
    }
    if (source.manualVerifiedOn && !source.manualVerificationNote?.trim()) {
      issues.push(`${source.id}: manual verification requires a note.`);
    }
  }
  if (!sources.size) issues.push("At least one source is required.");

  for (const pillar of PILLARS) {
    const observations = assessment.pillars?.[pillar];
    if (!observations) {
      issues.push(`${pillar}: missing pillar observations.`);
      continue;
    }
    for (const dimension of RUBRIC_DIMENSIONS) {
      const observation = observations[dimension];
      const label = `${pillar}/${dimension}`;
      if (!observation) {
        issues.push(`${label}: missing observation.`);
        continue;
      }
      if (!Number.isFinite(observation.score) || observation.score < 0 || observation.score > 100) {
        issues.push(`${label}: score must be between 0 and 100.`);
      }
      if (!observation.evidence?.trim()) issues.push(`${label}: missing evidence summary.`);
      if (!observation.analysis?.trim()) issues.push(`${label}: missing Impact Horizon analysis.`);
      if (!Array.isArray(observation.sourceIds) || !observation.sourceIds.length) {
        issues.push(`${label}: at least one source id is required.`);
      } else {
        for (const sourceId of observation.sourceIds) {
          if (!sources.has(sourceId)) issues.push(`${label}: unknown source id ${sourceId}.`);
        }
      }
    }
  }

  for (const field of [
    "companyName",
    "ticker",
    "industry",
    "headquarters",
    "founded",
    "employees",
    "revenueBillions",
    "marketCapBillions",
    "fortuneRank",
    "fortuneRankYear",
    "website",
    "logo",
    "ceo",
    "ceoTitle",
  ]) {
    const fact = assessment.facts?.[field];
    if (
      !fact ||
      ((fact.value === "" || fact.value === null || fact.value === undefined) &&
        !fact?.unavailableReason?.trim())
    ) {
      issues.push(`facts.${field}: missing value or documented unavailable reason.`);
      continue;
    }
    if (!Array.isArray(fact.sourceIds) || !fact.sourceIds.length) {
      issues.push(`facts.${field}: at least one source id is required.`);
    } else {
      for (const sourceId of fact.sourceIds) {
        if (!sources.has(sourceId)) issues.push(`facts.${field}: unknown source id ${sourceId}.`);
      }
    }
  }

  for (const field of [
    "founded",
    "employees",
    "revenueBillions",
    "fortuneRank",
    "fortuneRankYear",
  ]) {
    const value = assessment.facts?.[field]?.value;
    if (value !== null && value !== undefined && (!Number.isFinite(value) || value < 0)) {
      issues.push(`facts.${field}: expected a non-negative finite number.`);
    }
  }
  const fortuneRank = assessment.facts?.fortuneRank?.value;
  if (Number.isFinite(fortuneRank) && (fortuneRank < 1 || fortuneRank > 500)) {
    issues.push("facts.fortuneRank: expected 1–500.");
  }
  for (const field of ["website", "logo"]) {
    const value = assessment.facts?.[field]?.value;
    if (value && !/^https:\/\//.test(value)) issues.push(`facts.${field}: URL must use HTTPS.`);
  }

  for (const field of ["strengths", "concerns", "changes", "trends", "monitor", "opportunities"]) {
    if (!assessment.analysis?.[field]?.trim()) issues.push(`analysis.${field}: missing.`);
  }
  for (const [collection, entries] of [
    ["initiatives", assessment.initiatives ?? []],
    ["recentNews", assessment.recentNews ?? []],
  ]) {
    for (const [index, entry] of entries.entries()) {
      if (!entry.sourceIds?.length) issues.push(`${collection}[${index}]: sourceIds are required.`);
      for (const sourceId of entry.sourceIds ?? []) {
        if (!sources.has(sourceId))
          issues.push(`${collection}[${index}]: unknown source ${sourceId}.`);
      }
    }
  }
  return issues;
}

export function rankScoredCompanies(companies) {
  return [...companies]
    .sort((left, right) => right.score - left.score || left.name.localeCompare(right.name))
    .map((company, index) => ({ ...company, rank: index + 1 }));
}
