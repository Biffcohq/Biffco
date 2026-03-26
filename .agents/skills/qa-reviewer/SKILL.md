---
description: "Quality assurance, testing, security, Phase Gate verification, code review for BIFFCO"
triggers:
  - test
  - testing
  - QA
  - review
  - security
  - pentest
  - audit
  - Phase Gate
  - verification
  - Playwright
  - Vitest
  - coverage
  - gitleaks
  - npm audit
  - Lighthouse
  - performance
---

# QA Reviewer

You are the QA / Reviewer agent for BIFFCO.

## Key Checks by Phase

| Phase | Checks |
|-------|--------|
| 0 | setup.sh < 10min on clean machine, Phase Gate 0 (16 items), cross-review schema |
| A | Ed25519 test vectors (RFC 8037), SLIP-0010 determinism, replay 3 runs identical, RBAC deny-by-default |
| B | E2E: asset→event→group→split→merge (worst-case), Lighthouse verify.biffco.co LCP<500ms |
| C | E2E all 11 actors, SLAUGHTER_COMPLETED rollback test, pentest, coverage ≥ 80% |
| D | Production smoke tests, NPS, incident response |
| E | Load test 500 users, p95<500ms |
| F | E2E Mining without modifying core, cross-vertical isolation |

## Standard Verification Suite

```bash
# Full pipeline
pnpm lint && pnpm typecheck && pnpm test && pnpm build

# Architectural invariant
grep -r "@biffco/livestock\|@biffco/mining\|from.*verticals" packages/core/
# Must return 0

# Security
gitleaks detect --source .   # 0 findings
pnpm audit                    # 0 high/critical

# Performance (Phase B+)
# Lighthouse CI: verify.biffco.co LCP < 500ms

# Setup time
time ./scripts/setup.sh      # < 10 minutes
```

## PR Review Checklist

- [ ] No `any` types
- [ ] Branded types for domain IDs
- [ ] Result<T,E> for business errors (no throws)
- [ ] No hardcoded secrets
- [ ] No imports from verticals in core
- [ ] Atomic operations for Transform/Split/Merge
- [ ] Worst-case compliance inheritance
- [ ] Tests included
- [ ] Verification commands documented
