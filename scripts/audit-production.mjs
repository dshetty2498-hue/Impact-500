const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");

async function get(path, asJson = false) {
  const response = await fetch(`${base}${path}`, {
    headers: { "user-agent": "ImpactHorizonProductionAudit/1.0" },
  });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return asJson ? response.json() : response.text();
}

async function eachConcurrent(items, limit, validate) {
  let cursor = 0;
  const errors = [];
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (cursor < items.length) {
        const index = cursor++;
        try {
          await validate(items[index], index);
        } catch (error) {
          errors.push(error instanceof Error ? error.message : String(error));
        }
      }
    }),
  );
  return errors;
}

function requireText(html, path, markers) {
  for (const marker of markers) {
    if (!html.includes(marker)) throw new Error(`${path}: missing “${marker}”`);
  }
  if (/>(?:NaN|undefined|null)</i.test(html)) {
    throw new Error(`${path}: contains an invalid visible value`);
  }
}

const [{ data: companies }, { data: industries }, { data: cycle }] = await Promise.all([
  get("/api/companies", true),
  get("/api/industries", true),
  get("/api/research-cycle", true),
]);

const errors = [];
if (companies.length !== 500) errors.push(`Company API returned ${companies.length}, expected 500.`);
if (new Set(companies.map((company) => company.slug)).size !== companies.length) {
  errors.push("Company API contains duplicate slugs.");
}
if (cycle.current.status !== "updating") errors.push("Current research cycle is not updating.");
if (cycle.summary.companiesInUniverse !== 500) errors.push("Cycle universe is not 500 companies.");

errors.push(
  ...(await eachConcurrent(companies, 24, async (company) => {
    const path = `/companies/${company.slug}`;
    const html = await get(path);
    requireText(html, path, ["Research Cycle:", "Risk Analysis", "Analyst Observations", "Founded"]);
  })),
);

errors.push(
  ...(await eachConcurrent(industries, 16, async (industry) => {
    const path = `/industries/${industry.slug}`;
    const html = await get(path);
    requireText(html, path, ["Industry Risk Landscape", "Analyst Observations"]);
  })),
);

for (const [path, markers] of [
  ["/", ["Latest Research Cycle:", "September–October 2026"]],
  ["/research-cycles", ["Research-cycle status and history", "Updating", "Publication gate"]],
  ["/leaderboard", ["last published results", "Full company directory"]],
  ["/compare", ["Published cycle", "Risk profile"]],
  ["/map", ["Corporate responsibility, mapped.", "CEO"]],
  ["/search", ["Global search", "Find the evidence"]],
]) {
  try {
    requireText(await get(path), path, markers);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(
  `Verified ${companies.length} company profiles, ${industries.length} industry pages, six cross-site surfaces, and the ${cycle.current.dateLabel} cycle API at ${base}.`,
);
