# Plan de Kickoff — Sprint B.1 (Fase B)

Hemos cerrado oficialmente la Fase A y estamos ingresando a **Fase B (Product Layer)**. 

## Estado Actual & Dependencias
- Se ejecutó la instalación de las dependencias requeridas para la Fase B en los diferentes módulos (`@aws-sdk/client-s3`, `@react-pdf/renderer`, `leaflet`, `resend`, `workbox-*`, etc.).
- Se ha creado la base modular del paquete `@biffco/email` con un componente base y su configuración de TypeScript.

## Próximos Pasos Inmediatos (Sprint B.1)

### 1. Desarrollar Componentes Base en packages/ui (TASK-031)
- Continuaremos expandiendo los componentes de **shadcn/ui** customizados con nuestros *tokens* (`--color-primary`, `--space-4`, etc.) de acuerdo al **Design System**.
- Componentes del Día 1 y 2: `Table`, `Textarea`, `Label`, `Modal`, `Dialog`, `Toast` (Sonner), `Select` (Radix), `Checkbox`, `Switch`, `RadioGroup`, `DateRangePicker`.

### 2. Implementar Contratos y APIs de Gestión (TASK-033/034)
- **Routers**: Crear lógica segura con RLS para `workspace-members`, `teams`, `employees`, `facilities`, y `zones`.
- Implementar validación **PostGIS** requerida para EUDR sobre los campos con polígonos.

### 3. Acuerdos de Interfaces
- Generar la documentación `docs/contracts/fase-b.md` definiendo los contratos tRPC (`assets.list`, `assets.getById`, etc.).

### Pilares Fundamentales
1. **Design System**: El diseño será agnóstico sin *hardcodeos*, utilizando `Inter` para los interfaces y `JetBrains Mono` puramente para los datos técnicos/hashes.
2. **Product Layer**: El código no tiene verticalización forzada (`if (vertical === 'livestock')`).

Estamos listos para el Sprint B.1.
