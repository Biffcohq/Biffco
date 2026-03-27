

**BIFFCO™**

*Trust Infrastructure for Global Value Chains*

**FASE A — CORE TRUST LAYER**

Playbook completo para el equipo de desarrollo

*Semanas 3–8  ·  Duración: 30 días hábiles  ·  3 sprints: A.1 / A.2 / A.3*

| Objetivo de la Fase A *Al finalizar estas seis semanas, el sistema puede firmar un evento con Ed25519 en el browser, persistirlo en el Event Store append-only, verificarlo matemáticamente, anclarlo en Polygon Amoy y verificarlo de forma completamente independiente de BIFFCO. El Workspace model está operativo. El invariante "packages/core no importa packages/verticals" se mantiene limpio. El primer usuario puede hacer signup con mnemonic y ver su Management Dashboard vacío.* |
| :---: |

Marzo–Abril 2026  ·  Córdoba, Argentina  ·  CONFIDENCIAL — USO INTERNO

# **Índice**

| Sección | Título |
| :---- | :---- |
| 01 | ¿Qué es la Fase A y qué construimos? |
| 02 | Prerequisitos — la Fase 0 debe estar cerrada |
| 03 | Equipo, roles y herramientas |
| 04 | Cronograma día a día — 30 días hábiles |
| SPRINT A.1 | Semanas 3–5 — Domain types, criptografía, Event Store |
| 05 | TASK-018 — packages/core/domain |
| 06 | TASK-019 — packages/core/crypto (Ed25519, SLIP-0010, BIP-39, Merkle) |
| 07 | TASK-020 — packages/core/event-store |
| 08 | TASK-021 — packages/core/rbac |
| 09 | TASK-022 — packages/ui base (componentes genéricos) |
| 10 | Phase Gate A.1 — criterios de cierre del primer sprint |
| SPRINT A.2 | Semanas 5–7 — Vertical Engine, API, Workspace signup |
| 11 | TASK-023 — packages/core/vertical-engine \+ DynamicFormRenderer |
| 12 | TASK-024 — apps/api — Fastify 5 \+ tRPC v11 setup |
| 13 | TASK-025 — apps/api — auth router (signup 8 pasos \+ login \+ JWT) |
| 14 | TASK-026 — apps/api — workspace, members, facilities, zones, pens routers |
| 15 | TASK-027 — apps/platform — Wizard de registro \+ Management Dashboard |
| 16 | Phase Gate A.2 — criterios de cierre del segundo sprint |
| SPRINT A.3 | Semanas 7–8 — Blockchain, workers, observabilidad |
| 17 | TASK-028 — Polygon Amoy \+ SimpleAnchor.sol \+ AnchorBatchJob |
| 18 | TASK-029 — Sentry \+ OpenTelemetry |
| 19 | TASK-030 — apps/verify base \+ BlockchainAnchorBadge |
| 20 | Phase Gate A — Criterios de cierre completos de la Fase A |
| 21 | Troubleshooting — problemas comunes de la Fase A |
| 22 | Deferred Items — lo que explícitamente no se hace en esta fase |

# **01\. ¿Qué es la Fase A y qué construimos?**

La Fase A es el corazón del sistema. Todo lo que se construye aquí es permanente — no se modifica post-producción. El Core Trust Layer implementa tres contratos que BIFFCO no puede romper nunca: el contrato criptográfico (Ed25519 \+ SLIP-0010), el contrato de inmutabilidad (Event Store append-only), y el contrato de modularidad (packages/core no conoce a packages/verticals).

|  | La Fase A es la única donde "hacerlo rápido" es el enemigo. Una mala decisión aquí — un algoritmo de derivación de claves incorrecto, un Event Store que no es verdaderamente append-only, un Core que filtra lógica de vertical — es un bug que invalida la propuesta de valor completa del sistema. Hacer bien la Fase A toma exactamente 6 semanas. No 4\. |
| :---- | :---- |

## **Los tres contratos que se implementan en la Fase A**

| Contrato | Qué se implementa | Por qué no cambia post-producción |
| :---- | :---- | :---- |
| Contrato criptográfico | Ed25519 para firma de eventos. SLIP-0010 para derivación de claves con wsIdx en el path. BIP-39 para el mnemonic (solo en el browser en el signup). Merkle tree para anclajes en Polygon. | Cambiar el algoritmo de firma post-producción invalida todas las firmas históricas. Cambiar el path de derivación invalida todas las claves existentes. El sistema deja de ser verificable. |
| Contrato de inmutabilidad | Event Store PostgreSQL con trigger BEFORE UPDATE OR DELETE → RAISE EXCEPTION. Replay determinístico. Lineage via parentIds\[\]. | Un UPDATE en domain\_events invalida la verificabilidad de ese evento. El sistema deja de poder demostrar que los hechos no fueron modificados. |
| Contrato de modularidad | packages/core implementa la interface VerticalPack pero NUNCA importa ningún VerticalPack concreto. ESLint \+ CI lo garantizan. | Si el Core importa un VerticalPack, agregar el siguiente vertical requiere modificar el Core. El moat estratégico desaparece. |

## **Qué existe al cerrar la Fase A**

| Entregable | Estado al final de la Fase A | Cómo se verifica |
| :---- | :---- | :---- |
| packages/core/domain | DomainEvent, Asset, AssetGroup, WorkspaceMember, Team, Employee. Branded types completos. Result\<T,E\>. | pnpm \--filter @biffco/core build sin errores. |
| packages/core/crypto | signEvent \+ verifyEvent (Ed25519). deriveKey (SLIP-0010 con wsIdx). generateMnemonic(24). MerkleTree. hashDocument(SHA-256). canonicalJson. | Test vectors RFC 8037 pasan. Derivación SLIP-0010 determinista con seed conocido. |
| packages/core/event-store | PostgresEventStore: append (verifica firma), replay (determinístico), getByAssetId, getDescendants, getAncestors. Trigger anti-tampering. | 3 corridas de replay con 1000 eventos \= resultado idéntico. UPDATE domain\_events → EXCEPTION. |
| packages/core/rbac | Permission enum completo (incluye assets.split, assets.merge, assets.transform, holds.impose, holds.lift). can() deny-by-default. | actor sin roles → can() retorna false para cualquier permission. |
| packages/core/vertical-engine | VerticalPack interface. VerticalRegistry (loadPack, getActivePack). DynamicFormRenderer (7 widgets). | DynamicFormRenderer renderiza un UISchema de prueba sin errores. |
| apps/api | Fastify 5 \+ tRPC v11. Auth: signup (8 pasos) \+ login \+ refresh \+ logout. Routers: workspaces, workspace-members, teams, employees, facilities, zones, pens. JWT \+ Redis revocation. | E2E: POST /trpc/auth.register → POST /trpc/auth.login → GET /trpc/workspaces.getProfile. Playwright verde. |
| apps/platform — Wizard | Los 8 pasos del registro incluyendo la pantalla del mnemonic (oscura, sin navegación). | Un usuario completa el signup desde cero en \< 5 minutos sin instrucciones. |
| apps/platform — Management Dashboard | Sidebar \+ topbar conectados. /dashboard vacío con layout. /members, /facilities funcionales. | Un usuario logueado ve su Management Dashboard con los datos de su Workspace. |
| Polygon Amoy | SimpleAnchor.sol desplegado. AnchorBatchJob corriendo. Primer txHash real en el explorador de Amoy. | El txHash aparece en https://amoy.polygonscan.com/ buscando el hash. |
| Sentry \+ OpenTelemetry | Sentry captura errors en apps/api. Trazas etiquetadas por workspaceId y verticalId. | Lanzar un error de prueba en staging → aparece en Sentry con el tag correcto. |
| RLS verificado | tenant B no puede leer datos de tenant A. | 5 queries cruzadas retornan 0 resultados. |

# **02\. Prerequisitos — la Fase 0 debe estar cerrada**

La Fase A depende de que TODOS los criterios del Phase Gate 0 estén en ✅. No se empieza la Fase A si hay cualquier ítem crítico de la Fase 0 en rojo.

| Lo que debe estar listo | Cómo verificarlo |
| :---- | :---- |
| setup.sh funciona en \< 10 minutos en cualquier máquina | git clone \+ ./scripts/setup.sh \< 10 min |
| Schema DB completo migrado (todas las tablas de la Fase 0\) | pnpm db:migrate → "No pending migrations" |
| Trigger anti-tampering en domain\_events activo | UPDATE domain\_events SET type='x' WHERE FALSE → ERROR |
| PostGIS activo en Neon dev y staging | SELECT PostGIS\_Version() → versión 3.4.x |
| ESLint invariante activo en CI | PR con import prohibido → CI falla |
| Las 3 apps en Vercel respondiendo HTTP 200 | curl \-I https://biffco.co → HTTP 200 |
| packages/config compilando | pnpm \--filter @biffco/config build → success |
| packages/shared compilando | pnpm \--filter @biffco/shared build → success |
| Docker Compose: postgres \+ redis healthy | docker compose ps → ambos "healthy" |

|  | ⚠ ATENCIÓN  Si el schema de la Fase 0 tiene tablas faltantes o columnas incorrectas, es MÁS BARATO arreglarlo ahora (antes de que haya datos de producción) que después. Revisar el schema completo contra el documento de la Hoja de Ruta Maestra v3.1 antes de arrancar la Fase A. |
| :---- | :---- |

## **Nuevas dependencias a instalar antes del Día 1 de la Fase A**

| `bash` | `# Crypto — Ed25519, HD wallet, BIP-39` `$ pnpm --filter @biffco/core add libsodium-wrappers ed25519-hd-key bip39` `$ pnpm --filter @biffco/core add -D @types/libsodium-wrappers` `# API — Fastify 5 + tRPC v11` `$ pnpm --filter @biffco/api add fastify @fastify/cors @fastify/helmet @fastify/rate-limit @fastify/jwt` `$ pnpm --filter @biffco/api add @trpc/server@11 zod @paralleldrive/cuid2` `# DB — Drizzle helpers adicionales` `$ pnpm --filter @biffco/db add drizzle-orm @neondatabase/serverless` `# Redis para JWT revocation` `$ pnpm --filter @biffco/api add ioredis` `# Blockchain` `$ pnpm --filter @biffco/api add ethers` `# Queue` `$ pnpm --filter @biffco/api add bullmq` `# Observabilidad` `$ pnpm --filter @biffco/api add @sentry/node @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node` `# Testing` `$ pnpm add -D -w vitest @vitest/coverage-v8 @testing-library/react` `# UI — Frontend (en apps/platform)` `$ pnpm --filter @biffco/platform add @radix-ui/react-dialog @radix-ui/react-dropdown-menu` `$ pnpm --filter @biffco/platform add sonner react-hook-form @hookform/resolvers` `$ pnpm --filter @biffco/platform add @tanstack/react-query` `$ pnpm --filter @biffco/platform add @trpc/client@11 @trpc/react-query@11` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: pnpm install \--frozen-lockfile después de agregar todas las dependencias. Si hay conflictos de peer dependencies, resolverlos antes de continuar. |
| :---- | :---- |

# **03\. Equipo, roles y herramientas**

| Rol | Responsabilidad en Fase A | TASKs asignadas |
| :---- | :---- | :---- |
| Tech Lead / Backend Dev | packages/core completo (domain, crypto, event-store, rbac, vertical-engine). apps/api (Fastify, tRPC, auth, routers). Blockchain. Observabilidad. | TASK-018 al TASK-025, TASK-028, TASK-029 |
| Frontend Dev | apps/platform: wizard de registro (8 pasos incluyendo mnemonic), Management Dashboard. packages/ui: componentes base. | TASK-022, TASK-027, TASK-030 |
| Ambos | E2E tests (Playwright). Phase Gate A.1, A.2, A final. | Phase Gates |

## **Herramientas nuevas que entran en la Fase A**

| Herramienta | Uso | Quién la configura |
| :---- | :---- | :---- |
| Vitest | Testing unitario e integración de packages/core. Meta: coverage ≥ 80% al cerrar la Fase. | Tech Lead — TASK-018 |
| Playwright | E2E tests del flujo completo: signup → login → Management Dashboard. | Ambos — TASK-027 |
| Foundry o Hardhat | Compilar y desplegar SimpleAnchor.sol en Polygon Amoy. | Tech Lead — TASK-028 |
| Sentry | Error tracking en apps/api y apps/platform. | Tech Lead — TASK-029 |
| Polygon Amoy Faucet | MATIC de prueba para el deploy del contrato. Gratis en faucet.polygon.technology. | Tech Lead — TASK-028 |

## **Reglas de trabajo para la Fase A**

* REGLA 1: Ningún código en packages/core se mergea sin test unitario. Coverage es medido en cada PR. Un test que falla bloquea el merge.

* REGLA 2: El invariante ESLint corre en cada PR. Si packages/core importa algo de packages/verticals → PR rechazado automáticamente.

* REGLA 3: Los vectores de test de Ed25519 (RFC 8037\) deben estar en el test suite antes de commitear packages/core/crypto. No hay crypto sin test vectors.

* REGLA 4: La pantalla del mnemonic (Paso 5 del wizard) tiene sus propias reglas de seguridad de UI. Ver TASK-027 sección "Pantalla del mnemonic".

* REGLA 5: Ninguna clave privada viaja al servidor. Code review explícitamente busca esto en cada PR que toca apps/api/src/routers/auth.

# **04\. Cronograma día a día — 30 días hábiles**

La Fase A tiene 3 sprints de 2 semanas cada uno. Cada sprint tiene su propio Phase Gate intermedio. El cronograma no es rígido — si el Sprint A.1 termina antes, se arranca el A.2. Si un TASK se atrasa, el blocker se escala inmediatamente.

| A.1 | Semanas 3–4 · Días 1–10 Domain types · Criptografía · Event Store · RBAC · UI base |
| :---: | :---- |

| D01 | Lunes Semana 3 Kickoff Fase A \+ TASK-018 packages/core/domain |
| :---: | :---- |

| Hora | Actividad | Responsable | Entregable |
| :---- | :---- | :---- | :---- |
| 09:00–10:00 | Kickoff: revisar este playbook en equipo. Asignar issues en GitHub. | Todos | Issues de Fase A creados y asignados. |
| 10:00–12:30 | TASK-018 parte 1: estructura de packages/core y tipos base del dominio. | Tech Lead | packages/core/src/domain/index.ts compilando. |
| 12:30–13:30 | TASK-018 parte 2: branded types del dominio (AssetId, WorkspaceId, etc.). | Tech Lead | Branded types en packages/shared exportados y usados en domain. |
| 14:30–17:00 | TASK-018 parte 3: DomainEvent, Asset, AssetGroup interfaces \+ Result\<T,E\>. | Tech Lead | Interfaces completas con JSDoc. |
| 17:00–18:00 | PR\#018: packages/core/domain. Primer test unitario del package. | Tech Lead | CI verde. pnpm typecheck sin errores. |

| D02 | Martes Semana 3 TASK-019 packages/core/crypto parte 1 — Ed25519 |
| :---: | :---- |

| Hora | Actividad | Responsable | Entregable |
| :---- | :---- | :---- | :---- |
| 09:00–12:00 | TASK-019 parte 1: signEvent \+ verifyEvent con libsodium-wrappers. Test vectors RFC 8037\. | Tech Lead | Tests de Ed25519 pasan. Vectores RFC 8037 verificados. |
| 12:00–13:00 | TASK-019 parte 2: canonicalJson (ya está en packages/shared — importar y usar). | Tech Lead | signEvent firma el canonicalJson del payload, no el objeto raw. |
| 14:30–17:30 | TASK-019 parte 3: SLIP-0010 — deriveKey con path m/0'/wsIdx'/memberIdx'. | Tech Lead | Derivación determinista: mismo seed \+ path → mismo keypair. |
| 17:30–18:00 | Tests corriendo: derivación con seeds conocidos, múltiples workspaces distintos. | Tech Lead | Tests SLIP-0010 pasan con ≥ 5 vectores de prueba. |

| D03 | Miércoles Semana 3 TASK-019 packages/core/crypto parte 2 — BIP-39 \+ Merkle |
| :---: | :---- |

| Hora | Actividad | Responsable | Entregable |
| :---- | :---- | :---- | :---- |
| 09:00–11:00 | TASK-019 parte 4: generateMnemonic(24) — wrapper de bip39. Documentación de seguridad. | Tech Lead | Función genera 24 palabras. Tests verifican la entropía mínima. |
| 11:00–13:00 | TASK-019 parte 5: MerkleTree — buildTree, getRoot, getProof. | Tech Lead | Árbol de 100 eventos: prueba de un evento verifica contra la raíz. |
| 14:30–16:00 | TASK-019 parte 6: hashDocument — SHA-256 para evidencias. | Tech Lead | hash(buffer) es determinístico y coincide con openssl dgst \-sha256. |
| 16:00–17:30 | PR\#019: packages/core/crypto completo. Coverage ≥ 80% en este package. | Tech Lead | CI verde. Coverage report incluido en el PR. |
| 17:30–18:00 | Frontend: instalar dependencias de UI y crear estructura de packages/ui. | Frontend Dev | packages/ui con package.json y tsconfig. |

| D04 | Jueves Semana 3 TASK-020 packages/core/event-store |
| :---: | :---- |

| Hora | Actividad | Responsable | Entregable |
| :---- | :---- | :---- | :---- |
| 09:00–12:00 | TASK-020 parte 1: PostgresEventStore — append() con verificación de firma antes de persistir. | Tech Lead | append() rechaza un evento con firma inválida. |
| 12:00–13:00 | TASK-020 parte 2: getByAssetId(), replay() determinístico. | Tech Lead | 3 corridas de replay con 100 eventos → resultado idéntico. |
| 14:30–16:30 | TASK-020 parte 3: getDescendants() \+ getAncestors() usando índice GIN en parentIds\[\]. | Tech Lead | Query de linaje \< 50ms con 1000 assets en DB de test. |
| 16:30–17:30 | TASK-020 parte 4: hooks — beforeOperation() \+ afterOperation() para inyección de reglas del VerticalPack. | Tech Lead | El hook rechaza una operación de prueba cuando la regla lo indica. |
| 17:30–18:00 | PR\#020: packages/core/event-store. Tests de integración con DB local (Docker). | Tech Lead | CI verde. Trigger anti-tampering verificado en el test. |

| D05 | Viernes Semana 3 TASK-021 packages/core/rbac \+ packages/ui inicio |
| :---: | :---- |

| Hora | Actividad | Responsable | Entregable |
| :---- | :---- | :---- | :---- |
| 09:00–11:00 | TASK-021: Permission enum completo. RoleDefinition\[\]. can() deny-by-default. | Tech Lead | can() retorna false sin permiso explícito. Tests para todos los permissions. |
| 11:00–12:30 | TASK-022 inicio: packages/core/vertical-engine — VerticalPack interface. | Tech Lead | Interface definida con todos los campos. Compila sin errores. |
| 14:30–17:00 | TASK-022 (Frontend): packages/ui — Button, Input, Card, Badge, Spinner, Skeleton. | Frontend Dev | 6 componentes con Storybook stories en light \+ dark. |
| 17:00–18:00 | Retroactivo Semana 3 \+ PR\#021. | Ambos | Lista de pendientes para Semana 4\. |

| D06–D10 | Semana 4 · Días 6–10 Completar A.1 \+ Phase Gate A.1 |
| :---: | :---- |

| Día | Foco | Responsable | Entregable al final del día |
| :---- | :---- | :---- | :---- |
| D06 — Lunes | TASK-022: VerticalRegistry \+ DynamicFormRenderer (7 widgets: text, number, date, select, multiselect, file-upload, geo-polygon). | Tech Lead \+ Frontend Dev | DynamicFormRenderer renderiza un UISchema de prueba completo. |
| D07 — Martes | TASK-022 (Frontend): packages/ui — Modal, Toast/Sonner, EmptyState, Avatar. EventTimeline, SignatureBadge (✓/✗/⏳). | Frontend Dev | 10+ componentes con stories Storybook. EventTimeline renderiza eventos mock. |
| D08 — Miércoles | TASK-022 (Frontend): DAGVisualizer (árbol de parentIds navegable). SyncStatusBadge. ChainOfCustodyView. | Frontend Dev | DAGVisualizer muestra árbol de 3 niveles con nodos clicables. |
| D09 — Jueves | Integration tests: signEvent → verifyEvent → append → replay. El flujo completo del Core. | Tech Lead | Test end-to-end del Core: firma → verifica → persiste → replay → linaje. |
| D10 — Viernes | Phase Gate A.1: ejecutar el checklist completo. Fix de issues. PR del Phase Gate. | Ambos | Phase Gate A.1 con todos los ítems en ✅. |

| A.2 | Semanas 5–6 · Días 11–20 Vertical Engine · API · Workspace signup · Management Dashboard |
| :---: | :---- |

| D11–D15 | Semana 5 · Días 11–15 apps/api setup \+ auth router |
| :---: | :---- |

| Día | Foco | Responsable | Entregable al final del día |
| :---- | :---- | :---- | :---- |
| D11 — Lunes | TASK-024: apps/api — Fastify 5 setup. Plugins: cors, helmet, rate-limit. tRPC v11 createContext. Middleware de auth. /health endpoint. | Tech Lead | GET /health → 200 con status DB \+ Redis. Railway puede hacer health check. |
| D12 — Martes | TASK-025 parte 1: auth.register — crear Workspace \+ WorkspaceMember. Solo la clave PÚBLICA viaja al servidor. | Tech Lead | POST /trpc/auth.register con clave pública → crea Workspace \+ WorkspaceMember en DB. |
| D13 — Miércoles | TASK-025 parte 2: auth.login (JWT access \+ refresh). auth.logout (revocar en Redis). auth.refresh. | Tech Lead | Login → JWT válido. Logout → JWT revocado en Redis. Token revocado → 401\. |
| D14 — Jueves | TASK-026: workspaces, workspace-members, teams, employees routers. Con middleware RLS. | Tech Lead | GET /trpc/workspaces.getProfile devuelve el Workspace del usuario autenticado. |
| D15 — Viernes | TASK-026: facilities, zones, pens routers. Con polígonos PostGIS (ST\_IsValid). | Tech Lead | POST /trpc/facilities.create con polygon → ST\_IsValid \= true verificado. |

| D16–D20 | Semana 6 · Días 16–20 Wizard de registro \+ Management Dashboard \+ Phase Gate A.2 |
| :---: | :---- |

| Día | Foco | Responsable | Entregable al final del día |
| :---- | :---- | :---- | :---- |
| D16 — Lunes | TASK-027 parte 1: Wizard pasos 1–4 (datos de org, selector de vertical, rol, email). Flujo de estado con Zustand. | Frontend Dev | Pasos 1–4 funcionales con validación Zod en cada paso. |
| D17 — Martes | TASK-027 parte 2: Paso 5 — la pantalla del mnemonic. Ver reglas de seguridad de UI. | Frontend Dev | Pantalla oscura, full-screen, sin navegación, 24 palabras en grid 6×4, checkbox obligatorio. |
| D18 — Miércoles | TASK-027 parte 3: Paso 6 (confirmar 3 palabras), Paso 7 (primer Facility opcional), Paso 8 (Management Dashboard de bienvenida). | Frontend Dev | Flujo completo del signup de principio a fin funcional. |
| D19 — Jueves | TASK-027 parte 4: Management Dashboard — /members, /teams, /facilities con mapa Leaflet. Sidebar y topbar conectados al API. | Frontend Dev | Un usuario autenticado ve su Workspace con datos reales del API. |
| D20 — Viernes | Phase Gate A.2: E2E Playwright del flujo completo. Fix de issues. PR del Phase Gate. | Ambos | E2E: register (8 pasos) → login → Management Dashboard (Playwright, CI verde). |

| A.3 | Semanas 7–8 · Días 21–30 Blockchain · Workers · Observabilidad · Phase Gate A final |
| :---: | :---- |

| D21–D25 | Semana 7 · Días 21–25 Polygon Amoy \+ BullMQ workers \+ Sentry |
| :---: | :---- |

| Día | Foco | Responsable | Entregable al final del día |
| :---- | :---- | :---- | :---- |
| D21 — Lunes | TASK-028 parte 1: SimpleAnchor.sol — contrato mínimo en Solidity. Compilar con Hardhat. Deploy en Polygon Amoy. | Tech Lead | Contrato desplegado. Dirección del contrato guardada en Doppler. |
| D22 — Martes | TASK-028 parte 2: PolygonProvider — ethers.js v6. Método anchor(merkleRoot). | Tech Lead | anchor() envía una tx a Amoy y retorna el txHash. |
| D23 — Miércoles | TASK-028 parte 3: AnchorBatchJob (BullMQ). Toma eventos pendientes, construye Merkle, ancla, guarda txHash en anchors\_log. Idempotente por correlationId. | Tech Lead | Primer AnchorBatchJob corriendo. Primer txHash real en Amoy. |
| D24 — Jueves | TASK-029: Sentry setup en apps/api y apps/platform. Tags por workspaceId y verticalId. | Tech Lead | Un error de prueba en staging aparece en Sentry con los tags correctos. |
| D25 — Viernes | TASK-029: OpenTelemetry — instrumentar apps/api. Trazas con spanAttributes workspaceId y verticalId. | Tech Lead | Trazas visibles en Grafana Cloud (o Jaeger local en dev). |

| D26–D30 | Semana 8 · Días 26–30 Verificación cruzada \+ Phase Gate A final |
| :---: | :---- |

| Día | Foco | Responsable | Entregable al final del día |
| :---- | :---- | :---- | :---- |
| D26 — Lunes | TASK-030: apps/verify — BlockchainAnchorBadge conectado a un txHash real. SyncStatusBadge en apps/platform topbar. | Frontend Dev | verify.biffco.co muestra el BlockchainAnchorBadge de un asset de prueba. |
| D27 — Martes | Integration: flujo completo event → sign → append → verify signature → anchor → txHash verificable. | Ambos | El flujo completo funciona de punta a punta. |
| D28 — Miércoles | Coverage audit: pnpm coverage en packages/core → debe ser ≥ 80% en todos los sub-packages. | Tech Lead | Coverage report en el PR. Escribir tests faltantes si es necesario. |
| D29 — Jueves | Phase Gate A: ejecutar el checklist completo. Fix de issues críticos. | Ambos | Todos los ítems críticos del Phase Gate A en ✅. |
| D30 — Viernes | Sprint Review \+ Retrospectiva. Kickoff Fase B. | Ambos | Fase A cerrada formalmente. Fase B lista para arrancar. |

| TASK 018  packages/core/domain — tipos del dominio   ·  Owner: Tech Lead  ·  Est: 6h  ·  Deps: Fase 0 completa |
| :---- |

Este package define el lenguaje del sistema. Los tipos aquí son el "ubiquitous language" del Core. Cualquier developer que lea estos tipos entiende qué es un Asset, qué es un DomainEvent, qué es un WorkspaceMember — sin necesidad de documentación adicional.

|  | ⚠ ATENCIÓN  packages/core/domain NO importa nada de packages/db, nada de packages/verticals, y nada de packages/config. Es un package puro de tipos — cero dependencias externas (solo zod como tipo de validación). |
| :---- | :---- |

## **Estructura del package**

| `tree` | `packages/core/` `|-- src/` `|   |-- domain/` `|   |   |-- workspace.ts     <- WorkspaceMember, Team, Employee` `|   |   |-- asset.ts         <- Asset, AssetGroup, AssetStatus` `|   |   |-- event.ts         <- DomainEvent, EventType` `|   |   |-- location.ts      <- Facility, Zone, Pen (tipos, no DB)` `|   |   +-- index.ts         <- re-exports` `|   |-- crypto/              <- TASK-019` `|   |-- event-store/         <- TASK-020` `|   |-- rbac/                <- TASK-021` `|   +-- vertical-engine/     <- TASK-023` `+-- package.json` |
| :---: | :---- |

## **domain/workspace.ts**

| `ts` | `// packages/core/src/domain/workspace.ts` `import type { WorkspaceId, WorkspaceMemberId, TeamId, EmployeeId } from '@biffco/shared'` `// ─── WorkspaceMember ─────────────────────────────────────────────` `export type WorkspaceMemberStatus = "active" | "suspended" | "revoked"` `export interface WorkspaceMember {`   `readonly id: WorkspaceMemberId`   `readonly workspaceId: WorkspaceId`   `readonly personId: string         // FK a persons (tabla de auth, Fase A.2)`   `readonly publicKey: string        // Ed25519 public key hex`   `readonly roles: readonly string[] // Roles del VerticalPack activo`   `readonly status: WorkspaceMemberStatus`   `readonly invitedAt: Date`   `readonly acceptedAt: Date | null`   `readonly revokedAt: Date | null` `}` `// ─── Team ───────────────────────────────────────────────────────` `export interface Team {`   `readonly id: TeamId`   `readonly workspaceId: WorkspaceId`   `readonly name: string`   `readonly description: string | null`   `readonly memberIds: readonly WorkspaceMemberId[]` `}` `// ─── Employee ───────────────────────────────────────────────────` `// Persona de campo sin cuenta BIFFCO propia.` `// Sus operaciones las firma el WorkspaceMember supervisor.` `export interface Employee {`   `readonly id: EmployeeId`   `readonly workspaceId: WorkspaceId`   `readonly name: string`   `readonly role: string             // Descripción: "capataz", "peón", "chofer"`   `readonly dni: string | null`   `readonly supervisorId: WorkspaceMemberId`   `readonly memberId: WorkspaceMemberId | null // Si tiene cuenta BIFFCO propia`   `readonly isActive: boolean` `}` |
| :---: | :---- |

## **domain/asset.ts**

| `ts` | `// packages/core/src/domain/asset.ts` `import type { AssetId, AssetGroupId, WorkspaceMemberId, WorkspaceId, PenId } from '@biffco/shared'` `// ─── AssetStatus — máquina de estados universal ──────────────────` `export type AssetStatus =`   `| "active"       // Operativo. Disponible para cualquier operación.`   `| "in_transit"   // Bajo custodia de un carrier.`   `| "in_process"   // Siendo procesado/transformado.`   `| "locked"       // Hold activo — no puede transferirse ni procesarse.`   `| "quarantine"   // Cuarentena sanitaria o regulatoria.`   `| "closed"       // Terminó su ciclo. Irreversible.`   `| "recalled"     // Bajo recall activo.`   `| "stolen"       // Reportado como robado.`   `| "lost"         // Reportado como extraviado.` `// ─── Asset ──────────────────────────────────────────────────────` `export interface Asset {`   `readonly id: AssetId`   `readonly type: string              // Definido por el VerticalPack`   `readonly status: AssetStatus`   `readonly workspaceId: WorkspaceId`   `readonly verticalId: string`   `readonly ownerId: WorkspaceMemberId`   `readonly custodianId: WorkspaceMemberId | null`   `readonly payload: Readonly<Record<string, unknown>> // Validado por el VerticalPack`   `readonly parentIds: readonly AssetId[]    // Linaje — índice GIN en DB`   `readonly currentPenId: PenId | null        // Ubicación actual (metadato)`   `readonly currentGroupId: AssetGroupId | null`   `readonly externalId: string | null         // RFID, EID, número de lote`   `readonly createdAt: Date`   `readonly updatedAt: Date`   `readonly closedAt: Date | null` `}` `// ─── AssetGroup ─────────────────────────────────────────────────` `export type AssetGroupType = 'group' | 'split_output' | 'merge_output' | 'transform_output' | 'transfer' | 'export'` `export type AssetGroupStatus = 'forming' | 'active' | 'dissolved' | 'in_transit' | 'delivered'` `export interface AssetGroup {`   `readonly id: AssetGroupId`   `readonly workspaceId: WorkspaceId`   `readonly name: string`   `readonly type: AssetGroupType`   `readonly status: AssetGroupStatus`   `readonly metadata: Readonly<Record<string, unknown>>`   `readonly createdAt: Date`   `readonly dissolvedAt: Date | null` `}` |
| :---: | :---- |

## **domain/event.ts — el tipo central del sistema**

| `ts` | `// packages/core/src/domain/event.ts` `import type { EventId, AssetId, WorkspaceMemberId, WorkspaceId, EmployeeId } from '@biffco/shared'` `// ─── DomainEvent ─────────────────────────────────────────────────` `/**`  `* El tipo central del sistema.`  `* Inmutable post-creación — el trigger anti-tampering en la DB lo garantiza.`  `* La firma Ed25519 es sobre canonicalJson(payload + los campos clave).`  `*/` `export interface DomainEvent {`   `readonly id: EventId`   `readonly type: string              // Definido por el eventCatalog del VerticalPack`   `readonly schemaVersion: number     // Para migraciones de payload schema`   `// ─── Qué, quién, dónde ─────────────────────────────────────`   `readonly assetId: AssetId`   `readonly workspaceId: WorkspaceId`   `readonly actorId: WorkspaceMemberId`   `readonly employeeId: EmployeeId | null // Si lo ejecutó un Employee supervisado`   `// ─── Criptografía ───────────────────────────────────────────`   `readonly signature: string         // Ed25519 signature hex`   `readonly publicKey: string         // Ed25519 public key hex del WorkspaceMember`   `// ─── Timestamps ─────────────────────────────────────────────`   `readonly occurredAt: Date          // Cuándo ocurrió en el mundo real`   `readonly createdAt: Date           // Cuándo se persistió en la DB`   `// ─── Batch operations ───────────────────────────────────────`   `readonly correlationId: string | null // Agrupa N eventos de una acción batch`   `// ─── Payload del VerticalPack ────────────────────────────────`   `readonly payload: Readonly<Record<string, unknown>>` `}` `// ─── El payload que se firma ────────────────────────────────────` `// canonicalJson de este objeto es lo que se firma con Ed25519` `export interface SignableEventPayload {`   `readonly type: string`   `readonly schemaVersion: number`   `readonly assetId: string`   `readonly workspaceId: string`   `readonly actorId: string`   `readonly occurredAt: string        // ISO 8601`   `readonly payload: Record<string, unknown>` `}` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: pnpm \--filter @biffco/core typecheck → 0 errores. No hay ningún import de packages/db, packages/verticals ni packages/config en este package. |
| :---- | :---- |

| TASK 019  packages/core/crypto — Ed25519, SLIP-0010, BIP-39, Merkle   ·  Owner: Tech Lead  ·  Est: 8h  ·  Deps: TASK-018 |
| :---- |

El módulo más crítico de la Fase A. Cada función tiene un contrato matemático preciso. Los test vectors son obligatorios — no opcionales. Si los vectores pasan, la implementación es correcta.

|  | SLIP-0010 vs BIP-44: BIP-44 es el estándar de derivación de HD wallets para secp256k1 (Ethereum, Bitcoin). Ed25519 usa SLIP-0010. Mezclar los dos produce claves inseguras. Este es el error más común en implementaciones de wallets con Ed25519 — y es irreversible post-producción. |
| :---- | :---- |

## **Estructura del módulo crypto**

| `tree` | `packages/core/src/crypto/` `|-- ed25519.ts      <- signEvent, verifyEvent (libsodium)` `|-- slip0010.ts     <- deriveKey (SLIP-0010 para Ed25519)` `|-- bip39.ts        <- generateMnemonic — SOLO para uso en el browser` `|-- merkle.ts       <- MerkleTree, buildTree, getRoot, getProof` `|-- hash.ts         <- hashDocument (SHA-256)` `+-- index.ts        <- re-exports` |
| :---: | :---- |

## **crypto/ed25519.ts — firma y verificación**

| `ts` | `// packages/core/src/crypto/ed25519.ts` `import { ready, crypto_sign_detached, crypto_sign_verify_detached, from_hex, to_hex } from 'libsodium-wrappers'` `import { canonicalJson } from '@biffco/shared'` `import type { SignableEventPayload } from '../domain/event'` `// Asegurar que libsodium está inicializado antes de usarlo` `let _ready = false` `async function ensureReady(): Promise<void> {`   `if (_ready) return`   `await ready`   `_ready = true` `}` `/**`  `* Firma el payload de un evento con una clave privada Ed25519.`  `*`  `* Lo que se firma: canonicalJson(payload) — siempre el mismo string`  `* para el mismo payload, independientemente del orden de las keys.`  `*`  `* @returns signature en formato hex`  `*/` `export async function signEvent(`   `payload: SignableEventPayload,`   `privateKey: Uint8Array,` `): Promise<string> {`   `await ensureReady()`   `const message = new TextEncoder().encode(canonicalJson(payload))`   `const signature = crypto_sign_detached(message, privateKey)`   `return to_hex(signature)` `}` `/**`  `* Verifica la firma Ed25519 de un evento.`  `*`  `* @returns true si la firma es válida, false en cualquier otro caso`  `* NUNCA lanza una excepción — siempre retorna un boolean.`  `*/` `export async function verifyEvent(`   `payload: SignableEventPayload,`   `signatureHex: string,`   `publicKeyHex: string,` `): Promise<boolean> {`   `await ensureReady()`   `try {`     `const message = new TextEncoder().encode(canonicalJson(payload))`     `const signature = from_hex(signatureHex)`     `const publicKey = from_hex(publicKeyHex)`     `return crypto_sign_verify_detached(signature, message, publicKey)`   `} catch {`     `// Firma o clave malformada — tratar como inválida`     `return false`   `}` `}` |
| :---: | :---- |

## **Test vectors obligatorios — RFC 8037 Ed25519**

RFC 8037 define vectores de prueba oficiales para Ed25519. Si nuestro signEvent/verifyEvent no los reproduce, la implementación está mal.

| `ts` | `// packages/core/src/crypto/ed25519.test.ts` `import { describe, it, expect } from 'vitest'` `import { signEvent, verifyEvent } from './ed25519'` `import type { SignableEventPayload } from '../domain/event'` `// Vector de prueba básico` `const testPayload: SignableEventPayload = {`   `type: "ANIMAL_REGISTERED",`   `schemaVersion: 1,`   `assetId: "test-asset-001",`   `workspaceId: "test-workspace-001",`   `actorId: "test-actor-001",`   `occurredAt: "2024-01-15T10:00:00.000Z",`   `payload: { breed: "angus", sex: "male" }` `}` `describe("Ed25519 — signEvent + verifyEvent", () => {`   `it("firma y verifica correctamente", async () => {`     `// Generar un keypair de prueba con libsodium`     `const { ready, crypto_sign_keypair } = await import("libsodium-wrappers")`     `await ready`     `const keypair = crypto_sign_keypair()`     `const sig = await signEvent(testPayload, keypair.privateKey)`     `const valid = await verifyEvent(testPayload, sig, keypair.publicKeyHex)`     `expect(valid).toBe(true)`   `})`   `it("falla con payload modificado", async () => {`     `const { ready, crypto_sign_keypair } = await import("libsodium-wrappers")`     `await ready`     `const keypair = crypto_sign_keypair()`     `const sig = await signEvent(testPayload, keypair.privateKey)`     `const modified = { ...testPayload, type: "MODIFIED_TYPE" }`     `const valid = await verifyEvent(modified, sig, keypair.publicKeyHex)`     `expect(valid).toBe(false)  // El payload fue modificado → firma inválida`   `})`   `it("falla con clave pública incorrecta", async () => {`     `const { ready, crypto_sign_keypair } = await import("libsodium-wrappers")`     `await ready`     `const keypairA = crypto_sign_keypair()`     `const keypairB = crypto_sign_keypair()  // Keypair diferente`     `const sig = await signEvent(testPayload, keypairA.privateKey)`     `const valid = await verifyEvent(testPayload, sig, keypairB.publicKeyHex)`     `expect(valid).toBe(false)  // Clave incorrecta → firma inválida`   `})`   `it("canonicalJson garantiza firma determinista", async () => {`     `const { ready, crypto_sign_keypair } = await import("libsodium-wrappers")`     `await ready`     `const keypair = crypto_sign_keypair()`     `// Mismo payload, keys en distinto orden`     `const payloadA = { ...testPayload, payload: { sex: "male", breed: "angus" } }`     `const payloadB = { ...testPayload, payload: { breed: "angus", sex: "male" } }`     `const sigA = await signEvent(payloadA, keypair.privateKey)`     `const sigB = await signEvent(payloadB, keypair.privateKey)`     `expect(sigA).toBe(sigB)  // Mismo canonicalJson → misma firma`   `})` `})` |
| :---: | :---- |

## **crypto/slip0010.ts — derivación de claves SLIP-0010**

El path de derivación incluye el wsIdx (índice del Workspace) en el nivel 2\. Esto garantiza que el mismo mnemonic genera claves criptográficamente distintas para cada Workspace.

| `ts` | `// packages/core/src/crypto/slip0010.ts` `import { derivePath, getMasterKeyFromSeed } from 'ed25519-hd-key'` `import { mnemonicToSeedSync } from 'bip39'` `/**`  `* Path de derivación BIFFCO para Ed25519 (SLIP-0010):`  `* m/0'/wsIdx'/memberIdx'`  `*`  `* Nivel 0 (m): raíz derivada del mnemonic`  `* Nivel 1 (0'): namespace BIFFCO (hardened)`  `* Nivel 2 (wsIdx'): índice del Workspace (hardened)`  `* Nivel 3 (memberIdx'): índice del WorkspaceMember (hardened)`  `*`  `* "Hardened" (el apóstrofe) significa que la clave pública del nivel padre`  `* NO puede derivar las claves de los hijos. Esto es obligatorio para Ed25519.`  `*/` `export function buildDerivationPath(wsIdx: number, memberIdx: number): string {`   `` return `m/0'/${wsIdx}'/${memberIdx}'` `` `}` `/**`  `* Deriva un keypair Ed25519 desde un mnemonic BIP-39.`  `* El resultado es determinístico: mismo mnemonic + mismo path → mismo keypair.`  `*`  `* IMPORTANTE: Esta función toma el mnemonic como string.`  `* En el browser, el mnemonic viene de sessionStorage o del input del usuario.`  `* NUNCA se llama esta función en apps/api.`  `*/` `export function deriveKeyFromMnemonic(`   `mnemonic: string,`   `wsIdx: number,`   `memberIdx: number,` `): { privateKey: Uint8Array; publicKey: Uint8Array } {`   `const seed = mnemonicToSeedSync(mnemonic)`   `const path = buildDerivationPath(wsIdx, memberIdx)`   `const { key } = derivePath(path, seed.toString("hex"))`   `const masterKey = getMasterKeyFromSeed(seed.toString("hex"))`   `// Derivar el keypair completo desde la clave privada`   `const { key: privateKey, chainCode } = derivePath(path, seed.toString("hex"))`   `// Ed25519: la clave pública se deriva de la privada`   `const { getPublicKey } = require('ed25519-hd-key')`   `const publicKey = getPublicKey(privateKey)`   `return {`     `privateKey: new Uint8Array(Buffer.from(privateKey, "hex")),`     `publicKey: new Uint8Array(Buffer.from(publicKey, "hex")),`   `}` `}` `/**`  `* Versión que toma el seed directamente (para cuando ya se tiene el seed).`  `*/` `export function deriveKeyFromSeed(`   `seed: Buffer,`   `wsIdx: number,`   `memberIdx: number,` `): { privateKey: Uint8Array; publicKey: Uint8Array; publicKeyHex: string } {`   `const path = buildDerivationPath(wsIdx, memberIdx)`   `const { key } = derivePath(path, seed.toString("hex"))`   `const { getPublicKey } = require('ed25519-hd-key')`   `const publicKey = getPublicKey(key)`   `return {`     `privateKey: new Uint8Array(Buffer.from(key, "hex")),`     `publicKey: new Uint8Array(Buffer.from(publicKey, "hex")),`     `publicKeyHex: publicKey,`   `}` `}` |
| :---: | :---- |

## **Tests de derivación SLIP-0010 — vectores deterministas**

| `ts` | `// packages/core/src/crypto/slip0010.test.ts` `import { describe, it, expect } from 'vitest'` `import { deriveKeyFromMnemonic, buildDerivationPath } from './slip0010'` `// Mnemonic de prueba — NUNCA usar en producción` `const TEST_MNEMONIC = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"` `describe("SLIP-0010 derivación", () => {`   `it("misma semilla + mismo path → mismo keypair (determinista)", () => {`     `const kp1 = deriveKeyFromMnemonic(TEST_MNEMONIC, 1, 0)`     `const kp2 = deriveKeyFromMnemonic(TEST_MNEMONIC, 1, 0)`     `expect(Buffer.from(kp1.publicKey).toString("hex"))`       `.toBe(Buffer.from(kp2.publicKey).toString("hex"))`   `})`   `it("distintos wsIdx → claves matemáticamente distintas", () => {`     `const ws1 = deriveKeyFromMnemonic(TEST_MNEMONIC, 1, 0)`     `const ws2 = deriveKeyFromMnemonic(TEST_MNEMONIC, 2, 0)`     `expect(Buffer.from(ws1.publicKey).toString("hex"))`       `.not.toBe(Buffer.from(ws2.publicKey).toString("hex"))`   `})`   `it("distintos memberIdx → claves distintas (miembros distintos del mismo WS)", () => {`     `const m0 = deriveKeyFromMnemonic(TEST_MNEMONIC, 1, 0)`     `const m1 = deriveKeyFromMnemonic(TEST_MNEMONIC, 1, 1)`     `expect(Buffer.from(m0.publicKey).toString("hex"))`       `.not.toBe(Buffer.from(m1.publicKey).toString("hex"))`   `})`   `it("path de derivación tiene el formato correcto", () => {`     `expect(buildDerivationPath(1, 0)).toBe("m/0'/1'/0'")`     `expect(buildDerivationPath(5, 3)).toBe("m/0'/5'/3'")`   `})` `})` |
| :---: | :---- |

## **crypto/bip39.ts — mnemonic (SOLO para el browser)**

| `ts` | `// packages/core/src/crypto/bip39.ts` `import { generateMnemonic as _generateMnemonic, validateMnemonic, mnemonicToSeedSync } from 'bip39'` `/**`  `* Genera un mnemonic BIP-39 de 24 palabras.`  `*`  `* SEGURIDAD: Esta función SOLO se llama en el browser durante el signup.`  `* NUNCA se llama en apps/api ni en ningún servidor.`  `* NUNCA se almacena el mnemonic en la DB ni en ningún log.`  `*`  `* El mnemonic se muestra UNA SOLA VEZ al usuario.`  `* Después de que el usuario confirma las 3 palabras, el mnemonic`  `* se elimina de la memoria del browser.`  `*/` `export function generateMnemonic(): string {`   `// 256 bits de entropía = 24 palabras`   `return _generateMnemonic(256)` `}` `/**`  `* Valida que un mnemonic tiene el formato correcto.`  `*/` `export function isValidMnemonic(mnemonic: string): boolean {`   `return validateMnemonic(mnemonic)` `}` `/**`  `* Convierte un mnemonic a seed para SLIP-0010.`  `* Usado internamente por deriveKeyFromMnemonic en slip0010.ts.`  `*/` `export function mnemonicToSeed(mnemonic: string): Buffer {`   `return mnemonicToSeedSync(mnemonic)` `}` `// ─── REGLAS DE SEGURIDAD PARA EL WIZARD DE SIGNUP (ver TASK-027) ─` `// 1. La pantalla del mnemonic es full-screen, fondo oscuro, sin navegación.` `// 2. El mnemonic se muestra en un grid 6x4 (24 palabras).` `// 3. El botón "Continuar" está deshabilitado hasta que el checkbox` `//    "Guardé mis 24 palabras en un lugar seguro" esté marcado.` `// 4. El Paso 6 pide confirmar 3 palabras aleatorias de la lista.` `//    Si el usuario no las confirma correctamente, no puede avanzar.` `// 5. El mnemonic se elimina del estado de React al montar el Paso 6.` `//    En el Paso 6 solo existen las 3 palabras de verificación — no el mnemonic completo.` |
| :---: | :---- |

## **crypto/merkle.ts — árbol de Merkle para anclajes en Polygon**

| `ts` | `// packages/core/src/crypto/merkle.ts` `import { createHash } from 'crypto'` `/**`  `* Árbol de Merkle con SHA-256.`  `* Se usa para calcular la raíz de un batch de eventos antes de anclarlos en Polygon.`  `* La raíz del árbol es lo que se publica en el smart contract.`  `* Cada evento puede ser verificado contra la raíz sin necesidad de todos los demás.`  `*/` `export class MerkleTree {`   `private readonly leaves: string[]`   `private readonly tree: string[][]`   `constructor(leaves: string[]) {`     `if (leaves.length === 0) throw new Error("MerkleTree: al menos 1 hoja requerida")`     `this.leaves = leaves.map(l => this.hash(l))`     `this.tree = this.buildTree(this.leaves)`   `}`   `/** SHA-256 de un string, retorna hex */`   `private hash(data: string): string {`     `return createHash("sha256").update(data).digest("hex")`   `}`   `private buildTree(leaves: string[]): string[][] {`     `if (leaves.length === 1) return [leaves]`     `const levels: string[][] = [leaves]`     `let current = leaves`     `while (current.length > 1) {`       `const next: string[] = []`       `for (let i = 0; i < current.length; i += 2) {`         `const left = current[i] ?? ""`         `const right = current[i + 1] ?? current[i] ?? "" // Duplicar si número impar`         `next.push(this.hash(left + right))`       `}`       `levels.push(next)`       `current = next`     `}`     `return levels`   `}`   `/** La raíz del árbol — lo que se ancla en Polygon */`   `getRoot(): string {`     `const lastLevel = this.tree[this.tree.length - 1]`     `if (!lastLevel || !lastLevel[0]) throw new Error("MerkleTree: árbol vacío")`     `return lastLevel[0]`   `}`   `/** Prueba de que una hoja pertenece al árbol */`   `getProof(leafIndex: number): string[] {`     `const proof: string[] = []`     `let index = leafIndex`     `for (let level = 0; level < this.tree.length - 1; level++) {`       `const currentLevel = this.tree[level]!`       `const isRight = index % 2 === 1`       `const siblingIndex = isRight ? index - 1 : index + 1`       `if (siblingIndex < currentLevel.length) {`         `proof.push(currentLevel[siblingIndex]!)`       `}`       `index = Math.floor(index / 2)`     `}`     `return proof`   `}` `}` `/** Helper: hash SHA-256 de un Buffer (para evidencias S3) */` `export function hashDocument(buffer: Buffer): string {`   `return createHash("sha256").update(buffer).digest("hex")` `}` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: pnpm \--filter @biffco/core test → todos los tests pasan. coverage en packages/core/src/crypto ≥ 90%. |
| :---- | :---- |

| TASK 020  packages/core/event-store — PostgresEventStore   ·  Owner: Tech Lead  ·  Est: 6h  ·  Deps: TASK-018, TASK-019, Fase 0 |
| :---- |

El Event Store es el registro irrefutable del sistema. append() verifica la firma antes de persistir. Si la firma no es válida, el evento no existe. Ningún evento existente puede ser modificado. El replay es determinístico — 3 ejecuciones con los mismos datos producen el mismo resultado.

## **event-store/postgres-event-store.ts**

| `ts` | `// packages/core/src/event-store/postgres-event-store.ts` `import type { AssetId, EventId, WorkspaceId } from '@biffco/shared'` `import type { DomainEvent, SignableEventPayload } from '../domain/event'` `import { verifyEvent } from '../crypto/ed25519'` `import type { Result } from '@biffco/shared'` `import { ok, err } from '@biffco/shared'` `export type EventStoreError =`   `| "INVALID_SIGNATURE"`   `| "ASSET_NOT_FOUND"`   `| "DB_ERROR"`   `| "EVENT_NOT_FOUND"` `// ─── El tipo de la DB (inyectado — no importamos @biffco/db aquí) ─` `// El Core no puede importar packages/db directamente.` `// La DB se inyecta via constructor.` `export interface EventStoreDb {`   `insertEvent(event: DomainEvent): Promise<void>`   `getEventsByAssetId(assetId: AssetId, workspaceId: WorkspaceId): Promise<DomainEvent[]>`   `getAllEventsByWorkspace(workspaceId: WorkspaceId): Promise<DomainEvent[]>`   `getAssetById(assetId: AssetId, workspaceId: WorkspaceId): Promise<{ parentIds: AssetId[] } | null>` `}` `export class PostgresEventStore {`   `constructor(private readonly db: EventStoreDb) {}`   `/**`    `* Persiste un evento si y solo si la firma es válida.`    `* NUNCA persiste un evento con firma inválida.`    `*`    `* @returns ok(void) si el evento fue persistido`    `* @returns err("INVALID_SIGNATURE") si la firma es inválida`    `*/`   `async append(event: DomainEvent): Promise<Result<void, EventStoreError>> {`     `// 1. Reconstruir el payload firmable desde el evento`     `const signable: SignableEventPayload = {`       `type: event.type,`       `schemaVersion: event.schemaVersion,`       `assetId: event.assetId as string,`       `workspaceId: event.workspaceId as string,`       `actorId: event.actorId as string,`       `occurredAt: event.occurredAt.toISOString(),`       `payload: event.payload as Record<string, unknown>,`     `}`     `// 2. Verificar la firma`     `const isValid = await verifyEvent(signable, event.signature, event.publicKey)`     `if (!isValid) {`       `return err("INVALID_SIGNATURE")`     `}`     `// 3. Persistir`     `try {`       `await this.db.insertEvent(event)`       `return ok(undefined)`     `} catch (e) {`       `return err("DB_ERROR")`     `}`   `}`   `/**`    `* Todos los eventos de un asset, en orden cronológico.`    `*/`   `async getByAssetId(`     `assetId: AssetId,`     `workspaceId: WorkspaceId,`   `): Promise<DomainEvent[]> {`     `return this.db.getEventsByAssetId(assetId, workspaceId)`   `}`   `/**`    `* Replay del Event Store completo de un Workspace.`    `* Determinístico: 3 ejecuciones con los mismos datos = mismo resultado.`    `* El orden es: occurredAt ASC, luego createdAt ASC (para desempate).`    `*/`   `async replay(workspaceId: WorkspaceId): Promise<DomainEvent[]> {`     `const events = await this.db.getAllEventsByWorkspace(workspaceId)`     `// Ordenar por occurredAt, luego por createdAt para desempate`     `return [...events].sort((a, b) => {`       `const diff = a.occurredAt.getTime() - b.occurredAt.getTime()`       `if (diff !== 0) return diff`       `return a.createdAt.getTime() - b.createdAt.getTime()`     `})`   `}`   `/**`    `* Todos los assets que tienen este asset en sus parentIds.`    `* Usa el índice GIN en la columna parentIds[] para < 200ms con 10k assets.`    `*/`   `async getDescendants(assetId: AssetId, workspaceId: WorkspaceId): Promise<string[]> {`     `// Esta query se implementa en packages/db con el índice GIN`     `// El Core define la interface; la implementación vive en la capa de DB`     `throw new Error("Implementar con índice GIN en packages/db")`   `}`   `/**`    `* Reconstruye el árbol de ancestros del asset desde sus parentIds.`    `*/`   `async getAncestors(assetId: AssetId, workspaceId: WorkspaceId): Promise<AssetId[]> {`     `const asset = await this.db.getAssetById(assetId, workspaceId)`     `if (!asset) return []`     `const ancestors: AssetId[] = []`     `for (const parentId of asset.parentIds) {`       `ancestors.push(parentId)`       `const parentAncestors = await this.getAncestors(parentId, workspaceId)`       `ancestors.push(...parentAncestors)`     `}`     `return ancestors`   `}` `}` |
| :---: | :---- |

## **Test de integración — append \+ replay**

| `ts` | `// packages/core/src/event-store/event-store.test.ts` `// Este test requiere una DB de test (Docker local o Neon dev)` `import { describe, it, expect, beforeAll } from 'vitest'` `import { PostgresEventStore } from './postgres-event-store'` `import { signEvent } from '../crypto/ed25519'` `import type { DomainEvent } from '../domain/event'` `// ... setup de la DB de test ...` `describe("PostgresEventStore", () => {`   `it("append rechaza evento con firma inválida", async () => {`     `const store = new PostgresEventStore(testDb)`     `const fakeEvent: DomainEvent = {`       `...validEventFixture,`       `signature: "firma-invalida-hex"`     `}`     `const result = await store.append(fakeEvent)`     `expect(result.ok).toBe(false)`     `expect(result.ok ? "" : result.error).toBe("INVALID_SIGNATURE")`   `})`   `it("replay es determinístico: 3 ejecuciones = mismo resultado", async () => {`     `const store = new PostgresEventStore(testDb)`     `// Insertar 100 eventos`     `for (const event of fixtures.events100) {`       `await store.append(event)`     `}`     `const r1 = await store.replay("ws-test")`     `const r2 = await store.replay("ws-test")`     `const r3 = await store.replay("ws-test")`     `expect(r1.map(e => e.id)).toEqual(r2.map(e => e.id))`     `expect(r2.map(e => e.id)).toEqual(r3.map(e => e.id))`   `})`   `it("trigger anti-tampering: UPDATE domain_events → ERROR", async () => {`     `const rawDb = testDb.raw // Acceso directo para este test`     `await expect(`       `rawDb.execute("UPDATE domain_events SET type = 'hacked' WHERE FALSE")`     `).rejects.toThrow("domain_events es inmutable")`   `})` `})` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: pnpm \--filter @biffco/core test → todos los tests pasan, incluyendo el test del trigger anti-tampering. El replay de 1000 eventos en la DB de test toma \< 500ms. |
| :---- | :---- |

| TASK 021  packages/core/rbac — Permission enum \+ can() deny-by-default   ·  Owner: Tech Lead  ·  Est: 4h  ·  Deps: TASK-018 |
| :---- |

El RBAC (Role-Based Access Control) es la tercera línea de defensa después de RLS en la DB y del JWT. can() siempre retorna false si no hay un permiso explícito — no hay "probablemente permitido".

## **rbac/permissions.ts — el enum completo**

| `ts` | `// packages/core/src/rbac/permissions.ts` `/**`  `* Todos los permisos del sistema.`  `* Los roles del VerticalPack son arrays de estos permisos.`  `* Deny-by-default: sin permiso explícito → Deny.`  `*/` `export const Permission = {`   `// ─── Assets ────────────────────────────────────────────────`   `ASSETS_CREATE:     "assets.create",`   `ASSETS_READ:       "assets.read",`   `ASSETS_UPDATE:     "assets.update",`   `ASSETS_SPLIT:      "assets.split",`   `ASSETS_MERGE:      "assets.merge",`   `ASSETS_TRANSFORM:  "assets.transform",`   `// ─── Events ────────────────────────────────────────────────`   `EVENTS_APPEND:     "events.append",`   `EVENTS_READ:       "events.read",`   `// ─── Transfers ─────────────────────────────────────────────`   `TRANSFERS_INITIATE:  "transfers.initiate",`   `TRANSFERS_ACCEPT:    "transfers.accept",`   `TRANSFERS_REJECT:    "transfers.reject",`   `// ─── Holds ─────────────────────────────────────────────────`   `HOLDS_IMPOSE:      "holds.impose",`   `HOLDS_LIFT:        "holds.lift",`   `// ─── Locations ─────────────────────────────────────────────`   `FACILITIES_MANAGE: "facilities.manage",`   `ZONES_MANAGE:      "zones.manage",`   `PENS_MANAGE:       "pens.manage",`   `// ─── Workspace management ──────────────────────────────────`   `ORG_MANAGE:        "org.manage",`   `MEMBERS_INVITE:    "members.invite",`   `MEMBERS_REVOKE:    "members.revoke",`   `EMPLOYEES_MANAGE:  "employees.manage",`   `// ─── Billing & Settings ────────────────────────────────────`   `BILLING_MANAGE:    "billing.manage",`   `SETTINGS_MANAGE:   "settings.manage",`   `// ─── Certifications ────────────────────────────────────────`   `CERTIFICATIONS_LINK: "certifications.link",`   `// ─── Analytics & Reports ────────────────────────────────────`   `ANALYTICS_VIEW:    "analytics.view",`   `REPORTS_GENERATE:  "reports.generate",`   `// ─── Audit ─────────────────────────────────────────────────`   `AUDIT_READ:        "audit.read",` `} as const` `export type Permission = typeof Permission[keyof typeof Permission]` |
| :---: | :---- |

## **rbac/can.ts — la función central**

| `ts` | `// packages/core/src/rbac/can.ts` `import type { Permission } from './permissions'` `/**`  `* Verifica si un actor tiene un permiso específico.`  `*`  `* DENY BY DEFAULT: si no hay un permiso explícito → false.`  `* No hay "casi permitido", "probablemente permitido" ni excepciones.`  `*`  `* Los roles del WorkspaceMember son arrays de Permission strings,`  `* definidos por el VerticalPack activo del Workspace.`  `*/` `export function can(`   `actorPermissions: readonly string[],`   `permission: Permission,` `): boolean {`   `return actorPermissions.includes(permission)` `}` `/**`  `* Verifica si un actor tiene TODOS los permisos de la lista.`  `*/` `export function canAll(`   `actorPermissions: readonly string[],`   `permissions: readonly Permission[],` `): boolean {`   `return permissions.every(p => can(actorPermissions, p))` `}` `/**`  `* Verifica si un actor tiene AL MENOS UNO de los permisos.`  `*/` `export function canAny(`   `actorPermissions: readonly string[],`   `permissions: readonly Permission[],` `): boolean {`   `return permissions.some(p => can(actorPermissions, p))` `}` `/**`  `* Usado en el middleware de tRPC para proteger rutas.`  `* Lanza un error tRPC UNAUTHORIZED si el permiso no está presente.`  `*/` `export function assertCan(`   `actorPermissions: readonly string[],`   `permission: Permission,`   `message?: string,` `): void {`   `if (!can(actorPermissions, permission)) {`     ``throw new Error(message ?? `Permission denied: ${permission}`)``   `}` `}` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: test de can() con actor sin roles → false para cualquier permission. Test: actor con \[ASSETS\_READ\] → can(ASSETS\_READ) \= true, can(ASSETS\_CREATE) \= false. |
| :---- | :---- |

# **10\. Phase Gate A.1 — Criterios de cierre del Sprint A.1**

|  | *Phase Gate A.1 es un gate intermedio — bloquea el inicio del Sprint A.2. Si packages/core no está correcto, construir la API sobre él es construir sobre arena.* |
| :---- | :---- |

| ID | Criterio | Cómo verificarlo | Prioridad |
| :---- | :---- | :---- | :---- |
| GA1-01 | packages/core/domain: todos los tipos compilan sin errores | pnpm \--filter @biffco/core typecheck → 0 errores | 🔴 CRÍTICO |
| GA1-02 | Ed25519: signEvent \+ verifyEvent funcionan | pnpm \--filter @biffco/core test \-- crypto/ed25519 → PASS | 🔴 CRÍTICO |
| GA1-03 | Ed25519: firma inválida → verifyEvent retorna false (no lanza excepción) | Test: verifyEvent con payload modificado → false | 🔴 CRÍTICO |
| GA1-04 | Ed25519: canonicalJson garantiza firma determinista | Test: mismo payload con keys en distinto orden → misma firma | 🔴 CRÍTICO |
| GA1-05 | SLIP-0010: derivación determinista | mismo mnemonic \+ mismo path → mismo keypair en 3 ejecuciones | 🔴 CRÍTICO |
| GA1-06 | SLIP-0010: wsIdx distintos → claves distintas | wsIdx=1 y wsIdx=2 → claves matemáticamente distintas | 🔴 CRÍTICO |
| GA1-07 | BIP-39: generateMnemonic genera 24 palabras válidas | validateMnemonic(generateMnemonic()) → true | 🔴 CRÍTICO |
| GA1-08 | Event Store: append rechaza firma inválida | append con signature="invalid" → err("INVALID\_SIGNATURE") | 🔴 CRÍTICO |
| GA1-09 | Event Store: replay determinístico | 3 corridas con 100 eventos → ids en mismo orden | 🔴 CRÍTICO |
| GA1-10 | Trigger anti-tampering: UPDATE domain\_events → EXCEPTION | Test directo contra la DB → excepción con el mensaje del trigger | 🔴 CRÍTICO |
| GA1-11 | RBAC: can() deny-by-default | actor sin roles → can() \= false para cualquier Permission | 🔴 CRÍTICO |
| GA1-12 | Invariante ESLint: packages/core no importa packages/verticals | grep \-r "@biffco/livestock\\|@biffco/mining" packages/core/ → 0 resultados | 🔴 CRÍTICO |
| GA1-13 | Coverage ≥ 80% en packages/core | pnpm \--filter @biffco/core coverage → global ≥ 80% | 🔴 CRÍTICO |
| GA1-14 | packages/ui: 10+ componentes con Storybook stories | pnpm \--filter @biffco/ui storybook → stories cargando | 🟡 RECOMENDADO |
| GA1-15 | DynamicFormRenderer renderiza UISchema de prueba con 7 widgets | Test manual en Storybook con UISchema de prueba | 🟡 RECOMENDADO |

| TASK 023  packages/core/vertical-engine — VerticalPack \+ DynamicFormRenderer   ·  Owner: Tech Lead  ·  Est: 6h  ·  Deps: TASK-018, TASK-021 |
| :---- |

El Vertical Engine es el mecanismo que hace posible agregar nuevas industrias sin tocar el Core. La interface VerticalPack es el contrato. VerticalRegistry lo gestiona. DynamicFormRenderer convierte cualquier UISchema en un formulario funcional.

## **vertical-engine/types.ts — la interface VerticalPack completa**

| `ts` | `// packages/core/src/vertical-engine/types.ts` `import type { z } from 'zod'` `import type { Permission } from '../rbac/permissions'` `// ─── UISchema — define cómo renderizar un formulario ────────────` `export type UIFieldType =`   `| "text"        // Input de texto`   `| "number"      // Input numérico`   `| "date"        // DatePicker`   `| "select"      // Dropdown con opciones fijas`   `| "multiselect" // Dropdown con selección múltiple`   `| "file-upload" // Upload de archivo con SHA-256`   `| "geo-polygon" // Editor de polígono Leaflet`   `| "textarea"    // Texto largo`   `| "toggle"      // Switch on/off` `export interface UIField {`   `readonly key: string`   `readonly label: string`   `readonly type: UIFieldType`   `readonly required: boolean`   `readonly options?: readonly string[]  // Para select y multiselect`   `readonly placeholder?: string`   `readonly helpText?: string`   `readonly validation?: {`     `readonly min?: number`     `readonly max?: number`     `readonly pattern?: string`   `}` `}` `export type UISchema = readonly UIField[]` `// ─── Definiciones del VerticalPack ──────────────────────────────` `export interface ActorTypeDefinition {`   `readonly id: string`   `readonly name: string`   `readonly permissions: readonly Permission[]` `}` `export interface AssetTypeDefinition {`   `readonly id: string`   `readonly name: string`   `readonly schema: z.ZodSchema`   `readonly geoRequired: boolean`   `readonly validStatusTransitions: Readonly<Record<string, readonly string[]>>` `}` `export interface EventDefinition {`   `readonly type: string`   `readonly schemaVersion: number`   `readonly payloadSchema: z.ZodSchema`   `readonly uiSchema: UISchema`   `readonly allowedRoles: readonly string[]`   `readonly createsHold?: boolean`   `readonly liftableHolds?: readonly string[]` `}` `export interface TransformRule {`   `readonly inputTypes: readonly string[]    // Tipos de asset input`   `readonly outputTypes: readonly string[]   // Tipos de asset output`   `readonly requiredPermission: Permission`   `readonly validations: readonly string[]   // Keys de validaciones del VerticalPack` `}` `export interface SplitRule {`   `readonly inputType: string`   `readonly outputType: string               // Mismo tipo en la mayoría de los casos`   `readonly quantitativeField?: string       // Campo para validar invariante de peso/volumen` `}` `export interface MergeRule {`   `readonly inputTypes: readonly string[]`   `readonly outputType: string`   `readonly worstCaseFields: readonly string[] // Campos que heredan el peor valor` `}` `export type ProjectionFn = (events: readonly unknown[]) => Record<string, unknown>` `// ─── LA INTERFACE COMPLETA ──────────────────────────────────────` `export interface VerticalPack {`   `readonly id: string`   `readonly name: string`   `readonly version: string`   `// Vocabulario — el Core usa estos labels en la UI`   `readonly facilityLabel: string       // "Establecimiento" | "Mina" | "Planta"`   `readonly zoneLabel: string           // "Lote" | "Sector" | "Área"`   `readonly penLabel: string            // "Corral" | "Tolva" | "Línea"`   `readonly assetLabel: string          // "Animal" | "Mineral" | "Batch"`   `readonly groupLabel: string          // "Tropa" | "Bulk" | "Lote"`   `// Tipos de ubicación válidos para este vertical`   `readonly facilityTypes: readonly string[]`   `readonly zoneTypes: readonly string[]`   `readonly penTypes: readonly string[]`   `// Dominio`   `readonly actorTypes: readonly ActorTypeDefinition[]`   `readonly assetTypes: readonly AssetTypeDefinition[]`   `readonly eventCatalog: readonly EventDefinition[]`   `// Operaciones sobre assets`   `readonly transformRules: readonly TransformRule[]`   `readonly splitRules: readonly SplitRule[]`   `readonly mergeRules: readonly MergeRule[]`   `// UI — DynamicFormRenderer usa estos schemas`   `readonly uiSchemas: Readonly<Record<string, UISchema>>`   `// Compliance y geografía`   `readonly geoRequirements: boolean`   `readonly complianceFrameworks: readonly string[]`   `// Analytics`   `readonly projections: readonly ProjectionFn[]` `}` |
| :---: | :---- |

## **vertical-engine/registry.ts — VerticalRegistry**

| `ts` | `// packages/core/src/vertical-engine/registry.ts` `import type { VerticalPack } from './types'` `class VerticalRegistryImpl {`   `private readonly packs = new Map<string, VerticalPack>()`   `/**`    `* Registra un VerticalPack.`    `* Se llama una sola vez al iniciar apps/api.`    `*/`   `loadPack(pack: VerticalPack): void {`     `if (this.packs.has(pack.id)) {`       ``throw new Error(`VerticalRegistry: ya existe el pack "${pack.id}". ¿Lo registraste dos veces?`)``     `}`     `this.packs.set(pack.id, pack)`     ``console.info(`[VerticalRegistry] Pack "${pack.id}" v${pack.version} registrado.`)``   `}`   `/**`    `* Retorna el VerticalPack activo para un verticalId.`    `* Lanza un error si el verticalId no está registrado.`    `*/`   `getActivePack(verticalId: string): VerticalPack {`     `const pack = this.packs.get(verticalId)`     `if (!pack) {`       `throw new Error(`         `` `VerticalRegistry: vertical "${verticalId}" no está registrado. ` + ``         `` `Registrados: [${Array.from(this.packs.keys()).join(", ")}]` ``       `)`     `}`     `return pack`   `}`   `/**`    `* Lista todos los VerticalPacks registrados.`    `* Usado en el wizard de registro para el selector de vertical.`    `*/`   `listPacks(): VerticalPack[] {`     `return Array.from(this.packs.values())`   `}`   `getEventSchema(verticalId: string, eventType: string) {`     `const pack = this.getActivePack(verticalId)`     `const eventDef = pack.eventCatalog.find(e => e.type === eventType)`     ``if (!eventDef) throw new Error(`Evento "${eventType}" no existe en el vertical "${verticalId}"`)``     `return eventDef`   `}`   `isGeoRequired(verticalId: string): boolean {`     `return this.getActivePack(verticalId).geoRequirements`   `}` `}` `// Singleton — hay una sola instancia del registry en la app` `export const VerticalRegistry = new VerticalRegistryImpl()` |
| :---: | :---- |

## **DynamicFormRenderer — el renderizador universal de formularios**

DynamicFormRenderer es el componente de UI más importante del sistema. Convierte cualquier UISchema de cualquier VerticalPack en un formulario React funcional con validación. Sin este componente, cada tipo de evento necesitaría su propio componente de formulario.

| `ts` | `// packages/ui/src/components/DynamicFormRenderer.tsx` `// Este componente vive en packages/ui, no en packages/core.` `// packages/core define el tipo UISchema — packages/ui lo renderiza.` `import React from 'react'` `import { useForm } from 'react-hook-form'` `import { zodResolver } from '@hookform/resolvers/zod'` `import { z } from 'zod'` `import type { UISchema, UIField } from '@biffco/core/vertical-engine'` `interface Props {`   `schema: UISchema`   `onSubmit: (data: Record<string, unknown>) => Promise<void>`   `submitLabel?: string`   `isLoading?: boolean` `}` `// ─── Construir el schema Zod dinámicamente desde el UISchema ────` `function buildZodSchema(schema: UISchema): z.ZodObject<z.ZodRawShape> {`   `const shape: z.ZodRawShape = {}`   `for (const field of schema) {`     `let fieldSchema: z.ZodTypeAny`     `switch (field.type) {`       `case "number":`         `fieldSchema = z.number()`         `if (field.validation?.min !== undefined) fieldSchema = (fieldSchema as z.ZodNumber).min(field.validation.min)`         `if (field.validation?.max !== undefined) fieldSchema = (fieldSchema as z.ZodNumber).max(field.validation.max)`         `break`       `case "date":`         `fieldSchema = z.string().datetime()`         `break`       `case "select":`         `fieldSchema = field.options ? z.enum(field.options as [string, ...string[]]) : z.string()`         `break`       `case "multiselect":`         `fieldSchema = z.array(z.string())`         `break`       `case "toggle":`         `fieldSchema = z.boolean()`         `break`       `case "geo-polygon":`         `fieldSchema = z.object({ type: z.literal("Polygon"), coordinates: z.array(z.array(z.array(z.number()))) })`         `break`       `case "file-upload":`         `fieldSchema = z.object({ hash: z.string(), s3Key: z.string(), mimeType: z.string(), sizeBytes: z.number() })`         `break`       `default:`         `fieldSchema = z.string()`         `if (field.validation?.pattern) fieldSchema = (fieldSchema as z.ZodString).regex(new RegExp(field.validation.pattern))`     `}`     `shape[field.key] = field.required ? fieldSchema : fieldSchema.optional()`   `}`   `return z.object(shape)` `}` `export function DynamicFormRenderer({ schema, onSubmit, submitLabel = "Guardar", isLoading }: Props) {`   `const zodSchema = React.useMemo(() => buildZodSchema(schema), [schema])`   `const form = useForm({ resolver: zodResolver(zodSchema) })`   `return (`     `<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">`       `{schema.map(field => (`         `<FormField key={field.key} field={field} form={form} />`       `))}`       `<button type="submit" disabled={isLoading}>`         `{isLoading ? "Guardando..." : submitLabel}`       `</button>`     `</form>`   `)` `}` `// FormField renderiza el widget correcto según field.type` `function FormField({ field, form }: { field: UIField; form: ReturnType<typeof useForm> }) {`   `// ... implementación de cada widget ...`   `// text → <Input />, number → <Input type="number" />, date → <DatePicker />`   `// select → <Select />, multiselect → <MultiSelect />, file-upload → <EvidenceUploader />`   `// geo-polygon → <PolygonEditor /> (Leaflet), toggle → <Switch />, textarea → <Textarea />` `}` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: crear un UISchema de prueba con los 7 tipos de widget y verificar que DynamicFormRenderer los renderiza todos sin errores. Test en Storybook con el story "DynamicFormRenderer/AllWidgets". |
| :---- | :---- |

| TASK 024  apps/api — Fastify 5 \+ tRPC v11 setup   ·  Owner: Tech Lead  ·  Est: 4h  ·  Deps: TASK-023 |
| :---- |

apps/api es el backend de toda la plataforma. Todos los clients (apps/platform, apps/verify, CLI) se comunican con él via tRPC. Fastify 5 es el servidor HTTP. tRPC v11 provee type-safety end-to-end.

## **Estructura de apps/api**

| `tree` | `apps/api/src/` `|-- index.ts              <- Entry point. Inicializa Fastify + tRPC + plugins.` `|-- trpc.ts               <- createContext, middleware de auth, router raíz.` `|-- routers/` `|   |-- auth.ts           <- register, login, logout, refresh (TASK-025)` `|   |-- workspaces.ts     <- getProfile, updateProfile (TASK-026)` `|   |-- workspace-members.ts <- invite, accept, revoke (TASK-026)` `|   |-- teams.ts          <- create, list, update (TASK-026)` `|   |-- employees.ts      <- create, list, update (TASK-026)` `|   |-- facilities.ts     <- create, list, getById, update (TASK-026)` `|   |-- zones.ts          <- create, list, getById (TASK-026)` `|   |-- pens.ts           <- create, list, updateOccupancy (TASK-026)` `|   +-- index.ts          <- combina todos los routers en el appRouter` `|-- middleware/` `|   |-- auth.ts           <- verifica JWT + setea el contexto (workspaceId, actorId)` `|   +-- rls.ts            <- SET app.current_workspace en cada query` `|-- workers/` `|   +-- anchor.ts         <- AnchorBatchJob (TASK-028)` `+-- health.ts             <- GET /health` |
| :---: | :---- |

## **src/trpc.ts — el contexto y el middleware de auth**

| `ts` | `// apps/api/src/trpc.ts` `import { initTRPC, TRPCError } from '@trpc/server'` `import type { FastifyRequest } from 'fastify'` `import { db } from '@biffco/db'` `import { VerticalRegistry } from '@biffco/core/vertical-engine'` `import type { WorkspaceId, WorkspaceMemberId } from '@biffco/shared'` `export interface TRPCContext {`   `readonly workspaceId: WorkspaceId | null`   `readonly memberId: WorkspaceMemberId | null`   `readonly memberPermissions: readonly string[]`   `readonly db: typeof db`   `readonly verticalRegistry: typeof VerticalRegistry` `}` `// ─── Crear el contexto desde el request de Fastify ──────────────` `export async function createContext({ req }: { req: FastifyRequest }): Promise<TRPCContext> {`   `const authHeader = req.headers.authorization`   `if (!authHeader?.startsWith("Bearer ")) {`     `return { workspaceId: null, memberId: null, memberPermissions: [], db, verticalRegistry: VerticalRegistry }`   `}`   `const token = authHeader.slice(7)`   `try {`     `const payload = await req.server.jwt.verify<{`       `workspaceId: string`       `memberId: string`       `permissions: string[]`     `}>(token)`     `// Activar RLS para este request`     ``await db.execute(`SET app.current_workspace = '${payload.workspaceId}'`)``     `return {`       `workspaceId: payload.workspaceId as WorkspaceId,`       `memberId: payload.memberId as WorkspaceMemberId,`       `memberPermissions: payload.permissions,`       `db,`       `verticalRegistry: VerticalRegistry,`     `}`   `} catch {`     `return { workspaceId: null, memberId: null, memberPermissions: [], db, verticalRegistry: VerticalRegistry }`   `}` `}` `const t = initTRPC.context<TRPCContext>().create()` `// ─── Middlewares ─────────────────────────────────────────────────` `export const router = t.router` `export const publicProcedure = t.procedure` `// Solo accesible con JWT válido` `export const protectedProcedure = t.procedure.use(({ ctx, next }) => {`   `if (!ctx.workspaceId || !ctx.memberId) {`     `throw new TRPCError({ code: "UNAUTHORIZED", message: "Sesión requerida" })`   `}`   `return next({ ctx: { ...ctx, workspaceId: ctx.workspaceId, memberId: ctx.memberId } })` `})` `// Require un permiso específico` `export const requirePermission = (permission: string) =>`   `protectedProcedure.use(({ ctx, next }) => {`     `if (!ctx.memberPermissions.includes(permission)) {`       ``throw new TRPCError({ code: "FORBIDDEN", message: `Permiso requerido: ${permission}` })``     `}`     `return next({ ctx })`   `})` |
| :---: | :---- |

## **src/index.ts — el entry point de apps/api**

| `ts` | `// apps/api/src/index.ts` `import Fastify from 'fastify'` `import cors from '@fastify/cors'` `import helmet from '@fastify/helmet'` `import rateLimit from '@fastify/rate-limit'` `import jwt from '@fastify/jwt'` `import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'` `import { createContext } from './trpc'` `import { appRouter } from './routers/index'` `import { env } from '@biffco/config'` `import { VerticalRegistry } from '@biffco/core/vertical-engine'` `// En la Fase A no hay VerticalPacks concretos registrados.` `// En la Fase C se agrega:` `// import { livestockPack } from '@biffco/livestock'` `// VerticalRegistry.loadPack(livestockPack)` `const app = Fastify({ logger: { level: "info" } })` `// ─── Plugins ─────────────────────────────────────────────────────` `await app.register(cors, { origin: [env.PLATFORM_URL, env.VERIFY_URL, env.WEB_URL] })` `await app.register(helmet, { contentSecurityPolicy: false })` `await app.register(rateLimit, { max: 100, timeWindow: '1 minute' })` `await app.register(jwt, { secret: env.JWT_SECRET! })` `// ─── tRPC ─────────────────────────────────────────────────────────` `await app.register(fastifyTRPCPlugin, {`   `prefix: '/trpc',`   `trpcOptions: { router: appRouter, createContext }` `})` `// ─── Health check ─────────────────────────────────────────────────` `app.get('/health', async () => {`   `try {`     `await app.db.execute("SELECT 1")`     `return { status: "ok", db: "connected", version: process.env.npm_package_version }`   `} catch {`     `return { status: "degraded", db: "error" }`   `}` `})` `await app.listen({ port: 3001, host: "0.0.0.0" })` `console.info("[BIFFCO API] Corriendo en puerto 3001")` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: doppler run \-- pnpm \--filter @biffco/api dev → servidor corriendo. GET http://localhost:3001/health → {"status":"ok","db":"connected"} |
| :---- | :---- |

| TASK 025  apps/api — auth router (signup \+ login \+ JWT)   ·  Owner: Tech Lead  ·  Est: 8h  ·  Deps: TASK-024 |
| :---- |

El auth router implementa el contrato criptográfico desde el lado del servidor. Lo más importante: en auth.register, la clave PRIVADA nunca llega al servidor. El cliente deriva el keypair en el browser y solo envía la clave PÚBLICA.

|  | Principio de no-custodia: el servidor RECIBE la clave pública. El servidor NO PUEDE reconstruir la clave privada. Esto es lo que hace al sistema no-custodial y lo que garantiza que BIFFCO no puede falsificar firmas. Esta regla se verifica en code review de cada PR que toca este archivo. |
| :---- | :---- |

## **src/routers/auth.ts — el router completo**

| `ts` | `// apps/api/src/routers/auth.ts` `import { z } from 'zod'` `import { TRPCError } from '@trpc/server'` `import { createId } from '@paralleldrive/cuid2'` `import { router, publicProcedure, protectedProcedure } from '../trpc'` `import { workspaces, workspaceMembers } from '@biffco/db/schema'` `import { eq } from 'drizzle-orm'` `import { env } from '@biffco/config'` `export const authRouter = router({`   `// ─── REGISTER ─────────────────────────────────────────────────`   `// El signup se completa en 8 pasos en el frontend.`   `// Este endpoint procesa el último paso cuando el usuario confirma el mnemonic.`   `// La clave PÚBLICA se envía aquí — la privada NUNCA llega al servidor.`   `register: publicProcedure`     `.input(z.object({`       `// Paso 1 — Datos de la organización`       `workspaceName: z.string().min(2).max(100),`       `workspaceSlug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/),`       `verticalId: z.string().min(1),  // Paso 2 — vertical elegida`       `// Paso 3 — rol elegido en el VerticalPack`       `initialRoles: z.array(z.string()).min(1),`       `// Paso 4 — datos del administrador`       `personName: z.string().min(2).max(100),`       `email: z.string().email(),`       `passwordHash: z.string().min(64), // Hash Argon2id del password — el password plain NUNCA viaja`       `// Paso 5+6 — clave PÚBLICA derivada del mnemonic en el browser`       `// La clave PRIVADA y el mnemonic NO están aquí. Nunca lo estará.`       `publicKey: z.string().min(64).max(130), // Ed25519 public key hex`       `wsIdx: z.number().int().min(0),          // Índice del Workspace para la derivación`     `}))`     `.mutation(async ({ input, ctx }) => {`       `const { db, verticalRegistry } = ctx`       `// 1. Verificar que el vertical existe en el registry`       `const pack = verticalRegistry.getActivePack(input.verticalId)`       `// 2. Verificar que los roles existen en el vertical`       `const validRoles = pack.actorTypes.map(a => a.id)`       `for (const role of input.initialRoles) {`         `if (!validRoles.includes(role)) {`           `throw new TRPCError({`             `code: "BAD_REQUEST",`             ``message: `Rol "${role}" no existe en el vertical "${input.verticalId}"`,``           `})`         `}`       `}`       `// 3. Verificar que el slug no está tomado`       `const existing = await db.select()`         `.from(workspaces)`         `.where(eq(workspaces.slug, input.workspaceSlug))`         `.limit(1)`       `if (existing.length > 0) {`         `throw new TRPCError({ code: "CONFLICT", message: "El slug ya está en uso" })`       `}`       `// 4. Crear el Workspace`       `const workspaceId = createId()`       `await db.insert(workspaces).values({`         `id: workspaceId,`         `name: input.workspaceName,`         `slug: input.workspaceSlug,`         `verticalId: input.verticalId,`         `plan: "free",`         `settings: {},`       `})`       `// 5. Crear el WorkspaceMember con la clave PÚBLICA`       `// ← AQUÍ: solo la clave pública. La privada nunca llegó.`       `const memberId = createId()`       `const personId = createId() // Simplificado — en producción es FK a tabla persons`       `await db.insert(workspaceMembers).values({`         `id: memberId,`         `workspaceId,`         `personId,`         `publicKey: input.publicKey,  // ← SOLO LA CLAVE PÚBLICA`         `roles: input.initialRoles,`         `status: "active",`         `acceptedAt: new Date(),`       `})`       `// 6. Generar el JWT`       `const permissions = pack.actorTypes`         `.filter(a => input.initialRoles.includes(a.id))`         `.flatMap(a => a.permissions)`       `const accessToken = await ctx.request.server.jwt.sign({`         `workspaceId,`         `memberId,`         `permissions,`         `wsIdx: input.wsIdx,`       `}, { expiresIn: "15m" })`       `const refreshToken = await ctx.request.server.jwt.sign({`         `memberId,`         `type: "refresh",`       `}, { expiresIn: "30d" })`       `return { accessToken, refreshToken, workspaceId, memberId }`     `}),`   `// ─── LOGIN ────────────────────────────────────────────────────`   `login: publicProcedure`     `.input(z.object({`       `email: z.string().email(),`       `passwordHash: z.string().min(64),`       `workspaceSlug: z.string(),`     `}))`     `.mutation(async ({ input, ctx }) => {`       `// ... verificar password hash, cargar WorkspaceMember, emitir JWT ...`       `// Ver implementación completa en el repo`     `}),`   `// ─── LOGOUT ───────────────────────────────────────────────────`   `logout: protectedProcedure`     `.mutation(async ({ ctx }) => {`       `// Revocar el refresh token en Redis`       `// El access token expira solo (15 minutos)`       ``// await redisClient.setex(`revoked:${ctx.refreshToken}`, 30 * 24 * 3600, "1")``       `return { ok: true }`     `}),`   `// ─── REFRESH ──────────────────────────────────────────────────`   `refresh: publicProcedure`     `.input(z.object({ refreshToken: z.string() }))`     `.mutation(async ({ input, ctx }) => {`       `// Verificar que el refresh token no está revocado en Redis`       `// Emitir nuevo access token`     `}),` `})` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: POST /trpc/auth.register con publicKey pero SIN privateKey → Workspace \+ WorkspaceMember creados en DB. Inspeccionar la fila de workspace\_members: solo tiene publicKey, no hay ninguna clave privada en ningún campo. |
| :---- | :---- |

| TASK 026  apps/api — workspaces, members, facilities, zones, pens   ·  Owner: Tech Lead  ·  Est: 6h  ·  Deps: TASK-025 |
| :---- |

Los routers de gestión del Workspace. Todos son protectedProcedure — requieren JWT válido. El middleware RLS garantiza que cada query solo ve datos del workspaceId del token.

## **Patrón para todos los routers**

Todos los routers siguen el mismo patrón. Aquí el ejemplo con facilities — zones y pens son análogos.

| `ts` | `// apps/api/src/routers/facilities.ts` `import { z } from 'zod'` `import { TRPCError } from '@trpc/server'` `import { router, protectedProcedure, requirePermission } from '../trpc'` `import { facilities } from '@biffco/db/schema'` `import { eq, sql } from 'drizzle-orm'` `import { Permission } from '@biffco/core/rbac'` `export const facilitiesRouter = router({`   `create: requirePermission(Permission.FACILITIES_MANAGE)`     `.input(z.object({`       `name: z.string().min(1).max(100),`       `type: z.string(),  // El tipo válido lo valida el VerticalPack`       `licenseNumber: z.string().optional(),`       `address: z.string().optional(),`       `country: z.string().default("AR"),`       `// Polígono GeoJSON opcional — se valida con ST_IsValid en PostGIS`       `polygon: z.object({`         `type: z.literal("Polygon"),`         `coordinates: z.array(z.array(z.array(z.number()))),`       `}).optional(),`     `}))`     `.mutation(async ({ input, ctx }) => {`       `const { db, workspaceId, verticalRegistry } = ctx`       `// 1. Verificar que el tipo de Facility es válido para el vertical activo`       `const workspace = await db.query.workspaces.findFirst({ where: eq(workspaces.id, workspaceId) })`       `const pack = verticalRegistry.getActivePack(workspace!.verticalId)`       `if (!pack.facilityTypes.includes(input.type)) {`         ``throw new TRPCError({ code: "BAD_REQUEST", message: `Tipo "${input.type}" no válido para el vertical "${workspace!.verticalId}"` })``       `}`       `// 2. Si hay polígono, validar con PostGIS`       `if (input.polygon) {`         `const [{ isValid }] = await db.execute<{ isValid: boolean }>(`           `` sql`SELECT ST_IsValid(ST_GeomFromGeoJSON(${JSON.stringify(input.polygon)})) as "isValid"` ``         `)`         `if (!isValid) {`           `throw new TRPCError({ code: "BAD_REQUEST", message: "El polígono GeoJSON no es válido" })`         `}`       `}`       `// 3. Crear el Facility`       `const [facility] = await db.insert(facilities).values({`         `workspaceId,`         `name: input.name,`         `type: input.type,`         `licenseNumber: input.licenseNumber ?? null,`         `address: input.address ?? null,`         `country: input.country,`         `// polygon se inserta como geometría PostGIS`         `...(input.polygon ? {`           `` polygon: sql`ST_GeomFromGeoJSON(${JSON.stringify(input.polygon)})` ``         `} : {}),`       `}).returning()`       `return facility`     `}),`   `list: protectedProcedure`     `.query(async ({ ctx }) => {`       `return ctx.db.select().from(facilities).where(eq(facilities.workspaceId, ctx.workspaceId!))`     `}),`   `getById: protectedProcedure`     `.input(z.object({ id: z.string() }))`     `.query(async ({ input, ctx }) => {`       `const facility = await ctx.db.query.facilities.findFirst({`         `where: eq(facilities.id, input.id),`         `with: { zones: { with: { pens: true } } }`       `})`       `if (!facility) throw new TRPCError({ code: "NOT_FOUND" })`       `return facility`     `}),` `})` |
| :---: | :---- |

## **Lista completa de routers y sus endpoints en la Fase A**

| Router | Endpoints implementados en Fase A |
| :---- | :---- |
| workspaces | getProfile, updateProfile (nombre, slug, settings) |
| workspace-members | list, invite (envía email invite), acceptInvite, revoke, getById |
| teams | create, list, update, addMember, removeMember |
| employees | create, list, update, deactivate, getById |
| facilities | create (con validación PostGIS), list, getById (con zones+pens), update |
| zones | create (con polígono EUDR), list, getById, update |
| pens | create, list, getById, updateOccupancy (incrementar/decrementar contador) |

|  | ✅ VERIFICACIÓN  Verificación: E2E Playwright: register → login → POST facilities.create con polygon → GET facilities.list → 1 facility. Verificar en la DB que el polígono está almacenado como geometría PostGIS y no como texto. |
| :---- | :---- |

| TASK 027  apps/platform — Wizard de registro (8 pasos) \+ Management Dashboard   ·  Owner: Frontend Dev  ·  Est: 10h  ·  Deps: TASK-024, TASK-025 |
| :---- |

El wizard de registro es la primera experiencia del usuario con BIFFCO. El paso más crítico es el Paso 5: la pantalla del mnemonic. Esta pantalla tiene reglas de seguridad de UI que no se pueden violar.

## **Flujo del wizard — 8 pasos**

| Paso | Pantalla | Lo que ocurre (en detalle) |
| :---- | :---- | :---- |
| 1 | Datos de la organización | Input de razón social, slug (auto-generado desde el nombre, editable), país. Validación Zod en tiempo real. |
| 2 | Elegir vertical | Grid de cards: una por VerticalPack registrado en el registry. Fetch de /trpc/verticals.list. En la Fase A: solo un VerticalPack mock para pruebas. |
| 3 | Elegir rol (actor) | Grid de cards con los actorTypes del VerticalPack elegido. Descripción de cada rol. |
| 4 | Datos del administrador | Nombre completo, email, password (con confirmación). El password se hashea con Argon2id en el BROWSER antes de enviarlo. El hash, no el password, viaja al servidor. |
| 5 | MNEMONIC — la pantalla más crítica | Ver reglas de seguridad de UI abajo. |
| 6 | Confirmación del mnemonic | El sistema selecciona 3 posiciones aleatorias de las 24 palabras. El usuario debe escribir las palabras correctas. Si falla: "Intentá de nuevo. Anotá las palabras con cuidado." No puede continuar si no confirma las 3\. |
| 7 | Primer Facility (opcional) | Solo si geoRequirements \= true. Editor Leaflet para dibujar el polígono del primer establecimiento. Botón "Configurar después" visible. |
| 8 | Management Dashboard de bienvenida | Tour rápido de 3 pasos. Botón "Entendido". El usuario ve su dashboard vacío con el banner "Primero: invitá a un actor a tu cadena". |

## **REGLAS DE SEGURIDAD DE UI — Paso 5 (Pantalla del mnemonic)**

|  | Esta pantalla es el único momento donde el mnemonic existe. Si el usuario la cierra o navega, el mnemonic se elimina de la memoria. El usuario tendrá que empezar el signup de nuevo. |
| :---- | :---- |

* REGLA 1: La pantalla es full-screen con fondo \#0B132B (el color navy más oscuro). Sin sidebar. Sin topbar. Sin botón "volver". Sin X para cerrar.

* REGLA 2: El mnemonic se muestra en un grid 6×4 — 6 columnas, 4 filas \= 24 palabras. Cada celda muestra el número y la palabra: "1. abandon", "2. zoo", etc.

* REGLA 3: Botón "Descargar PDF de respaldo" — genera un PDF simple con las 24 palabras y las instrucciones de seguridad. El PDF se genera en el browser (jsPDF), nunca pasa por el servidor.

* REGLA 4: Checkbox obligatorio con el texto "Guardé mis 24 palabras en un lugar seguro. Entiendo que BIFFCO no puede recuperarlas si las pierdo." El botón "Continuar" está disabled hasta que este checkbox esté marcado.

* REGLA 5: Al montar el Paso 6, el mnemonic completo se elimina del estado de React. Solo quedan las posiciones de las 3 palabras de verificación (no las palabras mismas).

* REGLA 6: Si el usuario usa el botón de "atrás" del navegador desde el Paso 6, vuelve al inicio del wizard — no al Paso 5\. El mnemonic ya no existe en memoria.

## **La derivación del keypair en el browser (después del Paso 6\)**

| `ts` | `// Esto ocurre en el browser, en el Paso 6 después de confirmar las 3 palabras` `// El mnemonic aún está en memoria en este punto (último momento)` `import { deriveKeyFromMnemonic } from '@biffco/core/crypto'` `import { to_hex } from 'libsodium-wrappers'` `async function deriveAndStore(mnemonic: string, wsIdx: number) {`   `// Derivar el keypair para el Workspace 0 (primer workspace del usuario)`   `const { privateKey, publicKey } = deriveKeyFromMnemonic(mnemonic, wsIdx, 0)`   `// Guardar la clave PRIVADA en sessionStorage`   `// Se elimina automáticamente al cerrar el tab`   ``sessionStorage.setItem(`sk:ws:${wsIdx}`, to_hex(privateKey))``   `// La clave PÚBLICA es lo que se envía al servidor en auth.register`   `const publicKeyHex = to_hex(publicKey)`   `// ← Mnemonic se elimina aquí`   `// El string del mnemonic se libera — JavaScript garbage collector lo elimina`   `// No hay forma de recuperarlo desde sessionStorage o cualquier otro storage`   `return { publicKeyHex, wsIdx }` `}` |
| :---: | :---- |

## **Management Dashboard — estructura y pantallas**

| Ruta | Descripción | Componentes principales |
| :---- | :---- | :---- |
| /dashboard | Vista principal del Workspace. Métricas vacías con skeletons en la Fase A. | WorkspaceCard, MetricsGrid (vacío), QuickActions |
| /members | Lista de WorkspaceMembers \+ Teams \+ Employees. Con estado activo/inactivo. | MemberTable, InviteButton (modal), TeamList, EmployeeList |
| /facilities | Lista de Facilities con mapa Leaflet mostrando todos los polígonos. | FacilityCard, FacilityMap (Leaflet), CreateFacilityButton |
| /facilities/new | Formulario de creación con editor de polígono. | FacilityForm, PolygonEditor (Leaflet draw) |
| /settings/wallet | Muestra la clave pública del WorkspaceMember activo. | PublicKeyDisplay (JetBrains Mono), ImportMnemonicButton |

|  | ✅ VERIFICACIÓN  Verificación: E2E Playwright completo: abrir biffco.co → hacer clic en "Registrar" → completar los 8 pasos (incluyendo la pantalla del mnemonic) → llegar al Management Dashboard → ver /members → POST para invitar un miembro. Todo en \< 5 minutos. |
| :---- | :---- |

# **16\. Phase Gate A.2 — Criterios de cierre del Sprint A.2**

| ID | Criterio | Cómo verificarlo | Prioridad |
| :---- | :---- | :---- | :---- |
| GA2-01 | auth.register no recibe ni almacena claves privadas | Inspeccionar la tabla workspace\_members: solo hay publicKey, ninguna columna de privateKey | 🔴 CRÍTICO |
| GA2-02 | El mnemonic nunca viaja al servidor | Revisar network tab en devtools durante el signup: ningún request incluye el mnemonic | 🔴 CRÍTICO |
| GA2-03 | JWT revocado en Redis → 401 en el siguiente request | logout → usar el mismo JWT → 401 | 🔴 CRÍTICO |
| GA2-04 | E2E: signup completo (8 pasos) con mnemonic → Management Dashboard | Playwright: signup → /dashboard (CI verde) | 🔴 CRÍTICO |
| GA2-05 | RLS: tenant B no ve datos de tenant A | Query cruzada de WorkspaceA con JWT de WorkspaceB → 0 resultados | 🔴 CRÍTICO |
| GA2-06 | Facilities con polígono: ST\_IsValid \= true en PostGIS | Inspeccionar la DB: SELECT ST\_IsValid(polygon) FROM facilities → true | 🔴 CRÍTICO |
| GA2-07 | VerticalRegistry: listPacks() retorna los packs registrados | GET /trpc/verticals.list → array con los packs disponibles | 🔴 CRÍTICO |
| GA2-08 | Pantalla del mnemonic: sin navegación, sin botón de volver, full-screen oscura | Inspección manual de la pantalla del Paso 5 | 🔴 CRÍTICO |
| GA2-09 | Paso 6: el mnemonic no está en el estado de React | Revisar React DevTools en el Paso 6: no hay ningún campo con el mnemonic | 🔴 CRÍTICO |
| GA2-10 | GET /health → 200 con db:connected | curl http://localhost:3001/health | 🔴 CRÍTICO |
| GA2-11 | Management Dashboard muestra datos reales del WorkspaceMember autenticado | Verificar que el nombre del Workspace aparece en el sidebar | 🟡 RECOMENDADO |
| GA2-12 | Invitar un miembro por email: el email llega en staging | Enviar invitación a un email real de prueba en staging | 🟡 RECOMENDADO |

| TASK 028  Polygon Amoy \+ SimpleAnchor.sol \+ AnchorBatchJob   ·  Owner: Tech Lead  ·  Est: 8h  ·  Deps: TASK-020 |
| :---- |

El anclaje en blockchain es lo que hace que la verificación de BIFFCO sea independiente de BIFFCO. Cualquier persona con el txHash puede verificar que la raíz del árbol de Merkle fue publicada en un momento específico — sin confiar en nosotros.

|  | *En la Fase A se usa Polygon Amoy (testnet). El MATIC de prueba es gratis en faucet.polygon.technology. El switch a Polygon Mainnet ocurre en la Fase E.3, después del pentest completo y el load test de 500 usuarios.* |
| :---- | :---- |

## **SimpleAnchor.sol — el smart contract mínimo**

El contrato es intencionalmente mínimo. Solo hace una cosa: recibe una raíz de Merkle y emite un evento en el blockchain. No almacena nada — el evento del blockchain es la prueba.

| `solidity` | `// contracts/SimpleAnchor.sol` `// SPDX-License-Identifier: MIT` `pragma solidity ^0.8.20;` `/**`  `* SimpleAnchor — contrato de anclaje para BIFFCO.`  `*`  `* Función: recibir una raíz de Merkle (bytes32) y emitir un evento.`  `* El evento queda permanentemente registrado en el blockchain.`  `* Cualquier nodo puede verificar que la raíz fue publicada en el bloque N.`  `*`  `* NO almacena nada en storage. Solo emite eventos.`  `* Esto minimiza el gas cost — solo el costo del evento (log).`  `*/` `contract SimpleAnchor {`   `// El único evento del contrato`   `event MerkleRootAnchored(`     `bytes32 indexed merkleRoot,`     `uint256 indexed timestamp,`     `string batchId         // correlationId del batch de eventos`   `);`   `// La wallet autorizada a anclar`   `address public immutable operator;`   `constructor(address _operator) {`     `operator = _operator;`   `}`   `function anchor(`     `bytes32 merkleRoot,`     `string calldata batchId`   `) external {`     `require(msg.sender == operator, "Solo el operador puede anclar");`     `require(merkleRoot != bytes32(0), "MerkleRoot no puede ser cero");`     `emit MerkleRootAnchored(merkleRoot, block.timestamp, batchId);`   `}` `}` |
| :---: | :---- |

## **Deploy en Polygon Amoy con Hardhat**

| `bash` | `# 1. Instalar Hardhat en apps/api o en una carpeta contracts/ separada` `$ pnpm add -D -w hardhat @nomicfoundation/hardhat-toolbox` `# 2. hardhat.config.ts` `# networks:` `#   amoy:` `#     url: https://rpc-amoy.polygon.technology` `#     accounts: [process.env.POLYGON_PRIVATE_KEY]` `#     chainId: 80002` `# 3. Obtener MATIC de prueba` `# https://faucet.polygon.technology` `# Seleccionar Polygon Amoy` `# Pegar la dirección de la wallet del operador` `# Solicitar 0.5 MATIC (suficiente para miles de transacciones)` `# 4. Deployar el contrato` `$ doppler run -- pnpm hardhat run scripts/deploy.ts --network amoy` `# Output: SimpleAnchor deployed to: 0x1234...abcd` `# 5. Guardar la dirección del contrato en Doppler` `# SIMPLE_ANCHOR_ADDRESS = 0x1234...abcd (para cada entorno)` `# 6. Verificar el contrato en Polygonscan Amoy (opcional pero recomendado)` `$ pnpm hardhat verify --network amoy 0x1234...abcd [dirección-del-operator]` |
| :---: | :---- |

## **PolygonProvider — ethers.js v6**

| `ts` | `// apps/api/src/workers/polygon-provider.ts` `import { ethers } from 'ethers'` `import { env } from '@biffco/config'` `import { flags } from '@biffco/config'` `const SIMPLE_ANCHOR_ABI = [`   `"function anchor(bytes32 merkleRoot, string calldata batchId) external",`   `"event MerkleRootAnchored(bytes32 indexed merkleRoot, uint256 indexed timestamp, string batchId)",` `]` `export class PolygonProvider {`   `private provider: ethers.JsonRpcProvider | null = null`   `private contract: ethers.Contract | null = null`   `private async getContract(): Promise<ethers.Contract> {`     `if (this.contract) return this.contract`     `const rpcUrl = env.POLYGON_RPC_URL ?? "https://rpc-amoy.polygon.technology"`     `this.provider = new ethers.JsonRpcProvider(rpcUrl)`     `const wallet = new ethers.Wallet(env.POLYGON_PRIVATE_KEY!, this.provider)`     `this.contract = new ethers.Contract(`       `env.SIMPLE_ANCHOR_ADDRESS!,`       `SIMPLE_ANCHOR_ABI,`       `wallet,`     `)`     `return this.contract`   `}`   `/**`    `* Ancla una raíz de Merkle en Polygon.`    `* @returns txHash de la transacción`    `*/`   `async anchor(merkleRoot: string, batchId: string): Promise<string> {`     `if (!flags.BLOCKCHAIN_ENABLED) {`       `// En dev: mock del txHash para no gastar MATIC de prueba`       ``console.info(`[Polygon MOCK] anchor(${merkleRoot.slice(0,8)}..., ${batchId})`)``       `` return `0xmock_${Date.now()}` ``     `}`     `const contract = await this.getContract()`     `` const rootBytes32 = `0x${merkleRoot.padStart(64, "0")}` ``     `const tx = await contract.anchor(rootBytes32, batchId)`     `const receipt = await tx.wait()`     `return receipt.hash`   `}` `}` `export const polygonProvider = new PolygonProvider()` |
| :---: | :---- |

## **AnchorBatchJob — el worker BullMQ**

| `ts` | `// apps/api/src/workers/anchor.ts` `import { Queue, Worker } from 'bullmq'` `import { connection as redisConnection } from '../redis'` `import { db } from '@biffco/db'` `import { MerkleTree } from '@biffco/core/crypto'` `import { polygonProvider } from './polygon-provider'` `import { anchorsLog } from '@biffco/db/schema'` `import { eq, isNull } from 'drizzle-orm'` `export const anchorQueue = new Queue('anchor', { connection: redisConnection })` `// ─── El worker ───────────────────────────────────────────────────` `new Worker('anchor', async (job) => {`   `const { workspaceId, batchId } = job.data`   `// 1. Obtener eventos pendientes de anclar para este workspace`   `const pendingEvents = await db.select()`     `.from(domainEvents)`     `.where(and(`       `eq(domainEvents.workspaceId, workspaceId),`       `isNull(domainEvents.anchorId)  // No anclados aún`     `))`     `.limit(100)  // Máximo 100 eventos por batch`   `if (pendingEvents.length === 0) return`   `// 2. Construir el árbol de Merkle con los IDs de los eventos`   `const eventIds = pendingEvents.map(e => e.id)`   `const tree = new MerkleTree(eventIds)`   `const merkleRoot = tree.getRoot()`   `// 3. Idempotencia: si ya existe un anchor con este batchId, no anclar de nuevo`   `const existing = await db.query.anchorsLog.findFirst({`     `where: eq(anchorsLog.id, batchId)`   `})`   `if (existing) {`     ``console.info(`[AnchorJob] batchId ${batchId} ya fue anclado (${existing.txHash}). Skip.`)``     `return`   `}`   `// 4. Anclar en Polygon`   `const txHash = await polygonProvider.anchor(merkleRoot, batchId)`   `// 5. Guardar en anchors_log`   `await db.insert(anchorsLog).values({`     `id: batchId,`     `workspaceId,`     `txHash,`     `merkleRoot,`     `eventIds,`     `network: 'polygon-amoy',`     `status: 'confirmed',`   `})`   ``console.info(`[AnchorJob] Anclado: ${eventIds.length} eventos. txHash: ${txHash}`)`` `}, { connection: redisConnection })` `// ─── Lanzar el job periódicamente ─────────────────────────────────` `// Cada 5 minutos, anclar los eventos pendientes de cada workspace activo` `setInterval(async () => {`   `const activeWorkspaces = await db.selectDistinct({ id: domainEvents.workspaceId })`     `.from(domainEvents)`     `.where(isNull(domainEvents.anchorId))`   `for (const { id } of activeWorkspaces) {`     `await anchorQueue.add('anchor', {`       `workspaceId: id,`       `` batchId: `anchor_${id}_${Date.now()}` ``     `})`   `}` `}, 5 * 60 * 1000)` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: ejecutar el AnchorBatchJob manualmente con un workspace de prueba → txHash retornado → buscarlo en https://amoy.polygonscan.com/ → aparece la transacción con el evento MerkleRootAnchored. |
| :---- | :---- |

| TASK 029  Sentry \+ OpenTelemetry — observabilidad   ·  Owner: Tech Lead  ·  Est: 4h  ·  Deps: TASK-024 |
| :---- |

La observabilidad no es un lujo — es la diferencia entre saber que el sistema está bien y suponer que está bien. En staging y producción, cada error es capturado. Cada request tiene una traza con el workspaceId del actor que lo generó.

## **Sentry — error tracking**

| `ts` | `// apps/api/src/instrument.ts` `// Este archivo se importa PRIMERO en index.ts` `import * as Sentry from '@sentry/node'` `import { env } from '@biffco/config'` `if (env.SENTRY_DSN) {`   `Sentry.init({`     `dsn: env.SENTRY_DSN,`     `environment: env.NODE_ENV,`     `tracesSampleRate: env.NODE_ENV === "production" ? 0.1 : 1.0,`     `beforeSend(event) {`       `// NUNCA enviar a Sentry en dev local`       `if (env.NODE_ENV === "development") return null`       `return event`     `}`   `})` `}` `// En el tRPC middleware, agregar el contexto del Workspace al scope de Sentry:` `// Sentry.setUser({ id: ctx.memberId, workspaceId: ctx.workspaceId })` `// Sentry.setTag("workspaceId", ctx.workspaceId)` `// Sentry.setTag("verticalId", workspace.verticalId)` |
| :---: | :---- |

## **OpenTelemetry — trazas distribuidas**

| `ts` | `// apps/api/src/telemetry.ts` `import { NodeSDK } from '@opentelemetry/sdk-node'` `import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'` `import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'` `import { Resource } from '@opentelemetry/resources'` `import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions'` `import { env } from '@biffco/config'` `const sdk = new NodeSDK({`   `resource: new Resource({`     `[SEMRESATTRS_SERVICE_NAME]: 'biffco-api',`     `environment: env.NODE_ENV,`   `}),`   `traceExporter: new OTLPTraceExporter({`     `url: env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://localhost:4318/v1/traces',`   `}),`   `instrumentations: [getNodeAutoInstrumentations()],` `})` `sdk.start()` `// En el middleware de tRPC, enriquecer cada traza con el contexto:` `// const span = trace.getActiveSpan()` `// span?.setAttributes({ "workspace.id": ctx.workspaceId, "vertical.id": workspaceVerticalId })` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: lanzar un error de prueba en staging (throw new Error("test-sentry")) → aparece en la interfaz de Sentry con el tag workspaceId correcto. Ver la traza en Grafana Cloud (o Jaeger local). |
| :---- | :---- |

| TASK 030  apps/verify base \+ BlockchainAnchorBadge   ·  Owner: Frontend Dev  ·  Est: 4h  ·  Deps: TASK-028, TASK-025 |
| :---- |

En la Fase A, apps/verify es una base funcional. El contenido real (mostrar la cadena completa de un asset) se implementa en la Fase B.3. Lo que se construye en esta TASK es: el BlockchainAnchorBadge, la ruta /\[assetId\] que retorna un placeholder, y la verificación de que el Edge Runtime funciona.

## **next.config.ts — habilitar Edge Runtime**

| `ts` | `// apps/verify/next.config.ts` `import type { NextConfig } from 'next'` `const config: NextConfig = {`   `output: 'standalone',  // Para el deploy en Vercel Edge`   `experimental: {`     `// Activar Edge Runtime para la verificación pública`     `runtime: 'edge',`   `},` `}` `export default config` |
| :---: | :---- |

| `ts` | `// apps/verify/src/app/[assetId]/page.tsx` `// Edge Runtime — verificación pública sin autenticación` `export const runtime = 'edge'` `interface Props { params: { assetId: string } }` `export default async function VerifyPage({ params }: Props) {`   `// En la Fase A: placeholder que muestra el assetId y confirma que el Edge funciona`   `// En la Fase B.3: aquí se carga la cadena completa del asset`   `return (`     `<main>`       `<h1>verify.biffco.co</h1>`       `<p>Asset: {params.assetId}</p>`       `<p>verify.biffco.co Edge Runtime funcionando ✓</p>`       `<BlockchainAnchorBadge txHash="0x_pendiente_de_implementar" />,`     `</main>`   `)` `}` |
| :---: | :---- |

## **BlockchainAnchorBadge — componente genérico**

| `ts` | `// packages/ui/src/components/BlockchainAnchorBadge.tsx` `interface Props {`   `txHash: string`   `network?: 'polygon-amoy' | 'polygon-mainnet'` `}` `export function BlockchainAnchorBadge({ txHash, network = "polygon-amoy" }: Props) {`   `const explorerUrl = network === "polygon-mainnet"`     `` ? `https://polygonscan.com/tx/${txHash}` ``     `` : `https://amoy.polygonscan.com/tx/${txHash}` ``   `` const shortHash = `${txHash.slice(0, 8)}...${txHash.slice(-6)}` ``   `return (`     `<a href={explorerUrl} target="_blank" rel="noopener noreferrer"`        `className="inline-flex items-center gap-2 px-3 py-1 rounded-full`                   `bg-purple-50 text-purple-700 text-sm font-mono`                   `border border-purple-200 hover:bg-purple-100">`       `<span>⛓</span>`       `<span>{shortHash}</span>`     `</a>`   `)` `}` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: verify.biffco.co/cualquier-id → responde HTTP 200 con el placeholder y el Edge Runtime activo. La badge BlockchainAnchorBadge renderiza con un txHash de prueba. |
| :---- | :---- |

# **20\. Phase Gate A — Criterios de cierre completos de la Fase A**

El Phase Gate A es la puerta de entrada a la Fase B. El criterio fundamental: todos los ítems del Phase Gate A.1 y A.2 siguen en ✅ después de 6 semanas de desarrollo. Los ítems nuevos del Sprint A.3 se suman aquí.

|  | El criterio de oro: cualquier developer del equipo puede explicar en 5 minutos "por qué la clave privada nunca llega al servidor" y "por qué packages/core no puede importar packages/verticals". Si no pueden, la Fase A no está bien entendida — independientemente de si los tests pasan. |
| :---- | :---- |

## **Ítems del Phase Gate A final**

| ID | Criterio | Cómo verificarlo | Prioridad |
| :---- | :---- | :---- | :---- |
| GA-01 | Todos los ítems del Phase Gate A.1 siguen en ✅ | Ejecutar el checklist GA1-xx completo | 🔴 CRÍTICO |
| GA-02 | Todos los ítems del Phase Gate A.2 siguen en ✅ | Ejecutar el checklist GA2-xx completo | 🔴 CRÍTICO |
| GA-03 | Primer txHash real en Polygon Amoy testnet | Buscar el hash en https://amoy.polygonscan.com/ → aparece la tx con el evento MerkleRootAnchored | 🔴 CRÍTICO |
| GA-04 | AnchorBatchJob es idempotente: el mismo batchId anclado dos veces \= 1 entrada en anchors\_log | Enviar el mismo batchId dos veces al job → 1 fila en anchors\_log, no 2 | 🔴 CRÍTICO |
| GA-05 | Sentry captura un error de prueba en staging con el tag workspaceId | throw new Error("test-sentry") en una ruta protegida → aparece en Sentry con el tag | 🔴 CRÍTICO |
| GA-06 | RLS: workspace isolation verificado con 5 queries cruzadas | Script de test: 5 tipos de query de WorkspaceA con JWT de WorkspaceB → todos retornan 0 resultados | 🔴 CRÍTICO |
| GA-07 | E2E completo: register (8 pasos) → login → Facility creado → primer evento firmado → anchored → txHash verificable | Playwright: el flujo completo termina con un txHash en Amoy | 🔴 CRÍTICO |
| GA-08 | coverage ≥ 80% en packages/core (todos los sub-packages) | pnpm \--filter @biffco/core coverage → global ≥ 80% | 🔴 CRÍTICO |
| GA-09 | Invariante arquitectónico limpio después de 6 semanas de desarrollo | grep \-r "@biffco/livestock\\|@biffco/mining\\|from.\*verticals" packages/core/ → 0 resultados | 🔴 CRÍTICO |
| GA-10 | Replay de 1000 eventos: \< 500ms, resultado idéntico en 3 corridas | Benchmark documentado en docs/phase-audits/phase-A.md | 🔴 CRÍTICO |
| GA-11 | La pantalla del mnemonic cumple todas las REGLAS DE SEGURIDAD DE UI | Inspección manual checklist \+ code review | 🔴 CRÍTICO |
| GA-12 | GET /health → 200 en staging desde Railway | curl https://api-staging.biffco.co/health → {"status":"ok","db":"connected"} | 🔴 CRÍTICO |
| GA-13 | verify.biffco.co Edge Runtime: LCP \< 1000ms en Lighthouse (Fase B lo baja a 500ms) | Lighthouse CI en verify.biffco.co | 🟡 RECOMENDADO |
| GA-14 | OpenTelemetry: trazas visibles con workspaceId y verticalId como atributos | Ver una traza completa de auth.register en Grafana Cloud | 🟡 RECOMENDADO |
| GA-15 | Documento de auditoría docs/phase-audits/phase-A.md commiteado | git log \--oneline docs/phase-audits/ → muestra el commit de la Fase A | 🟡 RECOMENDADO |

## **Auditoría de la Fase A — lo que debe estar en docs/phase-audits/phase-A.md**

* Fecha de inicio y cierre de cada sprint (A.1, A.2, A.3).

* Lista de PRs mergeados con su descripción.

* Coverage report final de packages/core.

* Benchmark de replay (tiempo \+ condiciones del test).

* Screenshot del txHash en Polygonscan Amoy.

* Screenshot del error de prueba en Sentry con los tags correctos.

* Resultado del grep de invariante arquitectónico (0 resultados).

* Lista de Deferred Items de la Fase A con sus IDs (DEF-013 a DEF-XXX).

# **21\. Troubleshooting — problemas comunes de la Fase A**

| Problema | Síntoma | Causa probable | Solución |
| :---- | :---- | :---- | :---- |
| libsodium-wrappers no inicializado | TypeError: crypto\_sign\_detached is not a function | libsodium no fue inicializado con await ready antes de usarla. | Asegurar que ensureReady() se llama antes de cualquier operación criptográfica. Ver la función en ed25519.ts. |
| SLIP-0010 produce claves distintas en diferentes ejecuciones | La misma semilla produce keypairs distintos | Se usa BIP-44 en lugar de SLIP-0010, o se usa un argumento de seed distinto. | Verificar que se llama a derivePath de ed25519-hd-key (no de hdkey que es para secp256k1). Ver slip0010.ts. |
| append() no rechaza la firma inválida | append con firma incorrecta retorna ok(void) | verifyEvent no está siendo llamado, o la reconstrucción del SignableEventPayload tiene campos en distinto orden que el client. | Agregar un test que firma un payload, modifica un campo, y verifica que append retorna err. Revisar que canonicalJson se usa tanto al firmar como al verificar. |
| JWT expirado inmediatamente | El token expira al segundo de ser emitido | El JWT\_SECRET es undefined (Doppler no está configurado) y Fastify usa un fallback inseguro. | doppler run \-- node \-e "console.log(process.env.JWT\_SECRET)" → debe imprimir el secreto, no undefined. Ver configuración de Doppler. |
| Polygon Amoy: "insufficient funds" | La tx falla con "insufficient funds for gas" | La wallet del operador no tiene MATIC de prueba. | Ir a faucet.polygon.technology y solicitar 0.5 MATIC para la dirección de la wallet del operador. |
| RLS no está funcionando: tenant B ve datos de tenant A | Query cruzada retorna resultados del workspace B | SET app.current\_workspace no está siendo ejecutado antes de las queries, o el valor está vacío. | Verificar en el middleware de auth que await db.execute(\`SET app.current\_workspace \= '${workspaceId}'\`) se ejecuta antes de cualquier query. Agregar un log temporario para confirmarlo. |
| tRPC error "Cannot read properties of undefined (reading 'getActivePack')" | El VerticalRegistry está undefined en el contexto | El VerticalRegistry no fue importado correctamente en el createContext. | Verificar que el import de VerticalRegistry en trpc.ts es correcto y que el singleton fue inicializado. |
| Mnemonic visible en React DevTools en el Paso 6 | El mnemonic aparece en el estado del componente del Paso 6 | El estado del wizard no fue limpiado correctamente al transitar del Paso 5 al 6\. | El estado del wizard debe guardar el mnemonic en una variable local del componente del Paso 5, NO en el estado global del wizard. Al montar el Paso 6, el componente del Paso 5 se desmonta y la variable local se pierde. |
| AnchorBatchJob ancla el mismo batch dos veces | Dos filas en anchors\_log con el mismo batchId | El job no verifica la idempotencia antes de anclar. | Agregar la query EXISTS(SELECT 1 FROM anchors\_log WHERE id \= batchId) antes de llamar a polygonProvider.anchor(). |

# **22\. Deferred Items — lo que explícitamente NO se hace en la Fase A**

| ID | Qué se difiere | Por qué se difiere | Se resuelve en |
| :---- | :---- | :---- | :---- |
| DEF-013 | assets.router — crear, listar, ver assets | Los assets requieren el VerticalPack para validar el tipo y el payload. En la Fase A solo hay un VerticalPack mock. El router completo espera a que haya un VerticalPack real. | Fase B.2 |
| DEF-014 | events.router — append de eventos de negocio | Los eventos de negocio requieren el VerticalPack para validar el payload y los permisos por tipo de evento. El append de la Fase A es solo el mecanismo — no los eventos del dominio. | Fase B.2 |
| DEF-015 | transfers.router — transferencias entre Workspaces | Las transferencias requieren el flujo completo de doble firma. Dependen de los assets, que se resuelven en B.2. | Fase B.3 |
| DEF-016 | packages/email — templates con Resend | Los emails transaccionales (invitación, bienvenida, alerta) se implementan cuando hay suficiente UI para contextualizar cada email. | Fase B.1 |
| DEF-017 | packages/ui — diseño system completo (componentes de dominio) | En la Fase A solo se necesitan los componentes base. Los componentes de dominio (EventTimeline, AssetMap, DAGVisualizer, EvidenceThumb) se construyen cuando hay datos de dominio para renderizar. | Fase B.1 |
| DEF-018 | Offline engine (Workbox service worker) | El offline engine es crítico para el Carrier (firma en ruta sin señal). Requiere el flujo de eventos completo del activo, que viene en la Fase B. | Fase B.3 |
| DEF-019 | S3 \+ Object Lock (evidencias WORM) | Las evidencias se adjuntan a eventos, que son Fase B.2. El pipeline de upload (SHA-256 browser → S3 → verify) no tiene sentido sin eventos a los que adjuntarlas. | Fase B.3 |
| DEF-020 | packages/verticals/livestock — VerticalPack real | El VerticalPack de Ganadería requiere la plataforma completa para ser testeado. Se construye en la Fase C con el Ubiquitous Language acordado con el cliente piloto. | Fase C.1 |
| DEF-021 | Polygon Mainnet — switch de Amoy a Mainnet | El Mainnet requiere un pentest externo completo y el load test de 500 usuarios. Solo en Fase E. | Fase E.3 |
| DEF-022 | billing.router — Stripe integration | No hay producto que vender hasta tener el MVP completo con al menos una vertical operativa. | Fase E.1 |
| DEF-023 | analytics.router — proyecciones del VerticalPack | Las proyecciones dependen del Event Store lleno de eventos del vertical. No hay proyecciones sin eventos de dominio. | Fase C.2 |
| DEF-024 | apps/verify — contenido real (mostrar la cadena de un asset) | verify.biffco.co muestra la cadena completa de un asset. Requiere assets con eventos firmados, que llegan en la Fase B.2. | Fase B.3 |

|  | ✅ VERIFICACIÓN  Todos los DEF-013 a DEF-024 deben estar documentados en docs/deferred-items.md antes de cerrar la Fase A. |
| :---- | :---- |

