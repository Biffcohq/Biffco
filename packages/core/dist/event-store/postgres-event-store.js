"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresEventStore = void 0;
const ed25519_1 = require("../crypto/ed25519");
const shared_1 = require("@biffco/shared");
class PostgresEventStore {
    db;
    hooks;
    constructor(db, hooks) {
        this.db = db;
        this.hooks = hooks;
    }
    /**
     * Persiste un evento si y solo si la firma es válida.
     * NUNCA persiste un evento con firma inválida.
     *
     * @returns ok(void) si el evento fue persistido
     * @returns err("INVALID_SIGNATURE") si la firma es inválida
     */
    async append(event) {
        // 1. Reconstruir el payload firmable desde el evento
        const signable = {
            type: event.type,
            schemaVersion: event.schemaVersion,
            assetId: event.assetId,
            workspaceId: event.workspaceId,
            actorId: event.actorId,
            occurredAt: event.occurredAt.toISOString(),
            payload: event.payload,
        };
        // 2. Verificar la firma
        const isValid = await (0, ed25519_1.verifyEvent)(signable, event.signature, event.publicKey);
        if (!isValid) {
            return (0, shared_1.err)("INVALID_SIGNATURE");
        }
        // 2.5 Ejecutar Hooks del VerticalEngine antes de persistir
        if (this.hooks) {
            const hookResult = await this.hooks.beforeOperation(event);
            if (!hookResult.ok) {
                return (0, shared_1.err)("HOOK_REJECTED");
            }
        }
        // 3. Persistir
        try {
            await this.db.insertEvent(event);
            if (this.hooks) {
                await this.hooks.afterOperation(event);
            }
            return (0, shared_1.ok)(undefined);
        }
        catch (e) {
            return (0, shared_1.err)("DB_ERROR");
        }
    }
    /**
     * Todos los eventos de un asset, en orden cronológico.
     */
    async getByAssetId(assetId, workspaceId) {
        return this.db.getEventsByAssetId(assetId, workspaceId);
    }
    /**
     * Replay del Event Store completo de un Workspace.
     * Determinístico: 3 ejecuciones con los mismos datos = mismo resultado.
     * El orden es: occurredAt ASC, luego createdAt ASC (para desempate).
     */
    async replay(workspaceId) {
        const events = await this.db.getAllEventsByWorkspace(workspaceId);
        // Ordenar por occurredAt, luego por createdAt para desempate
        return [...events].sort((a, b) => {
            const diff = a.occurredAt.getTime() - b.occurredAt.getTime();
            if (diff !== 0)
                return diff;
            return a.createdAt.getTime() - b.createdAt.getTime();
        });
    }
    /**
     * Todos los assets que tienen este asset en sus parentIds.
     * Usa el índice GIN en la columna parentIds[] para < 200ms con 10k assets.
     */
    async getDescendants(_assetId, _workspaceId) {
        // Esta query se implementa en packages/db con el índice GIN
        // El Core define la interface; la implementación vive en la capa de DB
        throw new Error("Implementar con índice GIN en packages/db");
    }
    /**
     * Reconstruye el árbol de ancestros del asset desde sus parentIds.
     */
    async getAncestors(assetId, workspaceId) {
        const asset = await this.db.getAssetById(assetId, workspaceId);
        if (!asset)
            return [];
        const ancestors = [];
        for (const parentId of asset.parentIds) {
            ancestors.push(parentId);
            const parentAncestors = await this.getAncestors(parentId, workspaceId);
            ancestors.push(...parentAncestors);
        }
        return ancestors;
    }
}
exports.PostgresEventStore = PostgresEventStore;
//# sourceMappingURL=postgres-event-store.js.map