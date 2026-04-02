import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, protectedProcedure, requirePermission } from '../trpc'
import { assets, holds, domainEvents } from '@biffco/db/schema'
import { eq, and } from '@biffco/db'
import { Permission } from '@biffco/core/rbac'
import crypto from 'crypto'

export const holdsRouter = router({
  
  // 1. Dashboard de Inspectores: Ver todas las cuarentenas del tenant
  list: protectedProcedure
    .query(async ({ ctx }) => {
      const { db, workspaceId } = ctx
      return await db.query.holds.findMany({
        where: eq(holds.workspaceId, workspaceId!),
        orderBy: (holds, { desc }) => [desc(holds.createdAt)],
      })
    }),

  // 2. IMPONER CUARENTENA MANUAL
  impose: requirePermission(Permission.HOLDS_IMPOSE)
    .input(z.object({
      assetId: z.string(),
      reason: z.string().min(5, "Debes justificar la clausura sanitara/legal.")
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, workspaceId, memberId } = ctx
      
      return await db.transaction(async (tx) => {
        // Encontrar el activo a bloquear
        const targetAsset = await tx.query.assets.findFirst({
          where: and(
            eq(assets.id, input.assetId),
            eq(assets.workspaceId, workspaceId!)
          )
        })

        if (!targetAsset) {
          throw new TRPCError({ code: "NOT_FOUND", message: "El activo no existe." })
        }
        if (targetAsset.status === 'SLAUGHTERED' || targetAsset.status === 'CLOSED_BY_SPLIT' || targetAsset.status === 'CLOSED_BY_MERGE') {
          throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Activo inoperativo. No se puede imponer cuarentena sobre historia muerta." })
        }

        // Registrar el Hold Activo
        const [newHold] = await tx.insert(holds).values({
          assetId: targetAsset.id,
          workspaceId: workspaceId!,
          reason: input.reason,
          issuerId: memberId || "system",
          isActive: true
        }).returning()

        if (!newHold) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Fallo al registrar la cuarentena física." })
        }

        // Alterar estado biológico del activo
        await tx.update(assets)
          .set({ status: 'QUARANTINE' })
          .where(eq(assets.id, targetAsset.id))

        const eventData = { holdId: newHold.id, reason: input.reason };
        const hashDigest = crypto.createHash('sha256').update(JSON.stringify(eventData)).digest('hex');

        // Inmutabilidad (Hash Log)
        await tx.insert(domainEvents).values({
          workspaceId: workspaceId!,
          streamId: targetAsset.id,
          streamType: 'asset',
          eventType: 'HOLD_IMPOSED',
          data: eventData,
          hash: hashDigest,
          signerId: memberId || "system"
        })

        return newHold
      })
    }),

  // 3. LEVANTAR CUARENTENA MANUAL (Absolución)
  lift: requirePermission(Permission.HOLDS_LIFT)
    .input(z.object({
      holdId: z.string(),
      reason: z.string().optional() // Motivo técnico de la liberación
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, workspaceId, memberId } = ctx

      return await db.transaction(async (tx) => {
        const targetHold = await tx.query.holds.findFirst({
          where: and(
            eq(holds.id, input.holdId),
            eq(holds.workspaceId, workspaceId!)
          )
        })

        if (!targetHold || !targetHold.isActive) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Cuarentena no encontrada o ya estaba inactiva." })
        }

        // Levantar clausura
        await tx.update(holds)
          .set({ isActive: false })
          .where(eq(holds.id, targetHold.id))

        // Revisar si quedaron OTRAS cuarentenas hermanas activas en este mismo activo
        const remainingHolds = await tx.query.holds.findMany({
          where: and(
            eq(holds.assetId, targetHold.assetId),
            eq(holds.isActive, true)
          )
        })

        if (remainingHolds.length === 0) {
           // Si ya no quedan infecciones, el activo es declarado SANO nuevamente
           await tx.update(assets)
            .set({ status: 'ACTIVE' }) // Retorna al estado operativo basal
            .where(eq(assets.id, targetHold.assetId))
        }

        const liftEventData = { holdId: targetHold.id, resolutionDetails: input.reason };
        const liftHashDigest = crypto.createHash('sha256').update(JSON.stringify(liftEventData)).digest('hex');

        // Inmutabilidad
        await tx.insert(domainEvents).values({
          workspaceId: workspaceId!,
          streamId: targetHold.assetId,
          streamType: 'asset',
          eventType: 'HOLD_LIFTED',
          data: liftEventData,
          hash: liftHashDigest,
          signerId: memberId || "system"
        })

        return { success: true, remainedInQuarantine: remainingHolds.length > 0 }
      })
    })
})
