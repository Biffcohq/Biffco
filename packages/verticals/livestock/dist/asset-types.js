"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.livestockAssetTypes = exports.derivedAssetSchema = exports.DerivedAssetCategory = exports.lotAssetSchema = exports.animalAssetSchema = void 0;
const zod_1 = require("zod");
// ------------------------------------------------------------------
// 1. AnimalAsset (Trazabilidad individual estricta)
// ------------------------------------------------------------------
exports.animalAssetSchema = zod_1.z.object({
    species: zod_1.z.literal('bovine'),
    sex: zod_1.z.enum(['M', 'F']),
    breed: zod_1.z.string().min(1).optional(),
    dateOfBirth: zod_1.z.string().datetime().optional(), // opcional si se hace onboard de animal adulto
    rfid: zod_1.z.string().min(3),
});
// ------------------------------------------------------------------
// 2. LotAsset (Trazabilidad grupal indivisible, ej. tropas de cría)
// ------------------------------------------------------------------
exports.lotAssetSchema = zod_1.z.object({
    headCount: zod_1.z.number().int().min(1),
    averageWeightKg: zod_1.z.number().positive().optional(),
    description: zod_1.z.string().optional(),
});
// ------------------------------------------------------------------
// 3. DerivedAsset (Resultado atómico de la Transformación: Faena)
// ------------------------------------------------------------------
// Enumeración estricta a pedido del usuario, preparada para extensión.
exports.DerivedAssetCategory = zod_1.z.enum([
    'media_res',
    'cuarto_delantero',
    'cuarto_trasero',
    'costillar',
    'cuadril',
    'ojo_de_bife',
    'lomo',
    'cuero',
    'menudencias',
    'cabeza',
    'garrón',
]);
exports.derivedAssetSchema = zod_1.z.object({
    category: exports.DerivedAssetCategory,
    weightKg: zod_1.z.number().positive(),
    qualityGrade: zod_1.z.string().optional(), // ej. "Novillito JJ" o tipificación USDA/EUROP
    productionDate: zod_1.z.string().datetime(),
});
// ------------------------------------------------------------------
// EXPORT COMPLETO DE ASSET TYPES
// ------------------------------------------------------------------
exports.livestockAssetTypes = [
    {
        id: 'AnimalAsset',
        name: 'Animal',
        geoRequired: true, // EUDR compliance requiere polígono desde el origen
        schema: exports.animalAssetSchema,
    },
    {
        id: 'LotAsset',
        name: 'Lote de Animales',
        geoRequired: true, // EUDR compliance requiere polígono desde el origen
        schema: exports.lotAssetSchema,
    },
    {
        id: 'DerivedAsset',
        name: 'Corte Derivado',
        geoRequired: false, // El polígono EUDR se deduce por DAG visualizer de sus parentAssetIds, no tiene coordenadas propias tras salir del matadero.
        schema: exports.derivedAssetSchema,
    },
];
//# sourceMappingURL=asset-types.js.map