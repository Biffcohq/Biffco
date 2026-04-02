/* global console */
/* eslint-env node */
import { Queue, Worker } from 'bullmq';
import { redis } from '../redis';
import { db } from '@biffco/db';
import { transferOffers, assets } from '@biffco/db/schema';
import { lt, eq, and, inArray } from '@biffco/db';
import { TRANSFER_EXPIRATION_HOURS } from '../routers/transfers';

const EXPIRATION_QUEUE_NAME = 'expire-offers-queue';

export const expirationQueue = new Queue(EXPIRATION_QUEUE_NAME, {
  connection: redis,
});

export const expirationWorker = new Worker(
  EXPIRATION_QUEUE_NAME,
  async (job) => {
    console.log(`[BullMQ] Procesando job ${job.id} - Expiración de Transferencias`);

    const now = new Date();
    const expirationLimit = new Date(now.getTime() - TRANSFER_EXPIRATION_HOURS * 60 * 60 * 1000); // 72 horas

    // Transacción atómica directa para mutar offers 
    await db.transaction(async (tx) => {
        const expiredOffers = await tx.update(transferOffers)
            .set({ 
              status: 'expired', 
              resolvedAt: now 
            })
            .where(
              and(
                eq(transferOffers.status, 'pending'),
                lt(transferOffers.createdAt, expirationLimit) // expiradas por regla de TTL
              )
            )
            .returning({ id: transferOffers.id, assetId: transferOffers.assetId });

        if (expiredOffers.length > 0) {
            console.log(`[BullMQ] 🧹 Se limpiaron ${expiredOffers.length} ofertas expiradas.`);
            
            // Mitigación A-07 (Asset Lock Leak)
            const lockedAssetIds = expiredOffers.map(offer => offer.assetId);
            if (lockedAssetIds.length > 0) {
                await tx.update(assets)
                    .set({ status: 'active', updatedAt: now })
                    .where(inArray(assets.id, lockedAssetIds));
            }
        }
    });
  },
  {
    connection: redis,
  }
);

expirationWorker.on('failed', (job, err) => {
  console.error(`[BullMQ Error] Job ${job?.id} falló:`, err);
});

// Registrar el Cronjob periódico
export async function scheduleExpirationCron() {
    await expirationQueue.add('daily-cleanup', {}, {
        repeat: {
            pattern: '0 0 * * *' // Todos los días a medianoche. 
        }
    });
    console.log(`[BullMQ] ⏱️ Tracker de Expiración Diario Programado.`);
}
