import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, protectedProcedure, requirePermission } from '../trpc'
import { parcels } from '@biffco/db/schema' // zones en el playbook refieren a parcelas físicas
import { eq, sql } from '@biffco/db'
import { Permission } from '@biffco/core/rbac'

export const zonesRouter = router({
  create: requirePermission(Permission.ZONES_MANAGE)
    .input(z.object({
      name: z.string().min(1).max(100),
      areaHectares: z.number().optional(),
      polygon: z.object({
        type: z.literal("Polygon"),
        coordinates: z.array(z.array(z.array(z.number()))),
      }).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, workspaceId } = ctx
      
      // PostGIS validation
      let locationData = { type: "Polygon", coordinates: [] }
      if (input.polygon) {
        try {
          const result = await db.execute<{ isValid: boolean }>(
            sql`SELECT ST_IsValid(ST_GeomFromGeoJSON(${JSON.stringify(input.polygon)})) as "isValid"`
          )
          const isValid = result[0]?.isValid ?? false
          if (!isValid) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Zone Polygon GeoJSON no es válido" })
          }
          locationData = input.polygon as any
        } catch (error: any) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Error verificando la geometría PostGIS: " + error.message })
        }
      }
      
      const [parcel] = await db.insert(parcels).values({
        workspaceId: workspaceId!,
        name: input.name,
        areaHectares: input.areaHectares?.toString() ?? null,
        geoJson: locationData,
      }).returning()
      
      return parcel
    }),

  list: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.select().from(parcels).where(eq(parcels.workspaceId, ctx.workspaceId!))
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const p = await ctx.db.query.parcels.findFirst({
        where: eq(parcels.id, input.id)
      })
      if (!p) throw new TRPCError({ code: "NOT_FOUND" })
      return p
    }),

  update: requirePermission(Permission.ZONES_MANAGE)
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).max(100).optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { id, ...updates } = input
      const [updated] = await ctx.db.update(parcels)
        .set(updates)
        .where(eq(parcels.id, id))
        .returning()
      
      return updated
    }),
})
