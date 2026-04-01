"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const asset_types_1 = require("../asset-types");
(0, vitest_1.describe)('Livestock Asset Types Definition', () => {
    (0, vitest_1.it)('should export exactly 3 asset types', () => {
        (0, vitest_1.expect)(asset_types_1.livestockAssetTypes.length).toBe(3);
        const activeIds = asset_types_1.livestockAssetTypes.map((a) => a.id);
        (0, vitest_1.expect)(activeIds).toEqual(vitest_1.expect.arrayContaining(['AnimalAsset', 'LotAsset', 'DerivedAsset']));
    });
    // 1. AnimalAsset schema validation
    (0, vitest_1.describe)('AnimalAsset Schema', () => {
        const validAnimal = {
            species: 'bovine',
            sex: 'M',
            breed: 'Angus',
            dateOfBirth: new Date().toISOString(),
            rfid: '032-987654321',
        };
        (0, vitest_1.it)('should pass on a fully valid AnimalAsset payload', () => {
            (0, vitest_1.expect)(() => asset_types_1.animalAssetSchema.parse(validAnimal)).not.toThrow();
        });
        (0, vitest_1.it)('should throw if species is NOT bovine', () => {
            (0, vitest_1.expect)(() => asset_types_1.animalAssetSchema.parse({ ...validAnimal, species: 'porcine' })).toThrow();
        });
        (0, vitest_1.it)('should pass if breed is omitted', () => {
            const { breed, ...noBreed } = validAnimal;
            (0, vitest_1.expect)(() => asset_types_1.animalAssetSchema.parse(noBreed)).not.toThrow();
        });
        (0, vitest_1.it)('should throw if RFID is too short', () => {
            (0, vitest_1.expect)(() => asset_types_1.animalAssetSchema.parse({ ...validAnimal, rfid: 'AB' })).toThrow();
        });
        (0, vitest_1.it)('should have geoRequired set to true', () => {
            const def = asset_types_1.livestockAssetTypes.find((a) => a.id === 'AnimalAsset');
            (0, vitest_1.expect)(def?.geoRequired).toBe(true);
        });
    });
    // 2. LotAsset schema validation
    (0, vitest_1.describe)('LotAsset Schema', () => {
        const validLot = {
            headCount: 45,
            averageWeightKg: 290.5,
            description: 'Lote destete recría 1',
        };
        (0, vitest_1.it)('should pass on a fully valid LotAsset payload', () => {
            (0, vitest_1.expect)(() => asset_types_1.lotAssetSchema.parse(validLot)).not.toThrow();
        });
        (0, vitest_1.it)('should throw if headCount is less than 1 or not an integer', () => {
            (0, vitest_1.expect)(() => asset_types_1.lotAssetSchema.parse({ ...validLot, headCount: 0 })).toThrow();
            (0, vitest_1.expect)(() => asset_types_1.lotAssetSchema.parse({ ...validLot, headCount: 15.5 })).toThrow();
        });
        (0, vitest_1.it)('should have geoRequired set to true', () => {
            const def = asset_types_1.livestockAssetTypes.find((a) => a.id === 'LotAsset');
            (0, vitest_1.expect)(def?.geoRequired).toBe(true);
        });
    });
    // 3. DerivedAsset schema validation
    (0, vitest_1.describe)('DerivedAsset Schema', () => {
        const validDerived = {
            category: 'cuero',
            weightKg: 45.2,
            qualityGrade: 'A',
            productionDate: new Date().toISOString(),
        };
        (0, vitest_1.it)('should pass on a valid DerivedAsset of allowed category', () => {
            (0, vitest_1.expect)(() => asset_types_1.derivedAssetSchema.parse(validDerived)).not.toThrow();
        });
        (0, vitest_1.it)('should pass for multiple valid categories from the strict enum', () => {
            const testCases = ['media_res', 'ojo_de_bife', 'menudencias', 'garrón'];
            for (const category of testCases) {
                (0, vitest_1.expect)(() => asset_types_1.derivedAssetSchema.parse({ ...validDerived, category })).not.toThrow();
            }
        });
        (0, vitest_1.it)('should throw if category is absolutely invalid', () => {
            (0, vitest_1.expect)(() => asset_types_1.derivedAssetSchema.parse({ ...validDerived, category: 'cuerno' })).toThrow();
        });
        (0, vitest_1.it)('should throw if weightKg is negative', () => {
            (0, vitest_1.expect)(() => asset_types_1.derivedAssetSchema.parse({ ...validDerived, weightKg: -5 })).toThrow();
        });
        (0, vitest_1.it)('should have geoRequired set to false', () => {
            const def = asset_types_1.livestockAssetTypes.find((a) => a.id === 'DerivedAsset');
            (0, vitest_1.expect)(def?.geoRequired).toBe(false);
        });
    });
});
//# sourceMappingURL=asset-types.test.js.map