"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.livestockEventCatalog = exports.FEEDLOT_EXIT = exports.FEEDLOT_ENTRY = exports.HOLD_IMPOSED_BY_STATE = exports.EXTERNAL_CERTIFICATION_LINKED = exports.TRANSFER_IN_TRANSIT_LIVESTOCK = exports.TRANSFER_INITIATED_LIVESTOCK = exports.LOCATION_CHANGED_LIVESTOCK = exports.LOT_ASSEMBLED = exports.CUSTOMS_CLEARED = exports.EUDR_DDS_GENERATED = exports.QUALITY_GRADE_ASSIGNED = exports.SLAUGHTER_COMPLETED = exports.SLAUGHTER_SCHEDULED = exports.CHECKPOINT_RECORDED = exports.QUARANTINE_LIFTED = exports.QUARANTINE_IMPOSED = exports.HEALTH_CERT_ISSUED = exports.OFFICIAL_INSPECTION = exports.INCIDENT_RESOLVED = exports.HEALTH_INCIDENT_REPORTED = exports.TREATMENT_ADMINISTERED = exports.VACCINE_ADMINISTERED = exports.FEEDING_RECORDED = exports.WEIGHT_RECORDED = exports.BRANDING_RECORDED = exports.ANIMAL_ONBOARDED = exports.ANIMAL_REGISTERED = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const zod_1 = require("zod");
// ============================================================================
// 1. REGISTRATION & ONBOARDING
// ============================================================================
exports.ANIMAL_REGISTERED = {
    type: 'ANIMAL_REGISTERED',
    schemaVersion: 1,
    payloadSchema: zod_1.z.object({
        birthDate: zod_1.z.string().datetime(),
        birthWeightKg: zod_1.z.number().positive().optional(),
        motherId: zod_1.z.string().optional(),
        fatherId: zod_1.z.string().optional(),
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
};
exports.ANIMAL_ONBOARDED = {
    type: 'ANIMAL_ONBOARDED',
    schemaVersion: 1,
    payloadSchema: zod_1.z.object({
        originDisclaimer: zod_1.z.literal(true),
        estimatedAgeMonths: zod_1.z.number().int().positive(),
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
};
exports.BRANDING_RECORDED = {
    type: 'BRANDING_RECORDED',
    schemaVersion: 1,
    payloadSchema: zod_1.z.object({
        method: zod_1.z.enum(['fuego', 'caravana_rfid', 'tatuaje', 'muesca']),
        identifier: zod_1.z.string().min(1),
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
};
// ============================================================================
// 2. PRODUCTION (Pesadas, Alimentación)
// ============================================================================
exports.WEIGHT_RECORDED = {
    type: 'WEIGHT_RECORDED',
    schemaVersion: 1,
    payloadSchema: zod_1.z.object({
        weightKg: zod_1.z.number().positive(),
        conditionScore: zod_1.z.number().min(1).max(5).optional(), // 1 al 5
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
};
exports.FEEDING_RECORDED = {
    type: 'FEEDING_RECORDED',
    schemaVersion: 1,
    payloadSchema: zod_1.z.object({
        feedType: zod_1.z.string().min(1),
        quantityKg: zod_1.z.number().positive(),
        dietCategory: zod_1.z.enum(['pastura', 'grano', 'suplemento', 'mixta']),
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
};
// ============================================================================
// 3. HEALTH & TREATMENTS (Críticos y Oficiales)
// ============================================================================
exports.VACCINE_ADMINISTERED = {
    type: 'VACCINE_ADMINISTERED',
    schemaVersion: 1,
    payloadSchema: zod_1.z.object({
        vaccineType: zod_1.z.enum(['aftosa', 'brucelosis', 'mancha', 'otra']),
        batchNumber: zod_1.z.string().min(1),
        campaign_id: zod_1.z.string().optional(), // Si es una campaña nacional
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
};
exports.TREATMENT_ADMINISTERED = {
    type: 'TREATMENT_ADMINISTERED',
    schemaVersion: 1,
    payloadSchema: zod_1.z.object({
        medication: zod_1.z.string().min(1),
        withdrawalPeriodDays: zod_1.z.number().int().min(0), // Carencia.
        prescriptionPdfHash: zod_1.z.string().optional(), // evidencia
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
};
exports.HEALTH_INCIDENT_REPORTED = {
    type: 'HEALTH_INCIDENT_REPORTED',
    schemaVersion: 1,
    payloadSchema: zod_1.z.object({
        symptoms: zod_1.z.string().min(1),
        severity: zod_1.z.enum(['low', 'medium', 'high', 'critical']),
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
};
exports.INCIDENT_RESOLVED = {
    type: 'INCIDENT_RESOLVED',
    schemaVersion: 1,
    payloadSchema: zod_1.z.object({
        resolutionNotes: zod_1.z.string().min(1),
        clearedForMovement: zod_1.z.boolean(),
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
};
// ============================================================================
// 4. CERTIFICATION & COMPLIANCE
// ============================================================================
exports.OFFICIAL_INSPECTION = {
    type: 'OFFICIAL_INSPECTION',
    schemaVersion: 1,
    payloadSchema: zod_1.z.object({
        pass: zod_1.z.boolean(),
        findingNotes: zod_1.z.string(),
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
};
exports.HEALTH_CERT_ISSUED = {
    type: 'HEALTH_CERT_ISSUED',
    schemaVersion: 1,
    payloadSchema: zod_1.z.object({
        dte_number: zod_1.z.string().min(5),
        validUntil: zod_1.z.string().datetime(),
        destinationRENSPA: zod_1.z.string().min(3),
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
};
exports.QUARANTINE_IMPOSED = {
    type: 'QUARANTINE_IMPOSED',
    schemaVersion: 1,
    payloadSchema: zod_1.z.object({
        reason: zod_1.z.string().min(1),
        legalReference: zod_1.z.string().optional(),
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
};
exports.QUARANTINE_LIFTED = {
    type: 'QUARANTINE_LIFTED',
    schemaVersion: 1,
    payloadSchema: zod_1.z.object({
        resolutionProof: zod_1.z.string().min(1),
    }),
    allowedRoles: ['SenasaInspector'],
    uiSchema: {
        type: 'object',
        properties: {
            resolutionProof: { type: 'string', title: 'Resolución de Levantamiento (Doc ID)' },
        },
        required: ['resolutionProof'],
    },
};
// ============================================================================
// 5. TRANSFERS SUMMARY (Core overrides / wrappers)
// ============================================================================
exports.CHECKPOINT_RECORDED = {
    type: 'CHECKPOINT_RECORDED',
    schemaVersion: 1,
    payloadSchema: zod_1.z.object({
        locationSummary: zod_1.z.string(),
        lat: zod_1.z.number().optional(),
        lng: zod_1.z.number().optional(),
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
};
// ============================================================================
// 6. SLAUGHTER AND FAENA (Derivaciones y Transformaciones Reales)
// ============================================================================
exports.SLAUGHTER_SCHEDULED = {
    type: 'SLAUGHTER_SCHEDULED',
    schemaVersion: 1,
    payloadSchema: zod_1.z.object({
        slaughterDate: zod_1.z.string().datetime(),
        fastingHours: zod_1.z.number().int().min(0).max(48), // Horas de ayuno pre-faena
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
};
exports.SLAUGHTER_COMPLETED = {
    type: 'SLAUGHTER_COMPLETED',
    schemaVersion: 1,
    payloadSchema: zod_1.z.object({
        hotCarcassWeightKg: zod_1.z.number().positive(), // Peso Canal Caliente
        slaughterLineNumber: zod_1.z.string().optional(),
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
};
exports.QUALITY_GRADE_ASSIGNED = {
    type: 'QUALITY_GRADE_ASSIGNED',
    schemaVersion: 1,
    payloadSchema: zod_1.z.object({
        system: zod_1.z.enum(['SENASA', 'USDA', 'EU', 'OTRO']),
        grade: zod_1.z.string().min(1),
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
};
exports.EUDR_DDS_GENERATED = {
    type: 'EUDR_DDS_GENERATED',
    schemaVersion: 1,
    payloadSchema: zod_1.z.object({
        ddsReferenceNumber: zod_1.z.string().min(5),
        operatorIdentifier: zod_1.z.string().min(1),
        issueDate: zod_1.z.string().datetime(),
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
};
exports.CUSTOMS_CLEARED = {
    type: 'CUSTOMS_CLEARED',
    schemaVersion: 1,
    payloadSchema: zod_1.z.object({
        importDeclarationCode: zod_1.z.string().min(3),
        customsAgentId: zod_1.z.string().optional(),
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
};
// ============================================================================
// 7. WRAPPERS & BATCHING (Faltantes de C.1 D06-D10)
// ============================================================================
exports.LOT_ASSEMBLED = {
    type: 'LOT_ASSEMBLED',
    schemaVersion: 1,
    payloadSchema: zod_1.z.object({
        groupId: zod_1.z.string().min(1),
        headCount: zod_1.z.number().int().positive(),
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
};
exports.LOCATION_CHANGED_LIVESTOCK = {
    type: 'LOCATION_CHANGED_LIVESTOCK',
    schemaVersion: 1,
    payloadSchema: zod_1.z.object({
        newPenId: zod_1.z.string().min(1),
        reason: zod_1.z.string().optional(),
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
};
exports.TRANSFER_INITIATED_LIVESTOCK = {
    type: 'TRANSFER_INITIATED_LIVESTOCK',
    schemaVersion: 1,
    payloadSchema: zod_1.z.object({
        dteNumber: zod_1.z.string().min(3),
        vehiclePlate: zod_1.z.string().min(3),
        estimatedArrival: zod_1.z.string().datetime(),
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
};
exports.TRANSFER_IN_TRANSIT_LIVESTOCK = {
    type: 'TRANSFER_IN_TRANSIT_LIVESTOCK',
    schemaVersion: 1,
    payloadSchema: zod_1.z.object({
        carrierId: zod_1.z.string().min(1),
        statusNotes: zod_1.z.string().optional(),
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
};
exports.EXTERNAL_CERTIFICATION_LINKED = {
    type: 'EXTERNAL_CERTIFICATION_LINKED',
    schemaVersion: 1,
    payloadSchema: zod_1.z.object({
        certificationBody: zod_1.z.enum(['Brangus', 'Angus Argentino', 'Braford', 'Hereford', 'Limousin', 'Organico']),
        certificationId: zod_1.z.string().min(1),
        documentHash: zod_1.z.string().min(10), // PDF hash
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
};
exports.HOLD_IMPOSED_BY_STATE = {
    type: 'HOLD_IMPOSED_BY_STATE',
    schemaVersion: 1,
    payloadSchema: zod_1.z.object({
        resolutionNumber: zod_1.z.string().min(1),
        description: zod_1.z.string().min(1),
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
};
exports.FEEDLOT_ENTRY = {
    type: 'FEEDLOT_ENTRY',
    schemaVersion: 1,
    payloadSchema: zod_1.z.object({
        entryWeightKg: zod_1.z.number().positive(),
    }),
    allowedRoles: ['FeedlotOperator'],
    uiSchema: {
        type: 'object',
        properties: {
            entryWeightKg: { type: 'number', title: 'Peso de Ingreso (Kg)' },
        },
        required: ['entryWeightKg'],
    },
};
exports.FEEDLOT_EXIT = {
    type: 'FEEDLOT_EXIT',
    schemaVersion: 1,
    payloadSchema: zod_1.z.object({
        exitWeightKg: zod_1.z.number().positive(),
    }),
    allowedRoles: ['FeedlotOperator'],
    uiSchema: {
        type: 'object',
        properties: {
            exitWeightKg: { type: 'number', title: 'Peso de Egreso (Kg)' },
        },
        required: ['exitWeightKg'],
    },
};
// ----------------------------------------------------------------------------
// EXPORT COMPLETO DEL CATÁLOGO
// ----------------------------------------------------------------------------
exports.livestockEventCatalog = [
    exports.ANIMAL_REGISTERED,
    exports.ANIMAL_ONBOARDED,
    exports.BRANDING_RECORDED,
    exports.WEIGHT_RECORDED,
    exports.FEEDING_RECORDED,
    exports.VACCINE_ADMINISTERED,
    exports.TREATMENT_ADMINISTERED,
    exports.HEALTH_INCIDENT_REPORTED,
    exports.INCIDENT_RESOLVED,
    exports.OFFICIAL_INSPECTION,
    exports.HEALTH_CERT_ISSUED,
    exports.QUARANTINE_IMPOSED,
    exports.QUARANTINE_LIFTED,
    exports.CHECKPOINT_RECORDED,
    exports.SLAUGHTER_SCHEDULED,
    exports.SLAUGHTER_COMPLETED,
    exports.QUALITY_GRADE_ASSIGNED,
    exports.EUDR_DDS_GENERATED,
    exports.CUSTOMS_CLEARED,
    exports.LOT_ASSEMBLED,
    exports.LOCATION_CHANGED_LIVESTOCK,
    exports.TRANSFER_INITIATED_LIVESTOCK,
    exports.TRANSFER_IN_TRANSIT_LIVESTOCK,
    exports.EXTERNAL_CERTIFICATION_LINKED,
    exports.HOLD_IMPOSED_BY_STATE,
    exports.FEEDLOT_ENTRY,
    exports.FEEDLOT_EXIT,
];
//# sourceMappingURL=events.js.map