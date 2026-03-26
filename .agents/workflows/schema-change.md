---
description: "Safely modify the database schema with review and migration"
---

# Schema Change

Follow this workflow for ANY database schema modification.

## Steps

1. Describe the schema change needed and the business reason.
2. Classify the risk level:
   - **Safe**: Adding nullable columns, adding indexes, adding new tables
   - **Dangerous**: Renaming columns/tables, changing types — requires ADR
   - **Very Dangerous**: Dropping columns/tables — requires ADR + migration plan
3. Write the Drizzle schema change in `packages/db/src/schema/`.
4. Generate migration: `pnpm db:generate`
5. **REVIEW the generated SQL manually** — Drizzle can make mistakes.
6. For triggers and RLS policies: add manually to the SQL file (Drizzle doesn't generate these).
7. Run migration on dev: `pnpm db:migrate`
8. Verify: run migration again — must say "No pending migrations".
9. Run migration on staging.
10. Open PR with schema change + migration file.
11. Include the raw SQL diff in the PR description for reviewability.
