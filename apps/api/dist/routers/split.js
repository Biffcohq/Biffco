"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitRouter = void 0;
const zod_1 = require("zod");
const server_1 = require("@trpc/server");
const trpc_1 = require("../trpc");
const schema_1 = require("@biffco/db/schema");
const db_1 = require("@biffco/db");
const rbac_1 = require("@biffco/core/rbac");
exports.splitRouter = (0, trpc_1.router)({
    createSplit: (0, trpc_1.requirePermission)(rbac_1.Permission.ASSETS_CREATE)
        .input(zod_1.z.object({
        inputAssetId: zod_1.z.string(),
        outputAllocations: zod_1.z.array(zod_1.z.object({
            quantity: zod_1.z.number().optional(),
            metadata: zod_1.z.record(zod_1.z.unknown()).optional()
        })).min(1)
    }))
        .mutation(async ({ input, ctx }) => {
        const { db, workspaceId, memberId } = ctx;
        if (!workspaceId) {
            throw new server_1.TRPCError({ code: "UNAUTHORIZED", message: "Missing Workspace" });
        }
        // Toda la lógica de Split DEBE ser atómica
        return await db.transaction(async (tx) => {
            // 1. Validar existencia y propiedad del Activo Padre
            const parentAsset = await tx.query.assets.findFirst({
                where: (0, db_1.and)((0, db_1.eq)(schema_1.assets.id, input.inputAssetId), (0, db_1.eq)(schema_1.assets.workspaceId, workspaceId))
            });
            if (!parentAsset) {
                throw new server_1.TRPCError({ code: "NOT_FOUND", message: "Activo Padre no encontrado o no pertenece a este Workspace." });
            }
            if (parentAsset.status === 'CLOSED_BY_SPLIT' || parentAsset.status === 'SLAUGHTERED') {
                throw new server_1.TRPCError({ code: "PRECONDITION_FAILED", message: "El activo padre ya no se encuentra operativo." });
            }
            // 2. Marcar al padre como "Cerrado por Fraccionamiento"
            await tx.update(schema_1.assets)
                .set({ status: 'CLOSED_BY_SPLIT' })
                .where((0, db_1.eq)(schema_1.assets.id, parentAsset.id));
            // 3. Registrar Evento de Cierre en el Padre (Proof of Closure)
            await tx.insert(schema_1.domainEvents).values({
                workspaceId: workspaceId,
                streamId: parentAsset.id,
                streamType: 'asset',
                eventType: 'SPLIT_EXECUTED',
                data: { outputCount: input.outputAllocations.length },
                hash: `0xSPLIT_${parentAsset.id}_${Date.now()}`, // Dummy hash, en prod va sha-256
                signerId: memberId || "system"
            });
            // 4. Worst-case Compliance Inheritance: Interrogar Holds
            const parentHolds = await tx.query.holds.findMany({
                where: (0, db_1.and)((0, db_1.eq)(schema_1.holds.assetId, parentAsset.id), (0, db_1.eq)(schema_1.holds.isActive, true))
            });
            const createdChildren = [];
            // 5. Instanciar los Hijos (Outputs)
            for (const allocation of input.outputAllocations) {
                // Mantener Agnosticismo: El volumen/peso viene dentro de metadatos o allocation puro. Core no lo interroga.
                const [child] = await tx.insert(schema_1.assets).values({
                    workspaceId: workspaceId,
                    verticalId: parentAsset.verticalId,
                    type: parentAsset.type,
                    status: parentHolds.length > 0 ? parentAsset.status : 'active', // Hereda el status pesado (LOCKED/QUARANTINE) si aplica
                    parentIds: [parentAsset.id],
                    metadata: {
                        ...parentAsset.metadata,
                        ...allocation.metadata,
                        derivedFromAllocation: allocation.quantity
                    }
                }).returning();
                if (!child) {
                    throw new server_1.TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Falló la creación de las fracciones" });
                }
                createdChildren.push(child);
                // 6. Si el padre tiene Holds, el hijo obligatoriamente los copia intactos (Cápsula ineludible)
                if (parentHolds.length > 0) {
                    for (const h of parentHolds) {
                        await tx.insert(schema_1.holds).values({
                            assetId: child.id,
                            workspaceId: workspaceId,
                            reason: `HEREDADO DE SPLIT: ${h.reason}`,
                            issuerId: h.issuerId,
                            isActive: true
                        });
                    }
                }
                // 7. Evento de Origen en el Hijo
                await tx.insert(schema_1.domainEvents).values({
                    workspaceId: workspaceId,
                    streamId: child.id,
                    streamType: 'asset',
                    eventType: 'ASSET_BORN_FROM_SPLIT',
                    data: { parentId: parentAsset.id },
                    hash: `0xCHILD_${child.id}_${Date.now()}`,
                    signerId: memberId || "system"
                });
            }
            return {
                success: true,
                parent: parentAsset.id,
                childrenCount: createdChildren.length,
                holdsInherited: parentHolds.length
            };
        });
    })
});
//# sourceMappingURL=split.js.map