# Research-cycle workspace

This directory is the evidence input boundary for Impact Horizon publication cycles. Public pages never read partial files from here. A completed cycle is published only after all 500 company assessments pass the shared validation and scoring engine.

## Start a cycle

```bash
corepack pnpm cycle:init -- --id 2026-nov-dec \
  --name "November–December 2026 research cycle" \
  --label "November–December 2026" \
  --previous 2026-sep-oct \
  --began 2026-11-01
```

This creates `research/cycles/<id>/cycle.json` and a 500-line `assessments.jsonl` research queue. Existing cycle directories are never overwritten.

Each company assessment must contain:

- current structural facts with source IDs;
- source metadata with HTTPS URLs and access dates;
- Commitment, Governance, Implementation, Outcome, and Verification observations for all four pillars;
- a 0–100 normalized score, evidence summary, Impact Horizon analysis, and citations for every observation;
- reviewer and review date;
- current strengths, concerns, changes, trends, monitoring priorities, and opportunities.

Missing evidence remains missing: it cannot be replaced by a neutral or guessed number. Any missing value blocks publication.

## Validate and publish

```bash
corepack pnpm cycle:validate -- --id 2026-nov-dec
corepack pnpm cycle:sync -- --id 2026-nov-dec
corepack pnpm cycle:audit-sources -- --id 2026-nov-dec
corepack pnpm cycle:publish -- --id 2026-nov-dec --completed 2026-12-20
corepack pnpm check
```

Validation writes a machine-readable `validation-report.json`. `cycle:sync` updates only the public progress count and never exposes partial scores. `cycle:audit-sources` checks every unique citation; authentication-protected sources require a dated manual-verification note. Publication succeeds only at 500/500 valid assessments with a current, passing source audit. It creates an immutable `published.json` snapshot with a SHA-256 integrity hash, appends the completed manifest to the historical registry, and compiles `data/current-research-cycle.generated.ts`.

The website then applies the package once at build time. The same company records power the leaderboard, profiles, industries, search, comparison, map, homepage, research, and reports. Scores are never recalculated in the browser.
