/**
 * Serializa un objeto a JSON con las keys en orden alfabético.
 * Resultado: siempre el mismo string para el mismo objeto,
 * independientemente del orden en que las keys fueron definidas.
 *
 * CRÍTICO: Esta función se usa antes de firmar cualquier DomainEvent.
 * Cambiarla post-producción invalida todas las firmas existentes.
 */
export declare function canonicalJson(obj: unknown): string;
//# sourceMappingURL=canonical-json.d.ts.map