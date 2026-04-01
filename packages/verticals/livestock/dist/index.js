"use strict";
/* global console */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.livestockVerticalPack = void 0;
const actor_types_1 = require("./actor-types");
const asset_types_1 = require("./asset-types");
const events_1 = require("./events");
const transform_rules_1 = require("./transform-rules");
const split_rules_1 = require("./split-rules");
const merge_rules_1 = require("./merge-rules");
// Motor de reglas de negocio para Livestock
const livestockRules = {
    validateEvent: async () => {
        // Aquí podemos interceptar validaciones cross-vertical adicionales si hiciera falta.
        // Por ahora confíamos en el schema estricto de Zod.
        return { ok: true };
    },
};
exports.livestockVerticalPack = {
    id: 'bif-bovine-ar',
    name: 'Ganadería Bovina',
    version: '0.1.0',
    customPermissions: [], // Los livestock usan por defecto los abstractos del Core (vistos en actor-types.ts)
    // Mapeamos los Actores a lo esperado por Core UI (id, name)
    actorTypes: actor_types_1.livestockActorTypes.map(actor => ({ id: actor.id, name: actor.name })),
    // Injectamos nuestra arquitectura de negocio a objeto vertical
    actorTypesMap: actor_types_1.livestockActorTypes,
    eventCatalog: events_1.livestockEventCatalog,
    assetTypes: asset_types_1.livestockAssetTypes,
    transformRules: transform_rules_1.livestockTransformRules,
    splitRules: split_rules_1.livestockSplitRules,
    mergeRules: merge_rules_1.livestockMergeRules,
    // Etiquetas específicas de dominio ganadero para el dashboard genérico
    labels: {
        facility: 'Establecimiento',
        zone: 'Lote / Potrero',
        pen: 'Corral',
        asset: 'Animal',
        assetGroup: 'Tropa',
    },
    rules: livestockRules,
    async initialize() {
        console.log('[Livestock Pack] Engine inicializado correctamente.');
    },
};
// Exportación central de todos los submódulos por si los necesita un middleware directo
__exportStar(require("./actor-types"), exports);
__exportStar(require("./asset-types"), exports);
__exportStar(require("./events"), exports);
__exportStar(require("./transform-rules"), exports);
__exportStar(require("./split-rules"), exports);
__exportStar(require("./merge-rules"), exports);
//# sourceMappingURL=index.js.map