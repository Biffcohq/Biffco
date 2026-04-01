"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assetsRouter = void 0;
const zod_1 = require("zod");
const server_1 = require("@trpc/server");
const trpc_1 = require("../trpc");
const schema_1 = require("@biffco/db/schema");
const db_1 = require("@biffco/db");
const rbac_1 = require("@biffco/core/rbac");
exports.assetsRouter = (0, trpc_1.router)({
    // Endpoint clave para el Dashboard: Listado de Activos
    list: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        limit: zod_1.z.number().min(1).max(100).default(50),
        cursor: zod_1.z.string().nullish(), // Para paginación
        status: zod_1.z.string().optional(),
        type: zod_1.z.string().optional()
    }).optional())
        .query(async ({ input, ctx }) => {
        // Filtrar siempre por workspaceId garantiza tenant isolation.
        // Se debe usar la base de datos para recuperar todos los activos correspondientes al workspace
        const conditions = [(0, db_1.eq)(schema_1.assets.workspaceId, ctx.workspaceId)];
        if (input?.status)
            conditions.push((0, db_1.eq)(schema_1.assets.status, input.status));
        if (input?.type)
            conditions.push((0, db_1.eq)(schema_1.assets.type, input.type));
        const items = await ctx.db.query.assets.findMany({
            where: (0, db_1.and)(...conditions),
            orderBy: (assets, { desc }) => [desc(assets.createdAt)],
            limit: input?.limit,
        });
        return items;
    }),
    // Vista de detalle: Trae el asset y sus últimos eventos
    getById: trpc_1.protectedProcedure
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .query(async ({ input, ctx }) => {
        const asset = await ctx.db.query.assets.findFirst({
            where: (0, db_1.and)((0, db_1.eq)(schema_1.assets.id, input.id), (0, db_1.eq)(schema_1.assets.workspaceId, ctx.workspaceId))
        });
        if (!asset) {
            throw new server_1.TRPCError({ code: "NOT_FOUND", message: "Activo no encontrado en este workspace" });
        }
        // Traer los últimos 10 eventos aplicados a este activo
        const assetEvents = await ctx.db.query.domainEvents.findMany({
            where: (0, db_1.eq)(schema_1.domainEvents.streamId, asset.id),
            orderBy: (domainEvents, { desc }) => [desc(domainEvents.createdAt)],
            limit: 10
        });
        return {
            ...asset,
            events: assetEvents
        };
    }),
    // Creación de un Asset puro inicial
    create: (0, trpc_1.requirePermission)(rbac_1.Permission.ASSETS_CREATE)
        .input(zod_1.z.object({
        type: zod_1.z.string(), // ejemplo: "Bovine", "DoreBar", "CoffeeSack"
        initialState: zod_1.z.record(zod_1.z.unknown()), // Estado inicial dinámico manejado por el VerticalPack
        externalId: zod_1.z.string().optional(),
        facilityId: zod_1.z.string().optional(),
        penId: zod_1.z.string().optional()
    }))
        .mutation(async ({ input, ctx }) => {
        const { db, workspaceId, verticalRegistry } = ctx;
        const workspace = await db.query.workspaces.findFirst({ where: (0, db_1.eq)(schema_1.workspaces.id, workspaceId) });
        if (!workspace)
            throw new server_1.TRPCError({ code: "NOT_FOUND" });
        // Delegar validación de tipo al VerticalPack activo
        const pack = verticalRegistry.get(workspace.verticalId);
        if (pack && pack.assetTypes && !pack.assetTypes.includes(input.type)) {
            throw new server_1.TRPCError({ code: "BAD_REQUEST", message: `Tipo de activo "${input.type}" no válido para el vertical "${workspace.verticalId}"` });
        }
        const [newAsset] = await ctx.db.insert(schema_1.assets).values({
            workspaceId: workspaceId,
            verticalId: workspace.verticalId,
            type: input.type,
            status: "ACTIVE", // Estatus por default al crear
            locationId: input.facilityId || input.penId || null,
            metadata: {
                initialState: input.initialState,
                externalId: input.externalId,
                facilityId: input.facilityId,
                penId: input.penId
            }
        }).returning();
        return newAsset;
    })
});
//# sourceMappingURL=assets.js.map