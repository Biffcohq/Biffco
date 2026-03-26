"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canonicalJson = canonicalJson;
/**
 * Serializa un objeto a JSON con las keys en orden alfabético.
 * Resultado: siempre el mismo string para el mismo objeto,
 * independientemente del orden en que las keys fueron definidas.
 *
 * CRÍTICO: Esta función se usa antes de firmar cualquier DomainEvent.
 * Cambiarla post-producción invalida todas las firmas existentes.
 */
function canonicalJson(obj) {
    return JSON.stringify(obj, sortedReplacer);
}
function sortedReplacer(_key, value) {
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
        return Object.fromEntries(Object.entries(value)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([k, v]) => [k, v]));
    }
    return value;
}
//# sourceMappingURL=canonical-json.js.map