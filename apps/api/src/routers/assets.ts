import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, protectedProcedure, requirePermission } from '../trpc'
import { assets, domainEvents, workspaces } from '@biffco/db/schema'
import { eq, and } from '@biffco/db'
import { Permission } from '@biffco/core/rbac'

export const assetsRouter = router({
  
  // Endpoint clave para el Dashboard: Listado de Activos
  list: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(50),
      cursor: z.string().nullish(), // Para paginación
      status: z.string().optional(),
      type: z.string().optional()
    }).optional())
    .query(async ({ input, ctx }) => {
      // Filtrar siempre por workspaceId garantiza tenant isolation.
      // Se debe usar la base de datos para recuperar todos los activos correspondientes al workspace
      const conditions = [eq(assets.workspaceId, ctx.workspaceId!)]
      
      if (input?.status) conditions.push(eq(assets.status, input.status))
      if (input?.type) conditions.push(eq(assets.type, input.type))

      const items = await ctx.db.query.assets.findMany({
        where: and(...conditions),
        orderBy: (assets, { desc }) => [desc(assets.createdAt)],
        limit: input?.limit,
      })
      
      return items
    }),

  // Vista de detalle: Trae el asset y sus últimos eventos
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const asset = await ctx.db.query.assets.findFirst({
        where: and(eq(assets.id, input.id), eq(assets.workspaceId, ctx.workspaceId!))
      })
      
      if (!asset) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Activo no encontrado en este workspace" })
      }

      // Traer los últimos 10 eventos aplicados a este activo
      const assetEvents = await ctx.db.query.domainEvents.findMany({
        where: eq(domainEvents.streamId, asset.id),
        orderBy: (domainEvents, { desc }) => [desc(domainEvents.createdAt)],
        limit: 10
      })

      return {
        ...asset,
        events: assetEvents
      }
    }),

  // Creación de un Asset puro inicial
  create: requirePermission(Permission.ASSETS_CREATE)
    .input(z.object({
      type: z.string(), // ejemplo: "Bovine", "DoreBar", "CoffeeSack"
      initialState: z.record(z.unknown()), // Estado inicial dinámico manejado por el VerticalPack
      externalId: z.string().optional(),
      facilityId: z.string().optional(),
      penId: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, workspaceId, verticalRegistry } = ctx
      
      const workspace = await db.query.workspaces.findFirst({ where: eq(workspaces.id, workspaceId!) })
      if (!workspace) throw new TRPCError({ code: "NOT_FOUND" })
        
      // Delegar validación de tipo al VerticalPack activo
      const pack = verticalRegistry.get(workspace.verticalId) as { assetTypes?: string[] } | undefined
      if (pack && pack.assetTypes && !pack.assetTypes.includes(input.type)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: `Tipo de activo "${input.type}" no válido para el vertical "${workspace.verticalId}"` })
      }

      const [newAsset] = await ctx.db.insert(assets).values({
        workspaceId: workspaceId!,
        verticalId: workspace.verticalId,
        type: input.type,
        status: "ACTIVE", // Estatus por default al crear
        locationId: input.facilityId || input.penId || null,
        metadata: {
          initialState: input.initialState,
          externalId: input.externalId,
          facilityId: input.facilityId,
          penId: input.penId
        } as Record<string, unknown>
      }).returning()
      
      return newAsset
    })
})
