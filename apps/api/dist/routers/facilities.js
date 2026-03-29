"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.facilitiesRouter = void 0;
const zod_1 = require("zod");
const server_1 = require("@trpc/server");
const trpc_1 = require("../trpc");
const schema_1 = require("@biffco/db/schema");
const db_1 = require("@biffco/db");
const rbac_1 = require("@biffco/core/rbac");
exports.facilitiesRouter = (0, trpc_1.router)({
    create: (0, trpc_1.requirePermission)(rbac_1.Permission.FACILITIES_MANAGE)
        .input(zod_1.z.object({
        name: zod_1.z.string().min(1).max(100),
        type: zod_1.z.string(), // El tipo válido lo valida el VerticalPack
        licenseNumber: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
        country: zod_1.z.string().default("AR"),
        // Polígono GeoJSON opcional — se valida con ST_IsValid en PostGIS
        polygon: zod_1.z.object({
            type: zod_1.z.literal("Polygon"),
            coordinates: zod_1.z.array(zod_1.z.array(zod_1.z.array(zod_1.z.number()))),
        }).optional(),
    }))
        .mutation(async ({ input, ctx }) => {
        const { db, workspaceId, verticalRegistry } = ctx;
        const workspace = await db.query.workspaces.findFirst({ where: (0, db_1.eq)(schema_1.workspaces.id, workspaceId) });
        const pack = verticalRegistry.get(workspace.verticalId);
        if (pack && pack.facilityTypes && !pack.facilityTypes.includes(input.type)) {
            throw new server_1.TRPCError({ code: "BAD_REQUEST", message: `Tipo "${input.type}" no válido para el vertical "${workspace.verticalId}"` });
        }
        // 2. Si hay polígono, validar con PostGIS
        if (input.polygon) {
            try {
                const result = await db.execute((0, db_1.sql) `SELECT ST_IsValid(ST_GeomFromGeoJSON(${JSON.stringify(input.polygon)})) as "isValid"`);
                const isValid = result[0]?.isValid ?? false;
                if (!isValid) {
                    throw new server_1.TRPCError({ code: "BAD_REQUEST", message: "El polígono GeoJSON no es válido" });
                }
            }
            catch (error) {
                // Si PostGIS no está instalado o hay un error de parseo devuelto por PostgreSQL
                throw new server_1.TRPCError({ code: "BAD_REQUEST", message: "Error verificando la geometría: " + error.message });
            }
        }
        // 3. Crear el Facility (usando location jsonb temporalmente si fallback a PostGIS full column no es soportado en DB schema actual)
        const locationData = input.polygon ? input.polygon : { type: "Point", coordinates: [0, 0] };
        const [facility] = await db.insert(schema_1.facilities).values({
            workspaceId: workspaceId,
            name: input.name,
            type: input.type,
            // Usamos locationData en el schema actual que define location jsonb
            location: locationData,
        }).returning();
        return facility;
    }),
    list: trpc_1.protectedProcedure
        .query(async ({ ctx }) => {
        // Filtrar siempre por workspaceId garantiza tenant isolation. El RLS en db tmb intercede.
        return ctx.db.select().from(schema_1.facilities).where((0, db_1.eq)(schema_1.facilities.workspaceId, ctx.workspaceId));
    }),
    getById: trpc_1.protectedProcedure
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .query(async ({ input, ctx }) => {
        const facility = await ctx.db.query.facilities.findFirst({
            where: (0, db_1.and)((0, db_1.eq)(schema_1.facilities.id, input.id), (0, db_1.eq)(schema_1.facilities.workspaceId, ctx.workspaceId)),
            with: {
            // Note: To use 'with' queries securely, ensure Drizzle relations are defined,
            // manually fetching otherwise if relations aren't configured in schema index.
            }
        });
        if (!facility)
            throw new server_1.TRPCError({ code: "NOT_FOUND" });
        // Fetch zones and pens manually since Drizzle relations might not be setup
        const facilityZones = await ctx.db.query.zones.findMany({
            where: (0, db_1.eq)(schema_1.zones.facilityId, facility.id)
        });
        const facilityPens = await ctx.db.query.pens.findMany({
            where: (0, db_1.eq)(schema_1.pens.facilityId, facility.id)
        });
        return {
            ...facility,
            zones: facilityZones.map(z => ({
                ...z,
                pens: facilityPens.filter(p => p.zoneId === z.id)
            }))
        };
    }),
    update: (0, trpc_1.requirePermission)(rbac_1.Permission.FACILITIES_MANAGE)
        .input(zod_1.z.object({
        id: zod_1.z.string(),
        name: zod_1.z.string().min(1).max(100).optional(),
        isActive: zod_1.z.boolean().optional(),
    }))
        .mutation(async ({ input, ctx }) => {
        const { id, ...updates } = input;
        const [updated] = await ctx.db.update(schema_1.facilities)
            .set(updates)
            .where((0, db_1.eq)(schema_1.facilities.id, id))
            .returning();
        return updated;
    }),
});
//# sourceMappingURL=facilities.js.map