

**BIFFCO™**

*Trust Infrastructure for Global Value Chains*

**FASE B — PRODUCT LAYER**

Playbook completo para el equipo de desarrollo

*Semanas 9–16  ·  Duración: 40 días hábiles  ·  3 sprints: B.1 / B.2 / B.3*

| Objetivo de la Fase B *Al finalizar estas ocho semanas, cualquier VerticalPack puede renderizar formularios dinámicos a través del DynamicFormRenderer. Los assets se crean, listan, detallan y operan (Group, Split, Merge). Las evidencias se suben a S3 con hash SHA-256 verificable. Las transferencias entre Workspaces funcionan con doble firma. Y verify.biffco.co muestra la cadena completa de cualquier asset de cualquier vertical en menos de 500ms sin autenticación.* |
| :---: |

Abril–Mayo 2026  ·  Córdoba, Argentina  ·  CONFIDENCIAL — USO INTERNO

# **Índice**

| Sección | Título |
| :---- | :---- |
| 01 | ¿Qué es la Fase B y qué construimos? |
| 02 | Prerequisitos — la Fase A debe estar cerrada |
| 03 | Equipo, roles y responsabilidades |
| 04 | Cronograma día a día — 40 días hábiles |
| SPRINT B.1 | Semanas 9–11 — Design System, Workspace Management, Dashboards |
| 05 | TASK-031 — packages/ui: componentes completos \+ Storybook |
| 06 | TASK-032 — packages/email: templates transaccionales con Resend |
| 07 | TASK-033 — apps/api: routers de workspace-members, teams, employees |
| 08 | TASK-034 — apps/api: routers de facilities, zones, pens |
| 09 | TASK-035 — apps/platform: Management Dashboard completo |
| 10 | Phase Gate B.1 — criterios de cierre del primer sprint |
| SPRINT B.2 | Semanas 11–13 — Assets, Eventos y Operaciones |
| 11 | TASK-036 — apps/api: assets router completo |
| 12 | TASK-037 — apps/api: asset-groups, split y merge routers |
| 13 | TASK-038 — apps/api: events router \+ batch signing |
| 14 | TASK-039 — apps/api: holds router |
| 15 | TASK-040 — apps/platform: Operations Dashboard — assets y eventos |
| 16 | TASK-041 — apps/platform: UI de Group, Split y Merge |
| 17 | Phase Gate B.2 — criterios de cierre del segundo sprint |
| SPRINT B.3 | Semanas 13–16 — S3 WORM, Transfers y verify.biffco.co |
| 18 | TASK-042 — AWS S3 \+ Object Lock WORM \+ ClamAV \+ CloudFront |
| 19 | TASK-043 — packages/pdf: AssetPassport genérico |
| 20 | TASK-044 — apps/api: transfers router (doble firma) |
| 21 | TASK-045 — apps/platform: UI de transfers \+ EvidenceUploader |
| 22 | TASK-046 — apps/verify: verify.biffco.co completo (LCP \< 500ms) |
| 23 | TASK-047 — Offline engine: Workbox service worker \+ sync |
| 24 | Phase Gate B — criterios de cierre completos de la Fase B |
| 25 | Troubleshooting — problemas comunes de la Fase B |
| 26 | Deferred Items — lo que explícitamente no se hace en esta fase |

# **01\. ¿Qué es la Fase B y qué construimos?**

La Fase B convierte el contrato criptográfico de la Fase A en un producto usable. Hasta aquí, el sistema puede firmar eventos y almacenarlos — pero no hay ninguna interfaz funcional, ningún formulario de dominio, ninguna evidencia real, ni ningún QR verificable. La Fase B construye todo eso.

|  | La regla de oro de la Fase B: el Product Layer NO sabe nada de Ganadería ni de Minería. El DynamicFormRenderer renderiza cualquier UISchema. El Operations Dashboard carga cualquier VerticalPack. Si encontrás un "if vertical \=== livestock" en packages/ui, apps/platform o apps/api (fuera de los routers de vertical), es un bug de arquitectura. |
| :---- | :---- |

## **Los tres sprints y su propósito**

| Sprint | Semanas | Propósito | Resultado concreto |
| :---- | :---- | :---- | :---- |
| B.1 | 9–11 | Construir la interfaz de gestión de Workspace completa. Todos los componentes UI base. Emails. Dashboard de Members, Teams, Facilities. | Un WorkspaceMember invitado puede aceptar la invitación, ver su dashboard, y gestionar su Workspace desde la UI. |
| B.2 | 11–13 | Construir las operaciones sobre assets: crear, listar, ver, firmar eventos, agrupar, dividir y combinar. El DynamicFormRenderer en producción. | Un usuario puede crear un asset (AnimalAsset con mock VerticalPack), firmar un evento sobre él, y ver el EventTimeline con SignatureBadge verificado. |
| B.3 | 13–16 | Construir las evidencias WORM, las transferencias con doble firma, verify.biffco.co con LCP \< 500ms, y el engine offline. | Un asset tiene su QR. verify.biffco.co muestra la cadena completa. El Carrier puede firmar sin señal. |

## **Qué existe al cerrar la Fase B**

| Entregable | Estado al final | Cómo se verifica |
| :---- | :---- | :---- |
| packages/ui completo | 20+ componentes con Storybook. DynamicFormRenderer con 9 widgets. EventTimeline, SignatureBadge, DAGVisualizer, EvidenceThumb, SyncStatusBadge. | pnpm \--filter @biffco/ui storybook → todas las stories cargan. |
| packages/email | Templates de invitación, bienvenida, alerta de DTE, alerta de hold. Vía Resend. | Email de invitación llega en staging en \< 30 segundos. |
| packages/pdf | AssetPassport.tsx genérico. Descargable desde apps/verify. | PDF generado con parentIds chain visible para un asset de prueba. |
| apps/api — Management | Routers completos: workspace-members, teams, employees, facilities, zones, pens. | E2E: invite member → accept → ver en dashboard. Facility con polígono PostGIS creado. |
| apps/api — Operations | Routers completos: assets, asset-groups, split, merge, events (batch), holds, transfers. | E2E: crear asset → firmar evento → group → split → merge → transfer → aceptar. |
| apps/api — S3 WORM | Pipeline: SHA-256 browser → upload → ClamAV → Object Lock. CloudFront CDN. | Un archivo subido tiene Object Lock activo. ClamAV lo escaneó. URL de CloudFront funciona. |
| apps/platform — Management Dashboard | /members, /teams, /employees, /facilities con mapa Leaflet \+ polígonos, /settings/wallet. | Demo completa del Management Dashboard sin instrucciones adicionales. |
| apps/platform — Operations Dashboard | /assets, /assets/\[id\] (4 tabs), /events/new, /groups, /split, /merge. | Demo: crear AnimalAsset → firmar WEIGHT\_RECORDED → ver EventTimeline con ✓ verde. |
| apps/verify | verify.biffco.co: EventTimeline \+ DAGVisualizer \+ BlockchainAnchorBadge \+ descarga PDF. LCP \< 500ms. | Lighthouse CI: LCP \< 500ms. Performance \> 90\. |
| Offline engine | Workbox SW. Firma offline. Sync al recuperar señal. SyncStatusBadge live. | Desactivar red → firmar evento → reconectar → evento aparece en el API. |
| RLS multi-tenant verificado | 5 queries cruzadas retornan 0 resultados. | Script de test: workspace A no ve datos de workspace B. |

# **02\. Prerequisitos — la Fase A debe estar cerrada**

Todos los ítems del Phase Gate A deben estar en ✅ antes de arrancar. Los TASKs de la Fase B asumen que estos componentes existen y funcionan correctamente.

| Lo que debe existir | Cómo verificarlo |
| :---- | :---- |
| packages/core/domain, crypto, event-store, rbac, vertical-engine compilando y con tests | pnpm \--filter @biffco/core test → 0 failures. Coverage ≥ 80%. |
| apps/api corriendo con auth.register, auth.login, JWT \+ Redis revocation | E2E: register → login → GET /health → 200\. |
| Wizard de registro (8 pasos incluyendo mnemonic) funcional en Vercel | Un usuario completa el signup sin instrucciones adicionales. |
| Management Dashboard (shell vacío) desplegado en Vercel | app.biffco.co responde HTTP 200 con layout base. |
| Polygon Amoy: SimpleAnchor.sol desplegado, AnchorBatchJob corriendo | Primer txHash en https://amoy.polygonscan.com/. |
| ESLint invariante activo en CI | PR con import prohibido en packages/core → CI falla. |
| Schema DB completo migrado (todas las tablas de Fases 0 y A) | pnpm db:migrate → "No pending migrations". |
| Mock VerticalPack registrado en VerticalRegistry | GET /trpc/verticals.list retorna al menos 1 pack (el mock). |

## **Nuevas dependencias a instalar antes del Día 1 de la Fase B**

| `bash` | `# S3 y evidencias` `$ pnpm --filter @biffco/api add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner` `$ pnpm --filter @biffco/api add multer @fastify/multipart` `# PDF` `$ pnpm --filter @biffco/platform add @react-pdf/renderer` `$ pnpm --filter @biffco/platform add -D @types/react-pdf` `# Mapas (Leaflet ya puede estar, verificar)` `$ pnpm --filter @biffco/platform add leaflet react-leaflet leaflet-draw` `$ pnpm --filter @biffco/platform add -D @types/leaflet` `# DAG Visualizer` `$ pnpm --filter @biffco/platform add @xyflow/react` `# Email` `$ pnpm --filter @biffco/email add resend react-email` `# Offline / Service Worker` `$ pnpm --filter @biffco/platform add workbox-window workbox-strategies workbox-routing` `$ pnpm --filter @biffco/platform add -D workbox-webpack-plugin` `# UI extras` `$ pnpm --filter @biffco/platform add @radix-ui/react-tooltip framer-motion` `$ pnpm --filter @biffco/platform add react-dropzone idb` `$ pnpm --filter @biffco/platform add date-fns` `# Verify (Edge)` `$ pnpm --filter @biffco/verify add @react-pdf/renderer` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: pnpm install \--frozen-lockfile sin errores. pnpm build retorna success en todos los packages. |
| :---- | :---- |

# **03\. Equipo, roles y responsabilidades**

La Fase B es la más intensa en términos de paralelismo. Tech Lead y Frontend Dev trabajan en paralelo desde el Día 1 — el Tech Lead construye los routers del API y el Frontend Dev construye los componentes y el dashboard. La coordinación diaria es crítica para que no haya bloqueos.

| Rol | Responsabilidad en Fase B | TASKs asignadas | % del tiempo |
| :---- | :---- | :---- | :---- |
| Tech Lead / Backend Dev | Todos los routers de apps/api (Management, Operations, S3, Transfers). packages/email. AWS setup. packages/pdf. | TASK-032, TASK-033, TASK-034, TASK-036, TASK-037, TASK-038, TASK-039, TASK-042, TASK-043, TASK-044 | 65% |
| Frontend Dev | packages/ui completo (componentes \+ Storybook). apps/platform Management y Operations Dashboards. apps/verify completo. Offline engine. | TASK-031, TASK-035, TASK-040, TASK-041, TASK-045, TASK-046, TASK-047 | 65% |
| Ambos | E2E tests (Playwright). Phase Gate reviews. QA cruzado — cada uno testea el trabajo del otro. | Phase Gates B.1, B.2, B final | 10% de cada uno |

|  | *El bloqueo más común en la Fase B: el Frontend necesita un endpoint del API que el Tech Lead aún no terminó. Para evitarlo: el Tech Lead prioriza los routers de READ antes que los de WRITE — el Frontend puede mostrar datos antes de poder crearlos.* |
| :---- | :---- |

## **Acuerdo de interfaces — contratos entre Tech Lead y Frontend Dev**

Antes del Día 1, el Tech Lead y el Frontend Dev acuerdan los contratos tRPC de los routers más críticos. El Frontend Dev puede usar datos mock que respetan exactamente el tipo del contrato mientras el backend no está listo.

| Contrato | Disponible para FE | Bloqueante para FE |
| :---- | :---- | :---- |
| assets.list — tipo Asset completo con status, payload, parentIds, currentPenId | Día 6 (inicio B.2) | El listado de assets no puede mostrar hasta que este contrato esté definido. |
| assets.getById — con eventos ordenados | Día 7 (B.2) | La página /assets/\[id\] con EventTimeline no puede funcionar. |
| events.append — tipo firmado con signature \+ publicKey | Día 8 (B.2) | El formulario "Firmar evento" no puede conectarse al API. |
| transfers.createOffer \+ transfers.accept | Día 16 (B.3) | La UI de transferencias no puede conectarse al API. |
| upload.signedUrl — endpoint de S3 presigned | Día 18 (B.3) | EvidenceUploader no puede subir archivos. |

## **Reglas de trabajo para la Fase B**

* REGLA 1: El DynamicFormRenderer se testea con el mock VerticalPack desde el Día 1\. No esperar a que Livestock esté implementado.

* REGLA 2: Todo componente nuevo en packages/ui tiene su Storybook story antes del merge. Sin story \= sin merge.

* REGLA 3: Los uploads de evidencias nunca tocan la DB directamente — siempre van a S3 primero, luego el hash se registra en el evento.

* REGLA 4: verify.biffco.co es Edge Runtime. Ningún import que no funcione en Edge puede entrar en ese package.

* REGLA 5: Lighthouse CI corre en cada PR que toca apps/verify. Si LCP sube por encima de 500ms, bloquea el merge.

# **04\. Cronograma día a día — 40 días hábiles**

La Fase B tiene 3 sprints. B.1 y B.2 son de 2 semanas (10 días) cada uno. B.3 es de 4 semanas (20 días) porque incluye verify.biffco.co, S3 WORM y el offline engine — los tres son más complejos de lo que parecen.

| B.1 | Semanas 9–10 · Días 1–10 Design System completo · Management Dashboard · Email · Facilities |
| :---: | :---- |

| D01 | Lunes Semana 9 Kickoff B \+ packages/ui inicio — Button, Input, Card, Table |
| :---: | :---- |

| Hora | Actividad | Responsable | Entregable |
| :---- | :---- | :---- | :---- |
| 09:00–10:00 | Kickoff: revisar playbook completo. Acuerdo de contratos de interfaces entre TL y FD. Asignar issues. | Ambos | Issues de Fase B creados. Contratos tRPC documentados en docs/contracts/fase-b.md. |
| 10:00–12:30 | TASK-031: packages/ui — Button, Input, Textarea, Label con CVA. Todos los tamaños y estados. | Frontend Dev | Button \+ Input compilando con stories en Storybook. |
| 10:00–12:30 | TASK-033: apps/api — workspace-members router: invite (con email), list, getById, revoke. | Tech Lead | POST /trpc/members.invite → crea WorkspaceMember con status=pending. |
| 13:30–16:30 | TASK-031: packages/ui — Card, Badge, Avatar, Spinner, Skeleton. | Frontend Dev | 6 componentes con stories. Skeleton shimmer animado. |
| 13:30–16:30 | TASK-033: apps/api — members.acceptInvite (genera clave derivada y la guarda), members.revokeAccess. | Tech Lead | E2E: invite → acceptInvite → WorkspaceMember activo en DB. |
| 16:30–18:00 | PR\#031-a: packages/ui batch 1\. PR\#033-a: members router. | Ambos | CI verde en ambos PRs. |

| D02 | Martes Semana 9 packages/ui — Modal, Toast, Select \+ teams/employees routers |
| :---: | :---- |

| Hora | Actividad | Responsable | Entregable |
| :---- | :---- | :---- | :---- |
| 09:00–11:30 | TASK-031: Modal (Dialog Radix), Toast (Sonner), Select (Radix), Checkbox, Switch, RadioGroup. | Frontend Dev | Modal con focus trap. Toast con 5 tipos (success/error/warning/loading/info). |
| 09:00–11:30 | TASK-033: apps/api — teams router: create, list, addMember, removeMember, delete. | Tech Lead | Un team puede tener N WorkspaceMembers. RBAC: solo Admin puede crear teams. |
| 11:30–13:00 | TASK-031: DatePicker (Calendar Radix \+ Popover), DateRangePicker. | Frontend Dev | DatePicker con navegación de meses. Valor como ISO 8601 string. |
| 13:30–16:30 | TASK-033: apps/api — employees router: create, list, getById, update, deactivate. | Tech Lead | Employee con supervisorId FK. RBAC: solo roles con EMPLOYEES\_MANAGE. |
| 16:30–18:00 | TASK-031: Table base — header, rows alternadas, sorting, pagination, empty state. | Frontend Dev | Table con 100 filas renderiza sin lag. Sorting funcional. |

| D03 | Miércoles Semana 9 packages/ui — Componentes avanzados \+ facilities router |
| :---: | :---- |

| Hora | Actividad | Responsable | Entregable |
| :---- | :---- | :---- | :---- |
| 09:00–11:00 | TASK-031: Combobox (Command Radix para búsqueda con typing). Dropdown Menu (Radix). | Frontend Dev | Combobox con debounce de 200ms. Keyboard navigation completa. |
| 09:00–11:00 | TASK-034: facilities router: create (con polígono PostGIS \+ validación ST\_IsValid), list, getById (con zones+pens). | Tech Lead | Facility creada con polígono. ST\_IsValid(polygon) \= true verificado. |
| 11:00–13:00 | TASK-031: EmptyState con ícono, título, descripción y CTA. Drawer (lateral). | Frontend Dev | EmptyState con 3 variantes. Drawer animado desde la derecha. |
| 13:30–15:30 | TASK-034: zones router: create (con polígono EUDR), list, getById. El polígono de Zone es el que se usa para EUDR. | Tech Lead | Zone con polígono. gfwStatus: pending por defecto. |
| 15:30–17:30 | TASK-034: pens router: create, list, updateOccupancy (counter). Validar capacity vs currentOccupancy. | Tech Lead | PATCH pens.updateOccupancy rechaza si currentOccupancy \> capacity. |
| 17:30–18:00 | PR\#034: facilities, zones, pens routers. | Tech Lead | CI verde. |

| D04 | Jueves Semana 9 packages/ui — Dominio BIFFCO: EventTimeline, SignatureBadge, DAGVisualizer |
| :---: | :---- |

| Hora | Actividad | Responsable | Entregable |
| :---- | :---- | :---- | :---- |
| 09:00–12:30 | TASK-031: EventTimeline — lista de DomainEvents en orden cronológico. Cada item: tipo de evento (badge), timestamp (font-mono), actor firmante (Avatar \+ nombre), payload preview (3 campos), SignatureBadge. | Frontend Dev | EventTimeline con 10 eventos mock renderiza correctamente. |
| 09:00–12:30 | TASK-032: packages/email — setup Resend. Template de InvitationEmail con parámetros: workspaceName, inviterName, acceptUrl, verticalLabel. | Tech Lead | Email de invitación enviado a una dirección real de prueba en staging. |
| 12:30–13:30 | TASK-031: SignatureBadge — 3 estados: valid (✓ verde), invalid (✗ rojo), pending (⏳ gris \+ spinner). | Frontend Dev | SignatureBadge llama a verifyEvent() del Core. Lazy (IntersectionObserver). |
| 13:30–16:30 | TASK-031: DAGVisualizer — árbol de parentIds con @xyflow/react. Nodos: tipo de asset \+ ID truncado \+ status badge. Aristas: tipo de operación (Split, Merge, Transform). | Frontend Dev | DAGVisualizer con árbol de 3 niveles de profundidad. Zoom y pan. |
| 16:30–18:00 | TASK-032: WelcomeEmail, HoldAlertEmail, DTEExpiryEmail. | Tech Lead | 3 templates adicionales compilando. |

| D05 | Viernes Semana 9 packages/ui — EvidenceThumb, SyncStatusBadge \+ Management Dashboard inicio |
| :---: | :---- |

| Hora | Actividad | Responsable | Entregable |
| :---- | :---- | :---- | :---- |
| 09:00–11:00 | TASK-031: EvidenceThumb — thumbnail de archivo. SHA-256 visible (font-mono, primeros 8). Estado ClamAV badge. Click → modal con documento completo. | Frontend Dev | EvidenceThumb muestra SHA-256 truncado y estado del scan. |
| 09:00–11:00 | PR\#032: packages/email completo. | Tech Lead | CI verde. Email real recibido en staging. |
| 11:00–13:00 | TASK-031: SyncStatusBadge, GeoComplianceBadge, BlockchainAnchorBadge. ChainOfCustodyView. | Frontend Dev | 4 componentes de dominio con stories. |
| 13:30–16:30 | TASK-035: apps/platform Management Dashboard — /members: tabla de WorkspaceMembers con invite button (modal \+ form). /teams: lista \+ create team modal. | Frontend Dev | /members muestra datos reales del API. Invite member funciona E2E. |
| 13:30–16:30 | PR\#033: workspace-members, teams, employees routers. | Tech Lead | CI verde. E2E invite → accept corriendo. |
| 16:30–17:30 | Retroactivo Semana 9\. Lista de pendientes para Semana 10\. | Ambos | Issues actualizados. |

| D06–D10 | Semana 10 · Días 6–10 Completar B.1 \+ Phase Gate B.1 |
| :---: | :---- |

| Día | Actividad | Responsable | Entregable al final del día |
| :---- | :---- | :---- | :---- |
| D06 — Lunes | TASK-035: /employees — tabla \+ create employee modal (con selector de supervisor). /settings/wallet — clave pública en font-mono, botón importar mnemonic. | Frontend Dev | Employees con supervisor asignado. Settings/wallet conectado al WorkspaceMember activo. |
| D06 — Lunes | TASK-034 hardening: Edge cases de polígonos — polígonos que se auto-intersectan (ST\_IsValid rechaza). Tests de integración con PostGIS. | Tech Lead | Tests: polígono auto-intersectante → 400 con mensaje claro. Polígono válido → 201\. |
| D07 — Martes | TASK-035: /facilities — lista de Facilities con mapa Leaflet. Polígonos renderizados. Color por estado GFW. Click → drawer con zones y pens en árbol. | Frontend Dev | Mapa de Facilities con polígonos reales del API. Click en polígono → detalles. |
| D07 — Martes | Testing cruzado: Tech Lead testea el Management Dashboard. Frontend Dev testea los routers del API con Postman/Insomnia. | Ambos | Lista de bugs encontrados y priorizados. |
| D08 — Miércoles | Fix de bugs de QA cruzado del D07. Storybook docs: todos los componentes tienen descripción y props documentados. | Frontend Dev | Storybook con 20+ stories. Todas las props documentadas. |
| D08 — Miércoles | TASK-033 email hardening: rate limiting en invite (máx 5 invitaciones por hora por workspace). Logs de emails enviados. | Tech Lead | Rate limiter activo. Email duplicado en \< 1h es rechazado con 429\. |
| D09 — Jueves | Playwright E2E B.1: invite → accept → ver en /members → crear facility con polígono → ver en mapa. | Ambos | E2E B.1 en CI verde. |
| D10 — Viernes | Phase Gate B.1: checklist completo. Fix de issues. PR del Phase Gate. Kickoff B.2. | Ambos | Phase Gate B.1 en ✅. B.2 listo para arrancar lunes. |

| B.2 | Semanas 11–12 · Días 11–20 Assets · Eventos · Group · Split · Merge |
| :---: | :---- |

| D11–D15 | Semana 11 · Días 11–15 Assets router \+ asset-groups \+ Events router |
| :---: | :---- |

| Día | Actividad | Responsable | Entregable al final del día |
| :---- | :---- | :---- | :---- |
| D11 — Lunes | TASK-036: assets.create — valida el assetType contra el VerticalPack. Crea el Asset con payload validado. Solo roles con ASSETS\_CREATE. | Tech Lead | POST /trpc/assets.create con mock VerticalPack → Asset en DB. |
| D11 — Lunes | TASK-040: Operations Dashboard shell — sidebar con nav items (assets, events, groups, compliance). Layout de /\[wsId\] diferente al Management. | Frontend Dev | apps/platform/\[wsId\]/ con sidebar y topbar propios. |
| D12 — Martes | TASK-036: assets.list (filtros: status, type, penId, groupId, externalId, texto). assets.getById (con eventos y ancestors). Cursor-based pagination. | Tech Lead | assets.list con 5 filtros combinables. Pagination retorna cursor para página siguiente. |
| D12 — Martes | TASK-040: /\[wsId\]/assets — tabla con filtros. Vocabulario del VerticalPack activo (assetLabel). Cada fila: status badge, tipo, EID, owner, última actividad. | Frontend Dev | /assets con datos reales del API. Filtros conectados. Pagination funcional. |
| D13 — Miércoles | TASK-036: assets.getDescendants, assets.getAncestors (usando índice GIN). Verificar \< 200ms con 1000 assets en la DB de test. | Tech Lead | Query de linaje \< 200ms. Benchmark documentado en la PR. |
| D13 — Miércoles | TASK-040: /\[wsId\]/assets/\[id\] — 4 tabs: Información (payload del asset), Timeline (EventTimeline), Mapa (AssetMap con polígono de Zone), Documentos (EvidenceThumbs). | Frontend Dev | /assets/\[id\] con los 4 tabs. EventTimeline con eventos mock (se conectará al API en D14). |
| D14 — Jueves | TASK-037: asset-groups router: create (GROUP\_FORMED), addAssets, removeAssets, dissolve, getStatus (con assets del grupo). | Tech Lead | GROUP\_FORMED crea AssetGroup. assets con currentGroupId actualizado. |
| D14 — Jueves | TASK-038: events router — events.append: verifica firma Ed25519 antes de persistir. Rechaza si firma inválida. | Tech Lead | POST events.append con firma inválida → 400\. Con firma válida → 201 \+ actualiza asset status. |
| D15 — Viernes | TASK-038: events.batch — 1 firma del actor, genera N eventos con correlationId. Para batch operations (vacunación masiva, pesada masiva). | Tech Lead | 1 firma del actor → 50 eventos con correlationId. Transacción atómica. |

| D16–D20 | Semana 12 · Días 16–20 Split, Merge, Holds UI \+ Phase Gate B.2 |
| :---: | :---- |

| Día | Actividad | Responsable | Entregable al final del día |
| :---- | :---- | :---- | :---- |
| D16 — Lunes | TASK-037: split router — createSplit atómico (1 tx: input → CLOSED, N outputs creados). Worst-case compliance inheritance (alertas heredadas). Validar invariante cuantitativo si tiene peso. | Tech Lead | SPLIT\_COMPLETED atómico. Si input tiene hold activo → outputs heredan el hold. |
| D16 — Lunes | TASK-040: /\[wsId\]/assets/\[id\]/events/new — selector de eventos (filtrado por roles del actor), DynamicFormRenderer del UISchema del evento, preview de la firma, botón "Firmar y Registrar". | Frontend Dev | El formulario de evento usa DynamicFormRenderer con el UISchema del mock VerticalPack. |
| D17 — Martes | TASK-037: merge router — createMerge atómico. Worst-case compliance: si cualquier input tiene alerta → output la hereda. Alert UI para el usuario antes de confirmar. | Tech Lead | MERGE\_COMPLETED atómico. Test: merge de asset con hold \+ asset limpio → output hereda hold. |
| D17 — Martes | TASK-041: /\[wsId\]/groups — lista de AssetGroups activos. Crear grupo (selección múltiple de assets). Disolver grupo. | Frontend Dev | /groups con AssetGroups reales del API. Crear grupo con checkbox multi-select. |
| D18 — Miércoles | TASK-039: holds router: impose (activa LOCKED o QUARANTINE), lift (solo rol autorizado — HOLDS\_LIFT). Holds list por workspace. | Tech Lead | HOLD\_IMPOSED por rol sin HOLDS\_LIFT → 403\. HOLD\_LIFTED por rol correcto → asset vuelve a ACTIVE. |
| D18 — Miércoles | TASK-041: /\[wsId\]/split — selector de asset, declaración de outputs con tipos y cantidades, worst-case warning (si el input tiene alerta), botón firmar. | Frontend Dev | UI de split con warning de compliance heredado. Firma con clave del sessionStorage. |
| D19 — Jueves | TASK-041: /\[wsId\]/merge — selector multi de assets, declaración del output, alerta de peor caso visible por cada alerta activa en los inputs. | Frontend Dev | UI de merge muestra TODOS los holds y alertas de los inputs antes de confirmar. |
| D19 — Jueves | Hardening: test de concurrencia en split y merge. Dos requests simultáneos sobre el mismo asset → solo uno procede (lock a nivel DB). | Tech Lead | Test: 2 splits concurrentes del mismo asset → 1 succeed, 1 fail con 409 Conflict. |
| D20 — Viernes | Phase Gate B.2: checklist completo. E2E Playwright B.2. Fix de issues. Kickoff B.3. | Ambos | Phase Gate B.2 en ✅. B.3 listo para arrancar lunes. |

| B.3 | Semanas 13–16 · Días 21–40 S3 WORM · Transfers · verify.biffco.co · Offline |
| :---: | :---- |

| D21–D25 | Semana 13 · Días 21–25 AWS S3 \+ Object Lock \+ ClamAV \+ CloudFront |
| :---: | :---- |

| Día | Actividad | Responsable | Entregable al final del día |
| :---- | :---- | :---- | :---- |
| D21 — Lunes | TASK-042: crear bucket S3 con Object Lock (COMPLIANCE mode, retention 7 años). Configurar IAM policy. Guardar credenciales en Doppler. | Tech Lead | Bucket con Object Lock activo. Intentar DELETE de un objeto → MethodNotAllowedError. |
| D21 — Lunes | TASK-046: apps/verify — layout base actualizado. Ruta /\[assetId\] con Edge Runtime. Skeleton de carga mientras fetcha el asset. | Frontend Dev | verify.biffco.co/\[cualquier-id\] responde con skeleton de carga. |
| D22 — Martes | TASK-042: upload.getSignedUrl — genera S3 presigned URL (PUT, 10 min TTL). SHA-256 del archivo como header x-amz-checksum-sha256. El cliente sube directo a S3 desde el browser (sin pasar por el API). | Tech Lead | Frontend puede subir un archivo directo a S3 usando el presigned URL. |
| D22 — Martes | TASK-046: /\[assetId\] — fetch del asset desde apps/api (Server Component con cache: no-store). Mostrar: banner EUDR, EventTimeline, actores firmantes, BlockchainAnchorBadge. | Frontend Dev | verify.biffco.co muestra EventTimeline real con eventos del asset de prueba. |
| D23 — Miércoles | TASK-042: ClamAV integration — ClamAV corre en Railway como servicio separado. Después de cada upload, el worker escanea el archivo. Si pasa: Object Lock activado. Si falla: archivo eliminado \+ log. | Tech Lead | Archivo de prueba con EICAR test string → ClamAV detecta → archivo eliminado de S3. |
| D23 — Miércoles | TASK-046: DAGVisualizer en verify.biffco.co. Descarga PDF del AssetPassport. SignatureBadge con verificación real (Web Crypto API en Edge). | Frontend Dev | DAGVisualizer muestra árbol completo. PDF descargable. SignatureBadge ✓ en Edge. |
| D24 — Jueves | TASK-042: CloudFront CDN frente al bucket S3. Signed URLs para downloads (el usuario descarga desde CloudFront, no directo de S3). Configurar Cache-Control. | Tech Lead | URL de CloudFront funciona para un archivo de prueba. URL directa de S3 está bloqueada. |
| D24 — Jueves | TASK-046: Lighthouse CI en verify.biffco.co. Target: LCP \< 500ms. Performance \> 90\. Optimizar: fonts preloaded, no JS innecesario en Edge. | Frontend Dev | Lighthouse CI pasa con LCP \< 500ms en staging. |
| D25 — Viernes | TASK-042: apps/api upload router completo: POST /trpc/upload.getSignedUrl, POST /trpc/upload.confirmUpload (registra hash \+ activa Object Lock \+ triggerea ClamAV scan). | Tech Lead | E2E: getSignedUrl → upload a S3 → confirmUpload → archivo con Object Lock. |

| D26–D30 | Semana 14 · Días 26–30 packages/pdf \+ Transfers router \+ UI de transfers |
| :---: | :---- |

| Día | Actividad | Responsable | Entregable al final del día |
| :---- | :---- | :---- | :---- |
| D26 — Lunes | TASK-043: packages/pdf — AssetPassport.tsx con @react-pdf/renderer. Secciones: header (logo, txHash), asset info, chain of custody (tabla de eventos), parentIds chain, evidencias con SHA-256. | Tech Lead | PDF generado para un asset de prueba. Descargable desde /api/assets/\[id\]/passport. |
| D26 — Lunes | TASK-045: EvidenceUploader — drag & drop, SHA-256 calculado en browser antes de subir (WebCrypto), progress bar, estado ClamAV live (polling), thumbnail preview. | Frontend Dev | EvidenceUploader sube un archivo real a S3. SHA-256 calculado en browser coincide con S3. |
| D27 — Martes | TASK-044: transfers router — createOffer: firma del cedente, crea TransferOffer en DB con assetIds y optional groupId. Status: pending. | Tech Lead | TransferOffer creada. El asset del cedente queda "bloqueado para nueva transfer" mientras hay una pendiente. |
| D27 — Martes | TASK-045: /\[wsId\]/assets/\[id\]/tabs — tab Documentos conectado con EvidenceUploader real. Upload → SHA-256 visible → estado ClamAV badge. | Frontend Dev | Upload de evidencia en el tab Documentos funciona E2E. |
| D28 — Miércoles | TASK-044: transfers.accept — firma del receptor (Ed25519). Atómico: owner cambia, custodian cambia, TransferOffer → completed. | Tech Lead | Accept firmado → asset.ownerId \= receptor. TransferOffer.status \= completed. Atómico. |
| D28 — Miércoles | TASK-045: /\[wsId\]/transfers — lista de transfers entrantes y salientes. Badge de estado. Botón "Aceptar" (abre modal con resumen del transfer \+ botón firmar). | Frontend Dev | /transfers con transfers reales. Modal de aceptación con firma real del receptor. |
| D29 — Jueves | TASK-044: transfers.reject, transfers.expire (cron job que expira offers \> 72hs). Notificación por email al cedente cuando el receptor acepta o rechaza. | Tech Lead | Transfer expirada a las 72hs. Email de notificación al cedente recibido en staging. |
| D29 — Jueves | TASK-045: /\[wsId\]/transfers/new — formulario de iniciación de transfer: seleccionar assets (o grupo), buscar workspace receptor (Combobox), nota opcional, botón firmar. | Frontend Dev | UI completa de creación de transfer. Firma con clave del sessionStorage. |
| D30 — Viernes | E2E de transfers: producerA crea asset → inicia transfer a producerB → producerB acepta → asset aparece en workspace B. Playwright CI verde. | Ambos | E2E de transfer completo en CI. |

| D31–D35 | Semana 15 · Días 31–35 verify.biffco.co completo \+ Offline engine |
| :---: | :---- |

| Día | Actividad | Responsable | Entregable al final del día |
| :---- | :---- | :---- | :---- |
| D31 — Lunes | TASK-046: verify.biffco.co — banner EUDR Compliant / No Compliant (basado en gfwStatus del polígono \+ holds activos). Lógica de compliance en Edge. | Frontend Dev | Banner ✅ EUDR Compliant para asset sin alertas. Banner ❌ para asset con hold activo. |
| D31 — Lunes | TASK-043: PDF AssetPassport integrado en verify.biffco.co. Botón "Descargar Asset Passport" → genera PDF desde Edge. | Tech Lead | PDF descargable desde verify.biffco.co con toda la cadena del asset. |
| D32 — Martes | TASK-047: Workbox setup en apps/platform. Service worker con cache strategy: StaleWhileRevalidate para assets estáticos, NetworkFirst para API calls. | Frontend Dev | apps/platform instala SW en el primer load. Verificar en DevTools → Application → Service Workers. |
| D32 — Martes | TASK-043: AssetPassport para DerivedAssets — incluir el árbol de parentIds hasta el AnimalAsset original. Sección "Verificación blockchain" con el txHash. | Tech Lead | PDF de un DerivedAsset muestra la cadena completa desde el animal original. |
| D33 — Miércoles | TASK-047: Offline signing — cuando el Carrier no tiene red, puede firmar eventos localmente. Los eventos firmados se guardan en IndexedDB (idb). El SyncStatusBadge muestra "N eventos pendientes". | Frontend Dev | Sin red → firmar evento → aparece en IndexedDB. Reconectar → sync automático → evento en API. |
| D33 — Miércoles | API hardening: rate limiting por workspaceId (no solo por IP). Throttle de events.append a 100 eventos por minuto por workspace. | Tech Lead | Rate limiter por workspace activo. 101 eventos en 1 min → 429 al evento 101\. |
| D34 — Jueves | TASK-047: Sync queue — cuando reconecta, los eventos de IndexedDB se envían al API en orden. Si alguno falla, los siguientes no se envían (mantener el orden de ocurrencia). Retry con backoff. | Frontend Dev | Sync con 10 eventos offline → todos en el API en orden. Si el evento 3 falla → 4 a 10 quedan pendientes. |
| D34 — Jueves | TASK-046: Meta tags de verify.biffco.co para sharing (og:title con nombre del asset, og:description con estado EUDR). Canonical URL. | Tech Lead | Compartir verify.biffco.co/\[id\] en Twitter/LinkedIn muestra el preview correcto. |
| D35 — Viernes | Prueba de offline completa con el equipo: Carrier firma en modo avión → reconecta → verifica que todos los eventos llegaron en orden. | Ambos | Demo de offline signing documentada en docs/phase-audits/fase-b-offline-demo.md. |

| D36–D40 | Semana 16 · Días 36–40 Hardening \+ Phase Gate B final |
| :---: | :---- |

| Día | Actividad | Responsable | Entregable al final del día |
| :---- | :---- | :---- | :---- |
| D36 — Lunes | Audit de seguridad: revisar todos los endpoints nuevos contra el RBAC. Ningún endpoint es accesible sin JWT. Ningún endpoint de un workspace es accesible con JWT de otro workspace. | Tech Lead | Script de audit: lista de endpoints \+ resultado de verificación RBAC. 0 endpoints sin protección. |
| D36 — Lunes | Audit de performance: Lighthouse en todas las rutas de apps/platform. Target: FCP \< 1.5s, TTI \< 3.5s. | Frontend Dev | Lighthouse report de /assets, /assets/\[id\], /transfers. Issues priorizados. |
| D37 — Martes | Fix de issues del audit de seguridad y performance. | Ambos | 0 issues críticos de seguridad. Lighthouse targets alcanzados. |
| D38 — Miércoles | Coverage final: pnpm coverage en packages/ui \+ apps/api nuevos routers. Target global ≥ 75%. | Ambos | Coverage report. Tests adicionales si es necesario. |
| D39 — Jueves | Phase Gate B: ejecutar el checklist completo. Documentar cada verificación. | Ambos | Checklist con estado ✅/❌ por criterio. |
| D40 — Viernes | Sprint Review \+ Retrospectiva \+ Kickoff Fase C. Livestock es el siguiente paso. | Ambos | Fase B cerrada formalmente. Fase C lista para arrancar. |

| TASK 031  packages/ui — Design System completo \+ Storybook   ·  Owner: Frontend Dev  ·  Est: 18h  ·  Deps: Fase A completa, packages/core/vertical-engine |
| :---- |

packages/ui es el corazón visual de BIFFCO. Tiene dos categorías de componentes: los componentes base (Button, Input, Card — que podrían estar en cualquier app) y los componentes de dominio (EventTimeline, SignatureBadge, DAGVisualizer — que son exclusivamente BIFFCO). Los primeros usan shadcn/ui como base. Los segundos no tienen precedente en ninguna librería.

## **Estructura del package**

| `tree` | `packages/ui/src/` `|-- components/` `|   |-- ui/              ← Componentes shadcn/ui customizados` `|   |   |-- button.tsx` `|   |   |-- input.tsx` `|   |   |-- card.tsx` `|   |   |-- badge.tsx` `|   |   |-- table.tsx` `|   |   |-- modal.tsx    ← Dialog de Radix` `|   |   |-- drawer.tsx` `|   |   |-- select.tsx` `|   |   |-- combobox.tsx` `|   |   |-- date-picker.tsx` `|   |   |-- checkbox.tsx` `|   |   |-- switch.tsx` `|   |   |-- avatar.tsx` `|   |   |-- skeleton.tsx` `|   |   |-- spinner.tsx` `|   |   +-- empty-state.tsx` `|   +-- domain/          ← Componentes de dominio BIFFCO` `|       |-- EventTimeline.tsx` `|       |-- SignatureBadge.tsx` `|       |-- DAGVisualizer.tsx` `|       |-- EvidenceThumb.tsx` `|       |-- EvidenceUploader.tsx` `|       |-- BlockchainAnchorBadge.tsx` `|       |-- SyncStatusBadge.tsx` `|       |-- GeoComplianceBadge.tsx` `|       |-- AssetStatusBadge.tsx` `|       +-- DynamicFormRenderer.tsx` `|-- lib/` `|   |-- utils.ts         ← cn() helper (clsx + tailwind-merge)` `|   +-- verify-event.ts  ← Wrapper de verifyEvent() del Core para uso en UI` `+-- stories/             ← Un .stories.tsx por componente` |
| :---: | :---- |

## **DynamicFormRenderer — el componente más importante de la Fase B**

DynamicFormRenderer convierte cualquier UISchema de cualquier VerticalPack en un formulario funcional con validación Zod. Es el componente que hace posible que el Operations Dashboard funcione para Ganadería, Minería y cualquier vertical futura sin ningún cambio de código.

| `ts` | `// packages/ui/src/components/domain/DynamicFormRenderer.tsx` `import { useForm } from 'react-hook-form'` `import { zodResolver } from '@hookform/resolvers/zod'` `import { z } from 'zod'` `import type { UISchema } from '@biffco/core/vertical-engine'` `import { Input } from '../ui/input'` `import { Select } from '../ui/select'` `import { DatePicker } from '../ui/date-picker'` `import { EvidenceUploader } from './EvidenceUploader'` `import { PolygonEditor } from './PolygonEditor'` `interface Props {`   `schema: UISchema`   `onSubmit: (data: Record<string, unknown>) => Promise<void>`   `defaultValues?: Record<string, unknown>`   `submitLabel?: string`   `isLoading?: boolean` `}` `// ─── Construir schema Zod dinámicamente desde UISchema ─────────` `function buildZodSchema(schema: UISchema): z.ZodObject<z.ZodRawShape> {`   `const shape: z.ZodRawShape = {}`   `for (const field of schema) {`     `let fs: z.ZodTypeAny`     `switch (field.type) {`       `case 'number':    fs = z.number(); break`       `case 'date':      fs = z.string().datetime(); break`       `case 'select':    fs = field.options ? z.enum(field.options as [string,...string[]]) : z.string(); break`       `case 'multiselect': fs = z.array(z.string()); break`       `case 'toggle':    fs = z.boolean(); break`       `case 'geo-polygon': fs = z.object({type: z.literal('Polygon'), coordinates: z.array(z.array(z.array(z.number())))}); break`       `case 'file-upload': fs = z.object({hash: z.string(), s3Key: z.string(), mimeType: z.string(), sizeBytes: z.number()}); break`       `default:          fs = z.string()`     `}`     `if (field.validation?.min !== undefined && field.type === "number") fs = (fs as z.ZodNumber).min(field.validation.min)`     `if (field.validation?.max !== undefined && field.type === "number") fs = (fs as z.ZodNumber).max(field.validation.max)`     `if (field.validation?.pattern) fs = (fs as z.ZodString).regex(new RegExp(field.validation.pattern))`     `shape[field.key] = field.required ? fs : fs.optional()`   `}`   `return z.object(shape)` `}` `export function DynamicFormRenderer({ schema, onSubmit, defaultValues, submitLabel = "Guardar", isLoading }: Props) {`   `const zodSchema = useMemo(() => buildZodSchema(schema), [schema])`   `const form = useForm({ resolver: zodResolver(zodSchema), defaultValues })`   `return (`     `<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">`       `{schema.map(field => <FormField key={field.key} field={field} form={form} />)}`       `<button type="submit" disabled={isLoading} className="btn-primary">`         `{isLoading ? <Spinner size={16} /> : submitLabel}`       `</button>`     `</form>`   `)` `}` |
| :---: | :---- |

## **EventTimeline — verificación lazy de firmas**

La verificación Ed25519 es asíncrona y costosa. EventTimeline usa IntersectionObserver para solo verificar los eventos que están visibles en el viewport. Esto mantiene el scroll suave aunque haya 1000 eventos.

| `ts` | `// packages/ui/src/components/domain/EventTimeline.tsx` `import { useRef, useEffect, useState } from 'react'` `import { verifyEvent } from '@biffco/core/crypto'` `import type { DomainEvent } from '@biffco/core/domain'` `import { SignatureBadge } from './SignatureBadge'` `import { formatDistanceToNow } from 'date-fns'` `import { es } from 'date-fns/locale'` `interface Props {`   `events: DomainEvent[]`   `compact?: boolean` `}` `export function EventTimeline({ events, compact }: Props) {`   `return (`     `<ol className="relative border-l border-[var(--color-border)] ml-3">`       `{events`         `.sort((a,b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime())`         `.map(event => (`           `<EventItem key={event.id} event={event} compact={compact} />`         `))}`     `</ol>`   `)` `}` `type VerifyState = 'pending' | 'valid' | 'invalid'` `function EventItem({ event, compact }: { event: DomainEvent; compact?: boolean }) {`   `const [sigState, setSigState] = useState<VerifyState>('pending')`   `const ref = useRef<HTMLLIElement>(null)`   `useEffect(() => {`     `// Verificar firma solo cuando el elemento entra en el viewport`     `const observer = new IntersectionObserver(async ([entry]) => {`       `if (entry?.isIntersecting) {`         `observer.disconnect()`         `const signable = {`           `type: event.type,`           `schemaVersion: event.schemaVersion,`           `assetId: event.assetId as string,`           `workspaceId: event.workspaceId as string,`           `actorId: event.actorId as string,`           `occurredAt: new Date(event.occurredAt).toISOString(),`           `payload: event.payload as Record<string, unknown>`         `}`         `const valid = await verifyEvent(signable, event.signature, event.publicKey)`         `setSigState(valid ? 'valid' : 'invalid')`       `}`     `}, { threshold: 0.1 })`     `if (ref.current) observer.observe(ref.current)`     `return () => observer.disconnect()`   `}, [event])`   `return (`     `<li ref={ref} className="ml-6 mb-6">`       `{/* Dot on the timeline */}`       `<span className="absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-surface)] ring-2 ring-[var(--color-border)]" />`       `{/* Content */}`       `<div className="flex items-start justify-between gap-3">`         `<div>`           `<EventTypeBadge type={event.type} />`           `<time className="font-mono text-xs text-[var(--color-text-secondary)] ml-2">`             `{formatDistanceToNow(new Date(event.occurredAt), { addSuffix: true, locale: es })}`           `</time>`         `</div>`         `<SignatureBadge state={sigState} />`       `</div>`       `{!compact && <PayloadPreview payload={event.payload} />}`     `</li>`   `)` `}` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: pnpm \--filter @biffco/ui storybook → 20+ stories cargan. EventTimeline con 1000 eventos scrollea a 60fps (verificar en Chrome DevTools Performance). DynamicFormRenderer con mock UISchema de 9 widgets renderiza todos sin errores. |
| :---- | :---- |

| TASK 032  packages/email — Templates transaccionales con Resend   ·  Owner: Tech Lead  ·  Est: 4h  ·  Deps: TASK-031 (para componentes de email), Doppler con RESEND\_API\_KEY |
| :---- |

Todos los emails transaccionales de BIFFCO son parametrizables por vertical. El template no tiene texto hardcodeado de "ganadería" — usa parámetros como verticalLabel, assetLabel, workspaceName. Esto garantiza que funcionan para cualquier vertical.

## **Templates implementados en Fase B**

| Template | Parámetros clave | Cuándo se envía |
| :---- | :---- | :---- |
| InvitationEmail | workspaceName, inviterName, inviteeName, verticalLabel, acceptUrl, expiresIn | Cuando un Admin hace members.invite |
| WelcomeEmail | workspaceName, memberName, dashboardUrl, verticalLabel, firstSteps\[\] | Cuando un WorkspaceMember acepta la invitación |
| HoldAlertEmail | assetExternalId, holdType, holdReason, assetLabel, workspaceName, dashboardUrl | Cuando se impone un HOLD sobre un asset (severity ≥ high) |
| DTEExpiryEmail | assetExternalId, expiresInDays, assetLabel, workspaceName, dashboardUrl | 72 horas antes de que expire un DTE (job diario) |
| TransferNotificationEmail | assetCount, assetLabel, fromWorkspace, toWorkspace, status (accepted/rejected), dashboardUrl | Cuando una transfer es aceptada o rechazada |

## **Estructura y setup**

| `ts` | `// packages/email/src/index.ts` `import { Resend } from 'resend'` `import { env } from '@biffco/config'` `const resend = new Resend(env.RESEND_API_KEY)` `export { InvitationEmail } from './templates/InvitationEmail'` `export { WelcomeEmail } from './templates/WelcomeEmail'` `export { HoldAlertEmail } from './templates/HoldAlertEmail'` `// ─── Helper genérico para enviar ─────────────────────────────────` `export async function sendEmail<T>({`   `to, subject, component, props` `}: {`   `to: string`   `subject: string`   `component: React.ComponentType<T>`   `props: T` `}) {`   `const { renderAsync } = await import('@react-email/render')`   `const html = await renderAsync(React.createElement(component, props))`   `return resend.emails.send({ from: "BIFFCO <noreply@biffco.co>", to, subject, html })` `}` `// Ejemplo de uso en apps/api:` `// import { sendEmail, InvitationEmail } from "@biffco/email"` `// await sendEmail({` `//   to: invitee.email,` ``//   subject: `Invitación a ${workspace.name}`,`` `//   component: InvitationEmail,` `//   props: { workspaceName: workspace.name, acceptUrl, ... }` `// })` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: enviar InvitationEmail a una dirección real de prueba → email recibido en \< 30 segundos con formato correcto. Los links de aceptación tienen TTL de 72 horas. |
| :---- | :---- |

| TASK 033  apps/api — workspace-members, teams, employees routers   ·  Owner: Tech Lead  ·  Est: 8h  ·  Deps: TASK-025 (auth router), packages/email |
| :---- |

Los routers de gestión del Workspace. Todos requieren JWT válido. El RLS garantiza que cada query solo ve datos del workspace del token. Los roles requeridos para cada acción se verifican con can() del Core.

## **workspace-members router — endpoints clave**

| `ts` | `// apps/api/src/routers/workspace-members.ts (extracto de los endpoints más críticos)` `// ─── INVITE ──────────────────────────────────────────────────────` `// Crea un WorkspaceMember con status=pending y envía el email de invitación.` `// Solo roles con MEMBERS_INVITE pueden invitar.` `members.invite: requirePermission(Permission.MEMBERS_INVITE)`   `.input(z.object({`     `email: z.string().email(),`     `roles: z.array(z.string()).min(1),`     `message: z.string().optional(),`   `}))`   `.mutation(async ({ input, ctx }) => {`     `// 1. Verificar que los roles son válidos para el vertical`     `// 2. Verificar rate limit (max 5 invitaciones por hora por workspace)`     `// 3. Crear WorkspaceMember con status=pending + token de invitación`     `// 4. Enviar InvitationEmail via Resend`     `// 5. Retornar el WorkspaceMember creado`   `})` `// ─── ACCEPT INVITE ───────────────────────────────────────────────` `// El receptor acepta. Aquí se guarda la clave PÚBLICA derivada en el browser.` `// El wsIdx viene del JWT del proceso de registro del nuevo workspace.` `members.acceptInvite: publicProcedure  // No requiere JWT propio — usa token de invitación`   `.input(z.object({`     `inviteToken: z.string(),`     `publicKey: z.string().min(64),  // Ed25519 public key hex derivada en el browser`     `wsIdx: z.number().int().min(0), // Índice del workspace para SLIP-0010`   `}))`   `.mutation(async ({ input, ctx }) => {`     `// 1. Verificar que el inviteToken existe y no expiró (TTL 72h)`     `// 2. Actualizar WorkspaceMember: status=active, publicKey=input.publicKey`     `// 3. Enviar WelcomeEmail`     `// 4. Retornar JWT para la nueva sesión`   `})` |
| :---: | :---- |

| TASK 034  apps/api — facilities, zones, pens routers (con PostGIS)   ·  Owner: Tech Lead  ·  Est: 6h  ·  Deps: TASK-033, schema DB con PostGIS activo |
| :---- |

Los routers de ubicación son los primeros en usar PostGIS activamente. Las geometrías se almacenan como GEOMETRY(Polygon, 4326\) — coordenadas en WGS84 (el mismo sistema que Google Maps y GPS).

## **El polígono EUDR — por qué vive en Zone**

El regulador europeo requiere las coordenadas de la parcela específica donde estuvo el producto. En ganadería: el lote donde pastó el animal. En minería: el sector de extracción. Por eso el polígono está en Zone (nivel 3), no en Facility (nivel 2). El nivel Facility puede ser una propiedad grande con múltiples lotes — cada lote es una Zone con su propio polígono.

| `ts` | `// apps/api/src/routers/zones.ts (extracto)` `zones.create: requirePermission(Permission.ZONES_MANAGE)`   `.input(z.object({`     `facilityId: z.string(),`     `name: z.string().min(1).max(100),`     `type: z.string(),`     `capacity: z.number().int().positive().optional(),`     `// GeoJSON Polygon — el polígono EUDR`     `polygon: z.object({`       `type: z.literal("Polygon"),`       `coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))).min(1)`     `}).optional(),`   `}))`   `.mutation(async ({ input, ctx }) => {`     `const { workspaceId, db } = ctx`     `// Validar que la facility pertenece al workspace (RLS lo garantiza, pero verificamos)`     `const facility = await db.query.facilities.findFirst({`       `where: and(eq(facilities.id, input.facilityId), eq(facilities.workspaceId, workspaceId!))`     `})`     `if (!facility) throw new TRPCError({ code: "NOT_FOUND" })`     `// Validar el polígono con PostGIS si se proporcionó`     `if (input.polygon) {`       `const geojson = JSON.stringify(input.polygon)`       `const [result] = await db.execute<{isValid: boolean, reason: string}>(`         ``sql`SELECT ST_IsValid(ST_GeomFromGeoJSON(${geojson})) as "isValid",``             `` ST_IsValidReason(ST_GeomFromGeoJSON(${geojson})) as reason` ``       `)`       `if (!result?.isValid) {`         `throw new TRPCError({`           `code: "BAD_REQUEST",`           `` message: `Polígono inválido: ${result?.reason ?? "geometría incorrecta"}` ``         `})`       `}`     `}`     `// Crear la Zone`     `const [zone] = await db.insert(zones).values({`       `facilityId: input.facilityId,`       `workspaceId: workspaceId!,`       `name: input.name,`       `type: input.type,`       `capacity: input.capacity ?? null,`       `gfwStatus: 'pending',  // Se actualiza async cuando se hace el GFW check`       `...(input.polygon ? {`         `` polygon: sql`ST_GeomFromGeoJSON(${JSON.stringify(input.polygon)})` ``       `} : {})`     `}).returning()`     `// Si tiene polígono, encolar el GFW check (async — no bloquea al usuario)`     `if (input.polygon) {`       `await gfwQueue.add('gfw-check', { zoneId: zone!.id, polygon: input.polygon })`     `}`     `return zone`   `})` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: crear Zone con polígono auto-intersectante (ej: figura en forma de X) → API retorna 400 con mensaje "Polígono inválido: Self-intersection". Crear Zone con polígono válido → ST\_IsValid en la DB \= true. |
| :---- | :---- |

| TASK 035  apps/platform — Management Dashboard completo   ·  Owner: Frontend Dev  ·  Est: 12h  ·  Deps: TASK-031, TASK-033, TASK-034 |
| :---- |

El Management Dashboard es el home de la plataforma. Es donde el usuario gestiona su Workspace: invita miembros, crea ubicaciones, configura su wallet. No tiene nada específico de ganadería o minería — todo el vocabulario (facilityLabel, zoneLabel) viene del VerticalPack.

## **Páginas del Management Dashboard**

| Ruta | Descripción | Componentes principales |
| :---- | :---- | :---- |
| /dashboard | Vista principal. Métricas del Workspace (en la Fase B son skeletons — los datos reales vienen en Fase C). Quick actions: "Invitar actor", "Crear establecimiento". | WorkspaceCard con stats. QuickActions grid. RecentActivity feed. |
| /members | Lista de WorkspaceMembers. Estado activo/pendiente/revocado. Botón "Invitar" (modal). Por cada miembro: roles (badges del VerticalPack), clave pública truncada. | MemberTable. InviteModal (form \+ DynamicFormRenderer para los roles). RevokeConfirmDialog. |
| /teams | Lista de Teams. Crear team (nombre \+ descripción). Agregar/quitar miembros de un team. | TeamCard con lista de members. AddMemberCombobox. |
| /employees | Lista de Employees. Crear employee (nombre, rol, DNI opcional, supervisor). Toggle activo/inactivo. | EmployeeTable. CreateEmployeeModal con selector de supervisor (Combobox de WorkspaceMembers). |
| /facilities | Lista de Facilities con mapa Leaflet integrado. Todos los polígonos visibles. Click en polígono → panel lateral con details de la Facility. | FacilityListWithMap. PolygonEditor para crear/editar. FacilityDetailPanel (Drawer). |
| /facilities/\[id\] | Detalle de una Facility. Árbol de Zones y Pens. Editar polígono. Ver GFW status de cada Zone. | FacilityDetail. ZoneTree (árbol jerárquico). GeoComplianceBadge por Zone. |
| /settings/wallet | Clave pública del WorkspaceMember activo (en font-mono, con botón copiar). Opción "Importar mnemonic propio". Sección de regeneración de clave (cuidado — require confirmación extrema). | PublicKeyDisplay. ImportMnemonicModal con todas las advertencias de seguridad. |
| /settings/workspace | Nombre del Workspace, slug (solo editable en plan Pro+), billing, danger zone (desactivar Workspace). | WorkspaceSettingsForm. |

## **El mapa de Facilities — implementación con Leaflet**

| `ts` | `// apps/platform/src/components/FacilityMap.tsx` `// Solo se renderiza en el cliente (SSR no funciona con Leaflet)` `'use client'` `import dynamic from 'next/dynamic'` `// Dynamic import para evitar SSR de Leaflet` `const MapContainer = dynamic(`   `() => import('react-leaflet').then(m => m.MapContainer),`   `{ ssr: false }` `)` `import { TileLayer, GeoJSON, Popup } from 'react-leaflet'` `import type { Facility } from '@biffco/db/schema'` `interface Props {`   `facilities: Facility[]`   `tileTheme?: 'light' | 'dark'` `}` `export function FacilityMap({ facilities, tileTheme = "light" }: Props) {`   `// CartoDB tiles — libre, sin API key, con versión dark`   `const tileUrl = tileTheme === "light"`     `? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"`     `: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"`   `return (`     `<MapContainer`       `style={{ height: "400px", width: "100%", borderRadius: "var(--radius-lg)" }}`       `center={[-34.6, -60.5]}  // Centered en Argentina por defecto`       `zoom={5}`     `>`       `<TileLayer url={tileUrl} />`       `{facilities.map(facility => (`         `facility.polygon && (`           `<GeoJSON`             `key={facility.id}`             `data={facility.polygon as GeoJSON.GeoJsonObject}`             `style={{`               `color: "#3A86FF",`               `fillColor: "#3A86FF",`               `fillOpacity: 0.15,`               `weight: 2`             `}}`           `>`             `<Popup>{facility.name}</Popup>`           `</GeoJSON>`         `)`       `))}`     `</MapContainer>`   `)` `}` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: demo del Management Dashboard sin instrucciones adicionales. Un nuevo developer del equipo puede crear una Facility con polígono, invitar un miembro, y ver el mapa con los polígonos en menos de 5 minutos. |
| :---- | :---- |

# **10\. Phase Gate B.1 — Criterios de cierre del Sprint B.1**

|  | *Phase Gate B.1 desbloquea el Sprint B.2. Si cualquier ítem crítico está en ❌, no se empieza a construir los routers de assets — las dependencias aún no están listas.* |
| :---- | :---- |

| ID | Criterio | Cómo verificarlo | Responsable | Prioridad |
| :---- | :---- | :---- | :---- | :---- |
| GB1-01 | packages/ui: 20+ componentes con Storybook stories | pnpm \--filter @biffco/ui storybook → todas las stories cargan sin error | Frontend Dev | 🔴 CRÍTICO |
| GB1-02 | DynamicFormRenderer renderiza los 9 tipos de widget | Story "DynamicFormRenderer/AllWidgets" en Storybook con UISchema de prueba | Frontend Dev | 🔴 CRÍTICO |
| GB1-03 | EventTimeline con IntersectionObserver — lazy verify | 1000 eventos en el scroll: FPS \> 55 en Chrome DevTools Performance | Frontend Dev | 🔴 CRÍTICO |
| GB1-04 | E2E: invite member → email real recibido → acceptInvite → WorkspaceMember activo | Playwright: invite → aceptar desde el link del email → ver en /members | Ambos | 🔴 CRÍTICO |
| GB1-05 | Facilities con polígono: ST\_IsValid \= true en PostGIS | SELECT ST\_IsValid(polygon) FROM zones WHERE id \= "test-id" → true | Tech Lead | 🔴 CRÍTICO |
| GB1-06 | Zone con polígono auto-intersectante → 400 con mensaje claro | POST zones.create con polígono en X → TRPCError 400 con reason de PostGIS | Tech Lead | 🔴 CRÍTICO |
| GB1-07 | /facilities con mapa Leaflet mostrando polígonos reales | Demo manual: crear facility con polígono → ver en el mapa | Frontend Dev | 🔴 CRÍTICO |
| GB1-08 | packages/email: InvitationEmail enviado en \< 30 segundos | Log de Resend en staging → email entregado en \< 30s | Tech Lead | 🔴 CRÍTICO |
| GB1-09 | Rate limiter en members.invite: \> 5 en 1h → 429 | Test: 6 invitaciones en 1h → la 6ta retorna 429 | Tech Lead | 🟡 RECOMENDADO |
| GB1-10 | /settings/wallet muestra clave pública del WorkspaceMember activo | Inspeccionar la clave pública en /settings/wallet vs la DB → coinciden | Frontend Dev | 🟡 RECOMENDADO |

| TASK 036  apps/api — assets router completo   ·  Owner: Tech Lead  ·  Est: 8h  ·  Deps: TASK-034, TASK-023 (vertical-engine), schema DB |
| :---- |

El assets router es el más complejo del API porque conecta directamente con el VerticalPack. La validación del payload depende del schema del assetType del VerticalPack activo. Las queries de linaje usan el índice GIN de parentIds.

## **Endpoints del assets router**

| Endpoint | Input | Output | Notas |
| :---- | :---- | :---- | :---- |
| assets.create | type (string del VerticalPack), payload (JSONB), penId (opcional), externalId (opcional) | Asset creado | Valida payload contra assetType.schema del VerticalPack. Solo ASSETS\_CREATE. |
| assets.list | status?, type?, penId?, groupId?, externalId?, text?, cursor?, limit? | Asset\[\] paginado con cursor | Índices en status, type, penId para \< 50ms con 10k assets. |
| assets.getById | id: AssetId | Asset completo con eventos ordenados | Incluye los últimos N eventos para la preview del EventTimeline. |
| assets.getTimeline | id: AssetId, cursor?, limit? | DomainEvent\[\] paginado | Eventos en orden occurredAt ASC. Lazy loading para EventTimeline largo. |
| assets.getDescendants | id: AssetId | AssetId\[\] | Usa índice GIN. \< 200ms con 10k assets. Recursivo via WITH RECURSIVE en PostgreSQL. |
| assets.getAncestors | id: AssetId | AssetId\[\] | Idem. Recorre parentIds\[\] recursivamente. |
| assets.update | id: AssetId, payload updates | Asset actualizado | Solo campos del payload — no permite cambiar type ni workspaceId. |
| assets.updateLocation | id: AssetId, penId: PenId | Asset con currentPenId actualizado | Crea LOCATION\_CHANGED event automáticamente. |

## **assets.create — validación con el VerticalPack**

| `ts` | `// apps/api/src/routers/assets.ts (extracto)` `assets.create: requirePermission(Permission.ASSETS_CREATE)`   `.input(z.object({`     `type: z.string(),`     `payload: z.record(z.unknown()),`     `penId: z.string().optional(),`     `externalId: z.string().optional(),`   `}))`   `.mutation(async ({ input, ctx }) => {`     `const { workspaceId, memberId, db, verticalRegistry } = ctx`     `// Cargar el workspace para conocer el verticalId`     `const workspace = await db.query.workspaces.findFirst({`       `where: eq(workspaces.id, workspaceId!)`     `})`     `// Obtener el VerticalPack activo`     `const pack = verticalRegistry.getActivePack(workspace!.verticalId)`     `// Validar que el tipo de asset existe en el VerticalPack`     `const assetTypeDef = pack.assetTypes.find(at => at.id === input.type)`     `if (!assetTypeDef) {`       `throw new TRPCError({`         `code: "BAD_REQUEST",`         ``message: `Tipo "${input.type}" no existe en el vertical "${pack.id}". ` +``           `` `Tipos válidos: ${pack.assetTypes.map(at => at.id).join(", ")}` ``       `})`     `}`     `// Validar el payload contra el schema Zod del assetType`     `const payloadResult = assetTypeDef.schema.safeParse(input.payload)`     `if (!payloadResult.success) {`       `throw new TRPCError({`         `code: "BAD_REQUEST",`         `message: "Payload inválido",`         `cause: payloadResult.error.flatten()`       `})`     `}`     `// Si el tipo requiere geo, verificar que el pen tiene zona con polígono`     `if (assetTypeDef.geoRequired && input.penId) {`       `const pen = await db.query.pens.findFirst({`         `where: eq(pens.id, input.penId),`         `with: { zone: true }`       `})`       `if (!pen?.zone?.polygon) {`         `throw new TRPCError({`           `code: "BAD_REQUEST",`           `` message: `El tipo "${input.type}" requiere que el corral tenga un polígono de zona declarado.` ``         `})`       `}`     `}`     `// Crear el asset`     `const [asset] = await db.insert(assets).values({`       `type: input.type,`       `status: 'active',`       `workspaceId: workspaceId!,`       `verticalId: workspace!.verticalId,`       `ownerId: memberId!,`       `payload: payloadResult.data,`       `parentIds: [],`       `externalId: input.externalId ?? null,`       `currentPenId: input.penId ?? null,`     `}).returning()`     `return asset`   `}),` |
| :---: | :---- |

## **assets.getDescendants — query de linaje con índice GIN**

| `ts` | `// La query SQL que usa el índice GIN en parentIds[]` `// WITH RECURSIVE navega el árbol de forma eficiente` `async function getDescendants(assetId: AssetId, workspaceId: WorkspaceId): Promise<AssetId[]> {`   `` const result = await db.execute<{ id: string }>(sql` ``     `WITH RECURSIVE descendants AS (`       `-- Base case: assets que tienen este asset como parent directo`       `SELECT id FROM assets`       `WHERE ${assetId} = ANY(parent_ids)`       `AND workspace_id = ${workspaceId}`       `UNION ALL`       `-- Recursive case: assets que tienen un descendiente como parent`       `SELECT a.id FROM assets a`       `INNER JOIN descendants d ON d.id = ANY(a.parent_ids)`       `WHERE a.workspace_id = ${workspaceId}`     `)`     `SELECT id FROM descendants`     `LIMIT 1000  -- Safety limit`   `` `) ``   `return result.map(r => r.id as AssetId)` `}` `// El índice GIN hace esta query eficiente:` `// CREATE INDEX assets_parent_ids_gin_idx ON assets USING GIN(parent_ids)` `// Sin el índice GIN: full scan secuencial → lento con 10k assets` `// Con el índice GIN: < 200ms con 10k assets` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: pnpm db:seed (crear 1000 assets con árbol de 5 niveles) → assets.getDescendants del nodo raíz → \< 200ms. Tiempo documentado en la PR. |
| :---- | :---- |

| TASK 037  apps/api — asset-groups, split y merge routers   ·  Owner: Tech Lead  ·  Est: 10h  ·  Deps: TASK-036, packages/core/event-store (hooks) |
| :---- |

Estas tres operaciones son las más críticas del sistema en términos de consistencia de datos. Cualquier estado intermedio — un asset de input cerrado sin outputs, o un output creado sin que el input esté cerrado — corrompe el linaje. Todas las operaciones son transacciones PostgreSQL atómicas.

|  | ⚠ ATENCIÓN  NUNCA implementar split o merge como múltiples queries separadas. Si la segunda query falla, la primera ya ejecutó y no hay forma de deshacer sin el rollback de la transacción. Usar siempre db.transaction(). |
| :---- | :---- |

## **split router — la operación más usada después de GROUP\_FORMED**

| `ts` | `// apps/api/src/routers/split.ts` `split.createSplit: requirePermission(Permission.ASSETS_SPLIT)`   `.input(z.object({`     `inputAssetId: AssetIdSchema,`     `outputs: z.array(z.object({`       `type: z.string(),        // Tipo del asset output (puede ser el mismo que el input)`       `payload: z.record(z.unknown()),`       `externalId: z.string().optional(),`     `})).min(2),  // Un split produce al menos 2 outputs`     `note: z.string().optional(),  // Razón del split para el EventTimeline`   `}))`   `.mutation(async ({ input, ctx }) => {`     `const { workspaceId, memberId, db, verticalRegistry } = ctx`     `return db.transaction(async (tx) => {`       `// ─── 1. Cargar y validar el asset input ─────────────────────`       `const inputAsset = await tx.query.assets.findFirst({`         `where: and(`           `eq(assets.id, input.inputAssetId),`           `eq(assets.workspaceId, workspaceId!)`         `)`       `})`       `if (!inputAsset) throw new TRPCError({ code: "NOT_FOUND" })`       `if (inputAsset.status !== 'active') {`         `throw new TRPCError({`           `code: "BAD_REQUEST",`           `` message: `No se puede dividir un asset con estado "${inputAsset.status}". Solo se pueden dividir assets activos.` ``         `})`       `}`       `// ─── 2. Verificar split rules del VerticalPack ──────────────`       `const workspace = await tx.query.workspaces.findFirst({ where: eq(workspaces.id, workspaceId!) })`       `const pack = verticalRegistry.getActivePack(workspace!.verticalId)`       `const splitRule = pack.splitRules.find(r => r.inputType === inputAsset.type)`       `if (!splitRule) {`         `throw new TRPCError({`           `code: "BAD_REQUEST",`           `` message: `El tipo "${inputAsset.type}" no tiene reglas de split definidas en el VerticalPack.` ``         `})`       `}`       `// ─── 3. Validar los outputs contra el schema del VerticalPack ─`       `for (const output of input.outputs) {`         `const outputType = pack.assetTypes.find(at => at.id === output.type)`         ``if (!outputType) throw new TRPCError({ code: "BAD_REQUEST", message: `Tipo "${output.type}" inválido.` })``         `const result = outputType.schema.safeParse(output.payload)`         `if (!result.success) throw new TRPCError({ code: "BAD_REQUEST", cause: result.error })`       `}`       `// ─── 4. WORST-CASE COMPLIANCE INHERITANCE ───────────────────`       `// Si el input tiene holds activos, los outputs los heredan.`       `// No se puede "limpiar" un asset contaminado dividiéndolo.`       `const activeHolds = await tx.select().from(holds).where(`         `and(eq(holds.assetId, input.inputAssetId), isNull(holds.resolvedAt))`       `)`       `// ─── 5. TRANSACCIÓN ATÓMICA ──────────────────────────────────`       `// 5a. Cerrar el asset input`       `await tx.update(assets)`         `.set({ status: 'closed', closedAt: new Date() })`         `.where(eq(assets.id, input.inputAssetId))`       `// 5b. Crear los assets output (todos en la misma transacción)`       `const createdOutputs = await Promise.all(input.outputs.map(async (output) => {`         `const [newAsset] = await tx.insert(assets).values({`           `type: output.type,`           `status: 'active',`           `workspaceId: workspaceId!,`           `verticalId: workspace!.verticalId,`           `ownerId: inputAsset.ownerId,  // El owner no cambia`           `payload: output.payload,`           `parentIds: [input.inputAssetId],  // Linaje explícito`           `externalId: output.externalId ?? null,`         `}).returning()`         `return newAsset!`       `}))`       `// 5c. Heredar holds a todos los outputs (worst-case)`       `if (activeHolds.length > 0) {`         `await Promise.all(createdOutputs.flatMap(output =>`           `activeHolds.map(hold =>`             `tx.insert(holds).values({`               `assetId: output.id,`               `workspaceId: workspaceId!,`               `type: hold.type,`               `severity: hold.severity,`               ``reason: `Heredado de split de asset ${input.inputAssetId}: ${hold.reason}`,``               `imposedBy: hold.imposedBy,`               `eventId: hold.eventId,  // El mismo evento origen`             `})`           `)`         `))`         `// Los outputs también quedan locked`         `await tx.update(assets)`           `.set({ status: 'locked' })`           `.where(inArray(assets.id, createdOutputs.map(o => o.id)))`       `}`       `return { inputAsset: { ...inputAsset, status: "closed" }, outputs: createdOutputs, inheritedHolds: activeHolds.length }`     `})`   `})` |
| :---: | :---- |

## **merge router — regla del peor caso**

El merge es similar al split pero en sentido inverso. La diferencia crítica: si CUALQUIERA de los N inputs tiene una alerta, el output la hereda. Sin excepciones. No se puede "diluir" un problema combinando activos problemáticos con activos limpios.

| Validación previa al merge | Por qué es obligatoria |
| :---- | :---- |
| Todos los inputs están en status ACTIVE | No se puede mergear un asset LOCKED en un merge con otros — el merge completo queda locked. |
| Todos los inputs pertenecen al mismo workspaceId | El linaje cross-workspace no está permitido. Usar transfers para mover el asset primero. |
| Todos los inputs tienen el mismo verticalId | No se pueden mergear assets de distintos verticales — no tendría sentido en ningún dominio. |
| Los inputs están cubiertos por una mergeRule del VerticalPack | Si el VerticalPack no define cómo mergear AnimalAsset \+ AnimalAsset, el merge no procede. |
| La suma de pesos (si existe quantitativeField) es coherente | Si los inputs tienen peso declarado, el output no puede declarar más peso que la suma de los inputs. |

|  | ✅ VERIFICACIÓN  Verificación CRÍTICA: merge de un asset ACTIVE \+ un asset con hold activo → los dos inputs quedan CLOSED, el output se crea con status LOCKED heredando el hold. Verificar que NO es posible crear un merge que "limpie" el hold. |
| :---- | :---- |

| TASK 038  apps/api — events router \+ batch signing   ·  Owner: Tech Lead  ·  Est: 6h  ·  Deps: TASK-036, packages/core/event-store |
| :---- |

El events router es el punto de entrada de todos los DomainEvents al sistema. Es el único router que usa directamente el PostgresEventStore del Core — porque el append() del Event Store verifica la firma antes de persistir.

## **events.append — el endpoint más importante del sistema**

| `ts` | `// apps/api/src/routers/events.ts` `events.append: protectedProcedure`   `.input(z.object({`     `// Los campos que llegan del browser (ya firmado)`     `type: z.string(),`     `schemaVersion: z.number().int().positive(),`     `assetId: z.string(),`     `occurredAt: z.string().datetime(),`     `payload: z.record(z.unknown()),`     `signature: z.string().min(64),    // Ed25519 signature hex (firmada en el browser)`     `publicKey: z.string().min(64),    // Ed25519 public key hex del actor`     `employeeId: z.string().optional(),`     `correlationId: z.string().optional(),`   `}))`   `.mutation(async ({ input, ctx }) => {`     `const { workspaceId, memberId, db, verticalRegistry } = ctx`     `// ─── 1. Verificar que el evento existe en el VerticalPack ─────`     `const workspace = await db.query.workspaces.findFirst({ where: eq(workspaces.id, workspaceId!) })`     `const pack = verticalRegistry.getActivePack(workspace!.verticalId)`     `const eventDef = pack.eventCatalog.find(e => e.type === input.type)`     `if (!eventDef) {`       ``throw new TRPCError({ code: "BAD_REQUEST", message: `Evento "${input.type}" no existe en el vertical "${pack.id}"` })``     `}`     `// ─── 2. Verificar que el actor tiene permiso para firmar este evento ─`     `const member = await db.query.workspaceMembers.findFirst({ where: eq(workspaceMembers.id, memberId!) })`     `const canSign = eventDef.allowedRoles.some(role => member!.roles.includes(role))`     `if (!canSign) {`       `throw new TRPCError({`         `code: "FORBIDDEN",`         `` message: `Tu rol no puede firmar eventos de tipo "${input.type}". Roles permitidos: ${eventDef.allowedRoles.join(", ")}` ``       `})`     `}`     `// ─── 3. Validar el payload contra el schema del evento ────────`     `const payloadResult = eventDef.payloadSchema.safeParse(input.payload)`     `if (!payloadResult.success) {`       `throw new TRPCError({ code: "BAD_REQUEST", message: "Payload inválido", cause: payloadResult.error.flatten() })`     `}`     `// ─── 4. Construir el DomainEvent ─────────────────────────────`     `const event: DomainEvent = {`       `id: EventId(createId()),`       `type: input.type,`       `schemaVersion: input.schemaVersion,`       `assetId: AssetId(input.assetId),`       `workspaceId: WorkspaceId(workspaceId!),`       `actorId: WorkspaceMemberId(memberId!),`       `employeeId: input.employeeId ? EmployeeId(input.employeeId) : null,`       `signature: input.signature,`       `publicKey: input.publicKey,`       `occurredAt: new Date(input.occurredAt),`       `createdAt: new Date(),`       `correlationId: input.correlationId ?? null,`       `payload: payloadResult.data,`     `}`     `// ─── 5. append() del Event Store verifica la firma ANTES de persistir ─`     `const result = await eventStore.append(event)`     `if (!result.ok) {`       `if (result.error === "INVALID_SIGNATURE") {`         `throw new TRPCError({`           `code: "BAD_REQUEST",`           `message: "La firma Ed25519 del evento es inválida. Verificar que la clave privada es la correcta para este Workspace."`         `})`       `}`       `throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })`     `}`     `// ─── 6. Side effects del evento (via hooks del VerticalPack) ──`     `// Los hooks se ejecutan DESPUÉS de persistir (no bloquean la respuesta)`     `await runEventSideEffects(event, pack, db)`     `return event`   `})` `// ─── BATCH SIGNING ────────────────────────────────────────────────` `// 1 firma del actor → N eventos con el mismo correlationId` `// Útil para: pesada masiva (100 animales), vacunación en campaña (50 animales)` `events.appendBatch: protectedProcedure`   `.input(z.object({`     `events: z.array(z.object({`       `assetId: z.string(),`       `type: z.string(),`       `payload: z.record(z.unknown()),`       `occurredAt: z.string().datetime(),`     `})).min(1).max(500),  // Max 500 eventos por batch`     `// La firma se hace sobre canonicalJson(batch completo)`     `batchSignature: z.string().min(64),`     `publicKey: z.string().min(64),`     `correlationId: z.string(),`   `}))`   `.mutation(async ({ input, ctx }) => {`     `// Verificar la firma del batch completo`     `// Crear N eventos individuales con correlationId compartido`     `// Si CUALQUIER evento falla validación → rollback de TODOS`   `})` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: POST events.append con signature="invalid" → 400 "La firma Ed25519 del evento es inválida". POST con signature válida pero tipo no permitido para el rol → 403 "Tu rol no puede firmar...". POST válido → 201 \+ evento en DB con trigger anti-tampering activo. |
| :---- | :---- |

| TASK 039  apps/api — holds router   ·  Owner: Tech Lead  ·  Est: 4h  ·  Deps: TASK-036, TASK-038 |
| :---- |

El holds router gestiona las restricciones activas sobre assets. Solo ciertos roles pueden imponer holds y solo ciertos roles pueden levantarlos. La asimetría es intencional: el que impone no siempre puede levantar.

| Operación | Permiso requerido | Quién puede en Livestock | Comportamiento |
| :---- | :---- | :---- | :---- |
| holds.impose | HOLDS\_IMPOSE | BovineProducer (solo VETERINARY\_HOLD), Veterinarian, SenasaInspector | Activa el hold. El asset pasa a LOCKED o QUARANTINE según holdType. |
| holds.lift | HOLDS\_LIFT | Solo el rol que lo impuso O un rol superior (SenasaInspector puede levantar todos) | Levanta el hold. El asset vuelve a ACTIVE si no hay otros holds activos. |
| holds.list | ASSETS\_READ | Cualquier miembro con acceso al Workspace | Lista holds activos del workspace o de un asset específico. |

| `ts` | `// apps/api/src/routers/holds.ts (extracto)` `holds.impose: requirePermission(Permission.HOLDS_IMPOSE)`   `.input(z.object({`     `assetId: z.string(),`     `type: z.enum(["SANITARY", "REGULATORY", "LEGAL", "VETERINARY"]),`     `severity: z.enum(["low", "medium", "high", "critical"]),`     `reason: z.string().min(10),  // Razón obligatoria y descriptiva`     `eventId: z.string(),  // El evento que originó el hold (debe ser de este asset)`   `}))`   `.mutation(async ({ input, ctx }) => {`     `return ctx.db.transaction(async (tx) => {`       `// 1. Crear el hold en la tabla holds`       `const [hold] = await tx.insert(holds).values({`         `assetId: input.assetId,`         `workspaceId: ctx.workspaceId!,`         `type: input.type,`         `severity: input.severity,`         `reason: input.reason,`         `imposedBy: ctx.memberId!,`         `eventId: input.eventId,`       `}).returning()`       `// 2. Actualizar el status del asset`       `const newStatus = input.type === "REGULATORY" ? "quarantine" : "locked"`       `await tx.update(assets)`         `.set({ status: newStatus })`         `.where(eq(assets.id, input.assetId))`       `// 3. Encolar email de alerta si severity >= high`       `if (["high", "critical"].includes(input.severity)) {`         `await alertEmailQueue.add("hold-alert", { assetId: input.assetId, holdId: hold!.id })`       `}`       `return hold`     `})`   `})` `// holds.lift — solo el imposer o un rol superior puede levantar` `holds.lift: requirePermission(Permission.HOLDS_LIFT)`   `.input(z.object({ holdId: z.string() }))`   `.mutation(async ({ input, ctx }) => {`     `const hold = await ctx.db.query.holds.findFirst({ where: eq(holds.id, input.holdId) })`     `if (!hold) throw new TRPCError({ code: "NOT_FOUND" })`     `// Verificar que el actor es el imposer o tiene autoridad superior`     `// (La lógica de "autoridad superior" la define el VerticalPack)`     `if (hold.imposedBy !== ctx.memberId) {`       `const member = await ctx.db.query.workspaceMembers.findFirst({ where: eq(workspaceMembers.id, ctx.memberId!) })`       `const pack = ctx.verticalRegistry.getActivePack((await ctx.db.query.workspaces.findFirst({ where: eq(workspaces.id, ctx.workspaceId!) }))!.verticalId)`       `// Verificar si el rol del actor puede levantar holds de este tipo`       `// (definido en el VerticalPack como "canLiftHoldTypes")`       `const canLift = pack.actorTypes`         `.filter(at => member!.roles.includes(at.id))`         `.some(at => at.permissions.includes(Permission.HOLDS_LIFT))`       `if (!canLift) throw new TRPCError({ code: "FORBIDDEN", message: "No tenés autoridad para levantar este hold." })`     `}`     `return ctx.db.transaction(async (tx) => {`       `// Marcar el hold como resuelto`       `await tx.update(holds)`         `.set({ resolvedBy: ctx.memberId!, resolvedAt: new Date() })`         `.where(eq(holds.id, input.holdId))`       `// Si no quedan holds activos, volver el asset a ACTIVE`       `const remainingHolds = await tx.select().from(holds).where(`         `and(eq(holds.assetId, hold.assetId), isNull(holds.resolvedAt))`       `)`       `if (remainingHolds.length === 0) {`         `await tx.update(assets).set({ status: "active" }).where(eq(assets.id, hold.assetId))`       `}`     `})`   `})` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: imposer un hold → asset pasa a LOCKED. Intentar hold.lift con un actor sin HOLDS\_LIFT → 403\. Hold.lift con el imposer → asset vuelve a ACTIVE solo si no quedan otros holds activos. |
| :---- | :---- |

| TASK 040  apps/platform — Operations Dashboard — Assets y Eventos   ·  Owner: Frontend Dev  ·  Est: 12h  ·  Deps: TASK-031, TASK-036, TASK-038 |
| :---- |

El Operations Dashboard es donde vive el trabajo diario de cada actor. Es completamente agnóstico al vertical — el vocabulario, los tipos de asset y los formularios de eventos vienen del VerticalPack activo del Workspace.

## **/\[wsId\]/assets — la tabla de assets**

* Columnas: status badge, tipo (del VerticalPack), EID/externalId (font-mono), owner (Avatar \+ nombre), última actividad (fecha relativa), acciones (ver, más).

* Filtros en la parte superior: status (multi-select), tipo (del VerticalPack), pen (jerarquía Facility → Zone → Pen), texto libre (busca en externalId y payload).

* Click en una fila → /\[wsId\]/assets/\[id\].

* Botón "Registrar \[assetLabel\]" (el label viene del VerticalPack) → abre modal con DynamicFormRenderer del assetType elegido.

## **/\[wsId\]/assets/\[id\] — 4 tabs**

| Tab | Contenido |
| :---- | :---- |
| Información | Payload del asset renderizado como tabla de key-value (tipificado: strings como texto, numbers con unidad, fechas formateadas). AssetStatusBadge prominente. Si tiene hold activo: banner rojo con el tipo y razón. |
| Timeline | EventTimeline completo con todos los eventos. Lazy loading. SignatureBadge por evento. Botón "Registrar evento" en la parte superior → modal con selector de tipo \+ DynamicFormRenderer. |
| Mapa | AssetMap con: polígono de la Zone actual (color por gfwStatus), historial de movimientos (polyline), marcador en la Pen actual. Solo visible si el VerticalPack tiene geoRequirements \= true. |
| Documentos | EvidenceThumbs de todos los archivos adjuntos al asset (de todos sus eventos). SHA-256 visible. Estado ClamAV. Botón de descarga individual. |

## **El formulario de firma de eventos — el flujo más crítico de la UI**

| `ts` | `// apps/platform/src/components/EventSigningModal.tsx` `'use client'` `import { useState } from 'react'` `import { DynamicFormRenderer } from '@biffco/ui/domain'` `import { signEvent } from '@biffco/core/crypto'` `import { useTRPC } from '@/lib/trpc'` `import { canonicalJson } from '@biffco/shared'` `interface Props {`   `assetId: string`   `workspaceId: string`   `verticalPack: VerticalPack`   `onSuccess: () => void` `}` `export function EventSigningModal({ assetId, workspaceId, verticalPack, onSuccess }: Props) {`   `const [selectedType, setSelectedType] = useState<string | null>(null)`   `const [isSubmitting, setIsSubmitting] = useState(false)`   `const trpc = useTRPC()`   `// Solo mostrar los tipos de evento permitidos para el rol del actor actual`   `const { data: memberPermissions } = trpc.auth.getMyPermissions.useQuery()`   `const allowedEventTypes = verticalPack.eventCatalog.filter(e =>`     `e.allowedRoles.some(role => memberPermissions?.includes(role))`   `)`   `const handleSubmit = async (payload: Record<string, unknown>) => {`     `if (!selectedType) return`     `setIsSubmitting(true)`     `try {`       `// 1. Leer la clave privada del sessionStorage`       `const { getActivePrivateKey } = await import('@/lib/wallet')`       `const privateKey = await getActivePrivateKey(workspaceId)`       `if (!privateKey) throw new Error("No hay clave privada en sesión. Reconectá tu wallet.")`       `// 2. Construir el payload firmable`       `const signable = {`         `type: selectedType,`         `schemaVersion: 1,`         `assetId,`         `workspaceId,`         `actorId: memberPermissions!.memberId,`         `occurredAt: new Date().toISOString(),`         `payload`       `}`       `// 3. Firmar en el browser con la clave privada del sessionStorage`       `const signature = await signEvent(signable, privateKey)`       `// 4. Enviar al API (solo la clave PÚBLICA viaja al servidor)`       `await trpc.events.append.mutate({`         `...signable,`         `signature,`         `publicKey: memberPermissions!.publicKey,  // La clave PÚBLICA del miembro`       `})`       `onSuccess()`     `} finally {`       `setIsSubmitting(false)`     `}`   `}`   `const selectedEventDef = verticalPack.eventCatalog.find(e => e.type === selectedType)`   `return (`     `<div>`       `<EventTypeSelector types={allowedEventTypes} onSelect={setSelectedType} />`       `{selectedEventDef && (`         `<DynamicFormRenderer`           `schema={selectedEventDef.uiSchema}`           `onSubmit={handleSubmit}`           `submitLabel="Firmar y Registrar"`           `isLoading={isSubmitting}`         `/>`       `)}`     `</div>`   `)` `}` |
| :---: | :---- |

| TASK 041  apps/platform — UI de Group, Split y Merge   ·  Owner: Frontend Dev  ·  Est: 8h  ·  Deps: TASK-037, TASK-040 |
| :---- |

## **/\[wsId\]/groups — gestión de AssetGroups**

* Lista de AssetGroups activos: tipo (GROUP, TRANSFER, EXPORT), cantidad de assets, fecha de creación.

* Crear grupo: checkbox multi-select de assets \+ botón "Agrupar seleccionados". GROUP\_FORMED automático.

* Ver grupo: lista de assets del grupo con sus status badges. Botón "Disolver" (GROUP\_DISSOLVED).

## **/\[wsId\]/split — dividir un asset**

* Paso 1: seleccionar el asset a dividir (solo assets en status ACTIVE). Mostrar el status y cualquier hold activo.

* Paso 2: declarar los outputs. Para cada output: tipo (del VerticalPack), payload (DynamicFormRenderer del assetType), externalId opcional.

* Si el input tiene holds activos: banner amarillo ANTES de confirmar — "⚠ Este asset tiene N holds activos. Los assets resultantes heredarán estos holds automáticamente."

* Botón "Confirmar split": llama a split.createSplit. En respuesta: mostrar los N nuevos assets creados con sus IDs.

## **/\[wsId\]/merge — combinar N assets**

* Paso 1: seleccionar los assets a combinar (multi-select, todos deben ser del mismo tipo compatible según mergeRules).

* Paso 2: si CUALQUIERA de los seleccionados tiene holds activos: banner rojo prominente — "❌ El asset \[EID\] tiene un hold activo de tipo \[tipo\]. El asset resultante heredará este hold. ¿Querés continuar?"

* Paso 3: declarar el output (tipo \+ payload \+ externalId).

* Botón "Confirmar merge": llama a merge.createMerge.

|  | ✅ VERIFICACIÓN  Verificación: demo de la UI de merge con un asset limpio \+ un asset con hold activo. El banner rojo debe aparecer ANTES de que el usuario confirme. El output creado debe estar LOCKED con el hold heredado. |
| :---- | :---- |

# **17\. Phase Gate B.2 — Criterios de cierre del Sprint B.2**

| ID | Criterio | Cómo verificarlo | Responsable | Prioridad |
| :---- | :---- | :---- | :---- | :---- |
| GB2-01 | events.append rechaza firma inválida con 400 descriptivo | POST events.append con signature="deadbeef..." → 400 "La firma Ed25519 del evento es inválida" | Tech Lead | 🔴 CRÍTICO |
| GB2-02 | El EventTimeline muestra SignatureBadge ✓ para eventos firmados correctamente | Demo: crear asset → firmar evento → ver /assets/\[id\]/tabs/timeline → SignatureBadge ✓ verde | Frontend Dev | 🔴 CRÍTICO |
| GB2-03 | SPLIT atómico — fallo en output N → rollback total | Test: split con 3 outputs donde el 3ro tiene payload inválido → input sigue ACTIVE, 0 outputs en DB | Tech Lead | 🔴 CRÍTICO |
| GB2-04 | MERGE worst-case: asset con hold \+ asset limpio → output hereda hold | merge(asset\_con\_hold, asset\_limpio) → output.status \= "locked", hold heredado en DB | Tech Lead | 🔴 CRÍTICO |
| GB2-05 | UI de merge muestra el warning de compliance ANTES de confirmar | Demo manual: seleccionar asset con hold → banner rojo visible antes del botón confirmar | Frontend Dev | 🔴 CRÍTICO |
| GB2-06 | split.createSplit: concurrencia — 2 requests simultáneos → 1 succeed, 1 fail | Test de concurrencia con k6 o ab: 2 splits del mismo asset en paralelo → 1 × 200, 1 × 409 | Tech Lead | 🔴 CRÍTICO |
| GB2-07 | assets.getDescendants \< 200ms con 1000 assets | Benchmark documentado: getDescendants de root con 1000 descendants → time \< 200ms | Tech Lead | 🔴 CRÍTICO |
| GB2-08 | holds.lift: actor sin HOLDS\_LIFT → 403 | POST holds.lift con actor sin el permiso → 403 con mensaje descriptivo | Tech Lead | 🔴 CRÍTICO |
| GB2-09 | E2E B.2: crear asset → firmar evento → group → split → merge (CI verde) | pnpm playwright:run e2e/b2-operations.spec.ts → PASS | Ambos | 🔴 CRÍTICO |
| GB2-10 | DynamicFormRenderer: formulario de firma con 9 widgets funciona en /events/new | Demo: seleccionar un evento con todos los tipos de widget → formulario completo funciona | Frontend Dev | 🟡 RECOMENDADO |
| GB2-11 | Batch signing: 50 eventos con 1 firma → todos en DB con mismo correlationId | POST events.appendBatch con 50 items → 50 eventos en DB, mismo correlationId | Tech Lead | 🟡 RECOMENDADO |

| TASK 042  AWS S3 \+ Object Lock WORM \+ ClamAV \+ CloudFront   ·  Owner: Tech Lead  ·  Est: 8h  ·  Deps: Doppler con AWS\_ACCESS\_KEY\_ID, AWS\_SECRET\_ACCESS\_KEY |
| :---- |

Las evidencias (fotos, PDFs, documentos) son parte del historial irrefutable de un asset. Deben ser tan inmutables como los eventos. AWS S3 con Object Lock en modo COMPLIANCE garantiza que ni el equipo de BIFFCO ni AWS pueden eliminar un archivo durante el período de retención (7 años para el EUDR).

|  | Object Lock en modo COMPLIANCE es irreversible. Si activás el lock en el bucket, no podés desactivarlo. Si configurás una retención de 7 años en un objeto, nadie puede eliminarlo antes. Esto es exactamente lo que necesitamos, pero hay que entenderlo antes de activarlo. |
| :---- | :---- |

## **Paso 1: Crear el bucket S3 con Object Lock**

| `bash` | `# CLI setup (una sola vez por entorno)` `# IMPORTANTE: Object Lock solo se puede habilitar al CREAR el bucket, no después` `# Bucket de staging` `$ aws s3api create-bucket \`     `--bucket biffco-evidence-staging \`     `--region us-east-1 \`     `--object-lock-enabled-for-bucket` `# Bucket de prod` `$ aws s3api create-bucket \`     `--bucket biffco-evidence-prod \`     `--region us-east-1 \`     `--object-lock-enabled-for-bucket` `# Configurar retención por defecto: COMPLIANCE mode, 7 años = 2557 días` `$ aws s3api put-object-lock-configuration \`     `--bucket biffco-evidence-staging \`     `--object-lock-configuration '{`       `"ObjectLockEnabled": "Enabled",`       `"Rule": {`         `"DefaultRetention": {`           `"Mode": "COMPLIANCE",`           `"Days": 2557`         `}`       `}`     `}'` `# Bloquear acceso público` `$ aws s3api put-public-access-block \`     `--bucket biffco-evidence-staging \`     `--public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"` |
| :---: | :---- |

## **Paso 2: El flujo de upload — cliente → S3 → ClamAV → Object Lock**

| Paso | Quién ejecuta | Qué pasa |
| :---- | :---- | :---- |
| 1\. Calcular SHA-256 | Browser (WebCrypto API) | El cliente calcula el SHA-256 del archivo antes de subirlo. Este hash es lo que se registra en el evento. |
| 2\. Solicitar presigned URL | Browser → apps/api | POST /trpc/upload.getSignedUrl con el SHA-256 calculado. El API genera un S3 presigned URL (PUT, TTL 10 min) con el header x-amz-checksum-sha256 obligatorio. |
| 3\. Upload directo a S3 | Browser → S3 directamente | El archivo viaja directo de browser a S3. No pasa por el API de BIFFCO. S3 verifica el SHA-256 del header. |
| 4\. Confirmar upload | Browser → apps/api | POST /trpc/upload.confirmUpload con el s3Key. El API encola el archivo para ClamAV scan. |
| 5\. ClamAV scan | Worker en Railway | ClamAV descarga el archivo de S3, lo escanea. Si pasa: activa el Object Lock. Si falla: elimina el archivo y notifica. |
| 6\. Usar en evento | Browser → apps/api | El file-upload widget del DynamicFormRenderer incluye el {hash, s3Key, mimeType, sizeBytes} en el payload del evento. |

## **upload router en apps/api**

| `ts` | `// apps/api/src/routers/upload.ts` `import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'` `import { getSignedUrl } from '@aws-sdk/s3-request-presigner'` `import { env } from '@biffco/config'` `const s3 = new S3Client({`   `region: "us-east-1",`   `credentials: {`     `accessKeyId: env.AWS_ACCESS_KEY_ID!,`     `secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,`   `},` `})` `upload.getSignedUrl: protectedProcedure`   `.input(z.object({`     `filename: z.string().max(255),`     `mimeType: z.string(),`     `sizeBytes: z.number().max(50 * 1024 * 1024),  // Max 50MB`     `sha256: z.string().length(64),  // SHA-256 hex calculado en el browser`   `}))`   `.mutation(async ({ input, ctx }) => {`     `` const key = `${ctx.workspaceId}/${createId()}-${sanitizeFilename(input.filename)}` ``     `const command = new PutObjectCommand({`       `Bucket: env.AWS_S3_BUCKET!,`       `Key: key,`       `ContentType: input.mimeType,`       `ContentLength: input.sizeBytes,`       `// S3 verifica que el SHA-256 del archivo subido coincide con este header`       `ChecksumSHA256: Buffer.from(input.sha256, "hex").toString("base64"),`       `// Metadata para el lifecycle`       `Metadata: {`         `"x-biffco-workspace": ctx.workspaceId!,`         `"x-biffco-uploaded-by": ctx.memberId!,`         `"x-biffco-uploaded-at": new Date().toISOString(),`       `}`     `})`     `const signedUrl = await getSignedUrl(s3, command, { expiresIn: 600 })  // 10 min`     `return { signedUrl, key }`   `})` `upload.confirmUpload: protectedProcedure`   `.input(z.object({ key: z.string(), sha256: z.string().length(64) }))`   `.mutation(async ({ input, ctx }) => {`     `// Encolar para ClamAV scan`     `await clamavQueue.add("scan", {`       `key: input.key,`       `workspaceId: ctx.workspaceId,`       `sha256: input.sha256,`     `})`     `return { key: input.key, status: "scanning" }`   `})` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación crítica: intentar DELETE de un objeto con Object Lock activo → AccessDenied. Subir un archivo con el EICAR test string → ClamAV detecta y elimina el archivo. Subir un archivo limpio → ClamAV pasa → Object Lock activado. |
| :---- | :---- |

| TASK 043  packages/pdf — AssetPassport genérico con @react-pdf/renderer   ·  Owner: Tech Lead  ·  Est: 6h  ·  Deps: TASK-042 |
| :---- |

El Asset Passport es el documento oficial que acompaña a cada asset en la cadena. Es descargable desde verify.biffco.co sin autenticación. Está generado al momento de la descarga — siempre refleja el estado más reciente de la cadena.

## **Secciones del AssetPassport**

| Sección | Contenido |
| :---- | :---- |
| Header | Logo BIFFCO \+ QR code que apunta a verify.biffco.co/\[assetId\] \+ txHash del último anchor (font-mono) |
| Información del activo | ID, tipo, status, externalId (EID, número de lote, etc.), workspace de origen, fecha de creación. |
| Chain of Custody | Tabla de todos los eventos: fecha, tipo de evento, actor firmante (nombre \+ clave pública truncada), estado de firma (✓/✗). |
| Linaje | Si el asset tiene parentIds: árbol de ancestros hasta el origen, con tipo de transformación en cada arista. |
| Compliance | Estado EUDR: polígono de zona, resultado GFW check, fecha de la última inspección relevante. |
| Evidencias | Lista de documentos adjuntos con SHA-256 truncado y fecha de subida. |
| Footer | Texto legal. URL de verificación. "Verificable independientemente en blockchain sin necesidad de confiar en BIFFCO." |

| TASK 044  apps/api — transfers router (doble firma)   ·  Owner: Tech Lead  ·  Est: 8h  ·  Deps: TASK-036, packages/email |
| :---- |

El transfer es la operación que mueve la propiedad de un asset de un Workspace a otro. Requiere exactamente dos firmas: la del cedente (al iniciar) y la del receptor (al aceptar). Ninguna de las dos partes puede operar unilateralmente.

| Estado | Quién lo activa | Assets | Descripción |
| :---- | :---- | :---- | :---- |
| pending | Cedente (TRANSFER\_INITIATED) | ownerId no cambia aún | La TransferOffer está creada. El receptor fue notificado. Expira en 72h. |
| in\_transit | Carrier (TRANSFER\_IN\_TRANSIT) | custodianId \= Carrier | El carrier firmó el manifiesto. Los assets están físicamente en tránsito. |
| completed | Receptor (TRANSFER\_ACCEPTED) | ownerId \= receptor, custodianId \= receptor | El receptor firmó la aceptación. Owner y custodian cambian atómicamente. |
| rejected | Receptor (TRANSFER\_REJECTED) | ownerId no cambia | El receptor rechazó. Los assets vuelven a estar disponibles para el cedente. |
| expired | Sistema (cron job) | ownerId no cambia | Pasaron 72h sin respuesta del receptor. |

| TASK 045  apps/platform — UI de transfers \+ EvidenceUploader   ·  Owner: Frontend Dev  ·  Est: 8h  ·  Deps: TASK-042, TASK-044, TASK-031 |
| :---- |

La UI de transfers cubre los dos roles: el cedente que inicia y el receptor que acepta/rechaza. El EvidenceUploader integra el flujo completo de SHA-256 \+ S3 \+ ClamAV en un componente drag & drop.

## **EvidenceUploader — el flujo completo en un componente**

| `ts` | `// packages/ui/src/components/domain/EvidenceUploader.tsx` `'use client'` `import { useCallback, useState } from 'react'` `import { useDropzone } from 'react-dropzone'` `import { IconUpload, IconFile, IconCheck, IconAlertTriangle } from '@tabler/icons-react'` `import { useTRPC } from '@/lib/trpc'` `type UploadState = 'idle' | 'hashing' | 'uploading' | 'scanning' | 'ready' | 'infected'` `export function EvidenceUploader({ onUploadComplete }: {`   `onUploadComplete: (result: { hash: string; s3Key: string; mimeType: string; sizeBytes: number }) => void` `}) {`   `const [state, setState] = useState<UploadState>("idle")`   `const [progress, setProgress] = useState(0)`   `const [hash, setHash] = useState<string | null>(null)`   `const trpc = useTRPC()`   `const onDrop = useCallback(async (files: File[]) => {`     `const file = files[0]`     `if (!file) return`     `// 1. Calcular SHA-256 en el browser ANTES de subir`     `setState('hashing')`     `const arrayBuffer = await file.arrayBuffer()`     `const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer)`     `const sha256 = Array.from(new Uint8Array(hashBuffer))`       `.map(b => b.toString(16).padStart(2, "0")).join("")`     `setHash(sha256)`     `// 2. Solicitar presigned URL`     `const { signedUrl, key } = await trpc.upload.getSignedUrl.mutate({`       `filename: file.name,`       `mimeType: file.type,`       `sizeBytes: file.size,`       `sha256`     `})`     `// 3. Upload directo a S3 (no pasa por el API de BIFFCO)`     `setState('uploading')`     `await fetch(signedUrl, {`       `method: "PUT",`       `body: file,`       `headers: {`         `"Content-Type": file.type,`         `"x-amz-checksum-sha256": btoa(String.fromCharCode(...new Uint8Array(hashBuffer)))`       `},`       `...(xhr => { xhr.upload.onprogress = (e) => setProgress(Math.round(e.loaded/e.total*100)) })`     `})`     `// 4. Confirmar upload (encola ClamAV scan)`     `setState('scanning')`     `await trpc.upload.confirmUpload.mutate({ key, sha256 })`     `// 5. Polling del estado del scan (cada 2 segundos)`     `const scanResult = await pollScanStatus(key)`     `if (scanResult === "infected") {`       `setState('infected')`       `return`     `}`     `setState('ready')`     `onUploadComplete({ hash: sha256, s3Key: key, mimeType: file.type, sizeBytes: file.size })`   `}, [trpc, onUploadComplete])`   `const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1 })`   `return (`     `<div {...getRootProps()} className="...">`       `<input {...getInputProps()} />`       `{state === "idle" && <DropZoneIdle isDragActive={isDragActive} />}`       `{state === "hashing" && <span>Calculando SHA-256...</span>}`       `{state === "uploading" && <ProgressBar progress={progress} />}`       `{state === "scanning" && <ScanningIndicator />}`       `{state === "ready" && <UploadedFile hash={hash!} />}`       `{state === "infected" && <InfectedAlert />}`     `</div>`   `)` `}` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: subir un archivo de 10MB con el EvidenceUploader. El SHA-256 calculado en el browser debe coincidir con el que S3 verifica (si no coincide, S3 rechaza con 400 y el componente muestra el error). El hash debe aparecer en el payload del evento después de firmar. |
| :---- | :---- |

| TASK 046  apps/verify — verify.biffco.co completo (LCP \< 500ms)   ·  Owner: Frontend Dev  ·  Est: 10h  ·  Deps: TASK-042, TASK-043, packages/core/crypto |
| :---- |

verify.biffco.co es la cara pública de BIFFCO. No requiere cuenta. No requiere JavaScript para el contenido principal (SSR en Edge). Cualquier persona con el QR de un asset puede verificar su cadena de custodia en \< 500ms. La verificación es independiente de BIFFCO — las firmas Ed25519 se verifican con Web Crypto API en el Edge Runtime.

## **Arquitectura de verify.biffco.co**

| `ts` | `// apps/verify/src/app/[assetId]/page.tsx` `// Edge Runtime — corre en los CDN nodes de Vercel, no en servidores tradicionales` `export const runtime = 'edge'` `export const revalidate = 60  // Cache de 60 segundos por asset` `interface Props { params: { assetId: string } }` `export async function generateMetadata({ params }: Props) {`   `const asset = await fetchAsset(params.assetId)`   `if (!asset) return { title: "Asset no encontrado — BIFFCO" }`   `return {`     ``title: `${asset.type} ${asset.externalId ?? asset.id.slice(0,8)} — BIFFCO`,``     ``description: `Cadena de custodia verificada. ${asset._count.events} eventos firmados.`,``     ``openGraph: { type: 'website', title: `...` }``   `}` `}` `export default async function VerifyPage({ params }: Props) {`   `// Server Component — el contenido principal llega renderizado`   `const [asset, events, ancestors] = await Promise.all([`     `fetchAsset(params.assetId),`     `fetchEvents(params.assetId),`     `fetchAncestors(params.assetId),`   `])`   `if (!asset) return <NotFoundPage />`   `const isCompliant = computeEUDRStatus(asset, events)`   `return (`     `<main>`       `{/* Banner de compliance — visible inmediatamente (SSR) */}`       `<ComplianceBanner status={isCompliant} asset={asset} />`       `{/* EventTimeline — SSR, con verif de firma client-side lazy */}`       `<EventTimeline events={events} />`       `{/* DAGVisualizer — client component, lazy loaded */}`       `<Suspense fallback={<Skeleton />}>`         `<DAGVisualizerClient assetId={params.assetId} ancestors={ancestors} />`       `</Suspense>`       `{/* Descargar PDF */}`       `<DownloadPassportButton assetId={params.assetId} />`     `</main>`   `)` `}` |
| :---: | :---- |

## **Optimizaciones para LCP \< 500ms**

| Optimización | Cómo se implementa | Impacto en LCP |
| :---- | :---- | :---- |
| Server-Side Rendering en Edge | El contenido principal (ComplianceBanner \+ EventTimeline) se renderiza en el CDN node más cercano al usuario. No hay hydration bloqueante. | ↓ 200-300ms vs CSR tradicional |
| Fonts preloaded en \<head\> | Inter y JetBrains Mono con preload. display: swap para no bloquear el render. | ↓ 50-100ms de FOUT |
| No JavaScript innecesario | El contenido principal es HTML puro (SSR). El DAGVisualizer (el único componente pesado) es lazy con Suspense. | ↓ 100-150ms de JS parse |
| Cache en Edge de 60s | Un asset que fue verificado en el último minuto retorna la respuesta cacheada desde el CDN. No hay round trip al API de BIFFCO. | ↓ 100-200ms (cache hit) |
| Imágenes sin \<img\> innecesario | La página de verificación no tiene imágenes decorativas. Solo el QR (si se genera client-side) y el logo SVG (inline). | ↓ eliminadas LCP candidates incorrectas |
| Lighthouse CI en cada PR | Si LCP \> 500ms en el PR → bloquea el merge. | Garantía continua |

|  | ✅ VERIFICACIÓN  Verificación: pnpm lighthouse verify.biffco.co/\[id-de-prueba\] → LCP \< 500ms. Performance \> 90\. Accesibilidad \> 95\. SEO \> 90\. Todas en verde en el CI de Lighthouse. |
| :---- | :---- |

| TASK 047  Offline engine — Workbox Service Worker \+ sync   ·  Owner: Frontend Dev  ·  Est: 8h  ·  Deps: TASK-031, TASK-038 |
| :---- |

El caso de uso crítico del offline engine es el Carrier (transportista): firma el manifiesto de carga en ruta donde no hay señal. Las firmas son locales (la clave privada está en sessionStorage), por lo que el proceso criptográfico no requiere red. Lo que requiere red es el envío al API, que se difiere hasta que hay conectividad.

## **Arquitectura del offline engine**

| `ts` | `// apps/platform/src/service-worker/sw.ts` `// Este archivo se registra como Service Worker en el navegador` `import { registerRoute } from 'workbox-routing'` `import { StaleWhileRevalidate, NetworkFirst, CacheFirst } from 'workbox-strategies'` `import { BackgroundSyncPlugin } from 'workbox-background-sync'` `// ─── Estrategias de cache ──────────────────────────────────────────` `// Assets estáticos (JS, CSS, fonts): CacheFirst — rara vez cambian` `registerRoute(({ request }) => request.destination === 'script' || request.destination === 'style',`   `new CacheFirst({ cacheName: "static-assets", plugins: [/*...*/] })` `)` `// API requests: NetworkFirst — intentar red, fallar en cache` `registerRoute(({ url }) => url.pathname.startsWith('/trpc'),`   `new NetworkFirst({ cacheName: "api-cache", networkTimeoutSeconds: 5 })` `)` `// ─── Background Sync para eventos firmados ──────────────────────` `// Los eventos que no pudieron enviarse al API se encolan aquí` `const syncPlugin = new BackgroundSyncPlugin("events-sync-queue", {`   `maxRetentionTime: 24 * 60,  // Retener por 24 horas`   `onSync: async ({ queue }) => {`     `let entry`     `// Replay en orden estricto (occurredAt ASC)`     `while ((entry = await queue.shiftRequest())) {`       `try {`         `await fetch(entry.request.clone())`       `} catch (e) {`         `await queue.unshiftRequest(entry)  // Reencolar si falla`         `throw e`       `}`     `}`   `}` `})` `// La ruta de events.append usa el sync plugin` `registerRoute(({ url }) => url.pathname.includes('events.append'),`   `new NetworkFirst({`     `cacheName: "events-outbox",`     `plugins: [syncPlugin],`     `networkTimeoutSeconds: 5,`   `})` `)` |
| :---: | :---- |

## **El flujo completo offline → online**

| Momento | ¿Hay red? | Qué pasa |
| :---- | :---- | :---- |
| Carrier abre apps/platform | Sí | Service Worker se instala (si no estaba). Assets estáticos cacheados. |
| Carrier entra al camión, pierde señal | No | La app sigue funcionando — datos del asset en cache. El topbar muestra SyncStatusBadge "Sin conexión". |
| Carrier firma TRANSFER\_IN\_TRANSIT (sin señal) | No | La firma Ed25519 ocurre en el browser con la clave privada del sessionStorage. El evento firmado se guarda en IndexedDB. SyncStatusBadge "1 evento pendiente". |
| Carrier firma N eventos más (sin señal) | No | Cada evento firmado se agrega a la cola de IndexedDB en orden. SyncStatusBadge "N eventos pendientes". |
| Carrier llega a destino, recupera señal | Sí | Service Worker detecta la reconexión. Trigger manual o automático del Background Sync. |
| Background Sync en ejecución | Sí | Los N eventos de la cola se envían al API en orden estricto (occurredAt ASC). Si uno falla: los siguientes quedan en cola. SyncStatusBadge "Sincronizando..." → "Sincronizado". |
| Receptor ve el asset en su dashboard | Sí | Los eventos del Carrier aparecen en el EventTimeline del asset con SignatureBadge ✓. |

|  | ✅ VERIFICACIÓN  Verificación: demo con Chrome DevTools → Offline mode → firmar 3 eventos → ver en IndexedDB → quitar Offline mode → verificar que los 3 eventos aparecen en el EventTimeline del asset en orden cronológico. |
| :---- | :---- |

# **24\. Phase Gate B — Criterios de cierre completos de la Fase B**

El Phase Gate B es la puerta de entrada a la Fase C (Livestock). Si este gate pasa, la plataforma está lista para su primera vertical real. Si no pasa, la Fase C no puede empezar.

|  | El criterio de oro: un developer nuevo (sin conocer Livestock) puede ver el Operations Dashboard y operar un asset del mock VerticalPack — crear, firmar evento, split, merge — sin ayuda. Si necesita preguntar qué significa cada botón, la UI no es suficientemente clara. |
| :---- | :---- |

## **Ítems del Phase Gate B final**

| ID | Criterio | Cómo verificarlo | Responsable | Prioridad |
| :---- | :---- | :---- | :---- | :---- |
| GB-01 | Todos los ítems del Phase Gate B.1 siguen en ✅ | Ejecutar checklist GB1-xx completo | Ambos | 🔴 CRÍTICO |
| GB-02 | Todos los ítems del Phase Gate B.2 siguen en ✅ | Ejecutar checklist GB2-xx completo | Ambos | 🔴 CRÍTICO |
| GB-03 | verify.biffco.co: LCP \< 500ms en Lighthouse CI | pnpm lighthouse:ci → LCP pass en staging | Frontend Dev | 🔴 CRÍTICO |
| GB-04 | verify.biffco.co: firma Ed25519 verificada en Edge Runtime | SignatureBadge ✓ en verify.biffco.co para un evento firmado real | Frontend Dev | 🔴 CRÍTICO |
| GB-05 | S3 Object Lock: archivo subido no se puede eliminar | aws s3api delete-object → AccessDenied | Tech Lead | 🔴 CRÍTICO |
| GB-06 | ClamAV: archivo con EICAR test string → eliminado \+ log | Subir EICAR → archivo eliminado de S3, log en DB | Tech Lead | 🔴 CRÍTICO |
| GB-07 | Transfer E2E con doble firma | Playwright: WS-A inicia transfer → WS-B acepta → asset.ownerId \= WS-B | Ambos | 🔴 CRÍTICO |
| GB-08 | Offline signing E2E | Demo con Offline mode en Chrome DevTools → 3 eventos → reconectar → 3 eventos en API en orden | Frontend Dev | 🔴 CRÍTICO |
| GB-09 | EvidenceUploader: SHA-256 browser \= SHA-256 S3 | Subir archivo → verificar que el hash calculado en browser coincide con el que S3 registra | Frontend Dev | 🔴 CRÍTICO |
| GB-10 | AssetPassport PDF descargable desde verify.biffco.co | Abrir verify.biffco.co/\[id\] → Descargar Asset Passport → PDF con la cadena completa | Tech Lead | 🔴 CRÍTICO |
| GB-11 | E2E B completo: setup → asset → eventos → split → merge → transfer → verify | Playwright: flujo completo de punta a punta (CI verde) | Ambos | 🔴 CRÍTICO |
| GB-12 | RLS multi-tenant: 5 queries cruzadas retornan 0 | Script de audit: ws-A con JWT de ws-B → 0 resultados en assets, events, facilities | Tech Lead | 🔴 CRÍTICO |
| GB-13 | Lighthouse Performance apps/platform \> 75 en rutas principales | /assets, /assets/\[id\], /transfers → Performance \> 75 | Frontend Dev | 🟡 RECOMENDADO |
| GB-14 | packages/ui coverage ≥ 75% | pnpm \--filter @biffco/ui coverage → ≥ 75% | Frontend Dev | 🟡 RECOMENDADO |
| GB-15 | Storybook desplegado en Chromatic o Vercel | URL de Storybook accesible. Toda story pasa el snapshot test. | Frontend Dev | 🟡 RECOMENDADO |
| GB-16 | Documento de auditoría docs/phase-audits/fase-b.md commiteado | git log docs/phase-audits/fase-b.md → commit existe | Ambos | 🟡 RECOMENDADO |

# **25\. Troubleshooting — problemas comunes de la Fase B**

| Problema | Síntoma | Causa probable | Solución |
| :---- | :---- | :---- | :---- |
| Leaflet falla en SSR | Error: "window is not defined" durante el build | Leaflet usa window directamente. No es compatible con SSR. | Usar dynamic import con ssr: false para todos los componentes que usan Leaflet. Ver FacilityMap.tsx como referencia. |
| DynamicFormRenderer no valida el campo correcto | Un campo requerido acepta valores vacíos, o un campo opcional bloquea el submit | El buildZodSchema no está generando el schema correcto para ese tipo de campo. | Agregar un test unitario de buildZodSchema con el UISchema problemático. Verificar la lógica del switch para el tipo de campo. |
| LCP \> 500ms en verify.biffco.co | Lighthouse muestra LCP de 800ms o más | El componente más pesado (DAGVisualizer o el EventTimeline) está bloqueando el render inicial. | Asegurar que DAGVisualizer está en Suspense con fallback. EventTimeline debe ser SSR puro — la verificación de firmas es lazy (IntersectionObserver). |
| S3 upload falla con 403 | El fetch al presigned URL retorna 403 Forbidden | El presigned URL expiró (TTL 10 min) o el SHA-256 del header no coincide con el archivo real. | Verificar que el upload ocurre dentro de los 10 minutos. Verificar que el SHA-256 se calcula correctamente antes de solicitar el presigned URL. |
| Service Worker no intercepta las requests | Los eventos firmados offline no van a la cola de sync | El Service Worker no está registrado o la ruta no coincide con el registro. | Verificar en Chrome DevTools → Application → Service Workers que el SW está activo. Verificar que el scope del SW incluye /\[wsId\]/\*. |
| Split/merge falla con timeout | El cliente recibe 504 después de 30s | La transacción PostgreSQL está tardando demasiado, probablemente por un lock en el asset input. | Verificar que no hay otra transacción abierta sobre el mismo asset. Agregar timeout explícito a la transacción (db.transaction({ isolationLevel: "serializable" })). |
| ClamAV no detecta el archivo infectado | El EICAR test string pasa el scan | ClamAV no está corriendo o la base de virus está desactualizada. | Verificar que el servicio ClamAV en Railway está healthy. Actualizar la base: freshclam. Testear con un archivo EICAR directo contra el socket. |
| EventTimeline muestra ❌ para eventos válidos | SignatureBadge muestra firma inválida cuando debería ser válida | El canonicalJson de la verificación no coincide con el que se usó para firmar. El orden de las keys del payload difiere. | Verificar que tanto el cliente (al firmar) como el Event Store (al verificar en append) usan el mismo canonicalJson del payload. Ver crypto/ed25519.ts. |

# **26\. Deferred Items — lo que explícitamente NO se hace en la Fase B**

| ID | Qué se difiere | Por qué se difiere | Se resuelve en |
| :---- | :---- | :---- | :---- |
| DEF-025 | packages/verticals/livestock — VerticalPack real con actores SENASA, EUDR, etc. | El VerticalPack de Livestock requiere el Ubiquitous Language acordado con el cliente piloto y el Product Layer completo para testearlo. No tiene sentido implementarlo antes. | Fase C.1 |
| DEF-026 | GFW (Global Forest Watch) check en tiempo real | El GFW check requiere la API de Global Forest Watch que tiene rate limiting y costo. Se mocka en la Fase B (gfwStatus \= "pending" por defecto). El check real se activa en Fase C.2. | Fase C.2 |
| DEF-027 | DDS EUDR — Documento de Debida Diligencia completo | El DDS requiere datos reales de animales con polígonos verificados contra GFW. Solo es posible generarlo con el VerticalPack de Livestock operativo. | Fase C.2 |
| DEF-028 | analytics router — proyecciones del VerticalPack | Las proyecciones dependen del Event Store lleno de eventos reales del vertical. No hay proyecciones significativas con datos mock. | Fase C.3 |
| DEF-029 | AssetMap — historial de movimientos (polyline) | El historial de movimientos requiere múltiples LOCATION\_CHANGED events reales. En Fase B solo hay assets de prueba. | Fase C.2 |
| DEF-030 | GeoComplianceBadge con datos GFW reales | Depende de DEF-026 (GFW check real). | Fase C.2 |
| DEF-031 | Transfer con carrier — TRANSFER\_IN\_TRANSIT desde el celular del Carrier | La UI mobile-first del carrier y el flujo completo de 3 firmas (cedente \+ carrier \+ receptor) se implementa cuando el flujo de Livestock lo requiere explícitamente. | Fase C.1 |
| DEF-032 | Stripe billing y planes | No hay producto que vender hasta tener al menos una vertical completa operando. | Fase E.1 |
| DEF-033 | pgvector \+ AI anomaly detection | Feature de Growth — no es necesario para el MVP de Livestock. | Fase E.2 |
| DEF-034 | i18n (internacionalización) | En Fase B toda la UI está en español. La internacionalización se implementa cuando hay demanda real de otro idioma. | Fase F.2 |

|  | ✅ VERIFICACIÓN  Todos los DEF-025 a DEF-034 deben estar documentados en docs/deferred-items.md antes de cerrar la Fase B. |
| :---- | :---- |

