import React from 'react';
import { db } from '@biffco/db';
import { domainEvents, anchoredEvents, anchorsLog } from '@biffco/db/schema';
import { eq, desc } from 'drizzle-orm';
import { BlockchainAnchorBadge } from '@biffco/ui';

// This runs on the Edge/Server for extremely fast load
export const runtime = "edge";

interface VerifyPageProps {
  params: {
    assetId: string;
  };
}

export default async function VerifyPage({ params }: VerifyPageProps) {
  const { assetId } = params;

  // 1. Fetch the latest event for this asset
  const latestEventArray = await db
    .select()
    .from(domainEvents)
    .where(eq(domainEvents.streamId, assetId))
    .orderBy(desc(domainEvents.globalId))
    .limit(1);

  const event = latestEventArray[0];

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold">Activo no encontrado</h1>
          <p className="mt-2 text-gray-600">No se encontraron registros para el activo {assetId}</p>
        </div>
      </div>
    );
  }

  // 2. See if the event is anchored
  const anchorRelation = await db
    .select()
    .from(anchoredEvents)
    .where(eq(anchoredEvents.eventId, event.id))
    .limit(1);

  let anchorData = null;
  if (anchorRelation[0]) {
    const anchorLog = await db
      .select()
      .from(anchorsLog)
      .where(eq(anchorsLog.id, anchorRelation[0].anchorId))
      .limit(1);
      
    anchorData = anchorLog[0];
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#F9FAFB] p-6 pt-12 dark:bg-[#0C111D]">
      <div className="w-full max-w-2xl space-y-6">
        
        <header className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-[#101828] dark:text-[#F2F4F7]">
            Verificación de Activo
          </h1>
          <p className="text-sm text-[#475467] dark:text-[#98A2B3]">
            ID: {assetId}
          </p>
        </header>

        <main className="rounded-xl border border-[#EAECF0] bg-white p-6 shadow-sm dark:border-[#1F242F] dark:bg-[#161B26]">
          <h2 className="mb-4 text-lg font-semibold text-[#101828] dark:text-[#F2F4F7]">
            Estado Actual
          </h2>
          
          <div className="grid grid-cols-2 gap-4 rounded bg-[#F2F4F7] p-4 dark:bg-[#1C222E]">
            <div>
              <p className="text-xs text-[#475467] dark:text-[#98A2B3]">Último Evento</p>
              <p className="font-mono text-sm dark:text-[#F2F4F7]">{event.eventType}</p>
            </div>
            <div>
              <p className="text-xs text-[#475467] dark:text-[#98A2B3]">Fecha</p>
              <p className="text-sm dark:text-[#F2F4F7]">
                {new Date(event.createdAt).toLocaleString('es-AR')}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="mb-3 text-sm font-medium text-[#101828] dark:text-[#F2F4F7]">Anclaje de Confianza</h3>
            {anchorData ? (
              <BlockchainAnchorBadge 
                txHash={anchorData.polygonTxHash} 
                network={anchorData.network}
                timestamp={anchorData.createdAt}
              />
            ) : (
              <div className="rounded border border-dashed border-[#EAECF0] bg-[#F9FAFB] p-4 text-center dark:border-[#1F242F] dark:bg-[#0C111D]">
                <p className="text-sm text-[#475467] dark:text-[#98A2B3]">
                  Eventos pendientes de anclaje. El anclaje se realiza en lotes cada 5 minutos.
                </p>
              </div>
            )}
          </div>
        </main>
        
      </div>
    </div>
  );
}
