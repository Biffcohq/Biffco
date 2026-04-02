import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, requirePermission } from '../trpc'
import { assets, holds, domainEvents } from '@biffco/db/schema'
import { eq, inArray, and } from '@biffco/db'
import { Permission } from '@biffco/core/rbac'
import crypto from 'crypto'

export const mergeRouter = router({
  
  createMerge: requirePermission(Permission.ASSETS_CREATE)
    .input(z.object({
      inputAssetIds: z.array(z.string()).min(2, "Se requieren al menos 2 activos para fusionar"),
      outputType: z.string(), // "DoreBar", "BulkMineral", etc.
      outputMetadata: z.record(z.unknown()).optional()
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, workspaceId, memberId } = ctx
      
      if (!workspaceId) {
         throw new TRPCError({ code: "UNAUTHORIZED", message: "Missing Workspace" })
      }

      // Ensure no duplicates in input list
      const uniqueInputIds = Array.from(new Set(input.inputAssetIds))

      return await db.transaction(async (tx) => {
        // 1. Validar la existencia de TODOS los inputs
        const parentAssets = await tx.query.assets.findMany({
          where: and(
            inArray(assets.id, uniqueInputIds),
            eq(assets.workspaceId, workspaceId)
          )
        })

        if (parentAssets.length !== uniqueInputIds.length) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Uno o más activos de origen no existen o no pertenecen a tu Workspace." })
        }

        const validStatuses = ['ACTIVE', 'LOCKED', 'QUARANTINE'] // Operable states
        const invalidParents = parentAssets.filter(p => !validStatuses.includes(p.status))
        if (invalidParents.length > 0) {
          throw new TRPCError({ code: "PRECONDITION_FAILED", message: `Los activos [${invalidParents.map(a => a.id).join(', ')}] no pueden ser fusionados (fueron faenados o clausurados).` })
        }

        // 2. Worst-case compliance (Obtener holds masivos de todos los padres)
        const parentHolds = await tx.query.holds.findMany({
          where: and(
            inArray(holds.assetId, uniqueInputIds),
            eq(holds.isActive, true)
          )
        })

        const hasHolds = parentHolds.length > 0

        if (!parentAssets[0]) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Error al resolver la vertical" })
        }

        // 3. Crear The Titan (El Super-Activo fusionado hijo)
        const [child] = await tx.insert(assets).values({
          workspaceId: workspaceId,
          verticalId: parentAssets[0].verticalId, // Asumimos misma verticalidad
          type: input.outputType,
          status: hasHolds ? parentAssets.find(a => parentHolds.some(h => h.assetId === a.id))?.status || 'active' : 'active',
          parentIds: uniqueInputIds,
          metadata: {
            ...input.outputMetadata,
            isMergeResult: true
          }
        }).returning()

        if (!child) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Falló la creación del activo" })
        }

        // 4. Copiar e Inyectar todos los Holds al Hijo
        if (hasHolds) {
          // Filtrar repeticiones (ej. mismo reason issue repetido)
          const distinctHolds = Array.from(new Map(parentHolds.map(h => [`${h.reason}-${h.issuerId}`, h])).values())
          
          for (const h of distinctHolds) {
             await tx.insert(holds).values({
                assetId: child.id,
                workspaceId: workspaceId,
                reason: `HEREDADO TRAS MERGE: ${h.reason} (De Asset #${h.assetId})`,
                issuerId: h.issuerId,
                isActive: true
             })
          }
        }

        // 5. Cierre Masivo y Prueba Irrefutable en Graph
        for (const parent of parentAssets) {
           await tx.update(assets)
             .set({ status: 'CLOSED_BY_MERGE' })
             .where(eq(assets.id, parent.id))

            const eventData = { outputChildId: child.id };
            const hashDigest = crypto.createHash('sha256').update(JSON.stringify(eventData)).digest('hex');

           await tx.insert(domainEvents).values({
             workspaceId: workspaceId,
             streamId: parent.id,
             streamType: 'asset',
             eventType: 'MERGE_INPUT_CONSUMED',
             data: eventData,
             hash: hashDigest,
             signerId: memberId || "system"
           })
        }

        const finalEventData = { parentIds: uniqueInputIds };
        const finalHashDigest = crypto.createHash('sha256').update(JSON.stringify(finalEventData)).digest('hex');

        // Evento Biológico Final del Hijo
        await tx.insert(domainEvents).values({
           workspaceId: workspaceId,
           streamId: child.id,
           streamType: 'asset',
           eventType: 'ASSET_BORN_FROM_MERGE',
           data: finalEventData,
           hash: finalHashDigest,
           signerId: memberId || "system"
        })

        return {
          success: true,
          childId: child.id,
          consumedCount: parentAssets.length,
          holdsInherited: parentHolds.length
        }
      })
    })

})
