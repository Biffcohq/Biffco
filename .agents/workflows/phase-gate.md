---
description: "Execute Phase Gate verification checklist"
---

# Phase Gate Verification

Execute the complete Phase Gate checklist for the current phase.

## Steps

1. Identify the current phase (0, A, B, C, D, E, or F) from project state.
2. Load the corresponding Phase Gate criteria from the playbook.
3. Execute each verification command listed in the checklist.
4. For each item, document: command executed, output, PASSED/FAILED status.
5. Items marked 🔴 CRITICAL must ALL be ✅ before the phase can close.
6. Items marked 🟡 RECOMMENDED that fail must be documented in `docs/deferred-items.md` with DEF-XXX ID.
7. Generate a Phase Gate report in markdown format.
8. Open a PR titled "Phase Gate [X] — Verification" with the full report.

## Phase Gate 0 Quick Checklist

```bash
# PG0-01: setup.sh < 10 minutes
time ./scripts/setup.sh

# PG0-02: 3 apps respond HTTP 200
curl -I https://biffco.co && curl -I https://app.biffco.co && curl -I https://verify.biffco.co

# PG0-03: PostGIS active
doppler run --config dev -- psql $DATABASE_URL -c "SELECT PostGIS_Version();"

# PG0-04: Schema migrated
pnpm db:migrate  # must say "No pending migrations"

# PG0-05: Anti-tampering trigger
psql -c "UPDATE domain_events SET type='x' WHERE FALSE"  # must ERROR

# PG0-06: CI passes
# Open a PR with trivial change → all steps pass

# PG0-07: ESLint invariant in CI
# Open PR with prohibited import in packages/core → CI fails

# PG0-08: gitleaks
gitleaks detect --source .  # 0 findings

# PG0-09: npm audit
pnpm audit  # 0 high/critical

# PG0-10: typecheck
pnpm typecheck  # 0 errors

# PG0-11: ADR-001 committed
git log --oneline docs/ADRs/ADR-001*.md

# PG0-12: README updated
cat README.md | head -50
```
