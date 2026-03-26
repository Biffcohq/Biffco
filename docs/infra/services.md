# Infra Services Registry

_Note: This file does **not** contain secrets or credentials. It serves as an architectural index to link the team to the correct Dashboard management interfaces._

## Doppler (Secrets Vault)
- **Production URL**: https://dashboard.doppler.com/workplace
- **Project Name**: `biffco`
- **Environments Managed**: `dev`, `staging`, `prod`
- **Scope**: Serves as the single source of truth for all `process.env`. The file `.doppler.yaml` points local workspaces directly to the `dev` environment.

## Neon (Database)
- **Production URL**: https://console.neon.tech
- **Project Name**: `biffco`
- **Architecture**: Serverless PostgreSQL 16 + PostGIS extension.
- **Connection Strings Strategy**:
  - `DATABASE_URL`: Hosted connection via PgBouncer Pooler (for the API app).
  - `DATABASE_URL_UNPOOLED`: Direct raw connection bypass (Mandatory for `pnpm db:migrate` via Drizzle).

## Upstash (Redis)
- **Production URL**: https://console.upstash.com
- **Architecture**: Serverless Redis caching nodes.
- **Regions**: Aligned with Neon region for minimal latency.
- **Environments**: Separate isolated databases for `dev` and `staging`.

## Railway (Backend API & Background Workers)
- **Production URL**: https://railway.app
- **Architecture**: Docker-based PaaS orchestrating the Fastify APIs and background queues.
- **Environment Strategy**: Empty native environments. Only `DOPPLER_TOKEN` is injected to dynamically fetch the vault at runtime.

## Vercel (Front-end Web & Web-Verifier)
- **Production URL**: https://vercel.com
- **Architecture**: Serverless hosting for Next.js, Edge functions and CDN routing.
- **Environment Strategy**: Leverages Vercel Doppler Integration to inject build-time variables.

_Once configured globally, the CI workflow will inject via a readonly Service Token (`DOPPLER_TOKEN`), making `.env` files completely obsolete on any developer machine._
