"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.anchorQueue = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../redis");
const db_1 = require("@biffco/db");
const crypto_1 = require("@biffco/core/crypto");
const polygon_provider_1 = require("./polygon-provider");
const schema_1 = require("@biffco/db/schema");
const db_2 = require("@biffco/db");
exports.anchorQueue = new bullmq_1.Queue('anchor', { connection: redis_1.redis });
if (!process.env.SKIP_WORKER) {
    // ─── Worker ───────────────────────────────────────────────────
    new bullmq_1.Worker('anchor', async (job) => {
        const { workspaceId, batchId } = job.data;
        console.info(`[AnchorJob] Evaluando workspace: ${workspaceId} para batchId: ${batchId}`);
        // 1. Obtener eventos que NO están en la tabla anchoredEvents para este workspace
        // Hacemos un anti-join con anchoredEvents
        const pendingEvents = await db_1.db.select()
            .from(schema_1.domainEvents)
            .leftJoin(schema_1.anchoredEvents, (0, db_2.eq)(schema_1.domainEvents.id, schema_1.anchoredEvents.eventId))
            .where((0, db_2.and)((0, db_2.eq)(schema_1.domainEvents.workspaceId, workspaceId), (0, db_2.isNull)(schema_1.anchoredEvents.anchorId) // Solo eventos sin anclar
        ))
            .limit(100);
        if (pendingEvents.length === 0) {
            console.info(`[AnchorJob] Workspace ${workspaceId}: no hay eventos pendientes.`);
            return;
        }
        // 2. Construir el árbol de Merkle
        const eventIds = pendingEvents.map(row => row.domain_events.id);
        const hashes = pendingEvents.map(row => row.domain_events.hash);
        console.info(`[AnchorJob] Workspace ${workspaceId}: anclando ${eventIds.length} eventos.`);
        const tree = new crypto_1.MerkleTree(hashes);
        const merkleRoot = tree.getRoot();
        // 3. Idempotencia: ¿Ya existe el batchId?
        const existing = await db_1.db.query.anchorsLog.findFirst({
            where: (0, db_2.eq)(schema_1.anchorsLog.id, batchId)
        });
        if (existing) {
            console.info(`[AnchorJob] batchId ${batchId} ya fue anclado (${existing.polygonTxHash}). Skip.`);
            return;
        }
        // 4. Anclar en Polygon
        const txHash = await polygon_provider_1.polygonProvider.anchor(merkleRoot, batchId);
        // 5. Guardar el Anchor Log
        await db_1.db.insert(schema_1.anchorsLog).values({
            id: batchId,
            workspaceId,
            polygonTxHash: txHash,
            merkleRoot,
            eventsCount: String(eventIds.length),
            network: 'polygon-amoy',
            status: 'confirmed',
        });
        // 6. Relacionar en anchoredEvents de forma inmutable
        const anchoredRelations = eventIds.map(eventId => ({
            eventId,
            anchorId: batchId
        }));
        await db_1.db.insert(schema_1.anchoredEvents).values(anchoredRelations);
        console.info(`[AnchorJob] Anclado con éxito. txHash: ${txHash}`);
    }, { connection: redis_1.redis });
    // ─── Scheduler ─────────────────────────────────────────────────
    // Revisa eventos pendientes cada 5 minutos
    setInterval(async () => {
        try {
            // Buscar todos los workspaces que tengan al menos 1 evento sin anclar
            const workspacesWithPending = await db_1.db
                .selectDistinct({ workspaceId: schema_1.domainEvents.workspaceId })
                .from(schema_1.domainEvents)
                .leftJoin(schema_1.anchoredEvents, (0, db_2.eq)(schema_1.domainEvents.id, schema_1.anchoredEvents.eventId))
                .where((0, db_2.isNull)(schema_1.anchoredEvents.anchorId));
            for (const row of workspacesWithPending) {
                await exports.anchorQueue.add('anchor', {
                    workspaceId: row.workspaceId,
                    batchId: `anchor_${row.workspaceId}_${Date.now()}`
                });
            }
        }
        catch (err) {
            console.error("[AnchorScheduler ERROR]", err);
        }
    }, 5 * 60 * 1000);
}
//# sourceMappingURL=anchor.js.map