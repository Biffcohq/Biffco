# Elementos Diferidos de Biffco (Deferred Items)

Aquí se traza un registro histórico de todas las características técnicas o funcionales que, por decisión arquitectónica y de priorización de Playbook, han sido aplazadas en el roadmap.

## Fase A - Deferred Items (A resolver en Fases Futuras)

| ID | Qué se difiere | Por qué se difiere | Se resuelve en |
| :---- | :---- | :---- | :---- |
| **DEF-013** | `assets.router` — crear, listar, ver assets | Los assets requieren el `VerticalPack` para validar el tipo y el payload. En Fase A solo hay un mock. | **Fase B.2** |
| **DEF-014** | `events.router` — append de negocios | Requieren el `VerticalPack` para validar el payload y permisos por tipo de evento. | **Fase B.2** |
| **DEF-015** | `transfers.router` — transferencias de Workspaces | Las transferencias requieren flujo de doble firma, que depende fuertemente de los assets funcionales. | **Fase B.3** |
| **DEF-016** | Correos con `packages/email` (Resend) | Los emails se implementan cuando haya suficiente UI e interacción para contextualizarlos (ej: envíos de asset). | **Fase B.1** |
| **DEF-017** | `packages/ui` — Componentes hiper específicos de dominio | En Fase A importan los componentes base. DAG y Linea de Eventos se aplazan hasta tener datos reales de un dominio. | **Fase B.1** |
| **DEF-018** | Motor Offline (Workbox Service Worker) | Vital para el "Carrier" rural, pero depende primeramente del motor dinámico funcional. | **Fase B.3** |
| **DEF-019** | Evidencias Inmutables (S3 + Object Lock) | Se adjuntan al append de un Evento (hash), aplazado hasta la etapa B. | **Fase B.3** |
| **DEF-020** | `packages/verticals/livestock` definitivo | El paquete ganadero se desarrollará con retroalimentación empírica del cliente piloto y su lenguaje ubicuo estricto. | **Fase C.1** |
| **DEF-021** | Polygon Mainnet | Lanzamiento a Mainnet requiere un pentest de seguridad de backend y auditorías robustas, exclusivas de finales de año. | **Fase E.3** |
| **DEF-022** | Pasarela de Facturación (`billing.router`) | Requiere que el MVP posea al menos una vertical consumiendo gas monetizado. | **Fase E.1** |
| **DEF-023** | `analytics.router` — Proyecciones | Imposible sin un Event Store rico en densidad de Eventos para el negocio. | **Fase C.2** |
| **DEF-024** | Contenido público UI de `apps/verify` | El portal se creó y sirve los placeholders Edge. Las trazas en vivo se mostrarán cuando existan assets en la BD. | **Fase B.3** |
