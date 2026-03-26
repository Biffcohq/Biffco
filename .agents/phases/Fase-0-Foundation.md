

**BIFFCO™**

*Trust Infrastructure for Global Value Chains*

**FASE 0 — FOUNDATION**

Playbook completo para el equipo de desarrollo

*Semanas 1–2  ·  Duración: 10 días hábiles  ·  Sprint único*

| Objetivo de la Fase 0 *Al finalizar estas dos semanas, cualquier developer que clone el repositorio ejecuta ./scripts/setup.sh y tiene el sistema completo corriendo en su máquina en menos de 10 minutos. Los tres entornos (dev, staging, prod) están configurados. Las tres apps están desplegadas en Vercel. El ESLint que protege el invariante arquitectónico está activo en CI. El schema de base de datos completo está migrado con PostGIS. No hay ninguna deuda técnica de setup que arrastrar.* |
| :---: |

Marzo 2026  ·  Córdoba, Argentina  ·  CONFIDENCIAL — USO INTERNO

# **Índice**

| Sección | Título |
| :---- | :---- |
| 01 | ¿Qué es la Fase 0 y por qué importa? |
| 02 | Equipo, roles y responsabilidades |
| 03 | Cronograma día a día — 10 días hábiles |
| 04 | Antes de arrancar — cuentas, accesos y prerequisitos |
| 05 | TASK-001 — Crear el repositorio y la estructura del monorepo |
| 06 | TASK-002 — Configuración de TypeScript, ESLint y Prettier |
| 07 | TASK-003 — Configurar Doppler (gestión de secretos) |
| 08 | TASK-004 — Configurar Neon (PostgreSQL \+ PostGIS) |
| 09 | TASK-005 — Configurar Upstash (Redis serverless) |
| 10 | TASK-006 — Configurar Railway (deploy de apps/api) |
| 11 | TASK-007 — Configurar Vercel (deploy de apps/web, platform, verify) |
| 12 | TASK-008 — packages/config |
| 13 | TASK-009 — packages/shared |
| 14 | TASK-010 — packages/db — schema completo |
| 15 | TASK-011 — infra/ — Docker Compose para desarrollo local |
| 16 | TASK-012 — scripts/setup.sh |
| 17 | TASK-013 — GitHub Actions CI/CD |
| 18 | TASK-014 — apps/web — biffco.co skeleton |
| 19 | TASK-015 — apps/platform — app.biffco.co skeleton |
| 20 | TASK-016 — apps/verify — verify.biffco.co skeleton |
| 21 | TASK-017 — ADR-001 y documentación inicial |
| 22 | Phase Gate 0 — Criterios de cierre y checklist |
| 23 | Troubleshooting — problemas comunes y soluciones |
| 24 | Deferred Items — lo que explícitamente no se hace en esta fase |

# **01\. ¿Qué es la Fase 0 y por qué importa?**

La Fase 0 es la única fase donde el costo de hacerlo mal es mayor que en cualquier otra. Si el schema de base de datos está mal diseñado, las migraciones del futuro serán dolorosas. Si el ESLint no está configurado desde el primer día, el invariante arquitectónico (packages/core nunca importa packages/verticals) se viola sin que nadie lo note. Si el setup local no está documentado y automatizado, cada nuevo developer pierde medio día en configuración.

|  | Principio de la Fase 0: no hay "lo configuramos después". Todo lo que se puede decidir ahora se decide ahora. Las decisiones de infrastructure, tooling y schema que se toman en la Fase 0 son las que el sistema va a cargar durante los 12 meses siguientes. |
| :---- | :---- |

## **Qué se produce en la Fase 0**

| Entregable | Descripción | ¿Cómo se verifica? |
| :---- | :---- | :---- |
| Repositorio GitHub configurado | Monorepo con pnpm workspaces, TurboRepo, estructura de carpetas canónica. | git clone \+ pnpm install funciona sin errores. |
| TypeScript \+ ESLint \+ Prettier | Configuración estricta con la regla de import que protege el Core. | pnpm lint en una violación de import produce error. |
| Doppler configurado | 3 proyectos: biffco-dev, biffco-staging, biffco-prod. Variables en cada entorno. | doppler run \-- node \-e "console.log(process.env.DATABASE\_URL)" imprime la URL correcta. |
| Neon: PostgreSQL 16 \+ PostGIS | Schema completo migrado en dev y staging. PostGIS activo. | SELECT PostGIS\_Version() retorna "3.4.x". |
| Upstash: Redis serverless | Instancias dev y staging configuradas y conectadas. | PING retorna PONG desde el worker. |
| Railway: API \+ worker | Proyecto creado, variables de entorno conectadas desde Doppler. | Health check GET /health retorna 200\. |
| Vercel: 3 apps desplegadas | biffco.co, app.biffco.co, verify.biffco.co — aunque vacías, accesibles públicamente. | Cada URL responde con el skeleton de la app. |
| packages/config | Zod schema de env vars. Fail-fast si falta cualquier variable. | Remover una variable requerida → proceso falla con mensaje claro. |
| packages/shared | Branded types, Result\<T,E\>, canonicalJson. Compilados sin errores. | pnpm typecheck retorna 0 errores. |
| packages/db | Schema Drizzle completo. Migrations ejecutadas en dev y staging. | pnpm db:migrate retorna "No pending migrations" en una segunda ejecución. |
| infra/ \+ setup.sh | docker-compose.yml con postgres+redis. setup.sh \< 10 minutos. | Time ./scripts/setup.sh \< 10:00 en máquina limpia. |
| GitHub Actions CI | Pipeline que corre en cada PR: lint → typecheck → test → build. | Abrir un PR con un import prohibido → CI falla con mensaje claro. |
| ADR-001 | Architecture Decision Record documenta la separación Core/Verticals. | Archivo docs/ADRs/ADR-001-core-verticals-separation.md commiteado. |

# **02\. Equipo, roles y responsabilidades**

La Fase 0 puede ser ejecutada por 1–2 developers. Idealmente uno hace backend (DB, API skeleton, CI) y otro hace frontend (apps skeleton, Vercel, diseño base). Si es 1 solo developer, el orden del cronograma ya está pensado para eso.

| Rol | Responsabilidad en Fase 0 | Tasks asignadas |
| :---- | :---- | :---- |
| Tech Lead / Backend Dev | Decisiones de arquitectura. Monorepo setup. Schema DB. CI/CD. Servicios externos de backend. | TASK-001 al 014, TASK-017 |
| Frontend Dev | Apps skeleton. Vercel setup. Design system tokens iniciales. Tailwind config. | TASK-014, TASK-015, TASK-016 (en paralelo desde Día 4\) |
| Ambos (o solo si es 1\) | Revisión cruzada del schema DB. Test del setup.sh en máquina del otro developer. | Phase Gate 0 verification |

## **Herramientas de comunicación del sprint**

* Daily standup: 15 minutos al inicio de cada día. Foco: ¿qué hice ayer? ¿qué hago hoy? ¿hay algún blocker?

* Canal de Slack/Discord dedicado: \#biffco-fase-0. Todo blocker va ahí inmediatamente, no al día siguiente.

* Issues en GitHub: cada TASK de este documento tiene un Issue correspondiente. Se cierra cuando la TASK está completa.

* PR obligatorio: aunque sea 1 solo developer, todo cambio va por PR. El CI tiene que pasar. No hay merge directo a main.

|  | ⚠ ATENCIÓN  Ninguna credencial (API key, password, connection string) se sube al repositorio. Ninguna. Ni en un archivo de prueba ni en un comentario. Doppler gestiona todos los secretos. |
| :---- | :---- |

# **03\. Cronograma día a día — 10 días hábiles**

El cronograma está diseñado para que las dependencias entre tasks estén resueltas cuando se necesiten. Los días 1–3 establecen la base sobre la que todo lo demás corre. Los días 4–7 son el trabajo más denso. Los días 8–10 son verificación, hardening y documentación.

| D01 | Lunes Semana 1 Repositorio \+ monorepo \+ tooling base |
| :---: | :---- |

| Hora | Actividad | Responsable | Entregable |
| :---- | :---- | :---- | :---- |
| 09:00–10:00 | Kickoff: revisar este playbook completo en equipo. Asignar issues en GitHub. | Todos | Issues creados, asignados y estimados. |
| 10:00–12:30 | TASK-001: Crear repo GitHub, pnpm workspaces, TurboRepo, estructura de carpetas. | Tech Lead | Repositorio con estructura básica. |
| 12:30–13:30 | TASK-002 parte 1: tsconfig.base.json y configuración TypeScript estricta. | Tech Lead | Todos los packages compilan sin errores. |
| 14:30–17:00 | TASK-002 parte 2: ESLint v9 flat config \+ regla no-restricted-imports \+ Prettier. | Tech Lead | pnpm lint sin errores. Import prohibido produce error. |
| 17:00–17:30 | PR\#001: monorepo base. Review y merge. | Ambos | Branch main con el monorepo limpio. |

| D02 | Martes Semana 1 Servicios externos — Doppler, Neon, Upstash |
| :---: | :---- |

| Hora | Actividad | Responsable | Entregable |
| :---- | :---- | :---- | :---- |
| 09:00–10:30 | TASK-003: Crear cuentas y configurar Doppler. 3 proyectos (dev/staging/prod). Variables iniciales. | Tech Lead | doppler run funciona. Variable DATABASE\_URL accesible. |
| 10:30–12:30 | TASK-004: Crear DB Neon dev \+ staging. Habilitar PostGIS. Configurar connection strings en Doppler. | Tech Lead | SELECT PostGIS\_Version() retorna versión en dev. |
| 12:30–13:30 | TASK-005: Crear instancias Upstash Redis dev \+ staging. Variables en Doppler. | Tech Lead | PING retorna PONG. |
| 14:30–16:00 | TASK-006: Crear proyecto Railway. Conectar repo. Variables desde Doppler. | Tech Lead | Railway project existe. Primer deploy (aunque falle — solo setup). |
| 16:00–17:30 | TASK-007 parte 1: Crear cuentas Vercel. Conectar las 3 apps al repo. | Frontend Dev | 3 proyectos Vercel conectados al repo. |
| 17:30–18:00 | PR\#002: documentación de los servicios configurados en docs/infra/services.md | Tech Lead | Documento con credenciales de QUÉ (no los secretos — solo URLs y IDs de proyecto) |

| D03 | Miércoles Semana 1 packages/config \+ packages/shared \+ packages/db inicio |
| :---: | :---- |

| Hora | Actividad | Responsable | Entregable |
| :---- | :---- | :---- | :---- |
| 09:00–11:00 | TASK-008: packages/config. Zod env schema completo. Fail-fast. getFlag(). | Tech Lead | pnpm \--filter @biffco/config build sin errores. |
| 11:00–12:30 | TASK-009: packages/shared. Branded types. Result\<T,E\>. canonicalJson. Zod schemas base. | Tech Lead | pnpm \--filter @biffco/shared build sin errores. |
| 13:30–17:30 | TASK-010 parte 1: Drizzle schema — tablas de Workspace layer (workspaces, workspace\_members, teams, employees). | Tech Lead | Tablas creadas en schema.ts con tipado completo. |
| 17:30–18:00 | PR\#003: packages/config \+ packages/shared \+ schema inicio. | Tech Lead | Review y merge. |

| D04 | Jueves Semana 1 packages/db completo \+ Docker Compose |
| :---: | :---- |

| Hora | Actividad | Responsable | Entregable |
| :---- | :---- | :---- | :---- |
| 09:00–13:00 | TASK-010 parte 2: Drizzle schema — tablas de Asset layer (assets, asset\_groups, domain\_events, holds, parcels, transfer\_offers, anchors\_log, asset\_certifications, vehicles, analytics\_snapshots). Índices y triggers. | Tech Lead | Schema completo. pnpm db:generate corre sin errores. |
| 13:00–14:00 | TASK-010 parte 3: Migrations. Primera migración ejecutada en dev y staging. | Tech Lead | pnpm db:migrate retorna 0 pending en segunda ejecución. |
| 14:30–16:30 | TASK-011: docker-compose.yml. Servicios: postgis \+ redis. Healthchecks. | Tech Lead | docker compose up \-d → todos los servicios healthy. |
| 16:30–17:30 | Paralelizar: Frontend comienza TASK-014 (apps/web skeleton básico). | Frontend Dev | apps/web con Next.js 15 instalado y compilando. |
| 17:30–18:00 | PR\#004: schema completo \+ Docker Compose. | Tech Lead | Review y merge. |

| D05 | Viernes Semana 1 setup.sh \+ CI/CD \+ apps skeleton inicio |
| :---: | :---- |

| Hora | Actividad | Responsable | Entregable |
| :---- | :---- | :---- | :---- |
| 09:00–11:30 | TASK-012: scripts/setup.sh. Script idempotente que configura todo desde cero. | Tech Lead | Time ./scripts/setup.sh \< 10 min en máquina del tech lead. |
| 11:30–13:00 | TASK-013 parte 1: GitHub Actions — workflow de CI (lint \+ typecheck \+ test \+ build). | Tech Lead | Workflow corre en el PR de prueba. |
| 13:00–14:00 | TASK-013 parte 2: Test del invariante ESLint en CI. | Tech Lead | PR con import prohibido → CI falla con mensaje claro. |
| 14:30–17:00 | TASK-014, TASK-015, TASK-016: Frontend completa skeletons de las 3 apps. | Frontend Dev | 3 apps compilando con layout base. |
| 17:00–17:30 | TASK-007 parte 2: Deploy de las 3 apps en Vercel. | Frontend Dev | biffco.co, app.biffco.co, verify.biffco.co accesibles. |
| 17:30–18:30 | Retroactivo Semana 1\. Verificar qué está listo y qué no. | Ambos | Lista de pendientes para Semana 2\. |

| D06 | Lunes Semana 2 setup.sh en máquina limpia \+ CI hardening |
| :---: | :---- |

| Hora | Actividad | Responsable | Entregable |
| :---- | :---- | :---- | :---- |
| 09:00–11:00 | Test de setup.sh en la máquina del Frontend Dev (que no tiene nada configurado). | Frontend Dev | Log de la ejecución. Tiempo registrado. Bugs documentados. |
| 11:00–12:30 | Fix de bugs del setup.sh. Nueva ejecución de verificación. | Tech Lead | setup.sh \< 10 min en la segunda máquina. |
| 13:30–15:00 | TASK-013: hardening del CI. gitleaks para detectar secretos. npm audit. | Tech Lead | gitleaks detecta un secreto de prueba. npm audit 0 high. |
| 15:00–17:00 | Completar cualquier TASK pendiente de la Semana 1\. | Ambos | Todas las TASKs de D01–D05 cerradas. |

| D07 | Martes Semana 2 Tokens CSS \+ globals.css \+ Tailwind config |
| :---: | :---- |

| Hora | Actividad | Responsable | Entregable |
| :---- | :---- | :---- | :---- |
| 09:00–12:00 | Design tokens en globals.css: todos los \--color-\*, \--radius-\*, \--font-\*. Dark mode base. | Frontend Dev | globals.css con el sistema de tokens completo. |
| 12:00–13:00 | Tailwind 4 config. Verificar que los tokens CSS son utilizables desde Tailwind. | Frontend Dev | Un componente de prueba usa los tokens vía Tailwind. |
| 13:30–15:30 | Tipografías: Nohemi \+ Inter \+ JetBrains Mono via next/font. | Frontend Dev | Las 3 tipografías cargan correctamente en las 3 apps. |
| 15:30–17:30 | apps/web: secciones de landing multi-vertical (skeleton con copy real). | Frontend Dev | / con hero, /features, /verticals visible. |
| 17:30–18:00 | PR\#006: design system base. | Frontend Dev | Review y merge. |

| D08 | Miércoles Semana 2 Verificación cruzada \+ documentation |
| :---: | :---- |

| Hora | Actividad | Responsable | Entregable |
| :---- | :---- | :---- | :---- |
| 09:00–11:00 | Tech Lead hace setup desde cero en una tercera máquina (o VM limpia). | Tech Lead | Confirmación de que setup.sh funciona para cualquiera. |
| 11:00–12:30 | TASK-017: ADR-001. Documento de decisión arquitectónica. | Tech Lead | docs/ADRs/ADR-001 commiteado. |
| 13:30–15:00 | Documentar todos los servicios externos en docs/infra/: URLs, IDs de proyecto, dashboards. | Ambos | Documento de referencia de infraestructura. |
| 15:00–17:00 | Revisar el schema DB en equipo. ¿Falta alguna tabla? ¿Algún índice? | Ambos | Lista de ajustes y nueva migración si es necesario. |

| D09 | Jueves Semana 2 Phase Gate prep \+ cleanup |
| :---: | :---- |

| Hora | Actividad | Responsable | Entregable |
| :---- | :---- | :---- | :---- |
| 09:00–12:00 | Ejecutar el checklist del Phase Gate 0 completo. Documentar cada ítem. | Ambos | Checklist con estado: ✅/❌ por cada criterio. |
| 12:00–13:00 | Fix de cualquier ítem ❌ del checklist. | Tech Lead | Todos los ítems críticos en ✅. |
| 13:30–15:00 | Code cleanup: remover TODOs de setup, comentarios de debug, archivos temporales. | Ambos | Repo limpio. No hay console.log sueltos. |
| 15:00–17:00 | Actualizar README.md del repo raíz con instrucciones completas de setup. | Tech Lead | README.md completo y verificado. |
| 17:00–18:00 | Preparar sprint review para el día siguiente. | Ambos | Slides o demo lista. |

| D10 | Viernes Semana 2 Sprint Review \+ Retrospectiva \+ Kickoff Fase A |
| :---: | :---- |

| Hora | Actividad | Responsable | Entregable |
| :---- | :---- | :---- | :---- |
| 09:00–10:00 | Sprint Review: demo de setup.sh en vivo \+ mostrar las 3 apps en Vercel. | Ambos | Aprobación del Phase Gate 0\. |
| 10:00–11:00 | Retrospectiva: ¿qué salió bien? ¿qué mejorar para la Fase A? | Ambos | Lista de mejoras para la Fase A. |
| 11:00–12:30 | Documentar Deferred Items del Phase Gate 0 en docs/deferred-items.md. | Tech Lead | Todos los DEF-XXX documentados. |
| 13:30–15:00 | Kickoff Fase A: lectura del playbook de la Fase A. Asignación de issues. | Ambos | Fase A lista para arrancar el lunes siguiente. |
| 15:00–18:00 | Buffer: cualquier pendiente de la Fase 0\. | Ambos | Fase 0 cerrada formalmente. |

# **04\. Antes de arrancar — cuentas, accesos y prerequisitos**

Antes del Día 1, estas cosas tienen que estar listas. Si no están, el Día 1 se retrasa. El Tech Lead es responsable de verificarlas el viernes anterior al inicio del sprint.

## **Cuentas de servicios externos (crear antes del Día 1\)**

| Servicio | URL | Plan inicial | Quién crea la cuenta | Nota |
| :---- | :---- | :---- | :---- | :---- |
| GitHub | github.com | Free/Team | Tech Lead | Crear organización biffco-co. Repo privado biffco. |
| Doppler | doppler.com | Team (free hasta 5 users) | Tech Lead | El plan gratuito es suficiente para la Fase 0\. |
| Neon | neon.tech | Free | Tech Lead | El plan gratuito tiene 512MB — suficiente para dev/staging en Fase 0\. |
| Upstash | upstash.com | Free | Tech Lead | El plan gratuito tiene 10.000 comandos/día — suficiente para dev. |
| Railway | railway.app | Hobby (5$/mes) | Tech Lead | Necesita tarjeta de crédito para el plan Hobby. |
| Vercel | vercel.com | Hobby (free) | Tech Lead o Frontend Dev | Un proyecto Hobby puede alojar las 3 apps en esta fase. |
| Docker Desktop | docker.com/products/docker-desktop | Free | Todos los developers | Instalado en la máquina local de cada developer. |

## **Software requerido en la máquina de cada developer**

| Herramienta | Versión mínima | Cómo verificar | Cómo instalar si no está |
| :---- | :---- | :---- | :---- |
| Node.js | 22 LTS | node \--version → v22.x.x | nvm install 22 (usar nvm) |
| pnpm | 9.x | pnpm \--version → 9.x.x | npm install \-g pnpm@9 |
| Git | 2.40+ | git \--version | brew install git / apt install git |
| Docker Desktop | 4.x | docker \--version | docker.com/products/docker-desktop |
| Doppler CLI | 3.x | doppler \--version | brew install dopplerhq/cli/doppler |
| VS Code (recomendado) | Cualquiera | — | code.visualstudio.com |
| VS Code Extension: ESLint | Última | Buscar "ESLint" en extensions | dbaeumer.vscode-eslint |
| VS Code Extension: Prettier | Última | Buscar "Prettier" en extensions | esbenp.prettier-vscode |

## 

## 

## **Variables de entorno — lista completa que Doppler va a gestionar**

Estas son TODAS las variables que el sistema necesita. En la Fase 0 solo se configuran las que corresponden a los servicios que se usan en esta fase. Las variables de fases futuras se agregan en sus respectivos sprints.

| Variable | Para qué sirve | Fase en que se necesita | Entornos |
| :---- | :---- | :---- | :---- |
| DATABASE\_URL | Connection string de Neon PostgreSQL. | Fase 0 | dev, staging, prod |
| DATABASE\_URL\_UNPOOLED | Connection string directo (sin pooler) para migrations. | Fase 0 | dev, staging, prod |
| REDIS\_URL | Connection string de Upstash Redis. | Fase 0 (para tests) | dev, staging, prod |
| UPSTASH\_REDIS\_URL | URL del endpoint REST de Upstash. | Fase A.3 | dev, staging, prod |
| UPSTASH\_REDIS\_TOKEN | Token de autenticación REST de Upstash. | Fase A.3 | dev, staging, prod |
| NODE\_ENV | development / staging / production | Fase 0 | todos |
| APP\_URL | URL base de apps/api. Ej: http://localhost:3001 en dev. | Fase 0 | todos |
| WEB\_URL | URL de biffco.co. | Fase 0 | todos |
| PLATFORM\_URL | URL de app.biffco.co. | Fase 0 | todos |
| VERIFY\_URL | URL de verify.biffco.co. | Fase 0 | todos |
| JWT\_SECRET | Secreto para firmar JWT. Min 64 caracteres aleatorios. | Fase A.2 | dev, staging, prod |
| JWT\_REFRESH\_SECRET | Secreto para refresh tokens. Min 64 caracteres. | Fase A.2 | dev, staging, prod |
| RESEND\_API\_KEY | API key de Resend para emails. | Fase B.1 | dev, staging, prod |
| AWS\_S3\_BUCKET | Nombre del bucket S3 para evidencias. | Fase B.3 | dev, staging, prod |
| AWS\_ACCESS\_KEY\_ID | AWS access key para S3. | Fase B.3 | dev, staging, prod |
| AWS\_SECRET\_ACCESS\_KEY | AWS secret key para S3. | Fase B.3 | dev, staging, prod |
| POLYGON\_RPC\_URL | RPC endpoint de Polygon Amoy. | Fase A.3 | dev, staging, prod |
| POLYGON\_PRIVATE\_KEY | Clave privada de la wallet de BIFFCO en Polygon. | Fase A.3 | staging, prod |
| SENTRY\_DSN | DSN de Sentry para error tracking. | Fase A.3 | staging, prod |
| STRIPE\_SECRET\_KEY | API key de Stripe para billing. | Fase E.1 | prod |
| DOPPLER\_TOKEN | Token para que GitHub Actions acceda a Doppler. | Fase 0 (CI) | solo CI |

|  | ⚠ ATENCIÓN  Las variables JWT\_SECRET y JWT\_REFRESH\_SECRET NUNCA se generan con una contraseña fácil de recordar. Usar: openssl rand \-hex 64\. Las variables de prod son distintas a las de dev — Doppler gestiona los tres entornos por separado. |
| :---- | :---- |

| TASK 001  Crear el repositorio y la estructura del monorepo   ·  Owner: Tech Lead  ·  Est: 4h  ·  Deps: — |
| :---- |

El monorepo es la base de todo. Una sola decisión aquí impacta en el developer experience durante los próximos 12 meses. pnpm workspaces maneja las dependencias internas. TurboRepo maneja el build en paralelo y el cache.

## **Por qué pnpm \+ TurboRepo**

* pnpm workspaces: dependencias compartidas deduplicadas. Una sola node\_modules en la raíz con symlinks. Más rápido que npm workspaces y yarn workspaces.

* TurboRepo: ejecuta lint, typecheck, test y build de todos los packages en paralelo, cacheando los resultados. Si no cambió nada en packages/config, no lo rebuildea.

* Una sola versión de TypeScript y de las librerías críticas en todo el monorepo — no hay "en el backend uso la versión 5 pero en el frontend tengo la versión 4.9".

## **Estructura canónica del repositorio**

| `tree` | `biffco/` `├── .github/` `│   └── workflows/` `│       |-- ci.yml            ← lint + typecheck + test + build en cada PR` `│       +-- release.yml       ← deploy a staging/prod (se configura en Fase B)` `├── apps/` `│   ├── api/                  ← Fastify 5 + tRPC v11 (esqueleto en Fase 0)` `│   ├── platform/             ← app.biffco.co — Next.js 15 (esqueleto en Fase 0)` `│   ├── verify/               ← verify.biffco.co — Next.js 15 Edge (esqueleto en Fase 0)` `│   └── web/                  ← biffco.co — Next.js 15 estático (esqueleto en Fase 0)` `├── docs/` `│   ├── ADRs/                 ← Architecture Decision Records` `│   ├── infra/                ← documentación de servicios externos` `│   ├── vertical-specs/       ← especificaciones de cada vertical (se llena en Fase C)` `│   └── deferred-items.md     ← DEF-XXX: lo que se difirió y cuándo se resuelve` `├── infra/` `│   └── docker-compose.yml    ← PostgreSQL + Redis para desarrollo local` `├── packages/` `│   ├── config/               ← Zod env schema + feature flags` `│   ├── core/                 ← El Core (se desarrolla en Fase A)` `│   ├── db/                   ← Drizzle schema + migrations` `│   ├── email/                ← react-email templates (se desarrolla en Fase B)` `│   ├── pdf/                  ← @react-pdf/renderer (se desarrolla en Fase B)` `│   ├── shared/               ← branded types, utils, Zod schemas compartidos` `│   ├── ui/                   ← design system (se desarrolla en Fase B)` `│   └── verticals/            ← VerticalPacks (se desarrolla en Fase C)` `│       |-- livestock/        ← (vacío hasta Fase C)` `│       +-- mining/           ← (vacío hasta Fase F)` `├── scripts/` `│   ├── setup.sh              ← setup desde cero en < 10 minutos` `│   └── seed.ts               ← datos de desarrollo reproducibles (Fase A)` `├── .doppler.yaml             ← configuración de Doppler CLI` `├── .eslintrc.cjs             ← ESLint v9 flat config` `├── .gitignore` `├── .npmrc                    ← pnpm config` `├── .prettierrc` `├── package.json              ← raíz del monorepo` `├── pnpm-workspace.yaml` `├── README.md                 ← instrucciones de setup para nuevos developers` `└── turbo.json                ← TurboRepo pipeline config` |
| :---: | :---- |

## **Paso 1: Crear el repositorio**

| `bash` | `# En GitHub (interfaz web)` `# 1. Crear organización: biffco-co` `# 2. Crear repositorio: biffco (privado)` `# 3. Clonar en local` `$ git clone git@github.com:biffco-co/biffco.git` `$ cd biffco` |
| :---: | :---- |

## **Paso 2: pnpm-workspace.yaml y package.json raíz**

| `yaml` | `# pnpm-workspace.yaml` `packages:`   `- "apps/*"`   `- "packages/*"`   `- "packages/verticals/*"` |
| :---: | :---- |

| `json` | `// package.json (raíz)` `{`   `"name": "biffco",`   `"private": true,`   `"scripts": {`     `"build": "turbo run build",`     `"dev": "turbo run dev",`     `"lint": "turbo run lint",`     `"typecheck": "turbo run typecheck",`     `"test": "turbo run test",`     `"db:generate": "pnpm --filter @biffco/db db:generate",`     `"db:migrate": "pnpm --filter @biffco/db db:migrate",`     `"db:studio": "pnpm --filter @biffco/db db:studio"`   `},`   `"devDependencies": {`     `"turbo": "^2.x",`     `"typescript": "^5.x",`     `"prettier": "^3.x",`     `"@types/node": "^22.x"`   `},`   `"engines": {`     `"node": ">=22.0.0",`     `"pnpm": ">=9.0.0"`   `}` `}` |
| :---: | :---- |

## **Paso 3: turbo.json**

| `json` | `// turbo.json` `{`   `"$schema": "https://turbo.build/schema.json",`   `"globalDependencies": [".env"],`   `"tasks": {`     `"build": {`       `"dependsOn": ["^build"],`       `"outputs": ["dist/**", ".next/**", "!.next/cache/**"]`     `},`     `"dev": {`       `"cache": false,`       `"persistent": true`     `},`     `"lint": {`       `"dependsOn": ["^build"]`     `},`     `"typecheck": {`       `"dependsOn": ["^build"]`     `},`     `"test": {`       `"dependsOn": ["^build"],`       `"outputs": ["coverage/**"]`     `},`     `"db:generate": {`       `"cache": false`     `},`     `"db:migrate": {`       `"cache": false`     `}`   `}` `}` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: pnpm install en la raíz instala todas las dependencias sin errores. pnpm build en un package vacío retorna success. |
| :---- | :---- |

| TASK 002  Configuración de TypeScript, ESLint y Prettier   ·  Owner: Tech Lead  ·  Est: 3h  ·  Deps: TASK-001 |
| :---- |

## **tsconfig.base.json — configuración TypeScript estricta**

Este archivo es heredado por todos los packages y apps. Nadie cambia estas opciones sin una discusión en equipo y un ADR.

| `json` | `// tsconfig.base.json (en la raíz del monorepo)` `{`   `"compilerOptions": {`     `"target": "ES2022",`     `"lib": ["ES2022"],`     `"module": "NodeNext",`     `"moduleResolution": "NodeNext",`     `"strict": true,`     `"noUncheckedIndexedAccess": true,`     `"exactOptionalPropertyTypes": true,`     `"noImplicitReturns": true,`     `"noFallthroughCasesInSwitch": true,`     `"noUnusedLocals": true,`     `"noUnusedParameters": true,`     `"forceConsistentCasingInFileNames": true,`     `"skipLibCheck": true,`     `"declaration": true,`     `"declarationMap": true,`     `"sourceMap": true`   `}` `}` |
| :---: | :---- |

Cada package tiene su propio tsconfig.json que extiende este:

| `json` | `// packages/[nombre]/tsconfig.json` `{`   `"extends": "../../tsconfig.base.json",`   `"compilerOptions": {`     `"outDir": "./dist",`     `"rootDir": "./src"`   `},`   `"include": ["src/**/*"],`   `"exclude": ["node_modules", "dist"]` `}` |
| :---: | :---- |

## **ESLint v9 — flat config \+ la regla que protege el Core**

La regla no-restricted-imports es el invariante técnico más importante del proyecto. Si el Core importa un VerticalPack, toda la arquitectura multi-vertical se rompe. ESLint lo detecta en cada PR. No hay excepciones.

| `js` | `// eslint.config.mjs (raíz del monorepo — flat config ESLint v9)` `import js from '@eslint/js'` `import tsPlugin from '@typescript-eslint/eslint-plugin'` `import tsParser from '@typescript-eslint/parser'` `import importPlugin from 'eslint-plugin-import'` `export default [`   `js.configs.recommended,`   `{`     `files: ["**/*.ts", "**/*.tsx"],`     `languageOptions: {`       `parser: tsParser,`       `parserOptions: { project: './tsconfig.json' }`     `},`     `plugins: {`       `'@typescript-eslint': tsPlugin,`       `'import': importPlugin`     `},`     `rules: {`       `// ─── LA REGLA MÁS IMPORTANTE DEL PROYECTO ────────────────`       `// packages/core NUNCA puede importar packages/verticals/*`       `// Viola esta regla = PR rechazado = fin de la conversación.`       `'no-restricted-imports': ['error', {`         `patterns: [`           `{`             `group: ['**/verticals/**', '@biffco/verticals/**'],`             `message: 'El Core no puede importar Vertical Packs. Ver ADR-001.'`           `}`         `]`       `}],`       `// ─── TypeScript estricto ──────────────────────────────────`       `'@typescript-eslint/no-explicit-any': 'error',`       `'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],`       `'@typescript-eslint/consistent-type-imports': 'error',`       `'@typescript-eslint/no-floating-promises': 'error',`       `'@typescript-eslint/no-misused-promises': 'error',`       `// ─── Imports ──────────────────────────────────────────────`       `'import/no-cycle': 'error',`       `'import/no-self-import': 'error'`     `}`   `},`   `// La regla de no-restricted-imports se aplica específicamente a packages/core`   `{`     `files: ["packages/core/**/*.ts"],`     `rules: {`       `'no-restricted-imports': ['error', {`         `patterns: [`           `{`             `group: ['**/verticals/**', '@biffco/verticals/**', '@biffco/livestock', '@biffco/mining'],`             `message: 'INVARIANTE ARQUITECTÓNICO: packages/core no puede importar ningún VerticalPack. Ver ADR-001.'`           `}`         `]`       `}]`     `}`   `}` `]` |
| :---: | :---- |

Dependencias de desarrollo a instalar:

| `bash` | `$ pnpm add -D -w eslint@^9 @eslint/js@^9 typescript-eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-import` |
| :---: | :---- |

## **.prettierrc**

| `json` | `// .prettierrc` `{`   `"semi": false,`   `"singleQuote": true,`   `"tabWidth": 2,`   `"trailingComma": "es5",`   `"printWidth": 100,`   `"plugins": ["prettier-plugin-tailwindcss"]` `}` |
| :---: | :---- |

| `bash` | `$ pnpm add -D -w prettier prettier-plugin-tailwindcss` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: crear un archivo packages/core/src/test-violation.ts que haga import from "@biffco/livestock". Ejecutar pnpm lint → debe retornar error con el mensaje "INVARIANTE ARQUITECTÓNICO". Borrar el archivo después de verificar. |
| :---- | :---- |

| TASK 003  Configurar Doppler — gestión de secretos   ·  Owner: Tech Lead  ·  Est: 2h  ·  Deps: TASK-001 |
| :---- |

Doppler centraliza todos los secretos. Ningún desarrollador necesita un archivo .env local — Doppler inyecta las variables cuando ejecuta un comando con doppler run. Esto garantiza que dev, staging y prod tienen siempre las variables correctas sin posibilidad de confusión.

## **Paso 1: Crear los proyectos en Doppler**

* Ingresar a doppler.com con la cuenta del equipo.

* Crear proyecto: biffco. Dentro del proyecto, crear 3 configs: dev, staging, prod.

* Las configs de Doppler mapean exactamente a los 3 entornos de BIFFCO.

## **Paso 2: Configurar el .doppler.yaml en el repo**

| `yaml` | `# .doppler.yaml (en la raíz del repo)` `setup:`   `project: biffco`   `config: dev` |
| :---: | :---- |

## **Paso 3: Variables a cargar en Doppler — Fase 0**

En la Fase 0 solo se cargan las variables que se necesitan ahora. Las demás se agregan en sus respectivas fases.

| Variable | dev | staging | prod |
| :---- | :---- | :---- | :---- |
| NODE\_ENV | development | staging | production |
| DATABASE\_URL | postgresql://user:pass@\[neon-dev-host\]/biffco?sslmode=require | postgresql://...staging... | postgresql://...prod... |
| DATABASE\_URL\_UNPOOLED | postgresql://user:pass@\[neon-dev-host\]/biffco?sslmode=require\&pgbouncer=false | ...staging... | ...prod... |
| REDIS\_URL | redis://localhost:6379 (Docker local) | rediss://...upstash-staging... | rediss://...upstash-prod... |
| APP\_URL | http://localhost:3001 | https://api-staging.biffco.co | https://api.biffco.co |
| WEB\_URL | http://localhost:3000 | https://staging.biffco.co | https://biffco.co |
| PLATFORM\_URL | http://localhost:3002 | https://app-staging.biffco.co | https://app.biffco.co |
| VERIFY\_URL | http://localhost:3003 | https://verify-staging.biffco.co | https://verify.biffco.co |

## **Paso 4: Configurar GitHub Actions para Doppler**

El CI necesita acceso a las variables de staging. Se usa un Service Token de Doppler que solo tiene permisos de lectura.

| `bash` | `# En Doppler: crear Service Token para la config "staging"` `# Nombre: github-actions-staging` `# Permisos: read-only` `# En GitHub: Settings → Secrets → Actions → New repository secret` `# Nombre: DOPPLER_TOKEN` `# Valor: [el Service Token generado en Doppler]` |
| :---: | :---- |

## **Paso 5: Usar Doppler en el proyecto**

| `bash` | `# Configurar Doppler en la máquina local (una sola vez)` `$ doppler login` `$ doppler setup   # seleccionar proyecto biffco, config dev` `# Ejecutar cualquier comando con las variables de entorno inyectadas` `$ doppler run -- node -e "console.log(process.env.DATABASE_URL)"` `# Output: postgresql://...neon-dev...` `# O configurar el script de dev para usar Doppler automáticamente` `# En package.json de apps/api:` `# "dev": "doppler run -- tsx watch src/index.ts"` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: doppler run \-- node \-e "console.log(process.env.DATABASE\_URL)" imprime la URL de Neon dev. Si imprime "undefined", el setup de Doppler no está completo. |
| :---- | :---- |

| TASK 004  Configurar Neon — PostgreSQL 16 \+ PostGIS   ·  Owner: Tech Lead  ·  Est: 2h  ·  Deps: TASK-003 |
| :---- |

Neon es PostgreSQL 16 serverless managed. Se comporta exactamente como un PostgreSQL normal — el connection string estándar funciona con Drizzle sin ninguna configuración especial. La ventaja es que tiene branching (una rama de DB por entorno) y point-in-time recovery incluido.

## **Paso 1: Crear el proyecto en Neon**

* Ingresar a neon.tech y crear una nueva organización: biffco.

* Crear proyecto: biffco. Región: seleccionar la más cercana al servidor de Railway (preferentemente us-east-1 o eu-central-1 según donde esté el equipo principal).

* Neon crea automáticamente una branch "main" — esta será la branch de producción.

## **Paso 2: Crear branches para dev y staging**

| `bash` | `# En la interfaz de Neon:` `# Branches → Create branch` `# Nombre: dev    → para el entorno de desarrollo local y CI` `# Nombre: staging → para el entorno de staging` `# Obtener los connection strings de cada branch:` `# Branch dev → Connection Details → kopiar "Connection string" Y "Direct connection"` `# Branch staging → idem` `# Branch main (prod) → idem` `# El "Connection string" usa el pooler de Neon (PgBouncer) — para el app` `# El "Direct connection" bypasea el pooler — para las migrations de Drizzle` |
| :---: | :---- |

## **Paso 3: Habilitar PostGIS**

PostGIS es requerido para almacenar los polígonos EUDR (columnas GEOMETRY en facilities, zones y parcels). Se habilita ejecutando un comando SQL — solo hay que hacerlo una vez por branch.

| `sql` | `-- Ejecutar en cada branch (dev, staging, prod) usando el SQL Editor de Neon` `-- O via psql con la Direct connection` `CREATE EXTENSION IF NOT EXISTS postgis;` `CREATE EXTENSION IF NOT EXISTS postgis_topology;` `-- Verificar` `SELECT PostGIS_Version();` `-- Expected output: "3.4.x USE_GEOS=1 USE_PROJ=1 ..."` |
| :---: | :---- |

## **Paso 4: Cargar los connection strings en Doppler**

| `bash` | `# Para la config "dev" en Doppler:` `# DATABASE_URL = [Connection string de la branch dev de Neon]` `# DATABASE_URL_UNPOOLED = [Direct connection de la branch dev]` `# Para la config "staging" en Doppler:` `# DATABASE_URL = [Connection string de la branch staging de Neon]` `# DATABASE_URL_UNPOOLED = [Direct connection de la branch staging]` `# Para la config "prod" en Doppler (configurar antes del Go-Live en Fase D):` `# DATABASE_URL = [Connection string de la branch main de Neon]` `# DATABASE_URL_UNPOOLED = [Direct connection de la branch main]` |
| :---: | :---- |

|  | ⚠ ATENCIÓN  DATABASE\_URL usa el pooler de Neon (más eficiente para el app). DATABASE\_URL\_UNPOOLED usa la conexión directa. Las migrations de Drizzle DEBEN usar DATABASE\_URL\_UNPOOLED porque el pooler de Neon no soporta algunas operaciones DDL. |
| :---- | :---- |

|  | ✅ VERIFICACIÓN  Verificación: doppler run \-- psql $DATABASE\_URL \-c "SELECT PostGIS\_Version();" retorna la versión de PostGIS. Si falla con "extension does not exist", CREATE EXTENSION IF NOT EXISTS postgis no se ejecutó en esa branch. |
| :---- | :---- |

| TASK 005  Configurar Upstash — Redis serverless   ·  Owner: Tech Lead  ·  Est: 1h  ·  Deps: TASK-003 |
| :---- |

* Ingresar a upstash.com y crear dos bases de datos Redis: biffco-dev y biffco-staging.

* Región: la misma que Neon para minimizar latencia.

* TLS habilitado: sí. En Upstash el URL ya incluye el protocolo rediss:// (con TLS).

* Copiar los "REST URL" y "REST Token" de cada DB. Guardarlos en Doppler como UPSTASH\_REDIS\_URL y UPSTASH\_REDIS\_TOKEN en los entornos correspondientes.

* En dev local, el Redis es el contenedor Docker (redis://localhost:6379), no Upstash. Esto permite trabajar completamente offline.

|  | ✅ VERIFICACIÓN  Verificación: usando la interfaz de Upstash → CLI → PING → debe retornar PONG. |
| :---- | :---- |

| TASK 006  Configurar Railway — deploy de apps/api   ·  Owner: Tech Lead  ·  Est: 1.5h  ·  Deps: TASK-003 |
| :---- |

* Crear cuenta en railway.app y nuevo proyecto: biffco-api.

* Conectar el repositorio de GitHub. Railway detecta automáticamente el Dockerfile o el buildpack.

* Para apps/api en Fase 0: el servicio existe pero el build va a fallar (el código no está listo). Eso está bien — lo que importa es que el proyecto exista y las variables estén configuradas.

* Configurar variables: en Railway → Settings → Variables → conectar con Doppler (Railway tiene integración nativa con Doppler) o cargar manualmente las variables de staging.

* Configurar el comando de build y start: pnpm \--filter @biffco/api build y pnpm \--filter @biffco/api start.

* Puerto: 3001 (que Railway mapea a su URL pública).

|  | ✅ VERIFICACIÓN  Verificación: el proyecto Railway existe y tiene las variables configuradas. El primer deploy puede fallar — eso se resuelve en la Fase A cuando se implementa apps/api. |
| :---- | :---- |

| TASK 007  Configurar Vercel — deploy de las 3 apps   ·  Owner: Tech Lead/Frontend Dev  ·  Est: 1.5h  ·  Deps: TASK-001 |
| :---- |

* Crear cuenta en vercel.com.

* Importar el repositorio de GitHub. Crear 3 proyectos distintos, uno por app:

*   Proyecto 1: biffco-web → Root Directory: apps/web → Domain: biffco.co

*   Proyecto 2: biffco-platform → Root Directory: apps/platform → Domain: app.biffco.co

*   Proyecto 3: biffco-verify → Root Directory: apps/verify → Domain: verify.biffco.co

* Framework Preset: Next.js (Vercel lo detecta automáticamente).

* Variables de entorno en Vercel: agregar NEXT\_PUBLIC\_API\_URL y las que cada app necesita de Doppler. Vercel también tiene integración nativa con Doppler.

* En la Fase 0 las apps son skeletons vacíos — el deploy puede dar un build de una página en blanco. Eso está bien.

|  | ✅ VERIFICACIÓN  Verificación: las 3 URLs responden con HTTP 200 (aunque sea una página en blanco). Las URLs son accesibles públicamente desde cualquier navegador. |
| :---- | :---- |

| TASK 008  packages/config — Zod env schema \+ feature flags   ·  Owner: Tech Lead  ·  Est: 3h  ·  Deps: TASK-002, TASK-003 |
| :---- |

packages/config es la primera línea de defensa contra errores de configuración. Si falta una variable de entorno, el proceso falla al arrancar con un mensaje claro que dice exactamente qué variable falta. Nunca falla silenciosamente con un undefined.

## **Estructura del package**

| `tree` | `packages/config/` `├── src/` `│   ├── env.ts          ← schema Zod de variables de entorno` `│   ├── flags.ts        ← feature flags` `│   └── index.ts        ← re-exports` `├── package.json` `└── tsconfig.json` |
| :---: | :---- |

## **package.json del package**

| `json` | `{`   `"name": "@biffco/config",`   `"version": "0.1.0",`   `"main": "./dist/index.js",`   `"types": "./dist/index.d.ts",`   `"scripts": {`     `"build": "tsc",`     `"typecheck": "tsc --noEmit",`     `"lint": "eslint src/"`   `},`   `"dependencies": {`     `"zod": "^3.23.x"`   `}` `}` |
| :---: | :---- |

## **src/env.ts — el schema Zod completo**

| `ts` | `// packages/config/src/env.ts` `import { z } from 'zod'` `// ─── Schema de variables requeridas (siempre) ────────────────────────` `const baseSchema = z.object({`   `NODE_ENV: z.enum(['development', 'staging', 'production']),`   `// ─── Database (Neon)`   `DATABASE_URL: z.string().url().startsWith("postgresql://"),`   `DATABASE_URL_UNPOOLED: z.string().url().startsWith("postgresql://"),`   `// ─── URLs internas`   `APP_URL: z.string().url(),`   `WEB_URL: z.string().url(),`   `PLATFORM_URL: z.string().url(),`   `VERIFY_URL: z.string().url(),` `})` `// ─── Schema de variables opcionales (se agregan por fase) ───────────` `const optionalSchema = z.object({`   `// Fase A.2 — Auth`   `JWT_SECRET: z.string().min(64).optional(),`   `JWT_REFRESH_SECRET: z.string().min(64).optional(),`   `// Fase A.3 — Redis (Upstash en staging/prod, Docker local en dev)`   `REDIS_URL: z.string().optional(),`   `UPSTASH_REDIS_URL: z.string().url().optional(),`   `UPSTASH_REDIS_TOKEN: z.string().optional(),`   `// Fase A.3 — Blockchain`   `POLYGON_RPC_URL: z.string().url().optional(),`   `POLYGON_PRIVATE_KEY: z.string().optional(),`   `// Fase B.1 — Email`   `RESEND_API_KEY: z.string().optional(),`   `// Fase B.3 — Storage`   `AWS_S3_BUCKET: z.string().optional(),`   `AWS_ACCESS_KEY_ID: z.string().optional(),`   `AWS_SECRET_ACCESS_KEY: z.string().optional(),`   `AWS_REGION: z.string().optional(),`   `// Fase A.3 — Observabilidad`   `SENTRY_DSN: z.string().url().optional(),` `})` `const envSchema = baseSchema.merge(optionalSchema)` `// ─── Parsear y exportar ──────────────────────────────────────────────` `const _parsed = envSchema.safeParse(process.env)` `if (!_parsed.success) {`   `console.error("❌ Variables de entorno inválidas o faltantes:")`   `console.error(_parsed.error.flatten().fieldErrors)`   `console.error("")`   `console.error("Asegurate de que Doppler está configurado:")`   `console.error("  doppler setup")`   `console.error("  doppler run -- [tu comando]")`   `process.exit(1)` `}` `export const env = _parsed.data` `export type Env = typeof env` |
| :---: | :---- |

## **src/flags.ts — feature flags**

Los feature flags permiten habilitar/deshabilitar funcionalidades sin deployar. En la Fase 0 son simples variables. En fases futuras pueden conectarse a Unleash o LaunchDarkly.

| `ts` | `// packages/config/src/flags.ts` `import { env } from './env'` `export const flags = {`   `// Habilitado solo en dev para mostrar información de debug`   `DEBUG_MODE: env.NODE_ENV === "development",`   `// Blockchain: en dev usar mock, en staging/prod usar Polygon Amoy`   `BLOCKCHAIN_ENABLED: env.NODE_ENV !== "development",`   `// Email: en dev logear en consola, en staging/prod usar Resend`   `EMAIL_PROVIDER: env.NODE_ENV === "development" ? "console" : "resend",` `} as const` `export type FeatureFlag = keyof typeof flags` `export const getFlag = <K extends FeatureFlag>(key: K): typeof flags[K] => flags[key]` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: remover DATABASE\_URL de Doppler y ejecutar doppler run \-- node \-e "require('@biffco/config')". El proceso debe fallar con el mensaje "Variables de entorno inválidas o faltantes" y mostrar exactamente qué falta. Restaurar la variable. |
| :---- | :---- |

| TASK 009  packages/shared — Branded types, Result\<T,E\>, canonicalJson   ·  Owner: Tech Lead  ·  Est: 3h  ·  Deps: TASK-002 |
| :---- |

packages/shared tiene dos categorías de exports: branded types (que hacen que TypeScript no confunda un AssetId con un WorkspaceId aunque ambos sean strings) y utilities (Result\<T,E\> para manejo de errores sin throw, canonicalJson para firma determinista).

## **¿Qué son los Branded Types y por qué los usamos?**

Sin branded types: function transfer(fromId: string, toId: string) — TypeScript acepta transfer(toId, fromId) sin error. Con branded types: function transfer(fromId: AssetId, toId: AssetId) — TypeScript detecta si se pasa el ID equivocado. Es type safety de datos de negocio.

| `ts` | `// packages/shared/src/types/branded.ts` `// ─── Tipo genérico para crear branded types ──────────────────────` `type Brand<T, B extends string> = T & { readonly _brand: B }` `// ─── Función para crear valores del tipo ─────────────────────────` `// En producción se usa directamente el string, pero el tipo garantiza` `// que no se puede confundir un ID con otro.` `export const brand = <T extends string>(value: string): Brand<string, T> =>`   `value as Brand<string, T>` `// ─── Todos los branded types del dominio ─────────────────────────` `export type WorkspaceId = Brand<string, "WorkspaceId">` `export type WorkspaceMemberId = Brand<string, "WorkspaceMemberId">` `export type TeamId = Brand<string, "TeamId">` `export type EmployeeId = Brand<string, "EmployeeId">` `export type AssetId = Brand<string, "AssetId">` `export type AssetGroupId = Brand<string, "AssetGroupId">` `export type EventId = Brand<string, "EventId">` `export type FacilityId = Brand<string, "FacilityId">` `export type ZoneId = Brand<string, "ZoneId">` `export type PenId = Brand<string, "PenId">` `export type TransferOfferId = Brand<string, "TransferOfferId">` `export type AnchorId = Brand<string, "AnchorId">` `export type CertificationId = Brand<string, "CertificationId">` `// ─── Constructores tipados ────────────────────────────────────────` `export const WorkspaceId = (v: string) => brand<'WorkspaceId'>(v)` `export const AssetId = (v: string) => brand<'AssetId'>(v)` `export const EventId = (v: string) => brand<'EventId'>(v)` `// ... (uno por cada tipo)` |
| :---: | :---- |

## **Result\<T, E\> — manejo de errores sin throw**

El sistema NUNCA hace throw para errores de negocio (asset no encontrado, permiso denegado, validación fallida). Siempre retorna un Result. Esto hace el flujo de errores explícito y evita que errores de negocio terminen en Sentry como excepciones no capturadas.

| `ts` | `// packages/shared/src/types/result.ts` `export type Ok<T> = { readonly ok: true; readonly value: T }` `export type Err<E> = { readonly ok: false; readonly error: E }` `export type Result<T, E = Error> = Ok<T> | Err<E>` `// ─── Constructores ───────────────────────────────────────────────` `export const ok = <T>(value: T): Ok<T> => ({ ok: true, value })` `export const err = <E>(error: E): Err<E> => ({ ok: false, error })` `// ─── Helpers ─────────────────────────────────────────────────────` `export const isOk = <T, E>(r: Result<T, E>): r is Ok<T> => r.ok === true` `export const isErr = <T, E>(r: Result<T, E>): r is Err<E> => r.ok === false` `// ─── Mapear el value si es Ok ────────────────────────────────────` `export const mapResult = <T, U, E>(`   `result: Result<T, E>,`   `fn: (value: T) => U` `): Result<U, E> =>`   `result.ok ? ok(fn(result.value)) : result` `// ─── Ejemplo de uso ──────────────────────────────────────────────` `// async function getAsset(id: AssetId): Promise<Result<Asset, "NOT_FOUND" | "FORBIDDEN">>` `// const result = await getAsset(id)` `// if (!result.ok) {` `//   if (result.error === "NOT_FOUND") return 404` `//   if (result.error === "FORBIDDEN") return 403` `// }` `// return result.value` |
| :---: | :---- |

## **canonicalJson — JSON determinístico antes de firmar**

Antes de firmar un DomainEvent con Ed25519, hay que convertir el payload a string. Si el orden de las keys varía (como en JSON.stringify normal), la firma cambia aunque el contenido sea el mismo. canonicalJson garantiza siempre el mismo string para el mismo objeto.

| `ts` | `// packages/shared/src/utils/canonical-json.ts` `/**`  `* Serializa un objeto a JSON con las keys en orden alfabético.`  `* Resultado: siempre el mismo string para el mismo objeto,`  `* independientemente del orden en que las keys fueron definidas.`  `*`  `* CRÍTICO: Esta función se usa antes de firmar cualquier DomainEvent.`  `* Cambiarla post-producción invalida todas las firmas existentes.`  `*/` `export function canonicalJson(obj: unknown): string {`   `return JSON.stringify(obj, sortedReplacer)` `}` `function sortedReplacer(_key: string, value: unknown): unknown {`   `if (value !== null && typeof value === "object" && !Array.isArray(value)) {`     `return Object.fromEntries(`       `Object.entries(value as Record<string, unknown>)`         `.sort(([a], [b]) => a.localeCompare(b))`         `.map(([k, v]) => [k, v])`     `)`   `}`   `return value` `}` `// Test de comportamiento esperado:` `// canonicalJson({ b: 2, a: 1 }) === canonicalJson({ a: 1, b: 2 })` `// → true (ambos producen '{"a":1,"b":2}')` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: escribir un test unitario en packages/shared/src/utils/canonical-json.test.ts que verifique que dos objetos con las mismas keys en distinto orden producen el mismo string. pnpm test debe pasar. |
| :---- | :---- |

| TASK 010  packages/db — schema Drizzle completo \+ migrations   ·  Owner: Tech Lead  ·  Est: 6h  ·  Deps: TASK-004, TASK-008, TASK-009 |
| :---- |

Este es el TASK más crítico de la Fase 0\. El schema tiene que ser completo desde el primer día porque una migration destructiva post-producción (DROP COLUMN, RENAME TABLE) es un evento de alto riesgo. Todo lo que sabemos que vamos a necesitar se incluye ahora.

|  | ⚠ ATENCIÓN  El schema que se define aquí es el schema COMPLETO del sistema, incluyendo tablas que se usarán en Fases A, B y C. No solo las tablas de la Fase 0\. La razón: agregar columnas nullable post-producción es barato. Renombrar columnas o tablas es caro. |
| :---- | :---- |

## **Dependencias a instalar**

| `bash` | `$ pnpm --filter @biffco/db add drizzle-orm pg @neondatabase/serverless` `$ pnpm --filter @biffco/db add -D drizzle-kit @types/pg dotenv-cli` |
| :---: | :---- |

## **drizzle.config.ts**

| `ts` | `// packages/db/drizzle.config.ts` `import { defineConfig } from 'drizzle-kit'` `import { env } from '@biffco/config'` `export default defineConfig({`   `schema: './src/schema/index.ts',`   `out: './src/migrations',`   `dialect: 'postgresql',`   `dbCredentials: {`     `url: env.DATABASE_URL_UNPOOLED  // Sin pooler para migrations`   `},`   `verbose: true,`   `strict: true` `})` |
| :---: | :---- |

## **Schema completo — todas las tablas**

El schema está dividido por dominio. Cada archivo exporta sus tablas y Drizzle las combina en el schema global.

| `ts` | `// packages/db/src/schema/workspaces.ts` `import { pgTable, text, timestamp, jsonb, boolean, pgEnum } from 'drizzle-orm/pg-core'` `import { createId } from '@paralleldrive/cuid2'` `export const workspacePlanEnum = pgEnum('workspace_plan', ['free', 'starter', 'pro', 'enterprise'])` `export const workspaces = pgTable("workspaces", {`   `id:          text('id').primaryKey().$defaultFn(() => createId()),`   `name:        text('name').notNull(),`   `slug:        text('slug').notNull().unique(),`   `verticalId:  text('vertical_id').notNull(),  // 'livestock' | 'mining' | ...`   `plan:        workspacePlanEnum('plan').notNull().default('free'),`   `settings:    jsonb('settings').notNull().default('{}'),`   `isActive:    boolean('is_active').notNull().default(true),`   `createdAt:   timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),`   `updatedAt:   timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),` `})` `// ─── WorkspaceMembers ────────────────────────────────────────────` `export const workspaceMembers = pgTable("workspace_members", {`   `id:           text('id').primaryKey().$defaultFn(() => createId()),`   `workspaceId:  text('workspace_id').notNull().references(() => workspaces.id),`   `personId:     text('person_id').notNull(),  // FK a persons (se agrega en Fase A)`   `publicKey:    text('public_key').notNull(),  // Ed25519 public key hex`   `roles:        text('roles').array().notNull().default(['{}']::text[]),`   `status:       text('status').notNull().default('active'),  // active|suspended|revoked`   `invitedAt:    timestamp('invited_at', { withTimezone: true }).notNull().defaultNow(),`   `acceptedAt:   timestamp('accepted_at', { withTimezone: true }),`   `revokedAt:    timestamp('revoked_at', { withTimezone: true }),`   `createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),` `})` `// ─── Teams ───────────────────────────────────────────────────────` `export const teams = pgTable("teams", {`   `id:           text('id').primaryKey().$defaultFn(() => createId()),`   `workspaceId:  text('workspace_id').notNull().references(() => workspaces.id),`   `name:         text('name').notNull(),`   `description:  text('description'),`   `createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),` `})` `// ─── Employees ───────────────────────────────────────────────────` `export const employees = pgTable("employees", {`   `id:           text('id').primaryKey().$defaultFn(() => createId()),`   `workspaceId:  text('workspace_id').notNull().references(() => workspaces.id),`   `name:         text('name').notNull(),`   `role:         text('role').notNull(),  // label descriptivo (peón, capataz, etc.)`   `dni:          text('dni'),`   `supervisorId: text('supervisor_id').references(() => workspaceMembers.id),`   `memberId:     text('member_id').references(() => workspaceMembers.id),  // si tiene cuenta`   `isActive:     boolean('is_active').notNull().default(true),`   `createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),` `})` |
| :---: | :---- |

| `ts` | `// packages/db/src/schema/locations.ts` `// Facility, Zone, Pen — jerarquía de ubicaciones` `import { pgTable, text, timestamp, integer, geometry } from 'drizzle-orm/pg-core'` `import { createId } from '@paralleldrive/cuid2'` `import { workspaces } from './workspaces'` `export const facilities = pgTable("facilities", {`   `id:           text('id').primaryKey().$defaultFn(() => createId()),`   `workspaceId:  text('workspace_id').notNull().references(() => workspaces.id),`   `name:         text('name').notNull(),`   `type:         text('type').notNull(),  // definido por el VerticalPack`   `address:      text('address'),`   `licenseNumber:text('license_number'),  // RENSPA en Livestock, etc.`   `country:      text('country').notNull().default('AR'),`   `// Polígono GeoJSON — PostGIS GEOMETRY`   `polygon:      geometry('polygon', { type: 'polygon', srid: 4326 }),`   `isActive:     boolean('is_active').notNull().default(true),`   `createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),` `})` `export const zones = pgTable("zones", {`   `id:           text('id').primaryKey().$defaultFn(() => createId()),`   `facilityId:   text('facility_id').notNull().references(() => facilities.id),`   `workspaceId:  text('workspace_id').notNull().references(() => workspaces.id),`   `name:         text('name').notNull(),`   `type:         text('type').notNull(),`   `capacity:     integer('capacity'),`   `// EL POLÍGONO EUDR VIVE AQUÍ — nivel Zone (Lote/Parcela)`   `polygon:      geometry('polygon', { type: 'polygon', srid: 4326 }),`   `gfwStatus:    text('gfw_status').default('pending'),  // pending|clear|alert`   `gfwCheckedAt: timestamp('gfw_checked_at', { withTimezone: true }),`   `createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),` `})` `export const pens = pgTable("pens", {`   `id:               text('id').primaryKey().$defaultFn(() => createId()),`   `zoneId:           text('zone_id').notNull().references(() => zones.id),`   `facilityId:       text('facility_id').notNull().references(() => facilities.id),`   `workspaceId:      text('workspace_id').notNull().references(() => workspaces.id),`   `name:             text('name').notNull(),`   `type:             text('type').notNull(),`   `capacity:         integer('capacity'),`   `currentOccupancy: integer('current_occupancy').notNull().default(0),`   `createdAt:        timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),` `})` |
| :---: | :---- |

| `ts` | `// packages/db/src/schema/assets.ts` `import { pgTable, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core'` `import { createId } from '@paralleldrive/cuid2'` `import { workspaces, workspaceMembers } from './workspaces'` `import { pens } from './locations'` `export const assets = pgTable("assets", {`   `id:             text('id').primaryKey().$defaultFn(() => createId()),`   `type:           text('type').notNull(),  // definido por el VerticalPack`   `status:         text('status').notNull().default('active'),`   `workspaceId:    text('workspace_id').notNull().references(() => workspaces.id),`   `verticalId:     text('vertical_id').notNull(),`   `ownerId:        text('owner_id').notNull().references(() => workspaceMembers.id),`   `custodianId:    text('custodian_id').references(() => workspaceMembers.id),`   `// Ubicación actual (metadato contextual)`   `currentPenId:   text('current_pen_id').references(() => pens.id),`   `currentGroupId: text('current_group_id'),  // FK a asset_groups (tabla se define abajo)`   `facilityId:     text('facility_id'),  // desnormalizado para queries eficientes`   `// Linaje — CRÍTICO: índice GIN para queries de ancestros/descendientes < 200ms`   `parentIds:      text('parent_ids').array().notNull().default([]),`   `// ID externo (caravana RFID, número de lote, EID, etc.)`   `externalId:     text('external_id'),`   `// Payload específico del VerticalPack (AnimalAsset: {breed, sex, birthDate, eid})`   `payload:        jsonb('payload').notNull().default('{}'),`   `createdAt:      timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),`   `updatedAt:      timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),`   `closedAt:       timestamp('closed_at', { withTimezone: true }),` `}, (table) => ({`   `// Índice GIN sobre parent_ids[] para lineage queries eficientes`   `parentIdsIdx: index('assets_parent_ids_gin_idx').using('gin').on(table.parentIds),`   `workspaceIdx: index('assets_workspace_idx').on(table.workspaceId),`   `statusIdx:    index('assets_status_idx').on(table.status),`   `externalIdx:  index('assets_external_id_idx').on(table.externalId),` `}))` `// ─── AssetGroups ─────────────────────────────────────────────────` `export const assetGroups = pgTable("asset_groups", {`   `id:           text('id').primaryKey().$defaultFn(() => createId()),`   `workspaceId:  text('workspace_id').notNull().references(() => workspaces.id),`   `name:         text('name').notNull(),`   `type:         text('type').notNull(),  // GROUP | SPLIT_OUTPUT | MERGE_OUTPUT | TRANSFER | EXPORT`   `status:       text('status').notNull().default('active'),  // forming|active|dissolved|in_transit`   `metadata:     jsonb('metadata').notNull().default('{}'),`   `createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),`   `dissolvedAt:  timestamp('dissolved_at', { withTimezone: true }),` `})` |
| :---: | :---- |

| `ts` | `// packages/db/src/schema/events.ts — EL CORAZÓN DEL SISTEMA` `import { pgTable, text, timestamp, jsonb, integer, index, sql } from 'drizzle-orm/pg-core'` `import { createId } from '@paralleldrive/cuid2'` `import { workspaces, workspaceMembers, employees } from './workspaces'` `import { assets } from './assets'` `export const domainEvents = pgTable("domain_events", {`   `id:             text('id').primaryKey().$defaultFn(() => createId()),`   `type:           text('type').notNull(),  // definido por el VerticalPack`   `schemaVersion:  integer('schema_version').notNull().default(1),`   `// Qué asset, en qué Workspace, por qué actor`   `assetId:        text('asset_id').notNull().references(() => assets.id),`   `workspaceId:    text('workspace_id').notNull().references(() => workspaces.id),`   `actorId:        text('actor_id').notNull().references(() => workspaceMembers.id),`   `employeeId:     text('employee_id').references(() => employees.id),`   `// Criptografía — la parte que no cambia nunca`   `signature:      text('signature').notNull(),  // Ed25519 signature hex`   `publicKey:      text('public_key').notNull(),  // Ed25519 public key hex`   `// Timestamps`   `occurredAt:     timestamp('occurred_at', { withTimezone: true }).notNull(),`   `createdAt:      timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),`   `// Batch operations`   `correlationId:  text('correlation_id'),  // Agrupa N eventos de una sola acción batch`   `// Payload del VerticalPack (validado contra el payloadSchema del evento)`   `payload:        jsonb('payload').notNull().default('{}'),` `}, (table) => ({`   `workspaceIdx:    index('events_workspace_idx').on(table.workspaceId),`   `assetIdx:        index('events_asset_idx').on(table.assetId),`   `actorIdx:        index('events_actor_idx').on(table.actorId),`   `occurredAtIdx:   index('events_occurred_at_idx').on(table.occurredAt),`   `correlationIdx:  index('events_correlation_idx').on(table.correlationId),` `}))` `// ─── Holds — estado activo de holds sobre assets ─────────────────` `export const holds = pgTable("holds", {`   `id:           text('id').primaryKey().$defaultFn(() => createId()),`   `assetId:      text('asset_id').notNull().references(() => assets.id),`   `workspaceId:  text('workspace_id').notNull().references(() => workspaces.id),`   `type:         text('type').notNull(),  // SANITARY|REGULATORY|LEGAL|VETERINARY`   `severity:     text('severity').notNull(),  // low|medium|high|critical`   `reason:       text('reason').notNull(),`   `imposedBy:    text('imposed_by').notNull().references(() => workspaceMembers.id),`   `eventId:      text('event_id').notNull().references(() => domainEvents.id),`   `resolvedBy:   text('resolved_by').references(() => workspaceMembers.id),`   `resolvedAt:   timestamp('resolved_at', { withTimezone: true }),`   `resolveEventId: text('resolve_event_id').references(() => domainEvents.id),`   `createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),` `})` |
| :---: | :---- |

| `ts` | `// packages/db/src/schema/transfers.ts` `import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core'` `import { createId } from '@paralleldrive/cuid2'` `import { workspaces, workspaceMembers } from './workspaces'` `export const transferOffers = pgTable("transfer_offers", {`   `id:              text('id').primaryKey().$defaultFn(() => createId()),`   `fromWorkspaceId: text('from_workspace_id').notNull().references(() => workspaces.id),`   `toWorkspaceId:   text('to_workspace_id').notNull().references(() => workspaces.id),`   `assetIds:        text('asset_ids').array().notNull(),`   `groupId:         text('group_id'),`   `status:          text('status').notNull().default('pending'),`   `carrierId:       text('carrier_id').references(() => workspaceMembers.id),`   `metadata:        jsonb('metadata').notNull().default('{}'),  // DTE, B/L, etc.`   `initiatedBy:     text('initiated_by').notNull().references(() => workspaceMembers.id),`   `acceptedBy:      text('accepted_by').references(() => workspaceMembers.id),`   `initiatedEventId: text('initiated_event_id'),`   `acceptedEventId:  text('accepted_event_id'),`   `createdAt:       timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),`   `completedAt:     timestamp('completed_at', { withTimezone: true }),`   `expiresAt:       timestamp('expires_at', { withTimezone: true }),` `})` `// ─── Anchors — anclajes en Polygon ───────────────────────────────` `export const anchorsLog = pgTable("anchors_log", {`   `id:           text('id').primaryKey().$defaultFn(() => createId()),`   `workspaceId:  text('workspace_id').notNull().references(() => workspaces.id),`   `txHash:       text('tx_hash').notNull(),`   `merkleRoot:   text('merkle_root').notNull(),`   `eventIds:     text('event_ids').array().notNull(),`   `network:      text('network').notNull().default('polygon-amoy'),`   `blockNumber:  text('block_number'),`   `status:       text('status').notNull().default('pending'),  // pending|confirmed|failed`   `createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),`   `confirmedAt:  timestamp('confirmed_at', { withTimezone: true }),` `})` `// ─── AssetCertifications — certificaciones externas ──────────────` `export const assetCertifications = pgTable("asset_certifications", {`   `id:                  text('id').primaryKey().$defaultFn(() => createId()),`   `assetId:             text('asset_id').notNull().references(() => assets.id),`   `workspaceId:         text('workspace_id').notNull().references(() => workspaces.id),`   `certificationBody:   text('certification_body').notNull(),`   `certificationId:     text('certification_id').notNull(),`   `certificationDate:   timestamp('certification_date', { withTimezone: true }),`   `documentHash:        text('document_hash'),  // SHA-256 del PDF`   `certificationUrl:    text('certification_url'),`   `certifiedAttributes: jsonb('certified_attributes').notNull().default('{}'),`   `linkedEventId:       text('linked_event_id'),`   `createdAt:           timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),` `})` `// ─── Vehicles — recursos de transporte ───────────────────────────` `export const vehicles = pgTable("vehicles", {`   `id:           text('id').primaryKey().$defaultFn(() => createId()),`   `workspaceId:  text('workspace_id').notNull().references(() => workspaces.id),`   `type:         text('type').notNull(),`   `name:         text('name').notNull(),`   `licensePlate: text('license_plate'),`   `capacity:     integer('capacity'),`   `isActive:     boolean('is_active').notNull().default(true),`   `createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),` `})` `// ─── Notifications ────────────────────────────────────────────────` `export const notifications = pgTable("notifications", {`   `id:           text('id').primaryKey().$defaultFn(() => createId()),`   `workspaceId:  text('workspace_id').notNull().references(() => workspaces.id),`   `memberId:     text('member_id').notNull().references(() => workspaceMembers.id),`   `type:         text('type').notNull(),`   `payload:      jsonb('payload').notNull().default('{}'),`   `isRead:       boolean('is_read').notNull().default(false),`   `createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),` `})` `// ─── Analytics Snapshots ─────────────────────────────────────────` `export const analyticsSnapshots = pgTable("analytics_snapshots", {`   `id:           text('id').primaryKey().$defaultFn(() => createId()),`   `workspaceId:  text('workspace_id').notNull().references(() => workspaces.id),`   `snapshotType: text('snapshot_type').notNull(),  // definido por el VerticalPack`   `period:       text('period').notNull(),  // '2024-10' para mensual, '2024-W42' para semanal`   `data:         jsonb('data').notNull().default('{}'),  // Proyección del VerticalPack`   `generatedAt:  timestamp('generated_at', { withTimezone: true }).notNull().defaultNow(),` `})` |
| :---: | :---- |

## **El trigger anti-tampering — el más importante del sistema**

Este trigger impide que cualquier proceso modifique o elimine eventos del Event Store. Es la garantía técnica de la inmutabilidad. Se crea como parte de la migration inicial — no como una migration posterior.

| `sql` | `-- Agregar a la migration inicial (en el archivo SQL generado por Drizzle)` `-- Función del trigger` `CREATE OR REPLACE FUNCTION prevent_domain_events_mutation()` `RETURNS TRIGGER AS $$` `BEGIN`   `RAISE EXCEPTION`     `'domain_events es inmutable. Operación % rechazada. Ver ADR-001.',`     `TG_OP;`   `RETURN NULL;` `END;` `$$ LANGUAGE plpgsql;` `-- Trigger que llama la función en UPDATE y DELETE` `CREATE TRIGGER domain_events_immutability_guard`   `BEFORE UPDATE OR DELETE ON domain_events`   `FOR EACH ROW`   `EXECUTE FUNCTION prevent_domain_events_mutation();` `-- Para verificar que el trigger funciona:` `-- UPDATE domain_events SET type = 'test' WHERE id = 'any-id';` `-- Expected: ERROR: domain_events es inmutable...` |
| :---: | :---- |

Este trigger se agrega manualmente al archivo de migration que Drizzle genera, antes de ejecutarlo. Drizzle no genera triggers — los escribimos a mano en el archivo SQL de migration.

|  | ✅ VERIFICACIÓN  Verificación: ejecutar pnpm db:migrate. Luego intentar UPDATE domain\_events SET type \= 'test' WHERE false. Debe retornar ERROR con el mensaje del trigger. Nota: WHERE false no afecta ninguna fila pero igual activa el trigger. |
| :---- | :---- |

## **Row Level Security (RLS) — aislamiento multi-tenant**

| `sql` | `-- Habilitar RLS en todas las tablas sensibles` `-- Agregar al archivo de migration inicial` `ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;` `ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;` `ALTER TABLE assets ENABLE ROW LEVEL SECURITY;` `ALTER TABLE domain_events ENABLE ROW LEVEL SECURITY;` `ALTER TABLE holds ENABLE ROW LEVEL SECURITY;` `ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;` `ALTER TABLE zones ENABLE ROW LEVEL SECURITY;` `ALTER TABLE pens ENABLE ROW LEVEL SECURITY;` `ALTER TABLE asset_groups ENABLE ROW LEVEL SECURITY;` `ALTER TABLE transfer_offers ENABLE ROW LEVEL SECURITY;` `-- Policy: solo ver datos del workspace activo` `-- app.current_workspace se setea en cada request del API` `CREATE POLICY workspace_isolation ON assets`   `USING (workspace_id = current_setting('app.current_workspace', true));` `-- Repetir para cada tabla que tiene workspace_id` `-- (el mismo pattern para todas)` `-- En apps/api, antes de cada query:` ``-- await db.execute(sql`SET app.current_workspace = ${workspaceId}`)`` |
| :---: | :---- |

| TASK 011  infra/ — Docker Compose para desarrollo local   ·  Owner: Tech Lead  ·  Est: 2h  ·  Deps: TASK-010 |
| :---- |

El entorno de desarrollo local usa Docker para PostgreSQL \+ Redis. Esto permite trabajar completamente offline sin depender de Neon o Upstash. La DB local tiene PostGIS instalado — misma versión que en producción.

|  | ⚠ ATENCIÓN  El Docker Compose es SOLO para desarrollo local. En staging y producción: Neon (PostgreSQL) y Upstash (Redis). No hay ningún contenedor en producción que el equipo deba gestionar. |
| :---- | :---- |

| `yaml` | `# infra/docker-compose.yml` `version: "3.9"` `services:`   `postgres:`     `image: postgis/postgis:16-3.4`     `container_name: biffco-postgres`     `environment:`       `POSTGRES_USER: biffco`       `POSTGRES_PASSWORD: biffco_dev_password`       `POSTGRES_DB: biffco`     `ports:`       `- "5432:5432"`     `volumes:`       `- biffco_postgres_data:/var/lib/postgresql/data`     `healthcheck:`       `test: ["CMD-SHELL", "pg_isready -U biffco -d biffco"]`       `interval: 5s`       `timeout: 5s`       `retries: 10`     `restart: unless-stopped`   `redis:`     `image: redis:7-alpine`     `container_name: biffco-redis`     `ports:`       `- "6379:6379"`     `command: redis-server --requirepass biffco_redis_dev`     `volumes:`       `- biffco_redis_data:/data`     `healthcheck:`       `test: ["CMD", "redis-cli", "-a", "biffco_redis_dev", "ping"]`       `interval: 5s`       `timeout: 5s`       `retries: 10`     `restart: unless-stopped` `volumes:`   `biffco_postgres_data:`   `biffco_redis_data:` |
| :---: | :---- |

Comandos de uso:

| `bash` | `# Levantar todos los servicios en background` `$ docker compose -f infra/docker-compose.yml up -d` `# Verificar que todos están healthy` `$ docker compose -f infra/docker-compose.yml ps` `# Ver logs de PostgreSQL` `$ docker compose -f infra/docker-compose.yml logs postgres` `# Conectarse a la DB local` `$ psql postgresql://biffco:biffco_dev_password@localhost:5432/biffco` `# Detener (preserva los datos)` `$ docker compose -f infra/docker-compose.yml stop` `# Destruir y limpiar todo (útil para reset)` `$ docker compose -f infra/docker-compose.yml down -v` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: docker compose ps muestra los dos servicios como "healthy". psql ... \-c "SELECT PostGIS\_Version()" retorna la versión. |
| :---- | :---- |

| TASK 012  scripts/setup.sh — setup desde cero en \< 10 minutos   ·  Owner: Tech Lead  ·  Est: 3h  ·  Deps: TASK-001 al TASK-011 |
| :---- |

Este script es el contrato de developer experience de BIFFCO. Cualquier persona que clone el repo y lo ejecute tiene el sistema funcionando en menos de 10 minutos. Sin pasos manuales adicionales.

|  | *El script tiene que ser idempotente: ejecutarlo dos veces produce el mismo resultado que ejecutarlo una vez. No falla si el servicio ya está corriendo. No recrea la DB si ya tiene datos.* |
| :---- | :---- |

| `bash` | `#!/bin/bash` `# scripts/setup.sh` `# BIFFCO — Setup completo desde cero` `# Tiempo objetivo: < 10 minutos en máquina limpia con buena conexión a internet` `set -e  # Salir inmediatamente si cualquier comando falla` `set -u  # Tratar variables no definidas como error` `RED="\033[0;31m"` `GREEN="\033[0;32m"` `YELLOW="\033[1;33m"` `BLUE="\033[0;34m"` `NC="\033[0m" # No Color` `log() { echo -e "${BLUE}[BIFFCO]${NC} $1"; }` `ok()  { echo -e "${GREEN}[✅]${NC} $1"; }` `warn(){ echo -e "${YELLOW}[⚠]${NC} $1"; }` `fail(){ echo -e "${RED}[❌]${NC} $1"; exit 1; }` `# ─── VERIFICAR PRERREQUISITOS ────────────────────────────────────────` `log "Verificando prerrequisitos..."` `command -v node >/dev/null 2>&1 || fail "Node.js no está instalado. Instalar con: nvm install 22"` `NODE_MAJOR=$(node -v | cut -d. -f1 | tr -d 'v')` `[ "$NODE_MAJOR" -ge 22 ] || fail "Node.js 22+ requerido. Versión actual: $(node -v)"` `ok "Node.js $(node -v)"` `command -v pnpm >/dev/null 2>&1 || fail "pnpm no está instalado. Instalar con: npm install -g pnpm@9"` `ok "pnpm $(pnpm -v)"` `command -v docker >/dev/null 2>&1 || fail "Docker no está instalado. Ver: docker.com/products/docker-desktop"` `docker info >/dev/null 2>&1 || fail "Docker Desktop no está corriendo. Iniciarlo antes de continuar."` `ok "Docker $(docker -v)"` `command -v doppler >/dev/null 2>&1 || fail "Doppler CLI no está instalado. Ver: docs.doppler.com/docs/install-cli"` `ok "Doppler $(doppler --version)"` `# ─── VERIFICAR DOPPLER ───────────────────────────────────────────────` `log "Verificando configuración de Doppler..."` `if ! doppler configure get project --plain 2>/dev/null | grep -q "biffco"; then`   `warn "Doppler no está configurado para este proyecto."`   `log "Ejecutando doppler setup..."`   `doppler setup` `fi` `ok "Doppler configurado: proyecto=$(doppler configure get project --plain)"` `# ─── INSTALAR DEPENDENCIAS ───────────────────────────────────────────` `log "Instalando dependencias con pnpm..."` `pnpm install --frozen-lockfile` `ok "Dependencias instaladas"` `# ─── LEVANTAR SERVICIOS LOCALES ──────────────────────────────────────` `log "Levantando servicios locales (Docker)..."` `docker compose -f infra/docker-compose.yml up -d` `# Esperar que PostgreSQL esté ready` `log "Esperando que PostgreSQL esté listo..."` `for i in $(seq 1 30); do`   `if docker compose -f infra/docker-compose.yml exec -T postgres pg_isready -U biffco -d biffco >/dev/null 2>&1; then`     `ok "PostgreSQL listo"`     `break`   `fi`   `[ $i -eq 30 ] && fail "PostgreSQL no respondió después de 30 segundos"`   `sleep 1` `done` `# Esperar que Redis esté ready` `log "Esperando que Redis esté listo..."` `for i in $(seq 1 15); do`   `if docker compose -f infra/docker-compose.yml exec -T redis redis-cli -a biffco_redis_dev ping 2>/dev/null | grep -q PONG; then`     `ok "Redis listo"`     `break`   `fi`   `[ $i -eq 15 ] && fail "Redis no respondió después de 15 segundos"`   `sleep 1` `done` `# ─── EJECUTAR MIGRATIONS ─────────────────────────────────────────────` `log "Ejecutando migrations de base de datos..."` `# Usar la DB local (Docker) para las migrations en dev` `DATABASE_URL_UNPOOLED="postgresql://biffco:biffco_dev_password@localhost:5432/biffco" \`   `pnpm db:migrate` `ok "Migrations ejecutadas"` `# ─── VERIFICAR POSTGIS ───────────────────────────────────────────────` `log "Verificando PostGIS..."` `PG_VERSION=$(docker compose -f infra/docker-compose.yml exec -T postgres \`   `psql -U biffco -d biffco -t -c "SELECT PostGIS_Version();" 2>/dev/null | xargs)` `if [ -n "$PG_VERSION" ]; then`   `ok "PostGIS $PG_VERSION"` `else`   `fail "PostGIS no está disponible. Revisar que la extension esté en las migrations."` `fi` `# ─── VERIFICAR EL TRIGGER ANTI-TAMPERING ─────────────────────────────` `log "Verificando trigger anti-tampering en domain_events..."` `TRIGGER_EXISTS=$(docker compose -f infra/docker-compose.yml exec -T postgres \`   `psql -U biffco -d biffco -t -c \`   `"SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_name = 'domain_events_immutability_guard';" \`   `2>/dev/null | xargs)` `if [ "$TRIGGER_EXISTS" = "1" ]; then`   `ok "Trigger anti-tampering activo"` `else`   `fail "Trigger anti-tampering NO encontrado. Revisar la migration."` `fi` `# ─── VERIFICAR ESLint INVARIANTE ─────────────────────────────────────` `log "Verificando invariante arquitectónico ESLint..."` `# Crear un archivo de test con un import prohibido` `TEST_FILE="packages/core/src/__invariant_test.ts"` `echo "import type { } from '@biffco/livestock'" > "$TEST_FILE"` `# ESLint debe fallar con este archivo` `if pnpm eslint "$TEST_FILE" 2>&1 | grep -q "INVARIANTE ARQUITECTÓNICO"; then`   `ok "Invariante ESLint funcionando: imports de verticals en core son rechazados"` `else`   `rm -f "$TEST_FILE"`   `fail "El invariante ESLint NO está funcionando. Revisar eslint.config.mjs."` `fi` `rm -f "$TEST_FILE"` `# ─── BUILD ───────────────────────────────────────────────────────────` `log "Compilando todos los packages..."` `pnpm build` `ok "Build exitoso"` `# ─── RESUMEN FINAL ───────────────────────────────────────────────────` `echo ""` `echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"` `echo -e "${GREEN}║   ✅ BIFFCO Setup completado           ║${NC}"` `echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"` `echo ""` `log "Para empezar a desarrollar:"` `log "  doppler run -- pnpm dev"` `echo ""` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación final: time ./scripts/setup.sh en una máquina sin nada instalado (o en una VM limpia) debe completar en menos de 10 minutos. El tiempo debe ser documentado. |
| :---- | :---- |

| TASK 013  GitHub Actions — CI/CD pipeline   ·  Owner: Tech Lead  ·  Est: 3h  ·  Deps: TASK-002, TASK-003 |
| :---- |

El CI corre en cada PR. Bloquea el merge si cualquier verificación falla. El CI es la segunda línea de defensa después del ESLint local del developer.

| `yaml` | `# .github/workflows/ci.yml` `name: CI` `on:`   `pull_request:`     `branches: [main, develop]`   `push:`     `branches: [main]` `concurrency:`   `group: ${{ github.workflow }}-${{ github.ref }}`   `cancel-in-progress: true` `jobs:`   `ci:`     `name: Lint + Typecheck + Test + Build`     `runs-on: ubuntu-latest`     `timeout-minutes: 20`     `services:`       `postgres:`         `image: postgis/postgis:16-3.4`         `env:`           `POSTGRES_USER: biffco`           `POSTGRES_PASSWORD: biffco_ci`           `POSTGRES_DB: biffco_test`         `ports:`           `- 5432:5432`         `options: >-`           `--health-cmd pg_isready`           `--health-interval 5s`           `--health-timeout 5s`           `--health-retries 10`       `redis:`         `image: redis:7-alpine`         `ports:`           `- 6379:6379`     `steps:`       `- uses: actions/checkout@v4`       `- name: Setup Node.js 22`         `uses: actions/setup-node@v4`         `with:`           `node-version: '22'`       `- name: Setup pnpm`         `uses: pnpm/action-setup@v4`         `with:`           `version: '9'`       `- name: Get pnpm store directory`         `id: pnpm-cache`         `run: echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT`       `- name: Setup pnpm cache`         `uses: actions/cache@v4`         `with:`           `path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}`           `key: ${{ runner.os }}-pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}`           `restore-keys: ${{ runner.os }}-pnpm-`       `- name: Inject Doppler secrets`         `uses: dopplerhq/secrets-fetch-action@v1.1.3`         `with:`           `doppler-token: ${{ secrets.DOPPLER_TOKEN }}`           `doppler-project: biffco`           `doppler-config: staging`           `inject-env-vars: true`       `- name: Install dependencies`         `run: pnpm install --frozen-lockfile`       `- name: Run migrations (CI DB)`         `run: |`           `DATABASE_URL_UNPOOLED="postgresql://biffco:biffco_ci@localhost:5432/biffco_test" \`           `pnpm db:migrate`       `# ─── EL TEST MÁS IMPORTANTE: el invariante arquitectónico ───`       `- name: Test invariante ESLint (core no puede importar verticals)`         `run: |`           `echo "import type { } from '@biffco/livestock'" > packages/core/src/__test_invariant.ts`           `if pnpm eslint packages/core/src/__test_invariant.ts 2>&1 | grep -q "INVARIANTE"; then`             `echo "✅ Invariante ESLint funcionando correctamente"`             `rm packages/core/src/__test_invariant.ts`           `else`             `rm packages/core/src/__test_invariant.ts`             `echo "❌ El invariante ESLint NO está funcionando. BLOQUEANDO MERGE."`             `exit 1`           `fi`       `- name: Lint`         `run: pnpm lint`       `- name: Typecheck`         `run: pnpm typecheck`       `- name: Test`         `run: pnpm test`         `env:`           `DATABASE_URL: postgresql://biffco:biffco_ci@localhost:5432/biffco_test`           `REDIS_URL: redis://localhost:6379`       `- name: Build`         `run: pnpm build`   `# ─── Detectar secretos en el código ─────────────────────────────`   `secrets-check:`     `name: Check for hardcoded secrets`     `runs-on: ubuntu-latest`     `steps:`       `- uses: actions/checkout@v4`         `with:`           `fetch-depth: 0`       `- name: Run gitleaks`         `uses: gitleaks/gitleaks-action@v2`         `env:`           `GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: abrir un PR con un import prohibido (import from "@biffco/livestock" en packages/core). El CI debe fallar en el step "Test invariante ESLint" con el mensaje ❌. |
| :---- | :---- |

| TASK 014 / 015 / 016  Apps skeleton — apps/web, apps/platform, apps/verify   ·  Owner: Frontend Dev  ·  Est: 4h  ·  Deps: TASK-007 |
| :---- |

Las tres apps son skeletons en la Fase 0\. El contenido real se desarrolla en la Fase B. Lo que importa en este sprint es que: compilan sin errores, tienen el layout base correcto, están desplegadas en Vercel, y tienen la configuración de tipografías y tokens CSS.

## **Dependencias comunes a las tres apps**

| `bash` | `# Para cada app:` `$ pnpm --filter @biffco/web add next@15 react@19 react-dom@19` `$ pnpm --filter @biffco/web add -D @types/react@19 @types/react-dom@19 tailwindcss@4 postcss autoprefixer` `# Tipografías (solo local — no Google Fonts)` `# Nohemi: descargar de fontsource o usar el archivo de la organización` `# Inter: disponible en @fontsource/inter` `$ pnpm --filter @biffco/web add @fontsource/inter @fontsource/jetbrains-mono` |
| :---: | :---- |

## **apps/web — biffco.co**

* Next.js 15 App Router, generateStaticParams, output: "export" para generación estática.

* Páginas: / (landing hero con copy multi-vertical), /features, /verticals (sección de Ganadería y Minería), /pricing, /changelog.

* En la Fase 0: cada página tiene el layout con header y footer, y un placeholder con el título de la sección. El copy real se completa en la Fase B.

* El hero de / tiene el botón "Registrar organización" que apunta a la URL de apps/platform (process.env.NEXT\_PUBLIC\_PLATFORM\_URL \+ "/register").

## **apps/platform — app.biffco.co**

* Next.js 15 App Router, SSR (no static export — tiene autenticación).

* En la Fase 0: solo el layout base con sidebar \+ topbar como placeholders. Sin autenticación (eso es Fase A.2).

* La ruta / redirige a /dashboard (que en la Fase 0 es una página vacía con el layout).

## **apps/verify — verify.biffco.co**

* Next.js 15 Edge Runtime. Esto es crítico — verificar que next.config.ts tiene runtime: "edge" en las rutas relevantes.

* En la Fase 0: página /\[assetId\] que retorna "verify.biffco.co funciona" con el assetId de la URL. La lógica real se implementa en la Fase B.3.

## **globals.css — los design tokens (común a las tres apps)**

El archivo globals.css tiene TODOS los tokens CSS del sistema. Ningún valor de color, tamaño o sombra se hardcodea en ningún componente. Todo usa var(--\[token\]).

| `css` | `/* globals.css — tokens del sistema BIFFCO */` `:root {`   `/* ─── Colores de marca ──────────────────────────── */`   `--color-navy: #0B132B;`   `--color-primary: #3A86FF;`   `--color-primary-hover: #2563EB;`   `--color-orange: #FF6B35;`   `--color-success: #059669;`   `--color-warning: #D97706;`   `--color-error: #DC2626;`   `--color-teal: #0D9488;`   `--color-purple: #5A189A;`   `/* ─── Texto ─────────────────────────────────────── */`   `--color-text-primary: #0F1623;`   `--color-text-secondary: #6B7280;`   `--color-text-muted: #9CA3AF;`   `/* ─── Superficies ───────────────────────────────── */`   `--color-surface: #FFFFFF;`   `--color-surface-raised: #F9FAFB;`   `--color-surface-overlay: #F3F4F6;`   `--color-border: #E5E7EB;`   `--color-border-strong: #D1D5DB;`   `/* ─── Backgrounds especiales ────────────────────── */`   `--color-bg-mint: #DEFFD6;`   `--color-bg-blue: #D6EAFF;`   `--color-bg-yellow: #FFFBEB;`   `/* ─── Border Radius ─────────────────────────────── */`   `--radius-sm: 4px;`   `--radius-md: 8px;`   `--radius-lg: 12px;`   `--radius-xl: 16px;`   `--radius-pill: 9999px;`   `/* ─── Shadows ───────────────────────────────────── */`   `--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);`   `--shadow-md: 0 4px 6px rgba(0,0,0,0.07);`   `--shadow-lg: 0 10px 15px rgba(0,0,0,0.1);`   `/* ─── Tipografías ───────────────────────────────── */`   `--font-display: 'Nohemi', system-ui, sans-serif;   /* H1, H2, display */`   `--font-body: 'Inter', system-ui, sans-serif;        /* Cuerpo, UI */`   `--font-mono: 'JetBrains Mono', monospace;           /* Hashes, código */`   `/* ─── Espaciado (8px grid) ──────────────────────── */`   `--space-1: 4px;`   `--space-2: 8px;`   `--space-3: 12px;`   `--space-4: 16px;`   `--space-6: 24px;`   `--space-8: 32px;`   `--space-12: 48px;`   `--space-16: 64px;` `}` `[data-theme="dark"] {`   `--color-surface: #0F1623;`   `--color-surface-raised: #1A2336;`   `--color-surface-overlay: #212D45;`   `--color-border: #2A3854;`   `--color-text-primary: #F1F5F9;`   `--color-text-secondary: #94A3B8;`   `--color-text-muted: #64748B;` `}` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: pnpm build retorna éxito para las tres apps. Las tres URLs de Vercel responden HTTP 200\. El viewport en dark mode muestra los colores correctos. |
| :---- | :---- |

| TASK 017  ADR-001 — Architecture Decision Record: separación Core / Verticals   ·  Owner: Tech Lead  ·  Est: 1h  ·  Deps: TASK-002 |
| :---- |

Un ADR documenta una decisión arquitectónica importante: qué se decidió, por qué, cuáles eran las alternativas, y cuáles son las consecuencias. El ADR-001 documenta la decisión más importante del sistema: el Core nunca conoce a los Verticals.

| `md` | `# docs/ADRs/ADR-001-core-verticals-separation.md` `# ADR-001: Separación estricta entre packages/core y packages/verticals` `**Estado:** Aceptado` `**Fecha:** [fecha actual]` `**Autores:** [nombres del equipo]` `## Contexto` `BIFFCO es una plataforma de trazabilidad criptográfica multi-vertical.` `El primer vertical es Ganadería Bovina (deadline EUDR diciembre 2026).` `El segundo es Minería (Battery Passport EU 2027).` `En el futuro habrá Farmacéutica, Alimentos, Logística.` `El riesgo principal de la arquitectura: que el Core acumule lógica específica de` `cada vertical, haciendo que cada nuevo vertical sea una modificación al Core en` `lugar de una extensión.` `## Decisión` `packages/core **nunca importará** nada de packages/verticals/*..` `Esta regla está enforced por:` `1. ESLint: regla no-restricted-imports en eslint.config.mjs` `2. CI: el workflow de GitHub Actions verifica la regla en cada PR` `3. Proceso de revisión: ningún PR que viole esta regla puede mergearse` `## Alternativas consideradas` `**Alternativa 1: Core con hooks de inyección de dependencias**` `El Core expone interfaces y el Vertical inyecta sus implementaciones.` `Rechazada porque: compleja de implementar, difícil de debuggear, no añade valor` `suficiente sobre la solución elegida.` `**Alternativa 2: Un sistema por vertical**` `Cada vertical es un producto separado con su propio Core.` `Rechazada porque: duplicación de infraestructura, sin economías de escala,` `imposible de mantener a largo plazo.` `## Consecuencias` `**Positivas:**` `- Agregar un nuevo vertical toma 2-3 semanas, no meses` `- Los cambios en el Core nunca rompen los Verticales (no hay dependencia)` `- El Core puede ser testeado de forma completamente independiente` `- El invariante es verificable automáticamente: grep packages/core → 0 imports de verticals` `**Negativas:**` `- El VerticalPack necesita implementar la interface completa incluso cuando`   `podría usar lógica del Core (no puede hacerlo directamente)` `- La interface VerticalPack es un contrato que no se puede cambiar fácilmente`   `post-producción` `## Verificación de cumplimiento` `Después de cada sprint que implementa o modifica un Vertical:` ```` ```bash ```` `grep -r "@biffco/livestock\|@biffco/mining\|from.*verticals" packages/core/` `# Expected output: ningún resultado` ```` ``` ```` `## Referencias` `- Hoja de Ruta Maestra BIFFCO v3.1 — Sección 04 "El Core genérico"` `- packages/core/vertical-engine/types.ts — la interface VerticalPack` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: el archivo docs/ADRs/ADR-001-core-verticals-separation.md existe en el repositorio y está commiteado. |
| :---- | :---- |

# **22\. Phase Gate 0 — Criterios de cierre y checklist**

El Phase Gate 0 es la puerta de entrada a la Fase A. NO se puede empezar la Fase A si cualquiera de los ítems críticos (marcados con 🔴) está en ❌. Los ítems opcionales (🟡) se pueden diferir pero deben documentarse en deferred-items.md.

|  | *El Phase Gate se ejecuta formalmente en el Día 9 del sprint. El Tech Lead completa el checklist, documenta cada verificación con el comando ejecutado y su output, y lo sube como PR. El equipo lo revisa y aprueba.* |
| :---- | :---- |

## **Checklist de criterios de cierre**

| ID | Criterio | Cómo verificarlo | Prioridad |
| :---- | :---- | :---- | :---- |
| PG0-01 | setup.sh completa en \< 10 minutos en máquina limpia | time ./scripts/setup.sh en una máquina sin historial. Documentar el tiempo exacto. | 🔴 CRÍTICO |
| PG0-02 | Las 3 apps responden HTTP 200 en Vercel | curl \-I https://biffco.co && curl \-I https://app.biffco.co && curl \-I https://verify.biffco.co | 🔴 CRÍTICO |
| PG0-03 | PostGIS activo en Neon dev y staging | doppler run \--config dev \-- psql $DATABASE\_URL \-c "SELECT PostGIS\_Version();" | 🔴 CRÍTICO |
| PG0-04 | Schema completo migrado (todas las tablas) | pnpm db:migrate → "No pending migrations" (segunda ejecución) | 🔴 CRÍTICO |
| PG0-05 | Trigger anti-tampering activo en domain\_events | UPDATE domain\_events SET type='x' WHERE FALSE → ERROR mensaje del trigger | 🔴 CRÍTICO |
| PG0-06 | CI GitHub Actions pasa en un PR real | Abrir un PR con cambio trivial. Verificar que todos los steps pasan. | 🔴 CRÍTICO |
| PG0-07 | Invariante ESLint activo en CI | Abrir un PR con import prohibido en packages/core → CI falla con mensaje claro | 🔴 CRÍTICO |
| PG0-08 | gitleaks: 0 secretos en el repositorio | gitleaks detect \--source . → 0 findings | 🔴 CRÍTICO |
| PG0-09 | npm audit: 0 vulnerabilidades high/critical | pnpm audit → 0 vulnerabilities found at high or critical level | 🔴 CRÍTICO |
| PG0-10 | pnpm typecheck sin errores | pnpm typecheck → 0 errors | 🔴 CRÍTICO |
| PG0-11 | ADR-001 commiteado | git log \--oneline docs/ADRs/ADR-001\*.md → muestra el commit | 🔴 CRÍTICO |
| PG0-12 | README.md actualizado con instrucciones de setup | Que un developer nuevo pueda seguir el README sin ayuda adicional | 🔴 CRÍTICO |
| PG0-13 | Doppler: variables en los 3 entornos (dev, staging, prod) | doppler secrets list \--project biffco \--config prod → DATABASE\_URL presente | 🟡 RECOMENDADO |
| PG0-14 | RLS activo en las tablas principales | doppler run \-- psql $DATABASE\_URL \-c "SELECT tablename FROM pg\_tables WHERE rowsecurity \= true;" | 🟡 RECOMENDADO |
| PG0-15 | Design tokens en globals.css (al menos 10 tokens) | grep \-c "var(--" apps/platform/src/app/globals.css → \> 10 | 🟡 RECOMENDADO |
| PG0-16 | Doppler \+ Vercel integración configurada | Verificar que Vercel lee variables de Doppler automáticamente en staging deploy | 🟡 RECOMENDADO |

## **Plantilla de documentación del Phase Gate**

Cada ítem debe documentarse con este formato en el PR del Phase Gate:

| `md` | `## Phase Gate 0 — Verificación` `**Fecha:** [fecha]` `**Ejecutado por:** [nombre]` `**Máquinas probadas:** MacBook Pro M2 (Tech Lead), MacBook Air M1 (Frontend Dev)` `### PG0-01 — setup.sh < 10 minutos` ```` ``` ```` `time ./scripts/setup.sh` `# Output resumido:` `# [BIFFCO] Verificando prerrequisitos...` `# [✅] Node.js v22.11.0` `# [✅] pnpm 9.14.2` `# [✅] Docker 27.3.1` `# [✅] Doppler 3.70.0` `# [✅] Dependencias instaladas` `# [✅] PostgreSQL listo` `# [✅] Redis listo` `# [✅] Migrations ejecutadas` `# [✅] PostGIS 3.4.3 USE_GEOS=1 USE_PROJ=1 ...` `# [✅] Trigger anti-tampering activo` `# [✅] Invariante ESLint funcionando` `# [✅] Build exitoso` `# real    7m23.451s  <-- DENTRO DEL LÍMITE DE 10 MINUTOS` ```` ``` ```` `**Estado: ✅ PASSED** — 7 minutos 23 segundos` `### PG0-07 — Invariante ESLint activo en CI` `**PR #XX** con el import prohibido: https://github.com/biffco-co/biffco/pull/XX` `CI falló en el step "Test invariante ESLint" con:` ```` ``` ````   `packages/core/src/__test_invariant.ts`     `1:1  error  INVARIANTE ARQUITECTÓNICO: packages/core no puede importar`          `ningún VerticalPack. Ver ADR-001.  no-restricted-imports` ```` ``` ```` `**Estado: ✅ PASSED**` |
| :---: | :---- |

# **23\. Troubleshooting — problemas comunes y soluciones**

| Problema | Síntoma | Causa probable | Solución |
| :---- | :---- | :---- | :---- |
| setup.sh falla en pg\_isready | Error: PostgreSQL no respondió después de 30 segundos | Docker no tiene suficiente RAM asignada, o el volumen de datos está corrupto. | Aumentar RAM de Docker Desktop a 4GB mínimo. O: docker compose down \-v && docker compose up \-d (elimina los datos) |
| pnpm install falla con peer deps | WARN: peer dependencies no cumplidas | Version mismatch entre packages. | pnpm install \--legacy-peer-deps o actualizar la versión del package en conflicto. |
| pnpm db:migrate falla | Error: "pg\_dump: error: query failed: extension postgis does not exist" | PostGIS no está habilitado en Neon. | Ejecutar CREATE EXTENSION IF NOT EXISTS postgis; en el SQL Editor de Neon para esa branch. |
| doppler run devuelve "undefined" | process.env.DATABASE\_URL es undefined | Doppler no está configurado para el proyecto o la config incorrecta. | doppler setup y seleccionar proyecto biffco, config dev. Verificar con doppler configure. |
| ESLint invariante no detecta el import prohibido | No aparece el error INVARIANTE ARQUITECTÓNICO | El archivo de test no está en packages/core/ o el pattern del ESLint no coincide. | Verificar que el archivo de test está exactamente en packages/core/src/. Revisar el pattern en eslint.config.mjs. |
| Vercel build falla | Error de TypeScript en el deploy de Vercel | TypeScript strict mode detecta errores que no se ven localmente. | Correr pnpm typecheck localmente para replicar el error antes del deploy. |
| Trigger anti-tampering no existe | SELECT COUNT(\*) FROM triggers WHERE name \= ... retorna 0 | El trigger no se incluyó en la migration inicial. | Agregar el trigger al archivo SQL de migration y ejecutar pnpm db:migrate nuevamente. |
| docker compose up falla en puerto 5432 | bind: address already in use | PostgreSQL local (fuera de Docker) está corriendo en el puerto 5432\. | sudo service postgresql stop (Linux) o en macOS: brew services stop postgresql. |

# **24\. Deferred Items — lo que explícitamente NO se hace en la Fase 0**

Los Deferred Items son decisiones conscientes de diferir trabajo para fases futuras. No son deuda técnica — son priorización deliberada. Cada uno tiene un ID único (DEF-XXX), una razón clara por la que se difiere, y la fase en que se resuelve.

| ID | Qué se difiere | Por qué se difiere | Se resuelve en |
| :---- | :---- | :---- | :---- |
| DEF-001 | Autenticación (JWT, signup, login) | En la Fase 0 no hay usuarios ni sesiones. La auth se necesita cuando el Operations Dashboard existe. Agregar auth sin UI es trabajo sin valor. | Fase A.2 |
| DEF-002 | packages/core (Ed25519, SLIP-0010, Event Store, RBAC) | El Core depende de que el schema DB esté correcto. No tiene sentido implementarlo antes de que el schema esté migrado y verificado. | Fase A.1 |
| DEF-003 | apps/api — Fastify \+ tRPC endpoints | La API depende del Core. Sin Core, no hay endpoints que implementar. | Fase A.2 |
| DEF-004 | Design system completo (components) | En la Fase 0 solo se necesitan los tokens CSS. Los componentes se desarrollan cuando hay UI que construir. | Fase B.1 |
| DEF-005 | S3 \+ Object Lock (evidencias WORM) | Las evidencias se agregan en los eventos, que son Fase A. No hay evidencias que guardar en la Fase 0\. | Fase B.3 |
| DEF-006 | Stripe (billing) | No hay producto que vender hasta tener al menos el MVP completo. | Fase E.1 |
| DEF-007 | Integración con IS EUDR Gateway | El gateway de la Comisión Europea requiere el DDS completo, que se genera en Fase C. | Fase F.2 |
| DEF-008 | packages/verticals/livestock y packages/verticals/mining | Los VerticalPacks dependen del Core completo y del Product Layer. Crearlos ahora sería trabajo sin base. | Fases C y F |
| DEF-009 | Staging deploy funcional de apps/api | Railway existe y tiene las variables, pero el build va a fallar hasta que apps/api tenga código real. | Fase A.3 |
| DEF-010 | pgvector \+ AI Engine | Feature de Growth — no es necesario para MVP. | Fase E.2 |
| DEF-011 | OpenTelemetry \+ Grafana Cloud | Observabilidad avanzada se configura cuando hay algo que observar en producción. | Fase D.1 |
| DEF-012 | Seed de datos de desarrollo | El seed requiere el Core para generar eventos firmados. Sin Core no hay seed significativo. | Fase A.3 |

|  | ✅ VERIFICACIÓN  Todos los DEF-XXX deben estar documentados en docs/deferred-items.md antes de cerrar la Fase 0\. Ningún ítem diferido puede quedar sin documentar. |
| :---- | :---- |

