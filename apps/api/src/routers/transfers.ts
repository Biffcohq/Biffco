import { z } from 'zod'
import { router, protectedProcedure, requirePermission } from '../trpc'
import { assets, assetTransfers, domainEvents, workspaces } from '@biffco/db/schema'
import { TRPCError } from '@trpc/server'
import { and, eq, inArray } from 'drizzle-orm'
import { Permission } from '@biffco/core/rbac'
import crypto from 'crypto'

export const transfersRouter = router({
  
  // 1. Productor inicia el documento de traslado (Carta de Porte)
  createDraft: requirePermission(Permission.TRANSFERS_INITIATE)
    .input(z.object({
      assetIds: z.array(z.string()).min(1),
      carrierWorkspaceId: z.string().optional(),
      receiverWorkspaceId: z.string().min(1),
      signature: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db, workspaceId, memberId } = ctx
      
      if (!workspaceId) throw new TRPCError({ code: 'UNAUTHORIZED' })
      
      // Controlar tenencia de todos los activos
      const targetAssets = await db.query.assets.findMany({
        where: and(
          inArray(assets.id, input.assetIds),
          eq(assets.workspaceId, workspaceId)
        )
      })

      if (targetAssets.length !== input.assetIds.length) {
        throw new TRPCError({ code: 'PRECONDITION_FAILED', message: "No posees algunos de los activos solicitados." })
      }

      // Validar que no estén bloqueados
      const invalidAssets = targetAssets.filter(a => a.status !== 'active' && a.status !== 'ACTIVE')
      if (invalidAssets.length > 0) {
        throw new TRPCError({ code: 'PRECONDITION_FAILED', message: "Algunos activos están bloqueados o ya en tránsito." })
      }

      return await db.transaction(async (tx) => {
        // Bloquear todos los activos
        await tx.update(assets)
          .set({ status: 'IN_TRANSIT', updatedAt: new Date() })
          .where(inArray(assets.id, input.assetIds))

        // Crear la transferencia trilateral
        const [transfer] = await tx.insert(assetTransfers).values({
          senderWorkspaceId: workspaceId,
          carrierWorkspaceId: input.carrierWorkspaceId || null,
          receiverWorkspaceId: input.receiverWorkspaceId,
          assetIds: input.assetIds,
          status: 'PENDING_CARRIER_ACCEPTANCE',
          dispatchedAt: new Date()
        }).returning()

        if (!transfer) throw new Error("Falla al generar registro")

        // Generar evento Criptográfico Inmutable
        const eventData = {
          transferId: transfer.id,
          carrier: input.carrierWorkspaceId,
          receiver: input.receiverWorkspaceId,
          message: 'Lote despachado'
        }
        const hashDigest = crypto.createHash('sha256').update(JSON.stringify(eventData)).digest('hex')

        const eventsToInsert = input.assetIds.map(assetId => ({
          workspaceId: workspaceId,
          streamId: assetId,
          streamType: 'asset',
          eventType: 'ASSET_DISPATCHED',
          hash: crypto.createHash('sha256').update(JSON.stringify({ ...eventData, animal: assetId })).digest('hex'),
          data: eventData,
          signerId: memberId || 'system',
          signature: input.signature,
        }))

        await tx.insert(domainEvents).values(eventsToInsert)

        return { success: true, transferId: transfer.id }
      })
    }),

  // 2. Transportista recoge los Activos
  carrierAccept: protectedProcedure
    .input(z.object({
      transferId: z.string().min(1),
      signature: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const { db, workspaceId, memberId } = ctx
      
      const transfer = await db.query.assetTransfers.findFirst({
        where: and(
          eq(assetTransfers.id, input.transferId),
          eq(assetTransfers.carrierWorkspaceId, workspaceId!)
        )
      })

      if (!transfer) throw new TRPCError({ code: 'NOT_FOUND', message: 'No eres el transportista asignado' })
      if (transfer.status !== 'PENDING_CARRIER_ACCEPTANCE') throw new TRPCError({ code: 'PRECONDITION_FAILED' })

      return await db.transaction(async (tx) => {
        await tx.update(assetTransfers)
          .set({ status: 'IN_TRANSIT', carrierAcceptedAt: new Date() })
          .where(eq(assetTransfers.id, transfer.id))

        const eventData = { transferId: transfer.id, message: 'Carga escaneada y en el camión' }
        const eventsToInsert = (transfer.assetIds as string[]).map(assetId => ({
          workspaceId: transfer.senderWorkspaceId, // Seguimos impactando el historial del origen
          streamId: assetId,
          streamType: 'asset',
          eventType: 'ASSET_TRANSIT_SCAN',
          hash: crypto.createHash('sha256').update(JSON.stringify({ ...eventData, animal: assetId })).digest('hex'),
          data: eventData,
          signerId: memberId || 'system',
          signature: input.signature,
        }))
        await tx.insert(domainEvents).values(eventsToInsert)

        return { success: true }
      })
    }),

  // 3. Frigorífico evalúa y resuelve
  destinationResolve: requirePermission(Permission.TRANSFERS_ACCEPT)
    .input(z.object({
      transferId: z.string().min(1),
      action: z.enum(['ACCEPT', 'REJECT']),
      reason: z.string().optional(),
      signature: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const { db, workspaceId, memberId } = ctx
      
      const transfer = await db.query.assetTransfers.findFirst({
        where: and(
          eq(assetTransfers.id, input.transferId),
          eq(assetTransfers.receiverWorkspaceId, workspaceId!) // OJO, workspaceId es el Destino
        )
      })

      if (!transfer) throw new TRPCError({ code: 'NOT_FOUND', message: 'Manifiesto de carga ajeno' })
      if (transfer.status !== 'IN_TRANSIT') throw new TRPCError({ code: 'PRECONDITION_FAILED' })

      return await db.transaction(async (tx) => {
        const isAccept = input.action === 'ACCEPT'
        
        await tx.update(assetTransfers)
          .set({ 
            status: isAccept ? 'COMPLETED' : 'REJECTED',
            receivedAt: isAccept ? new Date() : null,
            rejectedAt: !isAccept ? new Date() : null,
            metadata: { ...transfer.metadata as object, rejectReason: input.reason }
          })
          .where(eq(assetTransfers.id, transfer.id))

        if (isAccept) {
           // Transferir de dueño real
           await tx.update(assets)
             .set({ workspaceId: workspaceId!, status: 'ACTIVE', updatedAt: new Date() })
             .where(inArray(assets.id, transfer.assetIds as string[])) // Mueve las vacas al Frigorífico
        } else {
           // Si rechaza, caemos a DISPUTED logísticamente pero le devuelvo el control transaccional como HOLD al origen (O lo dejamos bloqueado IN_TRANSIT)
           // Actualizamos estado a hold/disputa para la UI del Productor Original
           await tx.update(assets)
             .set({ status: 'DISPUTED', updatedAt: new Date() })
             .where(inArray(assets.id, transfer.assetIds as string[]))
        }

        const eventData = { transferId: transfer.id, action: input.action, reason: input.reason }
        const eventsToInsert = (transfer.assetIds as string[]).map(assetId => ({
          workspaceId: workspaceId,
          streamId: assetId,
          streamType: 'asset',
          eventType: isAccept ? 'ASSET_RECEIVED' : 'ASSET_REJECTED',
          hash: crypto.createHash('sha256').update(JSON.stringify({ ...eventData, animal: assetId })).digest('hex'),
          data: eventData,
          signerId: memberId || 'system',
          signature: input.signature,
        }))
        await tx.insert(domainEvents).values(eventsToInsert)

        return { success: true, newStatus: isAccept ? 'COMPLETED' : 'REJECTED' }
      })
    }),

  // Queries para Interfaces Logísticas
  listIncomingLogistics: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.assetTransfers.findMany({
      where: eq(assetTransfers.receiverWorkspaceId, ctx.workspaceId!),
      orderBy: (transfers, { desc }) => [desc(transfers.createdAt)]
    })
  }),

  listOutgoingLogistics: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.assetTransfers.findMany({
      where: eq(assetTransfers.senderWorkspaceId, ctx.workspaceId!),
      orderBy: (transfers, { desc }) => [desc(transfers.createdAt)]
    })
  }),

  listAsCarrier: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.assetTransfers.findMany({
      where: eq(assetTransfers.carrierWorkspaceId, ctx.workspaceId!),
      orderBy: (transfers, { desc }) => [desc(transfers.createdAt)]
    })
  }),
})
