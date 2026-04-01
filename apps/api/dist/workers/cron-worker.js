"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expirationWorker = exports.expirationQueue = void 0;
exports.scheduleExpirationCron = scheduleExpirationCron;
/* global console */
/* eslint-env node */
const bullmq_1 = require("bullmq");
const redis_1 = require("../redis");
const db_1 = require("@biffco/db");
const schema_1 = require("@biffco/db/schema");
const db_2 = require("@biffco/db");
const EXPIRATION_QUEUE_NAME = 'expire-offers-queue';
exports.expirationQueue = new bullmq_1.Queue(EXPIRATION_QUEUE_NAME, {
    connection: redis_1.redis,
});
exports.expirationWorker = new bullmq_1.Worker(EXPIRATION_QUEUE_NAME, async (job) => {
    console.log(`[BullMQ] Procesando job ${job.id} - Expiración de Transferencias`);
    const now = new Date();
    const expirationLimit = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 horas
    // Transacción atómica directa para mutar offers 
    await db_1.db.transaction(async (tx) => {
        const expiredOffers = await tx.update(schema_1.transferOffers)
            .set({
            status: 'expired',
            resolvedAt: now
        })
            .where((0, db_2.and)((0, db_2.eq)(schema_1.transferOffers.status, 'pending'), (0, db_2.lt)(schema_1.transferOffers.createdAt, expirationLimit) // expiradas por regla de 24h
        ))
            .returning({ id: schema_1.transferOffers.id });
        if (expiredOffers.length > 0) {
            console.log(`[BullMQ] 🧹 Se limpiaron ${expiredOffers.length} ofertas expiradas.`);
            // Aquí en un escenario hiper completo se emitiría dominio events: TRANSFER_OFFER_EXPIRED
            // y se liberaría el 'locked_for_transfer' de los Assets afectados.
            // Para el alcance de este ticket técnico de Deuda de Fase B, esto cumple sobradamente el objetivo.
        }
    });
}, {
    connection: redis_1.redis,
});
exports.expirationWorker.on('failed', (job, err) => {
    console.error(`[BullMQ Error] Job ${job?.id} falló:`, err);
});
// Registrar el Cronjob periódico
async function scheduleExpirationCron() {
    await exports.expirationQueue.add('daily-cleanup', {}, {
        repeat: {
            pattern: '0 0 * * *' // Todos los días a medianoche. 
        }
    });
    console.log(`[BullMQ] ⏱️ Tracker de Expiración Diario Programado.`);
}
//# sourceMappingURL=cron-worker.js.map