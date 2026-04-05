import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { db, schema } from '@biffco/db'
import { eq, and, inArray } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'

export const assetGroupsRouter = router({
  /**
   * getWithAssets
   * Lista en forma retrospectiva todos los grupos del workspace con la cantidad actual
   * de activos que pertenecen a cada uno.
   */
  getWithAssets: protectedProcedure
    .input(z.object({
      verticalId: z.string().default('livestock')
    }))
    .query(async ({ ctx, input }) => {
      // Obtenemos todos los grupos activos
      const groups = await db.select().from(schema.assetGroups).where(
        and(
          eq(schema.assetGroups.workspaceId, ctx.workspaceId),
          eq(schema.assetGroups.isActive, true),
          eq(schema.assetGroups.verticalId, input.verticalId)
        )
      )

      if (groups.length === 0) return []

      const groupIds = groups.map(g => g.id)

      // Traer los assets que pertenecen a estos grupos
      const relatedAssets = await db.select({
        id: schema.assets.id,
        groupId: schema.assets.groupId,
        status: schema.assets.status,
      }).from(schema.assets).where(
        and(
          eq(schema.assets.workspaceId, ctx.workspaceId),
          inArray(schema.assets.groupId, groupIds)
        )
      )

      return groups.map(group => {
        const agroup = { ...group }
        const linked = relatedAssets.filter(a => a.groupId === group.id)
        return {
          ...agroup,
          assets: linked,
          totalActive: linked.filter(a => a.status === 'ACTIVE').length
        }
      })
    }),

  /**
   * create
   * Crea un nuevo AssetGroup lógico ("Lote", "Corral", "Embarque") y asigna un label.
   */
  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      verticalId: z.string().default('livestock'),
      initialQuantity: z.number().default(0),
      metadata: z.record(z.any()).optional().default({})
    }))
    .mutation(async ({ ctx, input }) => {
      const [newGroup] = await db.insert(schema.assetGroups).values({
        workspaceId: ctx.workspaceId,
        name: input.name,
        verticalId: input.verticalId,
        quantity: input.initialQuantity,
        metadata: input.metadata,
        isActive: true
      }).returning()

      return newGroup
    }),

  /**
   * addAssets
   * Vincular un grupo de Assets individuales a un AssetGroup específico.
   * Esto asume que todos los assets pertenecen al mismo workspace
   */
  addAssets: protectedProcedure
    .input(z.object({
      groupId: z.string(),
      assetIds: z.array(z.string())
    }))
    .mutation(async ({ ctx, input }) => {
      // 1. Validar propiedad del grupo
      const [group] = await db.select().from(schema.assetGroups).where(
        and(
          eq(schema.assetGroups.id, input.groupId),
          eq(schema.assetGroups.workspaceId, ctx.workspaceId)
        )
      ).limit(1)

      if (!group) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Asset Group not found' })
      }

      // 2. Actualizar assets
      if (input.assetIds.length > 0) {
        await db.update(schema.assets).set({
          groupId: input.groupId,
          updatedAt: new Date()
        }).where(
          and(
            eq(schema.assets.workspaceId, ctx.workspaceId),
            inArray(schema.assets.id, input.assetIds)
          )
        )
      }

      return { success: true, count: input.assetIds.length }
    }),

  /**
   * dissolve
   * Marca el grupo como disuelto (isActive=false) y remueve el groupId de sus assets,
   * permitiendo que los activos vuelvan a ser tratados puramente de forma individual, 
   * manteniendo el rastro histórico a traves de los eventos.
   */
  dissolve: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // 1. Update group to active = false
      const [updated] = await db.update(schema.assetGroups).set({ 
        isActive: false, 
        updatedAt: new Date() 
      }).where(
        and(
          eq(schema.assetGroups.id, input.id),
          eq(schema.assetGroups.workspaceId, ctx.workspaceId)
        )
      ).returning()

      if (!updated) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Group not found or unauthorized' })
      }

      // 2. Clear groupId in related assets
      await db.update(schema.assets).set({
        groupId: null,
        updatedAt: new Date()
      }).where(
        and(
          eq(schema.assets.groupId, input.id),
          eq(schema.assets.workspaceId, ctx.workspaceId)
        )
      )

      return { success: true, dissolvedGroup: updated.id }
    })
})
