#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  PILLARS,
  RUBRIC_DIMENSIONS,
  calculateAssessmentScore,
  validateAssessment,
} from "../lib/scoring-engine.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const researchRoot = resolve(process.env.RESEARCH_CYCLE_WORKSPACE ?? join(root, "research/cycles"));
const generatedRoot = resolve(process.env.RESEARCH_CYCLE_GENERATED_DIR ?? join(root, "data"));
const args = process.argv.slice(2);
const command = args.shift();

const option = (name, fallback = undefined) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? fallback : args[index + 1];
};

const fail = (message) => {
  console.error(message);
  process.exit(1);
};

const assertCycleId = (id) => {
  if (!/^\d{4}-(?:jan-feb|mar-apr|may-jun|jul-aug|sep-oct|nov-dec)$/.test(id ?? "")) {
    fail("Cycle id must use YYYY-jan-feb through YYYY-nov-dec.");
  }
};

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function readUniverse() {
  const source = readFileSync(join(root, "data/fortune-500-2026.generated.ts"), "utf8");
  const marker = "export const fortune5002026 = ";
  const start = source.indexOf(marker);
  const end = source.indexOf("] as const satisfies", start);
  if (start === -1 || end === -1) fail("Could not read the Fortune 500 universe.");
  const literal = source.slice(start + marker.length, end + 1);
  const rows = Function(`"use strict"; return (${literal});`)();
  return rows.map(([fortuneRank, name, revenueMillions, industry, headquarters, ceo]) => ({
    slug: slugify(name),
    name,
    fortuneRank,
    revenueBillions: Number((revenueMillions / 1000).toFixed(1)),
    industry,
    headquarters,
    ceo,
  }));
}

const blankObservation = () => ({ score: null, evidence: "", analysis: "", sourceIds: [] });
const blankAssessment = (company, cycleId) => ({
  companySlug: company.slug,
  companyName: company.name,
  cycleId,
  reviewer: "",
  reviewedOn: "",
  sources: [],
  facts: {
    companyName: { value: company.name, sourceIds: [] },
    ticker: { value: null, sourceIds: [] },
    industry: { value: company.industry, sourceIds: [] },
    headquarters: { value: company.headquarters, sourceIds: [] },
    founded: { value: null, sourceIds: [] },
    employees: { value: null, sourceIds: [] },
    revenueBillions: { value: company.revenueBillions, sourceIds: [] },
    marketCapBillions: { value: null, sourceIds: [], unavailableReason: "" },
    fortuneRank: { value: company.fortuneRank, sourceIds: [] },
    fortuneRankYear: { value: 2026, sourceIds: [] },
    website: { value: null, sourceIds: [] },
    logo: { value: null, sourceIds: [], unavailableReason: "" },
    ceo: { value: company.ceo, sourceIds: [] },
    ceoTitle: { value: null, sourceIds: [] },
    ceoAppointedYear: { value: null, sourceIds: [] },
  },
  pillars: Object.fromEntries(
    PILLARS.map((pillar) => [
      pillar,
      Object.fromEntries(RUBRIC_DIMENSIONS.map((dimension) => [dimension, blankObservation()])),
    ]),
  ),
  analysis: {
    strengths: "",
    concerns: "",
    changes: "",
    trends: "",
    monitor: "",
    opportunities: "",
  },
  initiatives: [],
  recentNews: [],
});

const cycleDir = (id) => resolve(researchRoot, id);
const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const writeJson = (path, value) => writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);

function readJsonLines(path) {
  return readFileSync(path, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch (error) {
        fail(`${path}:${index + 1}: ${error.message}`);
      }
    });
}

function loadCycle(id) {
  assertCycleId(id);
  const directory = cycleDir(id);
  const manifestPath = join(directory, "cycle.json");
  const assessmentsPath = join(directory, "assessments.jsonl");
  if (!existsSync(manifestPath) || !existsSync(assessmentsPath)) {
    fail(`Cycle ${id} is missing cycle.json or assessments.jsonl.`);
  }
  return {
    directory,
    manifest: readJson(manifestPath),
    assessments: readJsonLines(assessmentsPath),
  };
}

function validateCycle(manifest, assessments) {
  const universe = readUniverse();
  const universeBySlug = new Map(universe.map((company) => [company.slug, company]));
  const universeSlugs = new Set(universe.map((company) => company.slug));
  const issues = [];
  const companyIssues = {};
  if (manifest.methodologyVersion !== "4.2") issues.push("Methodology version must be 4.2.");
  if (!manifest.previousCycleId) issues.push("previousCycleId is required.");
  if (manifest.status !== "updating") issues.push("Input cycle status must remain updating.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(manifest.beganAt ?? "")) {
    issues.push("beganAt must use YYYY-MM-DD.");
  }
  if (assessments.length !== universe.length) {
    issues.push(`Expected ${universe.length} assessments; received ${assessments.length}.`);
  }
  const seen = new Set();
  const submittedRanks = new Map();
  for (const assessment of assessments) {
    if (seen.has(assessment.companySlug))
      issues.push(`Duplicate company ${assessment.companySlug}.`);
    seen.add(assessment.companySlug);
    if (!universeSlugs.has(assessment.companySlug)) {
      issues.push(`Unknown company ${assessment.companySlug}.`);
      continue;
    }
    const current = validateAssessment(assessment, manifest.id);
    const submittedRank = assessment.facts?.fortuneRank?.value;
    if (submittedRank !== universeBySlug.get(assessment.companySlug).fortuneRank) {
      current.push("facts.fortuneRank does not match the authoritative Fortune universe.");
    }
    if (submittedRanks.has(submittedRank)) {
      current.push(`facts.fortuneRank duplicates ${submittedRanks.get(submittedRank)}.`);
    } else {
      submittedRanks.set(submittedRank, assessment.companySlug);
    }
    if (assessment.reviewedOn && assessment.reviewedOn < manifest.beganAt) {
      current.push("reviewedOn predates the research cycle.");
    }
    if (current.length) companyIssues[assessment.companySlug] = current;
  }
  for (const slug of universeSlugs) {
    if (!seen.has(slug)) issues.push(`Missing company ${slug}.`);
  }
  return {
    valid: issues.length === 0 && Object.keys(companyIssues).length === 0,
    companiesInUniverse: universe.length,
    companiesReviewed: assessments.length - Object.keys(companyIssues).length,
    companiesBlocked: Object.keys(companyIssues).length,
    issues,
    companyIssues,
  };
}

function init() {
  const id = option("id");
  const name = option("name");
  const dateLabel = option("label");
  const previousCycleId = option("previous");
  const beganAt = option("began", new Date().toISOString().slice(0, 10));
  if (!id || !name || !dateLabel || !previousCycleId) {
    fail("init requires --id, --name, --label, and --previous.");
  }
  assertCycleId(id);
  assertCycleId(previousCycleId);
  const history = readPublishedIndex();
  const latestPublishedId = history.at(-1)?.id ?? "2026-jul-aug";
  if (previousCycleId !== latestPublishedId) {
    fail(`Previous cycle must be the latest published cycle (${latestPublishedId}).`);
  }
  const directory = cycleDir(id);
  if (existsSync(directory)) fail(`Cycle directory already exists: ${directory}`);
  mkdirSync(directory, { recursive: true });
  const manifest = {
    id,
    name,
    dateLabel,
    previousCycleId,
    status: "updating",
    companiesReviewed: 0,
    companiesWithUpdatedScores: 0,
    beganAt,
    completedAt: null,
    methodologyVersion: "4.2",
    note: "Source review and indicator-level scoring are in progress. Previously published scores remain visible until validation is complete.",
  };
  writeJson(join(directory, "cycle.json"), manifest);
  const assessments = readUniverse().map((company) => blankAssessment(company, id));
  writeFileSync(
    join(directory, "assessments.jsonl"),
    `${assessments.map((assessment) => JSON.stringify(assessment)).join("\n")}\n`,
  );
  writeGeneratedPackage({
    cycle: manifest,
    assessments: [],
    generatedAt: new Date().toISOString(),
    integrityHash: null,
  });
  writeGeneratedHistory(history);
  writeGeneratedPackages(history);
  console.log(`Initialized ${id} with ${assessments.length} company research records.`);
}

function validate() {
  const id = option("id");
  if (!id) fail("validate requires --id.");
  const cycle = loadCycle(id);
  const report = validateCycle(cycle.manifest, cycle.assessments);
  writeJson(join(cycle.directory, "validation-report.json"), report);
  console.log(
    `${id}: ${report.companiesReviewed}/${report.companiesInUniverse} complete; ${report.companiesBlocked} blocked.`,
  );
  if (!report.valid) process.exit(1);
}

const sourceInventory = (assessments) =>
  [
    ...new Map(
      assessments.flatMap((assessment) => assessment.sources).map((source) => [source.url, source]),
    ).values(),
  ].sort((left, right) => left.url.localeCompare(right.url));

const sourceInventoryHash = (assessments) =>
  createHash("sha256")
    .update(JSON.stringify(sourceInventory(assessments)))
    .digest("hex");

async function checkSource(source) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    let response = await fetch(source.url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "ImpactHorizonSourceAudit/1.0" },
    });
    if (response.status === 405) {
      response = await fetch(source.url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: { range: "bytes=0-0", "user-agent": "ImpactHorizonSourceAudit/1.0" },
      });
    }
    if (response.status >= 200 && response.status < 400) {
      return { url: source.url, status: "reachable", httpStatus: response.status };
    }
    if (
      [401, 403, 429].includes(response.status) &&
      source.manualVerifiedOn &&
      source.manualVerificationNote
    ) {
      return {
        url: source.url,
        status: "manually-verified",
        httpStatus: response.status,
        manualVerifiedOn: source.manualVerifiedOn,
      };
    }
    return { url: source.url, status: "failed", httpStatus: response.status };
  } catch (error) {
    if (source.manualVerifiedOn && source.manualVerificationNote) {
      return {
        url: source.url,
        status: "manually-verified",
        httpStatus: null,
        manualVerifiedOn: source.manualVerifiedOn,
      };
    }
    return { url: source.url, status: "failed", httpStatus: null, error: error.message };
  } finally {
    clearTimeout(timer);
  }
}

async function auditSources() {
  const id = option("id");
  if (!id) fail("audit-sources requires --id.");
  const cycle = loadCycle(id);
  const sources = sourceInventory(cycle.assessments);
  const results = new Array(sources.length);
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(12, sources.length) }, async () => {
      while (cursor < sources.length) {
        const index = cursor++;
        results[index] = await checkSource(sources[index]);
      }
    }),
  );
  const failed = results.filter((result) => result.status === "failed");
  const report = {
    cycleId: id,
    auditedAt: new Date().toISOString(),
    sourceInventoryHash: sourceInventoryHash(cycle.assessments),
    sourcesChecked: sources.length,
    passed: results.length - failed.length,
    failed: failed.length,
    results,
  };
  writeJson(join(cycle.directory, "source-audit.json"), report);
  console.log(`${id}: ${report.passed}/${report.sourcesChecked} sources passed link validation.`);
  if (failed.length) process.exit(1);
}

const indexPath = () => join(researchRoot, "index.json");
const readPublishedIndex = () => (existsSync(indexPath()) ? readJson(indexPath()) : []);

function writeGeneratedHistory(cycles) {
  const source = `import type { ResearchCycle } from "@/lib/domain/types";\n\n/** Completed manifests generated by \`pnpm cycle:publish\`. */\nexport const publishedResearchCycles: ResearchCycle[] = ${JSON.stringify(cycles, null, 2)};\n`;
  writeFileSync(join(generatedRoot, "research-cycle-history.generated.ts"), source);
}

function writeGeneratedPackages(cycles) {
  const imports = cycles
    .map(
      (cycle, index) =>
        `import package${index} from "@/research/cycles/${cycle.id}/published.json";`,
    )
    .join("\n");
  const entries = cycles.map((_, index) => `package${index}`).join(", ");
  const source = `import type { ResearchCyclePackage } from "@/lib/research-cycle-package";\n${imports ? `${imports}\n` : ""}\n/** Immutable completed packages generated by \`pnpm cycle:publish\`. */\nexport const publishedResearchCyclePackages = [${entries}] as unknown as ResearchCyclePackage[];\n`;
  writeFileSync(join(generatedRoot, "research-cycle-packages.generated.ts"), source);
}

function writeGeneratedPackage(publication) {
  const source = `import type { ResearchCyclePackage } from "@/lib/research-cycle-package";\n\nexport const currentResearchCyclePackage = ${JSON.stringify(publication, null, 2)} satisfies ResearchCyclePackage;\n`;
  writeFileSync(join(generatedRoot, "current-research-cycle.generated.ts"), source);
}

function sync() {
  const id = option("id");
  if (!id) fail("sync requires --id.");
  const cycle = loadCycle(id);
  const report = validateCycle(cycle.manifest, cycle.assessments);
  const manifest = {
    ...cycle.manifest,
    status: "updating",
    companiesReviewed: report.companiesReviewed,
    companiesWithUpdatedScores: 0,
    completedAt: null,
  };
  writeJson(join(cycle.directory, "cycle.json"), manifest);
  writeJson(join(cycle.directory, "validation-report.json"), report);
  writeGeneratedPackage({
    cycle: manifest,
    assessments: [],
    generatedAt: new Date().toISOString(),
    integrityHash: null,
  });
  writeGeneratedHistory(readPublishedIndex());
  writeGeneratedPackages(readPublishedIndex());
  console.log(
    `Synced ${id} progress: ${report.companiesReviewed}/${report.companiesInUniverse} reviewed; published scores unchanged.`,
  );
}

function publish() {
  const id = option("id");
  const completedAt = option("completed", new Date().toISOString().slice(0, 10));
  if (!id) fail("publish requires --id.");
  const cycle = loadCycle(id);
  const report = validateCycle(cycle.manifest, cycle.assessments);
  writeJson(join(cycle.directory, "validation-report.json"), report);
  if (!report.valid) {
    fail(`${id} cannot publish: ${report.companiesBlocked} companies remain blocked.`);
  }
  const sourceAuditPath = join(cycle.directory, "source-audit.json");
  if (!existsSync(sourceAuditPath)) fail(`${id} cannot publish without source-audit.json.`);
  const sourceAudit = readJson(sourceAuditPath);
  if (
    sourceAudit.sourceInventoryHash !== sourceInventoryHash(cycle.assessments) ||
    sourceAudit.failed !== 0
  ) {
    fail(`${id} source audit is stale or contains failed links.`);
  }
  const auditAge = Date.now() - Date.parse(sourceAudit.auditedAt);
  if (!Number.isFinite(auditAge) || auditAge < 0 || auditAge > 7 * 24 * 60 * 60 * 1000) {
    fail(`${id} source audit is older than seven days; run audit-sources again.`);
  }
  const assessments = [...cycle.assessments].sort((a, b) =>
    a.companySlug.localeCompare(b.companySlug),
  );
  const scored = assessments.map((assessment) => ({
    companySlug: assessment.companySlug,
    ...calculateAssessmentScore(assessment),
  }));
  const manifest = {
    ...cycle.manifest,
    status: "complete",
    companiesReviewed: assessments.length,
    companiesWithUpdatedScores: assessments.length,
    completedAt,
    note: "All company evidence, indicator scores, rankings, and integrity checks passed the publication gate.",
  };
  const payload = JSON.stringify({ manifest, assessments });
  const integrityHash = createHash("sha256").update(payload).digest("hex");
  const publication = {
    cycle: manifest,
    assessments,
    generatedAt: new Date().toISOString(),
    integrityHash,
  };
  const snapshotPath = join(cycle.directory, "published.json");
  if (existsSync(snapshotPath)) fail(`${id} already has an immutable published snapshot.`);
  const history = readPublishedIndex();
  if (history.some((item) => item.id === id)) fail(`${id} already exists in the cycle index.`);
  const nextHistory = [...history, manifest];
  writeJson(snapshotPath, { ...publication, scored, validation: report, sourceAudit });
  writeJson(indexPath(), nextHistory);
  writeGeneratedHistory(nextHistory);
  writeGeneratedPackages(nextHistory);
  writeGeneratedPackage(publication);
  console.log(`Published ${id}: ${assessments.length} companies; SHA-256 ${integrityHash}.`);
}

switch (command) {
  case "init":
    init();
    break;
  case "validate":
    validate();
    break;
  case "sync":
    sync();
    break;
  case "audit-sources":
    await auditSources();
    break;
  case "publish":
    publish();
    break;
  default:
    fail("Usage: research-cycle.mjs <init|validate|sync|audit-sources|publish> [options]");
}
