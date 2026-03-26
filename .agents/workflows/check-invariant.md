---
description: "Verify the Core-Verticals architectural invariant and all safety checks"
---

# Check Invariant

Verify that the BIFFCO architectural invariants are intact.

## Steps

1. Check Core never imports Verticals:
```bash
grep -r "@biffco/livestock\|@biffco/mining\|from.*verticals" packages/core/
# Expected: 0 results
```

2. Check no secrets in repo:
```bash
gitleaks detect --source .
# Expected: 0 findings
```

3. Check TypeScript compiles:
```bash
pnpm typecheck
# Expected: 0 errors
```

4. Check ESLint passes:
```bash
pnpm lint
# Expected: 0 errors
```

5. Check anti-tampering trigger exists:
```bash
psql -c "SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_name = 'domain_events_immutability_guard';"
# Expected: 1
```

6. Check no mnemonic stored server-side:
```bash
grep -r "mnemonic" packages/core/ apps/api/ packages/db/ --include="*.ts" | grep -v "test" | grep -v "node_modules"
# Expected: 0 results (except type definitions)
```

7. Report results with ✅/❌ for each check.
