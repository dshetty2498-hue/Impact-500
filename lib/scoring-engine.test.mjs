import assert from "node:assert/strict";
import test from "node:test";
import {
  PILLARS,
  RUBRIC_DIMENSIONS,
  calculateAssessmentScore,
  gradeForScore,
  rankScoredCompanies,
  validateAssessment,
} from "./scoring-engine.mjs";

const source = {
  id: "annual-report",
  title: "Annual report",
  publisher: "Example Company",
  url: "https://example.com/report.pdf",
  accessedOn: "2026-10-16",
  type: "report",
};
const observation = (score) => ({
  score,
  evidence: "The cited report documents the relevant policy and result.",
  analysis: "Impact Horizon evaluated the disclosed result against the rubric.",
  sourceIds: [source.id],
});
const assessment = {
  companySlug: "example-company",
  cycleId: "2026-sep-oct",
  reviewer: "Researcher",
  reviewedOn: "2026-10-16",
  sources: [source],
  facts: Object.fromEntries(
    [
      ["companyName", "Example Company"],
      ["ticker", "EXM"],
      ["industry", "Technology"],
      ["headquarters", "Dallas, Texas"],
      ["founded", 2000],
      ["employees", 1000],
      ["revenueBillions", 2.5],
      ["marketCapBillions", 5],
      ["fortuneRank", 500],
      ["fortuneRankYear", 2026],
      ["website", "https://example.com"],
      ["logo", "https://example.com/logo.svg"],
      ["ceo", "Example Leader"],
      ["ceoTitle", "Chief Executive Officer"],
    ].map(([key, value]) => [key, { value, sourceIds: [source.id] }]),
  ),
  pillars: Object.fromEntries(
    PILLARS.map((pillar) => [
      pillar,
      Object.fromEntries(RUBRIC_DIMENSIONS.map((dimension) => [dimension, observation(84)])),
    ]),
  ),
  analysis: {
    strengths: "Documented strengths.",
    concerns: "Documented concerns.",
    changes: "Documented changes.",
    trends: "Documented trends.",
    monitor: "Documented monitoring priority.",
    opportunities: "Documented opportunity.",
  },
};

test("a complete assessment deterministically produces pillars, score, and grade", () => {
  assert.deepEqual(calculateAssessmentScore(assessment), {
    pillars: {
      Environmental: 84,
      "Financial responsibility": 84,
      Philanthropy: 84,
      Ethics: 84,
    },
    score: 84,
    grade: "B",
  });
  assert.deepEqual(validateAssessment(assessment, assessment.cycleId), []);
});

test("publication validation rejects missing source evidence", () => {
  const invalid = structuredClone(assessment);
  invalid.pillars.Environmental.Outcome.sourceIds = [];
  assert.match(validateAssessment(invalid, invalid.cycleId).join("\n"), /source id is required/);
});

test("grade boundaries and ranking tie-breaks are stable", () => {
  assert.equal(gradeForScore(89.9), "B");
  assert.equal(gradeForScore(90), "A");
  assert.deepEqual(
    rankScoredCompanies([
      { name: "Zulu", score: 80 },
      { name: "Alpha", score: 80 },
      { name: "Beta", score: 81 },
    ]).map(({ name, rank }) => [name, rank]),
    [
      ["Beta", 1],
      ["Alpha", 2],
      ["Zulu", 3],
    ],
  );
});
