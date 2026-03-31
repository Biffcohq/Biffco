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
  IconPlus
} from '@tabler/icons-react'
import Link from 'next/link'
import { format } from 'date-fns'

type TabType = 'info' | 'timeline' | 'map' | 'documents'

export default function AssetDetailPage({ params }: { params: { wsId: string, id: string } }) {
  const [activeTab, setActiveTab] = useState<TabType>('info')

  const { data: asset, isLoading } = trpc.assets.getById.useQuery({ 
    id: params.id 
  })

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
          </div>
          <span className="text-xs font-mono text-text-muted tracking-widest uppercase">
            {asset.id}
          </span>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
           <span className="px-3 py-1.5 border border-border bg-bg rounded-md text-xs font-mono font-medium text-text-secondary flex items-center gap-2">
             <IconQrcode size={16} className="text-primary"/>
             Identidad Digital
           </span>
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
              
              {/* Payload Card */}
              <div className="bg-surface border border-border rounded-xl flex flex-col overflow-hidden">
                 <h3 className="font-bold text-sm text-text-muted uppercase tracking-wider p-5 border-b border-border">Payload de Estado</h3>
                 <div className="p-5 bg-surface-raised flex-1 overflow-auto">
                    <pre className="text-xs font-mono text-text-secondary whitespace-pre-wrap">
                      {JSON.stringify(asset.metadata, null, 2)}
                    </pre>
                 </div>
              </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
               <div className="p-8 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-surface hover:border-primary/50 cursor-pointer transition-colors group">
                 <div className="size-12 rounded-full bg-surface-raised border border-border flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-transform">
                   <IconPlus size={24} className="text-text-muted group-hover:text-primary transition-colors" />
                 </div>
                 <span className="text-sm font-medium text-text-secondary group-hover:text-primary">Vincular Documento</span>
               </div>
               
               {/* Mock documents */}
               {[1,2].map(i => (
                 <div key={i} className="p-5 border border-border rounded-xl bg-surface flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                       <IconFiles size={32} stroke={1.5} className="text-primary/70" />
                       <span className="text-[10px] uppercase font-bold text-success bg-success/10 px-2 py-0.5 rounded">Verificado</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-text-primary">Certificado_Senasa_2024.pdf</h4>
                      <p className="text-xs text-text-muted mt-1">Vinculado hace 2 días</p>
                    </div>
                 </div>
               ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
