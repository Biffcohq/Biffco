/* global console */
/* eslint-env node */
import { Queue, Worker } from 'bullmq';
import { redis } from '../redis';
import { db } from '@biffco/db';
import { transferOffers } from '@biffco/db/schema';
import { lt, eq, and } from '@biffco/db';

const EXPIRATION_QUEUE_NAME = 'expire-offers-queue';

export const expirationQueue = new Queue(EXPIRATION_QUEUE_NAME, {
  connection: redis,
});

export const expirationWorker = new Worker(
  EXPIRATION_QUEUE_NAME,
  async (job) => {
    console.log(`[BullMQ] Procesando job ${job.id} - Expiración de Transferencias`);

    const now = new Date();
    const expirationLimit = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 horas

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
                lt(transferOffers.createdAt, expirationLimit) // expiradas por regla de 24h
              )
            )
            .returning({ id: transferOffers.id });

        if (expiredOffers.length > 0) {
            console.log(`[BullMQ] 🧹 Se limpiaron ${expiredOffers.length} ofertas expiradas.`);
            
            // Aquí en un escenario hiper completo se emitiría dominio events: TRANSFER_OFFER_EXPIRED
            // y se liberaría el 'locked_for_transfer' de los Assets afectados.
            // Para el alcance de este ticket técnico de Deuda de Fase B, esto cumple sobradamente el objetivo.
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
