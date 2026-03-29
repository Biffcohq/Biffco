"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verticalRegistry = exports.VerticalRegistry = void 0;
const shared_1 = require("@biffco/shared");
class VerticalRegistry {
    packs = new Map();
    /**
     * Registra un paquete de industria (por ej. bif-bovine)
     * Falla si ya existe un paquete con el mismo ID para prevenir choques o secuestros.
     */
    registerPack(pack) {
        if (this.packs.has(pack.id)) {
            return (0, shared_1.err)(`El VerticalPack '${pack.id}' ya se encuentra registrado.`);
        }
        // Verificación superficial de permisos
        const invalidPerms = pack.customPermissions.filter(p => typeof p !== 'string' || p.trim() === '');
        if (invalidPerms.length > 0) {
            return (0, shared_1.err)(`El VerticalPack '${pack.id}' aporta permisos inválidos o vacíos.`);
        }
        this.packs.set(pack.id, pack);
        return (0, shared_1.ok)(undefined);
    }
    /**
     * Obtiene un paquete registrado por su ID.
     */
    getPack(id) {
        return this.packs.get(id) ?? null;
    }
    /**
     * Devuelve absolutamente todos los permisos base y custom
     * unificados y deduplicados de todos los packs instalados.
     */
    getAllPermissions(basePermissions) {
        const all = new Set(basePermissions);
        for (const pack of this.packs.values()) {
            for (const customPerm of pack.customPermissions) {
                all.add(customPerm);
            }
        }
        return Array.from(all);
    }
    /**
     * Devuelve un arreglo consolidado con todas las funciones Validadoras (Hooks)
     * que deben correr antes del EventStore append.
     */
    getAllRules() {
        return Array.from(this.packs.values()).map(p => p.rules);
    }
    /**
     * Alias de registerPack para compatibilidad web
     */
    register(pack) {
        this.registerPack(pack);
    }
    /**
     * Alias de getPack para api
     */
    get(id) {
        return this.getPack(id);
    }
    /**
     * Listar verticales instaladas
     */
    listPacks() {
        return Array.from(this.packs.values());
    }
}
exports.VerticalRegistry = VerticalRegistry;
// Global default instance used by API
exports.verticalRegistry = new VerticalRegistry();
//# sourceMappingURL=registry.js.map