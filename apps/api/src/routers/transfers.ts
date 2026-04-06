import { z } from 'zod'
import { router, protectedProcedure, requirePermission } from '../trpc'
import { assets, assetTransfers, domainEvents, workspaces } from '@biffco/db/schema'
import { TRPCError } from '@trpc/server'
import { and, eq, inArray, or } from 'drizzle-orm'
import { Permission } from '@biffco/core/rbac'
import crypto from 'crypto'

export const TRANSFER_EXPIRATION_HOURS = 72;

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
      
      // Validar Destino y Transportista permitiendo "CBU/Alias"
      const receiver = await db.query.workspaces.findFirst({ 
        where: or(eq(workspaces.id, input.receiverWorkspaceId), eq(workspaces.alias, input.receiverWorkspaceId)) 
      })
      if (!receiver) throw new TRPCError({ code: 'BAD_REQUEST', message: `El destino (${input.receiverWorkspaceId}) no existe o está mal escrito.` })
      
      let finalCarrierId = null;
      if (input.carrierWorkspaceId) {
        const carrier = await db.query.workspaces.findFirst({ 
          where: or(eq(workspaces.id, input.carrierWorkspaceId), eq(workspaces.alias, input.carrierWorkspaceId)) 
        })
        if (!carrier) throw new TRPCError({ code: 'BAD_REQUEST', message: `El transportista (${input.carrierWorkspaceId}) no existe o está mal escrito.` })
        finalCarrierId = carrier.id;
      }
      
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

      // Validar que no estén bloqueados operativamente
      // PERMITIMOS 'ACTIVE' y 'REJECTED_IN_TRANSIT' (para retornos/redespachos de disputas).
      const invalidAssets = targetAssets.filter(a => a.status !== 'ACTIVE' && a.status !== 'REJECTED_IN_TRANSIT' && a.status !== 'active')
      if (invalidAssets.length > 0) {
        throw new TRPCError({ code: 'PRECONDITION_FAILED', message: "Algunos activos están bloqueados o ya en tránsito." })
      }

      return await db.transaction(async (tx) => {
        // Bloquear todos los activos
        await tx.update(assets)
          .set({ status: 'IN_TRANSIT', updatedAt: new Date() })
          .where(inArray(assets.id, input.assetIds))

        // Crear la transferencia trilateral grabando siempre el UUID crudo
        const [transfer] = await tx.insert(assetTransfers).values({
          senderWorkspaceId: workspaceId,
          carrierWorkspaceId: finalCarrierId,
          receiverWorkspaceId: receiver.id,
          assetIds: input.assetIds,
          status: 'PENDING_CARRIER_ACCEPTANCE',
          dispatchedAt: new Date()
        }).returning()

        if (!transfer) throw new Error("Falla al generar registro")

        // Generar evento Criptográfico Inmutable
        const eventData = {
          transferId: transfer.id,
          carrier: finalCarrierId,
          receiver: receiver.id,
          message: 'Lote despachado'
        }

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
      rejectedAssetIds: z.array(z.string()).optional(), // Bajas en tránsito reportadas
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
      if (transfer.status !== 'IN_TRANSIT') throw new TRPCError({ code: 'PRECONDITION_FAILED', message: 'El lote no está en tránsito' })

      return await db.transaction(async (tx) => {
        const isAccept = input.action === 'ACCEPT'
        
        await tx.update(assetTransfers)
          .set({ 
            status: isAccept ? 'COMPLETED' : 'REJECTED',
            receivedAt: isAccept ? new Date() : null,
            rejectedAt: !isAccept ? new Date() : null,
            metadata: { ...transfer.metadata as object, rejectReason: input.reason, casualtiesCount: input.rejectedAssetIds?.length || 0 }
          })
          .where(eq(assetTransfers.id, transfer.id))

        const allAssetIds = transfer.assetIds as string[]
        const rejectedAssetIdsSet = new Set(input.rejectedAssetIds || [])
        const acceptedAssetIds = allAssetIds.filter(id => !rejectedAssetIdsSet.has(id))
        const confirmedRejectedAssetIds = allAssetIds.filter(id => rejectedAssetIdsSet.has(id))

        if (isAccept) {
           // Transferir los que llegaron sanos al dueño real
           if (acceptedAssetIds.length > 0) {
             await tx.update(assets)
               .set({ workspaceId: workspaceId!, status: 'ACTIVE', updatedAt: new Date() })
               .where(inArray(assets.id, acceptedAssetIds)) // Mueve las vacas al Destino
           }
           
           // Marcar las bajas (muertes/extravíos reportados por el destino)
           if (confirmedRejectedAssetIds.length > 0) {
             await tx.update(assets)
               .set({ workspaceId: workspaceId!, status: 'DEAD_IN_TRANSIT', updatedAt: new Date() })
               .where(inArray(assets.id, confirmedRejectedAssetIds))
           }
        } else {
           // Si el destino rechaza EL CAMIÓN COMPLETO, quedan varados en el camión como REJECTED_IN_TRANSIT. 
           // El Origen Original es el único con potestad para despacharlos en un nuevo viaje de retorno/redirección.
           await tx.update(assets)
             .set({ status: 'REJECTED_IN_TRANSIT', updatedAt: new Date() })
             .where(inArray(assets.id, allAssetIds))
        }

        const eventsToInsert: any[] = []
        
        if (isAccept) {
            // Eventos para los aceptados
            if (acceptedAssetIds.length > 0) {
                const eventDataAccept = { transferId: transfer.id, action: 'ACCEPT' }
                acceptedAssetIds.forEach(assetId => {
                   eventsToInsert.push({
                      workspaceId: workspaceId,
                      streamId: assetId,
                      streamType: 'asset',
                      eventType: 'ASSET_RECEIVED',
                      hash: crypto.createHash('sha256').update(JSON.stringify({ ...eventDataAccept, animal: assetId })).digest('hex'),
                      data: eventDataAccept,
                      signerId: memberId || 'system',
                      signature: input.signature,
                   })
                })
            }

            // Eventos para las bajas
            if (confirmedRejectedAssetIds.length > 0) {
                const eventDataDead = { transferId: transfer.id, action: 'REJECT_CASUALTY', reason: input.reason || 'Baja en Tránsito' }
                confirmedRejectedAssetIds.forEach(assetId => {
                   eventsToInsert.push({
                      workspaceId: workspaceId,
                      streamId: assetId,
                      streamType: 'asset',
                      eventType: 'ASSET_REJECTED',
                      hash: crypto.createHash('sha256').update(JSON.stringify({ ...eventDataDead, animal: assetId })).digest('hex'),
                      data: eventDataDead,
                      signerId: memberId || 'system',
                      signature: input.signature,
                   })
                })
            }
        } else {
            // Eventos para rechazo total
            const eventDataReject = { transferId: transfer.id, action: 'REJECT', reason: input.reason }
            allAssetIds.forEach(assetId => {
               eventsToInsert.push({
                  workspaceId: workspaceId,
                  streamId: assetId,
                  streamType: 'asset',
                  eventType: 'ASSET_REJECTED',
                  hash: crypto.createHash('sha256').update(JSON.stringify({ ...eventDataReject, animal: assetId })).digest('hex'),
                  data: eventDataReject,
                  signerId: memberId || 'system',
                  signature: input.signature,
               })
            })
        }

        if (eventsToInsert.length > 0) {
            await tx.insert(domainEvents).values(eventsToInsert)
        }

        return { success: true, newStatus: isAccept ? 'COMPLETED' : 'REJECTED' }
      })
    }),

  // Queries para Interfaces Logísticas
  listIncomingLogistics: protectedProcedure.query(async ({ ctx }) => {
    const raw = await ctx.db.query.assetTransfers.findMany({
      where: eq(assetTransfers.receiverWorkspaceId, ctx.workspaceId!),
      orderBy: (transfers, { desc }) => [desc(transfers.createdAt)]
    })
    return enrichWithAliases(raw, ctx.db)
  }),

  listOutgoingLogistics: protectedProcedure.query(async ({ ctx }) => {
    const raw = await ctx.db.query.assetTransfers.findMany({
      where: eq(assetTransfers.senderWorkspaceId, ctx.workspaceId!),
      orderBy: (transfers, { desc }) => [desc(transfers.createdAt)]
    })
    return enrichWithAliases(raw, ctx.db)
  }),

  listAsCarrier: protectedProcedure.query(async ({ ctx }) => {
    const raw = await ctx.db.query.assetTransfers.findMany({
      where: eq(assetTransfers.carrierWorkspaceId, ctx.workspaceId!),
      orderBy: (transfers, { desc }) => [desc(transfers.createdAt)]
    })
    return enrichWithAliases(raw, ctx.db)
  }),
})

async function enrichWithAliases(transfersData: any[], db: any) {
  if (!transfersData.length) return []
  
  const idsToFetch = new Set<string>()
  for (const t of transfersData) {
    if (t.senderWorkspaceId) idsToFetch.add(t.senderWorkspaceId)
    if (t.receiverWorkspaceId) idsToFetch.add(t.receiverWorkspaceId)
    if (t.carrierWorkspaceId) idsToFetch.add(t.carrierWorkspaceId)
  }
  
  const mappedIds: Record<string, string> = {}
  if (idsToFetch.size > 0) {
    const resolved = await db.query.workspaces.findMany({
      where: inArray(workspaces.id, Array.from(idsToFetch)),
      columns: { id: true, alias: true }
    })
    for (const w of resolved) {
      mappedIds[w.id] = w.alias
    }
  }

  return transfersData.map((t) => ({
    ...t,
    senderAlias: t.senderWorkspaceId ? mappedIds[t.senderWorkspaceId] : null,
    receiverAlias: t.receiverWorkspaceId ? mappedIds[t.receiverWorkspaceId] : null,
    carrierAlias: t.carrierWorkspaceId ? mappedIds[t.carrierWorkspaceId] : null,
  }))
}
