

**BIFFCO™**

*Trust Infrastructure for Global Value Chains*

**FASE C — LIVESTOCK VERTICAL**

Playbook completo para el equipo de desarrollo

*Semanas 17–22  ·  Duración: 30 días hábiles  ·  3 sprints: C.1 / C.2 / C.3*

| Objetivo de la Fase C *Al finalizar estas seis semanas, el VerticalPack de Livestock está completo y operativo: 11 actores, 3 tipos de asset, \~24 eventos con UISchemas, faena atómica (SLAUGHTER\_COMPLETED), split y merge de hacienda, GFW check sobre polígonos de Zone, y DDS EUDR Art. 4 descargable. La prueba definitiva: grep packages/core → 0 imports de packages/verticals/livestock. El Core no fue modificado.* |
| :---: |

Mayo–Junio 2026  ·  Córdoba, Argentina  ·  CONFIDENCIAL — USO INTERNO

# **Índice**

| Sección | Título |
| :---- | :---- |
| 01 | ¿Qué es la Fase C y qué construimos? |
| 02 | Prerequisitos — la Fase B debe estar cerrada |
| 03 | Equipo, roles y responsabilidades |
| 04 | Cronograma día a día — 30 días hábiles |
| SPRINT C.1 | Semanas 17–19 — VerticalPack Livestock: actores, assets, eventCatalog |
| 05 | TASK-048 — Ubiquitous Language de Ganadería BIFFCO |
| 06 | TASK-049 — packages/verticals/livestock: actorTypes \+ permisos |
| 07 | TASK-050 — packages/verticals/livestock: assetTypes (AnimalAsset, LotAsset, DerivedAsset) |
| 08 | TASK-051 — packages/verticals/livestock: eventCatalog completo (\~24 eventos) |
| 09 | TASK-052 — Registrar livestock en VerticalRegistry \+ tests de integración |
| 10 | TASK-053 — apps/platform: Operations Dashboard adaptado a Livestock |
| 11 | Phase Gate C.1 — criterios de cierre del primer sprint |
| SPRINT C.2 | Semanas 19–21 — Faena, GFW, DDS EUDR, E2E completo |
| 12 | TASK-054 — transformRules: SLAUGHTER\_COMPLETED atómico (1 AnimalAsset → N DerivedAssets) |
| 13 | TASK-055 — splitRules y mergeRules de hacienda con worst-case compliance |
| 14 | TASK-056 — GFW check real (Global Forest Watch API) sobre polígonos de Zone |
| 15 | TASK-057 — DDS EUDR Art. 4 — Documento de Debida Diligencia |
| 16 | TASK-058 — E2E Livestock completo: campo → feedlot → faena → DerivedAsset → verify |
| 17 | Phase Gate C.2 — criterios de cierre del segundo sprint |
| 18 | SPRINT C.3 — Semanas 21–22 — Pentest \+ hardening \+ coverage |
| 19 | TASK-059 — Pentest externo \+ remediation |
| 20 | TASK-060 — Coverage ≥ 80% en packages/core \+ packages/verticals/livestock |
| 21 | TASK-061 — DR drill \+ runbook de incidentes |
| 22 | Phase Gate C — criterios de cierre completos de la Fase C |
| 23 | El invariante final — la prueba de que la arquitectura funciona |
| 24 | Troubleshooting — problemas comunes de la Fase C |
| 25 | Deferred Items — lo que explícitamente no se hace en esta fase |

# **01\. ¿Qué es la Fase C y qué construimos?**

La Fase C es la prueba de fuego de la arquitectura. Hasta aquí, BIFFCO es una plataforma genérica sin dominio específico. En la Fase C se implementa el primer VerticalPack real: Ganadería Bovina. Y el criterio de éxito no es que Livestock funcione — es que funcione SIN modificar packages/core.

|  | El criterio de oro de la Fase C: después de 6 semanas de implementar el VerticalPack más complejo (11 actores, 24 eventos, faena atómica, GFW, DDS EUDR), el comando grep \-r "@biffco/livestock\\|from.\*verticals" packages/core/ retorna 0 resultados. Si retorna alguno, la arquitectura falló — independientemente de si Livestock funciona. |
| :---- | :---- |

## **La diferencia entre la Fase C y las anteriores**

| Aspecto | Fases 0–B | Fase C |
| :---- | :---- | :---- |
| El Core | En construcción — generic, sin dominio | Immutable — no se toca. Solo se lee para implementar el VerticalPack. |
| El Product Layer | En construcción — plataforma vacía | Existe y está funcionando. Solo se conecta al nuevo VerticalPack. |
| El trabajo nuevo | Infraestructura, API, UI base | Dominio de ganadería: actores, eventos, reglas de negocio. |
| La prueba de éxito | CI verde, endpoints funcionan | grep packages/core → 0 imports de verticals. E2E ganadero de punta a punta. |
| Lo que NO cambia | — | Absolutamente nada en packages/core, apps/api (excepto registrar el pack), apps/platform (excepto agregar al selector). |

## **Qué existe al cerrar la Fase C**

| Entregable | Descripción | Cómo se verifica |
| :---- | :---- | :---- |
| packages/verticals/livestock | VerticalPack completo: 11 actorTypes con permisos, 3 assetTypes con schemas Zod, \~24 eventos con UISchemas, transformRules (faena), splitRules y mergeRules. | pnpm \--filter @biffco/livestock test → 0 failures. |
| SLAUGHTER\_COMPLETED atómico | 1 AnimalAsset → CLOSED. N DerivedAssets creados. Rollback total si falla cualquier output. Worst-case compliance heredado. | Test: SLAUGHTER\_COMPLETED con animal que tiene hold → falla con mensaje claro. |
| Split y merge de hacienda | SPLIT de LotAsset en 2 sublotes. MERGE de 2 tropas en 1\. Worst-case: animal con alerta GFW en una tropa → tropa merged hereda la alerta. | Test: merge de tropa limpia \+ tropa con alerta GFW → output hereda alerta. |
| GFW check real | Cruce de polígonos de Zone contra Global Forest Watch API. gfwStatus: clear / alert. Job asíncrono con resultado visible en GeoComplianceBadge. | Zone con polígono de una área deforestada → gfwStatus \= alert. |
| DDS EUDR Art. 4 | PDF del Documento de Debida Diligencia con: nombre del operador, descripción del producto, país de origen, polígonos de producción, declaración de conformidad. | DDS generado para un animal con cadena completa. PDF descargable desde /compliance. |
| E2E Livestock completo | Playwright: productor registra animal → feedlot lo recibe → veterinario vacuna → inspector SENASA emite DTE → frigorífico faena → DerivedAsset con QR verificable. | Playwright: biffco.co E2E ganadero → CI verde. |
| Invariante arquitectónico verificado | grep packages/core → 0 results. Auditoría: 0 archivos modificados en packages/core, apps/api (excepto registry), apps/platform (excepto selector). | Script de audit corriendo en CI. |

# **02\. Prerequisitos — la Fase B debe estar cerrada**

| Lo que debe existir | Cómo verificarlo |
| :---- | :---- |
| DynamicFormRenderer operativo con 9 widgets | pnpm \--filter @biffco/ui storybook → DynamicFormRenderer/AllWidgets story carga. |
| Operations Dashboard conectado al mock VerticalPack | Demo: crear asset del mock VerticalPack → firmar evento → ver EventTimeline con SignatureBadge ✓. |
| events.append verificando firma Ed25519 | POST events.append con firma inválida → 400\. Con firma válida → 201\. |
| SLAUGHTER\_COMPLETED NO existe en el API (lo crea la Fase C) | Verificar que el router de assets NO tiene ninguna lógica de faena hardcodeada. |
| mock VerticalPack removido del VerticalRegistry | El VerticalRegistry está vacío (o solo tiene el mock) al inicio de la Fase C. Se registra livestock en TASK-052. |
| AWS S3 Object Lock funcionando | Un archivo subido tiene Object Lock. Intento de DELETE → AccessDenied. |
| verify.biffco.co LCP \< 500ms | Lighthouse CI verde en staging. |
| packages/core 100% libre de imports de verticals | grep \-r "from.\*verticals\\|@biffco/livestock" packages/core/ → 0 resultados. |

## **Nuevas dependencias para la Fase C**

| `bash` | `# GFW check` `$ pnpm --filter @biffco/api add node-fetch  # Para llamar a la GFW API` `# PDF — DDS EUDR (ya tenemos @react-pdf/renderer de la Fase B)` `# No hay nuevas dependencias de PDF` `# El VerticalPack de Livestock en sí NO tiene dependencias externas.` `# Solo usa:` `#   - zod (ya instalado)` `#   - @biffco/core (ya instalado)` `#   - @biffco/shared (ya instalado)` `# Para los tests E2E de Livestock:` `$ pnpm add -D -w @playwright/test  # Si no está ya instalado` `# Seed de datos de desarrollo (para tener animales reales en dev)` `$ pnpm --filter @biffco/db add tsx  # Para ejecutar scripts TypeScript directamente` |
| :---: | :---- |

|  | ⚠ ATENCIÓN  packages/verticals/livestock NO puede instalar dependencias que no sean de @biffco/\* o zod. Si necesitás alguna librería externa específica de Livestock, primero justificarlo en una discusión de equipo. El objetivo es que el VerticalPack sea código de dominio puro, sin infraestructura. |
| :---- | :---- |

# **03\. Equipo, roles y responsabilidades**

La Fase C tiene un balance de trabajo distinto al de las fases anteriores. El Tech Lead lidera la implementación del VerticalPack y las reglas de negocio de ganadería. El Frontend Dev adapta el Operations Dashboard y los UISchemas. Pero ambos necesitan entender el dominio de ganadería — es imposible implementar bien un dominio que no se entiende.

|  | Antes del Día 1 de la Fase C, el equipo completo debe leer el glosario de ganadería bovina argentina (TASK-048 — Ubiquitous Language). No es opcional. Si el developer no sabe la diferencia entre un novillo y una vaquillona, no puede implementar correctamente el AnimalAsset. |
| :---- | :---- |

| Rol | Responsabilidad en Fase C | TASKs asignadas | % del tiempo |
| :---- | :---- | :---- | :---- |
| Tech Lead / Backend Dev | packages/verticals/livestock completo: actorTypes, assetTypes, eventCatalog, transformRules (faena), splitRules, mergeRules. GFW API. DDS EUDR PDF. E2E backend. Pentest remediation. | TASK-048 (lid), TASK-049, TASK-050, TASK-051, TASK-052, TASK-054, TASK-055, TASK-056, TASK-057, TASK-059 (lid), TASK-060, TASK-061 | 70% |
| Frontend Dev | UISchemas de los \~24 eventos de Livestock. Adaptación del Operations Dashboard al vocabulario ganadero. AssetMap con polígonos EUDR reales. GeoComplianceBadge con datos GFW. UI del DDS EUDR. E2E Playwright. | TASK-048 (co), TASK-051 (UISchemas), TASK-053, TASK-058, TASK-059 (co) | 70% |
| Ambos | Ubiquitous Language (D01). E2E Playwright del flujo ganadero completo. Phase Gate reviews. Pentest. | Phase Gates C.1, C.2, C final | 10% de cada uno |

## **El experto de dominio — quién responde las preguntas ganaderas**

Las dudas del dominio no se resuelven con búsquedas en Google — se resuelven con alguien que conoce la operatoria real de un establecimiento ganadero argentino. Si no hay un cliente piloto confirmado, designar a una persona del equipo como "experto de dominio ad-hoc" que estudia el material de SENASA y los reglamentos EUDR antes del Día 1\.

| Tipo de duda | Dónde resolverla |
| :---- | :---- |
| ¿Qué información lleva el DTE? | Resolución SENASA 103/2019 — Documento de Tránsito Electrónico. |
| ¿Qué eventos puede firmar un Veterinario sin SENASA? | Reglamento de sanidad animal SENASA — Circular veterinaria 2021\. |
| ¿Cómo se calcula el peso canal? | Manual de tipificación de carnes bovinas SENASA/IPCVA. |
| ¿Qué polígono va en el DDS EUDR? | Reglamento UE 2023/1115 Art. 9 — el polígono de la parcela de producción. |
| ¿Qué es el sistema RFID de caravanas? | SENASA — Sistema de Identificación de Bovinos (SIGB) y Trazabilidad Individual (SINIT). |

## **Reglas de trabajo para la Fase C**

* REGLA 1: Si se necesita modificar un archivo en packages/core para implementar algo de Livestock, es una señal de que el diseño está mal. Parar, revisar el ADR-001, y buscar la solución correcta dentro del VerticalPack.

* REGLA 2: Todo actor, evento y regla de negocio que se agregue al VerticalPack debe tener su justificación en el Ubiquitous Language del TASK-048. Sin justificación de dominio \= no entra.

* REGLA 3: Los UISchemas de los eventos los define el Frontend Dev junto al Tech Lead. No existe "lo definimos después" — sin UISchema no hay evento en el DynamicFormRenderer.

* REGLA 4: El SLAUGHTER\_COMPLETED es el evento más crítico del sistema. Tiene su propio proceso de revisión de 4 ojos — ningún developer puede mergear la transformRule sin que el otro la haya revisado y testeado independientemente.

* REGLA 5: Ninguna regla de negocio de Livestock va en apps/api ni en apps/platform. Todo va en packages/verticals/livestock. Si encontrás un "if verticalId \=== livestock" fuera del VerticalPack, es un bug.

# **04\. Cronograma día a día — 30 días hábiles**

La Fase C tiene 3 sprints. C.1 construye el vocabulario y las definiciones del VerticalPack. C.2 implementa las operaciones críticas (faena, GFW, DDS EUDR) y el E2E. C.3 es hardening: pentest, coverage y DR drill.

| C.1 | Semanas 17–18 · Días 1–10 Ubiquitous Language · actorTypes · assetTypes · eventCatalog |
| :---: | :---- |

| D01 | Lunes Semana 17 KICKOFF FASE C — Ubiquitous Language de Ganadería (taller de equipo) |
| :---: | :---- |

| Hora | Actividad | Responsable | Entregable |
| :---- | :---- | :---- | :---- |
| 09:00–10:00 | Kickoff: revisar playbook completo. Asignar issues. Confirmar quién es el experto de dominio o cliente piloto de referencia. | Ambos | Issues de Fase C creados y asignados. Experto de dominio identificado. |
| 10:00–13:00 | TASK-048: Workshop de Ubiquitous Language. Construir el glosario completo de términos ganaderos que van a aparecer en el VerticalPack. Cada término: definición, sinónimos, cómo se llama en BIFFCO. | Ambos | docs/vertical-specs/livestock/ubiquitous-language.md commiteado con ≥ 40 términos. |
| 14:30–16:30 | TASK-048 continuación: mapear los 11 actores de la Hoja de Ruta Maestra v3.1 con sus responsabilidades operativas. ¿Qué hace cada actor en un día típico? ¿Qué información registra? | Ambos | Tabla de actores con responsabilidades en el Ubiquitous Language doc. |
| 16:30–18:00 | TASK-048: mapear los \~24 eventos con sus nombres definitivos. Lista de eventos a validar con el experto de dominio antes de implementar. | Tech Lead | Lista de eventos en docs/vertical-specs/livestock/event-catalog-draft.md. |

| D02 | Martes Semana 17 TASK-049 — actorTypes: 11 actores con permisos |
| :---: | :---- |

| Hora | Actividad | Responsable | Entregable |
| :---- | :---- | :---- | :---- |
| 09:00–12:30 | TASK-049: implementar actorTypes\[\] en packages/verticals/livestock/src/actor-types.ts. Los 11 actores de la Hoja de Ruta v3.1 con sus permissions\[\] del Permission enum del Core. | Tech Lead | actorTypes\[\] con los 11 actores compilando. Tests unitarios de permisos. |
| 09:00–12:30 | Revisar la lista de eventos del D01 con el experto de dominio (llamada o email). Ajustar nombres y payload fields antes de implementar. | Frontend Dev | Lista de eventos aprobada por el experto de dominio. |
| 12:30–13:30 | Code review de actorTypes: ¿Los permisos de cada actor tienen sentido? ¿Un BovineProducer realmente puede hacer MERGE? Ajustes. | Ambos | Lista de ajustes documentada en la PR. |
| 14:30–17:30 | TASK-049 continuación: verificar que todos los roles cubren los casos reales de la Hoja de Ruta Maestra (productor como carrier, inspector con múltiples workspaces, etc.). | Tech Lead | Test: actor BovineProducer puede firmar ANIMAL\_REGISTERED. No puede firmar OFFICIAL\_INSPECTION. |
| 17:30–18:00 | PR\#049: actorTypes completo. CI verde. | Tech Lead | CI verde. |

| D03 | Miércoles Semana 17 TASK-050 — assetTypes: AnimalAsset, LotAsset, DerivedAsset |
| :---: | :---- |

| Hora | Actividad | Responsable | Entregable |
| :---- | :---- | :---- | :---- |
| 09:00–12:30 | TASK-050: AnimalAsset schema — todos los campos del animal: eid, breed, sex, birthDate, birthWeight, category, pedigreeId (optional). Schema Zod. geoRequired: true. | Tech Lead | AnimalAsset schema con validación. Test: animal sin eid → error claro. Animal sin categoría válida → error. |
| 09:00–12:30 | Diseñar los UISchemas de los campos del AnimalAsset para el DynamicFormRenderer: eid (text con pattern RFID), breed (select con razas: Angus/Brangus/Hereford/Braford/Aberdeen Angus/etc.), sex (select: macho/hembra/castrado), birthDate (date). | Frontend Dev | UISchema de AnimalAsset en docs/vertical-specs/livestock/ui-schemas.md. |
| 14:30–16:30 | TASK-050: LotAsset schema — groupId de referencia, quantity (integer), categories\[\] (mix de categorías), avgWeight. Schema Zod. | Tech Lead | LotAsset schema. Test: LotAsset con quantity \= 0 → error. |
| 14:30–16:30 | TASK-050: DerivedAsset schema — parentAnimalId, cutType (cuadril/costillar/nalga/paleta/cuero/menudencias/media\_res), netWeight, grossWeight, boxCount, qualityGrade (EUROP). | Frontend Dev | DerivedAsset schema con validación de cutTypes permitidos. |
| 16:30–17:30 | TASK-050: definir las transiciones de estado válidas para cada assetType. AnimalAsset: active→in\_transit→active, active→in\_process→closed, active→locked, etc. | Tech Lead | Tabla de transiciones para los 3 types. CI verde. |
| 17:30–18:00 | PR\#050: assetTypes completo. | Tech Lead | CI verde. |

| D04 | Jueves Semana 17 TASK-051 parte 1 — eventCatalog: eventos de registro y producción |
| :---: | :---- |

| Hora | Actividad | Responsable | Entregable |
| :---- | :---- | :---- | :---- |
| 09:00–12:30 | TASK-051: eventos de registro — ANIMAL\_REGISTERED, ANIMAL\_ONBOARDED (adulto sin historial previo con disclaimer), LOT\_ASSEMBLED (agrupación de animales en un LotAsset). | Tech Lead | 3 eventos con payloadSchema Zod, schemaVersion, y allowedRoles. |
| 09:00–12:30 | TASK-051: UISchemas de los 3 eventos de registro. ANIMAL\_REGISTERED: grid de campos (EID obligatorio, raza, sexo, fecha nacimiento, peso opcional). ANIMAL\_ONBOARDED: mismo \+ checkbox de disclaimer "historial previo no verificable". | Frontend Dev | UISchemas de ANIMAL\_REGISTERED y ANIMAL\_ONBOARDED en Storybook. |
| 14:30–17:00 | TASK-051: eventos de producción diaria — WEIGHT\_RECORDED, FEEDING\_RECORDED, BRANDING\_RECORDED, BIRTH\_RECORDED, REPRODUCTION\_RECORDED, LOCATION\_CHANGED\_LIVESTOCK (wrapper del LOCATION\_CHANGED genérico con campos ganaderos). | Tech Lead | 6 eventos de producción compilando con tests. |
| 14:30–17:00 | TASK-051: UISchemas de los 6 eventos de producción. WEIGHT\_RECORDED: número \+ unidad (kg) \+ foto opcional. FEEDING\_RECORDED: tipo de alimento (select), cantidad (kg), fecha. | Frontend Dev | UISchemas en Storybook. DynamicFormRenderer renderiza cada uno. |
| 17:00–18:00 | Revisión cruzada: Tech Lead revisa UISchemas. Frontend Dev revisa payloadSchemas. ¿Son consistentes? | Ambos | Lista de inconsistencias a corregir el viernes. |

| D05 | Viernes Semana 17 TASK-051 parte 2 — tratamientos, inspecciones, incidencias |
| :---: | :---- |

| Hora | Actividad | Responsable | Entregable |
| :---- | :---- | :---- | :---- |
| 09:00–11:30 | TASK-051: eventos de tratamiento — VACCINE\_ADMINISTERED (privada, sin inspector), TREATMENT\_ADMINISTERED (antibióticos/antiparasitarios — requiere Veterinarian, con prescripción adjunta). | Tech Lead | 2 eventos. TREATMENT\_ADMINISTERED tiene file-upload field para prescripción PDF. |
| 09:00–11:30 | TASK-051: UISchemas de tratamientos. VACCINE\_ADMINISTERED: nombre de vacuna (select con vacunas comunes argentinas), número de lote, dosis, vía (subcutánea/intramuscular/oral). TREATMENT\_ADMINISTERED: medicamento, dosis, prescripción (file-upload). | Frontend Dev | UISchemas en Storybook con validaciones Zod correctas. |
| 11:30–13:00 | TASK-051: eventos de inspección — VETERINARY\_INSPECTION, OFFICIAL\_INSPECTION (solo SenasaInspector), HEALTH\_CERT\_ISSUED (DTE — solo SenasaInspector). | Tech Lead | HEALTH\_CERT\_ISSUED payload incluye: dteNumber, origin (facilityId), destination (workspaceId destino), quantity, expiresAt (72h por defecto). |
| 14:30–16:30 | TASK-051: eventos de incidencia — HEALTH\_INCIDENT\_REPORTED (con severity: low/medium/high/critical), MINOR\_INJURY\_OBSERVED, THEFT\_REPORTED, STRAYING\_REPORTED, DEATH\_RECORDED. | Tech Lead | 5 eventos de incidencia. HEALTH\_INCIDENT con severity ≥ high → hook que activa HOLD automático. |
| 14:30–16:30 | TASK-051: UISchemas de incidencias. HEALTH\_INCIDENT\_REPORTED: descripción (textarea), severity (select), foto (file-upload obligatorio si severity ≥ high). DEATH\_RECORDED: causa (select: enfermedad/accidente/natural/faena de emergencia). | Frontend Dev | UISchemas de incidencias en Storybook. |
| 16:30–17:30 | Retroactivo Semana 17\. Lista de pendientes para Semana 18\. | Ambos | Issues actualizados. |

| D06–D10 | Semana 18 · Días 6–10 Completar eventCatalog · INCIDENT\_RESOLVED · Registrar en Registry · Phase Gate C.1 |
| :---: | :---- |

| Día | Actividad | Responsable | Entregable al final del día |
| :---- | :---- | :---- | :---- |
| D06 — Lunes | TASK-051: eventos de compliance y certificación — EXTERNAL\_CERTIFICATION\_LINKED (Brangus/Angus/Braford), INCIDENT\_RESOLVED (solo el Inspector que impuso el hold puede resolver), HOLD\_IMPOSED\_BY\_STATE (hold regulatorio SENASA), QUARANTINE\_IMPOSED, QUARANTINE\_LIFTED. | Tech Lead | 5 eventos de compliance. INCIDENT\_RESOLVED verifica que el actorId \= imposedBy del hold activo. |
| D06 — Lunes | TASK-051: UISchemas de compliance. EXTERNAL\_CERTIFICATION\_LINKED: certificationBody (select: Brangus/Angus Argentino/Braford/Hereford/Limousin), certificationId (text), documentHash (file-upload del certificado PDF). INCIDENT\_RESOLVED: resolución (textarea), informe adjunto (file-upload). | Frontend Dev | UISchemas de compliance en Storybook. DynamicFormRenderer renderiza todos. |
| D07 — Martes | TASK-051: eventos de transferencia wrapper — TRANSFER\_INITIATED\_LIVESTOCK, TRANSFER\_IN\_TRANSIT\_LIVESTOCK (con campos del manifiesto: dteNumber, vehiclePlate, estimatedArrival). FEEDLOT\_ENTRY, FEEDLOT\_EXIT. | Tech Lead | 4 eventos wrapper de transferencia ganaderos. Compilan con tests. |
| D07 — Martes | TASK-053: Operations Dashboard adaptado a Livestock. El selector de vertical del wizard muestra "Ganadería Bovina" como opción. /\[wsId\]/assets lista AnimalAssets con columnas específicas: EID, raza, sexo, categoría, peso, ubicación. | Frontend Dev | Columnas específicas de Livestock en la tabla de assets. EID en font-mono. |
| D08 — Miércoles | TASK-052: implementar el VerticalPack de Livestock completo: export del objeto livestock que implementa la interface VerticalPack. Registrar en el VerticalRegistry de apps/api en el startup. | Tech Lead | VerticalRegistry.listPacks() retorna \[{id: "livestock", name: "Ganadería Bovina", ...}\]. Wizard de registro muestra "Ganadería Bovina". |
| D08 — Miércoles | TASK-053: /\[wsId\]/assets/new para AnimalAsset — el wizard de creación usa el assetType schema \+ UISchema de Livestock. El formulario tiene los campos correctos. | Frontend Dev | Crear un AnimalAsset real desde la UI con el VerticalPack de Livestock registrado. |
| D09 — Jueves | TASK-052: tests de integración del VerticalPack completo. 20+ tests: cada actor puede firmar los eventos que le corresponden y no puede firmar los que no le corresponden. | Tech Lead | 20+ tests en packages/verticals/livestock/src/\_\_tests\_\_/ → 0 failures. |
| D09 — Jueves | TASK-053: adaptar el EventTimeline para Livestock — los event types tienen labels ganaderos ("Vacuna administrada", "Pesada registrada", "Inspección veterinaria"). Los badges de tipo de evento tienen íconos de Tabler apropiados. | Frontend Dev | EventTimeline con labels ganaderos. Los eventos se leen correctamente. |
| D10 — Viernes | Phase Gate C.1: checklist completo. grep packages/core → 0 imports de livestock. Fix de issues. Kickoff C.2. | Ambos | Phase Gate C.1 en ✅. C.2 listo para arrancar lunes. |

| C.2 | Semanas 19–20 · Días 11–20 Faena atómica · Split/Merge ganadero · GFW · DDS EUDR · E2E |
| :---: | :---- |

| D11–D15 | Semana 19 · Días 11–15 SLAUGHTER\_COMPLETED \+ splitRules \+ mergeRules |
| :---: | :---- |

| Día | Actividad | Responsable | Entregable al final del día |
| :---- | :---- | :---- | :---- |
| D11 — Lunes | TASK-054: TransformRule de SLAUGHTER\_COMPLETED. Definir la estructura en livestock: inputType: AnimalAsset, outputTypes: DerivedAsset\[\], validaciones previas, los checks pre-faena. | Tech Lead | TransformRule de SLAUGHTER\_COMPLETED definida con todas las validaciones pre-faena listadas. |
| D11 — Lunes | TASK-053: /\[wsId\]/assets/\[id\] para AnimalAsset — mostrar categoría, raza, sexo, peso actual (del último WEIGHT\_RECORDED), GeoComplianceBadge real (del gfwStatus de su Zone), estado del DTE (del último HEALTH\_CERT\_ISSUED). | Frontend Dev | Página de detalle de AnimalAsset con todos los datos específicos de Livestock visibles. |
| D12 — Martes | TASK-054: implementar el atomicHandler de SLAUGHTER\_COMPLETED en la capa de apps/api (el handler invoca la transformRule del VerticalPack). La transacción PostgreSQL cierra el AnimalAsset y crea N DerivedAssets. | Tech Lead | SLAUGHTER\_COMPLETED atómico: AnimalAsset → CLOSED. N DerivedAssets con parentAssetId \= AnimalAsset.id. Rollback si falla output N. |
| D12 — Martes | TASK-054 UI: pantalla de "Registrar Faena" en el Operations Dashboard. Solo visible para SlaughterhouseOperator. Muestra semáforo pre-faena: DTE vigente ✓/✗, polígono declarado ✓/✗, GFW status, inspección veterinaria ≤ 72h ✓/✗. | Frontend Dev | Semáforo pre-faena visual. Solo el activo puede "Iniciar faena" si todos los indicadores son ✓. |
| D13 — Miércoles | TASK-054: test de rollback de SLAUGHTER\_COMPLETED. Forzar error en la creación del DerivedAsset N (ej: payload inválido en el último output) → verificar que el AnimalAsset sigue ACTIVE y 0 DerivedAssets en DB. | Tech Lead | Test de rollback documentado y pasando. AnimalAsset no queda en estado inconsistente. |
| D13 — Miércoles | TASK-053: vista de DerivedAssets creados post-faena. Lista de cortes con su parentAssetId → animal. DAGVisualizer que muestra la transformación 1→N. | Frontend Dev | DAGVisualizer de un DerivedAsset muestra el árbol hasta el animal y la parcela. |
| D14 — Jueves | TASK-055: SplitRule de LotAsset → 2 LotAssets. El quantitativeField es quantity: la suma de las quantities de los outputs no puede superar la quantity del input. | Tech Lead | SplitRule. Test: split de lote de 100 animales en 60+50 → error "suma supera el total". |
| D14 — Jueves | TASK-055: MergeRule de AnimalAsset \+ AnimalAsset → LotAsset. Los AnimalAssets de la tropa se agrupan en un LotAsset. worstCaseFields: gfwAlerts, holds. | Tech Lead | MergeRule. Test: merge de 2 animales (1 con alerta GFW, 1 sin) → LotAsset hereda alerta GFW. |
| D15 — Viernes | TASK-055: MergeRule de LotAsset \+ LotAsset → LotAsset. Para juntar dos tropas. worstCaseFields: todos los holds y alertas. Test completo de worst-case con 5 scenarios. | Tech Lead | 5 tests de worst-case. Todos pasando. PR\#055 mergeado. |

| D16–D20 | Semana 20 · Días 16–20 GFW check real · DDS EUDR · E2E Livestock · Phase Gate C.2 |
| :---: | :---- |

| Día | Actividad | Responsable | Entregable al final del día |
| :---- | :---- | :---- | :---- |
| D16 — Lunes | TASK-056: GFW check job. Llamar a la Global Forest Watch API con el GeoJSON del polígono de la Zone. Parsear la respuesta: si hay alerta de deforestación en los últimos 5 años → gfwStatus \= "alert". Si no → gfwStatus \= "clear". | Tech Lead | Zone con polígono de área deforestada → gfwStatus \= alert. Zone con polígono de área limpia → gfwStatus \= clear. |
| D16 — Lunes | TASK-053: GeoComplianceBadge actualizado con datos GFW reales. Colores: verde (clear), rojo (alert), amarillo (pending). Tooltip con fecha del check y fuente. | Frontend Dev | GeoComplianceBadge mostrando datos reales de GFW. El mapa de Facilities tiene zonas coloreadas según GFW. |
| D17 — Martes | TASK-057: DDS EUDR Art. 4 — estructura del documento según el Reglamento UE 2023/1115. Campos obligatorios del artículo 9: operador, descripción, país de origen, geolocalización (polígonos), fecha de producción, declaración de conformidad. | Tech Lead | Estructura del DDS definida en docs/vertical-specs/livestock/dds-eudr-structure.md. |
| D17 — Martes | TASK-053 UI: /\[wsId\]/compliance — panel de estado EUDR del Workspace. % de animales con polígono declarado, % con GFW clear, DTE vigentes vs vencidos. Botón "Generar DDS" para un animal seleccionado. | Frontend Dev | /compliance con métricas reales de EUDR del Workspace de Livestock. |
| D18 — Miércoles | TASK-057: implementar la generación del DDS EUDR con @react-pdf/renderer. PDF con todos los campos requeridos por el Art. 4\. Incluir el polígono de la Zone de origen como imagen de mapa. | Tech Lead | DDS PDF generado para un animal con cadena completa. Descargable desde /compliance. |
| D18 — Miércoles | TASK-058: Escribir el test E2E Playwright del flujo ganadero completo (ver sección TASK-058 para el detalle de los 12 pasos). | Frontend Dev | e2e/c2-livestock-e2e.spec.ts escrito. Los primeros 6 pasos corriendo. |
| D19 — Jueves | TASK-058: completar el E2E. Pasos 7–12: faena → DerivedAsset → transfer → verify.biffco.co con banner EUDR. CI verde. | Ambos | E2E ganadero completo en CI verde. |
| D19 — Jueves | TASK-057 hardening: verificar que el DDS incluye TODOS los campos obligatorios del Art. 9 del Reglamento 2023/1115. Revisar contra el checklist oficial de la Comisión Europea. | Tech Lead | Checklist del Art. 9 verificado. 0 campos obligatorios faltantes. |
| D20 — Viernes | Phase Gate C.2: checklist completo. E2E corriendo. grep packages/core → 0\. Fix de issues. Kickoff C.3. | Ambos | Phase Gate C.2 en ✅. C.3 listo para arrancar lunes. |

| C.3 | Semanas 21–22 · Días 21–30 Pentest · Coverage · DR drill · Phase Gate C final |
| :---: | :---- |

| D21–D30 | Semanas 21–22 · Días 21–30 Hardening completo |
| :---: | :---- |

| Día | Actividad | Responsable | Entregable al final del día |
| :---- | :---- | :---- | :---- |
| D21 — Lunes | TASK-059: Briefing al equipo de pentest externo. Scope: apps/api (todos los endpoints de Livestock), apps/platform (/\[wsId\] completo), apps/verify, el flujo de firma Ed25519 y el upload a S3. | Tech Lead | Brief de pentest enviado. Fecha de inicio acordada. |
| D21 — Lunes | TASK-060: Coverage audit. pnpm coverage en packages/core \+ packages/verticals/livestock. Identificar qué falta para llegar al 80% en cada sub-package. | Ambos | Coverage report. Lista de tests a escribir. |
| D22 — Martes | TASK-060: Escribir tests unitarios faltantes en packages/verticals/livestock. Foco en: los 11 actorTypes (test de can() para cada uno), los 3 assetTypes (test de schema Zod con valores inválidos), worstCaseFields en MergeRules. | Tech Lead | Coverage packages/verticals/livestock ≥ 80%. |
| D22 — Martes | TASK-060: Escribir tests unitarios faltantes en packages/core (si quedaron ramas sin coverage). Especialmente: event-store/replay con 500+ eventos, crypto/merkle con árbol impar. | Tech Lead | Coverage packages/core ≥ 80%. |
| D23 — Miércoles | TASK-059: Pentest en curso. El equipo de pentest tiene acceso al entorno de staging. El equipo BIFFCO está disponible para responder preguntas. | Tech Lead | Canal de comunicación con el equipo de pentest activo. |
| D23 — Miércoles | TASK-053 finalización: completar cualquier elemento de UI ganadero pendiente. Storybook stories para los componentes nuevos de Livestock. | Frontend Dev | Todos los componentes de Livestock con stories. 0 TODO en el código. |
| D24 — Jueves | TASK-059: Primeros hallazgos del pentest. Triaje de vulnerabilidades: P0 (crítico), P1 (alto), P2 (medio), P3 (bajo). Los P0 y P1 se parchean antes del Phase Gate C. | Tech Lead | Hallazgos del pentest documentados. P0/P1 en proceso de remediación. |
| D24 — Jueves | TASK-061: DR drill — disaster recovery. Simular la pérdida de la DB de staging: restaurar desde el backup de Neon (point-in-time recovery). Documentar el tiempo de recuperación. | Tech Lead | DR completado. Tiempo de recuperación: \< 2 horas. Runbook documentado. |
| D25 — Viernes | TASK-059: Remediación de P0 y P1 del pentest. Cada hallazgo tiene su PR de fix con el test de regresión correspondiente. | Tech Lead | 0 vulnerabilidades P0/P1 sin remediar. Tests de regresión para cada fix en CI. |
| D26 — Lunes | Audit final del invariante arquitectónico. Verificar que ningún archivo de packages/core fue modificado en la Fase C. | Tech Lead | git diff main HEAD \-- packages/core/ → 0 archivos modificados. |
| D27 — Martes | Seed de datos de demostración — crear un conjunto de datos realista para la demo de inversores: 3 productores, 2 frigoríficos, 5 animales con historial completo de 12 eventos cada uno. | Tech Lead | scripts/seed-livestock-demo.ts corriendo. Demo data disponible en staging. |
| D28 — Miércoles | Phase Gate C: ejecutar el checklist completo. Documentar cada verificación con comando y output. | Ambos | Checklist con ✅/❌ por criterio. |
| D29 — Jueves | Fix de cualquier ítem ❌ del Phase Gate. Actualizar docs/phase-audits/fase-c.md. | Ambos | Todos los ítems críticos en ✅. |
| D30 — Viernes | Sprint Review \+ Retrospectiva \+ Kickoff Fase D. El primer vertical está listo. | Ambos | Fase C cerrada. Fase D (Go Live) lista para arrancar. |

| TASK 048  Ubiquitous Language de Ganadería BIFFCO   ·  Owner: Ambos  ·  Est: 4h (taller D01)  ·  Deps: — |
| :---- |

El Ubiquitous Language es el vocabulario compartido entre el negocio y el sistema. Si el código usa "animal" en algunos lugares y "bovino" en otros, el equipo pierde tiempo entendiendo qué significa cada cosa. En BIFFCO, el Ubiquitous Language del VerticalPack de Livestock define exactamente cómo se llama cada concepto en el código.

|  | *El Ubiquitous Language es la inversión más barata de la Fase C. 4 horas de taller en el Día 1 evitan semanas de malentendidos en la implementación. Si el código usa el mismo lenguaje que el productor ganadero usa en su campo, la implementación es correcta.* |
| :---- | :---- |

## **Glosario mínimo — términos que deben estar en el documento**

| Término del dominio | Cómo se llama en BIFFCO | Notas |
| :---- | :---- | :---- |
| Animal bovino | AnimalAsset | Un animal individual, trazado desde el nacimiento. |
| Tropa / Lote | LotAsset | Agrupación operativa de AnimalAssets. Puede ser split o merge. |
| Corte / Subproducto | DerivedAsset | Asset creado por SLAUGHTER\_COMPLETED. parentAssetId → el animal. |
| Establecimiento / Campo | Facility | Nivel 2 de ubicación. Tiene RENSPA. |
| Lote / Potrero | Zone | Nivel 3\. Tiene polígono EUDR. |
| Corral | Pen | Nivel 4\. Tiene capacidad y currentOccupancy. |
| Caravana / RFID / EID | externalId del AnimalAsset | Identificador externo del animal. Sistema SINIT de SENASA. |
| RENSPA | licenseNumber del Facility | Registro Nacional Sanitario de Productores Agropecuarios. |
| DTE | HEALTH\_CERT\_ISSUED payload | Documento de Tránsito Electrónico. Emitido por Inspector SENASA. |
| Categoría del animal | category field en AnimalAsset | Ternero/Ternera, Novillo, Novillito, Vaquillona, Vaca, Toro, Torito. |
| Grado de tipificación | qualityGrade en DerivedAsset | Escala EUROP: E/U/R/O/P. Para exportación a la UE. |
| Canal caliente | grossWeight en DerivedAsset | Peso del animal inmediatamente después de la faena. |
| Canal fría | netWeight en DerivedAsset | Peso después de oreo (24h en cámara). Difiere del canal caliente. |
| Acto de certificación | OFFICIAL\_INSPECTION | Firmado exclusivamente por SenasaInspector. |
| Campaña de vacunación | VACCINE\_ADMINISTERED con campaignId | Ej: campaña de aftosa bianual SENASA. |
| Peso de entrada al feedlot | FEEDLOT\_ENTRY payload.entryWeight | Primer peso registrado en el feedlot. |
| Polígono de parcela | Zone.polygon | El GeoJSON que se envía en el DDS EUDR. WGS84. |

## **El vocabulario en el código**

Estos son los nombres exactos que se usan en el código del VerticalPack. No se improvisan otros nombres:

| `ts` | `// packages/verticals/livestock/src/constants.ts` `// Los nombres exactos que usa el VerticalPack` `// Tipos de asset` `export const ANIMAL_ASSET = 'AnimalAsset' as const` `export const LOT_ASSET    = 'LotAsset' as const` `export const DERIVED_ASSET = 'DerivedAsset' as const` `// Categorías de animal` `export const ANIMAL_CATEGORIES = [`   `'ternero', 'ternera', 'novillo', 'novillito',`   `'vaquillona', 'vaca', 'toro', 'torito'` `] as const` `// Razas habituales en Argentina (no limitativo)` `export const BREEDS = [`   `'Aberdeen Angus', 'Angus', 'Brangus', 'Braford',`   `'Hereford', 'Limousin', 'Shorthorn', 'Criolla',`   `'Mestiza', 'Otra'` `] as const` `// Tipos de corte post-faena` `export const CUT_TYPES = [`   `'cuadril', 'costillar', 'nalga', 'cuadrada', 'paleta',`   `'bife_ancho', 'bife_angosto', 'lomo', 'media_res',`   `'cuero', 'menudencias', 'otro'` `] as const` `// Grados de tipificación EUROP` `export const QUALITY_GRADES = ['E', 'U', 'R', 'O', 'P'] as const` `// Labels del VerticalPack (los usa el Core para la UI)` `export const FACILITY_LABEL = 'Establecimiento' as const` `export const ZONE_LABEL     = 'Lote / Parcela' as const` `export const PEN_LABEL      = 'Corral' as const` `export const ASSET_LABEL    = 'Animal' as const` `export const GROUP_LABEL    = 'Tropa' as const` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: el documento docs/vertical-specs/livestock/ubiquitous-language.md tiene ≥ 40 términos. Todo el equipo puede responder: "¿qué es un DTE en el contexto de BIFFCO?" sin buscar en el código. |
| :---- | :---- |

| TASK 049  packages/verticals/livestock: actorTypes \+ permisos de los 11 actores   ·  Owner: Tech Lead  ·  Est: 6h  ·  Deps: TASK-048 |
| :---- |

Los actorTypes definen qué roles existen en el vertical de Livestock y qué puede hacer cada uno. Los permisos son arrays del Permission enum del Core. El VerticalPack NUNCA define permisos nuevos — usa los existentes. Si falta un permiso en el Core, se agrega al enum (único cambio permitido en packages/core en la Fase C).

## **Los 11 actores y sus permisos — tabla completa**

| Actor (id) | Nombre en UI | Permisos clave | Lo que NO puede hacer |
| :---- | :---- | :---- | :---- |
| BovineProducer | Productor Ganadero | ASSETS\_CREATE, ASSETS\_READ, EVENTS\_APPEND (eventos de producción y registro), ASSETS\_SPLIT, ASSETS\_MERGE, TRANSFERS\_INITIATE, FACILITIES\_MANAGE, MEMBERS\_INVITE, ANALYTICS\_VIEW | Firmar OFFICIAL\_INSPECTION, HEALTH\_CERT\_ISSUED, QUARANTINE\_IMPOSED. No puede levantar holds del Estado. |
| Veterinarian | Veterinario de Campo | ASSETS\_READ, EVENTS\_APPEND (VACCINE\_ADMINISTERED, TREATMENT\_ADMINISTERED, VETERINARY\_INSPECTION, HEALTH\_INCIDENT\_REPORTED), HOLDS\_IMPOSE (solo VETERINARY\_HOLD), HOLDS\_LIFT (solo holds que él impuso) | Firmar OFFICIAL\_INSPECTION. No puede levantar holds impuestos por SENASA. |
| SenasaInspector | Inspector SENASA | ASSETS\_READ, EVENTS\_APPEND (OFFICIAL\_INSPECTION, HEALTH\_CERT\_ISSUED, VACCINE\_ADMINISTERED para campañas nacionales, QUARANTINE\_IMPOSED, QUARANTINE\_LIFTED), HOLDS\_IMPOSE, HOLDS\_LIFT (puede levantar cualquier hold sanitario del workspace), ANALYTICS\_VIEW | No puede crear assets ni iniciar transfers. |
| LivestockCarrier | Transportista | ASSETS\_READ (solo los que están en custodia activa), EVENTS\_APPEND (TRANSFER\_IN\_TRANSIT\_LIVESTOCK, CHECKPOINT\_RECORDED) | No puede crear assets, firmar eventos sanitarios ni gestionar facilities. |
| FeedlotOperator | Feedlot / Engordador | ASSETS\_CREATE (para registrar animales propios), ASSETS\_READ, EVENTS\_APPEND (FEEDLOT\_ENTRY, FEEDLOT\_EXIT, WEIGHT\_RECORDED, FEEDING\_RECORDED, LOCATION\_CHANGED\_LIVESTOCK), ASSETS\_SPLIT, ASSETS\_MERGE, TRANSFERS\_INITIATE, TRANSFERS\_ACCEPT | No puede firmar inspecciones ni emitir DTE. |
| SlaughterhouseOperator | Frigorífico | ASSETS\_READ, EVENTS\_APPEND (SLAUGHTER\_COMPLETED — solo con ASSETS\_TRANSFORM), TRANSFERS\_ACCEPT, ASSETS\_TRANSFORM, ANALYTICS\_VIEW | No puede firmar eventos sanitarios. No puede iniciar transfers (solo aceptar). |
| AccreditedLaboratory | Laboratorio Acreditado | ASSETS\_READ, EVENTS\_APPEND (QUALITY\_ANALYSIS\_STARTED, QUALITY\_ANALYSIS\_COMPLETED, QUALITY\_CERT\_ISSUED), CERTIFICATIONS\_LINK | Solo puede operar sobre DerivedAssets que le fueron asignados. |
| Exporter | Exportador / Agente | ASSETS\_READ, EVENTS\_APPEND (EUDR\_DDS\_GENERATED, EXPORT\_DOCUMENTATION\_ISSUED, CONTAINER\_LOADED), TRANSFERS\_INITIATE, ANALYTICS\_VIEW | No puede firmar eventos sanitarios ni de producción. |
| EUImporter | Importador / Distribuidor UE | ASSETS\_READ, EVENTS\_APPEND (CUSTOMS\_CLEARED, EUDR\_DDS\_VERIFIED, IMPORT\_INSPECTION\_PASSED, DISTRIBUTION\_STARTED), TRANSFERS\_ACCEPT, ASSETS\_SPLIT | Opera solo sobre DerivedAssets recibidos de una transfer internacional. |
| RetailerProcessor | Minorista / Procesador en destino | ASSETS\_READ, EVENTS\_APPEND (PROCESSING\_STEP\_COMPLETED, RETAIL\_PACKAGING\_COMPLETED), TRANSFERS\_ACCEPT, ASSETS\_SPLIT | Es el último eslabón activo antes del consumidor. |
| ExternalAuditor | Auditor Externo | ASSETS\_READ, EVENTS\_READ, ANALYTICS\_VIEW, REPORTS\_GENERATE | No puede firmar ningún evento. Solo lectura. No puede ver billing. |

## **Código — actorTypes en el VerticalPack**

| `ts` | `// packages/verticals/livestock/src/actor-types.ts` `import { Permission } from '@biffco/core/rbac'` `import type { ActorTypeDefinition } from '@biffco/core/vertical-engine'` `export const livestockActorTypes: ActorTypeDefinition[] = [`   `{`     `id: 'BovineProducer',`     `name: 'Productor Ganadero',`     `permissions: [`       `Permission.ASSETS_CREATE,`       `Permission.ASSETS_READ,`       `Permission.ASSETS_UPDATE,`       `Permission.ASSETS_SPLIT,`       `Permission.ASSETS_MERGE,`       `Permission.EVENTS_APPEND,`       `Permission.EVENTS_READ,`       `Permission.TRANSFERS_INITIATE,`       `Permission.TRANSFERS_ACCEPT,`       `Permission.TRANSFERS_REJECT,`       `Permission.HOLDS_IMPOSE,       // Solo VETERINARY_HOLD y LEGAL_HOLD`       `Permission.FACILITIES_MANAGE,`       `Permission.ZONES_MANAGE,`       `Permission.PENS_MANAGE,`       `Permission.MEMBERS_INVITE,`       `Permission.EMPLOYEES_MANAGE,`       `Permission.CERTIFICATIONS_LINK,`       `Permission.ANALYTICS_VIEW,`       `Permission.SETTINGS_MANAGE,`       `Permission.BILLING_MANAGE,`     `],`   `},`   `{`     `id: 'SenasaInspector',`     `name: 'Inspector SENASA',`     `permissions: [`       `Permission.ASSETS_READ,`       `Permission.EVENTS_APPEND,`       `Permission.EVENTS_READ,`       `Permission.HOLDS_IMPOSE,`       `Permission.HOLDS_LIFT,       // ÚNICO que puede levantar holds del Estado`       `Permission.ANALYTICS_VIEW,`     `],`   `},`   `// ... resto de actores (ver código completo en el repo)` `]` `// ─── TEST OBLIGATORIO: cada actor puede firmar lo que debe ───────` `// Ubicado en packages/verticals/livestock/src/__tests__/actor-types.test.ts` `describe('SenasaInspector permissions', () => {`   `it('puede firmar OFFICIAL_INSPECTION (EVENTS_APPEND)', () => {`     `const inspector = livestockActorTypes.find(a => a.id === "SenasaInspector")`     `expect(can(inspector!.permissions, Permission.EVENTS_APPEND)).toBe(true)`   `})`   `it('puede levantar holds (HOLDS_LIFT)', () => {`     `const inspector = livestockActorTypes.find(a => a.id === "SenasaInspector")`     `expect(can(inspector!.permissions, Permission.HOLDS_LIFT)).toBe(true)`   `})`   `it('NO puede crear assets', () => {`     `const inspector = livestockActorTypes.find(a => a.id === "SenasaInspector")`     `expect(can(inspector!.permissions, Permission.ASSETS_CREATE)).toBe(false)`   `})` `})` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: 33 tests de permisos — 11 actores × 3 tests cada uno (puede hacer A, puede hacer B, no puede hacer C). Todos pasan. Ningún actor tiene más permisos de los que necesita. |
| :---- | :---- |

| TASK 050  packages/verticals/livestock: assetTypes — AnimalAsset, LotAsset, DerivedAsset   ·  Owner: Tech Lead \+ Frontend Dev  ·  Est: 8h  ·  Deps: TASK-048, TASK-049 |
| :---- |

Los 3 tipos de asset cubren el 100% de lo que se traza en la cadena ganadera. AnimalAsset es el animal individual — el activo más valioso del sistema porque tiene linaje directo hasta la parcela de origen. LotAsset es una agrupación operativa. DerivedAsset son los cortes post-faena.

## **AnimalAsset — el asset más crítico del sistema**

| `ts` | `// packages/verticals/livestock/src/asset-types.ts` `import { z } from 'zod'` `import type { AssetTypeDefinition } from '@biffco/core/vertical-engine'` `import { ANIMAL_CATEGORIES, BREEDS } from './constants'` `const AnimalAssetSchema = z.object({`   `// ─── Identificación ──────────────────────────────────────`   `eid:          z.string().regex(/^[A-Z]{2}-\d{4}-\d{3}-\d{4}$/).optional(),`                 `// Formato EID argentino: AR-2024-001-1234`   `rfidChip:     z.string().max(30).optional(),`   `visualTag:    z.string().max(20).optional(),`   `caravanNumber:z.string().max(20).optional(),`   `// ─── Datos biológicos ─────────────────────────────────────`   `breed:        z.enum(BREEDS),`   `sex:          z.enum(["macho", "hembra", "castrado"]),`   `category:     z.enum(ANIMAL_CATEGORIES),`   `birthDate:    z.string().date().optional(),`   `birthWeight:  z.number().positive().optional(),  // kg`   `// ─── Datos de producción ──────────────────────────────────`   `lastWeight:   z.number().positive().optional(),  // kg — del último WEIGHT_RECORDED`   `lastWeightDate: z.string().datetime().optional(),`   `// ─── Pedigree (opcional — solo para animales con certificado de raza) ─`   `pedigreeId:   z.string().optional(),`   `herdBookId:   z.string().optional(),`   `// ─── Compliance ──────────────────────────────────────────`   `// vacunaAftosa: si el animal tiene vacunación aftosa vigente`   `// Se deriva del Event Store — no se almacena directamente`   `// (ver analytics projection)` `})` `// Validación: si el animal tiene EID, debe tener el formato correcto.` `// Si no tiene EID, debe tener al menos visualTag o caravanNumber.` `const AnimalAssetSchemaRefined = AnimalAssetSchema.refine(`   `(data) => data.eid || data.visualTag || data.caravanNumber,`   `{ message: "El animal debe tener al menos un identificador (EID, caravana visual o número de caravana)" }` `)` `export const AnimalAssetDef: AssetTypeDefinition = {`   `id: 'AnimalAsset',`   `name: 'Animal Bovino',`   `schema: AnimalAssetSchemaRefined,`   `geoRequired: true,  // Requiere polígono EUDR en la Zone`   `validStatusTransitions: {`     `active: ['in_transit', 'in_process', 'locked', 'quarantine', 'closed', 'stolen', 'lost'],`     `in_transit: ['active', 'locked'],`     `in_process: ['closed', 'active'],  // active solo si el proceso falló`     `locked: ['active', 'quarantine'],`     `quarantine: ['active', 'locked', 'closed'],`     `closed: [],  // Terminal — no hay transiciones desde closed`     `stolen: ['active'],  // Si se recupera`     `lost: ['active'],    // Si se encuentra`   `}` `}` |
| :---: | :---- |

## **DerivedAsset — el corte post-faena**

| `ts` | `// packages/verticals/livestock/src/asset-types.ts (continuación)` `import { CUT_TYPES, QUALITY_GRADES } from './constants'` `const DerivedAssetSchema = z.object({`   `// ─── Identificación ──────────────────────────────────────`   `cutType:      z.enum(CUT_TYPES),`   `batchNumber:  z.string().optional(),`   `boxCount:     z.number().int().positive().optional(),`   `// ─── Pesos ───────────────────────────────────────────────`   `grossWeight:  z.number().positive(),  // kg — peso canal caliente`   `netWeight:    z.number().positive().optional(),  // kg — peso canal fría`   `// ─── Calidad ─────────────────────────────────────────────`   `qualityGrade: z.enum(QUALITY_GRADES).optional(),  // EUROP`   `fatCover:     z.number().min(0).max(5).optional(), // Cobertura grasa 0-5`   `// ─── Trazabilidad ─────────────────────────────────────────`   `// parentAnimalId se almacena en parentIds[] del Asset — no en el payload`   `// slaughterDate se obtiene del evento SLAUGHTER_COMPLETED — no en el payload`   `slaughterhouseId: z.string().optional(),  // workspaceId del frigorífico`   `// ─── Para exportación ─────────────────────────────────────`   `eudrCompliant: z.boolean().optional(),   // Calculado al generar el DDS`   `healthCertNumber: z.string().optional(), // Certificado sanitario de exportación` `})` `// Invariante: grossWeight > 0. Si tiene netWeight, debe ser ≤ grossWeight.` `const DerivedAssetSchemaRefined = DerivedAssetSchema.refine(`   `(d) => !d.netWeight || d.netWeight <= d.grossWeight,`   `{ message: "El peso neto no puede superar el peso bruto" }` `)` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: test de AnimalAsset con EID inválido → error con mensaje "El animal debe tener al menos un identificador". Test de DerivedAsset con netWeight \> grossWeight → error "El peso neto no puede superar el peso bruto". |
| :---- | :---- |

| TASK 051  packages/verticals/livestock: eventCatalog completo (\~24 eventos)   ·  Owner: Tech Lead \+ Frontend Dev  ·  Est: 16h  ·  Deps: TASK-049, TASK-050 |
| :---- |

El eventCatalog es el corazón del VerticalPack. Define qué eventos existen, quién puede firmarlos, qué datos llevan, y cómo se renderiza el formulario en la UI. Cada evento tiene un payloadSchema Zod (validación del servidor) y un UISchema (renderizado en DynamicFormRenderer).

## **Los \~24 eventos del VerticalPack de Livestock**

| Evento | Category | allowedRoles | Notas |
| :---- | :---- | :---- | :---- |
| ANIMAL\_REGISTERED | Registro | BovineProducer, Veterinarian, FeedlotOperator, SlaughterhouseOperator | Crea un AnimalAsset. Primer evento del historial. |
| ANIMAL\_ONBOARDED | Registro | BovineProducer, FeedlotOperator | Animal adulto sin historial previo. Incluye disclaimer obligatorio. |
| LOT\_ASSEMBLED | Registro | BovineProducer, FeedlotOperator | Crea un LotAsset agrupando AnimalAssets existentes. |
| WEIGHT\_RECORDED | Producción | BovineProducer, Veterinarian, FeedlotOperator | Actualiza lastWeight en el payload del AnimalAsset. |
| FEEDING\_RECORDED | Producción | BovineProducer, FeedlotOperator | Tipo de alimento, cantidad, fecha. |
| BRANDING\_RECORDED | Producción | BovineProducer | Caravanado o marcado a fuego. Activa el EID en el asset si no lo tenía. |
| BIRTH\_RECORDED | Producción | BovineProducer, Veterinarian | Nacimiento asistido. Crea AnimalAsset hijo. parentAssetId → madre. |
| REPRODUCTION\_RECORDED | Producción | BovineProducer, Veterinarian | Servicio natural o inseminación. parentAssetId del ternero futuro. |
| VACCINE\_ADMINISTERED | Tratamiento | BovineProducer, Veterinarian, SenasaInspector (campañas) | Vacuna privada. Si es campaña SENASA: incluir campaignId. |
| TREATMENT\_ADMINISTERED | Tratamiento | Veterinarian | Antibióticos/antiparasitarios. Requiere prescripción (file-upload). |
| VETERINARY\_INSPECTION | Inspección | Veterinarian | Revisión sanitaria privada periódica. |
| OFFICIAL\_INSPECTION | Inspección | SenasaInspector | Acto de inspección oficial SENASA. |
| HEALTH\_CERT\_ISSUED | Compliance | SenasaInspector | Emite el DTE. Payload: dteNumber, destination, quantity, expiresAt. |
| HEALTH\_INCIDENT\_REPORTED | Incidencia | BovineProducer, Veterinarian, SenasaInspector | Con severity. Si severity ≥ high: activa hold automático. |
| MINOR\_INJURY\_OBSERVED | Incidencia | BovineProducer, Veterinarian | No activa hold. Solo registro. |
| INCIDENT\_RESOLVED | Resolución | Veterinarian (para holds veterinarios), SenasaInspector (para holds del Estado) | Valida que el actorId puede resolver este tipo de hold. |
| THEFT\_REPORTED | Baja | BovineProducer | Asset pasa a STOLEN. Requiere número de denuncia policial. |
| STRAYING\_REPORTED | Baja | BovineProducer | Asset pasa a LOST. |
| DEATH\_RECORDED | Baja | BovineProducer, Veterinarian | Asset pasa a CLOSED. Causa: enfermedad/accidente/natural/emergencia. |
| EXTERNAL\_CERTIFICATION\_LINKED | Certificación | BovineProducer, Veterinarian | Anclar certificado de raza. certificationBody \+ certificationId \+ PDF hash. |
| QUARANTINE\_IMPOSED | Hold del Estado | SenasaInspector | Asset pasa a QUARANTINE. Solo SenasaInspector puede levantarlo. |
| QUARANTINE\_LIFTED | Resolución hold | SenasaInspector | Solo el Inspector que lo impuso puede levantarlo. |
| FEEDLOT\_ENTRY | Feedlot | FeedlotOperator | Ingreso al feedlot. entryWeight, entryDate, penId destino. |
| FEEDLOT\_EXIT | Feedlot | FeedlotOperator | Egreso del feedlot. exitWeight, dteNumber del transporte. |

## **Estructura de un EventDefinition — HEALTH\_CERT\_ISSUED (el más crítico)**

| `ts` | `// packages/verticals/livestock/src/event-catalog/health-cert-issued.ts` `import { z } from 'zod'` `import type { EventDefinition } from '@biffco/core/vertical-engine'` `const HealthCertIssuedPayloadSchema = z.object({`   `dteNumber: z.string().regex(/^\d{12}$/, "El DTE debe tener 12 dígitos"),`   `destination: z.object({`     `workspaceId: z.string(),`     `workspaceName: z.string(),`     `address: z.string().optional(),`   `}),`   `quantity: z.number().int().positive(),`   `categories: z.array(z.string()).min(1),`   `totalWeight: z.number().positive().optional(),`   `vehiclePlate: z.string().optional(),`   `driverName: z.string().optional(),`   `expiresAt: z.string().datetime(),  // Por defecto: +72 horas desde occurredAt`   `notes: z.string().optional(),` `})` `export const HealthCertIssuedDef: EventDefinition = {`   `type: 'HEALTH_CERT_ISSUED',`   `schemaVersion: 1,`   `payloadSchema: HealthCertIssuedPayloadSchema,`   `allowedRoles: ['SenasaInspector'],  // SOLO el Inspector SENASA`   `createsHold: false,`   `// UISchema — lo que ve el Inspector en el DynamicFormRenderer`   `uiSchema: [`     `{ key: 'dteNumber', label: 'Número de DTE (12 dígitos)', type: 'text',`       `required: true, validation: { pattern: "^\\d{12}$" },`       `helpText: 'El número de 12 dígitos que asigna el sistema SENASA.' },`     `{ key: 'destination.workspaceName', label: 'Establecimiento de destino', type: 'text', required: true },`     `{ key: 'quantity', label: 'Cantidad de animales', type: 'number',`       `required: true, validation: { min: 1 } },`     `{ key: 'vehiclePlate', label: 'Patente del vehículo', type: 'text', required: false },`     `{ key: 'driverName', label: 'Nombre del conductor', type: 'text', required: false },`     `{ key: 'expiresAt', label: 'Vencimiento del DTE', type: 'date', required: true,`       `helpText: 'Por defecto 72 horas desde ahora. El traslado debe completarse antes de esta fecha.' },`     `{ key: 'notes', label: 'Observaciones', type: 'textarea', required: false },`   `],` `}` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: DynamicFormRenderer renderiza el UISchema de HEALTH\_CERT\_ISSUED. El campo dteNumber rechaza valores que no son 12 dígitos. El Inspector SENASA ve este evento en el selector. Un BovineProducer NO lo ve (no está en allowedRoles). |
| :---- | :---- |

| TASK 052  Registrar livestock en VerticalRegistry \+ tests de integración   ·  Owner: Tech Lead  ·  Est: 6h  ·  Deps: TASK-049, TASK-050, TASK-051 |
| :---- |

El TASK-052 es el momento en que el VerticalPack de Livestock deja de ser un objeto TypeScript y se convierte en un sistema operativo. Registrar el pack en el VerticalRegistry de apps/api hace que toda la plataforma lo reconozca: el wizard de registro muestra "Ganadería Bovina", el DynamicFormRenderer carga los UISchemas correctos, y el Operations Dashboard muestra el vocabulario ganadero.

## **El objeto livestock — el VerticalPack completo**

| `ts` | `// packages/verticals/livestock/src/index.ts` `// El único export que importa apps/api` `import type { VerticalPack } from '@biffco/core/vertical-engine'` `import { livestockActorTypes } from './actor-types'` `import { AnimalAssetDef, LotAssetDef, DerivedAssetDef } from './asset-types'` `import { livestockEventCatalog } from './event-catalog'` `import { livestockTransformRules } from './transform-rules'` `import { livestockSplitRules } from './split-rules'` `import { livestockMergeRules } from './merge-rules'` `import { livestockProjections } from './projections'` `import {`   `FACILITY_LABEL, ZONE_LABEL, PEN_LABEL, ASSET_LABEL, GROUP_LABEL` `} from './constants'` `export const livestockPack: VerticalPack = {`   `id: 'livestock',`   `name: 'Ganadería Bovina',`   `version: '1.0.0',`   `// Vocabulario`   `facilityLabel: FACILITY_LABEL,`   `zoneLabel:     ZONE_LABEL,`   `penLabel:      PEN_LABEL,`   `assetLabel:    ASSET_LABEL,`   `groupLabel:    GROUP_LABEL,`   `// Tipos de ubicación válidos para Livestock`   `facilityTypes: ['campo', 'feedlot', 'frigorifico', 'deposito_exportacion', 'puerto'],`   `zoneTypes:     ['lote_pastoreo', 'potrero', 'lote_cultivo', 'instalacion'],`   `penTypes:      ['corral_recria', 'corral_engorde', 'manga', 'brete', 'jaula_balanza'],`   `// Dominio`   `actorTypes:     livestockActorTypes,`   `assetTypes:     [AnimalAssetDef, LotAssetDef, DerivedAssetDef],`   `eventCatalog:   livestockEventCatalog,`   `transformRules: livestockTransformRules,`   `splitRules:     livestockSplitRules,`   `mergeRules:     livestockMergeRules,`   `// UI`   `uiSchemas:     {}, // Cada EventDefinition tiene su propio uiSchema`   `// Compliance`   `geoRequirements: true,  // Requiere polígono EUDR`   `complianceFrameworks: ['EUDR-2023/1115', 'SENASA', 'RFID-SINIT'],`   `// Analytics`   `projections: livestockProjections,` `}` `// ─── La única línea que se agrega en apps/api ─────────────────` `// En apps/api/src/index.ts (o en un archivo de bootstrap):` `// import { livestockPack } from '@biffco/livestock'` `// VerticalRegistry.loadPack(livestockPack)` `// ─── La única línea que se agrega en apps/platform ────────────` `// En el selector de vertical del wizard (10 líneas):` `// El VerticalRegistry.listPacks() ya retorna livestock automáticamente.` `// No hay código específico de livestock en apps/platform.` |
| :---: | :---- |

## **Tests de integración del VerticalPack completo**

Antes de considerar el VerticalPack completo, 20+ tests verifican que el pack implementa correctamente la interface:

| Test | Lo que verifica |
| :---- | :---- |
| livestockPack.id \=== "livestock" | La identidad del pack es correcta. |
| actorTypes tiene exactamente 11 items | Los 11 actores de la Hoja de Ruta v3.1 están todos. |
| eventCatalog tiene exactamente 24 events | Los \~24 eventos están completos. |
| ANIMAL\_REGISTERED: allowedRoles incluye BovineProducer | BovineProducer puede registrar animales. |
| OFFICIAL\_INSPECTION: allowedRoles no incluye BovineProducer | BovineProducer NO puede hacer inspecciones oficiales. |
| HEALTH\_CERT\_ISSUED: allowedRoles \= \["SenasaInspector"\] únicamente | Solo el Inspector SENASA puede emitir DTE. |
| SLAUGHTER\_COMPLETED está en transformRules | La faena está definida como transformación. |
| AnimalAsset.geoRequired \= true | Los animales requieren polígono EUDR. |
| DerivedAsset.geoRequired \= false | Los cortes no requieren polígono propio (heredan del animal). |
| splitRules tiene una regla para LotAsset | Los lotes se pueden dividir. |
| mergeRules tiene una regla para AnimalAsset \+ AnimalAsset | Los animales se pueden agrupar en lotes. |
| mergeRules.worstCaseFields incluye "holds" | Los holds se heredan en los merges. |
| proyecciones retornan datos cuando hay eventos | Las métricas de analytics funcionan. |

|  | ✅ VERIFICACIÓN  Verificación CRÍTICA: pnpm \--filter @biffco/livestock test → 0 failures, 0 skipped. pnpm \--filter @biffco/api dev → VerticalRegistry.listPacks() retorna \[{id: "livestock", ...}\]. El wizard de registro muestra "Ganadería Bovina" como opción. |
| :---- | :---- |

| TASK 053  apps/platform — Operations Dashboard adaptado a Livestock   ·  Owner: Frontend Dev  ·  Est: 10h  ·  Deps: TASK-051, TASK-052 |
| :---- |

El Operations Dashboard ya existe (de la Fase B). En la Fase C se adapta al vocabulario y los datos específicos de Livestock. El principio: 0 cambios hardcodeados de livestock en el código del dashboard — todo el vocabulario viene del VerticalPack activo.

## **Adaptaciones del Operations Dashboard para Livestock**

| Componente | Cambio para Livestock | Cómo se implementa sin hardcodear |
| :---- | :---- | :---- |
| Tabla de assets (/assets) | Columnas: EID (font-mono), Raza, Sexo, Categoría, Peso (del último WEIGHT\_RECORDED), Pen actual, GeoComplianceBadge. | Las columnas adicionales se definen en el UISchema del assetType.listColumns (campo nuevo en AssetTypeDefinition). |
| Formulario de nuevo asset | El "Registrar Animal" usa el UISchema del AnimalAsset del VerticalPack. | DynamicFormRenderer con el uiSchema del assetType seleccionado. Sin código específico de Livestock. |
| Página de detalle /assets/\[id\] | Para AnimalAsset: mostrar EID, raza, sexo, categoría, peso actual, GeoComplianceBadge del Zone, DTE vigente vs vencido. | Los campos extra del payload se renderizan desde el assetType.detailFields (campo nuevo en AssetTypeDefinition). |
| Semáforo pre-faena | Para SlaughterhouseOperator: indicadores DTE / polígono / GFW / inspección. Solo visible para este rol. | El semáforo se renderiza condicionalmente basado en el rol del WorkspaceMember activo y en los transformRules del VerticalPack. |
| EventTimeline labels | Los tipos de evento tienen labels ganaderos: "HEALTH\_CERT\_ISSUED" → "DTE Emitido", "VACCINE\_ADMINISTERED" → "Vacuna administrada". | El VerticalPack define eventLabels: Record\<string, string\>. El EventTimeline los usa. |
| Compliance panel (/compliance) | % de animales con polígono, % con GFW clear, DTEs vigentes/vencidos. Botón "Generar DDS". | Las métricas vienen de las ProjectionFns del VerticalPack. |

## **La pantalla de faena — el flow más crítico de la UI de Livestock**

* Acceso: solo para WorkspaceMembers con rol SlaughterhouseOperator. El botón "Registrar Faena" está oculto para otros roles.

* Paso 1: seleccionar el AnimalAsset a faenar. El selector filtra solo AnimalAssets con status ACTIVE en el Workspace activo.

* Paso 2: semáforo pre-faena. 4 indicadores con ✓ verde / ✗ rojo:

* DTE vigente: el último HEALTH\_CERT\_ISSUED no está vencido (expiresAt \> now).

* Polígono EUDR: el animal tiene un currentPenId con Zone que tiene polígono.

* GFW status: gfwStatus \= "clear" en la Zone del animal.

* Inspección veterinaria: si es destino UE, el último VETERINARY\_INSPECTION o OFFICIAL\_INSPECTION fue \< 72 horas.

* El botón "Confirmar faena" solo se habilita si los 4 indicadores son ✓. Si alguno es ✗, el botón está disabled con tooltip que explica qué falta.

* Paso 3: declarar los DerivedAssets. Selector de cutType, grossWeight (obligatorio), netWeight (opcional), qualityGrade (EUROP), boxCount.

* Paso 4: firmar. El DynamicFormRenderer del SLAUGHTER\_COMPLETED tiene los campos del paso 3\. Al confirmar → calls transform.create en el API → SLAUGHTER\_COMPLETED atómico.

* Paso 5: resultado. Lista de DerivedAssets creados con sus IDs. Botón "Ver en timeline" → EventTimeline del AnimalAsset mostrando el SLAUGHTER\_COMPLETED. Botón "Descargar Asset Passport".

|  | ✅ VERIFICACIÓN  Verificación: demo del flow de faena completo. El semáforo muestra ✗ si el DTE venció. El botón de confirmar está disabled. Cuando todos los indicadores son ✓, el botón se habilita y la faena se completa con los DerivedAssets creados. |
| :---- | :---- |

# **11\. Phase Gate C.1 — Criterios de cierre del Sprint C.1**

|  | *Phase Gate C.1 desbloquea el Sprint C.2. Si el VerticalPack no está completo y los tests no pasan, el Sprint C.2 no puede empezar — la faena atómica depende de que las transformRules estén correctamente definidas.* |
| :---- | :---- |

| ID | Criterio | Cómo verificarlo | Responsable | Prioridad |
| :---- | :---- | :---- | :---- | :---- |
| GC1-01 | docs/vertical-specs/livestock/ubiquitous-language.md con ≥ 40 términos | cat docs/vertical-specs/livestock/ubiquitous-language.md | wc \-l → ≥ 80 líneas | Ambos | 🔴 CRÍTICO |
| GC1-02 | livestockPack.actorTypes tiene exactamente 11 actores | Test: livestockPack.actorTypes.length \=== 11 | Tech Lead | 🔴 CRÍTICO |
| GC1-03 | 33 tests de permisos pasan (11 actores × 3 tests) | pnpm \--filter @biffco/livestock test \-- actor-types → PASS | Tech Lead | 🔴 CRÍTICO |
| GC1-04 | AnimalAsset: animal sin identificadores → error claro | Test: AnimalAsset sin eid, sin visualTag, sin caravanNumber → z.ZodError | Tech Lead | 🔴 CRÍTICO |
| GC1-05 | DerivedAsset: netWeight \> grossWeight → error | Test: DerivedAsset con netWeight=100, grossWeight=90 → z.ZodError | Tech Lead | 🔴 CRÍTICO |
| GC1-06 | eventCatalog tiene exactamente 24 eventos | Test: livestockPack.eventCatalog.length \=== 24 | Tech Lead | 🔴 CRÍTICO |
| GC1-07 | HEALTH\_CERT\_ISSUED: allowedRoles \= \["SenasaInspector"\] únicamente | Test: livestockPack.eventCatalog.find(e=\>e.type==="HEALTH\_CERT\_ISSUED").allowedRoles → \["SenasaInspector"\] | Tech Lead | 🔴 CRÍTICO |
| GC1-08 | VerticalRegistry.listPacks() retorna livestock | GET /trpc/verticals.list → \[{id: "livestock", name: "Ganadería Bovina", ...}\] | Tech Lead | 🔴 CRÍTICO |
| GC1-09 | Wizard de registro muestra "Ganadería Bovina" en el selector | Demo: paso 2 del wizard → card con "Ganadería Bovina" visible | Frontend Dev | 🔴 CRÍTICO |
| GC1-10 | DynamicFormRenderer renderiza HEALTH\_CERT\_ISSUED correctamente | Demo: /events/new con HEALTH\_CERT\_ISSUED → formulario con campo "dteNumber" con validación 12 dígitos | Frontend Dev | 🔴 CRÍTICO |
| GC1-11 | grep packages/core → 0 imports de livestock (invariante) | grep \-r "@biffco/livestock\\|from.\*verticals/livestock" packages/core/ → 0 resultados | Tech Lead | 🔴 CRÍTICO |
| GC1-12 | Operations Dashboard muestra "Establecimiento", "Lote/Parcela", "Corral" (vocabulario de Livestock) | Demo: /\[wsId\]/facilities → título "Establecimientos". /\[wsId\]/assets → columna "Animal".  | Frontend Dev | 🟡 RECOMENDADO |

| TASK 054  transformRules: SLAUGHTER\_COMPLETED atómico (1 AnimalAsset → N DerivedAssets)   ·  Owner: Tech Lead  ·  Est: 10h  ·  Deps: TASK-052, Fase B completa |
| :---- |

SLAUGHTER\_COMPLETED es la operación más crítica del sistema. Es atómica, verificada, y tiene 6 validaciones pre-faena obligatorias. Si falla cualquier validación, el proceso no inicia. Si falla cualquier step de la transacción, rollback total.

|  | La faena NO puede ejecutarse si el animal tiene cualquier hold activo. Ni VETERINARY\_HOLD, ni SANITARY\_HOLD, ni REGULATORY\_HOLD, ni LEGAL\_HOLD. Cualquier hold activo \= el sistema rechaza la faena con mensaje específico. Sin excepciones. |
| :---- | :---- |

## **Las 6 validaciones pre-faena (en orden)**

| \# | Validación | Error si falla | Cómo verificar |
| :---- | :---- | :---- | :---- |
| 1 | El AnimalAsset existe y pertenece al Workspace activo | NOT\_FOUND 404 | RLS \+ query por id y workspaceId. |
| 2 | El AnimalAsset está en status ACTIVE | 422 "El animal tiene status \[X\]. Solo se pueden faenar animales activos." | Verificar asset.status \=== "active". |
| 3 | El animal no tiene holds activos (ninguno sin resolvedAt) | 422 "El animal tiene \[N\] hold(s) activo(s): \[tipos\]. Resolvelos antes de la faena." | SELECT COUNT(\*) FROM holds WHERE assetId \= X AND resolvedAt IS NULL → 0\. |
| 4 | El animal tiene un DTE vigente (HEALTH\_CERT\_ISSUED no vencido) | 422 "El DTE del animal vence \[fecha\] o está ausente. Requerí un DTE actualizado al Inspector SENASA." | Query del último HEALTH\_CERT\_ISSUED. expiresAt \> now(). |
| 5 | El animal tiene polígono EUDR (Zone de su Pen actual tiene polygon) | 422 "El animal no tiene polígono de producción declarado. Asigná una zona con polígono al corral actual." | JOIN asset → pen → zone. zone.polygon IS NOT NULL. |
| 6 (solo si destino UE) | El animal tiene una inspección veterinaria reciente (\< 72h) | 422 "La última inspección veterinaria fue hace \[X\] horas. El máximo para exportación a la UE es 72h." | Query del último VETERINARY\_INSPECTION o OFFICIAL\_INSPECTION. occurredAt \> now() \- 72h. |

## **La transacción atómica de SLAUGHTER\_COMPLETED**

| `ts` | `// apps/api/src/routers/transform.ts (el handler del SLAUGHTER_COMPLETED)` `// Las reglas de negocio viven en packages/verticals/livestock.` `// Este archivo solo orquesta la transacción.` `async function executeSlaughterCompleted(`   `input: SlaughterCompletedInput,`   `ctx: TRPCContext` `): Promise<SlaughterResult> {`   `const { db, workspaceId, memberId, verticalRegistry } = ctx`   `// Cargar la transformRule del VerticalPack`   `const workspace = await db.query.workspaces.findFirst({ where: eq(workspaces.id, workspaceId!) })`   `const pack = verticalRegistry.getActivePack(workspace!.verticalId)`   `const slaughterRule = pack.transformRules.find(r => r.inputTypes.includes("AnimalAsset"))`   `if (!slaughterRule) throw new TRPCError({ code: "BAD_REQUEST", message: "El vertical activo no define reglas de faena." })`   `return db.transaction(async (tx) => {`     `// ─── PASO 1: Cargar el animal ────────────────────────────────`     `const animal = await tx.query.assets.findFirst({`       `where: and(eq(assets.id, input.animalId), eq(assets.workspaceId, workspaceId!))`     `})`     `if (!animal) throw new TRPCError({ code: "NOT_FOUND" })`     `// ─── PASO 2: Ejecutar las validaciones del VerticalPack ──────`     `for (const validationKey of slaughterRule.validations) {`       `const validator = slaughterValidators[validationKey]`       ``if (!validator) throw new Error(`Validator "${validationKey}" no implementado`)``       `const result = await validator(animal, input, tx)`       `if (!result.ok) {`         `throw new TRPCError({`           `code: "UNPROCESSABLE_CONTENT",`           `message: result.error,`         `})`       `}`     `}`     `// ─── PASO 3: Validar los DerivedAssets declarados ───────────`     `const derivedAssetDef = pack.assetTypes.find(at => at.id === "DerivedAsset")!`     `const validatedOutputs = await Promise.all(input.outputs.map(async (output) => {`       `const result = derivedAssetDef.schema.safeParse(output.payload)`       `if (!result.success) throw new TRPCError({`         `code: "BAD_REQUEST",`         `` message: `Output inválido para corte "${output.payload.cutType}": ${result.error.message}` ``       `})`       `return result.data`     `}))`     `// ─── PASO 4: TRANSACCIÓN ATÓMICA ────────────────────────────`     `// 4a. Cerrar el AnimalAsset`     `await tx.update(assets)`       `.set({ status: 'closed', closedAt: new Date() })`       `.where(eq(assets.id, input.animalId))`     `// 4b. Crear los DerivedAssets (todos en la misma TX)`     `const createdDerived = await Promise.all(`       `validatedOutputs.map(async (payload, i) => {`         `const [derived] = await tx.insert(assets).values({`           `type: 'DerivedAsset',`           `status: 'active',`           `workspaceId: workspaceId!,`           `verticalId: workspace!.verticalId,`           `ownerId: animal.ownerId,`           `payload: { ...payload, slaughterhouseId: workspaceId },`           `parentIds: [input.animalId],  // Linaje: DerivedAsset → AnimalAsset`         `}).returning()`         `return derived!`       `})`     `)`     `// 4c. Registrar el SLAUGHTER_COMPLETED en el Event Store`     `// (con la firma del SlaughterhouseOperator ya verificada)`     `await eventStore.append({`       `type: "SLAUGHTER_COMPLETED",`       `assetId: input.animalId,`       `workspaceId: workspaceId!,`       `actorId: memberId!,`       `signature: input.signature,`       `publicKey: input.publicKey,`       `occurredAt: new Date(),`       `payload: {`         `outputs: createdDerived.map(d => ({ id: d.id, cutType: d.payload.cutType })),`         `totalGrossWeight: validatedOutputs.reduce((sum, o) => sum + o.grossWeight, 0),`       `}`     `})`     `return { animal: { ...animal, status: "closed" }, derived: createdDerived }`   `})` `}` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación CRÍTICA de rollback: modificar la TX para que falle al crear el DerivedAsset \#3 (de 5). Después de la falla: verificar que el AnimalAsset sigue en status ACTIVE, y que los DerivedAssets 1 y 2 NO existen en la DB. El rollback total debe funcionar. |
| :---- | :---- |

| TASK 055  splitRules y mergeRules de hacienda con worst-case compliance   ·  Owner: Tech Lead  ·  Est: 8h  ·  Deps: TASK-052, TASK-054 |
| :---- |

Las reglas de split y merge de Livestock implementan el principio del worst-case compliance con datos ganaderos reales. El caso más importante: si cualquier animal de una tropa tiene una alerta GFW en su Zone de origen, toda la tropa merged hereda esa alerta.

## **SplitRules de Livestock — los 2 casos de split**

| Caso de split | inputType | outputType | Invariante cuantitativo | Caso de uso |
| :---- | :---- | :---- | :---- | :---- |
| Dividir un LotAsset en 2 sublotes | LotAsset | LotAsset | sum(output.quantity) ≤ input.quantity. Diferencia \= animales perdidos (documentar). | Productor divide tropa de 100 animales: 60 van al feedlot A, 40 al feedlot B. |
| Separar un animal del lote | LotAsset | LotAsset (N-1) \+ AnimalAsset (1) | Equivalente a sacar 1 unidad del lote. | Veterinario separa un animal enfermo del lote para tratamiento individual. |

## **MergeRules de Livestock — los 3 casos de merge**

| Caso de merge | inputType(s) | outputType | worstCaseFields | Caso de uso |
| :---- | :---- | :---- | :---- | :---- |
| Juntar animales individuales en una tropa | AnimalAsset\[\] | LotAsset | holds\[\], gfwAlerts (del polígono de cada animal) | Productor arma una tropa de 50 animales para enviar al feedlot. |
| Juntar dos tropas en una | LotAsset \+ LotAsset | LotAsset | holds\[\], gfwAlerts | Feedlot junta dos tropas de distintos establecimientos para una sola transferencia al frigorífico. |
| Juntar tropa \+ animales individuales | LotAsset \+ AnimalAsset\[\] | LotAsset | holds\[\], gfwAlerts | Productor agrega animales sueltos a una tropa existente. |

## **La regla del peor caso para Livestock — código**

| `ts` | `// packages/verticals/livestock/src/merge-rules.ts` `import type { MergeRule } from '@biffco/core/vertical-engine'` `export const livestockMergeRules: MergeRule[] = [`   `{`     `inputTypes: ['AnimalAsset'],  // N AnimalAssets`     `outputType: 'LotAsset',`     `worstCaseFields: [`       `'holds',        // Si cualquier animal tiene hold → el LotAsset lo hereda`       `'gfwAlerts',   // Si cualquier animal tiene zona con GFW alert → el LotAsset lo hereda`       `'quarantine',  // Si cualquier animal está en cuarentena → el LotAsset hereda cuarentena`     `],`     `// Campos calculados del output`     `computedFields: {`       `quantity: (inputs) => inputs.length,`       `categories: (inputs) => [...new Set(inputs.map(a => a.payload.category))],`       `avgWeight: (inputs) => {`         `const weights = inputs.map(a => a.payload.lastWeight).filter(Boolean)`         `return weights.length > 0 ? weights.reduce((a,b) => a+b, 0) / weights.length : null`       `}`     `}`   `},`   `{`     `inputTypes: ['LotAsset', 'LotAsset'],`     `outputType: 'LotAsset',`     `worstCaseFields: [`       `'holds',`       `'gfwAlerts',`       `'quarantine',`     `],`     `computedFields: {`       `quantity: (inputs) => inputs.reduce((sum, l) => sum + (l.payload.quantity ?? 0), 0),`       `categories: (inputs) => [...new Set(inputs.flatMap(l => l.payload.categories ?? []))]`     `}`   `}` `]` `// ─── TEST CRÍTICO DE WORST-CASE ────────────────────────────────` `// Este test verifica que el worst-case compliance NO puede eludirse.` `describe('MergeRule worstCaseFields', () => {`   `it('hereda alerta GFW si cualquier input la tiene', async () => {`     `// Crear: 1 AnimalAsset con gfwAlert + 49 AnimalAssets sin alerta`     `// Ejecutar merge`     `const lotAsset = await executeMerge([animalWithGfwAlert, ...cleanAnimals])`     `// El LotAsset resultante DEBE tener la alerta GFW`     `expect(lotAsset.payload.gfwAlerts).toContain(animalWithGfwAlert.id)`     `expect(lotAsset.status).toBe("locked")  // locked por la alerta heredada`   `})`   `it('NO hereda holds si ningún input los tiene', async () => {`     `const cleanAnimals = await createCleanAnimals(10)`     `const lotAsset = await executeMerge(cleanAnimals)`     `expect(lotAsset.status).toBe('active')`   `})` `})` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: test de merge de 50 animales donde 1 tiene alerta GFW → el LotAsset resultante hereda la alerta y queda LOCKED. Test de merge de 50 animales limpios → LotAsset ACTIVE sin alertas. |
| :---- | :---- |

| TASK 056  GFW check real — Global Forest Watch API sobre polígonos de Zone   ·  Owner: Tech Lead  ·  Est: 6h  ·  Deps: TASK-052, Fase B S3 funcionando |
| :---- |

El GFW (Global Forest Watch) check es el corazón del cumplimiento EUDR para ganadería. Si el polígono de producción de un animal se superpone con áreas deforestadas en los últimos 5 años, el animal no puede exportarse a la UE. BIFFCO hace este check automáticamente cuando se declara o modifica el polígono de una Zone.

## **El flujo del GFW check**

| Paso | Quién | Qué ocurre |
| :---- | :---- | :---- |
| 1\. Usuario declara polígono en Zone | Frontend → API | POST zones.create o zones.updatePolygon con el GeoJSON. |
| 2\. API encola el check | apps/api → BullMQ | El job se encola en gfw-check-queue. La Zone queda con gfwStatus \= "pending". El usuario ve GeoComplianceBadge amarillo. |
| 3\. Worker ejecuta el check | Worker en Railway → GFW API | El worker llama a la GFW API con el polígono. Tiempo estimado: 2–15 segundos por polígono. |
| 4\. Resultado se guarda | Worker → DB | gfwStatus \= "clear" o "alert". Si alert: gfwAlertDetails guardados (área deforestada en ha, período, fuente de datos). |
| 5\. Frontend actualiza | SSE o polling → Frontend | GeoComplianceBadge actualiza su estado. Si alert: banner rojo en la página de la Zone y en el detalle de los AnimalAssets de esa Zone. |

## **La llamada a la GFW API**

| `ts` | `// apps/api/src/workers/gfw-check.ts` `export async function checkPolygonGFW(`   `polygon: GeoJSON.Polygon,`   `zoneId: string,` `): Promise<GFWCheckResult> {`   `// Global Forest Watch API — endpoint de análisis de pérdida de bosque`   `// Documentación: https://www.globalforestwatch.org/help/developers/`   `const gfwUrl = 'https://data-api.globalforestwatch.org/dataset/gfw_integrated_alerts/latest/query'`   `const response = await fetch(gfwUrl, {`     `method: 'POST',`     `headers: {`       `'Content-Type': 'application/json',`       `'x-api-key': env.GFW_API_KEY ?? '',  // Gratis para uso básico`     `},`     `body: JSON.stringify({`       `geometry: polygon,`       `` sql: ` ``         `SELECT`           `SUM(area__ha) AS deforested_area_ha,`           `COUNT(*) AS alert_count`         `FROM umd_tree_cover_loss`         `WHERE umd_tree_cover_loss__year >= 2019`         `AND umd_tree_cover_density_2000__threshold >= 30`       `` ` ``     `})`   `})`   `const data = await response.json()`   `const deforestedHa = data?.data?.[0]?.deforested_area_ha ?? 0`   `if (deforestedHa > 0) {`     `return {`       `status: 'alert',`       `deforestedHa,`       `alertCount: data?.data?.[0]?.alert_count ?? 0,`       `checkDate: new Date().toISOString(),`       `dataSource: 'GFW UMD Tree Cover Loss',`     `}`   `}`   `return { status: 'clear', deforestedHa: 0, checkDate: new Date().toISOString() }` `}` |
| :---: | :---- |

|  | ⚠ ATENCIÓN  La GFW API tiene rate limiting. En staging: máximo 100 requests por día con la API key gratuita. Para el pentest y las pruebas masivas, usar un polígono de prueba reutilizable. Para producción: solicitar la API key premium o implementar cache de 30 días. |
| :---- | :---- |

|  | ✅ VERIFICACIÓN  Verificación: crear una Zone con el polígono de una área deforestada conocida (ej: parte de la región del Amazonas) → gfwStatus \= "alert" después del check. Crear una Zone con el polígono de la Pampa argentina → gfwStatus \= "clear". |
| :---- | :---- |

| TASK 057  DDS EUDR Art. 4 — Documento de Debida Diligencia   ·  Owner: Tech Lead  ·  Est: 8h  ·  Deps: TASK-056, packages/pdf de Fase B |
| :---- |

El DDS (Documento de Debida Diligencia) es el documento legal que el exportador debe presentar ante las autoridades de la UE para cada envío de carne bovina. El Reglamento UE 2023/1115 define exactamente qué campos debe contener en su Artículo 9\.

## **Campos obligatorios del DDS según Reglamento UE 2023/1115, Art. 9**

| Campo del Art. 9 | Cómo BIFFCO lo obtiene | Fuente de datos |
| :---- | :---- | :---- |
| Nombre y dirección del operador | Del Workspace del exportador | workspaces.name \+ WorkspaceMember.address |
| Descripción del producto (código HS) | Del tipo de asset: DerivedAsset.cutType → código HS 0201/0202 | Mapeo cutType → código HS en el VerticalPack |
| País de producción | Del country del Facility | facilities.country (siempre "AR" para Argentina) |
| Cantidad del envío | Del LotAsset o del grupo de DerivedAssets exportados | sum(derivedAssets.payload.grossWeight) |
| Descripción de la geolocalización de producción | GeoJSON del polygon de cada Zone donde pastaron los animales | zones.polygon de todas las Zones ancestrales del asset |
| Fecha de cosecha/producción | Del occurredAt del SLAUGHTER\_COMPLETED | domainEvents WHERE type \= "SLAUGHTER\_COMPLETED" |
| Declaración de conformidad del operador | Texto legal fijo \+ firma del exportador | Generado automáticamente \+ firma Ed25519 del Exporter |

## **Estructura del PDF del DDS — secciones**

| Sección | Contenido |
| :---- | :---- |
| Encabezado | Logo BIFFCO. "DECLARACIÓN DE DEBIDA DILIGENCIA" en texto grande. Número de referencia DDS (generado por BIFFCO). Fecha de generación. |
| Sección 1 — Operador | Nombre del exportador (Workspace), CUIT/RUT, dirección, país. |
| Sección 2 — Producto | Descripción del producto. Código HS (0201 para fresco, 0202 para congelado). Peso total del envío en kg. |
| Sección 3 — Trazabilidad | Tabla con cada animal/lote: EID, establecimiento de origen (RENSPA), polígono de la parcela (imagen de mapa Leaflet generada server-side). |
| Sección 4 — Conformidad EUDR | Statement legal: "El exportador declara que el presente envío no ha contribuido a la deforestación ni a la degradación forestal." Firma Ed25519 del Exporter (hash firmado). |
| Sección 5 — Verificación | URL de verify.biffco.co/\[assetId\] para cada DerivedAsset del envío. QR code. Instrucciones para verificar la cadena de custodia. |
| Footer | Referencia al Reglamento UE 2023/1115. Número de versión del DDS. Fecha y hora de generación. |

|  | ✅ VERIFICACIÓN  Verificación: generar un DDS para un animal con cadena completa (campo → feedlot → frigorífico → DerivedAsset). El PDF debe tener todos los campos del Art. 9\. Verificar el checklist oficial de la CE campo por campo. |
| :---- | :---- |

| TASK 058  E2E Livestock completo: campo → feedlot → faena → DerivedAsset → verify   ·  Owner: Frontend Dev  ·  Est: 8h  ·  Deps: TASK-054, TASK-055, TASK-056, TASK-057 |
| :---- |

El E2E de Livestock es el test más importante de la Fase C. Simula el flujo real de un animal desde su nacimiento en un establecimiento argentino hasta que llega como carne verificada a un importador europeo. Si este test pasa en CI, la Fase C está lista.

## **Los 12 pasos del E2E ganadero**

| Paso | Actor | Acción en BIFFCO | Verificación |
| :---- | :---- | :---- | :---- |
| 1 | Productor Ganadero (BovineProducer) | Crear Workspace "Estancia Los Alamos SA" con VerticalPack livestock. Crear Facility "Campo Santa Fe" con polígono. Crear Zone "Lote 1 Norte" con polígono EUDR. | Workspace creado. Zone con polígono. GFW check encolado. |
| 2 | Productor Ganadero | Crear Pen "Corral Recría". Registrar AnimalAsset: EID=AR-2024-001-0001, Angus, macho, ternero. Firmar ANIMAL\_REGISTERED. | AnimalAsset en DB. ANIMAL\_REGISTERED en Event Store con firma válida. |
| 3 | Veterinario de Campo | Ser invitado al Workspace del productor. Aceptar invitación. Firmar VACCINE\_ADMINISTERED (vacuna aftosa). Firmar WEIGHT\_RECORDED (280kg). | 2 eventos en el EventTimeline del animal. SignatureBadge ✓ en ambos. |
| 4 | Inspector SENASA | Ser invitado al Workspace. Firmar OFFICIAL\_INSPECTION. Firmar HEALTH\_CERT\_ISSUED con dteNumber válido y expiresAt \= \+72h. | DTE en el EventTimeline. El semáforo del frigorífico muestra DTE ✓. |
| 5 | Productor Ganadero | Crear TransferOffer hacia el Workspace del Feedlot "Feedlot San Juan SA". | TransferOffer creada. Email de notificación al Feedlot. |
| 6 | Feedlot Operator | Aceptar la transfer. Firmar FEEDLOT\_ENTRY con entryWeight=280kg. Firmar WEIGHT\_RECORDED a los 90 días (350kg). Firmar FEEDLOT\_EXIT. | Animal en el Workspace del Feedlot. 3 eventos firmados. El DTE sigue vigente. |
| 7 | Transportista | Firmar TRANSFER\_IN\_TRANSIT\_LIVESTOCK con la patente del camión y DTE. | custodianId \= Carrier. SyncStatusBadge del Carrier muestra el evento offline si corresponde. |
| 8 | Frigorífico (SlaughterhouseOperator) | Aceptar la transfer. Verificar semáforo pre-faena (DTE ✓, polígono ✓, GFW ✓, inspección ✓). Ejecutar SLAUGHTER\_COMPLETED con 3 DerivedAssets: cuadril 45kg, costillar 30kg, cuero 8kg. | AnimalAsset → CLOSED. 3 DerivedAssets creados con parentAssetId → animal. SLAUGHTER\_COMPLETED en Event Store. |
| 9 | Laboratorio Acreditado | Firmar QUALITY\_ANALYSIS\_COMPLETED con resultados bromatológicos. Firmar QUALITY\_CERT\_ISSUED. | Certificado de calidad anclado al DerivedAsset "cuadril". |
| 10 | Exportador | Generar DDS EUDR para el DerivedAsset "cuadril". Firmar EUDR\_DDS\_GENERATED. Crear TransferOffer hacia el Importador UE "Importer Rotterdam NL". | DDS generado. Descargable desde /compliance. TransferOffer creada. |
| 11 | Importador UE (EUImporter) | Aceptar la transfer. Firmar CUSTOMS\_CLEARED con número de declaración aduanera. Firmar EUDR\_DDS\_VERIFIED. | DerivedAsset en el Workspace del Importador UE. 2 eventos firmados. |
| 12 | Cualquier persona con el QR | Abrir verify.biffco.co/\[id-del-cuadril\] sin autenticación. | Banner "✅ EUDR Compliant". EventTimeline con 12+ eventos. DAGVisualizer: cuadril → animal → polígono de Santa Fe. LCP \< 500ms. |

## **El test Playwright**

| `ts` | `// e2e/c2-livestock-e2e.spec.ts` `import { test, expect } from '@playwright/test'` `test.describe('E2E Livestock — campo a verify.biffco.co', () => {`   `test('flujo completo ganadero 12 pasos', async ({ browser }) => {`     `// Crear 5 browsers contextos distintos (5 actores distintos)`     `const [producerCtx, vetCtx, inspectorCtx, feedlotCtx, fridgCtx]`       `= await Promise.all([...Array(5)].map(() => browser.newContext()))`     `// PASO 1-2: Producer registra animal`     `const producerPage = await producerCtx.newPage()`     `await producerPage.goto("https://app-staging.biffco.co")`     `// ... signup como BovineProducer ...`     `// ... crear Facility + Zone con polígono ...`     `// ... registrar AnimalAsset ...`     `const animalId = await producerPage.getAttribute("[data-testid=animal-id]", "value")`     `// PASO 3: Veterinario vacuna`     `const vetPage = await vetCtx.newPage()`     `// ... accept invite ... firmar VACCINE_ADMINISTERED ...`     `// ... (pasos 4-11) ...`     `// PASO 12: verify.biffco.co`     `const verifyPage = await browser.newPage()`     ``await verifyPage.goto(`https://verify-staging.biffco.co/${derivedAssetId}`)``     `await expect(verifyPage.locator("[data-testid=eudr-compliant]")).toBeVisible()`     `await expect(verifyPage.locator("[data-testid=eudr-compliant]")).toHaveText(/EUDR Compliant/)`     `// Verificar LCP`     `const lcp = await verifyPage.evaluate(() =>`       `new Promise(resolve =>`         `new PerformanceObserver(list => resolve(list.getEntries().slice(-1)[0].startTime))`           `.observe({ type: 'largest-contentful-paint', buffered: true })`       `))`     `expect(lcp).toBeLessThan(500)`   `})` `})` |
| :---: | :---- |

|  | ✅ VERIFICACIÓN  Verificación: pnpm playwright:run e2e/c2-livestock-e2e.spec.ts → PASS. El test completo tarda \< 3 minutos en staging. El banner ✅ EUDR Compliant aparece en el Paso 12\. |
| :---- | :---- |

# **17\. Phase Gate C.2 — Criterios de cierre del Sprint C.2**

| ID | Criterio | Cómo verificarlo | Responsable | Prioridad |
| :---- | :---- | :---- | :---- | :---- |
| GC2-01 | SLAUGHTER\_COMPLETED: rollback total si falla output N | Test forzando fallo en output 3 de 5 → AnimalAsset ACTIVE, 0 DerivedAssets | Tech Lead | 🔴 CRÍTICO |
| GC2-02 | SLAUGHTER\_COMPLETED falla si el animal tiene hold activo | Test: animal con VETERINARY\_HOLD → 422 con mensaje del tipo de hold | Tech Lead | 🔴 CRÍTICO |
| GC2-03 | SLAUGHTER\_COMPLETED falla si DTE vencido | Test: animal con DTE vencido → 422 "El DTE del animal vence..." | Tech Lead | 🔴 CRÍTICO |
| GC2-04 | Semáforo pre-faena muestra ✗ rojo correctamente en la UI | Demo: animal sin polígono EUDR → ✗ rojo en "Polígono EUDR". Botón confirmar disabled | Frontend Dev | 🔴 CRÍTICO |
| GC2-05 | Merge de tropa con animal GFW alert → LotAsset hereda alerta | Test: merge(animalConGFW, 49animalesLimpios) → LotAsset.status \= "locked" | Tech Lead | 🔴 CRÍTICO |
| GC2-06 | Split de LotAsset: suma de outputs \> input → error | Test: split de lote 100 en 60+50 → 422 "la suma supera el total" | Tech Lead | 🔴 CRÍTICO |
| GC2-07 | GFW check: polígono de área deforestada → gfwStatus \= "alert" | Crear Zone con polígono real de área deforestada → gfwStatus \= "alert" después del job | Tech Lead | 🔴 CRÍTICO |
| GC2-08 | DDS EUDR tiene TODOS los campos del Art. 9 del Reglamento 2023/1115 | Checklist de campos del Art. 9 verificado campo por campo | Tech Lead | 🔴 CRÍTICO |
| GC2-09 | E2E Livestock 12 pasos completo en CI | pnpm playwright:run e2e/c2-livestock-e2e.spec.ts → PASS | Ambos | 🔴 CRÍTICO |
| GC2-10 | verify.biffco.co muestra ✅ EUDR Compliant para un DerivedAsset con cadena completa | Demo: DerivedAsset del E2E → banner ✅ EUDR Compliant en verify.biffco.co | Frontend Dev | 🔴 CRÍTICO |
| GC2-11 | grep packages/core → 0 imports de livestock (invariante sigue limpio) | grep \-r "@biffco/livestock\\|from.\*verticals/livestock" packages/core/ → 0 | Tech Lead | 🔴 CRÍTICO |
| GC2-12 | Auditoría: 0 archivos modificados en packages/core en la Fase C | git diff main HEAD \-- packages/core/ → 0 archivos | Tech Lead | 🔴 CRÍTICO |

# **18\. Sprint C.3 — Pentest, Coverage y DR drill**

| TASK 059  Pentest externo \+ remediación de hallazgos P0 y P1   ·  Owner: Tech Lead (lid) \+ Ambos  ·  Est: 8h activos \+ tiempo de pentest  ·  Deps: Phase Gate C.2 completo |
| :---- |

El pentest de la Fase C es el primer pentest real con datos de dominio. El scope incluye todo lo nuevo de la Fase C más los componentes críticos de las fases anteriores.

## **Scope del pentest de la Fase C**

| Área | Qué se testea | Riesgo particular |
| :---- | :---- | :---- |
| Firma Ed25519 | ¿Puede alguien forjar una firma válida sin la clave privada? ¿Puede alguien extraer la clave privada del sessionStorage? | Bajo — Ed25519 es matemáticamente sólido. Riesgo: XSS que extrae el sessionStorage. |
| SLAUGHTER\_COMPLETED | ¿Puede un actor no-SlaughterhouseOperator ejecutar la faena? ¿Puede la faena eludir las validaciones pre-faena? | Medio — las validaciones deben ser robustas contra inputs malformados. |
| HOLDS\_LIFT | ¿Puede un BovineProducer levantar un hold impuesto por SENASA? ¿Puede eludirse el check del imposer? | Alto — la integridad de los holds es crítica para el compliance regulatorio. |
| RLS multi-tenant | ¿Puede un usuario del Workspace A ver datos del Workspace B usando el JWT de A? | Alto — un leak cross-tenant destruye la confianza del sistema. |
| S3 upload | ¿Puede subirse un archivo sin pasar por el ClamAV scan? ¿Puede alguien acceder a archivos de otro workspace? | Medio — el bucket es privado y CloudFront requiere signed URLs. |
| verify.biffco.co | ¿Puede alguien manipular la respuesta de /\[assetId\] para mostrar un banner EUDR falso? | Bajo si la firma se verifica en Edge. Alto si hay bypass del cálculo. |

| Clasificación | Criterio | SLA de remediación |
| :---- | :---- | :---- |
| P0 — Crítico | Compromiso de datos, bypass de autenticación, exfiltración de claves privadas, RLS bypass. | Antes del Phase Gate C. El release está bloqueado. |
| P1 — Alto | Bypass de validaciones de negocio (ej: faena sin DTE), elevación de privilegios, IDOR en assets de otros workspaces. | Antes del Phase Gate C. |
| P2 — Medio | Información sensible en logs, rate limiting insuficiente, headers de seguridad faltantes. | Antes de la Fase D (Go Live). |
| P3 — Bajo | Mejoras de security hardening, configuraciones subóptimas. | Backlog — a resolver según prioridad. |

| TASK 060  Coverage ≥ 80% en packages/core \+ packages/verticals/livestock   ·  Owner: Tech Lead  ·  Est: 6h  ·  Deps: C.1 \+ C.2 completos |
| :---- |

| Package | Coverage actual (estimado) | Target | Qué testear si falta coverage |
| :---- | :---- | :---- | :---- |
| packages/core/crypto | ≥ 90% (de Fase A) | ≥ 80% | Verificar que todos los test vectors de edge cases están cubiertos. |
| packages/core/event-store | ≥ 85% (de Fase A) | ≥ 80% | Replay con 500+ eventos. Concurrencia en append. |
| packages/core/rbac | ≥ 95% (de Fase A) | ≥ 80% | Todos los combinations de can() están testeados. |
| packages/core/vertical-engine | ≥ 70% (de Fase A) | ≥ 80% | DynamicFormRenderer con los 9 widgets. VerticalRegistry con packs inválidos. |
| packages/verticals/livestock | ≥ 60% (de C.1/C.2) | ≥ 80% | Tests de cada actor (×11). Tests de cada assetType (×3). Tests de worstCaseFields (×3 scenarios). |

| TASK 061  DR drill \+ runbook de incidentes   ·  Owner: Tech Lead  ·  Est: 4h  ·  Deps: C.2 completo, acceso a Neon |
| :---- |

Un DR drill (Disaster Recovery) simula la pérdida total de la base de datos de staging y verifica que el sistema puede restaurarse dentro del SLA prometido. Neon tiene point-in-time recovery incluido — el drill demuestra que el equipo sabe usarlo bajo presión.

| Paso del drill | Qué se hace | Tiempo objetivo |
| :---- | :---- | :---- |
| 1\. Snapshot pre-drill | Documentar el estado de la DB: número de workspaces, assets, events. | 5 min |
| 2\. Simular la pérdida | Crear una nueva branch de Neon en blanco. Actualizar la DATABASE\_URL de staging al nuevo branch. Verificar que staging no tiene datos. | 10 min |
| 3\. Restaurar desde backup | En Neon: branch del momento inmediatamente anterior a la "pérdida". Actualizar DATABASE\_URL al branch restaurado. | 20 min |
| 4\. Verificar la restauración | Comparar el estado restaurado con el snapshot pre-drill. Verificar que todos los eventos, assets y workspaces están presentes. | 15 min |
| 5\. Documentar el RTO | Registrar el tiempo total del proceso. Verificar que es \< 2 horas. | 5 min |

|  | ✅ VERIFICACIÓN  El DR drill debe completarse en \< 2 horas. El runbook documentado en docs/runbooks/dr-database.md debe ser ejecutable por cualquier miembro del equipo sin ayuda adicional. |
| :---- | :---- |

# **22\. Phase Gate C — Criterios de cierre completos de la Fase C**

|  | El Phase Gate C es la puerta de entrada a la Fase D (Go Live con actores reales). Pasar este gate significa que BIFFCO está listo para poner datos de producción reales. La única diferencia entre staging y prod es el entorno — el código es idéntico. |
| :---- | :---- |

| ID | Criterio | Cómo verificarlo | Responsable | Prioridad |
| :---- | :---- | :---- | :---- | :---- |
| GC-01 | Todos los ítems del Phase Gate C.1 siguen en ✅ | Ejecutar checklist GC1-xx | Ambos | 🔴 CRÍTICO |
| GC-02 | Todos los ítems del Phase Gate C.2 siguen en ✅ | Ejecutar checklist GC2-xx | Ambos | 🔴 CRÍTICO |
| GC-03 | 0 vulnerabilidades P0/P1 sin remediar del pentest | Informe del equipo de pentest con todas las P0/P1 cerradas | Tech Lead | 🔴 CRÍTICO |
| GC-04 | Coverage ≥ 80% en packages/core Y packages/verticals/livestock | pnpm coverage → ambos packages ≥ 80% | Tech Lead | 🔴 CRÍTICO |
| GC-05 | DR drill completado en \< 2 horas. Runbook commiteado | docs/runbooks/dr-database.md existe. Tiempo de recovery documentado. | Tech Lead | 🔴 CRÍTICO |
| GC-06 | E2E Livestock 12 pasos en CI verde | pnpm playwright:run e2e/c2-livestock-e2e.spec.ts → PASS en CI | Ambos | 🔴 CRÍTICO |
| GC-07 | grep packages/core → 0 imports de livestock | grep \-r "@biffco/livestock\\|from.\*verticals/livestock" packages/core/ → 0 | Tech Lead | 🔴 CRÍTICO |
| GC-08 | Auditoría completa: 0 archivos modificados en packages/core en toda la Fase C | git diff \[tag-inicio-faseC\] HEAD \-- packages/core/ → 0 archivos | Tech Lead | 🔴 CRÍTICO |
| GC-09 | Auditoría: solo 1 línea modificada en apps/api (el loadPack del VerticalRegistry) | git diff \[tag-inicio-faseC\] HEAD \-- apps/api/src/ → solo el archivo de bootstrap | Tech Lead | 🔴 CRÍTICO |
| GC-10 | Seed de datos de demo disponible en staging | scripts/seed-livestock-demo.ts corre sin errores. Staging tiene datos reales de prueba. | Tech Lead | 🔴 CRÍTICO |
| GC-11 | DDS EUDR con todos los campos del Art. 9 verificados | Checklist del Art. 9 del Reglamento 2023/1115 completo | Tech Lead | 🔴 CRÍTICO |
| GC-12 | Un usuario nuevo puede completar el flow ganadero de punta a punta sin instrucciones | Demo con alguien que no conoce BIFFCO. Tiempo máximo: 20 minutos. | Ambos | 🔴 CRÍTICO |
| GC-13 | Storybook actualizado con los componentes de Livestock | pnpm storybook → todas las stories de Livestock cargan | Frontend Dev | 🟡 RECOMENDADO |
| GC-14 | docs/phase-audits/fase-c.md commiteado con evidencia de cada GC-xx | git log docs/phase-audits/fase-c.md → commit existe | Ambos | 🟡 RECOMENDADO |
| GC-15 | Métricas de staging: N workspaces, M assets, K eventos firmados (datos del seed) | SELECT count FROM workspaces/assets/domain\_events en staging → números del seed | Tech Lead | 🟡 RECOMENDADO |

# **23\. El invariante final — la prueba de que la arquitectura funciona**

Al cerrar la Fase C, el equipo puede demostrar matemáticamente que BIFFCO es genuinamente multi-vertical. El siguiente comando, ejecutado en el commit de cierre de la Fase C, debe retornar exactamente 0 resultados:

| `bash` | `# El comando que demuestra el moat estratégico de BIFFCO` `$ grep -r "@biffco/livestock\|from.*verticals/livestock\|require.*livestock" packages/core/` `# Expected output: (nada — 0 resultados)` `# Si hay cualquier resultado: el moat no existe.` `# El segundo comando — audita qué archivos de packages/core se modificaron` `# durante toda la Fase C` `$ git diff [tag-inicio-faseC] HEAD --name-only -- packages/core/` `# Expected output: (nada — 0 archivos modificados)` `# Si hay archivos: la Fase C modificó el Core, lo cual está prohibido por ADR-001.` `# El tercer comando — qué líneas se agregaron en apps/api en la Fase C` `$ git diff [tag-inicio-faseC] HEAD -- apps/api/src/index.ts` `# Expected output: +import { livestockPack } from "@biffco/livestock"` `#                  +VerticalRegistry.loadPack(livestockPack)` `# SOLO esas 2 líneas. Nada más.` |
| :---: | :---- |

|  | Estas tres verificaciones son la prueba definitiva. Si los tres comandos retornan los resultados esperados, BIFFCO es genuinamente infraestructura horizontal. La Fase F (Mining) tomará 2–3 semanas adicionales — y los tres comandos seguirán retornando 0 resultados para el Core. |
| :---- | :---- |

# **24\. Troubleshooting — problemas comunes de la Fase C**

| Problema | Síntoma | Causa probable | Solución |
| :---- | :---- | :---- | :---- |
| VerticalPack no aparece en el wizard | GET /trpc/verticals.list retorna \[\] | El VerticalRegistry.loadPack(livestockPack) no se ejecutó en el startup de apps/api, o hay un error silencioso. | Verificar que la línea de loadPack está en apps/api/src/index.ts y que apps/api arrancó sin errores. Revisar los logs de Railway. |
| DynamicFormRenderer no muestra los campos de Livestock | El formulario de "Registrar Animal" está vacío | El uiSchema del AnimalAsset no se está cargando, o el VerticalPack no está registrado correctamente. | Verificar que VerticalRegistry.getActivePack("livestock") retorna el pack completo. Verificar que AnimalAssetDef.uiSchema tiene los campos. |
| SLAUGHTER\_COMPLETED falla con "Validator X no implementado" | Error 500 durante la faena | El array slaughterRule.validations tiene una key que no tiene su implementación en slaughterValidators. | Agregar el validator faltante en apps/api/src/routers/transform.ts o verificar que el nombre del validator en la transformRule coincide con el nombre en slaughterValidators. |
| GFW check nunca actualiza el gfwStatus | gfwStatus sigue en "pending" después de 10 minutos | El worker de BullMQ no está corriendo, o la GFW API retornó un error silencioso. | Verificar que el worker está corriendo en Railway. Ver los logs del job en la interfaz de BullMQ. Verificar que la GFW\_API\_KEY es válida (probar directamente con curl). |
| El invariante ESLint falla al importar livestock en el Core | CI falla en "INVARIANTE ARQUITECTÓNICO" cuando el developer NO quería violar el invariante | El developer importó el VerticalPack en el lugar equivocado. | Verificar dónde se hizo el import. El único lugar válido es apps/api/src/index.ts (o el archivo de bootstrap). packages/core NUNCA puede importar livestock. |
| El DDS EUDR no incluye el polígono de producción | El PDF del DDS no tiene el mapa o tiene un polígono incorrecto | El linaje del DerivedAsset no llega hasta el AnimalAsset con Zone y polígono. | Verificar con assets.getAncestors que el DerivedAsset tiene el AnimalAsset como ancestro. Verificar que el AnimalAsset tiene currentPenId con Zone que tiene polygon. |
| MERGE falla con "No merge rule found" | Error al intentar juntar animales | El VerticalPack no tiene una MergeRule que maneje el par de tipos de input. | Verificar que livestockMergeRules tiene una regla para los inputTypes. Verificar que los tipos de los assets de input coinciden con los inputTypes de la regla. |

# **25\. Deferred Items — lo que explícitamente NO se hace en la Fase C**

| ID | Qué se difiere | Por qué se difiere | Se resuelve en |
| :---- | :---- | :---- | :---- |
| DEF-035 | IS EUDR Gateway — envío del DDS al sistema oficial de la Comisión Europea | El IS EUDR (Information System) de la CE requiere homologación del sistema BIFFCO, que toma 3–6 meses. En la Fase C se genera el DDS en PDF cumpliendo el Art. 9, pero el envío oficial al IS EUDR es un trámite burocrático que se inicia en paralelo y se completa en la Fase F. | Fase F.2 |
| DEF-036 | packages/verticals/mining — segunda instancia del VerticalPack | El VerticalPack de Mining es la Fase F. La arquitectura está probada con Livestock. Mining se implementa después del Go Live. | Fase F.1 |
| DEF-037 | Certifications hub — HerdBook connection (Brangus, Angus Argentino) | Las conexiones directas con los HerdBooks requieren acuerdos comerciales. En la Fase C se puede anclar el certificado manualmente (EXTERNAL\_CERTIFICATION\_LINKED \+ file-upload del PDF). La conexión automática con los registros oficiales es un feature de crecimiento. | Post-Fase E |
| DEF-038 | RFID reader integration — lectura directa de caravanas con dispositivo móvil | La integración con lectores RFID físicos (handhelds, lectores de manga) requiere un SDK de hardware que no está en el scope del MVP. En la Fase C el EID se ingresa manualmente. | Post-Fase E |
| DEF-039 | Multilingual support — interfaz en inglés para importadores europeos | El sistema está en español. Los importadores europeos pueden usar verify.biffco.co (en inglés, a implementar en Fase F) pero el dashboard interno sigue en español. | Fase F.2 |
| DEF-040 | Recall system — recall masivo que marque toda la descendencia de un asset | El recall de un asset (RECALL\_ISSUED) existe en el schema, pero el sistema de propagación masiva automática (marcar todos los DerivedAssets de un animal recalled) es complejo y requiere un sprint dedicado. | Post-Fase E |
| DEF-041 | Analytics avanzados de Livestock — métricas de rodeo, productividad, trends | Las ProjectionFns básicas existen (inventario por categoría, eventos por período). El dashboard de analytics avanzado con gráficos de tendencia, predicciones de salida del feedlot, etc. es un feature de crecimiento. | Fase E.2 (pgvector \+ AI) |
| DEF-042 | Pentest de producción — pentest sobre el entorno prod real | El pentest de la Fase C es sobre staging. Un pentest de producción (con datos reales) se realiza después del Go Live inicial de la Fase D. | Fase D.3 |

|  | ✅ VERIFICACIÓN  Todos los DEF-035 a DEF-042 deben estar documentados en docs/deferred-items.md antes de cerrar la Fase C. |
| :---- | :---- |

