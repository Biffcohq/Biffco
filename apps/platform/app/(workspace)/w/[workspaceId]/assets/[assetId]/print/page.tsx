"use client"

import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { trpc } from '@/lib/trpc'
import { QRCodeSVG } from 'qrcode.react'

export default function PrintAssetPassportPage() {
  const params = useParams()
  const assetId = typeof params?.assetId === 'string' ? params.assetId : ''
  // const eventId = new URLSearchParams(typeof globalThis !== 'undefined' ? globalThis.location.search : '').get('eventId')

  const { data: asset, isLoading } = trpc.assets.getById.useQuery(
    { id: assetId },
    { enabled: !!assetId }
  )

  useEffect(() => {
    // Automatically trigger print on load if data is ready
    if (asset) {
      setTimeout(() => {
        globalThis.print()
      }, 800)
    }
  }, [asset])

  if (isLoading) return <div className="p-8 text-black font-mono">Generando Certificado...</div>
  if (!asset) return <div className="p-8 text-black font-mono">Error: Documento no encontrado</div>

  const isBovine = asset.type === 'AnimalAsset'
  const isDore = asset.type === 'DoreBar'
  const isCoffee = asset.type === 'CoffeeSack'
  const meta = asset.metadata as Record<string, any>
  const verifyUrl = `https://verify.biffco.co/assets/${asset.id}`

  return (
    <div className="bg-white min-h-screen text-black p-8 font-sans print:m-0 print:p-4 max-w-[210mm] mx-auto">
      {/* Header Corporativo */}
      <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">BIFFCO PASSPORT</h1>
          <p className="text-sm font-medium mt-1 uppercase tracking-widest text-black/60">Trazabilidad Inmutable</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-mono">FECHA EMISIÓN: {new Date().toLocaleDateString()}</p>
          <p className="text-xs font-mono mt-0.5">COMPROBANTE VÁLIDO DE CIRCULACIÓN</p>
        </div>
      </div>

      {/* Contenedor Superior (QR y Datos) */}
      <div className="flex gap-8 mb-8 items-start">
         <div className="flex-shrink-0 border border-black p-2 rounded">
           <QRCodeSVG value={verifyUrl} size={140} />
           <p className="text-center text-[9px] mt-1 font-mono uppercase">Escanee para Auditoría</p>
         </div>

         <div className="flex-grow flex flex-col gap-4">
            <div>
              <h2 className="text-xs uppercase tracking-widest text-black/60 font-bold mb-1">Identificador Criptográfico Global</h2>
              <p className="text-lg font-mono font-bold leading-none break-all">{asset.id}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="text-xs uppercase tracking-widest text-black/60 font-bold mb-1">Estado Legal</h2>
                <span className="inline-block border border-black px-2 py-0.5 text-xs font-bold uppercase">{asset.status}</span>
              </div>
              <div>
                <h2 className="text-xs uppercase tracking-widest text-black/60 font-bold mb-1">Tipo de Activo</h2>
                <span className="inline-block border border-black px-2 py-0.5 text-xs font-bold uppercase">
                  {isBovine ? 'Ganado Bovino' : isDore ? 'Oro Bullion' : isCoffee ? 'Café de Especialidad' : asset.type}
                </span>
              </div>
            </div>

            {/* Datos Biológicos / Físicos */}
            <div className="border border-black p-3 bg-gray-50 flex flex-col gap-2 relative">
                {isBovine && (
                  <>
                     <div className="flex justify-between border-b border-black/20 pb-1">
                       <span className="text-xs uppercase font-bold">Raza:</span>
                       <span className="text-sm">{meta?.breed || 'N/A'}</span>
                     </div>
                     <div className="flex justify-between border-b border-black/20 pb-1">
                       <span className="text-xs uppercase font-bold">Categoría:</span>
                       <span className="text-sm">{meta?.category || 'N/A'}</span>
                     </div>
                     <div className="flex justify-between border-b border-black/20 pb-1">
                       <span className="text-xs uppercase font-bold">Peso Ingreso:</span>
                       <span className="text-sm">{meta?.weightProcess ? `${meta.weightProcess} kg` : 'N/A'}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-xs uppercase font-bold">Certificadora (EUDR):</span>
                       <span className="text-sm">{meta?.gfwStatus === 'clear' ? 'Global Forest Watch (No Deforestación)' : 'Pendiente/Observado'}</span>
                     </div>
                  </>
                )}
            </div>
         </div>
      </div>

      {/* Historial de Trazabilidad */}
      <h3 className="text-lg font-black uppercase tracking-tight border-b border-black pb-2 mb-4">Libro Mayor de Eventos (Event Ledger)</h3>
      <div className="flex flex-col gap-4">
         {asset.events.map((event: any) => {
           const isGenesis = event.eventType === 'ASSET_CREATED' || event.eventType === 'LIVESTOCK_ORIGINATED';
           const d = event.data as Record<string, unknown>;
           const displayTitle = event.eventType.replace(/_/g, ' ');

           return (
             <div key={event.id} className="border border-black rounded p-3 flex flex-col gap-3 avoid-page-break">
                <div className="flex justify-between items-start">
                   <div>
                     <h4 className="font-bold flex items-center gap-2">
                       {displayTitle}
                       {isGenesis && <span className="text-[9px] border bg-black text-white px-1 uppercase leading-none py-0.5">Semilla</span>}
                     </h4>
                     <p className="text-xs mt-1 text-black/80">{d?.message || 'Actualización de Estado'}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-xs font-mono font-bold">{new Date(event.createdAt).toLocaleDateString()}</p>
                     <p className="text-[10px] font-mono">{new Date(event.createdAt).toLocaleTimeString()}</p>
                   </div>
                </div>

                {/* Logistics block */}
                {(d?.carrierAlias || d?.receiverAlias) && (
                  <div className="bg-gray-100 p-2 border border-black text-xs font-mono">
                    {d?.carrierAlias && <div className="mb-0.5">TRANSPORTE Asignado: {d.carrierAlias as string}</div>}
                    {d?.receiverAlias && <div>DESTINO PAUTADO: {d.receiverAlias as string}</div>}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-[10px] uppercase font-mono mt-2 border-t border-black/20 pt-2">
                  <div>
                    <span className="font-bold block mb-0.5">Firma de Registro:</span>
                    <span className="block truncate">{event.signerAlias || event.signerId}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold block mb-0.5">Tx_HASH (Inmutabilidad):</span>
                    <span className="block truncate">{event.hash}</span>
                  </div>
                </div>
                {event.polygonTxHash && (
                  <div className="text-[9px] uppercase font-mono text-center border-t border-black/20 pt-1 mt-1">
                    Ancoraje Blockchain Público L2 (Polygon): <span className="font-bold">{event.polygonTxHash.slice(0,25)}...</span>
                  </div>
                )}
             </div>
           )
         })}
      </div>
      
      <div className="mt-8 pt-4 border-t-2 border-black text-center">
         <p className="text-[10px] font-bold uppercase tracking-widest">Documento Criptográfico Autogenerado por BIFFCO Trust-Infrastructure</p>
         <p className="text-[9px] text-black/60 mt-1">La veracidad de estos registros matemáticos está protegida bajo estándares globales Inmutables.</p>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          .avoid-page-break {
            page-break-inside: avoid;
          }
        }
      `}} />
    </div>
  )
}
