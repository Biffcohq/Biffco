# BIFFCO Infrastructure Services

Este directorio referencia los principales servicios SaaS y Cloud configurados en las Fases fundacionales y de producto de Biffco.

| Servicio | Propósito | Plan de Aprovisionamiento | Autenticación |
|---|---|---|---|
| **GitHub** | Código fuente y CI/CD. Gitleaks instalado en Pipelines Actions para protección de secretos. | Team | Repo Privado `biffco-co/biffco` |
| **Doppler** | Secret Vault Manager. Todas las variables de entorno inyectadas on-the-fly. No guardamos tokens localmente. | Team | `$ doppler login` / `DOPPLER_TOKEN` |
| **Neon.tech** | Serveless Postgres y Datastore Principal. Drizzle usa su adapter unpooled/pooled. | Free/Pro | Connection string |
| **Upstash** | Redis Caché y Cola rápida de Job Anchoring. Base de ratelimits. | Serverless | REST Tokens (`UPSTASH_REDIS_TOKEN`) |
| **Vercel** | Alojamiento para `web` y Edge compute para `verify`. | Hobby / Team | Vercel Token / SSH GitHub |
| **Railway** | Alojamiento general de monorepo services nativos (`apps/api`), Dockers de backend. | Pro (tarjeta de crédito) | Railway config en repo (`railway.json`) |
| **Resend** | Envíos integrados de React-email (TBD Fase B). | Free | `RESEND_API_KEY` |
| **AWS S3** | Evidencias Inmutables firmadas. ClamAV antes de subir. | Estándar AWS | AWS Access Tokens |
| **Polygon (Amoy/Mainnet)** | Anchor Layer 2. Agrupación y sellado de eventos en Merkle Trees. | Libre | `POLYGON_PRIVATE_KEY` / Alchemy RPC |

### Worktrees / Local

Para réplica local, un developer utiliza el comando `pnpm db:generate`. Las instancias locales (Postgres / Postgis / Redis) son provistas por `infra/docker-compose.yml`.
