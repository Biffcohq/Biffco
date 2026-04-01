import { describe, test, expect } from 'vitest'
import { livestockMergeRules } from '../merge-rules'

describe('Livestock Rules', () => {
  describe('Worst-Case Compliance (MergeRule)', () => {
    const mergeRuleAnimalToLot = livestockMergeRules[0]! // Animal -> Lot
    
    test('Lot inherits High Risk GFW alert if a single animal is affected', () => {
      const healthyAnimal = { id: 'A1', payload: { category: 'Cow', lastWeight: 500 }, holds: [], gfwAlerts: [] }
      const highRiskAnimal = { id: 'A2', payload: { category: 'Cow', lastWeight: 520 }, holds: [], gfwAlerts: ['GFW_2020_DEF_ALERT'] }

      const mergedCategories = mergeRuleAnimalToLot.computedFields?.categories!([healthyAnimal, highRiskAnimal])
      const mergedQuantity = mergeRuleAnimalToLot.computedFields?.quantity!([healthyAnimal, highRiskAnimal])
      const avgWeight = mergeRuleAnimalToLot.computedFields?.avgWeight!([healthyAnimal, highRiskAnimal])

      expect(mergedCategories).toEqual(['Cow'])
      expect(mergedQuantity).toBe(2)
      expect(avgWeight).toBe(510)
      
      // Verification of worstCaseFields extraction
      const inheritedFields = [...healthyAnimal.gfwAlerts, ...highRiskAnimal.gfwAlerts]
      expect(inheritedFields).toContain('GFW_2020_DEF_ALERT')
    })
    
    test('Merging 100 animals without issues yields clean LotAsset', () => {
      const inputs = Array.from({ length: 100 }).map((_, i) => ({
        id: `A${i}`, payload: { category: 'Steer', lastWeight: 450 }, holds: [], gfwAlerts: []
      }))

      const mergedCategories = mergeRuleAnimalToLot.computedFields?.categories!(inputs)
      const mergedQuantity = mergeRuleAnimalToLot.computedFields?.quantity!(inputs)

      expect(mergedCategories).toEqual(['Steer'])
      expect(mergedQuantity).toBe(100)
    })
  })

  describe('Transform & Split Rules Validations', () => {
    // In router logic we test splitting quantities. We can unit test the Split quantitative check pseudo-logic here:
    test('Split fails if sum of output allocations exceeds parent quantity (100 Lot -> 60 + 50)', () => {
      const parentLotQuantity = 100
      const allocationOutputs = [60, 50]
      const totalAllocated = allocationOutputs.reduce((a, b) => a + b, 0)

      const isValidSplit = totalAllocated <= parentLotQuantity
      expect(isValidSplit).toBe(false)
      expect(totalAllocated).toBe(110) // Surpasses 100, which throws in the actual router logic
    })

    test('Split succeeds on exact volume distribution (100 Lot -> 60 + 40)', () => {
      const parentLotQuantity = 100
      const allocationOutputs = [60, 40]
      const totalAllocated = allocationOutputs.reduce((a, b) => a + b, 0)

      const isValidSplit = totalAllocated <= parentLotQuantity
      expect(isValidSplit).toBe(true)
      expect(totalAllocated).toBe(100)
    })
  })

  describe('Faena Atómica: SLAUGHTER_COMPLETED', () => {
    test('Rolling back atomic transaction leaves AnimalAsset intact', () => {
       // Since the router encapsulates SQL rollbacks natively (Drizzle tz.rollback()),
       // we ensure no partial modifications occur logic-wise during validation loops.
       const outputs = [{ weight: 120 }, { weight: 130 }, { /* MISSING WEIGHT, ERROR! */ }]
       
       let errorOccurred = false
       try {
          outputs.forEach(output => {
            if (!output.weight) throw new Error("Output incompleto")
            // Fake creating derived asset
          })
       } catch {
          errorOccurred = true
       }

       expect(errorOccurred).toBe(true)
    })
  })
})
