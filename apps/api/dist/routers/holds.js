"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.holdsRouter = void 0;
const zod_1 = require("zod");
const server_1 = require("@trpc/server");
const trpc_1 = require("../trpc");
const schema_1 = require("@biffco/db/schema");
const db_1 = require("@biffco/db");
const rbac_1 = require("@biffco/core/rbac");
exports.holdsRouter = (0, trpc_1.router)({
    // 1. Dashboard de Inspectores: Ver todas las cuarentenas del tenant
    list: trpc_1.protectedProcedure
        .query(async ({ ctx }) => {
        const { db, workspaceId } = ctx;
        return await db.query.holds.findMany({
            where: (0, db_1.eq)(schema_1.holds.workspaceId, workspaceId),
            orderBy: (holds, { desc }) => [desc(holds.createdAt)],
        });
    }),
    // 2. IMPONER CUARENTENA MANUAL
    impose: (0, trpc_1.requirePermission)(rbac_1.Permission.HOLDS_IMPOSE)
        .input(zod_1.z.object({
        assetId: zod_1.z.string(),
        reason: zod_1.z.string().min(5, "Debes justificar la clausura sanitara/legal.")
    }))
        .mutation(async ({ input, ctx }) => {
        const { db, workspaceId, memberId } = ctx;
        return await db.transaction(async (tx) => {
            // Encontrar el activo a bloquear
            const targetAsset = await tx.query.assets.findFirst({
                where: (0, db_1.and)((0, db_1.eq)(schema_1.assets.id, input.assetId), (0, db_1.eq)(schema_1.assets.workspaceId, workspaceId))
            });
            if (!targetAsset) {
                throw new server_1.TRPCError({ code: "NOT_FOUND", message: "El activo no existe." });
            }
            if (targetAsset.status === 'SLAUGHTERED' || targetAsset.status === 'CLOSED_BY_SPLIT' || targetAsset.status === 'CLOSED_BY_MERGE') {
                throw new server_1.TRPCError({ code: "PRECONDITION_FAILED", message: "Activo inoperativo. No se puede imponer cuarentena sobre historia muerta." });
            }
            // Registrar el Hold Activo
            const [newHold] = await tx.insert(schema_1.holds).values({
                assetId: targetAsset.id,
                workspaceId: workspaceId,
                reason: input.reason,
                issuerId: memberId || "system",
                isActive: true
            }).returning();
            if (!newHold) {
                throw new server_1.TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Fallo al registrar la cuarentena física." });
            }
            // Alterar estado biológico del activo
            await tx.update(schema_1.assets)
                .set({ status: 'QUARANTINE' })
                .where((0, db_1.eq)(schema_1.assets.id, targetAsset.id));
            // Inmutabilidad (Hash Log)
            await tx.insert(schema_1.domainEvents).values({
                workspaceId: workspaceId,
                streamId: targetAsset.id,
                streamType: 'asset',
                eventType: 'HOLD_IMPOSED',
                data: { holdId: newHold.id, reason: input.reason },
                hash: `0xIMPOSE_${newHold.id}_${Date.now()}`,
                signerId: memberId || "system"
            });
            return newHold;
        });
    }),
    // 3. LEVANTAR CUARENTENA MANUAL (Absolución)
    lift: (0, trpc_1.requirePermission)(rbac_1.Permission.HOLDS_LIFT)
        .input(zod_1.z.object({
        holdId: zod_1.z.string(),
        reason: zod_1.z.string().optional() // Motivo técnico de la liberación
    }))
        .mutation(async ({ input, ctx }) => {
        const { db, workspaceId, memberId } = ctx;
        return await db.transaction(async (tx) => {
            const targetHold = await tx.query.holds.findFirst({
                where: (0, db_1.and)((0, db_1.eq)(schema_1.holds.id, input.holdId), (0, db_1.eq)(schema_1.holds.workspaceId, workspaceId))
            });
            if (!targetHold || !targetHold.isActive) {
                throw new server_1.TRPCError({ code: "NOT_FOUND", message: "Cuarentena no encontrada o ya estaba inactiva." });
            }
            // Levantar clausura
            await tx.update(schema_1.holds)
                .set({ isActive: false })
                .where((0, db_1.eq)(schema_1.holds.id, targetHold.id));
            // Revisar si quedaron OTRAS cuarentenas hermanas activas en este mismo activo
            const remainingHolds = await tx.query.holds.findMany({
                where: (0, db_1.and)((0, db_1.eq)(schema_1.holds.assetId, targetHold.assetId), (0, db_1.eq)(schema_1.holds.isActive, true))
            });
            if (remainingHolds.length === 0) {
                // Si ya no quedan infecciones, el activo es declarado SANO nuevamente
                await tx.update(schema_1.assets)
                    .set({ status: 'ACTIVE' }) // Retorna al estado operativo basal
                    .where((0, db_1.eq)(schema_1.assets.id, targetHold.assetId));
            }
            // Inmutabilidad
            await tx.insert(schema_1.domainEvents).values({
                workspaceId: workspaceId,
                streamId: targetHold.assetId,
                streamType: 'asset',
                eventType: 'HOLD_LIFTED',
                data: { holdId: targetHold.id, resolutionDetails: input.reason },
                hash: `0xLIFT_${targetHold.id}_${Date.now()}`,
                signerId: memberId || "system"
            });
            return { success: true, remainedInQuarantine: remainingHolds.length > 0 };
        });
    })
});
//# sourceMappingURL=holds.js.map