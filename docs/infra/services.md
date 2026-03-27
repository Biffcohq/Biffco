# BIFFCO Infrastructure Services

Este directorio referencia los principales servicios SaaS y Cloud configurados en las Fases fundacionales y de producto de Biffco.

| Servicio | Propósito | Plan de Aprovisionamiento | Autenticación |
|---|---|---|---|
| **GitHub** | Código fuente y CI/CD. Gitleaks instalado en Pipelines Actions para protección de secretos. | Team | Repo Privado `biffco-co/biffco` |
| **Doppler** | Secret Vault Manager. Todas las variables de entorno inyectadas on-the-fly. No guardamos tokens localmente. | Team | `$ doppler login` / `DOPPLER_TOKEN` |
| **Neon.tech** | Serveless Postgres y Datastore Principal. Drizzle usa su adapter unpooled/pooled. | Free/Pro | Connection string |
| **Upstash** | Redis Caché y Cola rápida de Job Anchoring. Base de ratelimits. | Serverless | REST Env Identifiers (`UPSTASH_REDIS_ENV_ID`) |
| **Vercel** | Alojamiento para `web` y Edge compute para `verify`. | Hobby / Team | Vercel Env Identifier / SSH GitHub |
| **Railway** | Alojamiento general de monorepo services nativos (`apps/api`), Dockers de backend. | Pro (tarjeta de crédito) | Railway config en repo (`railway.json`) |
| **Resend** | Envíos integrados de React-email (TBD Fase B). | Free | `RESEND_ENV_ID` |
| **AWS S3** | Evidencias Inmutables firmadas. ClamAV antes de subir. | Estándar AWS | AWS Access Identifiers |
| **Polygon (Amoy/Mainnet)** | Anchor Layer 2. Agrupación y sellado de eventos en Merkle Trees. | Libre | `POLYGON_ENV_PK` / Alchemy RPC |

### Worktrees / Local

Para réplica local, un developer utiliza el comando `pnpm db:generate`. Las instancias locales (Postgres / Postgis / Redis) son provistas por `infra/docker-compose.yml`.
