"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pensRouter = void 0;
const zod_1 = require("zod");
const server_1 = require("@trpc/server");
const trpc_1 = require("../trpc");
const schema_1 = require("@biffco/db/schema");
const db_1 = require("@biffco/db");
const rbac_1 = require("@biffco/core/rbac");
exports.pensRouter = (0, trpc_1.router)({
    create: (0, trpc_1.requirePermission)(rbac_1.Permission.ZONES_MANAGE)
        .input(zod_1.z.object({
        facilityId: zod_1.z.string(),
        zoneId: zod_1.z.string().optional(),
        name: zod_1.z.string().min(1),
        capacity: zod_1.z.number().int().positive().optional(),
    }))
        .mutation(async ({ input, ctx }) => {
        const { db, workspaceId } = ctx;
        const facility = await db.query.facilities.findFirst({
            where: (0, db_1.and)((0, db_1.eq)(schema_1.facilities.id, input.facilityId), (0, db_1.eq)(schema_1.facilities.workspaceId, workspaceId))
        });
        if (!facility)
            throw new server_1.TRPCError({ code: "NOT_FOUND", message: "Facility no encontrada" });
        if (input.zoneId) {
            const zone = await db.query.zones.findFirst({
                where: (0, db_1.and)((0, db_1.eq)(schema_1.zones.id, input.zoneId), (0, db_1.eq)(schema_1.zones.workspaceId, workspaceId))
            });
            if (!zone)
                throw new server_1.TRPCError({ code: "NOT_FOUND", message: "Zone no encontrada" });
            if (zone.facilityId !== input.facilityId) {
                throw new server_1.TRPCError({ code: "BAD_REQUEST", message: "Zone no pertenece a facility indicada" });
            }
        }
        const [pen] = await db.insert(schema_1.pens).values({
            workspaceId: workspaceId,
            facilityId: input.facilityId,
            zoneId: input.zoneId,
            name: input.name,
            capacity: input.capacity?.toString(),
            currentOccupancy: '0',
        }).returning();
        return pen;
    }),
    list: trpc_1.protectedProcedure
        .query(async ({ ctx }) => {
        return ctx.db.select().from(schema_1.pens).where((0, db_1.eq)(schema_1.pens.workspaceId, ctx.workspaceId));
    }),
    getById: trpc_1.protectedProcedure
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .query(async ({ input, ctx }) => {
        const pen = await ctx.db.query.pens.findFirst({
            where: (0, db_1.and)((0, db_1.eq)(schema_1.pens.id, input.id), (0, db_1.eq)(schema_1.pens.workspaceId, ctx.workspaceId))
        });
        if (!pen)
            throw new server_1.TRPCError({ code: "NOT_FOUND" });
        return pen;
    }),
    updateOccupancy: (0, trpc_1.requirePermission)(rbac_1.Permission.ASSETS_CREATE) // or appropriate role
        .input(zod_1.z.object({ id: zod_1.z.string(), delta: zod_1.z.number().int() }))
        .mutation(async ({ input, ctx }) => {
        return ctx.db.transaction(async (tx) => {
            const pen = await tx.query.pens.findFirst({
                where: (0, db_1.and)((0, db_1.eq)(schema_1.pens.id, input.id), (0, db_1.eq)(schema_1.pens.workspaceId, ctx.workspaceId))
            });
            if (!pen)
                throw new server_1.TRPCError({ code: "NOT_FOUND" });
            const currentOcc = parseInt(pen.currentOccupancy, 10);
            const newOcc = currentOcc + input.delta;
            if (newOcc < 0) {
                throw new server_1.TRPCError({ code: "BAD_REQUEST", message: "Occupancy no puede ser negativo" });
            }
            if (pen.capacity) {
                const maxCap = parseInt(pen.capacity, 10);
                if (newOcc > maxCap) {
                    throw new server_1.TRPCError({ code: "BAD_REQUEST", message: "Capacidad excedida" });
                }
            }
            const [updated] = await tx.update(schema_1.pens)
                .set({ currentOccupancy: newOcc.toString() })
                .where((0, db_1.eq)(schema_1.pens.id, input.id))
                .returning();
            return updated;
        });
    })
});
//# sourceMappingURL=pens.js.map