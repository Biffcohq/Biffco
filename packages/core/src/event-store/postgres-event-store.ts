import type { AssetId, WorkspaceId } from '@biffco/shared'
import type { DomainEvent, SignableEventPayload } from '../domain/event'
import { verifyEvent } from '../crypto/ed25519'
import type { Result } from '@biffco/shared'
import { ok, err } from '@biffco/shared'

export type EventStoreError =
  | "INVALID_SIGNATURE"
  | "ASSET_NOT_FOUND"
  | "DB_ERROR"
  | "EVENT_NOT_FOUND"
  | "HOOK_REJECTED"

// ─── El tipo de la DB (inyectado — no importamos @biffco/db aquí) ─
// El Core no puede importar packages/db directamente.
// La DB se inyecta via constructor.
export interface EventStoreDb {
  insertEvent(event: DomainEvent): Promise<void>
  getEventsByAssetId(assetId: AssetId, workspaceId: WorkspaceId): Promise<DomainEvent[]>
  getAllEventsByWorkspace(workspaceId: WorkspaceId): Promise<DomainEvent[]>
  getAssetById(assetId: AssetId, workspaceId: WorkspaceId): Promise<{ parentIds: AssetId[] } | null>
}

export interface VerticalHooks {
  beforeOperation(event: DomainEvent): Promise<Result<void, string>>
  afterOperation(event: DomainEvent): Promise<void>
}

export class PostgresEventStore {
  constructor(
    private readonly db: EventStoreDb,
    private readonly hooks?: VerticalHooks
  ) {}

  /**
   * Persiste un evento si y solo si la firma es válida.
   * NUNCA persiste un evento con firma inválida.
   *
   * @returns ok(void) si el evento fue persistido
   * @returns err("INVALID_SIGNATURE") si la firma es inválida
   */
  async append(event: DomainEvent): Promise<Result<void, EventStoreError>> {
    // 1. Reconstruir el payload firmable desde el evento
    const signable: SignableEventPayload = {
      type: event.type,
      schemaVersion: event.schemaVersion,
      assetId: event.assetId as string,
      workspaceId: event.workspaceId as string,
      actorId: event.actorId as string,
      occurredAt: event.occurredAt.toISOString(),
      payload: event.payload as Record<string, unknown>,
    }

    // 2. Verificar la firma
    const isValid = await verifyEvent(signable, event.signature, event.publicKey)
    if (!isValid) {
      return err("INVALID_SIGNATURE")
    }

    // 2.5 Ejecutar Hooks del VerticalEngine antes de persistir
    if (this.hooks) {
      const hookResult = await this.hooks.beforeOperation(event)
      if (!hookResult.ok) {
        return err("HOOK_REJECTED")
      }
    }

    // 3. Persistir
    try {
      await this.db.insertEvent(event)
      if (this.hooks) {
        await this.hooks.afterOperation(event)
      }
      return ok(undefined)
    } catch (e) {
      return err("DB_ERROR")
    }
  }

  /**
   * Todos los eventos de un asset, en orden cronológico.
   */
  async getByAssetId(
    assetId: AssetId,
    workspaceId: WorkspaceId,
  ): Promise<DomainEvent[]> {
    return this.db.getEventsByAssetId(assetId, workspaceId)
  }

  /**
   * Replay del Event Store completo de un Workspace.
   * Determinístico: 3 ejecuciones con los mismos datos = mismo resultado.
   * El orden es: occurredAt ASC, luego createdAt ASC (para desempate).
   */
  async replay(workspaceId: WorkspaceId): Promise<DomainEvent[]> {
    const events = await this.db.getAllEventsByWorkspace(workspaceId)
    // Ordenar por occurredAt, luego por createdAt para desempate
    return [...events].sort((a, b) => {
      const diff = a.occurredAt.getTime() - b.occurredAt.getTime()
      if (diff !== 0) return diff
      return a.createdAt.getTime() - b.createdAt.getTime()
    })
  }

  /**
   * Todos los assets que tienen este asset en sus parentIds.
   * Usa el índice GIN en la columna parentIds[] para < 200ms con 10k assets.
   */
  async getDescendants(_assetId: AssetId, _workspaceId: WorkspaceId): Promise<string[]> {
    // Esta query se implementa en packages/db con el índice GIN
    // El Core define la interface; la implementación vive en la capa de DB
    throw new Error("Implementar con índice GIN en packages/db")
  }

  /**
   * Reconstruye el árbol de ancestros del asset desde sus parentIds.
   */
  async getAncestors(assetId: AssetId, workspaceId: WorkspaceId): Promise<AssetId[]> {
    const asset = await this.db.getAssetById(assetId, workspaceId)
    if (!asset) return []

    const ancestors: AssetId[] = []
    for (const parentId of asset.parentIds) {
      ancestors.push(parentId)
      const parentAncestors = await this.getAncestors(parentId, workspaceId)
      ancestors.push(...parentAncestors)
    }
    return ancestors
  }
}
