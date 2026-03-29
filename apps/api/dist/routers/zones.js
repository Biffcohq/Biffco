"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zonesRouter = void 0;
const zod_1 = require("zod");
const server_1 = require("@trpc/server");
const trpc_1 = require("../trpc");
const schema_1 = require("@biffco/db/schema");
const db_1 = require("@biffco/db");
const rbac_1 = require("@biffco/core/rbac");
exports.zonesRouter = (0, trpc_1.router)({
    create: (0, trpc_1.requirePermission)(rbac_1.Permission.ZONES_MANAGE)
        .input(zod_1.z.object({
        facilityId: zod_1.z.string(),
        name: zod_1.z.string().min(1).max(100),
        type: zod_1.z.string(),
        capacity: zod_1.z.number().int().positive().optional(),
        polygon: zod_1.z.object({
            type: zod_1.z.literal("Polygon"),
            coordinates: zod_1.z.array(zod_1.z.array(zod_1.z.array(zod_1.z.number()))),
        }).optional(),
    }))
        .mutation(async ({ input, ctx }) => {
        const { db, workspaceId } = ctx;
        const facility = await db.query.facilities.findFirst({
            where: (0, db_1.and)((0, db_1.eq)(schema_1.facilities.id, input.facilityId), (0, db_1.eq)(schema_1.facilities.workspaceId, workspaceId))
        });
        if (!facility)
            throw new server_1.TRPCError({ code: "NOT_FOUND", message: "Facility not found" });
        if (input.polygon) {
            try {
                const result = await db.execute((0, db_1.sql) `SELECT ST_IsValid(ST_GeomFromGeoJSON(${JSON.stringify(input.polygon)})) as "isValid", ST_IsValidReason(ST_GeomFromGeoJSON(${JSON.stringify(input.polygon)})) as reason`);
                const isValid = result[0]?.isValid ?? false;
                if (!isValid) {
                    throw new server_1.TRPCError({ code: "BAD_REQUEST", message: `Polígono inválido: ${result[0]?.reason ?? "Self-intersection"}` });
                }
            }
            catch (error) {
                throw new server_1.TRPCError({ code: "BAD_REQUEST", message: "Error verificando la geometría PostGIS: " + error.message });
            }
        }
        const [zone] = await db.insert(schema_1.zones).values({
            workspaceId: workspaceId,
            facilityId: input.facilityId,
            name: input.name,
            type: input.type,
            capacity: input.capacity?.toString() ?? null,
            polygon: input.polygon ? input.polygon : null,
            gfwStatus: 'pending',
        }).returning();
        return zone;
    }),
    list: trpc_1.protectedProcedure
        .query(async ({ ctx }) => {
        return ctx.db.select().from(schema_1.zones).where((0, db_1.eq)(schema_1.zones.workspaceId, ctx.workspaceId));
    }),
    getById: trpc_1.protectedProcedure
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .query(async ({ input, ctx }) => {
        const zEntity = await ctx.db.query.zones.findFirst({
            where: (0, db_1.and)((0, db_1.eq)(schema_1.zones.id, input.id), (0, db_1.eq)(schema_1.zones.workspaceId, ctx.workspaceId))
        });
        if (!zEntity)
            throw new server_1.TRPCError({ code: "NOT_FOUND" });
        return zEntity;
    }),
    update: (0, trpc_1.requirePermission)(rbac_1.Permission.ZONES_MANAGE)
        .input(zod_1.z.object({
        id: zod_1.z.string(),
        name: zod_1.z.string().min(1).max(100).optional(),
        isActive: zod_1.z.boolean().optional(),
    }))
        .mutation(async ({ input, ctx }) => {
        const { id, ...updates } = input;
        const [updated] = await ctx.db.update(schema_1.zones)
            .set(updates)
            .where((0, db_1.and)((0, db_1.eq)(schema_1.zones.id, id), (0, db_1.eq)(schema_1.zones.workspaceId, ctx.workspaceId)))
            .returning();
        return updated;
    }),
});
//# sourceMappingURL=zones.js.map