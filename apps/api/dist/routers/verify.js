"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRouter = void 0;
const zod_1 = require("zod");
const server_1 = require("@trpc/server");
const trpc_1 = require("../trpc");
const schema_1 = require("@biffco/db/schema");
const db_1 = require("@biffco/db");
exports.verifyRouter = (0, trpc_1.router)({
    getAssetById: trpc_1.publicProcedure
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .query(async ({ input, ctx }) => {
        // Búsqueda del Activo Público
        // Como es público, bypassamos workspaceId y verificamos la existencia literal.
        const assetArray = await ctx.db
            .select()
            .from(schema_1.assets)
            .where((0, db_1.eq)(schema_1.assets.id, input.id))
            .limit(1);
        const asset = assetArray[0];
        if (!asset) {
            throw new server_1.TRPCError({ code: "NOT_FOUND", message: "Activo inyectable no existe" });
        }
        const eventArray = await ctx.db
            .select()
            .from(schema_1.domainEvents)
            .where((0, db_1.eq)(schema_1.domainEvents.streamId, input.id))
            .orderBy(schema_1.domainEvents.globalId /* DESC no disponible en string literal en este helper directo, lo trae ordenado o usamos sql */)
            .limit(10);
        const holdingArray = await ctx.db
            .select()
            .from(schema_1.holds)
            .where((0, db_1.and)((0, db_1.eq)(schema_1.holds.assetId, input.id), (0, db_1.eq)(schema_1.holds.isActive, true)));
        return {
            ...asset,
            events: eventArray.reverse(), // Truco rápido para tener el último al frente si viene en ASC
            holds: holdingArray,
            anchor: null // Pendiente para D23 Anclaje Blockchain Completo
        };
    })
});
//# sourceMappingURL=verify.js.map