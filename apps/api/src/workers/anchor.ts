import { Queue, Worker } from 'bullmq';
import { redis } from '../redis';
import { db } from '@biffco/db';
import { MerkleTree } from '@biffco/core/crypto';
import { polygonProvider } from './polygon-provider';
import { domainEvents, anchorsLog, anchoredEvents, workspaces } from '@biffco/db/schema';
import { eq, isNull, and, sql } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

export const anchorQueue = new Queue('anchor', { connection: redis as any });

if (!process.env.SKIP_WORKER) {
  // ─── Worker ───────────────────────────────────────────────────
  new Worker('anchor', async (job) => {
    const { workspaceId, batchId } = job.data;
    console.info(`[AnchorJob] Evaluando workspace: ${workspaceId} para batchId: ${batchId}`);

    // 1. Obtener eventos que NO están en la tabla anchoredEvents para este workspace
    // Hacemos un anti-join con anchoredEvents
    const pendingEvents = await db.select()
      .from(domainEvents)
      .leftJoin(anchoredEvents, eq(domainEvents.id, anchoredEvents.eventId))
      .where(and(
        eq(domainEvents.workspaceId, workspaceId),
        isNull(anchoredEvents.anchorId) // Solo eventos sin anclar
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

    const tree = new MerkleTree(hashes);
    const merkleRoot = tree.getRoot();

    // 3. Idempotencia: ¿Ya existe el batchId?
    const existing = await db.query.anchorsLog.findFirst({
      where: eq(anchorsLog.id, batchId)
    });

    if (existing) {
      console.info(`[AnchorJob] batchId ${batchId} ya fue anclado (${existing.polygonTxHash}). Skip.`);
      return;
    }

    // 4. Anclar en Polygon
    const txHash = await polygonProvider.anchor(merkleRoot, batchId);

    // 5. Guardar el Anchor Log
    await db.insert(anchorsLog).values({
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
    await db.insert(anchoredEvents).values(anchoredRelations);

    console.info(`[AnchorJob] Anclado con éxito. txHash: ${txHash}`);

  }, { connection: redis as any });

  // ─── Scheduler ─────────────────────────────────────────────────
  // Revisa eventos pendientes cada 5 minutos
  setInterval(async () => {
    try {
      // Buscar todos los workspaces que tengan al menos 1 evento sin anclar
      const workspacesWithPending = await db
        .selectDistinct({ workspaceId: domainEvents.workspaceId })
        .from(domainEvents)
        .leftJoin(anchoredEvents, eq(domainEvents.id, anchoredEvents.eventId))
        .where(isNull(anchoredEvents.anchorId));

      for (const row of workspacesWithPending) {
        await anchorQueue.add('anchor', {
          workspaceId: row.workspaceId,
          batchId: `anchor_${row.workspaceId}_${Date.now()}`
        });
      }
    } catch (err) {
      console.error("[AnchorScheduler ERROR]", err);
    }
  }, 5 * 60 * 1000);
}
