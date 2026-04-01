import { describe, it, expect } from 'vitest'
import {
  livestockAssetTypes,
  animalAssetSchema,
  lotAssetSchema,
  derivedAssetSchema,
} from '../asset-types'

describe('Livestock Asset Types Definition', () => {
  it('should export exactly 3 asset types', () => {
    expect(livestockAssetTypes.length).toBe(3)
    const activeIds = livestockAssetTypes.map((a) => a.id)
    expect(activeIds).toEqual(expect.arrayContaining(['AnimalAsset', 'LotAsset', 'DerivedAsset']))
  })

  // 1. AnimalAsset schema validation
  describe('AnimalAsset Schema', () => {
    const validAnimal = {
      species: 'bovine',
      sex: 'M',
      breed: 'Angus',
      dateOfBirth: new Date().toISOString(),
      rfid: '032-987654321',
    }

    it('should pass on a fully valid AnimalAsset payload', () => {
      expect(() => animalAssetSchema.parse(validAnimal)).not.toThrow()
    })

    it('should throw if species is NOT bovine', () => {
      expect(() => animalAssetSchema.parse({ ...validAnimal, species: 'porcine' })).toThrow()
    })

    it('should pass if breed is omitted', () => {
      const { breed, ...noBreed } = validAnimal
      expect(() => animalAssetSchema.parse(noBreed)).not.toThrow()
    })

    it('should throw if RFID is too short', () => {
      expect(() => animalAssetSchema.parse({ ...validAnimal, rfid: 'AB' })).toThrow()
    })

    it('should have geoRequired set to true', () => {
      const def = livestockAssetTypes.find((a) => a.id === 'AnimalAsset')
      expect(def?.geoRequired).toBe(true)
    })
  })

  // 2. LotAsset schema validation
  describe('LotAsset Schema', () => {
    const validLot = {
      headCount: 45,
      averageWeightKg: 290.5,
      description: 'Lote destete recría 1',
    }

    it('should pass on a fully valid LotAsset payload', () => {
      expect(() => lotAssetSchema.parse(validLot)).not.toThrow()
    })

    it('should throw if headCount is less than 1 or not an integer', () => {
      expect(() => lotAssetSchema.parse({ ...validLot, headCount: 0 })).toThrow()
      expect(() => lotAssetSchema.parse({ ...validLot, headCount: 15.5 })).toThrow()
    })

    it('should have geoRequired set to true', () => {
      const def = livestockAssetTypes.find((a) => a.id === 'LotAsset')
      expect(def?.geoRequired).toBe(true)
    })
  })

  // 3. DerivedAsset schema validation
  describe('DerivedAsset Schema', () => {
    const validDerived = {
      category: 'cuero',
      weightKg: 45.2,
      qualityGrade: 'A',
      productionDate: new Date().toISOString(),
    }

    it('should pass on a valid DerivedAsset of allowed category', () => {
      expect(() => derivedAssetSchema.parse(validDerived)).not.toThrow()
    })

    it('should pass for multiple valid categories from the strict enum', () => {
      const testCases = ['media_res', 'ojo_de_bife', 'menudencias', 'garrón']
      for (const category of testCases) {
        expect(() => derivedAssetSchema.parse({ ...validDerived, category })).not.toThrow()
      }
    })

    it('should throw if category is absolutely invalid', () => {
      expect(() => derivedAssetSchema.parse({ ...validDerived, category: 'cuerno' })).toThrow()
    })

    it('should throw if weightKg is negative', () => {
      expect(() => derivedAssetSchema.parse({ ...validDerived, weightKg: -5 })).toThrow()
    })

    it('should have geoRequired set to false', () => {
      const def = livestockAssetTypes.find((a) => a.id === 'DerivedAsset')
      expect(def?.geoRequired).toBe(false)
    })
  })
})
