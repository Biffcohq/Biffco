import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, protectedProcedure, requirePermission } from '../trpc'
import { zones, facilities } from '@biffco/db/schema'
import { eq, sql, and } from '@biffco/db'
import { Permission } from '@biffco/core/rbac'

export const zonesRouter = router({
  create: requirePermission(Permission.ZONES_MANAGE)
    .input(z.object({
      facilityId: z.string(),
      name: z.string().min(1).max(100),
      type: z.string(),
      capacity: z.number().int().positive().optional(),
      polygon: z.object({
        type: z.literal("Polygon"),
        coordinates: z.array(z.array(z.array(z.number()))),
      }).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, workspaceId } = ctx
      
      const facility = await db.query.facilities.findFirst({
        where: and(eq(facilities.id, input.facilityId), eq(facilities.workspaceId, workspaceId!))
      })
      if (!facility) throw new TRPCError({ code: "NOT_FOUND", message: "Facility not found" })

      if (input.polygon) {
        try {
          const result = await db.execute<{ isValid: boolean, reason: string }>(
            sql`SELECT ST_IsValid(ST_GeomFromGeoJSON(${JSON.stringify(input.polygon)})) as "isValid", ST_IsValidReason(ST_GeomFromGeoJSON(${JSON.stringify(input.polygon)})) as reason`
          )
          const isValid = result[0]?.isValid ?? false
          if (!isValid) {
            throw new TRPCError({ code: "BAD_REQUEST", message: `Polígono inválido: ${result[0]?.reason ?? "Self-intersection"}` })
          }
        } catch (error: any) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Error verificando la geometría PostGIS: " + error.message })
        }
      }
      
      const [zone] = await db.insert(zones).values({
        workspaceId: workspaceId!,
        facilityId: input.facilityId,
        name: input.name,
        type: input.type,
        capacity: input.capacity?.toString() ?? null,
        polygon: input.polygon ? input.polygon : null,
        gfwStatus: 'pending',
      }).returning()
      
      return zone
    }),

  list: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.select().from(zones).where(eq(zones.workspaceId, ctx.workspaceId!))
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const zEntity = await ctx.db.query.zones.findFirst({
        where: and(eq(zones.id, input.id), eq(zones.workspaceId, ctx.workspaceId!))
      })
      if (!zEntity) throw new TRPCError({ code: "NOT_FOUND" })
      return zEntity
    }),

  update: requirePermission(Permission.ZONES_MANAGE)
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).max(100).optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { id, ...updates } = input
      const [updated] = await ctx.db.update(zones)
        .set(updates)
        .where(and(eq(zones.id, id), eq(zones.workspaceId, ctx.workspaceId!)))
        .returning()
      
      return updated
    }),
})
