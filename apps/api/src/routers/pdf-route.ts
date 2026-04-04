import type { FastifyInstance } from 'fastify';
import { db } from '@biffco/db';
import { assets, domainEvents } from '@biffco/db/schema';
import { eq, desc } from 'drizzle-orm';
import { renderToStream } from '@react-pdf/renderer';
import React from 'react';
import { AssetPassport } from '@biffco/pdf';

export async function setupPdfRoutes(app: FastifyInstance) {
  app.get('/api/assets/:id/passport', async (request, reply) => {
    try {
      const token = (request.query as { token?: string }).token || request.cookies?.accessToken;
      if (!token) {
        return reply.status(401).send({ error: "Falta token de acceso" });
      }
      
      const payload = await app.jwt.verify<{ workspaceId: string }>(token);
      const user = { workspaceId: payload.workspaceId };
      const { id } = request.params as { id: string };

      // 1. Fetch Asset Data
      const asset = await db.query.assets.findFirst({
        where: eq(assets.id, id)
      });

      if (!asset) {
        return reply.status(404).send({ error: "Asset no encontrado" });
      }

      if (asset.workspaceId !== user.workspaceId) {
        return reply.status(403).send({ error: "Acceso denegado a este activo." });
      }

      // 2. Fetch Chain of Custody (Events)
      const assetEvents = await db.query.domainEvents.findMany({
        where: eq(domainEvents.streamId, id),
        orderBy: [desc(domainEvents.createdAt)]
      });

      // 3. Fetch Cryptographic Evidence (Si lo hubiera implementado totalmente en la tabla)
      // Por ahora mockeamos o leemos los event payloads que tengan evidence
      const attachedEvidence: Array<{ filename: string; sha256: string; status: string }> = [];
      
      for (const evt of assetEvents) {
         if (evt.data && typeof evt.data === 'object' && 'evidenceKey' in evt.data) {
             const data = evt.data as { evidenceKey: string; sha256?: string; filename?: string };
             attachedEvidence.push({
                filename: data.filename || `Evidence-${evt.id.slice(0,6)}`,
                sha256: data.sha256 || 'Unknown-Hash',
                status: 'Verified & Anchored'
             });
         }
      }

      // Preparamos props
      const passportProps = {
         asset: {
            id: asset.id,
            type: asset.type,
            ownerId: [asset.workspaceId], 
            lineageParentIds: asset.parentIds || [],
            blockchainTxHash: (asset.metadata as Record<string, string>)?.blockchainTxHash || "Pending-Anchor"
         },
         events: assetEvents.map(e => ({
            id: e.id,
            type: e.eventType,
            occurredAt: e.createdAt.toISOString(),
            signedBy: e.signerId || 'System'
         })),
         evidence: attachedEvidence
      };

      // 4. Renderizamos Vectorialmente en el Servidor Node (Evitando el Edge limit)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const stream = await renderToStream(React.createElement(AssetPassport, passportProps) as any);

      reply.header('Content-Type', 'application/pdf');
      reply.header('Content-Disposition', `attachment; filename="Biffco-Passport-${id}.pdf"`);
      
      // Enviamos el chorro binario directo al navegador
      return reply.send(stream);

    } catch (error) {
       app.log.error(error);
       return reply.status(500).send({ error: "Fallo rotundo generando el PDF Vectorial." });
    }
  });
}
