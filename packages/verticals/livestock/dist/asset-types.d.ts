import { z } from 'zod';
/**
 * Interfaz genérica provista por el Core que define un tipo de Asset.
 * Lo copiamos o adaptamos estructuralmente para tipar los objetos aquí.
 */
export interface AssetTypeDefinition<T = any> {
    id: string;
    name: string;
    geoRequired: boolean;
    schema: z.ZodSchema<T>;
}
export declare const animalAssetSchema: z.ZodObject<{
    species: z.ZodLiteral<"bovine">;
    sex: z.ZodEnum<["M", "F"]>;
    breed: z.ZodOptional<z.ZodString>;
    dateOfBirth: z.ZodOptional<z.ZodString>;
    rfid: z.ZodString;
}, "strip", z.ZodTypeAny, {
    species: "bovine";
    sex: "M" | "F";
    rfid: string;
    breed?: string | undefined;
    dateOfBirth?: string | undefined;
}, {
    species: "bovine";
    sex: "M" | "F";
    rfid: string;
    breed?: string | undefined;
    dateOfBirth?: string | undefined;
}>;
export type AnimalAssetPayload = z.infer<typeof animalAssetSchema>;
export declare const lotAssetSchema: z.ZodObject<{
    headCount: z.ZodNumber;
    averageWeightKg: z.ZodOptional<z.ZodNumber>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    headCount: number;
    averageWeightKg?: number | undefined;
    description?: string | undefined;
}, {
    headCount: number;
    averageWeightKg?: number | undefined;
    description?: string | undefined;
}>;
export type LotAssetPayload = z.infer<typeof lotAssetSchema>;
export declare const DerivedAssetCategory: z.ZodEnum<["media_res", "cuarto_delantero", "cuarto_trasero", "costillar", "cuadril", "ojo_de_bife", "lomo", "cuero", "menudencias", "cabeza", "garrón"]>;
export declare const derivedAssetSchema: z.ZodObject<{
    category: z.ZodEnum<["media_res", "cuarto_delantero", "cuarto_trasero", "costillar", "cuadril", "ojo_de_bife", "lomo", "cuero", "menudencias", "cabeza", "garrón"]>;
    weightKg: z.ZodNumber;
    qualityGrade: z.ZodOptional<z.ZodString>;
    productionDate: z.ZodString;
}, "strip", z.ZodTypeAny, {
    category: "media_res" | "cuarto_delantero" | "cuarto_trasero" | "costillar" | "cuadril" | "ojo_de_bife" | "lomo" | "cuero" | "menudencias" | "cabeza" | "garrón";
    weightKg: number;
    productionDate: string;
    qualityGrade?: string | undefined;
}, {
    category: "media_res" | "cuarto_delantero" | "cuarto_trasero" | "costillar" | "cuadril" | "ojo_de_bife" | "lomo" | "cuero" | "menudencias" | "cabeza" | "garrón";
    weightKg: number;
    productionDate: string;
    qualityGrade?: string | undefined;
}>;
export type DerivedAssetPayload = z.infer<typeof derivedAssetSchema>;
export declare const livestockAssetTypes: AssetTypeDefinition[];
//# sourceMappingURL=asset-types.d.ts.map