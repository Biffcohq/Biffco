"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventsRouter = void 0;
const zod_1 = require("zod");
const server_1 = require("@trpc/server");
const trpc_1 = require("../trpc");
const schema_1 = require("@biffco/db/schema");
const db_1 = require("@biffco/db");
const rbac_1 = require("@biffco/core/rbac");
exports.eventsRouter = (0, trpc_1.router)({
    // Endpoint clave para TRAZABILIDAD
    list: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        limit: zod_1.z.number().min(1).max(200).default(50),
        cursor: zod_1.z.string().nullish(),
        streamId: zod_1.z.string().optional(), // Puede ser el ID de un Asset
        eventType: zod_1.z.string().optional()
    }).optional())
        .query(async ({ input, ctx }) => {
        const conditions = [];
        // Tenant Isolation: solo listamos eventos del workspace actual
        conditions.push((0, db_1.eq)(schema_1.domainEvents.workspaceId, ctx.workspaceId));
        if (input?.streamId) {
            conditions.push((0, db_1.eq)(schema_1.domainEvents.streamId, input.streamId));
        }
        if (input?.eventType) {
            conditions.push((0, db_1.eq)(schema_1.domainEvents.eventType, input.eventType));
        }
        const items = await ctx.db.query.domainEvents.findMany({
            where: conditions.length > 0 ? (0, db_1.and)(...conditions) : undefined,
            orderBy: (domainEvents, { desc }) => [desc(domainEvents.createdAt)],
            limit: input?.limit,
        });
        return items;
    }),
    // APÉNDICE INMUTABLE: Agrega un evento a un 'stream' (Asset)
    append: (0, trpc_1.requirePermission)(rbac_1.Permission.EVENTS_APPEND) // Ajustando RBAC
        .input(zod_1.z.object({
        streamId: zod_1.z.string(),
        streamType: zod_1.z.enum(['asset', 'asset_group']).default('asset'),
        eventType: zod_1.z.string(),
        payload: zod_1.z.record(zod_1.z.unknown()),
        signature: zod_1.z.string().optional(),
        publicKey: zod_1.z.string().optional(),
        hash: zod_1.z.string(), // SHA-256 local
        previousHash: zod_1.z.string().optional()
    }))
        .mutation(async ({ input, ctx }) => {
        const { db, workspaceId, memberId } = ctx;
        if (!workspaceId) {
            throw new server_1.TRPCError({ code: "UNAUTHORIZED", message: "Missing Workspace" });
        }
        // 1. Verificar existencia y propiedad del asset en este workspace
        if (input.streamType === 'asset') {
            const asset = await db.query.assets.findFirst({
                where: (0, db_1.and)((0, db_1.eq)(schema_1.assets.id, input.streamId), (0, db_1.eq)(schema_1.assets.workspaceId, workspaceId))
            });
            if (!asset) {
                throw new server_1.TRPCError({ code: "NOT_FOUND", message: "Activo (Stream) no encontrado." });
            }
        }
        // 2. Validación Mock ED25519 (Lógica Placeholder)
        if (input.signature && input.publicKey) {
            const isValidSignature = true; // MOCK: Cambiar a ED25519Verify()
            if (!isValidSignature) {
                throw new server_1.TRPCError({ code: "UNAUTHORIZED", message: "Firma Criptográfica Inválida" });
            }
        }
        // 3. Persistir Evento en el Ledger
        const [newEvent] = await db.insert(schema_1.domainEvents).values({
            workspaceId: workspaceId,
            streamId: input.streamId,
            streamType: input.streamType,
            eventType: input.eventType,
            data: input.payload,
            signature: input.signature,
            hash: input.hash,
            previousHash: input.previousHash,
            signerId: memberId || "system"
        }).returning();
        // 4. Actualizar estado derivado del Asset en cascada si es necesario 
        // ej: si eventType = "QUARANTINE_APPLIED", db.update(assets).set({ status: "QUARANTINE" })
        return newEvent;
    }),
    // BATCH PROCESSING: Aplicar el mismo evento a N assets al mismo tiempo
    batch: (0, trpc_1.requirePermission)(rbac_1.Permission.EVENTS_APPEND)
        .input(zod_1.z.object({
        streamIds: zod_1.z.array(zod_1.z.string()).min(1),
        eventType: zod_1.z.string(),
        payload: zod_1.z.record(zod_1.z.unknown()),
        correlationId: zod_1.z.string().optional() // ID para tracking del batch completo
    }))
        .mutation(async ({ input }) => {
        // Lógica para Batch Events a desarrollar en el siguiente paso logístico
        return { success: true, processed: input.streamIds.length };
    })
});
//# sourceMappingURL=events.js.map