import type { AssetId, WorkspaceId } from '@biffco/shared';
import type { DomainEvent } from '../domain/event';
import type { Result } from '@biffco/shared';
export type EventStoreError = "INVALID_SIGNATURE" | "ASSET_NOT_FOUND" | "DB_ERROR" | "EVENT_NOT_FOUND" | "HOOK_REJECTED";
export interface EventStoreDb {
    insertEvent(event: DomainEvent): Promise<void>;
    getEventsByAssetId(assetId: AssetId, workspaceId: WorkspaceId): Promise<DomainEvent[]>;
    getAllEventsByWorkspace(workspaceId: WorkspaceId): Promise<DomainEvent[]>;
    getAssetById(assetId: AssetId, workspaceId: WorkspaceId): Promise<{
        parentIds: AssetId[];
    } | null>;
}
export interface VerticalHooks {
    beforeOperation(event: DomainEvent): Promise<Result<void, string>>;
    afterOperation(event: DomainEvent): Promise<void>;
}
export declare class PostgresEventStore {
    private readonly db;
    private readonly hooks?;
    constructor(db: EventStoreDb, hooks?: VerticalHooks | undefined);
    /**
     * Persiste un evento si y solo si la firma es válida.
     * NUNCA persiste un evento con firma inválida.
     *
     * @returns ok(void) si el evento fue persistido
     * @returns err("INVALID_SIGNATURE") si la firma es inválida
     */
    append(event: DomainEvent): Promise<Result<void, EventStoreError>>;
    /**
     * Todos los eventos de un asset, en orden cronológico.
     */
    getByAssetId(assetId: AssetId, workspaceId: WorkspaceId): Promise<DomainEvent[]>;
    /**
     * Replay del Event Store completo de un Workspace.
     * Determinístico: 3 ejecuciones con los mismos datos = mismo resultado.
     * El orden es: occurredAt ASC, luego createdAt ASC (para desempate).
     */
    replay(workspaceId: WorkspaceId): Promise<DomainEvent[]>;
    /**
     * Todos los assets que tienen este asset en sus parentIds.
     * Usa el índice GIN en la columna parentIds[] para < 200ms con 10k assets.
     */
    getDescendants(_assetId: AssetId, _workspaceId: WorkspaceId): Promise<string[]>;
    /**
     * Reconstruye el árbol de ancestros del asset desde sus parentIds.
     */
    getAncestors(assetId: AssetId, workspaceId: WorkspaceId): Promise<AssetId[]>;
}
//# sourceMappingURL=postgres-event-store.d.ts.map