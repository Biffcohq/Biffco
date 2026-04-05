import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, protectedProcedure, requirePermission } from '../trpc'
import { facilities, workspaces, zones, pens } from '@biffco/db/schema'
import { eq, sql, and } from '@biffco/db'
import { Permission } from '@biffco/core/rbac'

export const facilitiesRouter = router({
  create: requirePermission(Permission.FACILITIES_MANAGE)
    .input(z.object({
      name: z.string().min(1).max(100),
      type: z.string(),  // El tipo válido lo valida el VerticalPack
      licenseNumber: z.string().optional(),
      address: z.string().optional(),
      country: z.string().default("AR"),
      // Polígono GeoJSON opcional — se valida con ST_IsValid en PostGIS
      polygon: z.object({
        type: z.literal("Polygon"),
        coordinates: z.array(z.array(z.array(z.number()))),
      }).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, workspaceId, verticalRegistry } = ctx
      
      const workspace = await db.query.workspaces.findFirst({ where: eq(workspaces.id, workspaceId!) })
      const pack = verticalRegistry.get(workspace!.verticalId) as any
      
      if (pack && pack.facilityTypes && !pack.facilityTypes.includes(input.type)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: `Tipo "${input.type}" no válido para el vertical "${workspace!.verticalId}"` })
      }
      
      // 2. Si hay polígono, validar con PostGIS
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
      
      // 3. Crear el Facility (usando location jsonb temporalmente si fallback a PostGIS full column no es soportado)
      const locationData = input.polygon ? input.polygon : { 
        type: "Point", 
        coordinates: [0,0],
        renspa: input.licenseNumber,
        address: input.address
      }

      const [facility] = await db.insert(facilities).values({
        workspaceId: workspaceId!,
        name: input.name,
        type: input.type,
        // Usamos locationData en el schema actual que define location jsonb
        location: locationData,      
      }).returning()
      
      return facility
    }),

  list: protectedProcedure
    .query(async ({ ctx }) => {
      // Filtrar siempre por workspaceId garantiza tenant isolation. El RLS en db tmb intercede.
      return ctx.db.select().from(facilities).where(eq(facilities.workspaceId, ctx.workspaceId!))
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const facility = await ctx.db.query.facilities.findFirst({
        where: and(eq(facilities.id, input.id), eq(facilities.workspaceId, ctx.workspaceId!)),
        with: {
          // Note: To use 'with' queries securely, ensure Drizzle relations are defined,
          // manually fetching otherwise if relations aren't configured in schema index.
        }
      })
      if (!facility) throw new TRPCError({ code: "NOT_FOUND" })

      // Fetch zones and pens manually since Drizzle relations might not be setup
      const facilityZones = await ctx.db.query.zones.findMany({
        where: eq(zones.facilityId, facility.id)
      });
      
      const facilityPens = await ctx.db.query.pens.findMany({
        where: eq(pens.facilityId, facility.id)
      });
      
      return {
        ...facility,
        zones: facilityZones.map(z => ({
          ...z,
          pens: facilityPens.filter(p => p.zoneId === z.id)
        }))
      }
    }),

  update: requirePermission(Permission.FACILITIES_MANAGE)
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).max(100).optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { id, ...updates } = input
      const [updated] = await ctx.db.update(facilities)
        .set(updates)
        .where(eq(facilities.id, id))
        .returning()
      
      return updated
    }),
})
