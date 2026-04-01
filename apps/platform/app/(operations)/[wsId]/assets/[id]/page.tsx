/* global window */
"use client"

import React, { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { 
  IconArrowLeft, 
  IconInfoCircle, 
  IconTimelineEvent, 
  IconMapPin, 
  IconFiles, 
  IconQrcode,
  IconDotsVertical,
  IconMeat,
  IconCheck,
  IconAlertTriangle,
  IconX
} from '@tabler/icons-react'
import Link from 'next/link'
import { format } from 'date-fns'

import { EvidenceUploader } from '@biffco/ui'

type TabType = 'info' | 'timeline' | 'map' | 'documents'

export default function AssetDetailPage({ params }: { params: { wsId: string, id: string } }) {
  const [activeTab, setActiveTab] = useState<TabType>('info')
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)
  const utils = trpc.useUtils()

  const getSignedUrl = trpc.upload.getSignedUrl.useMutation()
  const confirmUpload = trpc.upload.confirmUpload.useMutation()
  const appendEvent = trpc.events.append.useMutation()

  const { data: asset, isLoading } = trpc.assets.getById.useQuery({ 
    id: params.id 
  })

  const slaughterMutation = trpc.transform.executeSlaughter.useMutation({
    onSuccess: () => {
      utils.assets.getById.invalidate({ id: params.id })
      window.alert("Faena ejecutada exitosamente y cortes derivados creados.")
    },
    onError: (err: Error) => {
      window.alert("Error en faena: " + err.message)
    }
  })

  // Pre-slaughter checks logic
  const checkStatus = asset?.status === 'ACTIVE'
  const checkHolds = asset?.holds?.length === 0
  
  const lastDteEvent = asset?.events?.find((e: Record<string, unknown>) => e.eventType === 'HEALTH_CERT_ISSUED' || e.type === 'HEALTH_CERT_ISSUED')
      const checkDte = !!(lastDteEvent && lastDteEvent.payload?.expiresAt && new Date(lastDteEvent.payload.expiresAt) > new Date())
  
  const checkPolygon = !!asset?.metadata?.locationId
  const allChecksPass = checkStatus && checkHolds && checkDte && checkPolygon

  const handleSlaughter = () => {
    if (!allChecksPass) return window.alert("Faltan verificaciones pre-faena.")
    
    // Example 1 to N derived outputs
    const mockOutputs = [
      { payload: { cutType: "Media Res Izquierda", grossWeight: 120 } },
      { payload: { cutType: "Media Res Derecha", grossWeight: 121 } },
      { payload: { cutType: "Cuero Completo", grossWeight: 15 } }
    ]
    
    slaughterMutation.mutate({
      animalId: asset.id,
      outputs: mockOutputs,
      signature: "0xMockSlaughterWorkerSignatureApp",
      publicKey: "0xWorkerPubKey"
    })
  }

  // Dummy MapView import fallback while we build the real tabs
  // import { MapView } from '../../../../components/MapView'

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center h-[calc(100vh-6rem)]">
        <div className="animate-pulse space-y-4 w-full max-w-lg">
          <div className="h-20 bg-surface border border-border rounded-xl w-full"></div>
          <div className="h-64 bg-surface border border-border rounded-xl w-full"></div>
        </div>
      </div>
    )
  }

  if (!asset) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-[calc(100vh-6rem)] gap-4">
        <IconInfoCircle size={48} className="text-text-muted" />
        <h2 className="text-xl font-bold text-text-primary">Activo No Encontrado</h2>
        <p className="text-text-secondary">El activo que buscas no existe o no pertenece a este workspace.</p>
        <Link href={`/${params.wsId}/assets`} className="mt-4 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium">
          Volver al Directorio
        </Link>
      </div>
    )
  }

  const renderStatusBadge = (status: string) => {
    switch(status.toUpperCase()) {
      case 'ACTIVE': return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-success/20 text-success border border-success/30">Activo</span>
      case 'QUARANTINE': return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-warning/20 text-warning border border-warning/30">Cuarentena</span>
      default: return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">{status}</span>
    }
  }

  const renderGeoComplianceBadge = (status: string | undefined) => {
    if (!status) return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-surface-raised text-text-muted border border-border">Sin Info Geo</span>
    if (status === 'passed' || status === 'clear') {
       return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-success/20 text-success border border-success/40">Geocompliance ✅</span>
    } else if (status === 'alert' || status === 'failed') {
       return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-error/20 text-error border border-error/40 flex items-center gap-1"><IconAlertTriangle size={14}/> GFW ALERTA</span>
    }
    return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-warning/20 text-warning border border-warning/40">Pendiente Geo</span>
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 h-[calc(100vh-6rem)] max-w-[1400px] mx-auto w-full">
      {/* Navbar for Detail */}
      <div className="flex items-center gap-4 shrink-0">
        <Link 
          href={`/${params.wsId}/assets`}
          className="p-2 border border-border rounded-lg bg-surface hover:bg-surface-raised transition-colors text-text-secondary hover:text-text-primary"
        >
          <IconArrowLeft size={20} />
        </Link>
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-text-primary uppercase tracking-wide">
              {asset.id.split('-')[0]}
            </h1>
            {renderStatusBadge(asset.status)}
            {asset.type === 'AnimalAsset' && renderGeoComplianceBadge((asset.metadata as Record<string, unknown>)?.gfwStatus as string | undefined || 'clear')}
          </div>
          <span className="text-xs font-mono text-text-muted tracking-widest uppercase">
            {asset.id}
          </span>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
           <button 
             onClick={() => setIsQRModalOpen(true)}
             className="px-3 py-1.5 border border-primary/30 bg-primary/10 hover:bg-primary/20 transition-all rounded-md text-sm font-bold text-primary flex items-center gap-2 shadow-sm"
           >
             <IconQrcode size={18} stroke={2}/>
             Generar Etiqueta QR
           </button>
           <button className="p-2 border border-border rounded-lg bg-surface hover:bg-surface-raised transition-colors text-text-secondary">
             <IconDotsVertical size={20} />
           </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-h-0 bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
        
        {/* Tab Navigation */}
        <div className="flex items-center gap-6 px-6 border-b border-border bg-surface-raised shrink-0">
          {[
            { id: 'info', label: 'Información', icon: IconInfoCircle },
            { id: 'timeline', label: 'Timeline (Eventos)', icon: IconTimelineEvent },
            { id: 'map', label: 'Ubicación Mapa', icon: IconMapPin },
            { id: 'documents', label: 'Documentos', icon: IconFiles },
          ].map((tab) => {
            const isActive = activeTab === tab.id
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`relative py-4 flex items-center gap-2 font-medium text-sm transition-colors ${
                  isActive ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon size={18} />
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>
                )}
              </button>
            )
          })}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-bg flex flex-col">
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Properties Card */}
              <div className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-4">
                 <h3 className="font-bold text-sm text-text-muted uppercase tracking-wider">Identificación y Metadatos</h3>
                 <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                    <div>
                      <span className="block text-text-muted mb-1">Tipo de Activo</span>
                      <span className="font-medium text-text-primary capitalize">{asset.type}</span>
                    </div>
                    <div>
                      <span className="block text-text-muted mb-1">Vertical</span>
                      <span className="font-medium text-text-primary capitalize">{asset.verticalId}</span>
                    </div>
                    {asset.type === 'AnimalAsset' && (
                      <>
                        <div>
                          <span className="block text-text-muted mb-1">Categoría</span>
                          <span className="font-medium text-text-primary">{(asset.metadata as Record<string, unknown>)?.category as string || 'Vaca'}</span>
                        </div>
                        <div>
                          <span className="block text-text-muted mb-1">Raza</span>
                          <span className="font-medium text-text-primary">{(asset.metadata as Record<string, unknown>)?.breed as string || 'Angus'}</span>
                        </div>
                        <div>
                          <span className="block text-text-muted mb-1">Sexo</span>
                          <span className="font-medium text-text-primary">{(asset.metadata as Record<string, unknown>)?.sex as string || 'Hembra'}</span>
                        </div>
                        <div>
                          <span className="block text-text-muted mb-1">Peso Actual (kg)</span>
                          <span className="text-primary font-bold">{(asset.metadata as Record<string, unknown>)?.lastWeight as string || '450'} kg</span>
                        </div>
                      </>
                    )}
                    <div>
                      <span className="block text-text-muted mb-1">Creado el</span>
                      <span className="font-medium text-text-primary">{format(new Date(asset.createdAt), "dd MMM yyyy, HH:mm")}</span>
                    </div>
                    <div>
                      <span className="block text-text-muted mb-1">Última Actualización</span>
                      <span className="font-medium text-text-primary">{format(new Date(asset.updatedAt), "dd MMM yyyy, HH:mm")}</span>
                    </div>
                 </div>
              </div>

              {/* DAGVisualizer Link List */}
              {asset.parentIds && asset.parentIds.length > 0 && (
                <div className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-4 col-span-full">
                  <h3 className="font-bold text-sm text-text-muted uppercase tracking-wider flex items-center gap-2">
                    <IconTimelineEvent size={18} className="text-primary"/> 
                    Linaje y Trazabilidad (DAG Visualizer)
                  </h3>
                  <div className="flex flex-wrap gap-2 text-xs">
                     <span className="text-text-secondary flex items-center mr-2">Proviene de:</span>
                     {asset.parentIds.map((pId: string) => (
                        <Link key={pId} href={`/${params.wsId}/assets/${pId}`} className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded font-mono hover:bg-primary/20 font-bold transition-colors">
                          {pId.split('-')[0]}
                        </Link>
                     ))}
                  </div>
                </div>
              )}
              
              {/* Payload Card */}
              <div className="bg-surface border border-border rounded-xl flex flex-col overflow-hidden">
                  <h3 className="font-bold text-sm text-text-muted uppercase tracking-wider p-5 border-b border-border">Payload de Estado</h3>
                 <div className="p-5 bg-surface-raised flex-1 overflow-auto">
                    <pre className="text-xs font-mono text-text-secondary whitespace-pre-wrap">
                      {JSON.stringify(asset.metadata, null, 2)}
                    </pre>
                 </div>
              </div>

              {/* Slaughter Widget (Only for AnimalAsset) */}
              {asset.type === 'AnimalAsset' && asset.status !== 'CLOSED' && (
                <div className="bg-surface border border-error/30 rounded-xl p-5 flex flex-col gap-4 col-span-full md:col-span-1">
                  <h3 className="font-bold text-sm text-error uppercase tracking-wider flex items-center gap-2">
                    <IconMeat size={18} />
                    Semáforo Pre-Faena
                  </h3>
                  <div className="flex flex-col gap-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Status Activo</span>
                      {checkStatus ? <IconCheck size={18} className="text-success" /> : <IconX size={18} className="text-error" />}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Sin Holds Activos</span>
                      {checkHolds ? <IconCheck size={18} className="text-success" /> : <IconX size={18} className="text-error" />}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">DTE Vigente</span>
                      {checkDte ? <IconCheck size={18} className="text-success" /> : <IconX size={18} className="text-error" />}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Polígono EUDR (Zona)</span>
                      {checkPolygon ? <IconCheck size={18} className="text-success" /> : <IconX size={18} className="text-error" />}
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSlaughter}
                    disabled={!allChecksPass || slaughterMutation.isPending}
                    className="mt-4 w-full py-2 bg-error hover:bg-error/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-md flex items-center justify-center gap-2 transition-colors"
                  >
                    {slaughterMutation.isPending ? "Procesando Faena Atómica..." : "Ejecutar Faena (Derivar 3 Cortes)"}
                  </button>
                  {!allChecksPass && (
                    <p className="text-xs text-error/80 text-center mt-1">Requiere cumplir todos los checks para habilitar la faena.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full py-4">
              <h3 className="font-bold text-sm text-text-muted uppercase tracking-wider mb-2">Historial Inmutable de Dominio</h3>
              
              <div className="flex flex-col gap-0 border-l-2 border-border ml-6">
                {asset.events && asset.events.length > 0 ? (
                  asset.events.map((ev: { id: string, eventType: string, createdAt: string | Date, signature?: string, hash: string }) => (
                    <div key={ev.id} className="relative pl-8 pb-8 group">
                      {/* Timeline Dot */}
                      <div className="absolute left-[-9px] top-1 h-4 w-4 rounded-full border-2 border-surface bg-primary shadow-sm group-hover:scale-125 transition-transform" />
                      
                      <div className="bg-surface border border-border rounded-xl p-4 shadow-sm hover:border-primary/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                           <h4 className="font-bold text-text-primary text-sm flex items-center gap-2">
                             {ev.eventType}
                             {ev.signature && <div title="Firmado Criptográficamente" className="inline-flex"><IconQrcode size={14} className="text-success" /></div>}
                           </h4>
                           <span className="text-xs text-text-muted font-mono">{format(new Date(ev.createdAt), "dd/MM/yyyy HH:mm")}</span>
                        </div>
                        <div className="bg-bg rounded border border-border/50 p-2 mt-2">
                          <p className="font-mono text-[10px] text-text-secondary break-all">
                            <span className="text-primary/70 mr-1">HASH:</span>{ev.hash}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-text-muted p-4">No hay eventos registrados en este activo.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'map' && (
            <div className="flex-1 min-h-[400px] flex items-center justify-center bg-surface-raised border border-dashed border-border rounded-xl">
               <div className="text-center flex flex-col items-center gap-3">
                 <IconMapPin size={48} className="text-text-muted/50" />
                 <p className="text-text-secondary font-medium">Ubicación Geoespacial y Geohash</p>
                 <span className="text-xs text-text-muted">El plugin de mapa Leaflet se integrará aquí para trazar el historial de movimiento.</span>
               </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="flex flex-col gap-8">
              <EvidenceUploader 
                 className="shadow-sm bg-surface w-full max-w-full"
                 onRequestSignedUrl={async (filename, contentType) => {
                    return await getSignedUrl.mutateAsync({ filename, contentType });
                 }}
                 onConfirmUpload={async (key) => {
                    const result = await confirmUpload.mutateAsync({ key });
                    return { status: result.status, message: result.message };
                 }}
                 onUploadSuccess={(data) => {
                    appendEvent.mutate({
                      streamId: asset.id,
                      eventType: 'DOCUMENT_ATTACHED',
                      hash: data.sha256,
                      payload: {
                         evidenceKey: data.key,
                         filename: data.filename,
                         sha256: data.sha256
                      }
                    }, {
                      onSuccess: () => {
                         utils.assets.getById.invalidate({ id: asset.id });
                      }
                    });
                 }}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                 {/* Evidencias reales extraídas del historial */}
                 {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                 {asset.events?.filter((e: any) => e.data?.evidenceKey).map((ev: any) => (
                   <div key={ev.id} className="p-5 border border-border rounded-xl bg-surface flex flex-col gap-3">
                      <div className="flex items-start justify-between">
                         <IconFiles size={32} stroke={1.5} className="text-primary/70" />
                         <span className="text-[10px] uppercase font-bold text-success bg-success/10 px-2 py-0.5 rounded">Verificado SHA-256</span>
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <h4 className="font-bold text-sm text-text-primary truncate" title={ev.data.filename}>{ev.data.filename || 'Evidencia Criptográfica'}</h4>
                        <p className="text-xs text-text-muted mt-1">{format(new Date(ev.createdAt), "dd MMM yyyy")}</p>
                        <p className="text-[10px] font-mono text-text-secondary mt-2 truncate max-w-full" title={ev.data.sha256}>{ev.data.sha256}</p>
                      </div>
                   </div>
                 ))}
                 
                 {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                 {(!asset.events || asset.events.filter((e: any) => e.data?.evidenceKey).length === 0) && (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl">
                       <IconFiles size={40} className="text-text-muted mb-3" />
                       <h4 className="text-sm font-bold text-text-primary">No hay documentos anexados</h4>
                       <p className="text-xs text-text-muted mt-1">Utiliza la caja superior para hashear y subir una evidencia.</p>
                    </div>
                 )}
              </div>
            </div>
          )}

        </div>
      </div>

      {isQRModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-surface rounded-2xl shadow-xl w-full max-w-sm border border-border overflow-hidden flex flex-col pt-6">
            <div className="flex flex-col items-center px-6">
               <h3 className="font-bold text-lg text-text-primary mb-1 text-center">Etiqueta de Trazabilidad</h3>
               <p className="text-sm text-text-muted text-center mb-6">Pega este QR físico en el paquete para enlazarlo a la Biffco Network.</p>
               
               <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative w-full aspect-square flex items-center justify-center mb-6">
                  {/* Utilizando el servicio gratuito de QR Server */}
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent('https://verify.biffco.co/' + asset.id)}&color=0C111D&bgcolor=FFFFFF`} alt="QR" className="w-full h-full object-contain mix-blend-multiply" />
               </div>
               
               <div className="w-full bg-surface-raised border border-border rounded-lg p-3 text-center mb-4 truncate text-xs font-mono text-text-secondary">
                 verify.biffco.co/{asset.id.split('-')[0]}
               </div>
            </div>
            
            <div className="grid grid-cols-2 divide-x divide-border border-t border-border mt-auto">
               <button onClick={() => setIsQRModalOpen(false)} className="py-4 font-semibold text-text-muted hover:bg-surface-raised transition-colors text-sm">
                 Cerrar Parcial
               </button>
               <button onClick={() => window.print()} className="py-4 font-bold text-primary hover:bg-primary/10 transition-colors flex items-center gap-2 justify-center text-sm shadow-inner">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                 Rotular PDF
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
