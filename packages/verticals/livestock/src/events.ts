/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod'

/**
 * Event Definition genérico proyectado del Core.
 */
export interface EventDefinition<T = any> {
  type: string
  schemaVersion: number
  payloadSchema: z.ZodSchema<T>
  uiSchema?: Record<string, any> // Estándar react-jsonschema-form o FormKit
  allowedRoles: string[]
}

// ============================================================================
// 1. REGISTRATION & ONBOARDING
// ============================================================================
export const ANIMAL_REGISTERED: EventDefinition = {
  type: 'ANIMAL_REGISTERED',
  schemaVersion: 1,
  payloadSchema: z.object({
    birthDate: z.string().datetime(),
    birthWeightKg: z.number().positive().optional(),
    motherId: z.string().optional(),
    fatherId: z.string().optional(),
  }),
  allowedRoles: ['BovineProducer', 'Veterinarian'],
  uiSchema: {
    type: 'object',
    properties: {
      birthDate: { type: 'string', format: 'date', title: 'Fecha de Nacimiento' },
      birthWeightKg: { type: 'number', title: 'Peso al Nacer (Kg)' },
      motherId: { type: 'string', title: 'RFID Madre', description: 'Opcional si se conoce' },
      fatherId: { type: 'string', title: 'RFID Padre', description: 'Opcional si se conoce' },
    },
    required: ['birthDate'],
  },
}

export const ANIMAL_ONBOARDED: EventDefinition = {
  type: 'ANIMAL_ONBOARDED',
  schemaVersion: 1,
  payloadSchema: z.object({
    originDisclaimer: z.literal(true),
    estimatedAgeMonths: z.number().int().positive(),
  }),
  allowedRoles: ['BovineProducer'],
  uiSchema: {
    type: 'object',
    properties: {
      estimatedAgeMonths: { type: 'integer', title: 'Edad Estimada (Meses)' },
      originDisclaimer: {
        type: 'boolean',
        title: 'Certifico que el animal fue adquirido externamente y no cuento con trazabilidad prenatal en Biffco.',
      },
    },
    required: ['originDisclaimer', 'estimatedAgeMonths'],
  },
}

export const BRANDING_RECORDED: EventDefinition = {
  type: 'BRANDING_RECORDED',
  schemaVersion: 1,
  payloadSchema: z.object({
    method: z.enum(['fuego', 'caravana_rfid', 'tatuaje', 'muesca']),
    identifier: z.string().min(1),
  }),
  allowedRoles: ['BovineProducer', 'Veterinarian'],
  uiSchema: {
    type: 'object',
    properties: {
      method: {
        type: 'string',
        title: 'Método de Marcación',
        enum: ['fuego', 'caravana_rfid', 'tatuaje', 'muesca'],
        enumNames: ['Marca a Fuego', 'Caravana RFID', 'Tatuaje', 'Muesca de Oreja'],
      },
      identifier: { type: 'string', title: 'Identificador Asignado (RFID/Marca)' },
    },
    required: ['method', 'identifier'],
  },
}

// ============================================================================
// 2. PRODUCTION (Pesadas, Alimentación)
// ============================================================================
export const WEIGHT_RECORDED: EventDefinition = {
  type: 'WEIGHT_RECORDED',
  schemaVersion: 1,
  payloadSchema: z.object({
    weightKg: z.number().positive(),
    conditionScore: z.number().min(1).max(5).optional(), // 1 al 5
  }),
  allowedRoles: ['BovineProducer', 'FeedlotOperator', 'SenasaInspector', 'Veterinarian'],
  uiSchema: {
    type: 'object',
    properties: {
      weightKg: { type: 'number', title: 'Peso Registrado (Kg)' },
      conditionScore: { type: 'integer', title: 'Condición Corporal (1 a 5)', minimum: 1, maximum: 5 },
    },
    required: ['weightKg'],
  },
}

export const FEEDING_RECORDED: EventDefinition = {
  type: 'FEEDING_RECORDED',
  schemaVersion: 1,
  payloadSchema: z.object({
    feedType: z.string().min(1),
    quantityKg: z.number().positive(),
    dietCategory: z.enum(['pastura', 'grano', 'suplemento', 'mixta']),
  }),
  allowedRoles: ['BovineProducer', 'FeedlotOperator'],
  uiSchema: {
    type: 'object',
    properties: {
      dietCategory: {
        type: 'string',
        title: 'Categoría de Dieta',
        enum: ['pastura', 'grano', 'suplemento', 'mixta'],
      },
      feedType: { type: 'string', title: 'Descripción/Ración' },
      quantityKg: { type: 'number', title: 'Cantidad Entregada (Kg globales)' },
    },
    required: ['dietCategory', 'feedType', 'quantityKg'],
  },
}

// ============================================================================
// 3. HEALTH & TREATMENTS (Críticos y Oficiales)
// ============================================================================
export const VACCINE_ADMINISTERED: EventDefinition = {
  type: 'VACCINE_ADMINISTERED',
  schemaVersion: 1,
  payloadSchema: z.object({
    vaccineType: z.enum(['aftosa', 'brucelosis', 'mancha', 'otra']),
    batchNumber: z.string().min(1),
    campaign_id: z.string().optional(), // Si es una campaña nacional
  }),
  allowedRoles: ['BovineProducer', 'Veterinarian', 'SenasaInspector'],
  uiSchema: {
    type: 'object',
    properties: {
      vaccineType: {
        type: 'string',
        title: 'Tipo de Vacuna',
        enum: ['aftosa', 'brucelosis', 'mancha', 'otra'],
        enumNames: ['Aftosa (Nacional)', 'Brucelosis (Nacional)', 'Mancha (Clostridial)', 'Otra (Privada)'],
      },
      batchNumber: { type: 'string', title: 'Lote de Vacuna' },
      campaign_id: { type: 'string', title: 'ID de Campaña SENASA (Si aplica)' },
    },
    required: ['vaccineType', 'batchNumber'],
  },
}

export const TREATMENT_ADMINISTERED: EventDefinition = {
  type: 'TREATMENT_ADMINISTERED',
  schemaVersion: 1,
  payloadSchema: z.object({
    medication: z.string().min(1),
    withdrawalPeriodDays: z.number().int().min(0), // Carencia.
    prescriptionPdfHash: z.string().optional(), // evidencia
  }),
  allowedRoles: ['Veterinarian'], // Solo el veterinario puede preescribir y administrar antibióticos con retiro
  uiSchema: {
    type: 'object',
    properties: {
      medication: { type: 'string', title: 'Droga / Medicación' },
      withdrawalPeriodDays: { type: 'integer', title: 'Período de Carencia/Retiro (Días)', default: 0 },
      prescriptionPdfHash: { type: 'string', title: 'Hash de Receta (IPFS/S3)' },
    },
    required: ['medication', 'withdrawalPeriodDays'],
  },
}

export const HEALTH_INCIDENT_REPORTED: EventDefinition = {
  type: 'HEALTH_INCIDENT_REPORTED',
  schemaVersion: 1,
  payloadSchema: z.object({
    symptoms: z.string().min(1),
    severity: z.enum(['low', 'medium', 'high', 'critical']),
  }),
  allowedRoles: ['BovineProducer', 'Veterinarian', 'SenasaInspector', 'FeedlotOperator'],
  uiSchema: {
    type: 'object',
    properties: {
      severity: {
        type: 'string',
        title: 'Gravedad',
        enum: ['low', 'medium', 'high', 'critical'],
        enumNames: ['Leve (Observación)', 'Media (Tratamiento Próximo)', 'Alta (Requiere Hold)', 'Crítica (Riesgo Vital/Zoonótico)'],
      },
      symptoms: { type: 'string', title: 'Síntomas / Hallazgos' },
    },
    required: ['symptoms', 'severity'],
  },
}

export const INCIDENT_RESOLVED: EventDefinition = {
  type: 'INCIDENT_RESOLVED',
  schemaVersion: 1,
  payloadSchema: z.object({
    resolutionNotes: z.string().min(1),
    clearedForMovement: z.boolean(),
  }),
  // El productor reporta el incidente, pero solo un Veterinario o SENASA puede levantar legalmente un incidente severo.
  allowedRoles: ['Veterinarian', 'SenasaInspector'],
  uiSchema: {
    type: 'object',
    properties: {
      clearedForMovement: { type: 'boolean', title: '¿Apto para movimiento/faena?' },
      resolutionNotes: { type: 'string', title: 'Notas de Resolución / Alta Médica' },
    },
    required: ['clearedForMovement', 'resolutionNotes'],
  },
}

// ============================================================================
// 4. CERTIFICATION & COMPLIANCE
// ============================================================================
export const OFFICIAL_INSPECTION: EventDefinition = {
  type: 'OFFICIAL_INSPECTION',
  schemaVersion: 1,
  payloadSchema: z.object({
    pass: z.boolean(),
    findingNotes: z.string(),
  }),
  allowedRoles: ['SenasaInspector'], // Invariable del Estado
  uiSchema: {
    type: 'object',
    properties: {
      pass: { type: 'boolean', title: '¿Inspección Aprobada?' },
      findingNotes: { type: 'string', title: 'Actas o Anotaciones de la Inspección' },
    },
    required: ['pass', 'findingNotes'],
  },
}

export const HEALTH_CERT_ISSUED: EventDefinition = {
  type: 'HEALTH_CERT_ISSUED',
  schemaVersion: 1,
  payloadSchema: z.object({
    dte_number: z.string().min(5),
    validUntil: z.string().datetime(),
    destinationRENSPA: z.string().min(3),
  }),
  allowedRoles: ['SenasaInspector'], // DTE - Documento de Tránsito Electrónico
  uiSchema: {
    type: 'object',
    properties: {
      dte_number: { type: 'string', title: 'Número de DTE/Guía' },
      validUntil: { type: 'string', format: 'date', title: 'Válido Hasta' },
      destinationRENSPA: { type: 'string', title: 'RENSPA de Destino' },
    },
    required: ['dte_number', 'validUntil', 'destinationRENSPA'],
  },
}

export const QUARANTINE_IMPOSED: EventDefinition = {
  type: 'QUARANTINE_IMPOSED',
  schemaVersion: 1,
  payloadSchema: z.object({
    reason: z.string().min(1),
    legalReference: z.string().optional(),
  }),
  allowedRoles: ['SenasaInspector'],
  uiSchema: {
    type: 'object',
    properties: {
      reason: { type: 'string', title: 'Motivo de la Interdicción Definitiva' },
      legalReference: { type: 'string', title: 'Resolución/Artículo Legal' },
    },
    required: ['reason'],
  },
}

export const QUARANTINE_LIFTED: EventDefinition = {
  type: 'QUARANTINE_LIFTED',
  schemaVersion: 1,
  payloadSchema: z.object({
    resolutionProof: z.string().min(1),
  }),
  allowedRoles: ['SenasaInspector'],
  uiSchema: {
    type: 'object',
    properties: {
      resolutionProof: { type: 'string', title: 'Resolución de Levantamiento (Doc ID)' },
    },
    required: ['resolutionProof'],
  },
}

// ============================================================================
// 5. TRANSFERS SUMMARY (Core overrides / wrappers)
// ============================================================================
export const CHECKPOINT_RECORDED: EventDefinition = {
  type: 'CHECKPOINT_RECORDED',
  schemaVersion: 1,
  payloadSchema: z.object({
    locationSummary: z.string(),
    lat: z.number().optional(),
    lng: z.number().optional(),
  }),
  allowedRoles: ['LivestockCarrier'],
  uiSchema: {
    type: 'object',
    properties: {
      locationSummary: { type: 'string', title: 'Ubicación Actual (Ej. Peaje Zárate)' },
      lat: { type: 'number', title: 'Latitud GPS' },
      lng: { type: 'number', title: 'Longitud GPS' },
    },
    required: ['locationSummary'],
  },
}

// ============================================================================
// 6. SLAUGHTER AND FAENA (Derivaciones y Transformaciones Reales)
// ============================================================================
export const SLAUGHTER_SCHEDULED: EventDefinition = {
  type: 'SLAUGHTER_SCHEDULED',
  schemaVersion: 1,
  payloadSchema: z.object({
    slaughterDate: z.string().datetime(),
    fastingHours: z.number().int().min(0).max(48), // Horas de ayuno pre-faena
  }),
  allowedRoles: ['SlaughterhouseOperator'],
  uiSchema: {
    type: 'object',
    properties: {
      slaughterDate: { type: 'string', format: 'date', title: 'Fecha Programada de Faena' },
      fastingHours: { type: 'integer', title: 'Horas de Ayuno Pre-Faena', minimum: 0, maximum: 48, default: 12 },
    },
    required: ['slaughterDate', 'fastingHours'],
  },
}

export const SLAUGHTER_COMPLETED: EventDefinition = {
  type: 'SLAUGHTER_COMPLETED',
  schemaVersion: 1,
  payloadSchema: z.object({
    hotCarcassWeightKg: z.number().positive(), // Peso Canal Caliente
    slaughterLineNumber: z.string().optional(),
  }),
  allowedRoles: ['SlaughterhouseOperator'],
  uiSchema: {
    type: 'object',
    properties: {
      hotCarcassWeightKg: { type: 'number', title: 'Peso Canal Caliente (Kg)' },
      slaughterLineNumber: { type: 'string', title: 'Número de Serie/Tropa Interna' },
    },
    required: ['hotCarcassWeightKg'],
  },
}

export const QUALITY_GRADE_ASSIGNED: EventDefinition = {
  type: 'QUALITY_GRADE_ASSIGNED',
  schemaVersion: 1,
  payloadSchema: z.object({
    system: z.enum(['SENASA', 'USDA', 'EU', 'OTRO']),
    grade: z.string().min(1),
  }),
  allowedRoles: ['SlaughterhouseOperator', 'SenasaInspector', 'AccreditedLaboratory'],
  uiSchema: {
    type: 'object',
    properties: {
      system: {
        type: 'string',
        title: 'Sistema de Tipificación',
        enum: ['SENASA', 'USDA', 'EU', 'OTRO'],
      },
      grade: { type: 'string', title: 'Categoría Asignada (Ej. Novillito JJ)' },
    },
    required: ['system', 'grade'],
  },
}

export const EUDR_DDS_GENERATED: EventDefinition = {
  type: 'EUDR_DDS_GENERATED',
  schemaVersion: 1,
  payloadSchema: z.object({
    ddsReferenceNumber: z.string().min(5),
    operatorIdentifier: z.string().min(1),
    issueDate: z.string().datetime(),
  }),
  allowedRoles: ['Exporter', 'SlaughterhouseOperator'],
  uiSchema: {
    type: 'object',
    properties: {
      ddsReferenceNumber: { type: 'string', title: 'Reference Number DDS (IS EUDR Gateway)' },
      operatorIdentifier: { type: 'string', title: 'Identificador del Operador (RND/EORI)' },
      issueDate: { type: 'string', format: 'date', title: 'Fecha de Emisión DDS' },
    },
    required: ['ddsReferenceNumber', 'operatorIdentifier', 'issueDate'],
  },
}

export const CUSTOMS_CLEARED: EventDefinition = {
  type: 'CUSTOMS_CLEARED',
  schemaVersion: 1,
  payloadSchema: z.object({
    importDeclarationCode: z.string().min(3),
    customsAgentId: z.string().optional(),
  }),
  allowedRoles: ['EUImporter'],
  uiSchema: {
    type: 'object',
    properties: {
      importDeclarationCode: { type: 'string', title: 'Código de Declaración Aduanera UE' },
      customsAgentId: { type: 'string', title: 'Identificación del Agente Aduanero (Opcional)' },
    },
    required: ['importDeclarationCode'],
  },
}

// ============================================================================
// 7. WRAPPERS & BATCHING (Faltantes de C.1 D06-D10)
// ============================================================================

export const LOT_ASSEMBLED: EventDefinition = {
  type: 'LOT_ASSEMBLED',
  schemaVersion: 1,
  payloadSchema: z.object({
    groupId: z.string().min(1),
    headCount: z.number().int().positive(),
  }),
  allowedRoles: ['BovineProducer', 'FeedlotOperator'],
  uiSchema: {
    type: 'object',
    properties: {
      groupId: { type: 'string', title: 'Identificador del Lote/Tropa' },
      headCount: { type: 'integer', title: 'Cantidad de Cabezas' },
    },
    required: ['groupId', 'headCount'],
  },
}

export const LOCATION_CHANGED_LIVESTOCK: EventDefinition = {
  type: 'LOCATION_CHANGED_LIVESTOCK',
  schemaVersion: 1,
  payloadSchema: z.object({
    newPenId: z.string().min(1),
    reason: z.string().optional(),
  }),
  allowedRoles: ['BovineProducer', 'FeedlotOperator', 'SlaughterhouseOperator'],
  uiSchema: {
    type: 'object',
    properties: {
      newPenId: { type: 'string', title: 'Corral de Destino' },
      reason: { type: 'string', title: 'Motivo del Movimiento' },
    },
    required: ['newPenId'],
  },
}

export const TRANSFER_INITIATED_LIVESTOCK: EventDefinition = {
  type: 'TRANSFER_INITIATED_LIVESTOCK',
  schemaVersion: 1,
  payloadSchema: z.object({
    dteNumber: z.string().min(3),
    vehiclePlate: z.string().min(3),
    estimatedArrival: z.string().datetime(),
  }),
  allowedRoles: ['BovineProducer', 'FeedlotOperator', 'Exporter'],
  uiSchema: {
    type: 'object',
    properties: {
      dteNumber: { type: 'string', title: 'DTE / Guía de Tránsito' },
      vehiclePlate: { type: 'string', title: 'Patente del Transporte' },
      estimatedArrival: { type: 'string', format: 'date-time', title: 'Llegada Estimada' },
    },
    required: ['dteNumber', 'vehiclePlate', 'estimatedArrival'],
  },
}

export const TRANSFER_IN_TRANSIT_LIVESTOCK: EventDefinition = {
  type: 'TRANSFER_IN_TRANSIT_LIVESTOCK',
  schemaVersion: 1,
  payloadSchema: z.object({
    carrierId: z.string().min(1),
    statusNotes: z.string().optional(),
  }),
  allowedRoles: ['LivestockCarrier'],
  uiSchema: {
    type: 'object',
    properties: {
      carrierId: { type: 'string', title: 'ID de Transportista' },
      statusNotes: { type: 'string', title: 'Novedades de Viaje' },
    },
    required: ['carrierId'],
  },
}

export const EXTERNAL_CERTIFICATION_LINKED: EventDefinition = {
  type: 'EXTERNAL_CERTIFICATION_LINKED',
  schemaVersion: 1,
  payloadSchema: z.object({
    certificationBody: z.enum(['Brangus', 'Angus Argentino', 'Braford', 'Hereford', 'Limousin', 'Organico']),
    certificationId: z.string().min(1),
    documentHash: z.string().min(10), // PDF hash
  }),
  allowedRoles: ['BovineProducer', 'FeedlotOperator', 'AccreditedLaboratory'],
  uiSchema: {
    type: 'object',
    properties: {
      certificationBody: {
        type: 'string',
        title: 'Entidad Certificadora',
        enum: ['Brangus', 'Angus Argentino', 'Braford', 'Hereford', 'Limousin', 'Organico'],
      },
      certificationId: { type: 'string', title: 'Número de Certificado' },
      documentHash: { type: 'string', title: 'Evidencia PDF (Upload Hash)' },
    },
    required: ['certificationBody', 'certificationId', 'documentHash'],
  },
}

export const HOLD_IMPOSED_BY_STATE: EventDefinition = {
  type: 'HOLD_IMPOSED_BY_STATE',
  schemaVersion: 1,
  payloadSchema: z.object({
    resolutionNumber: z.string().min(1),
    description: z.string().min(1),
  }),
  allowedRoles: ['SenasaInspector'],
  uiSchema: {
    type: 'object',
    properties: {
      resolutionNumber: { type: 'string', title: 'Número de Resolución Estatal' },
      description: { type: 'string', title: 'Descripción del Hold' },
    },
    required: ['resolutionNumber', 'description'],
  },
}

export const FEEDLOT_ENTRY: EventDefinition = {
  type: 'FEEDLOT_ENTRY',
  schemaVersion: 1,
  payloadSchema: z.object({
    entryWeightKg: z.number().positive(),
  }),
  allowedRoles: ['FeedlotOperator'],
  uiSchema: {
    type: 'object',
    properties: {
      entryWeightKg: { type: 'number', title: 'Peso de Ingreso (Kg)' },
    },
    required: ['entryWeightKg'],
  },
}

export const FEEDLOT_EXIT: EventDefinition = {
  type: 'FEEDLOT_EXIT',
  schemaVersion: 1,
  payloadSchema: z.object({
    exitWeightKg: z.number().positive(),
  }),
  allowedRoles: ['FeedlotOperator'],
  uiSchema: {
    type: 'object',
    properties: {
      exitWeightKg: { type: 'number', title: 'Peso de Egreso (Kg)' },
    },
    required: ['exitWeightKg'],
  },
}

// ----------------------------------------------------------------------------
// EXPORT COMPLETO DEL CATÁLOGO
// ----------------------------------------------------------------------------
export const livestockEventCatalog: EventDefinition[] = [
  ANIMAL_REGISTERED,
  ANIMAL_ONBOARDED,
  BRANDING_RECORDED,
  WEIGHT_RECORDED,
  FEEDING_RECORDED,
  VACCINE_ADMINISTERED,
  TREATMENT_ADMINISTERED,
  HEALTH_INCIDENT_REPORTED,
  INCIDENT_RESOLVED,
  OFFICIAL_INSPECTION,
  HEALTH_CERT_ISSUED,
  QUARANTINE_IMPOSED,
  QUARANTINE_LIFTED,
  CHECKPOINT_RECORDED,
  SLAUGHTER_SCHEDULED,
  SLAUGHTER_COMPLETED,
  QUALITY_GRADE_ASSIGNED,
  EUDR_DDS_GENERATED,
  CUSTOMS_CLEARED,
  LOT_ASSEMBLED,
  LOCATION_CHANGED_LIVESTOCK,
  TRANSFER_INITIATED_LIVESTOCK,
  TRANSFER_IN_TRANSIT_LIVESTOCK,
  EXTERNAL_CERTIFICATION_LINKED,
  HOLD_IMPOSED_BY_STATE,
  FEEDLOT_ENTRY,
  FEEDLOT_EXIT,
]
