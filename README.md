# BIFFCO™ — Foundation System

> **Trust Infrastructure for Global Value Chains.** BIFFCO asegura la trazabilidad y la certificación de origen mediante criptografía y firmas end-to-end integradas nativamente sin fricción de billeteras o gas fees.

![BIFFCO Foundation Status](https://img.shields.io/badge/Phase-Foundation_Gates_0-green)
![CI Build](https://github.com/Biffcohq/biffco/actions/workflows/ci.yml/badge.svg)

## 🏢 Arquitectura Multitenant (Turborepo)

Este entorno consolida bajo un solo monolito virtual todas las piezas modulares de la arquitectura Phase 0 de Biffco. Todo se orquesta a través del stack **Next.js 14**, **Tailwind v3** (Custom Design Tokens), y persistencia Edge-Ready vía **Drizzle ORM** con base Neon PostgreSQL. 

### `apps/`
- `api/` — Fastify 5 Backend. Central nervous system en Fase A.
- `platform/` — `app.biffco.co`. Dashboard interno SaaS.
- `verify/` — `verify.biffco.co`. Extracción limpia de la firma y validación de Assets por Scanner público.
- `web/` — `biffco.co`. Landing page pública muti-verticales.

### `packages/`
- `@biffco/db` — Drizzle schema unificado y migraciones. 
- `@biffco/config` — Entornos Zod validados para Inyección de variables restrictivas.
- `@biffco/shared` — Branded Types estáticos compartidos.

## 🚀 Setup Inicial (Modo Dev - menos de 10 minutos)

> Requisitos Base: Node.js 22 LTS, `pnpm@9` instado en tu Path, Docker Desktop activo y CLI de `doppler` inicializada en tu cuenta.

### Paso Rápido (Recomendado)
Ejecuta el orquestador automático de Bash que instala paquetes, descarga tu vault en Doppler, levanta contenedores Postgres/Redis locales y genera el ORM.

```bash
chmod +x ./scripts/setup.sh
./scripts/setup.sh
```

### Paso Manual
Si el orquestador de Bash no es compatible con el CWD de tu consola o no quieres usar la inyección automatizada de llaves. Haz setup de Zod enviroment de Doppler.
```bash
doppler login
pnpm install
doppler run -- pnpm --filter @biffco/db db:generate
docker-compose up -d --build
pnpm dev
```

## 🔒 Secretos y Variables
Todo requerimiento de llaves temporales y tokens SaaS se administra puramente en Doppler. Ningún commit bajo esta línea fundacional aceptará Push al remoto de GitHub en caso de inyectarse credenciales planas que rompan la mitigación `Gitleaks` de Seguridad en `.github/workflows`.

*Proyect Phase: 0 -> A (Semana Próxima).*
