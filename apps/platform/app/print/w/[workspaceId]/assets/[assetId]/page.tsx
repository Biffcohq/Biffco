"use client"

import React, { useEffect, Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { trpc } from '@/lib/trpc'
import { QRCodeSVG } from 'qrcode.react'

function PassportPrintBody() {
  const params = useParams()
  const searchParams = useSearchParams()
  const assetId = typeof params?.assetId === 'string' ? params.assetId : ''
  const specificEventId = searchParams.get('eventId')

  const { data: asset, isLoading } = trpc.assets.getById.useQuery(
    { id: assetId },
    { enabled: !!assetId }
  )

  useEffect(() => {
    if (asset) {
      setTimeout(() => {
        globalThis.print()
      }, 1000)
    }
  }, [asset])

  if (isLoading) return <div className="p-8 text-black font-mono">Buscando Veracidad del Activo...</div>
  if (!asset) return <div className="p-8 text-black font-mono">Error: Documento Blockchain no encontrado</div>

  const isBovine = asset.type === 'AnimalAsset'
  const isDore = asset.type === 'DoreBar'
  const isCoffee = asset.type === 'CoffeeSack'
  const meta = asset.metadata as Record<string, any>
  const verifyUrl = `https://verify.biffco.co/assets/${asset.id}`

  // Filter events if specificEventId exists
  const eventsToPrint = specificEventId 
    ? asset.events.filter((e: any) => e.id === specificEventId)
    : asset.events;

  return (
    <div className="bg-white min-h-screen text-black p-8 font-sans print:m-0 print:p-6 mx-auto w-[210mm]">
      {/* Brand Header with Color */}
      <div className="flex items-center justify-between border-b-4 border-blue-600 pb-5 mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white font-black text-2xl px-2 py-1 tracking-tighter">BIFFCO</div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900 leading-none">
              {specificEventId ? 'CONSTANCIA DE MOVIMIENTO' : 'PASAPORTE DIGITAL'}
            </h1>
            <p className="text-blue-600/80 font-bold uppercase tracking-widest text-xs mt-1">Trust Infrastructure</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-mono font-bold text-gray-800">EMISIÓN: {new Date().toLocaleDateString()}</p>
          <p className="text-[10px] font-mono mt-0.5 text-gray-500">Copia Fiel Blockchain</p>
        </div>
      </div>

      {/* Asset Global Data Container */}
      <div className="flex gap-6 mb-10 items-start bg-gray-50 p-6 rounded-xl border border-gray-200">
         <div className="flex-shrink-0 bg-white p-2 rounded-lg border shadow-sm">
           <QRCodeSVG value={verifyUrl} size={130} />
           <p className="text-center text-[8px] mt-2 font-mono uppercase font-bold text-gray-500">Escanear UUID</p>
         </div>

         <div className="flex-grow flex flex-col gap-4">
            <div>
              <h2 className="text-[10px] uppercase tracking-widest text-blue-600 font-bold mb-1">Identificador Activo (UUID)</h2>
              <p className="text-xl font-mono font-black text-gray-900 leading-none break-all">{asset.id}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Estado Legal</h2>
                <span className={`inline-block px-3 py-1 rounded text-xs font-bold uppercase ${asset.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                  {asset.status}
                </span>
              </div>
              <div>
                <h2 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Especie / Tipo</h2>
                <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded text-xs font-bold uppercase">
                  {isBovine ? 'Ganado Bovino' : isDore ? 'Oro Bullion' : isCoffee ? 'Café de Especialidad' : asset.type}
                </span>
              </div>
            </div>

            {/* Extra Meat/Gold data */}
            <div className="pt-3 mt-1 border-t border-gray-200 flex flex-col gap-1.5">
                {isBovine && (
                  <div className="grid grid-cols-3 gap-2">
                     <div><span className="text-[10px] uppercase text-gray-500 block">Raza</span><strong className="text-sm">{meta?.breed || '-'}</strong></div>
                     <div><span className="text-[10px] uppercase text-gray-500 block">Identificador RFID</span><strong className="text-sm">{meta?.rfid || '-'}</strong></div>
                     <div><span className="text-[10px] uppercase text-gray-500 block">Certificación</span><strong className="text-sm">{meta?.gfwStatus === 'clear' ? 'Aprobado' : 'Pendiente'}</strong></div>
                  </div>
                )}
            </div>
         </div>
      </div>

      {/* Trazabilidad Section */}
      <h3 className="text-xl font-black uppercase tracking-tight border-b-2 border-gray-300 pb-2 mb-6 text-gray-900">
        {specificEventId ? 'Evento a Inspeccionar' : 'Libro Mayor (Auditoría Lineal)'}
      </h3>
      
      <div className="flex flex-col gap-8">
         {eventsToPrint.map((event: any, index: number) => {
           const isGenesis = event.eventType === 'ASSET_CREATED' || event.eventType === 'LIVESTOCK_ORIGINATED';
           const d = event.data as Record<string, unknown>;
           const displayTitle = event.eventType.replace(/_/g, ' ');
           
           // Generate specific QR for the hash of this event
           const eventVerifyUrl = `https://verify.biffco.co/assets/${asset.id}?txn=${event.hash}`

           return (
             <div key={event.id} className="event-block border border-gray-200 shadow-sm rounded-xl p-5 flex flex-col gap-3 avoid-page-break relative overflow-hidden">
                {/* Visual accent left line */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isGenesis ? 'bg-green-500' : 'bg-blue-500'}`}></div>

                <div className="flex justify-between items-start pl-2">
                   <div>
                     <h4 className="font-black text-lg flex items-center gap-2 text-gray-900">
                       {displayTitle}
                       {isGenesis && <span className="text-[10px] border bg-green-50 text-green-700 border-green-200 px-2 uppercase rounded-full py-0.5">Semilla de Vida</span>}
                     </h4>
                     <p className="text-sm mt-1 text-gray-600 font-medium">{d?.message || 'Actualización de Estado Registrada'}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-sm font-mono text-gray-900 font-bold bg-gray-100 px-2 py-0.5 rounded">{new Date(event.createdAt).toLocaleDateString()}</p>
                     <p className="text-[11px] font-mono mt-1 text-gray-500">{new Date(event.createdAt).toLocaleTimeString()} hs</p>
                   </div>
                </div>

                {/* Logistics Context with nice UI */}
                {(d?.carrierAlias || d?.receiverAlias) && (
                  <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-200/50 text-xs font-mono pl-3 mb-1 mt-2">
                    {d?.carrierAlias && <div className="mb-1 text-amber-900"><strong className="text-amber-700">Responsable Carga:</strong> {d.carrierAlias as string}</div>}
                    {d?.receiverAlias && <div className="text-amber-900"><strong className="text-amber-700">Destino Declarado:</strong> {d.receiverAlias as string}</div>}
                  </div>
                )}

                <div className="flex items-center gap-4 text-[10px] uppercase font-mono mt-2 border-t border-gray-100 pt-3">
                  <div className="bg-white border rounded p-1">
                    <QRCodeSVG value={eventVerifyUrl} size={50} />
                  </div>
                  <div className="flex-grow grid grid-cols-1 gap-2">
                    <div>
                      <span className="font-bold text-gray-400 block mb-0.5">Firma Criptográfica Autorizada:</span>
                      <span className="block truncate text-gray-800 text-xs font-bold">{event.signerAlias || event.signerId}</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-400 block mb-0.5">Código Único (Hash SHA-256):</span>
                      <span className="block truncate text-gray-500">{event.hash}</span>
                    </div>
                  </div>
                </div>

                {event.polygonTxHash && (
                  <div className="text-[9px] uppercase font-mono bg-indigo-50 text-indigo-800 p-2 rounded text-center border border-indigo-100 mt-2">
                    <strong className="text-indigo-600">Polygon L2 Anchorage:</strong> {event.polygonTxHash}
                  </div>
                )}
             </div>
           )
         })}
      </div>
      
      <div className="mt-12 pt-6 border-t-2 border-gray-300 text-center avoid-page-break">
         <p className="text-xs font-black uppercase tracking-widest text-gray-900">Validado por BIFFCO Trust-Infrastructure</p>
         <p className="text-[10px] text-gray-500 mt-1 max-w-lg mx-auto">La veracidad de estos registros matemáticos está protegida bajo estándares globales inmutables. El fraude o la alteración de este documento en formato físico carece de valor si no tiene coincidencia con su Hash digital público.</p>
         <p className="text-[9px] text-gray-400 mt-3 font-mono">Verify En: https://verify.biffco.co</p>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          html, body {
            background-color: white !important;
          }
          .avoid-page-break {
            page-break-inside: avoid;
          }
          /* Break event blocks into single pages iff they are heavily crowded, but preferably just avoid breaking inside */
          .event-block {
             page-break-inside: avoid;
             margin-bottom: 20px;
          }
        }
      `}} />
    </div>
  )
}

export default function PrintAssetPassportWrapper() {
  return (
    <Suspense fallback={<div className="p-8 font-mono">Cargando visualizador A4...</div>}>
      <PassportPrintBody />
    </Suspense>
  )
}
