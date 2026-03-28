"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zonesRouter = void 0;
const zod_1 = require("zod");
const server_1 = require("@trpc/server");
const trpc_1 = require("../trpc");
const schema_1 = require("@biffco/db/schema"); // zones en el playbook refieren a parcelas físicas
const drizzle_orm_1 = require("drizzle-orm");
const rbac_1 = require("@biffco/core/rbac");
exports.zonesRouter = (0, trpc_1.router)({
    create: (0, trpc_1.requirePermission)(rbac_1.Permission.ZONES_MANAGE)
        .input(zod_1.z.object({
        name: zod_1.z.string().min(1).max(100),
        areaHectares: zod_1.z.number().optional(),
        polygon: zod_1.z.object({
            type: zod_1.z.literal("Polygon"),
            coordinates: zod_1.z.array(zod_1.z.array(zod_1.z.array(zod_1.z.number()))),
        }).optional(),
    }))
        .mutation(async ({ input, ctx }) => {
        const { db, workspaceId } = ctx;
        // PostGIS validation
        let locationData = { type: "Polygon", coordinates: [] };
        if (input.polygon) {
            try {
                const result = await db.execute((0, drizzle_orm_1.sql) `SELECT ST_IsValid(ST_GeomFromGeoJSON(${JSON.stringify(input.polygon)})) as "isValid"`);
                const isValid = result[0]?.isValid ?? false;
                if (!isValid) {
                    throw new server_1.TRPCError({ code: "BAD_REQUEST", message: "Zone Polygon GeoJSON no es válido" });
                }
                locationData = input.polygon;
            }
            catch (error) {
                throw new server_1.TRPCError({ code: "BAD_REQUEST", message: "Error verificando la geometría PostGIS: " + error.message });
            }
        }
        const [parcel] = await db.insert(schema_1.parcels).values({
            workspaceId: workspaceId,
            name: input.name,
            areaHectares: input.areaHectares?.toString() ?? null,
            geoJson: locationData,
        }).returning();
        return parcel;
    }),
    list: trpc_1.protectedProcedure
        .query(async ({ ctx }) => {
        return ctx.db.select().from(schema_1.parcels).where((0, drizzle_orm_1.eq)(schema_1.parcels.workspaceId, ctx.workspaceId));
    }),
    getById: trpc_1.protectedProcedure
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .query(async ({ input, ctx }) => {
        const p = await ctx.db.query.parcels.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.parcels.id, input.id)
        });
        if (!p)
            throw new server_1.TRPCError({ code: "NOT_FOUND" });
        return p;
    }),
    update: (0, trpc_1.requirePermission)(rbac_1.Permission.ZONES_MANAGE)
        .input(zod_1.z.object({
        id: zod_1.z.string(),
        name: zod_1.z.string().min(1).max(100).optional(),
        isActive: zod_1.z.boolean().optional(),
    }))
        .mutation(async ({ input, ctx }) => {
        const { id, ...updates } = input;
        const [updated] = await ctx.db.update(schema_1.parcels)
            .set(updates)
            .where((0, drizzle_orm_1.eq)(schema_1.parcels.id, id))
            .returning();
        return updated;
    }),
});
//# sourceMappingURL=zones.js.map