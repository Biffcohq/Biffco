/* eslint-disable no-unused-vars */
import type { DomainEvent } from '../domain/event'

export interface VerticalRules {
  /**
   * Evalúa las reglas de negocio específicas de la vertical (industria)
   * antes de que el evento sea persistido en el core.
   */
  validateEvent(event: DomainEvent): Promise<{ ok: boolean; error?: string }>
}

export interface VerticalPack {
  /** Identificador único del vertical (ej. "bif-bovine") */
  id: string
  
  /** Versión semántica del pack */
  version: string
  
  /** Nombre amigable */
  name: string
  
  /** Permisos adicionales específicos aportados por la vertical */
  customPermissions: readonly string[]
  
  /** Motor de reglas inyectables al Event Store (Hooks) */
  rules: VerticalRules
  
  /** Hook de inicialización del paquete vertical */
  initialize?(): Promise<void>
}

// ─── Registro Global de Verticales ────────────────────────────────
export const VerticalRegistry = {
  plugins: new Map<string, VerticalPack>(),
  register(pack: VerticalPack) {
    this.plugins.set(pack.id, pack)
  },
  get(id: string) {
    return this.plugins.get(id)
  }
}
