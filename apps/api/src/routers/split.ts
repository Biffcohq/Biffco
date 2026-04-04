import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, requirePermission } from '../trpc'
import { assets, holds, domainEvents } from '@biffco/db/schema'
import { eq, and } from '@biffco/db'
import { Permission } from '@biffco/core/rbac'
import crypto from 'crypto'

export const splitRouter = router({
  
  createSplit: requirePermission(Permission.ASSETS_SPLIT)
    .input(z.object({
      inputAssetId: z.string(),
      outputAllocations: z.array(z.object({
        quantity: z.number().optional(),
        metadata: z.record(z.unknown()).optional()
      })).min(1)
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, workspaceId, memberId } = ctx
      
      if (!workspaceId) {
         throw new TRPCError({ code: "UNAUTHORIZED", message: "Missing Workspace" })
      }

      // Toda la lógica de Split DEBE ser atómica
      return await db.transaction(async (tx) => {
        // 1. Validar existencia y propiedad del Activo Padre
        const parentAsset = await tx.query.assets.findFirst({
          where: and(
            eq(assets.id, input.inputAssetId), 
            eq(assets.workspaceId, workspaceId)
          )
        })

        if (!parentAsset) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Activo Padre no encontrado o no pertenece a este Workspace." })
        }
        
        if (parentAsset.status === 'CLOSED_BY_SPLIT' || parentAsset.status === 'SLAUGHTERED') {
          throw new TRPCError({ code: "PRECONDITION_FAILED", message: "El activo padre ya no se encuentra operativo." })
        }

        // 2. Marcar al padre como "Cerrado por Fraccionamiento"
        await tx.update(assets)
          .set({ status: 'CLOSED_BY_SPLIT' })
          .where(eq(assets.id, parentAsset.id))

        const eventData = { outputCount: input.outputAllocations.length };
        const hashDigest = crypto.createHash('sha256').update(JSON.stringify(eventData)).digest('hex');

        // 3. Registrar Evento de Cierre en el Padre (Proof of Closure)
        await tx.insert(domainEvents).values({
          workspaceId: workspaceId,
          streamId: parentAsset.id,
          streamType: 'asset',
          eventType: 'SPLIT_EXECUTED',
          data: eventData,
          hash: hashDigest,
          signerId: memberId || "system"
        })

        // 4. Worst-case Compliance Inheritance: Interrogar Holds
        const parentHolds = await tx.query.holds.findMany({
          where: and(
            eq(holds.assetId, parentAsset.id),
            eq(holds.isActive, true)
          )
        })

        const createdChildren = []

        // 5. Instanciar los Hijos (Outputs)
        for (const allocation of input.outputAllocations) {
          // Mantener Agnosticismo: El volumen/peso viene dentro de metadatos o allocation puro. Core no lo interroga.
          const [child] = await tx.insert(assets).values({
            workspaceId: workspaceId,
            verticalId: parentAsset.verticalId,
            type: parentAsset.type,
            status: parentHolds.length > 0 ? parentAsset.status : 'active', // Hereda el status pesado (LOCKED/QUARANTINE) si aplica
            parentIds: [parentAsset.id],
            metadata: {
              ...(parentAsset.metadata as object),
              ...allocation.metadata,
              derivedFromAllocation: allocation.quantity
            }
          }).returning()

          if (!child) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Falló la creación de las fracciones" })
          }

          createdChildren.push(child)

          // 6. Si el padre tiene Holds, el hijo obligatoriamente los copia intactos (Cápsula ineludible)
          if (parentHolds.length > 0) {
            for (const h of parentHolds) {
              await tx.insert(holds).values({
                assetId: child.id,
                workspaceId: workspaceId,
                reason: `HEREDADO DE SPLIT: ${h.reason}`,
                issuerId: h.issuerId,
                isActive: true
              })
            }
          }

          const childEventData = { parentId: parentAsset.id };
          const childHashDigest = crypto.createHash('sha256').update(JSON.stringify(childEventData)).digest('hex');

          // 7. Evento de Origen en el Hijo
          await tx.insert(domainEvents).values({
            workspaceId: workspaceId,
            streamId: child.id,
            streamType: 'asset',
            eventType: 'ASSET_BORN_FROM_SPLIT',
            data: childEventData,
            hash: childHashDigest,
            signerId: memberId || "system"
          })
        }

        return {
          success: true,
          parent: parentAsset.id,
          childrenCount: createdChildren.length,
          holdsInherited: parentHolds.length
        }
      })
    })

})
