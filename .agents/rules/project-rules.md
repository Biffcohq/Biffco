# BIFFCO — Project Rules

## Identity
BIFFCO is **Trust Infrastructure for Global Value Chains** — a multi-vertical cryptographic traceability platform. Verticals: Livestock (EUDR 2026), Mining (Battery Passport EU 2027). Core is vertical-agnostic.

## 4 Immutable Principles — NEVER violate these
1. **Event Store Append-Only**: `domain_events` is immutable. PostgreSQL trigger rejects UPDATE/DELETE. Errors corrected with compensating events.
2. **Client-Side Signing**: Ed25519 signature in browser. Private key in `sessionStorage`. BIP-39 mnemonic shown ONCE — BIFFCO never stores it.
3. **Core Never Imports Verticals**: `packages/core` NEVER imports from `packages/verticals/*`.
4. **RBAC Deny-By-Default**: No explicit permission = Deny. RLS in PostgreSQL as second defense.

## Architectural Invariants
- **Atomic Operations**: Transform/Split/Merge are single PostgreSQL transactions.
- **Worst-Case Compliance Inheritance**: Inputs with alerts/holds → output inherits ALL alerts.
- **SLIP-0010 for Key Derivation**: Path `m/0'/wsIdx'/memberIdx'`.
- **Mnemonic Never Stored**: "mnemonic" must not appear in any DB table.

## Code Standards
- **TypeScript strict**: `strict: true`, `noUncheckedIndexedAccess`.
- **No `any`**: ESLint error on explicit any.
- **Branded types**: Use `AssetId`, `WorkspaceId`, `EventId` (never raw strings).
- **Result Type**: Use `Result<T, E>` for business errors — never `throw` for logic.
- **Style**: Prettier (semi: false, singleQuote: true, tabWidth: 2). Snake_case (DB), camelCase (TS Vars), PascalCase (Types).

## Stack (Locked)
- Runtime: Node.js 22 LTS
- Framework: Fastify 5 + tRPC v11
- ORM/DB: Drizzle ORM + PostgreSQL 16 (Neon)
- Crypto: libsodium-wrappers (Node), Web Crypto API (Browser)
- Frontend: Next.js 15 (App Router + Edge) + Tailwind CSS 4
