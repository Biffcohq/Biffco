import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { publicProcedure, router } from '../trpc';
import { assets, domainEvents, holds, anchoredEvents, anchorsLog } from '@biffco/db/schema';
import { eq, and } from '@biffco/db';
import { sql } from 'drizzle-orm';
import { getSignedUrl as getCloudFrontSignedUrl } from '@aws-sdk/cloudfront-signer';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl as getS3SignedUrl } from '@aws-sdk/s3-request-presigner';

// eslint-disable-next-line no-undef
const s3Client = new S3Client({ region: process.env.NEXT_PUBLIC_S3_REGION || 'us-east-1' });

export const verifyRouter = router({
  getAssetById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      // Búsqueda del Activo Público
      // Como es público, bypassamos workspaceId y verificamos la existencia literal.
      const assetArray = await ctx.db
        .select()
        .from(assets)
        .where(eq(assets.id, input.id))
        .limit(1);

      const asset = assetArray[0];
      if (!asset) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Activo inyectable no existe" });
      }

      const rawEvents = await ctx.db
        .select({
          event: domainEvents,
          anchorHash: anchorsLog.polygonTxHash
        })
        .from(domainEvents)
        .leftJoin(anchoredEvents, eq(domainEvents.id, anchoredEvents.eventId))
        .leftJoin(anchorsLog, eq(anchoredEvents.anchorId, anchorsLog.id))
        .where(eq(domainEvents.streamId, input.id))
        .orderBy(domainEvents.globalId)
        .limit(10);
        
      const eventArray = rawEvents.map(r => ({ ...r.event, anchorTxHash: r.anchorHash }));

      const holdingArray = await ctx.db
        .select()
        .from(holds)
        .where(and(eq(holds.assetId, input.id), eq(holds.isActive, true)));

      return {
        ...asset,
        events: eventArray.reverse(), // Truco rápido para tener el último al frente si viene en ASC
        holds: holdingArray,
        anchor: null // Pendiente para D23 Anclaje Blockchain Completo
      };
    }),

  // Día 23: Graph Lineage Fetch
  getLineageGraph: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      // 1. Traverse Forwards (Descendants)
      const descendants = await ctx.db.execute<{id: string, parent_ids: string[], type: string, group_id: string | null}>(sql`
        WITH RECURSIVE lineage AS (
          SELECT id, parent_ids, type, group_id FROM assets WHERE id = ${input.id}
          UNION ALL
          SELECT a.id, a.parent_ids, a.type, a.group_id FROM assets a
          INNER JOIN lineage l ON a.parent_ids @> jsonb_build_array(l.id)
        )
        SELECT id, parent_ids, type, group_id FROM lineage LIMIT 500
      `);

      // 2. Traverse Backwards (Ancestors)
      const ancestors = await ctx.db.execute<{id: string, parent_ids: string[], type: string, group_id: string | null}>(sql`
        WITH RECURSIVE lineage AS (
          SELECT id, parent_ids, type, group_id FROM assets WHERE id = ${input.id}
          UNION ALL
          SELECT a.id, a.parent_ids, a.type, a.group_id FROM assets a
          INNER JOIN lineage l ON l.parent_ids @> jsonb_build_array(a.id)
        )
        SELECT id, parent_ids, type, group_id FROM lineage LIMIT 500
      `);

      // Merge and deduplicate
      const allAssetsMap = new Map<string, {id: string, parentIds: string[], type: string, groupId: string | null}>();
      const addRow = (row: {id: string, parent_ids: string[], type: string, group_id: string | null}) => {
        allAssetsMap.set(row.id, { id: row.id, parentIds: row.parent_ids || [], type: row.type, groupId: row.group_id });
      };

      descendants.forEach(addRow);
      ancestors.forEach(addRow);

      const allAssets = Array.from(allAssetsMap.values());

      // Transform to React Flow Nodes & Edges (DAGVisualizer format)
      const nodes = allAssets.map(a => ({
        id: a.id,
        position: { x: 0, y: 0 },
        data: { id: a.id, type: a.type, label: a.type }
      }));

      const edges: {id: string, source: string, target: string}[] = [];
      allAssets.forEach(a => {
        a.parentIds.forEach(parentId => {
          // Solamente si el parent está resolviendo en el query
          if (allAssetsMap.has(parentId)) {
            edges.push({
              id: `edge-${parentId}-${a.id}`,
              source: parentId,
              target: a.id
            });
          }
        });
      });

      // 3. Aggregate groups
      const groupIdsSet = new Set<string>();
      allAssets.forEach(a => { if (a.groupId) groupIdsSet.add(a.groupId); });
      const groupIds = Array.from(groupIdsSet);

      if (groupIds.length > 0) {
        // dynamic import of assetGroups and inArray to prevent touching top-level imports in this specific replace block
        const { assetGroups } = await import('@biffco/db/schema');
        const { inArray } = await import('drizzle-orm');
        
        const groups = await ctx.db.select({ id: assetGroups.id, name: assetGroups.name }).from(assetGroups).where(inArray(assetGroups.id, groupIds));
        
        groups.forEach(g => {
           nodes.push({
             id: g.id,
             position: { x: 0, y: 0 },
             data: { id: g.id, type: 'LOT', label: `Lote: ${g.name}` }
           });
        });

        // Add edges from assets to their groups
        allAssets.forEach(a => {
           if (a.groupId && groups.find(g => g.id === a.groupId)) {
              edges.push({
                 id: `edge-${a.id}-${a.groupId}`,
                 source: a.id, // el animal ensambla HACIA la tropa
                 target: a.groupId
              });
           }
        });
      }

      return { nodes, edges };
    }),

  // Día 24: Descarga Externa Segura (CloudFront CDN vs S3 Fallback)
  getDownloadUrl: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      // 1. Verificar existencia del asset
      const asset = await ctx.db.query.assets.findFirst({
        where: eq(assets.id, input.id)
      });
      
      if (!asset) {
        throw new Error("Asset Passport Extraviado");
      }

      // En el mundo real, tendrías un campo "attachmentKey" o "pdfFileKey".
      // Para propósitos de este demo WORM, simularemos que existe un objeto atado a su CUID.
      const meta = asset.metadata as Record<string, unknown> | null;
      const objectKey = (meta?.pdfFileKey as string) || `exports/${asset.id}.pdf`;

      // 2. Extraer Credenciales de Doppler
      // eslint-disable-next-line no-undef
      const cfDomain = process.env.CLOUDFRONT_DOMAIN;
      // eslint-disable-next-line no-undef
      const cfKeyId = process.env.CLOUDFRONT_KEY_PAIR_ID;
      // eslint-disable-next-line no-undef
      const cfPrivateKey = process.env.CLOUDFRONT_PRIVATE_KEY;

      // 3. Estrategia Principal: Red Global CDN de CloudFront (Extrema Velocidad, Zero-S3 Cost)
      if (cfDomain && cfKeyId && cfPrivateKey) {
        const expiresInMs = 15 * 60 * 1000; // La URL expira en 15 minutos para evitar leaks
        const expirationDate = new Date(Date.now() + expiresInMs).toISOString();

        const signedUrl = getCloudFrontSignedUrl({
          url: `https://${cfDomain}/${objectKey}`,
          keyPairId: cfKeyId,
          privateKey: cfPrivateKey,
          dateLessThan: expirationDate
        });

        return { url: signedUrl, provider: 'cloudfront', cacheStatus: 'HIT-Ready' };
      }

      // 4. Fallback Plan B: Amazonas S3 Directo (Solo para tu Desarrollo Local sin PEM Key)
      // eslint-disable-next-line no-undef
      const bucket = process.env.S3_BUCKET_NAME || 'biffco-vault-worm-fallback';
      
      const s3Command = new GetObjectCommand({
        Bucket: bucket,
        Key: objectKey,
        ResponseCacheControl: "max-age=604800, public",
        ResponseContentDisposition: `attachment; filename="${asset.id}-passport.pdf"`
      });

      const s3Url = await getS3SignedUrl(s3Client, s3Command, { expiresIn: 600 });
      
      return { url: s3Url, provider: 's3-fallback', cacheStatus: 'MISS' };
    })
});
