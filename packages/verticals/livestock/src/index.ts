/* global console */

import type { VerticalPack, VerticalRules } from '@biffco/core/vertical-engine'

import { livestockActorTypes } from './actor-types'
import { livestockAssetTypes } from './asset-types'
import { livestockEventCatalog } from './events'
import { livestockTransformRules } from './transform-rules'
import { livestockSplitRules } from './split-rules'
import { livestockMergeRules } from './merge-rules'

// Motor de reglas de negocio para Livestock
const livestockRules: VerticalRules = {
  validateEvent: async () => {
    // Aquí podemos interceptar validaciones cross-vertical adicionales si hiciera falta.
    // Por ahora confíamos en el schema estricto de Zod.
    return { ok: true }
  },
}

// Extensión informal de VerticalPack temporalmente hasta que el Core incluya tipajes estrictos integrando assets y eventos
export interface LivestockVerticalPack extends VerticalPack {
  eventCatalog: typeof livestockEventCatalog
  assetTypes: typeof livestockAssetTypes
  actorTypesMap?: typeof livestockActorTypes
  labels: Record<string, string>
  transformRules: typeof livestockTransformRules
  splitRules: typeof livestockSplitRules
  mergeRules: typeof livestockMergeRules
}

export const livestockVerticalPack: LivestockVerticalPack = {
  id: 'bif-bovine-ar',
  name: 'Ganadería Bovina',
  version: '0.1.0',
  customPermissions: [], // Los livestock usan por defecto los abstractos del Core (vistos en actor-types.ts)
  
  // Mapeamos los Actores a lo esperado por Core UI (id, name)
  actorTypes: livestockActorTypes.map(actor => ({ id: actor.id, name: actor.name })),
  
  // Injectamos nuestra arquitectura de negocio a objeto vertical
  actorTypesMap: livestockActorTypes,
  eventCatalog: livestockEventCatalog,
  assetTypes: livestockAssetTypes,
  transformRules: livestockTransformRules,
  splitRules: livestockSplitRules,
  mergeRules: livestockMergeRules,
  
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
    console.log('[Livestock Pack] Engine inicializado correctamente.')
  },
}

// Exportación central de todos los submódulos por si los necesita un middleware directo
export * from './actor-types'
export * from './asset-types'
export * from './events'
export * from './transform-rules'
export * from './split-rules'
export * from './merge-rules'
