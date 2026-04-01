# Event Catalog Draft — Livestock Vertical

*Versión 0.1 — Borrador inicial de los Eventos de Dominio que conformarán el `eventCatalog` en `packages/verticals/livestock/src/events.ts`.*

---

## 1. Registro y Nacimientos (Registration)
- **`ANIMAL_REGISTERED`**: Registro base de un animal al nacer o ser ingresado al sistema. *(Actor: BovineProducer)*
- **`ANIMAL_ONBOARDED`**: Ingreso de un animal adulto sin historial trazable (ej. compra a tercero fuera del sistema). *(Actor: BovineProducer)*
- **`BIRTH_RECORDED`**: Alternativa explícita a ANIMAL_REGISTERED cuando el evento es específicamente el nacimiento dentro de un Facility. *(Actor: BovineProducer, Veterinarian)*
- **`BRANDING_RECORDED`**: Acto de marcar o poner la caravana, asignando el EID. *(Actor: BovineProducer)*

## 2. Producción y Manejo (Production Actions)
- **`WEIGHT_RECORDED`**: Pesada en manga. *(Actores: BovineProducer, FeedlotOperator)*
- **`FEEDING_RECORDED`**: Registro de dieta o suplementación. *(Actores: BovineProducer, FeedlotOperator)*
- **`REPRODUCTION_RECORDED`**: Registro de servicio, inseminación o tacto. *(Actores: BovineProducer, Veterinarian)*

## 3. Salud y Tratamientos (Health & Treatments)
- **`VACCINE_ADMINISTERED`**: Vacunación privada o de campaña nacional (aftosa, brucelosis). *(Actores: Veterinarian, SenasaInspector, BovineProducer)*
- **`TREATMENT_ADMINISTERED`**: Suministro de antibióticos o medicamentos con tiempo de retiro. *(Actores: Veterinarian)*
- **`VETERINARY_INSPECTION`**: Reporte periódico de salud de lote. *(Actor: Veterinarian)*
- **`HEALTH_INCIDENT_REPORTED`**: Reporte de herida o enfermedad grave. *(Actores: BovineProducer, Veterinarian, SenasaInspector)*
- **`INCIDENT_RESOLVED`**: Cierre clínico de un reporte de incidencia, liberando de un status de "En Tratamiento". *(Actores: Veterinarian, SenasaInspector)*

## 4. Auditoría y Autoridad (Regulatory & Compliance)
- **`OFFICIAL_INSPECTION`**: Inspección sanitaria obligatoria previa a movimientos. *(Actor: SenasaInspector)*
- **`HEALTH_CERT_ISSUED` (DTE)**: Documento de Tránsito Electrónico (Habilitación de transferencia). *(Actor: SenasaInspector)*
- **`QUARANTINE_IMPOSED`**: Bloqueo estricto del activo por mandato estatal. Modifica status a LOCKED. *(Actor: SenasaInspector)*
- **`QUARANTINE_LIFTED`**: Levantamiento del bloqueo estatal. *(Actor: SenasaInspector)*
- **`EXTERNAL_CERTIFICATION_LINKED`**: Asociación de un documento de calidad (ej. Raza Angus, Orgánico) en S3 WORM al asset. *(Todos menos Auditor)*

## 5. Bajas y Faltantes (Write-offs)
- **`DEATH_RECORDED`**: El animal muere de causa natural o por enfermedad. Pasa status a CLOSED. *(Actores: BovineProducer, FeedlotOperator)*
- **`THEFT_REPORTED`**: Robo o cuatrerismo. Pasa status a STOLEN. *(Actores: BovineProducer, Carrier, FeedlotOperator)*
- **`STRAYING_REPORTED`**: Animal extraviado. Pasa status a LOST.

## 6. Movimientos Internos
- **`LOCATION_CHANGED`**: Movimiento entre corrales (`Pens`) dentro de una misma zona.
- **`INTERNAL_FACILITY_TRANSFER`**: Movimiento de un establecimiento (`Facility`) a otro del mismo dueño.

## 7. Transferencias / Transporte (Transfers)
*(Nota: Estos son en gran medida soportados de forma genérica a través del transfer.router del Core, pero operan sobre Livestock)*
- **`TRANSFER_INITIATED`**
- **`TRANSFER_IN_TRANSIT`**: Generado por el `LivestockCarrier`.
- **`TRANSFER_ACCEPTED` / `TRANSFER_REJECTED`**
- **`CHECKPOINT_RECORDED` / `VEHICLE_INCIDENT_REPORTED`**: Para auditoría de tránsito (Carrier).

## 8. Faena y Agrupación (Transform & Group)
- **`GROUP_FORMED` / `GROUP_DISSOLVED`**: Genérico atómico del Core, agrupando tropas.
- **`SLAUGHTER_SCHEDULED`**: Se programa el animal para faena. Pasa status a IN_PROCESS. *(Actor: SlaughterhouseOperator)*
- **`SLAUGHTER_COMPLETED`**: Ejecución `Transform 1 -> N`. Cierra el vivo y da origen a los DerivedAssets. *(Actor: SlaughterhouseOperator)*
- **`QUALITY_GRADE_ASSIGNED`**: Tipificación post-faena (ej. Novillito JJ). *(Actor: SlaughterhouseOperator)*

## 9. Laboratorio y Exportación (Export & Post-Faena)
- **`QUALITY_ANALYSIS_STARTED` / `COMPLETED`**: Toma y resultado de muestras microbiológicas. *(Actor: AccreditedLaboratory)*
- **`QUALITY_CERT_ISSUED`**: Alta del certificado final de testeo. *(Actor: AccreditedLaboratory)*
- **`EUDR_DDS_GENERATED`**: Creación del Due Diligence Statement avalando libre de deforestación. *(Actor: Exporter, SlaughterhouseOperator)*
- **`EXPORT_DOCUMENTATION_ISSUED`**: Papelería de aduana en origen. *(Actor: Exporter)*
- **`CUSTOMS_CLEARED`**: Clearance aduanero europeo. *(Actor: EUImporter)*
- **`SPLIT_COMPLETED`**: Para dividir Media Res a Cortes por el minorista (RetailerProcessor) u otros.
