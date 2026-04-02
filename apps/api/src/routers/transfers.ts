/* global console */
/* eslint-env node */
import { z } from 'zod';
import { router, protectedProcedure, requirePermission } from '../trpc';
import { assets, transferOffers, domainEvents, workspaces } from '@biffco/db/schema';
import { TRPCError } from '@trpc/server';
import { and, eq } from '@biffco/db';
import { sendEmail, TransferOfferEmail } from '@biffco/email';
import { Permission } from '@biffco/core/rbac';

import crypto from 'crypto';

export const TRANSFER_EXPIRATION_HOURS = 72;

export const transfersRouter = router({
  createOffer: requirePermission(Permission.ASSETS_TRANSFER)
    .input(z.object({
      assetId: z.string().min(1),
      toWorkspaceId: z.string().min(1),
      groupId: z.string().optional(),
      conditions: z.record(z.any()).default({}),
      signature: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db, workspaceId, memberId } = ctx;

      if (!workspaceId) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Missing Workspace' });
      }

      // 1. Verificar tenencia del activo por el remitente
      const asset = await db.query.assets.findFirst({
        where: and(
          eq(assets.id, input.assetId),
          eq(assets.workspaceId, workspaceId)
        )
      });

      if (!asset) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Activo no encontrado o no pertenece a tu espacio de trabajo.'
        });
      }

      // 2. Comprobar que el activo no está bloqueado
      if (asset.status !== 'active') {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: `El activo no puede transferirse porque su estado actual es '${asset.status}'.`
        });
      }

      // 3. Crear transacción atómica
      return await db.transaction(async (tx) => {
        // A. Insertar la oferta pendiente
        const [offer] = await tx.insert(transferOffers).values({
          fromWorkspaceId: workspaceId,
          toWorkspaceId: input.toWorkspaceId,
          assetId: input.assetId,
          status: 'pending',
          conditions: input.conditions,
        }).returning();

        if (!offer) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Fallo al generar la oferta en la base de datos.' });
        }

        // B. Bloquear el Activo
        await tx.update(assets)
          .set({ 
            status: 'locked_for_transfer', 
            updatedAt: new Date() 
          })
          .where(eq(assets.id, input.assetId));

        const eventData = {
          offerId: offer.id,
          toWorkspaceId: input.toWorkspaceId,
          message: 'Iniciada transferencia criptográfica de custodia',
        };
        const hashDigest = crypto.createHash('sha256').update(JSON.stringify(eventData)).digest('hex');

        // C. Generar la Evidencia de Transferencia
        await tx.insert(domainEvents).values({
          workspaceId: workspaceId,
          streamId: input.assetId,
          streamType: 'asset',
          eventType: 'TRANSFER_OFFER_CREATED',
          hash: hashDigest, // (A-05 Remediado)
          previousHash: null,
          data: eventData,
          signerId: memberId || 'system',
          signature: input.signature,
        });

        // D. Preparar datos paralelos para el Email SDK
        const [senderWs, targetWs] = await Promise.all([
           db.query.workspaces.findFirst({ where: eq(workspaces.id, workspaceId) }),
           db.query.workspaces.findFirst({ where: eq(workspaces.id, input.toWorkspaceId) })
        ]);

        if (senderWs && targetWs) {
           sendEmail({
             to: `admin@workspace-${targetWs.id}.biffco.co`, // Destino del Receiver Mock
             subject: `Nueva oferta de transferencia B2B de ${senderWs.name}`,
             component: TransferOfferEmail,
             props: {
               senderWorkspaceName: senderWs.name || 'Productor',
               targetWorkspaceName: targetWs.name || 'Receptor',
               assetCount: 1, // Por ahora createOffer acepta 1 activo
               offerId: offer.id,
               expiresAt: `${TRANSFER_EXPIRATION_HOURS} horas`
             }
           }).catch(err => {
             console.error("[Email SDK Failed]", err);
           });
        }

        return {
          success: true,
          offerId: offer.id,
          message: 'Oferta de transferencia generada exitosamente. Notificación asincrónica en camino.'
        };
      });
    }),

  listIncoming: protectedProcedure
    .query(async ({ ctx }) => {
       const { db, workspaceId } = ctx;
       return await db.query.transferOffers.findMany({
          where: eq(transferOffers.toWorkspaceId, workspaceId!),
          orderBy: (offers, { desc }) => [desc(offers.createdAt)]
       });
    }),

  listOutgoing: protectedProcedure
    .query(async ({ ctx }) => {
       const { db, workspaceId } = ctx;
       return await db.query.transferOffers.findMany({
          where: eq(transferOffers.fromWorkspaceId, workspaceId!),
          orderBy: (offers, { desc }) => [desc(offers.createdAt)]
       });
    }),

  acceptOffer: requirePermission(Permission.ASSETS_TRANSFER)
    .input(z.object({
       offerId: z.string().min(1),
       signature: z.string().optional() // Mock Ed25519 payload
    }))
    .mutation(async ({ ctx, input }) => {
       const { db, workspaceId, memberId } = ctx;

       if (!workspaceId) throw new TRPCError({ code: 'UNAUTHORIZED' });

       // 1. Verificar la oferta
       const offer = await db.query.transferOffers.findFirst({
         where: and(
           eq(transferOffers.id, input.offerId),
           eq(transferOffers.toWorkspaceId, workspaceId)
         )
       });

       if (!offer) {
         throw new TRPCError({ code: 'NOT_FOUND', message: 'Oferta no encontrada o no te pertenece.' });
       }
       if (offer.status !== 'pending') {
         throw new TRPCError({ code: 'PRECONDITION_FAILED', message: `La oferta ya se encuentra en estado: ${offer.status}` });
       }

       // 2. Transacción Atómica de Titularidad
       return await db.transaction(async (tx) => {
          // A. Completar la oferta
          await tx.update(transferOffers)
            .set({ status: 'completed', resolvedAt: new Date() })
            .where(eq(transferOffers.id, offer.id));

          // B. Transferencia del Activo (WorkspaceId change)
          await tx.update(assets)
            .set({ 
              workspaceId: workspaceId, 
              status: 'active', // Liberar bloqueo
              updatedAt: new Date()
            })
            .where(eq(assets.id, offer.assetId));

          const eventData = {
            offerId: offer.id,
            fromWorkspaceId: offer.fromWorkspaceId,
            message: 'Propiedad y custodia criptográfica transferida exitosamente',
          };
          const hashDigest = crypto.createHash('sha256').update(JSON.stringify(eventData)).digest('hex');

          // C. Sellar el Historial (Event Sourcing)
          await tx.insert(domainEvents).values({
            workspaceId: workspaceId,
            streamId: offer.assetId,
            streamType: 'asset',
            eventType: 'TRANSFER_ACCEPTED',
            hash: hashDigest, // (A-05 Remediado)
            previousHash: null,
            data: eventData,
            signerId: memberId || 'system',
            signature: input.signature,
          });

          return { success: true, message: '¡Transferencia aceptada! El activo ahora está en tu Workspace.' };
       });
    }),

  rejectOffer: requirePermission(Permission.ASSETS_TRANSFER)
    .input(z.object({
       offerId: z.string().min(1),
       reason: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
       const { db, workspaceId, memberId } = ctx;

       if (!workspaceId) throw new TRPCError({ code: 'UNAUTHORIZED' });

       const offer = await db.query.transferOffers.findFirst({
         where: and(
           eq(transferOffers.id, input.offerId),
           eq(transferOffers.toWorkspaceId, workspaceId)
         )
       });

       if (!offer) throw new TRPCError({ code: 'NOT_FOUND', message: 'Oferta no encontrada o no te pertenece.' });
       if (offer.status !== 'pending') throw new TRPCError({ code: 'PRECONDITION_FAILED', message: `Oferta en estado inválido (${offer.status})` });

       return await db.transaction(async (tx) => {
          const safeConditions = typeof offer.conditions === 'object' && offer.conditions !== null ? offer.conditions : {};
          
          await tx.update(transferOffers)
            .set({ status: 'rejected', resolvedAt: new Date(), conditions: { ...safeConditions, rejectReason: input.reason } })
            .where(eq(transferOffers.id, offer.id));

          await tx.update(assets)
            .set({ status: 'active', updatedAt: new Date() })
            .where(eq(assets.id, offer.assetId));

          const eventData = { offerId: offer.id, reason: input.reason };
          const hashDigest = crypto.createHash('sha256').update(JSON.stringify(eventData)).digest('hex');

          await tx.insert(domainEvents).values({
            workspaceId: offer.fromWorkspaceId,
            streamId: offer.assetId,
            streamType: 'asset',
            eventType: 'TRANSFER_REJECTED',
            hash: hashDigest, // (A-05 Remediado)
            data: eventData,
            signerId: memberId || 'system',
          });

          // Hack/Mock para el envío de Email
          // eslint-disable-next-line no-undef
          console.log(`[EMAIL DISPATCH MOCK] -> Enviando Resend a ${offer.fromWorkspaceId}: "Tu transferencia ha sido rechazada por el receptor."`);

          return { success: true, message: 'Transferencia rechazada.' };
       });
    }),

  expireOffers: protectedProcedure // Puede ser publicProcedure o authServer en un worker
    .mutation(async ({ ctx }) => {
       const { db } = ctx;
       
       // Buscar ofertas pending mayores al TTL
       const expirationLimit = new Date(Date.now() - TRANSFER_EXPIRATION_HOURS * 60 * 60 * 1000);
       // Fetch first for SQLite/PG compatibility without complex Drizzle operators here
       const pendingOffers = await db.query.transferOffers.findMany({
         where: eq(transferOffers.status, 'pending')
       });

       const expired = pendingOffers.filter(o => new Date(o.createdAt) < expirationLimit);
       if (expired.length === 0) return { expiredCount: 0 };

       await db.transaction(async (tx) => {
         for (const offer of expired) {
           await tx.update(transferOffers)
             .set({ status: 'cancelled', resolvedAt: new Date() })
             .where(eq(transferOffers.id, offer.id));

           await tx.update(assets)
             .set({ status: 'active', updatedAt: new Date() })
             .where(eq(assets.id, offer.assetId));

           const eventData = { offerId: offer.id, message: `La oferta excedió el TTL de ${TRANSFER_EXPIRATION_HOURS} horas.` };
           const hashDigest = crypto.createHash('sha256').update(JSON.stringify(eventData)).digest('hex');
           
           await tx.insert(domainEvents).values({
             workspaceId: offer.fromWorkspaceId,
             streamId: offer.assetId,
             streamType: 'asset',
             eventType: 'TRANSFER_EXPIRED',
             hash: hashDigest,
             data: eventData,
             signerId: 'system-cron',
           });
           
           console.log(`[EMAIL DISPATCH MOCK] -> Expired offer notify to ${offer.fromWorkspaceId}`);
         }
       });

       return { expiredCount: expired.length, message: `Se limpiaron ${expired.length} transferencias vencidas.` };
    })
});
