import { z } from 'zod'

/** 
 * Interfaz genérica provista por el Core que define un tipo de Asset.
 * Lo copiamos o adaptamos estructuralmente para tipar los objetos aquí.
 */
export interface AssetTypeDefinition<T = any> {
  id: string
  name: string
  geoRequired: boolean
  schema: z.ZodSchema<T>
}

// ------------------------------------------------------------------
// 1. AnimalAsset (Trazabilidad individual estricta)
// ------------------------------------------------------------------
export const animalAssetSchema = z.object({
  species: z.literal('bovine'),
  sex: z.enum(['M', 'F']),
  breed: z.string().min(1).optional(),
  dateOfBirth: z.string().datetime().optional(), // opcional si se hace onboard de animal adulto
  rfid: z.string().min(3),
})

export type AnimalAssetPayload = z.infer<typeof animalAssetSchema>

// ------------------------------------------------------------------
// 2. LotAsset (Trazabilidad grupal indivisible, ej. tropas de cría)
// ------------------------------------------------------------------
export const lotAssetSchema = z.object({
  headCount: z.number().int().min(1),
  averageWeightKg: z.number().positive().optional(),
  description: z.string().optional(),
})

export type LotAssetPayload = z.infer<typeof lotAssetSchema>

// ------------------------------------------------------------------
// 3. DerivedAsset (Resultado atómico de la Transformación: Faena)
// ------------------------------------------------------------------
// Enumeración estricta a pedido del usuario, preparada para extensión.
export const DerivedAssetCategory = z.enum([
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
])

export const derivedAssetSchema = z.object({
  category: DerivedAssetCategory,
  weightKg: z.number().positive(),
  qualityGrade: z.string().optional(), // ej. "Novillito JJ" o tipificación USDA/EUROP
  productionDate: z.string().datetime(),
})

export type DerivedAssetPayload = z.infer<typeof derivedAssetSchema>

// ------------------------------------------------------------------
// EXPORT COMPLETO DE ASSET TYPES
// ------------------------------------------------------------------
export const livestockAssetTypes: AssetTypeDefinition[] = [
  {
    id: 'AnimalAsset',
    name: 'Animal',
    geoRequired: true, // EUDR compliance requiere polígono desde el origen
    schema: animalAssetSchema,
  },
  {
    id: 'LotAsset',
    name: 'Lote de Animales',
    geoRequired: true, // EUDR compliance requiere polígono desde el origen
    schema: lotAssetSchema,
  },
  {
    id: 'DerivedAsset',
    name: 'Corte Derivado',
    geoRequired: false, // El polígono EUDR se deduce por DAG visualizer de sus parentAssetIds, no tiene coordenadas propias tras salir del matadero.
    schema: derivedAssetSchema,
  },
]
