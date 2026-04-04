"use client"

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc'
import { Button } from '@biffco/ui'
import { IconArrowLeft, IconBox, IconHash, IconHistory, IconQrcode, IconPolygon } from '@tabler/icons-react'
import { QRCodeSVG } from 'qrcode.react'
// eslint-disable-next-line no-restricted-imports
import { VerticalAssetProfile } from '../../../../../lib/verticals/registry'

export default function AssetPassportPage() {
  const params = useParams()
  const router = useRouter()
  const assetId = typeof params?.assetId === 'string' ? params.assetId : ''
  const workspaceId = typeof params?.workspaceId === 'string' ? params.workspaceId : ''

  const { data: asset, isLoading, error } = trpc.assets.getById.useQuery(
    { id: assetId },
    { enabled: !!assetId }
  )

  const { data: workspaceData } = trpc.workspaces.getProfile.useQuery()
  const verticalId = workspaceData?.verticalId || 'livestock'

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 animate-pulse">Cargando Pasaporte del Activo...</div>
  }

  if (error || !asset) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-error/50 rounded-xl bg-error/5">
        <IconBox size={48} className="text-error/40 mb-4" />
        <h2 className="text-lg font-bold text-text-primary mb-2">Activo No Encontrado</h2>
        <p className="text-text-secondary">El activo que buscas no existe o no tienes permisos para verlo en este espacio de trabajo (Tenant).</p>
        <Button variant="outline" className="mt-6" onClick={() => router.back()}>Volver</Button>
      </div>
    )
  }
  const verifyUrl = `https://verify.biffco.co/assets/${asset.id}`

  return (
    <div className="flex flex-col gap-8 pb-12 animate-in fade-in duration-300 max-w-5xl mx-auto w-full">
      {/* Header and Back navigation */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.push(`/w/${workspaceId}/assets`)}
          className="p-2 rounded-full hover:bg-surface-raised text-text-secondary hover:text-text-primary transition-colors"
        >
          <IconArrowLeft size={20} />
        </button>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-text-primary">Pasaporte del Activo</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${
              asset.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-surface-raised text-text-muted border-border'
            }`}>
              {asset.status}
            </span>
          </div>
          <p className="text-text-secondary text-sm font-mono flex items-center gap-1.5 mt-1">
            <IconHash size={14} className="text-primary/70" />
            {asset.id}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda: Información Biológica (Inyectada) y Código QR */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Vertical Profile Injection */}
          <VerticalAssetProfile 
            verticalId={verticalId} 
            asset={asset} 
          />

          {/* QR Code Card */}
          <div className="bg-surface border border-border rounded-xl p-6 flex flex-col items-center text-center shadow-sm">
             <div className="bg-white p-3 rounded-xl shadow-inner mb-4">
               <QRCodeSVG 
                 value={verifyUrl} 
                 size={160} 
                 bgColor={"#ffffff"}
                 fgColor={"#000000"}
                 level={"Q"}
                 includeMargin={false}
               />
             </div>
             <h3 className="font-semibold text-text-primary flex items-center gap-2 justify-center mb-1">
               <IconQrcode size={18} className="text-primary" />
               Verificación Pública
             </h3>
             <p className="text-xs text-text-muted">
               Escanea este código con cualquier dispositivo para leer la trazabilidad inmutable directamente en la subred.
             </p>
          </div>
        </div>

        {/* Columna Derecha: The Event Ledger (Línea de Tiempo) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <IconHistory size={20} className="text-primary" />
              Event Ledger 
            </h2>
            <span className="text-xs text-text-muted font-mono bg-surface-raised px-2 py-1 rounded border border-border">
              {asset.events?.length || 0} Bloques
            </span>
          </div>

          <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden p-6">
             <div className="relative border-l border-border/80 ml-3 md:ml-4 space-y-8 pb-4">
                {asset.events?.map((event, idx) => {
                  const isGenesis = idx === asset.events.length - 1;
                  const eData = event.data as Record<string, any>;
                  
                  // Traducción visual del evento técnico a Operativo
                  const eventNameMap: Record<string, string> = {
                    'ASSET_CREATED': 'Registro Inicial',
                    'ASSET_DISPATCHED': 'Despacho Logístico',
                    'ASSET_TRANSIT_SCAN': 'Punto de Control',
                    'ASSET_RECEIVED': 'Recepción en Destino',
                  }
                  const displayTitle = eventNameMap[event.eventType] || event.eventType.replace(/_/g, ' ');
                  const displayDesc = eData.message || (isGenesis ? 'Activo dado de alta en la red Biffco' : 'Actualización de estado');

                  return (
                    <div key={event.id} className="relative pl-6 md:pl-8">
                       {/* Timeline Marker */}
                       <div className="absolute w-3 h-3 bg-primary rounded-full -left-[6.5px] top-1.5 ring-4 ring-bg"></div>
                       
                       {/* Event Card */}
                       <div className="flex flex-col gap-1.5">
                         <div className="flex flex-wrap items-center gap-2 justify-between">
                            <h4 className="font-semibold text-text-primary text-base flex items-center gap-2">
                              {displayTitle}
                              {isGenesis && <span className="bg-primary/10 text-primary text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">Génesis</span>}
                            </h4>
                            <span className="text-xs text-text-muted font-medium bg-surface-raised px-2 py-1 rounded-full border border-border/50">
                              {new Date(event.createdAt).toLocaleDateString()} a las {new Date(event.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                         </div>
                         
                         <p className="text-sm text-text-secondary">{displayDesc}</p>
                         
                         <div className="flex items-center gap-1.5 text-xs text-text-muted mt-1">
                           <span className="opacity-70">Responsable (Firma Jurídica):</span> 
                           <span className="font-mono bg-surface-raised px-1 py-0.5 rounded border border-border/50 font-medium text-text-primary">
                             {event.signerId === 'system' ? 'Sistema Automatizado' : event.signerId}
                           </span>
                         </div>

                         {/* Acordeón Criptográfico Oculto */}
                         <details className="group mt-2">
                           <summary className="cursor-pointer text-xs font-semibold text-primary flex items-center gap-1 hover:underline outline-none select-none">
                             <span className="group-open:hidden flex items-center gap-1"><IconPolygon size={14}/> Mostrar Evidencia Criptográfica </span>
                             <span className="hidden group-open:flex items-center gap-1"><IconPolygon size={14}/> Ocultar Evidencia</span>
                           </summary>
                           <div className="bg-surface border border-border/60 rounded-md p-3 text-xs text-text-secondary font-mono overflow-x-auto mt-2 shadow-inner">
                              <div className="flex items-center justify-between mb-2 pb-2 border-b border-border/40">
                                <div>
                                  <span className="text-text-muted block text-[10px] uppercase">SHA-256 Hash del Bloque</span>
                                  <span className="text-primary/80">{event.hash}</span>
                                </div>
                                {event.polygonTxHash && (
                                  <div className="flex flex-col items-end">
                                    <span className="text-text-muted block text-[10px] uppercase">Anclaje Polygon</span>
                                    <a href={`https://amoy.polygonscan.com/tx/${event.polygonTxHash}`} target="_blank" rel="noreferrer" className="text-[#8247E5] flex items-center gap-1 hover:underline">
                                      {event.polygonTxHash.slice(0, 8)}... <IconPolygon size={12}/>
                                    </a>
                                  </div>
                                )}
                              </div>
                              <span className="text-text-muted block text-[10px] uppercase mb-1">Payload JSON</span>
                              <pre className="text-text-muted/80">
                                {JSON.stringify(eData, null, 2)}
                              </pre>
                           </div>
                         </details>
                       </div>
                    </div>
                  )
                })}
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
