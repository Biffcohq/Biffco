import type { VerticalPack, VerticalRules } from './vertical-pack'
import { ok, err, type Result } from '@biffco/shared'

export class VerticalRegistry {
  private packs: Map<string, VerticalPack> = new Map()

  /**
   * Registra un paquete de industria (por ej. bif-bovine)
   * Falla si ya existe un paquete con el mismo ID para prevenir choques o secuestros.
   */
  registerPack(pack: VerticalPack): Result<void, string> {
    if (this.packs.has(pack.id)) {
      return err(`El VerticalPack '${pack.id}' ya se encuentra registrado.`)
    }
    
    // Verificación superficial de permisos
    const invalidPerms = pack.customPermissions.filter(p => typeof p !== 'string' || p.trim() === '')
    if (invalidPerms.length > 0) {
      return err(`El VerticalPack '${pack.id}' aporta permisos inválidos o vacíos.`)
    }

    this.packs.set(pack.id, pack)
    return ok(undefined)
  }

  /**
   * Obtiene un paquete registrado por su ID.
   */
  getPack(id: string): VerticalPack | null {
    return this.packs.get(id) ?? null
  }

  /**
   * Devuelve absolutamente todos los permisos base y custom
   * unificados y deduplicados de todos los packs instalados.
   */
  getAllPermissions(basePermissions: readonly string[]): string[] {
    const all = new Set<string>(basePermissions)

    for (const pack of this.packs.values()) {
      for (const customPerm of pack.customPermissions) {
        all.add(customPerm)
      }
    }

    return Array.from(all)
  }

  /**
   * Devuelve un arreglo consolidado con todas las funciones Validadoras (Hooks)
   * que deben correr antes del EventStore append.
   */
  getAllRules(): VerticalRules[] {
    return Array.from(this.packs.values()).map(p => p.rules)
  }

  /**
   * Alias de registerPack para compatibilidad web
   */
  register(pack: VerticalPack) {
    this.registerPack(pack)
  }

  /**
   * Alias de getPack para api
   */
  get(id: string) {
    return this.getPack(id)
  }

  /**
   * Listar verticales instaladas
   */
  listPacks(): VerticalPack[] {
    return Array.from(this.packs.values())
  }
}

// Global default instance used by API
export const verticalRegistry = new VerticalRegistry()
