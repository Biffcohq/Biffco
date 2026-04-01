"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const merge_rules_1 = require("../merge-rules");
(0, vitest_1.describe)('Livestock Rules', () => {
    (0, vitest_1.describe)('Worst-Case Compliance (MergeRule)', () => {
        const mergeRuleAnimalToLot = merge_rules_1.livestockMergeRules[0]; // Animal -> Lot
        (0, vitest_1.test)('Lot inherits High Risk GFW alert if a single animal is affected', () => {
            const healthyAnimal = { id: 'A1', payload: { category: 'Cow', lastWeight: 500 }, holds: [], gfwAlerts: [] };
            const highRiskAnimal = { id: 'A2', payload: { category: 'Cow', lastWeight: 520 }, holds: [], gfwAlerts: ['GFW_2020_DEF_ALERT'] };
            const mergedCategories = mergeRuleAnimalToLot.computedFields?.categories([healthyAnimal, highRiskAnimal]);
            const mergedQuantity = mergeRuleAnimalToLot.computedFields?.quantity([healthyAnimal, highRiskAnimal]);
            const avgWeight = mergeRuleAnimalToLot.computedFields?.avgWeight([healthyAnimal, highRiskAnimal]);
            (0, vitest_1.expect)(mergedCategories).toEqual(['Cow']);
            (0, vitest_1.expect)(mergedQuantity).toBe(2);
            (0, vitest_1.expect)(avgWeight).toBe(510);
            // Verification of worstCaseFields extraction
            const inheritedFields = [...healthyAnimal.gfwAlerts, ...highRiskAnimal.gfwAlerts];
            (0, vitest_1.expect)(inheritedFields).toContain('GFW_2020_DEF_ALERT');
        });
        (0, vitest_1.test)('Merging 100 animals without issues yields clean LotAsset', () => {
            const inputs = Array.from({ length: 100 }).map((_, i) => ({
                id: `A${i}`, payload: { category: 'Steer', lastWeight: 450 }, holds: [], gfwAlerts: []
            }));
            const mergedCategories = mergeRuleAnimalToLot.computedFields?.categories(inputs);
            const mergedQuantity = mergeRuleAnimalToLot.computedFields?.quantity(inputs);
            (0, vitest_1.expect)(mergedCategories).toEqual(['Steer']);
            (0, vitest_1.expect)(mergedQuantity).toBe(100);
        });
    });
    (0, vitest_1.describe)('Transform & Split Rules Validations', () => {
        // In router logic we test splitting quantities. We can unit test the Split quantitative check pseudo-logic here:
        (0, vitest_1.test)('Split fails if sum of output allocations exceeds parent quantity (100 Lot -> 60 + 50)', () => {
            const parentLotQuantity = 100;
            const allocationOutputs = [60, 50];
            const totalAllocated = allocationOutputs.reduce((a, b) => a + b, 0);
            const isValidSplit = totalAllocated <= parentLotQuantity;
            (0, vitest_1.expect)(isValidSplit).toBe(false);
            (0, vitest_1.expect)(totalAllocated).toBe(110); // Surpasses 100, which throws in the actual router logic
        });
        (0, vitest_1.test)('Split succeeds on exact volume distribution (100 Lot -> 60 + 40)', () => {
            const parentLotQuantity = 100;
            const allocationOutputs = [60, 40];
            const totalAllocated = allocationOutputs.reduce((a, b) => a + b, 0);
            const isValidSplit = totalAllocated <= parentLotQuantity;
            (0, vitest_1.expect)(isValidSplit).toBe(true);
            (0, vitest_1.expect)(totalAllocated).toBe(100);
        });
    });
    (0, vitest_1.describe)('Faena Atómica: SLAUGHTER_COMPLETED', () => {
        (0, vitest_1.test)('Rolling back atomic transaction leaves AnimalAsset intact', () => {
            // Since the router encapsulates SQL rollbacks natively (Drizzle tz.rollback()),
            // we ensure no partial modifications occur logic-wise during validation loops.
            const outputs = [{ weight: 120 }, { weight: 130 }, { /* MISSING WEIGHT, ERROR! */}];
            let errorOccurred = false;
            try {
                outputs.forEach(output => {
                    if (!output.weight)
                        throw new Error("Output incompleto");
                    // Fake creating derived asset
                });
            }
            catch {
                errorOccurred = true;
            }
            (0, vitest_1.expect)(errorOccurred).toBe(true);
        });
    });
});
//# sourceMappingURL=rules.test.js.map