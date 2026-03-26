---
description: "Review code changes against BIFFCO standards and invariants"
---

# Code Review

Review current changes against BIFFCO architectural standards.

## Steps

1. Run `git diff main` to see all changes.
2. Check for architectural invariant violations:
   - Any import from `packages/verticals/*` inside `packages/core/*`?
   - Any hardcoded secrets, API keys, or connection strings?
   - Any `throw` for business logic instead of `Result<T,E>`?
   - Any raw `process.env` instead of `@biffco/config`?
   - Any `any` type?
3. Check for domain leaks:
   - Domain-specific terms ("vaca", "corral", "mineral") in packages/core?
   - Hardcoded labels instead of VerticalPack labels?
4. Check for data safety:
   - Atomic transactions for Transform/Split/Merge?
   - Worst-case compliance inheritance implemented?
   - RLS context set before queries?
5. Check frontend standards:
   - Colors via CSS variables only?
   - Mobile-responsive?
   - No Google Fonts?
6. Generate review summary with ✅/❌ per check and specific file:line references.
