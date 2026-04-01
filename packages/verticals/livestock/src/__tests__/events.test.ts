import { describe, it, expect } from 'vitest'
import {
  livestockEventCatalog,
  ANIMAL_REGISTERED,
  QUARANTINE_IMPOSED,
  VACCINE_ADMINISTERED,
  SLAUGHTER_COMPLETED,
  EUDR_DDS_GENERATED,
} from '../events'

describe('Livestock Event Catalog Definitions', () => {
  it('should export an array of event definitions', () => {
    expect(livestockEventCatalog).toBeInstanceOf(Array)
    expect(livestockEventCatalog.length).toBeGreaterThan(15) // Aseguramos que cargamos los ~19 eventos
  })

  // 1. ANIMAL_REGISTERED validation
  describe('ANIMAL_REGISTERED', () => {
    it('should have required allowedRoles', () => {
      expect(ANIMAL_REGISTERED.allowedRoles).toContain('BovineProducer')
      expect(ANIMAL_REGISTERED.allowedRoles).not.toContain('SenasaInspector') // El estado no inscribe nacimientos en primera instancia
    })

    it('should parse valid payload successfully', () => {
      expect(() =>
        ANIMAL_REGISTERED.payloadSchema.parse({
          birthDate: new Date().toISOString(),
          birthWeightKg: 40.5,
        })
      ).not.toThrow()
    })

    it('should fail if required fields are missing', () => {
      expect(() => ANIMAL_REGISTERED.payloadSchema.parse({ birthWeightKg: 40 })).toThrow()
    })

    it('should have correct uiSchema properties', () => {
      expect(ANIMAL_REGISTERED.uiSchema?.properties.birthDate).toBeDefined()
      expect(ANIMAL_REGISTERED.uiSchema?.required).toContain('birthDate')
    })
  })

  // 2. VACCINE_ADMINISTERED validation
  describe('VACCINE_ADMINISTERED', () => {
    it('should accept valid vaccines from enum', () => {
      expect(() =>
        VACCINE_ADMINISTERED.payloadSchema.parse({
          vaccineType: 'aftosa',
          batchNumber: 'LOTE-1234',
        })
      ).not.toThrow()
    })

    it('should reject invalid vaccine names', () => {
      expect(() =>
        VACCINE_ADMINISTERED.payloadSchema.parse({
          vaccineType: 'covid19',
          batchNumber: 'LOTE-1234',
        })
      ).toThrow()
    })

    it('should allow SenasaInspector to sign', () => {
      expect(VACCINE_ADMINISTERED.allowedRoles).toContain('SenasaInspector')
    })
  })

  // 3. QUARANTINE_IMPOSED Security Constraint
  describe('QUARANTINE_IMPOSED (Critical Security Rule)', () => {
    it('MUST strictly allow ONLY SenasaInspector', () => {
      expect(QUARANTINE_IMPOSED.allowedRoles).toEqual(['SenasaInspector'])
    })

    it('should parse valid payload', () => {
      expect(() =>
        QUARANTINE_IMPOSED.payloadSchema.parse({
          reason: 'Brote sospechoso detectado',
          legalReference: 'Resolución SENASA 542/2021',
        })
      ).not.toThrow()
    })
  })

  // 4. SLAUGHTER_COMPLETED
  describe('SLAUGHTER_COMPLETED', () => {
    it('must be signed by SlaughterhouseOperator ONLY', () => {
      expect(SLAUGHTER_COMPLETED.allowedRoles).toEqual(['SlaughterhouseOperator'])
    })

    it('must require positive carcass weight', () => {
      expect(() =>
        SLAUGHTER_COMPLETED.payloadSchema.parse({ hotCarcassWeightKg: -10 })
      ).toThrow()

      expect(() =>
        SLAUGHTER_COMPLETED.payloadSchema.parse({ hotCarcassWeightKg: 280.5 })
      ).not.toThrow()
    })
  })

  // 5. EUDR_DDS_GENERATED
  describe('EUDR_DDS_GENERATED', () => {
    it('should contain Exporter in allowed roles', () => {
      expect(EUDR_DDS_GENERATED.allowedRoles).toContain('Exporter')
    })

    it('should reject short reference numbers', () => {
      expect(() =>
        EUDR_DDS_GENERATED.payloadSchema.parse({
          ddsReferenceNumber: '12', // too short
          operatorIdentifier: 'OP-123',
          issueDate: new Date().toISOString(),
        })
      ).toThrow()
    })
  })
})
