import type { VerticalPack, VerticalRules } from './vertical-pack';
import { type Result } from '@biffco/shared';
export declare class VerticalRegistry {
    private packs;
    /**
     * Registra un paquete de industria (por ej. bif-bovine)
     * Falla si ya existe un paquete con el mismo ID para prevenir choques o secuestros.
     */
    registerPack(pack: VerticalPack): Result<void, string>;
    /**
     * Obtiene un paquete registrado por su ID.
     */
    getPack(id: string): VerticalPack | null;
    /**
     * Devuelve absolutamente todos los permisos base y custom
     * unificados y deduplicados de todos los packs instalados.
     */
    getAllPermissions(basePermissions: readonly string[]): string[];
    /**
     * Devuelve un arreglo consolidado con todas las funciones Validadoras (Hooks)
     * que deben correr antes del EventStore append.
     */
    getAllRules(): VerticalRules[];
    /**
     * Alias de registerPack para compatibilidad web
     */
    register(pack: VerticalPack): void;
    /**
     * Alias de getPack para api
     */
    get(id: string): VerticalPack | null;
    /**
     * Listar verticales instaladas
     */
    listPacks(): VerticalPack[];
}
export declare const verticalRegistry: VerticalRegistry;
//# sourceMappingURL=registry.d.ts.map