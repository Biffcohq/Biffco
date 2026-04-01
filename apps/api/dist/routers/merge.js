"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeRouter = void 0;
const zod_1 = require("zod");
const server_1 = require("@trpc/server");
const trpc_1 = require("../trpc");
const schema_1 = require("@biffco/db/schema");
const db_1 = require("@biffco/db");
const rbac_1 = require("@biffco/core/rbac");
exports.mergeRouter = (0, trpc_1.router)({
    createMerge: (0, trpc_1.requirePermission)(rbac_1.Permission.ASSETS_CREATE)
        .input(zod_1.z.object({
        inputAssetIds: zod_1.z.array(zod_1.z.string()).min(2, "Se requieren al menos 2 activos para fusionar"),
        outputType: zod_1.z.string(), // "DoreBar", "BulkMineral", etc.
        outputMetadata: zod_1.z.record(zod_1.z.unknown()).optional()
    }))
        .mutation(async ({ input, ctx }) => {
        const { db, workspaceId, memberId } = ctx;
        if (!workspaceId) {
            throw new server_1.TRPCError({ code: "UNAUTHORIZED", message: "Missing Workspace" });
        }
        // Ensure no duplicates in input list
        const uniqueInputIds = Array.from(new Set(input.inputAssetIds));
        return await db.transaction(async (tx) => {
            // 1. Validar la existencia de TODOS los inputs
            const parentAssets = await tx.query.assets.findMany({
                where: (0, db_1.and)((0, db_1.inArray)(schema_1.assets.id, uniqueInputIds), (0, db_1.eq)(schema_1.assets.workspaceId, workspaceId))
            });
            if (parentAssets.length !== uniqueInputIds.length) {
                throw new server_1.TRPCError({ code: "NOT_FOUND", message: "Uno o más activos de origen no existen o no pertenecen a tu Workspace." });
            }
            const validStatuses = ['ACTIVE', 'LOCKED', 'QUARANTINE']; // Operable states
            const invalidParents = parentAssets.filter(p => !validStatuses.includes(p.status));
            if (invalidParents.length > 0) {
                throw new server_1.TRPCError({ code: "PRECONDITION_FAILED", message: `Los activos [${invalidParents.map(a => a.id).join(', ')}] no pueden ser fusionados (fueron faenados o clausurados).` });
            }
            // 2. Worst-case compliance (Obtener holds masivos de todos los padres)
            const parentHolds = await tx.query.holds.findMany({
                where: (0, db_1.and)((0, db_1.inArray)(schema_1.holds.assetId, uniqueInputIds), (0, db_1.eq)(schema_1.holds.isActive, true))
            });
            const hasHolds = parentHolds.length > 0;
            if (!parentAssets[0]) {
                throw new server_1.TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Error al resolver la vertical" });
            }
            // 3. Crear The Titan (El Super-Activo fusionado hijo)
            const [child] = await tx.insert(schema_1.assets).values({
                workspaceId: workspaceId,
                verticalId: parentAssets[0].verticalId, // Asumimos misma verticalidad
                type: input.outputType,
                status: hasHolds ? parentAssets.find(a => parentHolds.some(h => h.assetId === a.id))?.status || 'active' : 'active',
                parentIds: uniqueInputIds,
                metadata: {
                    ...input.outputMetadata,
                    isMergeResult: true
                }
            }).returning();
            if (!child) {
                throw new server_1.TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Falló la creación del activo" });
            }
            // 4. Copiar e Inyectar todos los Holds al Hijo
            if (hasHolds) {
                // Filtrar repeticiones (ej. mismo reason issue repetido)
                const distinctHolds = Array.from(new Map(parentHolds.map(h => [`${h.reason}-${h.issuerId}`, h])).values());
                for (const h of distinctHolds) {
                    await tx.insert(schema_1.holds).values({
                        assetId: child.id,
                        workspaceId: workspaceId,
                        reason: `HEREDADO TRAS MERGE: ${h.reason} (De Asset #${h.assetId})`,
                        issuerId: h.issuerId,
                        isActive: true
                    });
                }
            }
            // 5. Cierre Masivo y Prueba Irrefutable en Graph
            for (const parent of parentAssets) {
                await tx.update(schema_1.assets)
                    .set({ status: 'CLOSED_BY_MERGE' })
                    .where((0, db_1.eq)(schema_1.assets.id, parent.id));
                await tx.insert(schema_1.domainEvents).values({
                    workspaceId: workspaceId,
                    streamId: parent.id,
                    streamType: 'asset',
                    eventType: 'MERGE_INPUT_CONSUMED',
                    data: { outputChildId: child.id },
                    hash: `0xMERGE_IN_${parent.id}_${Date.now()}`,
                    signerId: memberId || "system"
                });
            }
            // Evento Biológico Final del Hijo
            await tx.insert(schema_1.domainEvents).values({
                workspaceId: workspaceId,
                streamId: child.id,
                streamType: 'asset',
                eventType: 'ASSET_BORN_FROM_MERGE',
                data: { parentIds: uniqueInputIds },
                hash: `0xCHILD_MERGE_${child.id}_${Date.now()}`,
                signerId: memberId || "system"
            });
            return {
                success: true,
                childId: child.id,
                consumedCount: parentAssets.length,
                holdsInherited: parentHolds.length
            };
        });
    })
});
//# sourceMappingURL=merge.js.map