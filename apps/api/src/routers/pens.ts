import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, protectedProcedure, requirePermission } from '../trpc'
import { pens, facilities, zones } from '@biffco/db/schema'
import { eq, and } from '@biffco/db'
import { Permission } from '@biffco/core/rbac'

export const pensRouter = router({
  create: requirePermission(Permission.ZONES_MANAGE)
    .input(z.object({
      facilityId: z.string(),
      zoneId: z.string().optional(),
      name: z.string().min(1),
      capacity: z.number().int().positive().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, workspaceId } = ctx
      
      const facility = await db.query.facilities.findFirst({
        where: and(eq(facilities.id, input.facilityId), eq(facilities.workspaceId, workspaceId!))
      })
      if (!facility) throw new TRPCError({ code: "NOT_FOUND", message: "Facility no encontrada" })

      if (input.zoneId) {
        const zone = await db.query.zones.findFirst({
          where: and(eq(zones.id, input.zoneId), eq(zones.workspaceId, workspaceId!))
        })
        if (!zone) throw new TRPCError({ code: "NOT_FOUND", message: "Zone no encontrada" })
        if (zone.facilityId !== input.facilityId) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Zone no pertenece a facility indicada" })
        }
      }

      const [pen] = await db.insert(pens).values({
        workspaceId: workspaceId!,
        facilityId: input.facilityId,
        zoneId: input.zoneId,
        name: input.name,
        capacity: input.capacity?.toString(),
        currentOccupancy: '0',
      }).returning()

      return pen
    }),

  list: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.select().from(pens).where(eq(pens.workspaceId, ctx.workspaceId!))
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const pen = await ctx.db.query.pens.findFirst({
        where: and(eq(pens.id, input.id), eq(pens.workspaceId, ctx.workspaceId!))
      })
      if (!pen) throw new TRPCError({ code: "NOT_FOUND" })
      return pen
    }),

  updateOccupancy: requirePermission(Permission.ASSETS_CREATE) // or appropriate role
    .input(z.object({ id: z.string(), delta: z.number().int() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.transaction(async (tx) => {
        const pen = await tx.query.pens.findFirst({
          where: and(eq(pens.id, input.id), eq(pens.workspaceId, ctx.workspaceId!))
        })
        if (!pen) throw new TRPCError({ code: "NOT_FOUND" })

        const currentOcc = parseInt(pen.currentOccupancy, 10)
        const newOcc = currentOcc + input.delta

        if (newOcc < 0) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Occupancy no puede ser negativo" })
        }

        if (pen.capacity) {
          const maxCap = parseInt(pen.capacity, 10)
          if (newOcc > maxCap) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Capacidad excedida" })
          }
        }

        const [updated] = await tx.update(pens)
          .set({ currentOccupancy: newOcc.toString() })
          .where(eq(pens.id, input.id))
          .returning()

        return updated
      })
    })
})
