import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, requirePermission } from '../trpc';
import { assets, domainEvents, holds } from '@biffco/db/schema';
import { eq, inArray, and } from '@biffco/db';
import { Permission } from '@biffco/core/rbac';

export const transformationsRouter = router({
  
  // Transform or Split Assets
  transform: requirePermission(Permission.ASSETS_TRANSFORM)
    .input(z.object({
      sourceAssetIds: z.array(z.string()).min(1, "Debe haber al menos 1 activo origen"),
      outputs: z.array(z.object({
        type: z.string(),
        quantity: z.number().min(1).default(1),
        metadata: z.record(z.any()).default({})
      })).min(1, "Debe haber al menos 1 activo destino configurado"),
      memo: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, workspaceId, memberId } = ctx;
      if (!workspaceId) {
         throw new TRPCError({ code: "UNAUTHORIZED", message: "Missing Workspace" })
      }

      // Usar transacción para atomicidad total
      return await db.transaction(async (tx) => {
        
        // 1. Verificar orígenes (activos, mismo workspace, no bloqueados)
        const sourceAssets = await tx.select()
          .from(assets)
          .where(
            and(
              inArray(assets.id, input.sourceAssetIds),
              eq(assets.workspaceId, workspaceId)
            )
          );

        if (sourceAssets.length !== input.sourceAssetIds.length) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Algunos activos de origen no existen o no pertenecen a tu organización" });
        }

        const inactiveCount = sourceAssets.filter(a => a.status !== 'active').length;
        if (inactiveCount > 0) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Algunos activos de origen no están Activos (probablemente ya fueron consumidos o transformados)" });
        }
        
        // Check holds
        const activeHolds = await tx.select()
          .from(holds)
          .where(
            and(
              inArray(holds.assetId, input.sourceAssetIds),
              eq(holds.isActive, true)
            )
          );
          
        if (activeHolds.length > 0) {
          throw new TRPCError({ code: "FORBIDDEN", message: "No se puede transformar activos que se encuentren inhibidos (Hold)." });
        }

        const now = new Date();
        const verticalId = sourceAssets[0]?.verticalId; // Asumimos misma verticalidad genérica

        // 2. Marcar padres como Consumidos
        await tx.update(assets)
          .set({ status: 'consumed', updatedAt: now })
          .where(inArray(assets.id, input.sourceAssetIds));

        // 3. Generar eventos para Padres
        const parentEvents = sourceAssets.map(parent => ({
          workspaceId: workspaceId,
          streamId: parent.id,
          streamType: 'asset',
          eventType: 'ASSET_TRANSFORMED',
          data: {
            message: input.memo || "Activo consumido en proceso logístico o industrial",
            transformedAt: now.toISOString(),
            outputCount: input.outputs.length
          },
          hash: `fake-server-hash-parent-${parent.id}-${now.getTime()}`, // TODO: Firma real del The Edge o Server Key
          signerId: memberId || 'system'
        }));

        await tx.insert(domainEvents).values(parentEvents);

        // 4. Crear Hijos
        const newAssetRows: any[] = [];
        
        for (const out of input.outputs) {
           for (let i = 0; i < out.quantity; i++) {
             newAssetRows.push({
               workspaceId: workspaceId,
               verticalId: verticalId,
               type: out.type,
               status: 'active',
               metadata: out.metadata,
               parentIds: input.sourceAssetIds // [Genealogía / Lineage]
             });
           }
        }

        const createdAssets = await tx.insert(assets).values(newAssetRows).returning({ id: assets.id });

        // 5. Generar eventos de Nacimiento para Hijos
        const childEvents = createdAssets.map(child => ({
          workspaceId: workspaceId,
          streamId: child.id,
          streamType: 'asset',
          eventType: 'ASSET_BORN_FROM_TRANSFORMATION',
          data: {
            message: input.memo || "Activo derivado de lote industrial. Ver parent_ids para genealogía.",
            parentIds: input.sourceAssetIds,
            bornAt: now.toISOString()
          },
          hash: `fake-server-hash-child-${child.id}-${now.getTime()}`,
          signerId: memberId || 'system'
        }));

        await tx.insert(domainEvents).values(childEvents);

        return {
          success: true,
          consumedCount: input.sourceAssetIds.length,
          createdIds: createdAssets.map(a => a.id)
        };
      });
    })
});
