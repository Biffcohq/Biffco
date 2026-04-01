"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assetGroupsRouter = void 0;
const zod_1 = require("zod");
const trpc_1 = require("../trpc");
const db_1 = require("@biffco/db");
const drizzle_orm_1 = require("drizzle-orm");
const server_1 = require("@trpc/server");
exports.assetGroupsRouter = (0, trpc_1.router)({
    /**
     * getWithAssets
     * Lista en forma retrospectiva todos los grupos del workspace con la cantidad actual
     * de activos que pertenecen a cada uno.
     */
    getWithAssets: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        verticalId: zod_1.z.string().default('livestock')
    }))
        .query(async ({ ctx, input }) => {
        // Obtenemos todos los grupos activos
        const groups = await db_1.db.select().from(db_1.schema.assetGroups).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(db_1.schema.assetGroups.workspaceId, ctx.workspaceId), (0, drizzle_orm_1.eq)(db_1.schema.assetGroups.isActive, true), (0, drizzle_orm_1.eq)(db_1.schema.assetGroups.verticalId, input.verticalId)));
        if (groups.length === 0)
            return [];
        const groupIds = groups.map(g => g.id);
        // Traer los assets que pertenecen a estos grupos
        const relatedAssets = await db_1.db.select({
            id: db_1.schema.assets.id,
            groupId: db_1.schema.assets.groupId,
            status: db_1.schema.assets.status,
        }).from(db_1.schema.assets).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(db_1.schema.assets.workspaceId, ctx.workspaceId), (0, drizzle_orm_1.inArray)(db_1.schema.assets.groupId, groupIds)));
        return groups.map(group => {
            const agroup = { ...group };
            const linked = relatedAssets.filter(a => a.groupId === group.id);
            return {
                ...agroup,
                assets: linked,
                totalActive: linked.filter(a => a.status === 'active').length
            };
        });
    }),
    /**
     * create
     * Crea un nuevo AssetGroup lógico ("Lote", "Corral", "Embarque") y asigna un label.
     */
    create: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        name: zod_1.z.string(),
        verticalId: zod_1.z.string().default('livestock'),
        initialQuantity: zod_1.z.number().default(0),
        metadata: zod_1.z.record(zod_1.z.any()).optional().default({})
    }))
        .mutation(async ({ ctx, input }) => {
        const [newGroup] = await db_1.db.insert(db_1.schema.assetGroups).values({
            workspaceId: ctx.workspaceId,
            name: input.name,
            verticalId: input.verticalId,
            quantity: input.initialQuantity,
            metadata: input.metadata,
            isActive: true
        }).returning();
        return newGroup;
    }),
    /**
     * addAssets
     * Vincular un grupo de Assets individuales a un AssetGroup específico.
     * Esto asume que todos los assets pertenecen al mismo workspace
     */
    addAssets: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        groupId: zod_1.z.string(),
        assetIds: zod_1.z.array(zod_1.z.string())
    }))
        .mutation(async ({ ctx, input }) => {
        // 1. Validar propiedad del grupo
        const [group] = await db_1.db.select().from(db_1.schema.assetGroups).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(db_1.schema.assetGroups.id, input.groupId), (0, drizzle_orm_1.eq)(db_1.schema.assetGroups.workspaceId, ctx.workspaceId))).limit(1);
        if (!group) {
            throw new server_1.TRPCError({ code: 'NOT_FOUND', message: 'Asset Group not found' });
        }
        // 2. Actualizar assets
        if (input.assetIds.length > 0) {
            await db_1.db.update(db_1.schema.assets).set({
                groupId: input.groupId,
                updatedAt: new Date()
            }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(db_1.schema.assets.workspaceId, ctx.workspaceId), (0, drizzle_orm_1.inArray)(db_1.schema.assets.id, input.assetIds)));
        }
        return { success: true, count: input.assetIds.length };
    }),
    /**
     * dissolve
     * Marca el grupo como disuelto (isActive=false) y remueve el groupId de sus assets,
     * permitiendo que los activos vuelvan a ser tratados puramente de forma individual,
     * manteniendo el rastro histórico a traves de los eventos.
     */
    dissolve: trpc_1.protectedProcedure
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .mutation(async ({ ctx, input }) => {
        // 1. Update group to active = false
        const [updated] = await db_1.db.update(db_1.schema.assetGroups).set({
            isActive: false,
            updatedAt: new Date()
        }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(db_1.schema.assetGroups.id, input.id), (0, drizzle_orm_1.eq)(db_1.schema.assetGroups.workspaceId, ctx.workspaceId))).returning();
        if (!updated) {
            throw new server_1.TRPCError({ code: 'NOT_FOUND', message: 'Group not found or unauthorized' });
        }
        // 2. Clear groupId in related assets
        await db_1.db.update(db_1.schema.assets).set({
            groupId: null,
            updatedAt: new Date()
        }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(db_1.schema.assets.groupId, input.id), (0, drizzle_orm_1.eq)(db_1.schema.assets.workspaceId, ctx.workspaceId)));
        return { success: true, dissolvedGroup: updated.id };
    })
});
//# sourceMappingURL=assetGroups.js.map