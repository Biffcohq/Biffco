

**BIFFCO™**

*Trust Infrastructure for Global Value Chains*

**HOJA DE RUTA MAESTRA**

Arquitectura · Dominio · Construcción · Producción

*Versión 3.1 — Workspace model · Asset lifecycle · Group / Split / Merge / Transform · Actores completos Livestock*

| El Core no sabe qué es una vaca ni qué es un mineral. *Solo sabe que los Workspaces tienen Members que firman Events sobre Assets. Los VerticalPacks definen los nombres, las reglas y el vocabulario de cada industria.* |
| :---: |

Marzo 2026  ·  Córdoba, Argentina  ·  CONFIDENCIAL — USO INTERNO

# **Índice**

| Sección | Título |
| :---- | :---- |
| PARTE I | Fundamentos |
| 01 | El negocio — infraestructura horizontal para múltiples industrias |
| 02 | Los 4 principios de diseño inmutables |
| 03 | Stack tecnológico y servicios externos |
| PARTE II | El Modelo de Dominio |
| 04 | El Core genérico — el moat estratégico |
| 05 | Workspace y el modelo de usuarios |
| 06 | Facility, Zone y Pen — jerarquía de ubicaciones |
| 07 | Asset — el activo trazable y su ciclo de vida |
| 08 | Events — acciones, incidencias y hechos |
| 09 | Group, Split, Merge y Transform — operaciones sobre assets |
| 10 | VerticalPack — cómo cada industria extiende el Core |
| 11 | Multi-vertical, certificaciones y analytics |
| PARTE III | Vertical Livestock — Especificación Completa |
| 12 | Los actores de la cadena ganadera — visión general |
| 13 | Actor 01 — Productor Ganadero |
| 14 | Actor 02 — Veterinario de Campo |
| 15 | Actor 03 — Inspector SENASA |
| 16 | Actor 04 — Transportista |
| 17 | Actor 05 — Feedlot / Engordador |
| 18 | Actor 06 — Frigorífico |
| 19 | Actor 07 — Laboratorio Acreditado |
| 20 | Actor 08 — Exportador / Agente de Exportación |
| 21 | Actor 09 — Importador / Distribuidor UE |
| 22 | Actor 10 — Minorista / Procesador en destino |
| 23 | Actor 11 — Auditor Externo |
| 24 | La cadena completa — flujo de punta a punta |
| PARTE IV | Arquitectura Modular y Plan de Construcción |
| 25 | Los 5 módulos |
| 26 | Plan de construcción — 12 meses |
| PARTE V | Producción e Invariantes |
| 27 | La narrativa para el inversor |
| 28 | Invariantes técnicas inmutables |
| 29 | Schema de base de datos |
| 30 | Agregar una nueva vertical — checklist |

**PARTE I — FUNDAMENTOS**

*El negocio, los principios y el stack*

# **01\. El negocio — infraestructura horizontal para múltiples industrias**

Las cadenas de valor globales comparten un problema universal: cuando un producto cruza fronteras, cambia de dueño y pasa por múltiples transformaciones, no existe una forma matemáticamente verificable de demostrar su origen, historial y cumplimiento regulatorio. El papel no es verificable. Los sistemas cerrados no interoperan. Las regulaciones exigen evidencia criptográfica.

|  | BIFFCO no es un sistema de trazabilidad para ganadería. Es infraestructura de confianza criptográfica para cualquier cadena de valor global. El primer vertical es Ganadería porque el deadline EUDR es diciembre 2026 y el mercado está urgente. La arquitectura hace posible cualquier otro vertical en 2–3 semanas adicionales. |
| :---- | :---- |

| Industria | El problema concreto | Regulación | Deadline |
| :---- | :---- | :---- | :---- |
| Ganadería bovina | Exportadores argentinos no pueden demostrar que sus animales no vienen de zonas deforestadas. Sin esto, pierden acceso al mercado europeo. | EUDR 2023/1115 | Diciembre 2026 |
| Minerales críticos | Fabricantes de baterías no pueden demostrar procedencia libre de conflictos ni el carbon footprint acumulado de toda la cadena. | EU Battery Regulation 2023/1542 | 2027 |
| Farmacéutica | Distribuidores no pueden verificar autenticidad de medicamentos ni trazar un recall hasta el lote específico. | DSCSA (EE.UU.) · EMVO (UE) | 2024–2025 |
| Alimentos y café | Retailers no pueden verificar prácticas sostenibles ni cadena de frío de sus proveedores. | Green Claims Directive · FSMA 204 | 2025–2026 |

# **02\. Los 4 principios de diseño inmutables**

Estas decisiones se tomaron antes de escribir la primera línea de código. Si alguien propone violar una, el costo de la violación supera al beneficio percibido — siempre, en cualquier contexto, para cualquier vertical.

| Principio | La decisión | Por qué es irreversible |
| :---- | :---- | :---- |
| Event Store append-only | domain\_events es inmutable. Trigger PostgreSQL rechaza UPDATE/DELETE. Los errores se corrigen con nuevos eventos. | Un DELETE invalida la verificabilidad histórica de todas las verticales simultáneamente. La confianza del sistema completo desaparece. |
| Client-side signing | La firma Ed25519 ocurre en el browser. La clave privada vive en sessionStorage. El mnemonic BIP-39 se muestra UNA sola vez en el signup — BIFFCO nunca lo almacena. | Si el servidor firma, BIFFCO puede falsificar cualquier evento de cualquier vertical. |
| packages/core nunca importa packages/verticals/\* | El Core no conoce ningún vertical. Enforced por ESLint en CI. El PR no se mergea si el import existe. | Si el Core conoce un vertical, BIFFCO es un sistema de esa industria. El moat desaparece. |
| RBAC deny-by-default | Sin permiso explícito \= Deny. RLS en PostgreSQL como segunda línea de defensa. | Un error de "por defecto permitido" es un data leak cross-workspace irrecuperable en términos de confianza regulatoria. |

# **03\. Stack tecnológico y servicios externos**

| Capa | Tecnología | Versión | Rol |
| :---- | :---- | :---- | :---- |
| Runtime | Node.js | 22 LTS | Base de todos los servicios |
| Lenguaje | TypeScript | 5.x strict | End-to-end type safety \+ branded types |
| API Framework | Fastify | 5.x | HTTP \+ plugins cors/helmet/rate-limit/jwt |
| API Contract | tRPC | v11 | Type-safe entre API y todos los clientes |
| ORM | Drizzle ORM | 0.45+ | Schema-as-TypeScript \+ migrations versionadas |
| DB | PostgreSQL 16 \+ PostGIS | 16 / 3.4 (via Neon managed) | Event Store \+ geo \+ RLS multi-tenant |
| Cache / Queue | Upstash Redis \+ BullMQ | serverless / latest | JWT revocation \+ workers async |
| Crypto (Node) | libsodium-wrappers | latest | Ed25519 sign/verify del lado del servidor |
| Crypto (Browser) | Web Crypto API | nativa | Sign en browser \+ verify en Edge Runtime |
| HD Wallet | ed25519-hd-key | latest | SLIP-0010 para derivación de claves por Workspace |
| Mnemonic | bip39 | latest | 24 palabras — solo en browser en el signup |
| Blockchain | ethers.js v6 | v6 | Polygon Amoy (testnet) → Mainnet en Fase E |
| Frontend | Next.js 15 | App Router \+ Edge | DynamicFormRenderer para cualquier VerticalPack |
| Estilos | Tailwind CSS | 4.x | Tokens CSS — 0 valores hardcodeados |
| Mapas | Leaflet | latest | Polígonos EUDR, ubicaciones de assets |
| PDF | @react-pdf/renderer | latest | Asset Passport, DDS EUDR, Battery Passport, CoA |
| Email | react-email \+ Resend | latest | Emails transaccionales |
| Testing | Vitest \+ Playwright | latest | Unit/integration \+ E2E por vertical en CI |

| Servicio | Rol | Sprint |
| :---- | :---- | :---- |
| Vercel | Deploy apps/web \+ apps/platform \+ apps/verify | Sprint 0 |
| Railway | Deploy apps/api \+ workers | Sprint 0 |
| Neon | PostgreSQL 16 \+ PostGIS managed con branching por entorno | Sprint 0 |
| Upstash | Redis serverless — JWT \+ BullMQ | Sprint 0 |
| Doppler | Secrets management dev/staging/prod | Sprint 0 |
| GitHub Actions | CI/CD: lint → typecheck → test → build | Sprint 0 |
| Resend | Email transaccional parametrizable por vertical | Sprint B.1 |
| AWS S3 \+ Object Lock | Evidence WORM 7 años \+ CloudFront CDN | Sprint B.3 |
| Sentry | Error tracking con tags por workspaceId \+ verticalId | Sprint A.3 |
| Polygon Amoy / Mainnet | Blockchain testnet → Mainnet en Fase E | A.3 / E.3 |
| OpenTelemetry \+ Grafana Cloud | Observabilidad: trazas, métricas, logs | Sprint D.1 |
| Stripe | Billing multi-vertical | Sprint E.1 |
| Global Forest Watch API | Cruce de polígonos para compliance EUDR | Sprint C.2 |
| IS EUDR Gateway | Envío de DDS al sistema oficial de la Comisión Europea | Sprint F.2 |

**PARTE II — EL MODELO DE DOMINIO**

*Core agnóstico · Workspace como feature · Ubicaciones · Assets · Events · Operaciones · Verticales*

# **04\. El Core genérico — el moat estratégico de BIFFCO**

El moat estratégico de BIFFCO no es el conocimiento de la ganadería ni de la minería. Es la infraestructura de confianza criptográfica que sirve a cualquier industria sin modificaciones. El Core implementa exactamente los mecanismos — los VerticalPacks aportan los nombres, las reglas y el vocabulario de cada industria.

|  | La prueba de que el Core es genuinamente genérico: después de implementar Livestock completamente, el comando grep packages/core \--include="\*.ts" \-r "livestock" debe retornar 0 resultados. Si retorna alguno, hay lógica de dominio mezclada con infraestructura — y eso es un bug de arquitectura. |
| :---- | :---- |

## **Lo que el Core sabe — y solo eso**

| El Core sabe | El VerticalPack agrega | Por qué esta separación importa |
| :---- | :---- | :---- |
| Existen Workspaces donde operan Members con roles. | Qué roles existen: BovineProducer, MiningOperator, Pharmacist. Qué permisos tiene cada rol. | Si el Core conoce los roles de Ganadería, no puede servir a Minería sin modificarse. |
| Existen Assets con tipo, estado, dueño, custodio e historial de eventos. | Qué tipos de asset existen: AnimalAsset, OreExtract, BatchProduct. Los campos específicos del payload. Las transiciones de estado válidas. | El Core puede trazar cualquier activo del mundo real — sin saber qué es. |
| Los Assets pueden agruparse, dividirse, combinarse y transformarse. Estas operaciones son atómicas. | Las reglas de negocio: validaciones previas, invariantes de peso o volumen, qué se hereda en el linaje de compliance. | El mecanismo es universal. Las reglas son de la industria. |
| Existen Events firmados por Members con Ed25519. El Event Store es append-only. | El catálogo de eventos, sus schemas, sus UISchemas, quién puede firmar qué evento. | Cualquier hecho del mundo real — en cualquier industria — se registra con el mismo mecanismo. |
| Los Assets tienen una ubicación contextual (Facility → Zone → Pen). | Cómo se llaman las ubicaciones. Qué tipos son válidos. | La jerarquía de ubicaciones es una feature genérica, no arquitectura específica de una industria. |

## **El mismo Core para cuatro industrias**

| Concepto abstracto | Ganadería | Minería | Farmacéutica | Logística |
| :---- | :---- | :---- | :---- | :---- |
| Workspace | Estancia / Frigorífico | Minera / Planta | Lab / Distribuidor | Operador / Retailer |
| Member role | BovineProducer, Carrier | MiningOperator, Smelter | Manufacturer, QAManager | FreightOperator, Broker |
| Asset | AnimalAsset, DerivedAsset | OreExtract, BatteryPrecursor | BatchProduct, SerializedUnit | Pallet, Container |
| Event acción | VACCINE\_ADMINISTERED | ASSAY\_COMPLETED | QC\_PASSED | SHIPMENT\_CREATED |
| Event incidencia | HEALTH\_INCIDENT\_REPORTED | SAFETY\_INCIDENT\_REPORTED | DEVIATION\_REPORTED | DAMAGE\_REPORTED |
| Transform (tipo cambia) | Faena: 1 animal → N cortes | Procesamiento: ore → concentrado | Manufactura: ingredientes → batch | — |
| Split (mismo tipo) | Lote → 2 sublotes distintos destinos | Bulk → 2 sublotes distintas refinerías | Batch → 2 lotes distintos mercados | Container → pallets individuales |
| Merge (mismo tipo) | 2 tropas → 1 tropa unificada | 2 concentrados → 1 bulk | 2 lotes ingrediente → 1 síntesis | N pallets → 1 container |
| Certificación externa | Brangus, Angus | IRMA, Fairmined | FDA CoA, GMP | Rainforest Alliance, GDP |
| Compliance framework | EUDR 2023/1115, SENASA | EU Battery Reg, OECD DD | DSCSA, EMVO | FSMA 204 |

# **05\. Workspace — el modelo de usuarios**

El modelo de usuarios de BIFFCO funciona como Notion, Canva o Linear: el usuario crea un Workspace, invita Members con roles específicos de la vertical, y opcionalmente organiza Teams internos. Una persona puede pertenecer a múltiples Workspaces con roles distintos en cada uno — su identidad criptográfica es suya, los roles pertenecen al Workspace.

## **Las entidades del modelo**

| Entidad | Qué representa | Keypair Ed25519 |
| :---- | :---- | :---- |
| Person | La persona física. Se autentica con email \+ password. Tiene un mnemonic BIP-39 generado una sola vez en el signup — nunca más. | Sí. 1 keypair base. Las claves por Workspace se derivan con SLIP-0010 usando el wsIdx: path m/0'/wsIdx'/memberIdx'. |
| Workspace | El contexto operativo: una estancia, un frigorífico, una empresa minera. Tiene un VerticalPack activo. Es el tenant en el modelo multi-tenant. | No. El Workspace no firma. Sus Members sí, con claves derivadas de la Person. |
| WorkspaceMember | La relación Person ↔ Workspace con roles asignados. Una Person puede ser Member en múltiples Workspaces con roles distintos en cada uno. | Sí. Clave derivada del keypair de la Person con path que incluye el wsIdx. Matemáticamente distinta para cada Workspace. |
| Team | Subgrupo interno dentro de un Workspace. Opcional — para estructuras complejas como un frigorífico con múltiples plantas o una empresa transportista con varias sedes. | No. Los Teams no firman. |
| Employee | Persona que opera en campo sin cuenta BIFFCO propia. Sus operaciones las firma el WorkspaceMember supervisor. | No. Sus acciones quedan registradas en el payload del evento con employeeId como metadata. |

## **Escenarios reales**

| EJEMPLO — UNA PERSONA, MÚLTIPLES ROLES Y WORKSPACES Person: Juan García (1 cuenta BIFFCO, 1 mnemonic)   Workspace 1: Estancia Los Alamos SA — VerticalPack: livestock     Rol: \[BovineProducer, Owner\]     Clave derivada: m/0'/1'/0'  ← distinta para este Workspace   Workspace 2: Transportes Vidal SA — VerticalPack: logistics (futuro)     Rol: \[LivestockCarrier, Owner\]     Clave derivada: m/0'/2'/0'  ← matemáticamente distinta   Management Dashboard: Juan ve 2 cards. Hace clic y entra al contexto correcto.   Los datos de cada Workspace están completamente aislados por RLS. |
| :---- |

| EJEMPLO — CASOS REALES DE COMPOSICIÓN DE ACTORES El productor ES el veterinario habilitado:   WorkspaceMember con roles \[BovineProducer, Veterinarian\] en el mismo Workspace.   El VerticalPack valida la habilitación antes de permitir firmar ciertos eventos. El productor tiene su propio camión:   WorkspaceMember con roles \[BovineProducer, LivestockCarrier\]. Empresa transportista con 3 choferes y 2 sedes:   1 Workspace. 2 Facilities (una por sede). 3 WorkspaceMembers (uno por chofer).   Employees para personal de playa sin cuenta propia. Inspector que trabaja con 5 productores:   1 Person, 5 WorkspaceMemberships. Los datos de cada productor están aislados.   El inspector cambia de Workspace activo en el dashboard. |
| :---- |

# **06\. Facility, Zone y Pen — jerarquía de ubicaciones**

La jerarquía Org → Facility → Zone → Pen es una feature del sistema, no la arquitectura central. Aporta contexto geográfico y operativo a los activos: un Asset sabe siempre dónde está (currentPenId). El historial de movimientos se reconstruye leyendo los eventos LOCATION\_CHANGED. El polígono EUDR vive en el nivel Zone — es el polígono de la parcela donde estuvo el producto.

## **Los 4 niveles**

| Nivel | Entidad | En Ganadería | En Minería | Campos clave |
| :---- | :---- | :---- | :---- | :---- |
| 1 | Workspace | Estancia Los Alamos SA | Minera Puna SA | id, name, verticalId, plan, settings JSONB |
| 2 | Facility | Campo Santa Fe (RENSPA 08-123) | Mina Olaroz — 3850m snm | id, wsId, name, type, polygon GEOMETRY, address, license |
| 3 | Zone | Lote 1 Norte — 45 ha | Sector A — Tajo Norte 100 ha | id, facilityId, name, type, polygon GEOMETRY ← polígono EUDR |
| 4 | Pen | Corral Recría (cap 80\) | Tolva de molienda \#3 | id, zoneId, name, type, capacity, currentOccupancy counter |

| EJEMPLO — PRODUCTOR CON DOS ESTABLECIMIENTOS Workspace: Estancia Los Alamos SA   Facility A: Campo Santa Fe — RENSPA 08-123-456     Zone A1: Lote 1 Norte — 45 ha  \[polygon\_eudr \= GeoJSON SF-A1\]       Pen A1-1: Corral Recría (cap 80\) — currentOccupancy: 45       Pen A1-2: Corral Engorde (cap 80\) — currentOccupancy: 0     Zone A2: Lote 2 Sur — 60 ha  \[polygon\_eudr \= GeoJSON SF-A2\]       Pen A2-1: Corral Principal (cap 120\)   Facility B: Campo Salta — RENSPA 66-987-654     Zone B1: Lote Norte — 2000 ha  \[polygon\_eudr \= GeoJSON SA-B1\]     Zone B2: Lote Sur — 1500 ha   \[polygon\_eudr \= GeoJSON SA-B2\] |
| :---- |

## **Movimiento interno vs transferencia**

| Operación | Evento | ¿Cambia owner/custodian? | ¿Cambia Workspace? |
| :---- | :---- | :---- | :---- |
| Mover un asset de Pen A a Pen B (mismo Zone) | LOCATION\_CHANGED | No | No — mismo Workspace |
| Mover un asset de Zone 1 a Zone 2 (mismo Facility) | LOCATION\_CHANGED | No | No — mismo Workspace |
| Mover entre Facilities del mismo Workspace | INTERNAL\_FACILITY\_TRANSFER | No | No — mismo Workspace |
| Transferir a otro Workspace (vender a un feedlot) | TRANSFER\_INITIATED \+ TRANSFER\_ACCEPTED | Sí — doble firma | Sí — distinto tenant, distinto RLS |

|  | *El polígono EUDR está en Zone, no en Facility, porque el regulador europeo requiere las coordenadas de la parcela específica donde estuvo el producto. En ganadería extensiva es el lote donde pastó el animal. En minería es el sector de extracción. En café es la parcela de cultivo.* |
| :---- | :---- |

# **07\. Asset — el activo trazable y su ciclo de vida**

Un Asset es cualquier objeto del mundo real que BIFFCO traza. Lo que hace trazable a un Asset no es su tipo — es su historial inmutable de eventos firmados. El tipo lo define el VerticalPack. El mecanismo lo provee el Core.

## **Campos del Asset — genérico para cualquier vertical**

| Campo | Tipo | Descripción |
| :---- | :---- | :---- |
| id | AssetId (branded) | Identificador inmutable. Nunca cambia, aunque el asset sea transformado, dividido o combinado. |
| type | string (del VerticalPack) | Tipo del asset: "AnimalAsset", "OreExtract", "BatchProduct". Definido por assetTypes\[\] del VerticalPack. |
| status | AssetStatus enum | ACTIVE | IN\_TRANSIT | IN\_PROCESS | LOCKED | QUARANTINE | CLOSED | RECALLED | STOLEN | LOST |
| ownerId | WorkspaceMemberId FK | Quién tiene la propiedad legal. Cambia en cada TRANSFER\_ACCEPTED con firma del receptor. |
| custodianId | WorkspaceMemberId FK nullable | Quién tiene la custodia física (puede diferir del dueño: el carrier tiene custodia, el productor tiene propiedad). |
| workspaceId | WorkspaceId FK | El Workspace que creó el asset. Nunca cambia. |
| verticalId | string | El VerticalPack al que pertenece este tipo de asset. |
| payload | JSONB | Campos específicos del vertical. Validados contra el assetType schema del VerticalPack. |
| parentIds | AssetId\[\] | Los assets de los que este asset desciende. Índice GIN — habilita lineage queries \< 200ms con 10k assets. |
| currentPenId | PenId FK nullable | Ubicación actual en la jerarquía Facility→Zone→Pen. Metadato contextual. |
| currentGroupId | GroupId FK nullable | Si pertenece a un AssetGroup activo en este momento. |
| externalId | string nullable | ID externo: número de caravana RFID, número de lote, código de barras, EID. |

## **Estados del Asset — máquina de estados universal**

| Estado | Descripción | Entrada | Salida |
| :---- | :---- | :---- | :---- |
| ACTIVE | Operativo. Disponible para cualquier operación permitida. | Creado (ASSET\_REGISTERED o ASSET\_ONBOARDED) | Cualquier evento que cambia el estado |
| IN\_TRANSIT | En movimiento bajo custodia de un carrier. El dueño no cambió. | TRANSFER\_IN\_TRANSIT firmado por el carrier | TRANSFER\_ACCEPTED o TRANSFER\_REJECTED |
| IN\_PROCESS | Siendo procesado/transformado. No disponible para otras operaciones. | PROCESSING\_STARTED, SLAUGHTER\_SCHEDULED | PROCESSING\_COMPLETED, SLAUGHTER\_COMPLETED |
| LOCKED | Hold activo. No puede transferirse ni procesarse ni incluirse en transformaciones. | HOLD\_IMPOSED por inspector habilitado. Automático si incidencia severity ≥ high. | HOLD\_LIFTED por el rol que lo impuso o inspector habilitado |
| QUARANTINE | Cuarentena sanitaria o regulatoria. Más restrictivo que LOCKED. | QUARANTINE\_IMPOSED por inspector o autoridad regulatoria | QUARANTINE\_LIFTED por la autoridad correspondiente |
| CLOSED | Terminó su ciclo de vida. Fue procesado, faenado, manufacturado o consumido. | SLAUGHTER\_COMPLETED, MANUFACTURING\_COMPLETED, ASSET\_CONSUMED | Irreversible |
| RECALLED | Bajo recall activo. Todos los descendientes también quedan marcados automáticamente. | RECALL\_ISSUED por el dueño o autoridad competente | RECALL\_RESOLVED |
| STOLEN | Reportado como robado. | THEFT\_REPORTED con número de denuncia policial | THEFT\_RESOLVED si se recupera |
| LOST | Reportado como extraviado. | STRAYING\_REPORTED | STRAYING\_RESOLVED |

# **08\. Events — acciones, incidencias y hechos sobre los activos**

Los eventos son el corazón del sistema. Todo lo que le pasa a un Asset — una acción planificada, una incidencia inesperada, un cambio de estado — se registra como un DomainEvent firmado con Ed25519. El Event Store es el historial irrefutable. Los eventos no modifican el asset directamente: modifican las proyecciones que el sistema calcula sobre el historial.

## **Estructura de un DomainEvent — genérico para cualquier vertical**

| Campo base (Core) | Tipo | Descripción |
| :---- | :---- | :---- |
| eventId | EventId (branded) | Identificador único e inmutable del evento |
| type | string | El tipo: "VACCINE\_ADMINISTERED". Definido en el eventCatalog del VerticalPack. |
| schemaVersion | integer | Versión del payload schema. Permite migrar el schema sin romper el historial. |
| assetId | AssetId FK | El asset sobre el que ocurre el evento |
| workspaceId | WorkspaceId FK | El Workspace en cuyo contexto ocurre (RLS) |
| actorId | WorkspaceMemberId FK | El WorkspaceMember que firmó. Trazabilidad humana irrefutable. |
| employeeId | EmployeeId FK nullable | Si la operación la ejecutó un Employee supervisado |
| signature | string hex | Firma Ed25519 de canonicalJson(payload) con la clave privada del WorkspaceMember |
| publicKey | string hex | Clave pública del firmante — para verificación independiente sin BIFFCO |
| occurredAt | timestamptz | Cuándo ocurrió en el mundo real |
| correlationId | string | ID del batch si es operación masiva — agrupa N eventos de una sola acción del usuario |
| payload | JSONB | Campos específicos del VerticalPack. Validados contra el payloadSchema del evento. |

## **Catálogo de categorías — universales entre verticales**

| Categoría | Descripción | Ejemplos Ganadería | Ejemplos Minería | ¿Crea hold automático? |
| :---- | :---- | :---- | :---- | :---- |
| Registro / Creación | El asset nace en el sistema. | ANIMAL\_REGISTERED (nacido en campo), ANIMAL\_ONBOARDED (adulto sin historial) | ORE\_EXTRACTED (primera extracción) | No |
| Acción de producción | Operación planificada en el ciclo normal. | WEIGHT\_RECORDED, FEEDING\_RECORDED, BRANDING\_RECORDED, BIRTH\_RECORDED | SAMPLING\_RECORDED, WEIGHT\_MEASURED | No |
| Tratamiento / Intervención | Intervención directa. Puede requerir habilitación del rol. | VACCINE\_ADMINISTERED (privada: sin inspector), TREATMENT\_ADMINISTERED (antibióticos: requiere Veterinarian o Inspector) | REAGENT\_APPLIED, PROCESSING\_STEP\_COMPLETED | No |
| Inspección / Certificación | Acto formal de un inspector o auditor habilitado. | VETERINARY\_INSPECTION (Veterinarian), OFFICIAL\_INSPECTION (Inspector SENASA), HEALTH\_CERT\_ISSUED (DTE) | ENVIRONMENTAL\_INSPECTION, IRMA\_AUDIT\_COMPLETED | No |
| Incidencia leve | Algo anómalo que se registra pero no bloquea el asset. | MINOR\_INJURY\_OBSERVED, FEEDING\_IRREGULARITY\_NOTED | MINOR\_DEVIATION\_NOTED | No |
| Incidencia grave | Requiere atención urgente. Activa hold automático si severity ≥ high. | HEALTH\_INCIDENT\_REPORTED, SUSPECTED\_DISEASE\_REPORTED | SAFETY\_INCIDENT\_REPORTED, ENVIRONMENTAL\_BREACH\_DETECTED | Sí si severity ≥ high |
| Resolución de incidencia | Cierre formal de una incidencia. Solo el rol habilitado puede firmar. | INCIDENT\_RESOLVED (levanta hold — solo Veterinarian o Inspector habilitado) | INCIDENT\_RESOLVED (Inspector ambiental) | Levanta hold |
| Hold externo | Ente externo impone restricción. | QUARANTINE\_IMPOSED (resolución SENASA), LEGAL\_HOLD\_IMPOSED | REGULATORY\_HOLD\_IMPOSED (SEGEMAR), EMBARGO\_IMPOSED | Sí — siempre |
| Baja del asset | El asset termina sin transformación planificada. | DEATH\_RECORDED, THEFT\_REPORTED, STRAYING\_REPORTED | ASSET\_WRITTEN\_OFF, THEFT\_REPORTED | No — el asset pasa a CLOSED/STOLEN/LOST |
| Certificación externa | Se ancla un certificado externo. | EXTERNAL\_CERTIFICATION\_LINKED (Brangus, Angus, Braford) | EXTERNAL\_CERTIFICATION\_LINKED (IRMA, Fairmined) | No |
| Movimiento de ubicación | Cambio de Pen/Zone/Facility dentro del Workspace. | LOCATION\_CHANGED (corral A→B), INTERNAL\_FACILITY\_TRANSFER | LOCATION\_CHANGED (sector A→planta) | No |
| Transferencia entre Workspaces | Cambio de owner o custodian. Requiere doble firma. | TRANSFER\_INITIATED, TRANSFER\_IN\_TRANSIT, TRANSFER\_ACCEPTED, TRANSFER\_REJECTED | Ídem | No (bloquea nuevas ops mientras PENDING) |
| Transformación | El asset se convierte en otros assets. Atómico. | SLAUGHTER\_COMPLETED, SPLIT\_COMPLETED, MERGE\_COMPLETED | PROCESSING\_COMPLETED, SPLIT\_COMPLETED, MERGE\_COMPLETED | No (input → CLOSED) |
| Compliance / Regulatorio | Acto formal de cumplimiento regulatorio. | EUDR\_DDS\_GENERATED, CUSTOMS\_CLEARED, EXPORT\_CERTIFIED | BATTERY\_PASSPORT\_ISSUED, CONFLICT\_FREE\_DECLARED | No |

|  | *La distinción entre VETERINARY\_INSPECTION (firmada por un Veterinarian de campo, trabajo privado diario) y OFFICIAL\_INSPECTION (firmada por Inspector SENASA, acto regulatorio oficial) es crítica. El VerticalPack define allowedRoles por evento. El DynamicFormRenderer solo muestra los eventos que el rol del WorkspaceMember activo puede firmar.* |
| :---- | :---- |

# **09\. Group, Split, Merge y Transform — operaciones sobre assets**

Estas cuatro operaciones permiten gestionar la fluidez con la que los activos se agrupan, dividen, combinan y transforman en la realidad operativa. Las cuatro son atómicas: una sola transacción PostgreSQL. Si falla cualquier paso, rollback total.

|  | El estado intermedio nunca existe: un asset de input cerrado sin outputs, o un output sin input cerrado, no puede ocurrir. O la operación completa completamente o ningún asset cambia de estado. |
| :---- | :---- |

## **GROUP — Agrupación operativa temporal**

Un Group NO crea nuevos assets ni cierra los existentes. Es una etiqueta temporal que dice "estos N assets comparten el mismo contexto operativo ahora". Los assets mantienen su identidad individual, su estado, su owner. El grupo puede disolverse sin rastro en los assets.

| Aspecto | Descripción |
| :---- | :---- |
| Qué hace | Agrupa N assets bajo una etiqueta operativa (currentGroupId en cada asset). No crea ni cierra assets. |
| Eventos | GROUP\_FORMED cuando se crea. GROUP\_DISSOLVED cuando se disuelve. |
| Linaje | Los assets NO adquieren parentIds del grupo. El grupo no es un ancestro. |
| Usos típicos | Seleccionar animales para transferir. Agrupar mineral para procesar. Seleccionar un batch para liberar. Organizar pallets para un envío. |
| Disolución | Al completarse la operación para la que se formó, o manualmente. Sin rastro en los assets del grupo. |
| Ejemplo Ganadería | El productor selecciona 40 de 45 animales del Corral 3 para vender. GROUP\_FORMED "TG-2024-001" con 40 AssetIds. Los 5 restantes permanecen en el corral, inafectados. |
| Ejemplo Minería | El operador agrupa 3 OreExtracts del Sector A para enviarlos juntos a la planta. GROUP\_FORMED "ORE-BATCH-01". La planta los recibe como grupo operativo. |

## **SPLIT — División de un asset en múltiples outputs del mismo tipo**

1 asset → N assets nuevos. El asset original queda CLOSED. Cada output tiene parentAssetId → el asset original. El tipo del output es el mismo que el del input (o un tipo compatible definido por el VerticalPack).

| Aspecto | Descripción |
| :---- | :---- |
| Qué hace | Cierra el asset input y crea N assets nuevos con parentAssetId → input. |
| Evento | SPLIT\_COMPLETED (atómico) |
| Invariante cuantitativo | La suma de los atributos cuantitativos de los outputs (peso, volumen) no puede superar los del input. Si el sistema tiene esta información, lo verifica. Si no, el declarante es responsable. |
| Herencia de compliance | Si el input tiene una restricción activa (hold, alerta GFW, alerta de conflicto), los outputs HEREDAN esa restricción. No se puede "limpiar" un asset dividiendo lo limpio de lo contaminado. |
| Diferencia con Group | Group: los assets originales siguen existiendo como individuos. Split: el asset original se cierra y se crean assets nuevos con nueva identidad. |
| Ejemplo Ganadería | Un lote de 100 animales se divide en dos sublotes de 60 y 40 para enviarlos a distintos feedlots. El LotAsset original → CLOSED. Dos nuevos LotAssets con parentAssetId → original. |
| Ejemplo Minería | Un bulk de 80 toneladas de ore se separa en dos sublotes (50t y 30t) para dos refinerías. El OreExtract original → CLOSED. Dos nuevos OreExtracts con parentAssetId → original. |
| Ejemplo Farmacéutica | Un batch de 10.000 unidades se divide para exportación (7.000) y mercado local (3.000), cada uno con su propio número de lote regulatorio. |

## **MERGE — Combinación de múltiples assets en uno del mismo tipo**

N assets → 1 asset nuevo. Los assets originales quedan CLOSED. El output tiene todos los parentAssetIds de los inputs. La regla del peor caso aplica: si cualquier input tiene una restricción, el output la hereda.

| Aspecto | Descripción |
| :---- | :---- |
| Qué hace | Cierra todos los assets input y crea 1 asset nuevo con parentIds \= \[id1, id2, ..., idN\]. |
| Evento | MERGE\_COMPLETED (atómico) |
| Regla del peor caso (crítica) | Si cualquiera de los inputs tiene alerta GFW, hold sanitario, alerta de conflicto OECD, o cualquier flag de compliance, el output HEREDA todas esas alertas. No se puede diluir un problema combinando activos problemáticos con activos limpios. |
| Diferencia con Group | Group: los assets originales siguen existiendo. Merge: los assets originales se cierran y se crea uno nuevo. El Group se disuelve sin rastro. El Merge crea linaje permanente. |
| Diferencia con Transform | Merge: el tipo del output es el mismo (o compatible) que el de los inputs. Transform: el tipo del output es distinto al de los inputs — sube en la cadena de valor. |
| Ejemplo Ganadería | Dos tropas de 50 animales cada una se unifican en una tropa de 100 para el feedlot. Si cualquier animal tenía hold sanitario, la tropa resultante hereda el hold. |
| Ejemplo Minería | Dos lotes de MineralConcentrate de distintas extracciones se combinan para alcanzar el volumen mínimo de la refinería. El carbon footprint del output es el promedio ponderado de los inputs. |
| Ejemplo Alimentos | Mezcla de granos de dos orígenes para crear un blend. Si cualquier origen tiene alerta GFW, el blend la hereda. El DDS incluye los polígonos de AMBOS orígenes. |

## **TRANSFORM — Transformación de tipo: puede ser 1→N o N→1**

La operación que "sube" en la cadena de valor: el tipo del asset de output es distinto al de los inputs. Puede ser 1→N (un animal → varios cortes) o N→1 (varios ingredientes → un batch). El VerticalPack define la transformRule — el Core ejecuta la transacción atómica.

| Aspecto | Descripción |
| :---- | :---- |
| Qué hace | Cierra los assets input y crea assets output de un tipo diferente y superior en la cadena de valor. |
| Forma 1→N | 1 asset de entrada → N assets de salida de tipo distinto. Ejemplo: 1 AnimalAsset → N DerivedAssets (cuadril, costillar, cuero, menudencias). El animal original → CLOSED. Cada corte tiene parentAssetId → el animal. |
| Forma N→1 | N assets de entrada → 1 asset de salida de tipo distinto. Ejemplo: N ActiveIngredients → 1 BatchProduct. Ejemplo: ore → concentrado (1→1 pero de tipo diferente). |
| Diferencia con Split | Split: mismo tipo de asset, solo cambia la cantidad/porción. Transform: el tipo del output es distinto — representa una transformación real del objeto. |
| Diferencia con Merge | Merge: mismo tipo, se unen. Transform: tipo distinto, se convierte. Un MERGE de concentrados sigue siendo concentrado. Una TRANSFORM de concentrado es metal refinado. |
| Reglas del VerticalPack | Las transformRules del VerticalPack definen: qué tipos de input permiten, qué tipos de output producen, las validaciones previas obligatorias (holds activos, certificados vigentes, peso mínimo), y los invariantes cuantitativos. |
| Ejemplo Ganadería | SLAUGHTER\_COMPLETED: 1 AnimalAsset (tipo AnimalAsset) → N DerivedAssets (tipo DerivedAsset: cuadril, costillar, cuero). El animal debe: status ACTIVE, 0 holds activos, DTE vigente, si destino UE: VETERINARY\_INSPECTION \< 72h. |
| Ejemplo Minería | PROCESSING\_COMPLETED: 1 OreExtract (tipo OreExtract) → 1 MineralConcentrate (tipo MineralConcentrate). El carbon footprint del concentrado \= carbon de la extracción \+ carbon del proceso. |
| Ejemplo Farmacéutica | MANUFACTURING\_COMPLETED: N ActiveIngredient (tipo ActiveIngredient) → 1 BulkProduct (tipo BulkProduct). Si cualquier ingrediente tiene hold → la manufacturing no puede iniciar. |

## **Resumen comparativo de las 4 operaciones**

| Operación | Assets input | Assets output | Tipo output | Linaje en parentIds | Herencia compliance |
| :---- | :---- | :---- | :---- | :---- | :---- |
| GROUP | N assets — permanecen ACTIVE | Mismo N assets con currentGroupId | Mismo tipo | No cambia parentIds | No aplica — los assets no cambian |
| SPLIT | 1 asset → CLOSED | N assets nuevos, creados | Mismo tipo (o compatible) | Cada output → parentId del input | Sí — worst-case heredado a todos los outputs |
| MERGE | N assets → CLOSED | 1 asset nuevo, creado | Mismo tipo (o compatible) | Output → parentIds de todos los inputs | Sí — peor caso de todos los inputs heredado |
| TRANSFORM 1→N | 1 asset → CLOSED | N assets nuevos, tipo distinto | Tipo distinto (superior) | Cada output → parentId del input | Sí — alertas del input heredadas a todos los outputs |
| TRANSFORM N→1 | N assets → CLOSED | 1 asset nuevo, tipo distinto | Tipo distinto (superior) | Output → parentIds de todos los inputs | Sí — peor caso de todos los inputs heredado |

# **10\. VerticalPack — cómo cada industria extiende el Core**

Un VerticalPack es el único punto donde vive el conocimiento de una industria. Implementa una interface definida en el Core. Es un plugin — el Core es el runtime. Si el Core no importa el VerticalPack, la arquitectura es correcta.

| `// packages/core/vertical-engine/types.ts` `interface VerticalPack {`   `id: string                          // "livestock" | "mining" | "pharma"`   `name: string                        // nombre humano del vertical`   `version: string                     // semver para migraciones`   `// Vocabulario — el Core usa estos labels en la UI`   `facilityLabel: string               // "Establecimiento" | "Mina" | "Planta"`   `zoneLabel: string                   // "Lote" | "Sector" | "Área"`   `penLabel: string                    // "Corral" | "Tolva" | "Línea"`   `assetLabel: string                  // "Animal" | "Lote de mineral" | "Batch"`   `groupLabel: string                  // "Tropa" | "Bulk shipment" | "Batch"`   `// Dominio de la industria`   `actorTypes: ActorTypeDefinition[]   // {id, name, permissions: Permission[]}`   `assetTypes: AssetTypeDefinition[]   // {id, name, schema: ZodSchema, geoRequired}`   `eventCatalog: EventDefinition[]     // {type, schemaVersion, payloadSchema, uiSchema, allowedRoles}`   `transformRules: TransformRule[]     // {inputTypes, outputTypes, validations, atomicHandler}`   `splitRules: SplitRule[]             // {inputType, outputType, quantitativeInvariant}`   `mergeRules: MergeRule[]             // {inputTypes, outputType, worstCaseFields[]}`   `// UI — DynamicFormRenderer usa estos schemas`   `uiSchemas: Record<string, UISchema>`   `// Compliance y geografía`   `geoRequirements: boolean`   `complianceFrameworks: string[]      // ["EUDR","SENASA"] | ["EU_BATTERY_REG"]`   `// Analytics — proyecciones específicas de la industria`   `projections: ProjectionFn[]` `}` |
| :---- |

| VerticalPack | Estado en el roadmap | Actores | Asset types | Regulaciones |
| :---- | :---- | :---- | :---- | :---- |
| livestock | Sprint C — primera instancia del modelo | 11 actores detallados en Parte III | AnimalAsset, LotAsset, DerivedAsset | EUDR 2023/1115, SENASA, RFID Argentina |
| mining | Sprint F — segunda instancia del modelo | 8: MiningOperator, ProcessingPlant, Smelter, MiningCarrier, Laboratory, MiningInspector, BatteryManufacturer, ESGAuditor | OreExtract, MineralConcentrate, RefinedMaterial, BatteryPrecursor | EU Battery Reg 2023/1542, OECD DD, SEGEMAR |
| pharma | Post-Fase F — backlog | Manufacturer, QAManager, Distributor, Pharmacist, RegulatorAuditor | ActiveIngredient, API, BulkProduct, FinishedDosage, SerializedUnit | DSCSA, EMVO, EU FMD |
| food-agri | Post-Fase F — backlog | GrainProducer, Processor, QualityInspector, LogisticsOp, Retailer | RawMaterial, ProcessedGood, PackagedProduct, ShippingUnit | FSMA 204, Green Claims Directive |

# **11\. Multi-vertical, certificaciones y analytics**

## **Aislamiento multi-vertical**

| Aspecto | Garantía técnica |
| :---- | :---- |
| Datos | RLS: SET app.current\_workspace en cada request. Los assets de Ganadería son materialmente invisibles desde Minería. |
| Claves criptográficas | SLIP-0010 con wsIdx en el path. La clave de un WorkspaceMember en Ganadería es matemáticamente distinta a la de ese mismo WorkspaceMember en Minería. |
| Compliance | Cada VerticalPack declara sus complianceFrameworks. EUDR aplica solo donde se declara. Un auditor de un Workspace de Ganadería no puede ver datos de un Workspace de Minería. |
| UI | Management Dashboard: una card por Workspace. Al hacer clic: Operations Dashboard del VerticalPack de ese Workspace. No se pueden mezclar contextos. |

## **Certificaciones externas**

Cada industria tiene organismos externos que certifican atributos de los activos. BIFFCO ancla esos certificados al historial del asset con un hash de integridad — no los reemplaza ni los almacena como fuente de verdad.

| Vertical | Organismos certificadores | Datos ancilares |
| :---- | :---- | :---- |
| Ganadería | Brangus, Angus Argentino, Braford, Hereford, Limousin, Shorthorn | Pedigree, EBVs (Expected Breeding Values), genotipo SNP, pruebas de progenie |
| Minería | IRMA, RMI (Responsible Minerals Initiative), Fairmined, LBMA | Audit score, conflict-free status, environmental compliance, carbon footprint certificado |
| Farmacéutica | FDA, ANMAT, EMA, ICH | Certificate of Analysis, GMP compliance, stability data |
| Alimentos | Rainforest Alliance, Fair Trade, UTZ, USDA Organic | Origen verificado, prácticas de cultivo, score de sostenibilidad |

## **Analytics — proyecciones por industria**

| Tipo de métrica | Ganadería | Minería | Universal para todas las verticales |
| :---- | :---- | :---- | :---- |
| Inventario actual | Animales por Workspace/Facility/Zone/Pen por categoría | Toneladas por tipo y pureza | Assets por status (ACTIVE, IN\_TRANSIT, LOCKED, etc.) |
| Métricas de proceso | Ganancia de peso promedio, feed conversion ratio | Ley del mineral, rendimiento de proceso, carbon footprint acumulado | Ciclo de vida promedio por tipo de asset |
| Incidencias | Mortalidad, % holds activos, eficiencia de vacunación | Safety incidents, environmental breaches, regulatory holds | Incidentes por severidad \+ tiempo de resolución |
| Compliance | % con polígono EUDR, alertas GFW, DDS generados | IRMA score por Facility, conflict-free % por batch | Holds por tipo (sanitary, regulatory, legal) |
| Operaciones | Transfers, Groups, Splits, Merges, Transforms por período | Ídem | Group/Split/Merge/Transform por período — idéntico |

**PARTE III — VERTICAL LIVESTOCK**

*Especificación completa · 11 actores · Assets · Eventos · Flujo de punta a punta*

# **12\. Los actores de la cadena ganadera — visión general**

La cadena bovina argentina no termina en el importador europeo. Continúa en el país de destino con distribuidores, procesadores y minoristas que siguen operando sobre los DerivedAssets (cortes, media res). BIFFCO traza toda la cadena — no solo la exportación.

|  | *Cada actor puede operar como un Workspace independiente o como WorkspaceMember invitado al Workspace de otro actor. El Inspector SENASA, por ejemplo, es un WorkspaceMember en múltiples Workspaces de productores — no un Workspace propio.* |
| :---- | :---- |

| \# | Actor | Rol en la cadena | Workspace propio | Asset que opera |
| :---- | :---- | :---- | :---- | :---- |
| 01 | Productor Ganadero | Origen de la cadena. Cría, engorda y transfiere animales. | Sí — es el tenant principal del origin | AnimalAsset, LotAsset |
| 02 | Veterinario de Campo | Trabajo sanitario diario: vacunas privadas, tratamientos, diagnósticos. | Puede ser propio o WorkspaceMember en el del productor | AnimalAsset (eventos de salud) |
| 03 | Inspector SENASA | Actos regulatorios oficiales: certificados sanitarios, campañas nacionales. | No — es WorkspaceMember en los Workspaces de los productores | AnimalAsset (eventos regulatorios) |
| 04 | Transportista (Carrier) | Custodia durante el traslado. Firma el manifiesto de carga y entrega. | Sí — puede tener múltiples choferes y camiones | AnimalAsset/LotAsset en tránsito |
| 05 | Feedlot / Engordador | Recibe animales, los engorda, registra pesadas, los envía al frigorífico. | Sí — recibe transfers y tiene su propia operación | AnimalAsset, LotAsset |
| 06 | Frigorífico | Faena (Transform 1→N). Crea los DerivedAssets. Verifica EUDR pre-faena. | Sí — el momento más crítico de compliance | AnimalAsset → DerivedAsset |
| 07 | Laboratorio Acreditado | Análisis bromatológicos y certificados de calidad sobre DerivedAssets. | Puede ser propio o WorkspaceMember invitado | DerivedAsset (eventos de calidad) |
| 08 | Exportador / Agente de Exportación | Genera el DDS EUDR. Coordina la documentación de exportación. | Sí — o puede ser el mismo Workspace del Frigorífico | DerivedAsset (documentación) |
| 09 | Importador / Distribuidor UE | Recibe el container. Verifica el DDS. Registra CUSTOMS\_CLEARED. Distribuye. | Sí — en el país de destino | DerivedAsset (customs y distribución) |
| 10 | Minorista / Procesador en destino | Puede hacer SPLIT de DerivedAssets (media res → cortes en destino). | Sí — en el país de destino | DerivedAsset (split en destino) |
| 11 | Auditor Externo | Solo lectura total. Genera reportes para organismos regulatorios. | WorkspaceMember con rol auditor en los Workspaces que audita | Todos (read-only) |

| 01 | 🐄  Productor Ganadero (BovineProducer) |
| :---: | :---- |

El actor origen de la cadena. Cría, gestiona parcelas, registra los animales en el sistema y es el primer custodio y propietario de los assets. Su Workspace es el tenant de origen de toda la cadena.

| Aspecto | Detalle |
| :---- | :---- |
| Roles que puede tener en el Workspace | BovineProducer (rol base), Owner, Admin, Veterinarian (si tiene habilitación), LivestockCarrier (si tiene camión propio) |
| WorkspaceMembers típicos bajo su Workspace | Veterinario de campo (si lo contrata), Inspector SENASA (invitado), Transportista (invitado para transfers), Auditor Externo (invitado) |
| Facilities que gestiona | Múltiples campos con RENSPA distinto. Cada campo con múltiples Zones (lotes) y Pens (corrales). |
| Assets que crea | AnimalAsset (animal individual), LotAsset (agrupación de animales para operaciones) |

## **Permisos del WorkspaceMember BovineProducer**

| Permiso | Puede | No puede |
| :---- | :---- | :---- |
| assets.\* | Crear AnimalAssets y LotAssets. Ver todos sus assets. Actualizar payload. | Crear asset types no definidos en el VerticalPack livestock. |
| events.append — producción | Firmar: ANIMAL\_REGISTERED, ANIMAL\_ONBOARDED, WEIGHT\_RECORDED, FEEDING\_RECORDED, BIRTH\_RECORDED, BRANDING\_RECORDED, REPRODUCTION\_RECORDED, LOCATION\_CHANGED, INTERNAL\_FACILITY\_TRANSFER, GROUP\_FORMED, SPLIT\_COMPLETED, MERGE\_COMPLETED, EXTERNAL\_CERTIFICATION\_LINKED. | Firmar OFFICIAL\_INSPECTION, HEALTH\_CERT\_ISSUED (DTE), QUARANTINE\_IMPOSED — esos son del Inspector SENASA. |
| events.append — incidencias | Firmar: HEALTH\_INCIDENT\_REPORTED, MINOR\_INJURY\_OBSERVED, THEFT\_REPORTED, STRAYING\_REPORTED, DEATH\_RECORDED. | Firmar INCIDENT\_RESOLVED si activó hold — solo el Inspector o Veterinarian habilitado. |
| transfers.\* | Iniciar TRANSFER\_INITIATED. Aceptar TRANSFER\_ACCEPTED si es receptor. Rechazar. | Firmar TRANSFER\_IN\_TRANSIT — ese es del Carrier. |
| facilities.\* | Crear y editar sus Facilities, Zones y Pens. Asignar polígonos EUDR. | — |
| holds.lift | Solo si el hold lo impuso él mismo (LEGAL\_HOLD\_IMPOSED). | No puede levantar holds impuestos por SENASA o Inspector — solo ellos pueden. |
| members.\* | Invitar WorkspaceMembers, asignarles roles, revocar acceso. | — |
| billing.\* | Gestionar la suscripción del Workspace. | — |
| analytics.view | Ver todas las métricas de su Workspace (hacienda, EUDR, operaciones). | — |

## **Dashboard del Productor**

| Sección del dashboard | Contenido |
| :---- | :---- |
| Overview principal | Total de animales por Facility y categoría (ternero, novillo, vaquillona, vaca, toro). Alertas EUDR activas (sin polígono, alerta GFW). Holds activos. Transfers pendientes de aceptar. |
| Mapa de establecimientos | Mapa Leaflet con polígonos de todos sus Facilities y Zones. Color por estado EUDR (verde/amarillo/rojo). Click en un corral → ver los animales actuales. |
| Hacienda — lista de assets | Tabla filtrable por Facility, Zone, Pen, categoría, estado, EID. Búsqueda por EID o ID. Export CSV. Bulk actions (vacunación masiva, pesada masiva, movimiento de lote). |
| Mi red | WorkspaceMembers activos con su último evento firmado. Invitaciones pendientes. Conexiones con transportistas, veterinarios, inspectores. |
| Compliance EUDR | Semáforo por Facility: % animales con polígono / sin polígono / con alerta GFW. Alertas proactivas 30 días antes del deadline. |
| Analytics | Peso promedio por lote y por período. Tasa de nacimientos y mortalidad. Gráfica de evolución del rodeo. Eficiencia de vacunación por campaña. |

## **Eventos que el Productor firma con frecuencia**

| Evento | Cuándo | ¿Requiere evidencia? |
| :---- | :---- | :---- |
| ANIMAL\_REGISTERED | Al nacer un ternero en el campo. Genera nuevo AnimalAsset. | Foto del recién nacido (recomendada). parentAssetIds si se conocen los padres. |
| ANIMAL\_ONBOARDED | Al ingresar un animal adulto sin historial previo en BIFFCO. Incluye disclaimer de historial no verificable. | Foto del animal \+ documento de compra. |
| WEIGHT\_RECORDED | En cada pesada individual o de lote. | Opcional: foto de la balanza. |
| FEEDING\_RECORDED | Al registrar suministro de alimento (tipo, cantidad, fecha). | No requerida. |
| BIRTH\_RECORDED | Alias de ANIMAL\_REGISTERED cuando es un nacimiento confirmado. Crea AnimalAsset automáticamente. | Foto del recién nacido. |
| BRANDING\_RECORDED | Al caravanear o marcar a fuego. Activa el EID en el asset. | Foto de la marca o caravana. |
| LOCATION\_CHANGED (batch) | Al mover un grupo de animales entre corrales. | No requerida. |
| GROUP\_FORMED | Al seleccionar animales para una operación (venta, traslado, vacunación). | No requerida. |
| SPLIT\_COMPLETED | Al dividir un lote en dos grupos para distintos destinos. | No requerida. |
| HEALTH\_INCIDENT\_REPORTED | Al detectar un animal enfermo o lesionado. | Foto del animal (obligatoria). Activa hold automático si severity ≥ high. |
| EXTERNAL\_CERTIFICATION\_LINKED | Al anclar un certificado Brangus / Angus / Braford al animal. | PDF del certificado (obligatorio). Hash SHA-256 ancla en S3 WORM. |
| TRANSFER\_INITIATED | Al iniciar la venta/transferencia a un feedlot, frigorífico u otro productor. | No — la aceptación del receptor es la segunda firma. |

| 02 | 🩺  Veterinario de Campo (Veterinarian) |
| :---: | :---- |

Realiza el trabajo sanitario diario del establecimiento: vacunas privadas, tratamientos médicos con prescripción, diagnósticos, controles sanitarios periódicos. Puede ser un profesional externo contratado o el mismo productor si tiene habilitación profesional. Es un WorkspaceMember del Workspace del productor.

| Aspecto | Detalle |
| :---- | :---- |
| Diferencia con Inspector SENASA | El Veterinario es contratado por el productor, hace trabajo privado diario. El Inspector SENASA es un ente regulatorio que certifica actos formales para el Estado. Son dos roles distintos con permisos distintos. |
| Tipo de Workspace | Trabaja como WorkspaceMember en el Workspace del productor. Puede estar en múltiples Workspaces de distintos productores con la misma cuenta. |
| Quién puede tener este rol | Veterinario con matrícula profesional habilitado para la especie bovina en Argentina. El VerticalPack puede requerir matrícula\_id como campo de su WorkspaceMember. |

## **Permisos del WorkspaceMember Veterinarian**

| Permiso | Puede | No puede |
| :---- | :---- | :---- |
| events.append — tratamientos | VACCINE\_ADMINISTERED (todas las vacunas, incluyendo las que requieren prescripción). TREATMENT\_ADMINISTERED (antibióticos, antiparasitarios — con PDF de prescripción adjunto). VETERINARY\_INSPECTION (inspección privada periódica). | Firmar OFFICIAL\_INSPECTION ni HEALTH\_CERT\_ISSUED (DTE) — esos son del Inspector SENASA. |
| events.append — incidencias | HEALTH\_INCIDENT\_REPORTED (puede reportar y puede firmar el diagnóstico formal). INCIDENT\_RESOLVED (puede levantar holds sanitarios privados — los impuestos por SENASA solo los levanta el Inspector SENASA). | No puede levantar holds impuestos por SENASA sin ser él mismo el Inspector SENASA. |
| assets.read | Ver todos los assets del Workspace en los que fue invitado. | — |
| holds.impose | Puede imponer VETERINARY\_HOLD sobre un animal en base a diagnóstico clínico. | No puede imponer holds regulatorios (SENASA) — solo el Inspector SENASA. |
| analytics.view | Ver el historial sanitario y métricas de salud del rodeo. | No puede ver datos de billing ni configuración del Workspace. |

## **Dashboard del Veterinario**

| Sección | Contenido |
| :---- | :---- |
| Cola de trabajo | Animales asignados para revisión, animales con incidencias pendientes de diagnóstico, campañas de vacunación programadas. |
| Historial sanitario del rodeo | Timeline de eventos sanitarios de todos los assets. Filtros por tipo de evento, período, Facility, gravedad. Alertas de medicamentos con período de carencia activo. |
| Animales en hold | Lista de animales con LOCKED o QUARANTINE activos, con fecha de imposición y motivo. Botón "Resolver" para los que él puede levantar. |
| Mis visitas | Log de sus propias visitas a cada establecimiento con los eventos que firmó en cada una. |

## **Eventos que el Veterinario firma**

| Evento | Cuándo | ¿Requiere evidencia? |
| :---- | :---- | :---- |
| VACCINE\_ADMINISTERED | Al aplicar cualquier vacuna privada (vitaminas, antihelmínticos, vacunas propias de la estancia). | Foto del rótulo del envase (recomendada). Número de lote del producto. |
| TREATMENT\_ADMINISTERED | Al aplicar antibióticos, antiparasitarios sistémicos u otros medicamentos de venta bajo prescripción. | PDF de la prescripción veterinaria (obligatorio). Período de carencia declarado. |
| VETERINARY\_INSPECTION | Al realizar una revisión sanitaria periódica del lote o del individuo. | Informe escrito (recomendado). Hallazgos en el payload del evento. |
| HEALTH\_INCIDENT\_REPORTED | Al diagnosticar una enfermedad o detectar una condición patológica. | Foto del animal (obligatoria). Diagnóstico presuntivo en el payload. Activa hold si severity ≥ high. |
| INCIDENT\_RESOLVED | Al confirmar la recuperación o el cierre del caso, para holds que él mismo impuso. | PDF del informe veterinario de alta. |
| GENETICS\_RECORDED | Al registrar datos genéticos o resultados de análisis de ADN. | Informe del laboratorio genético (obligatorio). |
| BIRTH\_RECORDED | Al asistir un parto y registrar el nacimiento. | Foto del ternero. |

| 03 | 📋  Inspector SENASA (SenasaInspector) |
| :---: | :---- |

Representa al organismo regulatorio oficial (Servicio Nacional de Sanidad y Calidad Agroalimentaria). Certifica movimientos de hacienda, dirige campañas sanitarias nacionales, emite los DTE obligatorios y es el único actor que puede levantar holds sanitarios impuestos por el Estado.

| Aspecto | Detalle |
| :---- | :---- |
| Diferencia con Veterinario de Campo | El Inspector SENASA es el brazo del Estado. Sus actos tienen consecuencias regulatorias formales. El Veterinario de Campo hace trabajo privado sin efecto en el registro oficial SENASA. |
| Tipo de Workspace | WorkspaceMember invitado en los Workspaces de los actores que supervisa (productores, frigoríficos, transportistas). Puede estar en múltiples Workspaces. |
| Multi-tenant | Opera en múltiples Workspaces distintos desde una sola cuenta. Ve asignaciones pendientes de todos los tenants en su dashboard. |

## **Permisos del WorkspaceMember SenasaInspector**

| Permiso | Puede | No puede |
| :---- | :---- | :---- |
| events.append — regulatorios | OFFICIAL\_INSPECTION (inspección sanitaria oficial). HEALTH\_CERT\_ISSUED (emite el DTE — Documento de Tránsito Electrónico). VACCINE\_ADMINISTERED para campañas nacionales (aftosa, brucelosis). QUARANTINE\_IMPOSED y QUARANTINE\_LIFTED. | — |
| events.append — sanitarios | HEALTH\_INCIDENT\_REPORTED (reporte oficial). INCIDENT\_RESOLVED (ÚNICO que puede levantar holds impuestos por el Estado o por cualquier actor del Workspace). | No puede levantar holds impuestos por otro Inspector SENASA de otro organismo (ej: SENASA Bromatología). |
| assets.read | Ver todos los assets y el historial completo de los Workspaces en los que fue invitado. | — |
| holds.impose | SANITARY\_HOLD (por incidencia sanitaria). QUARANTINE\_IMPOSED (cuarentena oficial). | — |
| holds.lift | Es el ÚNICO que puede levantar holds sanitarios impuestos por el Estado. | No puede levantar holds legales (embargos). |
| analytics.view | Ver métricas sanitarias y estado EUDR de los Workspaces que supervisa. | No puede ver datos de billing. |

## **Dashboard del Inspector SENASA**

| Sección | Contenido |
| :---- | :---- |
| Mis tenants activos | Lista de Workspaces de productores/frigoríficos en los que tiene acceso. Estado general de compliance de cada uno. |
| Cola de certificaciones pendientes | Solicitudes de DTE pendientes de emitir. Cada solicitud muestra: animales del lote, Facility de origen, destino, transportista designado. |
| Alertas sanitarias activas | Holds activos en todos sus tenants. Cuarentenas vigentes. Campañas nacionales con cobertura pendiente. |
| Mis actos firmados | Timeline completo de todos los eventos que él firmó, con workspaceId y assetId. |
| Campañas nacionales | Estado de cobertura de campañas (aftosa, brucelosis) por Facility: % vacunados / total. |

## **Eventos críticos que solo el Inspector SENASA puede firmar**

| Evento | Significado regulatorio |
| :---- | :---- |
| OFFICIAL\_INSPECTION | Acto de inspección sanitaria oficial. Requisito previo al DTE en muchos casos. |
| HEALTH\_CERT\_ISSUED (DTE) | El Documento de Tránsito Electrónico. Sin este, el TRANSFER\_INITIATED está bloqueado si el VerticalPack lo requiere. |
| VACCINE\_ADMINISTERED (campaña nacional) | Vacunación oficial de aftosa, brucelosis, etc. Con número de campaña SENASA en el payload. |
| QUARANTINE\_IMPOSED | Cuarentena oficial sobre un animal o lote. El asset pasa a QUARANTINE. Ningún otro actor puede levantarla. |
| QUARANTINE\_LIFTED | Solo él puede levantar la cuarentena que impuso. |
| INCIDENT\_RESOLVED (hold de Estado) | Levanta cualquier hold sanitario impuesto por el Estado sobre el Workspace. |

| 04 | 🚛  Transportista (LivestockCarrier) |
| :---: | :---- |

Tiene la custodia física de los animales durante el traslado. No es el dueño — el productor sigue siendo el owner hasta que el receptor acepta el transfer. Puede ser una empresa con múltiples camiones y choferes, o el mismo productor que tiene su propio camión.

| Aspecto | Detalle |
| :---- | :---- |
| Workspace propio | Sí — puede ser "Transportes Vidal SA" con múltiples WorkspaceMembers (choferes) y Employees. Tiene actor\_connections con los Workspaces de los productores. |
| También puede ser | WorkspaceMember del Workspace del productor, si el productor tiene su propio camión y chofer. |
| Casos complejos | Una empresa transportista puede tener múltiples choferes (WorkspaceMembers) y ayudantes (Employees sin cuenta). Cada camión se registra como vehículo en el Workspace. |
| Operación offline | La firma de TRANSFER\_IN\_TRANSIT se diseña para funcionar offline desde el celular del chofer. Los eventos se sincronizan cuando recupera señal. |

## **Permisos del WorkspaceMember LivestockCarrier**

| Permiso | Puede | No puede |
| :---- | :---- | :---- |
| events.append — transfer | TRANSFER\_IN\_TRANSIT (firma el manifiesto de carga al partir). TRANSFER\_COMPLETED o TRANSFER\_DELIVERED (firma la entrega en destino — opcional según el VerticalPack). | TRANSFER\_INITIATED (eso es del cedente). TRANSFER\_ACCEPTED (eso es del receptor). |
| events.append — transporte | CHECKPOINT\_RECORDED (registro de puntos de control GPS durante el traslado). VEHICLE\_INCIDENT\_REPORTED (accidente, avería, demora). | No puede firmar eventos sanitarios ni de salud. |
| assets.read | Ver los assets que están bajo su custodia activa (custodianId \= él). | No puede ver assets de otros carriers ni del historial completo del productor. |
| analytics.view | Ver sus cargas activas, cargas completadas del período, KPIs de traslado (tiempo, discrepancias). | No puede ver datos financieros del productor. |

## **Dashboard del Carrier (mobile-first)**

| Sección | Contenido |
| :---- | :---- |
| Cargas activas | Lista de transfers IN\_TRANSIT donde él es custodian. Con datos del origen, destino, número de animales, DTE del lote. |
| Firma de manifiesto | Vista de los assets a transportar. Botón "Firmar y partir" — genera TRANSFER\_IN\_TRANSIT con geolocalización del punto de partida. |
| Estado de conectividad | Badge de sync: "Online — N eventos pendientes de sync" o "Offline — firmando en local". Cuando recupera señal: sincronización automática. |
| Mis entregas | Historial de cargas completadas con tiempo de traslado, estado de entrega, discrepancias registradas. |

| 05 | 🌾  Feedlot / Engordador (FeedlotOperator) |
| :---: | :---- |

Recibe animales del productor, los engorda durante semanas o meses, registra el seguimiento de peso y alimentación, y los envía al frigorífico. Es un Workspace receptor de transfers y emisor de transfers hacia el frigorífico.

## **Permisos del WorkspaceMember FeedlotOperator**

| Permiso | Puede | No puede |
| :---- | :---- | :---- |
| transfers | Aceptar TRANSFER\_ACCEPTED (recibe los animales del productor). Iniciar TRANSFER\_INITIATED (envía al frigorífico). FEEDLOT\_EXIT al salir. | No puede firmar DTE ni OFFICIAL\_INSPECTION — necesita al Inspector SENASA para eso. |
| events.append | FEEDLOT\_ENTRY (registro de ingreso), WEIGHT\_GAIN\_RECORDED (pesada periódica), FEEDING\_RECORDED, LOCATION\_CHANGED (mover entre corrales internos), GROUP\_FORMED (sub-grupos por peso), SPLIT\_COMPLETED (dividir lote para distintos frigoríficos). | — |
| facilities.\* | Gestionar sus propios corrales y Zones. | — |
| analytics.view | Tropa en planta, ganancia diaria de peso, feed conversion ratio, proyección de salida, ocupación de corrales. | — |

## **Dashboard del Feedlot**

| Sección | Contenido |
| :---- | :---- |
| Tropa en planta | Total de animales por Corral y por lote de entrada. Días en planta. Peso promedio de entrada vs actual. |
| Pesadas pendientes | Animales que no tienen pesada en los últimos N días configurables. |
| Proyección de salida | Animales que alcanzan el peso objetivo en los próximos N días basado en la tendencia de ganancia. |
| Feed conversion ratio | kg de alimento suministrado / kg de ganancia de peso. Por corral y por período. |
| Lotes salientes | Transfers pendientes de iniciar hacia el frigorífico. |

| 06 | 🔪  Frigorífico (SlaughterhouseOperator) |
| :---: | :---- |

El actor más crítico del compliance EUDR. Recibe los animales, verifica el estado regulatorio pre-faena de cada uno, ejecuta la faena atómica (TRANSFORM 1→N), crea los DerivedAssets y genera el DDS EUDR. Puede tener múltiples plantas (Facilities) con distintas habilitaciones.

## **Permisos del WorkspaceMember SlaughterhouseOperator**

| Permiso | Puede | No puede |
| :---- | :---- | :---- |
| assets.transform | SLAUGHTER\_COMPLETED (Transform 1→N): la operación más crítica del sistema. Requiere que el animal esté ACTIVE, sin holds, con DTE vigente, y si es destino UE: con VETERINARY\_INSPECTION en las últimas 72 horas. | No puede ejecutar SLAUGHTER\_COMPLETED si cualquier validación previa falla. |
| events.append | SLAUGHTER\_SCHEDULED, QUALITY\_GRADE\_ASSIGNED (tipificación SENASA/EU EUROP/USDA en el DerivedAsset), DERIVED\_ASSET\_CREATED. | — |
| transfers | Aceptar TRANSFER\_ACCEPTED (recibe del feedlot o productor). Iniciar TRANSFER\_INITIATED (envía DerivedAssets al exportador). | — |
| compliance | EUDR\_DDS\_GENERATED (genera el Documento de Debido Cumplimiento). | — |
| analytics.view | Tropa en planta, semáforo EUDR por animal, DDS pendientes de generar. | — |

## **Dashboard del Frigorífico**

| Sección | Contenido |
| :---- | :---- |
| Tropa recibida | Animals en planta con estado ACTIVE. Desglose por origen (Workspace del productor). Fecha de TRANSFER\_ACCEPTED. |
| Semáforo EUDR pre-faena | Por cada animal: ✅ Verde (DTE vigente, polígono presente, GFW sin alerta, inspección reciente). ⚠️ Amarillo (algún requisito por vencer). ❌ Rojo (no cumple — no puede ser faenado). |
| DDS EUDR pendientes | Animales ya faenados cuyos DerivedAssets no tienen DDS generado. Botón "Generar DDS". |
| DerivedAssets en stock | Cortes, media res, cuero, menudencias disponibles para transferir o exportar. |
| Historial de faenas | Timeline de SLAUGHTER\_COMPLETED con desglose de derivados por faena. |

## **La faena atómica — SLAUGHTER\_COMPLETED**

La operación más crítica del sistema. Una sola transacción PostgreSQL. Si falla cualquier paso: rollback total.

| Paso | Validación / Acción |
| :---- | :---- |
| 1\. Seleccionar animal | El animal debe estar en status ACTIVE y currentPenId en una Pen del Workspace del Frigorífico. |
| 2\. Validar pre-faena | 0 holds activos. DTE vigente (HEALTH\_CERT\_ISSUED no expirado). Si destino UE: VETERINARY\_INSPECTION en las últimas 72 horas. |
| 3\. Verificar EUDR | Polígono declarado en Zone de origen. GFW check: sin alerta de deforestación. |
| 4\. Declarar derivados | El operador declara los DerivedAssets a crear: tipo (cuadril, costillar, cuero, menudencia), peso, cantidad de cajas. |
| 5\. Validar pesos | Suma de pesos declarados ≤ peso canal caliente del animal. Rechaza si se viola. |
| 6\. Transacción atómica | AnimalAsset → status CLOSED. N DerivedAssets creados con parentAssetId \= AnimalAsset.id. Si falla el DerivedAsset N: rollback total. |
| 7\. Firma en browser | El WorkspaceMember del Frigorífico firma el SLAUGHTER\_COMPLETED con su clave privada del Workspace. |

| 07 | 🔬  Laboratorio Acreditado (AccreditedLaboratory) |
| :---: | :---- |

Realiza análisis bromatológicos, microbiológicos y de calidad sobre los DerivedAssets. Emite certificados de calidad que el Exportador adjunta al DDS. Puede ser un Workspace propio invitado al Workspace del Frigorífico o del Exportador.

## **Permisos del WorkspaceMember AccreditedLaboratory**

| Permiso | Puede |
| :---- | :---- |
| events.append | QUALITY\_ANALYSIS\_STARTED (registro de muestra), QUALITY\_ANALYSIS\_COMPLETED (resultados bromatológicos/microbiológicos), QUALITY\_CERT\_ISSUED (certificado formal de calidad), EXTERNAL\_CERTIFICATION\_LINKED (anclar certificado de calidad como evidence). |
| assets.read | Ver los DerivedAssets sobre los que fue invitado a operar. |
| analytics.view | Ver sus análisis completados, tiempo de respuesta, certifications emitidas. |

## **Dashboard del Laboratorio**

| Sección | Contenido |
| :---- | :---- |
| Muestras pendientes | DerivedAssets asignados para análisis. Con fecha de solicitud y tipo de análisis requerido. |
| Análisis en proceso | Estado de análisis activos. Timer desde la recepción de la muestra. |
| Certificados emitidos | Historial de QUALITY\_CERT\_ISSUED con assetId, resultados y fecha. Descarga de PDF del certificado. |

| 08 | 📦  Exportador / Agente de Exportación (Exporter) |
| :---: | :---- |

Genera el DDS EUDR (Documento de Debida Diligencia), coordina la documentación de exportación y gestiona el container hacia el importador europeo. Puede ser el mismo Workspace del Frigorífico o un actor separado.

## **Permisos del WorkspaceMember Exporter**

| Permiso | Puede |
| :---- | :---- |
| compliance | EUDR\_DDS\_GENERATED (genera el DDS Art. 4 del Reglamento UE 2023/1115 con todos los polígonos de origen). EXPORT\_DOCUMENTATION\_ISSUED. |
| events.append | LOT\_FORMED (agrupa DerivedAssets para el container), GROUP\_FORMED tipo EXPORT, CONTAINER\_LOADED. |
| transfers | TRANSFER\_INITIATED hacia el Importador UE. Con número de Bill of Lading como metadata. |
| assets.read | Ver el historial completo de los DerivedAssets que exporta — necesita el linaje para el DDS. |
| analytics.view | DDS generados, containers despachados, alertas EUDR activas en los assets exportados. |

## **Dashboard del Exportador**

| Sección | Contenido |
| :---- | :---- |
| DDS pendientes de generar | DerivedAssets listos para exportar sin DDS. Cada fila muestra: assetId, origen, peso, estado EUDR del linaje completo. |
| Containers activos | Transfers IN\_TRANSIT hacia el importador. Con Bill of Lading, fecha estimada de arribo. |
| Compliance EUDR | Semáforo por container: % de DerivedAssets con DDS ✅ / pendientes ⚠️. |
| Historial de exportaciones | Log de todos los containers exportados con el reference number del IS EUDR Gateway (cuando esté disponible en Fase F). |

| 09 | 🇪🇺  Importador / Distribuidor UE (EUImporter) |
| :---: | :---- |

Recibe el container en el país de destino, verifica el DDS EUDR, registra el clearance aduanero y distribuye a mayoristas, procesadores y minoristas. La cadena NO termina aquí — continúa con los actores en destino.

## **Permisos del WorkspaceMember EUImporter**

| Permiso | Puede |
| :---- | :---- |
| transfers | TRANSFER\_ACCEPTED (acepta el container del exportador argentino). TRANSFER\_INITIATED (re-distribuye a mayoristas y procesadores en destino). |
| events.append | CUSTOMS\_CLEARED (registro del clearance aduanero con número de declaración). IMPORT\_INSPECTION\_PASSED. DISTRIBUTION\_STARTED. |
| compliance | EUDR\_DDS\_VERIFIED (confirma que el DDS es válido para la regulación del país de destino). |
| assets.split | SPLIT\_COMPLETED: puede dividir el container en los DerivedAssets individuales para distribución (si el container llegó como grupo). |
| analytics.view | Container en tránsito, stock en sus depósitos, DDS verificados, alertas de vencimiento de documentos. |

## **Dashboard del Importador**

| Sección | Contenido |
| :---- | :---- |
| Containers en tránsito | Transfers IN\_TRANSIT hacia él. ETA, número de B/L, estado de documentación. |
| Verificación EUDR | Por cada container entrante: estado del DDS (válido/pendiente/con alerta). Botón "Verificar en IS EUDR". |
| Stock en depósitos | DerivedAssets ACTIVE en sus Facilities/Zones/Pens del país de destino. |
| Distribución activa | Transfers iniciados hacia mayoristas y procesadores. Estado de entrega. |

| 10 | 🏪  Minorista / Procesador en destino (RetailerProcessor) |
| :---: | :---- |

Opera en el país de destino. Puede recibir media res y ejecutar un SPLIT (Transform o Split según el VerticalPack) para crear los cortes individuales. Es el último eslabón activo antes del consumidor final. Sus assets son DerivedAssets de nivel 2 (cortes individuales con QR en la góndola).

## **Permisos del WorkspaceMember RetailerProcessor**

| Permiso | Puede |
| :---- | :---- |
| transfers | TRANSFER\_ACCEPTED (recibe del importador). Puede ser receptor final. |
| assets.split / assets.transform | SPLIT\_COMPLETED sobre DerivedAssets: dividir una media res en cortes individuales. Cada corte resultante tiene parentAssetId → media res → animal → parcela de Santa Fe. |
| events.append | PROCESSING\_STEP\_COMPLETED (despiece), RETAIL\_PACKAGING\_COMPLETED (empaquetado para góndola). |
| analytics.view | Stock en cámara, DerivedAssets por tipo de corte, QRs generados. |

## **El QR en la góndola — la experiencia del consumidor final**

Un corte de carne en Rotterdam o Shangái tiene un QR que lleva a verify.biffco.co. El consumidor ve: el origen (Santa Fe, Argentina), el polígono de la parcela donde pastó el animal, la cadena de 7 actores que procesaron el producto, el resultado del GFW check (sin alerta de deforestación), y la firma criptográfica de cada paso.

| 11 | 🔍  Auditor Externo (ExternalAuditor) |
| :---: | :---- |

Solo lectura total. No firma ningún evento. Puede ser un auditor contratado por el productor, por el importador europeo, o por un organismo regulatorio. Genera reportes formales de auditoría descargables.

## **Permisos del WorkspaceMember ExternalAuditor**

| Permiso | Puede | No puede |
| :---- | :---- | :---- |
| assets.read | Ver todos los assets, su estado actual, su historial completo de eventos, y el linaje completo (DAGVisualizer). | — |
| events.read | Ver todos los eventos firmados con su verificación de firma (SignatureBadge ✓/✗). | Firmar ningún evento. |
| analytics.view | Ver todas las métricas del Workspace que audita. | — |
| reports.generate | Generar un PDF de auditoría descargable con el resumen del Workspace, assets auditados y estado de compliance. | — |
| admin / holds / transfers / compliance | Ninguno. | No puede realizar ninguna acción que modifique el estado del sistema. |

## **Dashboard del Auditor**

| Sección | Contenido |
| :---- | :---- |
| Vista de compliance | Semáforo EUDR para todos los assets del Workspace auditado. Holds activos y su antigüedad. DDS generados/pendientes. |
| Timeline de eventos | Event Store completo del Workspace con filtros avanzados. SignatureBadge por evento. Export CSV de todos los eventos. |
| Linaje de assets | DAGVisualizer para cualquier asset — muestra el árbol completo de parentAssetIds hasta el origen. |
| Generar reporte | Botón "Generar Reporte de Auditoría". PDF con: período auditado, assets relevantes, eventos firmados, anomalías detectadas, estado EUDR global. |

# **24\. La cadena completa — flujo de punta a punta**

Desde la parcela de Santa Fe hasta la góndola de un supermercado en Rotterdam o Shangái. Cada paso es un DomainEvent firmado con Ed25519, persistido en el Event Store append-only, y ancilable en Polygon para verificación independiente.

| Paso | Actor(es) | Operación BIFFCO | Asset resultante |
| :---- | :---- | :---- | :---- |
| 1\. Nacimiento o incorporación | Productor Ganadero | ANIMAL\_REGISTERED o ANIMAL\_ONBOARDED. El animal nace en el sistema con su EID. | AnimalAsset — status ACTIVE |
| 2\. Vida en el campo | Productor \+ Veterinario | WEIGHT\_RECORDED, FEEDING\_RECORDED, VACCINE\_ADMINISTERED (privadas), BRANDING\_RECORDED. El Veterinario suma inspecciones periódicas. | AnimalAsset — eventos acumulados |
| 3\. Controles SENASA | Inspector SENASA | OFFICIAL\_INSPECTION. HEALTH\_CERT\_ISSUED (DTE para el movimiento). Campañas: VACCINE\_ADMINISTERED (aftosa, brucelosis). | AnimalAsset — con DTE vigente |
| 4\. Certificación de raza | Productor / Veterinario | EXTERNAL\_CERTIFICATION\_LINKED (Brangus, Angus, Braford). PDF del HerdBook anclado con SHA-256. | AnimalAsset — con certificación de raza |
| 5\. Selección para venta | Productor Ganadero | GROUP\_FORMED: selecciona 40 de 45 animales. TRANSFER\_INITIATED hacia el feedlot. | AssetGroup "TG-2024-001" (40 animales) |
| 6\. Transporte al feedlot | Transportista | TRANSFER\_IN\_TRANSIT: firma el manifiesto desde el camión (offline si no hay señal). CHECKPOINT\_RECORDED en ruta. | 40 AnimalAssets — custodianId \= Carrier |
| 7\. Ingreso al feedlot | Feedlot Operator | TRANSFER\_ACCEPTED. FEEDLOT\_ENTRY. LOCATION\_CHANGED a los corrales del feedlot. | 40 AnimalAssets — custodianId \= Feedlot |
| 8\. Engorde (semanas/meses) | Feedlot Operator | WEIGHT\_GAIN\_RECORDED periódico. FEEDING\_RECORDED. Sub-grupos por peso: GROUP\_FORMED o SPLIT\_COMPLETED. | AnimalAssets — historial de pesadas |
| 9\. Salida del feedlot | Feedlot \+ Inspector SENASA | HEALTH\_CERT\_ISSUED (DTE para el movimiento). FEEDLOT\_EXIT. TRANSFER\_INITIATED hacia el frigorífico. | 40 AnimalAssets — con DTE vigente |
| 10\. Transporte al frigorífico | Transportista | TRANSFER\_IN\_TRANSIT. TRANSFER\_DELIVERED en destino. | 40 AnimalAssets — custodianId \= Carrier |
| 11\. Recepción y verificación pre-faena | Frigorífico | TRANSFER\_ACCEPTED. Verificación EUDR: DTE vigente \+ polígono \+ GFW check \+ VETERINARY\_INSPECTION \< 72h. | 40 AnimalAssets — semáforo EUDR por animal |
| 12\. Faena (Transform 1→N atómica) | Frigorífico | SLAUGHTER\_COMPLETED por animal. Por el Animal ID-001: genera DerivedAsset Cuadril, DerivedAsset Costillar, DerivedAsset Cuero. | AnimalAsset → CLOSED. 3 DerivedAssets por animal con parentAssetId → Animal ID-001 |
| 13\. Control de calidad | Laboratorio Acreditado | QUALITY\_ANALYSIS\_COMPLETED. QUALITY\_CERT\_ISSUED con resultados bromatológicos. | DerivedAssets — con certificado de calidad |
| 14\. Agrupación para exportación | Exportador | GROUP\_FORMED tipo EXPORT "CONTAINER-EU-001": 120 cajas de cuadril de los 40 animales. EUDR\_DDS\_GENERATED. | AssetGroup "CONTAINER-EU-001" \+ DDS EUDR |
| 15\. Exportación | Exportador | TRANSFER\_INITIATED hacia el Importador UE. Container con Bill of Lading como metadata. | 120 DerivedAssets — IN\_TRANSIT hacia Rotterdam |
| 16\. Customs y recepción en UE | Importador / Distribuidor UE | TRANSFER\_ACCEPTED. CUSTOMS\_CLEARED. EUDR\_DDS\_VERIFIED. | 120 DerivedAssets — ACTIVE en Rotterdam |
| 17\. Distribución en destino | Importador / Distribuidor UE | TRANSFER\_INITIATED hacia mayoristas. SPLIT\_COMPLETED si el container se divide en envíos menores. | DerivedAssets — distribuidos en Europa |
| 18\. Procesamiento en destino (opcional) | Minorista / Procesador | SPLIT\_COMPLETED: media res → cortes individuales (ojo de bife, costilla ancha, etc.). Cada corte: parentAssetId → media res → animal → parcela SF. | DerivedAssets nivel 2 — cortes individuales con QR |
| 19\. Punto de venta | Minorista | RETAIL\_PACKAGING\_COMPLETED. QR impreso en la etiqueta del producto. | DerivedAsset en góndola — verify.biffco.co/\[id\] |
| 20\. Verificación por el consumidor / regulador | Cualquier persona con el QR | Escanea el QR → verify.biffco.co → banner ✅ EUDR Compliant → cadena completa visible. | Verificación pública sin cuenta. Sin confianza en BIFFCO — solo en la matemática. |

**PARTE IV — ARQUITECTURA MODULAR Y PLAN DE CONSTRUCCIÓN**

*5 módulos · 12 meses · los 4 primeros son completamente vertical-agnósticos*

# **25\. Los 5 módulos**

|  | Los módulos 1–4 no conocen ningún vertical. Son la plataforma. El módulo 5 es el único que implementa el dominio de cada industria. Puede crecer sin límite. La prueba: grep packages/core → 0 imports de packages/verticals. |
| :---- | :---- |

| \# | Módulo | Semanas | Vertical-agnóstico | Qué habilita |
| :---- | :---- | :---- | :---- | :---- |
| 01 | Foundation | 1–2 | Sí — 100% | Infraestructura base, schema completo con Workspace model, CI. |
| 02 | Core Trust Layer | 3–8 | Sí — 100% | Ed25519, SLIP-0010 (wsIdx), Event Store, RBAC, Workspace, Group/Split/Merge/Transform hooks, Polygon. |
| 03 | Product Layer | 9–16 | Sí — 100% | DynamicFormRenderer para cualquier UISchema, dashboards dinámicos, S3 WORM, emails, PDFs. |
| 04 | Verification Layer | 13–16 | Sí — 100% | verify.biffco.co — verifica cualquier asset de cualquier vertical en \< 500ms sin auth. |
| 05 | Vertical Packs | 17+ | No — conoce el dominio | Livestock (primera instancia). Mining (segunda instancia). Cualquier vertical futura: 2–3 semanas. |

| `biffco/                              ← monorepo pnpm + TurboRepo` `├── apps/` `│   ├── web/          biffco.co      ← sitio público multi-vertical` `│   ├── platform/     app.biffco.co  ← Workspace + Operations Dashboards` `│   ├── verify/       verify.biffco.co ← verifica cualquier asset de cualquier vertical` `│   └── api/          api.biffco.co  ← sirve a todas las verticales vía tRPC` `├── packages/` `│   ├── core/                        ← REGLA: nunca importa packages/verticals/*` `│   │   ├── domain/     DomainEvent, Asset (parentIds[], currentPenId), WorkspaceMember` `│   │   ├── crypto/     Ed25519, SLIP-0010 (path con wsIdx), Merkle, BIP-39` `│   │   ├── event-store/ Append-only, replay, lineage, hooks para Group/Split/Merge/Transform` `│   │   ├── rbac/       Permission enum (incluye assets.split, assets.merge, assets.transform)` `│   │   └── vertical-engine/ VerticalPack interface, VerticalRegistry, DynamicFormRenderer` `│   ├── db/           ← schema genérico: workspaces, workspace_members, teams, employees,` `│   │                    facilities, zones, pens, assets, asset_groups, domain_events...` `│   ├── ui/           ← design system + DynamicFormRenderer (acepta cualquier UISchema)` `│   ├── config/       ← Zod env + feature flags` `│   ├── email/        ← templates parametrizables por vertical` `│   ├── pdf/          ← Asset Passport (genérico) + generadores específicos por vertical` `│   ├── shared/       ← branded types, utils, Zod schemas compartidos` `│   └── verticals/` `│       ├── livestock/   ← Sprint C: 11 actores, ~24 eventos, faena atómica` `│       ├── mining/      ← Sprint F: 8 actores, Battery Passport` `│       └── [futuro]/    ← cada nueva vertical sin tocar nada anterior` `└── docs/`     `├── vertical-specs/  ← Ubiquitous Language, actors, events por vertical`     `└── ADRs/` |
| :---- |

# **26\. Plan de construcción — 12 meses**

| Fase | Semanas | Hito técnico | Hito de negocio | Vertical-específico |
| :---- | :---- | :---- | :---- | :---- |
| 0 — Foundation | 1–2 | Monorepo, CI, schema completo con Workspace model, 3 apps en Vercel | biffco.co online. Entorno reproducible en \< 10 min. | No |
| A — Core Trust | 3–8 | Ed25519 \+ SLIP-0010 (wsIdx), Event Store, RBAC, Group/Split/Merge/Transform hooks, Workspace signup, Polygon Amoy | Login \+ mnemonic. Primer anclaje blockchain. | No |
| B — Product | 9–16 | DynamicFormRenderer, dashboards dinámicos, Facility/Zone/Pen UI, S3 WORM, transfers, verify.biffco.co \< 500ms | QR verificable. Evidencias WORM. | No |
| C — Livestock | 17–22 | packages/verticals/livestock: 11 actores, 3 asset types, \~24 eventos, faena atómica, GFW, DDS EUDR | Cadena ganadera E2E. El Core no se tocó. | Sí — primera instancia |
| D — Go Live | 23–30 | Producción Neon, Grafana, DDS EUDR completo, CLI npm, pentest | Actores reales. Datos reales. Evidencia para inversores. | Livestock |
| E — Growth | 31–46 | Stripe multi-vertical, pgvector, anomalías, Polygon Mainnet | Revenue. IA. Mainnet. | Agnóstico |
| F — Mining | 47–52 | packages/verticals/mining: Battery Passport, IS EUDR gateway, i18n | 2 verticales. El Core no se tocó para el segundo. | Mining — segunda instancia |

## **Fases del build — resumen de sprints clave**

| 0 | FOUNDATION   ·   Semanas 1–2 *Schema con Workspace model completo. ESLint invariante activo desde el día 1\.* |
| :---: | :---- |

| SPRINT 0.1  Semanas 1–2  ·  *Monorepo, servicios, schema genérico* |  |
| :---- | :---- |
| **⬛  BACKEND** | **🖥  FRONTEND** |
| ▸  pnpm workspaces \+ turbo.json. TypeScript 5.x strict. ▸  ESLint: no-restricted-imports (core→verticals) activo desde el día 1\. ▸  packages/db: schema completo — workspaces, workspace\_members, teams, employees, facilities, zones, pens, assets (parentIds\[\], currentPenId, currentGroupId), asset\_groups, domain\_events, holds, asset\_certifications. ▸  Trigger anti-tampering domain\_events. RLS con SET app.current\_workspace. ▸  Índice GIN en assets.parent\_ids\[\]. Doppler \+ Neon \+ Upstash \+ Railway \+ CI. | ▸  apps/web: landing multi-vertical. apps/platform: layout shell. apps/verify: Next.js Edge. ▸  globals.css: tokens CSS. Tipografías: Nohemi \+ Inter \+ JetBrains Mono. Dark mode. |
| **🖼  PANTALLAS** →  biffco.co → landing con secciones Ganadería / Minería / Logística |  |
| **⚡  DONE:** setup.sh \< 10 min · PostGIS activo · CI bloquea PR · ESLint invariante verificado |  |

| ⚡ PHASE GATE 0  v0.1 — Foundation |
| :---- |
| **🏁  Plataforma base lista. Workspace model en el schema.** |
| ✅  setup.sh \< 10 minutos en máquina limpia |
| ✅  Schema completo con Workspace model migrado. PostGIS activo. |
| ✅  CI: ESLint invariante (core→verticals prohibido) verificado con PR de prueba |

| A | CORE TRUST LAYER   ·   Semanas 3–8 *Contrato criptográfico. Workspace signup. Group/Split/Merge/Transform hooks.* |
| :---: | :---- |

| SPRINT A.1  Semanas 3–5  ·  *Domain types, crypto con wsIdx, Event Store con hooks* |  |
| :---- | :---- |
| **⬛  BACKEND** | **🖥  FRONTEND** |
| ▸  packages/core/domain: Asset (con parentIds, currentGroupId, currentPenId), WorkspaceMember, Team, Employee, AssetGroup, DomainEvent, Result\<T,E\>. ▸  packages/core/crypto: signEvent/verifyEvent (Ed25519). SLIP-0010: path m/0'/wsIdx'/memberIdx'. generateMnemonic(24) — solo en browser. ▸  MerkleTree \+ SHA-256. canonicalJson determinístico antes de firmar. ▸  PostgresEventStore: append (verifica firma), replay (3 corridas \= mismo resultado), getByAssetId, getDescendants, getAncestors. ▸  Hooks: beforeOperation(rules) \+ afterOperation(results) — el VerticalPack inyecta sus validaciones en los hooks de Group/Split/Merge/Transform. | ▸  packages/ui: Button, Input, Card, Badge, Spinner, Skeleton, Modal, Toast — con Storybook. ▸  EventTimeline, SignatureBadge (✓/✗), DAGVisualizer (árbol de parentIds) — genéricos. ▸  apps/platform: layout completo. |
| **🖼  PANTALLAS** →  Storybook: 10+ componentes genéricos documentados |  |
| **⚡  DONE:** Ed25519 vectores RFC 8037 · SLIP-0010 con wsIdx: derivación determinista · replay 3 corridas idénticas |  |

| SPRINT A.2  Semanas 5–7  ·  *RBAC, Vertical Engine, API, Workspace signup* |  |
| :---- | :---- |
| **⬛  BACKEND** | **🖥  FRONTEND** |
| ▸  packages/core/rbac: Permission enum con assets.split, assets.merge, assets.transform, holds.impose, holds.lift. ▸  packages/core/vertical-engine: VerticalPack interface con transformRules/splitRules/mergeRules, VerticalRegistry, DynamicFormRenderer (7 widgets). ▸  apps/api: Fastify 5 \+ tRPC v11. Routers: auth (Workspace signup en 8 pasos), workspaces, workspace-members, teams, employees, facilities, zones, pens. ▸  El selector de vertical en el wizard lee del VerticalRegistry (vacío hasta Sprint C — solo un VerticalPack mock de prueba). | ▸  Wizard de registro — 8 pasos: paso 2 \= selector de vertical dinámico, paso 5 \= mnemonic oscuro, paso 6 \= confirmar 3 palabras. ▸  Management Dashboard: /members, /teams, /facilities (con mapa Leaflet \+ polígonos), /billing, /settings/wallet. ▸  Los labels del dashboard vienen del VerticalPack activo (facilityLabel, zoneLabel, penLabel) — 0 ifs. |
| **🖼  PANTALLAS** →  app.biffco.co/register → wizard completo con mnemonic →  app.biffco.co/facilities → mapa con polígonos |  |
| **⚡  DONE:** E2E: register (mnemonic \+ selector de vertical) → login → dashboard · can() deny-by-default · Facilities con polígono: ST\_IsValid \= true |  |

| SPRINT A.3  Semanas 7–8  ·  *Blockchain anchor, workers, observabilidad* |  |
| :---- | :---- |
| **⬛  BACKEND** | **🖥  FRONTEND** |
| ▸  PolygonProvider: ethers.js v6, Polygon Amoy. AnchorBatchJob: ancla eventos de cualquier vertical, idempotente, circuit breaker. ▸  OpenTelemetry: trazas con tags workspaceId \+ verticalId. Sentry: tags por workspaceId. | ▸  BlockchainAnchorBadge: genérico para cualquier asset. SyncStatusBadge conectado al worker real. |
| **🖼  PANTALLAS** →  app.biffco.co → topbar con SyncStatusBadge real |  |
| **⚡  DONE:** Primer txHash en Polygon Amoy · grep packages/core → 0 imports de packages/verticals (verificado antes de crear el primer vertical) |  |

| ⚡ PHASE GATE A  v0.2 — Core Trust Layer |
| :---- |
| **🏁  Contrato criptográfico con Workspace model. Group/Split/Merge/Transform hooks listos.** |
| ✅  Replay determinístico · RLS workspace isolation verificado · Ed25519 \+ SLIP-0010 con wsIdx |
| ✅  E2E: register (mnemonic) → login → dashboard (CI verde) |
| ✅  Primer anclaje Polygon Amoy · grep packages/core → 0 imports de packages/verticals |

| B | PRODUCT LAYER   ·   Semanas 9–16 *DynamicFormRenderer, dashboards dinámicos, verify.biffco.co. 100% vertical-agnóstico.* |
| :---: | :---- |

| SPRINT B.1  Semanas 9–11  ·  *Design system, Workspace management, dashboards* |  |
| :---- | :---- |
| **⬛  BACKEND** | **🖥  FRONTEND** |
| ▸  Routers: workspace-members (invite, accept), teams, employees, facilities, zones, pens. packages/email con templates parametrizables. | ▸  packages/ui: Table, DatePicker, Chart, todos los componentes restantes. ▸  Management Dashboard completo. Labels de cada sección vienen del VerticalPack. ▸  Facility/Zone/Pen UI: árbol jerárquico \+ mapa de polígonos interactivo. |
| **🖼  PANTALLAS** →  app.biffco.co/facilities → árbol Facility→Zone→Pen con mapa →  app.biffco.co/members → WorkspaceMembers \+ Teams \+ Employees |  |
| **⚡  DONE:** Email de invitación real via Resend |  |

| SPRINT B.2  Semanas 11–13  ·  *Assets, eventos, Group/Split/Merge UI* |  |
| :---- | :---- |
| **⬛  BACKEND** | **🖥  FRONTEND** |
| ▸  assets.router: create, list (filtros \+ penId \+ groupId), getById, getTimeline, getAncestors, getDescendants. ▸  asset-groups.router: create (GROUP\_FORMED), addAssets, removeAssets, dissolve. ▸  split.router: createSplit (atómico — 1 tx: cierra input \+ crea outputs). ▸  merge.router: createMerge (atómico — worst-case compliance verificado). ▸  holds.router: impose (activa LOCKED/QUARANTINE), lift (solo rol autorizado). ▸  events.router: append (verifica firma \+ persiste \+ actualiza status). batch.router: 1 firma → N eventos con correlationId. | ▸  /\[wsId\]/assets: lista con vocabulario del VerticalPack activo. ▸  /\[wsId\]/assets/new: wizard → tipo → DynamicFormRenderer del UISchema. ▸  /\[wsId\]/assets/\[id\]: 4 tabs (Información, Timeline, Mapa, Documentos). DAGVisualizer. ▸  /\[wsId\]/assets/\[id\]/events/new: selector filtrado por rol → DynamicFormRenderer → firma. ▸  /\[wsId\]/groups: AssetGroups activos. ▸  /\[wsId\]/split: seleccionar asset → declarar outputs → firmar. Con worst-case warning. ▸  /\[wsId\]/merge: seleccionar N assets → declarar output → firmar. Con compliance alert peor caso. |
| **🖼  PANTALLAS** →  app.biffco.co/\[wsId\]/split → UI de división de assets →  app.biffco.co/\[wsId\]/merge → UI de combinación con alerta worst-case |  |
| **⚡  DONE:** E2E: asset → event → group → split → merge (worst-case compliance verificado) · DAGVisualizer muestra árbol completo |  |

| SPRINT B.3  Semanas 13–16  ·  *S3 WORM, transfers, verify.biffco.co* |  |
| :---- | :---- |
| **⬛  BACKEND** | **🖥  FRONTEND** |
| ▸  S3 \+ Object Lock WORM \+ ClamAV. Pipeline: SHA-256 browser → S3 → verify. ▸  transfers.router: createOffer (firma cedente), accept (firma receptor), reject. ▸  packages/pdf: AssetPassport.tsx genérico. apps/verify: Edge Runtime, Web Crypto API. | ▸  EvidenceUploader \+ EvidenceThumb. TransferForm genérico. ▸  verify.biffco.co: banner ✅/❌ \+ EventTimeline \+ DAGVisualizer (linaje) \+ firmas \+ descarga PDF. ▸  Offline engine: Workbox service worker \+ sync badge. |
| **🖼  PANTALLAS** →  verify.biffco.co/\[assetId\] → cualquier asset de cualquier vertical |  |
| **⚡  DONE:** E2E: crear asset → split → transfer → verify.biffco.co ✅ con DAGVisualizer · LCP \< 500ms Lighthouse CI |  |

| ⚡ PHASE GATE B  v1.0 — Product Layer |
| :---- |
| **🏁  La plataforma está lista para cualquier vertical. Livestock será la primera instancia.** |
| ✅  DynamicFormRenderer renderiza cualquier UISchema. Split y Merge con worst-case compliance. |
| ✅  DAGVisualizer muestra árbol completo de parentIds. |
| ✅  verify.biffco.co: LCP \< 500ms · Lighthouse score \> 90\. |
| ✅  E2E completo incluyendo split, merge y group (Playwright, CI verde). |

| C | LIVESTOCK — PRIMERA INSTANCIA   ·   Semanas 17–22 *La demostración de que el Core es genuinamente multi-vertical.* |
| :---: | :---- |

|  | El criterio de éxito de la Fase C no es solo que Livestock funcione. Es que haya funcionado SIN modificar packages/core, apps/api ni apps/platform (excepto el selector de vertical de 10 líneas). |
| :---- | :---- |

| Sprint | Objetivo | Hito |
| :---- | :---- | :---- |
| C.1 (Sem 17–19) | packages/verticals/livestock completo: 11 actores, 3 asset types, \~24 eventos con schemas y UISchemas, reglas de negocio completas. Registrar en VerticalRegistry. | El dashboard muestra "Establecimiento/Lote/Corral". Formulario ANIMAL\_REGISTERED funcional. Inspector SENASA y Veterinario con permisos distintos. |
| C.2 (Sem 19–21) | SLAUGHTER\_COMPLETED atómico. Split/Merge de hacienda con reglas livestock. GFW check. DDS EUDR con polígono. Los 11 actores operativos E2E. | E2E: campo → feedlot → faena → DerivedAsset → verify.biffco.co ✅. DDS Art. 4 descargable. |
| C.3 (Sem 21–22) | Pentest externo. DR drill. Hardening. coverage ≥ 80%. | 0 P0/P1 sin remediar. grep packages/core → 0 imports de verticals/livestock. |

| ⚡ PHASE GATE C  v1.5 — Livestock — Primera instancia |
| :---- |
| **🏁  La arquitectura multi-vertical es válida. La primera instancia funciona.** |
| ✅  E2E completo con todos los 11 actores (Playwright, CI verde) |
| ✅  SLAUGHTER\_COMPLETED atómico con rollback test |
| ✅  Pentest: 0 P0/P1 sin remediar |
| ✅  grep packages/core → 0 imports de packages/verticals/livestock |
| ✅  Auditoría: 0 archivos modificados en packages/core, apps/api ni apps/platform (excepto selector) |

| D | GO LIVE — ACTORES REALES   ·   Semanas 23–30 *Datos reales. Evidencia para inversores.* |
| :---: | :---- |

| Sprint | Objetivo | Hito |
| :---- | :---- | :---- |
| D.1 (Sem 23–25) | Producción. CLI npm. Onboarding primer cliente real. | Primer ANIMAL\_REGISTERED real en producción. CLI publicado. |
| D.2 (Sem 25–28) | Operación real: 5+ actores distintos, 30+ eventos firmados sin asistencia. | NPS ≥ 7\. 0 incidentes P0. Grafana Cloud activo. |
| D.3 (Sem 28–30) | DDS EUDR completo. Dashboard de métricas para inversores. | DDS Art. 4 con polígono verificado. El inversor escanea un QR real. |

| ⚡ PHASE GATE D  v2.0 — Go Live |
| :---- |
| **🏁  BIFFCO tiene evidencia operativa real en producción.** |
| ✅  Al menos 5 actores distintos operando |
| ✅  1 DDS EUDR con polígono verificado · NPS ≥ 7 · 0 incidentes P0 |

| E | GROWTH   ·   Semanas 31–46 *Revenue multi-vertical. IA. Polygon Mainnet.* |
| :---: | :---- |

| Sprint | Objetivo | Hito |
| :---- | :---- | :---- |
| E.1 (Sem 31–36) | Stripe multi-vertical. Self-serve. | Nuevo Workspace sin contacto del equipo. Billing para cualquier vertical. |
| E.2 (Sem 37–42) | pgvector \+ anomaly detection multi-vertical. | Anomalías \> 80% accuracy. Misma IA para todas las verticales. |
| E.3 (Sem 43–46) | Polygon Mainnet. Pentest completo. Load test 500 usuarios. | txHash en Polygonscan. p95 \< 500ms bajo carga. |

| F | MINING — SEGUNDA INSTANCIA   ·   Semanas 47–52 *La prueba definitiva: dos verticales, mismo Core, 0 modificaciones.* |
| :---: | :---- |

| Sprint | Objetivo | Hito |
| :---- | :---- | :---- |
| F.1 (Sem 47–49) | packages/verticals/mining: Battery Passport con carbon footprint acumulado. Split/Merge con worst-case carbon footprint. | E2E Mining completo. Battery Passport generado. grep packages/core → 0 imports de verticals/mining. |
| F.2 (Sem 49–52) | IS EUDR Gateway. Compliance Hub. i18n ES+EN. | DDS enviado al IS EUDR con reference number real. 2 verticales en producción. |

| ⚡ PHASE GATE F  v4.0 — Scale — Mining como segunda instancia |
| :---- |
| **🏁  BIFFCO es genuinamente infraestructura horizontal.** |
| ✅  E2E Mining sin modificar packages/core |
| ✅  Battery Passport con carbon footprint acumulado (incluyendo Split/Merge) |
| ✅  grep packages/core → 0 imports de verticals/mining |
| ✅  0 archivos modificados en packages/core, apps/api ni apps/platform (excepto selector) |
| ✅  2 verticales en producción. El mismo Core sirve a ambos. |

**PARTE V — PRODUCCIÓN, INVARIANTES Y SCHEMA**

*La narrativa para inversores · Las reglas que nunca cambian · El schema*

# **27\. La narrativa para el inversor — al mes 8**

20 minutos. Sin slides. El inversor interactúa con el producto real. Dos actos.

| Acto / Paso | Lo que ocurre |
| :---- | :---- |
| ACTO 1 — Livestock con datos reales |  |
| 01 | El inversor tiene una caja de carne argentina con QR. Escanea. verify.biffco.co en \< 2 segundos. |
| 02 | Banner ✅ EUDR Compliant. 6 actores. Cadena firmada desde la parcela de Santa Fe. |
| 03 | "No es una demo. Es la cadena real de ese animal, verificada matemáticamente por 11 actores." |
| 04 | Toca SLAUGHTER\_COMPLETED → ve los DerivedAssets del animal. Toca un DerivedAsset → DAGVisualizer muestra el árbol hasta la parcela. |
| 05 | Dashboard: N activos, M eventos firmados, K actores, 1 DDS EUDR generado. |
| ACTO 2 — Mining: la misma infraestructura |  |
| 06 | "El mismo Core para minerales críticos." → Workspace de Mining en staging. OreExtract registrado. |
| 07 | MERGE de dos concentrados → worst-case carbon footprint calculado automáticamente. Battery Passport generado. |
| 08 | "El Battery Passport EU es obligatorio en 2027\. Tenemos la infraestructura. Solo un VerticalPack de 2–3 semanas." |
| 09 | "Lo que viene: billing multi-vertical, segunda vertical en producción. La plataforma ya existe." |

|  | El moat no es el conocimiento de una industria. Es la infraestructura criptográfica que sirve a todas. El segundo acto demuestra que el primer acto no fue suerte — fue arquitectura. |
| :---- | :---- |

# **28\. Invariantes técnicas inmutables**

| Invariante | Consecuencia de violar | Cómo se verifica |
| :---- | :---- | :---- |
| domain\_events: append-only. Sin UPDATE ni DELETE. | Un DELETE invalida la verificabilidad histórica de todas las verticales. | Trigger PostgreSQL \+ test automatizado. |
| Clave privada nunca al servidor. Signing en el browser. | Si el servidor firma, puede falsificar cualquier evento de cualquier vertical. | Code review. Ninguna ruta en apps/api recibe claves privadas. |
| SLIP-0010 con wsIdx en el path. No BIP-44. | BIP-44 es para secp256k1. Produce claves inseguras para Ed25519. Cambiar post-producción invalida todas las firmas. | Test con vectores conocidos. Linter que detecta bip44. |
| Mnemonic BIP-39: una vez, BIFFCO no lo almacena. | Si BIFFCO lo almacena, puede reconstituir la clave privada. | grep: mnemonic no aparece en ninguna tabla de DB. |
| packages/core nunca importa packages/verticals/\*. | Si el Core conoce un vertical, BIFFCO es un sistema de esa industria. El moat desaparece. | ESLint no-restricted-imports. CI bloquea si el import existe. |
| RBAC deny-by-default. | Un error de "por defecto permitido" es un data leak cross-workspace irrecuperable. | Test: actor sin roles → can() retorna false. |
| Operaciones atómicas o rollback total (Transform, Split, Merge). | El estado intermedio — input cerrado sin outputs — rompe el linaje para siempre. | Test: forzar fallo en output N → verificar rollback total. |
| Worst-case inheritance en Split, Merge y Transform. | Si se pudiera "limpiar" un asset contaminado combinándolo con activos limpios, la compliance EUDR/OECD pierde su valor. | Test: merge de asset con alerta GFW \+ asset limpio → output hereda la alerta GFW. |

# **29\. Schema de base de datos extendido**

| Tabla | Propósito | Columna vertical-específica |
| :---- | :---- | :---- |
| workspaces | Tenant principal. Tiene verticalId (VerticalPack activo). | settings JSONB |
| workspace\_members | Relación Person ↔ Workspace. roles\[\] del VerticalPack. publicKey derivada con wsIdx. | roles\[\] — definidos por el VerticalPack |
| teams | Subgrupos dentro de un Workspace. Opcional. | Ninguna |
| employees | Personas de campo sin cuenta. supervisorId FK. | role string — nombre del vertical |
| facilities | Nivel 2 de ubicación. Polígono GEOMETRY. facilityLabel del VerticalPack. | type enum — facilityTypes\[\] del VerticalPack |
| zones | Nivel 3\. Polígono EUDR. zoneLabel del VerticalPack. | type enum — zoneTypes\[\] del VerticalPack |
| pens | Nivel 4\. currentOccupancy counter. | type enum — penTypes\[\] del VerticalPack |
| assets | Activo trazable. parentIds\[\] (GIN index), currentGroupId FK, currentPenId FK, status enum extendido. | payload JSONB — validado contra assetType del VerticalPack |
| asset\_groups | Grupos dinámicos. type (GROUP/SPLIT\_OUTPUT/MERGE\_OUTPUT/TRANSFORM\_OUTPUT). | metadata JSONB |
| domain\_events | Event Store append-only. correlationId, employeeId FK, worstCaseFlags JSONB. | payload JSONB — validado contra eventCatalog del VerticalPack |
| holds | Holds activos: assetId, type (SANITARY/REGULATORY/LEGAL), imposedBy, resolvedBy. | Ninguna — es universal |
| asset\_certifications | Certificados externos: certificationBody, documentHash SHA-256, certifiedAttributes JSONB. | certifiedAttributes JSONB — campos del organismo certificador |
| transfer\_offers | Transferencias con doble firma. | Ninguna |
| anchors\_log | Anclajes en Polygon. Multi-vertical. | Ninguna |
| vehicles | Recursos físicos de transporte. | type string |
| analytics\_snapshots | Proyecciones materializadas. snapshot\_data JSONB del VerticalPack. | snapshot\_data JSONB |

# **30\. Agregar una nueva vertical — checklist**

| Paso | Acción | ¿Toca el Core? | Tiempo |
| :---- | :---- | :---- | :---- |
| 1 | Workshop de Ubiquitous Language con experto del dominio. Definir vocabulario de Facility, Zone, Pen, Asset, Group. | No | 1 día |
| 2 | Definir actorTypes y permisos usando el Permission enum del Core. | Solo si falta un Permission (raro) | 1–2 días |
| 3 | Definir assetTypes con schemas Zod, estados válidos, y qué Split/Merge/Transform son posibles. | No | 2–3 días |
| 4 | Definir eventCatalog: tipos, schemas Zod, UISchemas para DynamicFormRenderer, allowedRoles, worst-case fields. | No | 3–5 días |
| 5 | Implementar transformRules, splitRules y mergeRules con sus validaciones y worst-case inheritance. | No | 2–3 días |
| 6 | Implementar ProjectionFns para las métricas de analytics de esta industria. | No | 2–3 días |
| 7 | Implementar el VerticalPack completo en packages/verticals/\[nombre\]. | No | 2 días |
| 8 | Agregar al selector de vertical en el wizard (10 líneas en apps/platform). | No — solo UI | 2 horas |
| 9 | Escribir el E2E Playwright con Group, Split, Merge y Transform del ciclo completo. | No | 2–3 días |
| 10 | grep packages/core → 0 imports de packages/verticals/\[nombre\]. Auditoría de archivos modificados. | N/A — validación | 5 min |

|  | *Total estimado: 2–3 semanas para una vertical con Ubiquitous Language definido. Si requiere modificar el Core, es un bug de arquitectura, no un requisito del vertical.* |
| :---- | :---- |

