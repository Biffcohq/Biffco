"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const events_1 = require("../events");
(0, vitest_1.describe)('Livestock Event Catalog Definitions', () => {
    (0, vitest_1.it)('should export an array of event definitions', () => {
        (0, vitest_1.expect)(events_1.livestockEventCatalog).toBeInstanceOf(Array);
        (0, vitest_1.expect)(events_1.livestockEventCatalog.length).toBeGreaterThan(15); // Aseguramos que cargamos los ~19 eventos
    });
    // 1. ANIMAL_REGISTERED validation
    (0, vitest_1.describe)('ANIMAL_REGISTERED', () => {
        (0, vitest_1.it)('should have required allowedRoles', () => {
            (0, vitest_1.expect)(events_1.ANIMAL_REGISTERED.allowedRoles).toContain('BovineProducer');
            (0, vitest_1.expect)(events_1.ANIMAL_REGISTERED.allowedRoles).not.toContain('SenasaInspector'); // El estado no inscribe nacimientos en primera instancia
        });
        (0, vitest_1.it)('should parse valid payload successfully', () => {
            (0, vitest_1.expect)(() => events_1.ANIMAL_REGISTERED.payloadSchema.parse({
                birthDate: new Date().toISOString(),
                birthWeightKg: 40.5,
            })).not.toThrow();
        });
        (0, vitest_1.it)('should fail if required fields are missing', () => {
            (0, vitest_1.expect)(() => events_1.ANIMAL_REGISTERED.payloadSchema.parse({ birthWeightKg: 40 })).toThrow();
        });
        (0, vitest_1.it)('should have correct uiSchema properties', () => {
            (0, vitest_1.expect)(events_1.ANIMAL_REGISTERED.uiSchema?.properties.birthDate).toBeDefined();
            (0, vitest_1.expect)(events_1.ANIMAL_REGISTERED.uiSchema?.required).toContain('birthDate');
        });
    });
    // 2. VACCINE_ADMINISTERED validation
    (0, vitest_1.describe)('VACCINE_ADMINISTERED', () => {
        (0, vitest_1.it)('should accept valid vaccines from enum', () => {
            (0, vitest_1.expect)(() => events_1.VACCINE_ADMINISTERED.payloadSchema.parse({
                vaccineType: 'aftosa',
                batchNumber: 'LOTE-1234',
            })).not.toThrow();
        });
        (0, vitest_1.it)('should reject invalid vaccine names', () => {
            (0, vitest_1.expect)(() => events_1.VACCINE_ADMINISTERED.payloadSchema.parse({
                vaccineType: 'covid19',
                batchNumber: 'LOTE-1234',
            })).toThrow();
        });
        (0, vitest_1.it)('should allow SenasaInspector to sign', () => {
            (0, vitest_1.expect)(events_1.VACCINE_ADMINISTERED.allowedRoles).toContain('SenasaInspector');
        });
    });
    // 3. QUARANTINE_IMPOSED Security Constraint
    (0, vitest_1.describe)('QUARANTINE_IMPOSED (Critical Security Rule)', () => {
        (0, vitest_1.it)('MUST strictly allow ONLY SenasaInspector', () => {
            (0, vitest_1.expect)(events_1.QUARANTINE_IMPOSED.allowedRoles).toEqual(['SenasaInspector']);
        });
        (0, vitest_1.it)('should parse valid payload', () => {
            (0, vitest_1.expect)(() => events_1.QUARANTINE_IMPOSED.payloadSchema.parse({
                reason: 'Brote sospechoso detectado',
                legalReference: 'Resolución SENASA 542/2021',
            })).not.toThrow();
        });
    });
    // 4. SLAUGHTER_COMPLETED
    (0, vitest_1.describe)('SLAUGHTER_COMPLETED', () => {
        (0, vitest_1.it)('must be signed by SlaughterhouseOperator ONLY', () => {
            (0, vitest_1.expect)(events_1.SLAUGHTER_COMPLETED.allowedRoles).toEqual(['SlaughterhouseOperator']);
        });
        (0, vitest_1.it)('must require positive carcass weight', () => {
            (0, vitest_1.expect)(() => events_1.SLAUGHTER_COMPLETED.payloadSchema.parse({ hotCarcassWeightKg: -10 })).toThrow();
            (0, vitest_1.expect)(() => events_1.SLAUGHTER_COMPLETED.payloadSchema.parse({ hotCarcassWeightKg: 280.5 })).not.toThrow();
        });
    });
    // 5. EUDR_DDS_GENERATED
    (0, vitest_1.describe)('EUDR_DDS_GENERATED', () => {
        (0, vitest_1.it)('should contain Exporter in allowed roles', () => {
            (0, vitest_1.expect)(events_1.EUDR_DDS_GENERATED.allowedRoles).toContain('Exporter');
        });
        (0, vitest_1.it)('should reject short reference numbers', () => {
            (0, vitest_1.expect)(() => events_1.EUDR_DDS_GENERATED.payloadSchema.parse({
                ddsReferenceNumber: '12', // too short
                operatorIdentifier: 'OP-123',
                issueDate: new Date().toISOString(),
            })).toThrow();
        });
    });
});
//# sourceMappingURL=events.test.js.map