"use client"

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc'
import { Button } from '@biffco/ui'
import { IconArrowLeft, IconBox, IconHash, IconHistory, IconQrcode, IconPolygon, IconTruck, IconMapPin, IconBuildingStore, IconCheck, IconPrinter, IconFileExport, IconFileDownload, IconShare } from '@tabler/icons-react'
import { QRCodeSVG } from 'qrcode.react'
import { StatusPill } from '@/app/components/StatusPill'
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
  const verifyUrl = `https://verify.biffco.co/${asset.id}`

  const downloadCSV = () => {
     if (!asset) return;
     try {
       const header = ['TIPO_EVENTO', 'FECHA', 'FIRMA', 'HASH_INMUTABLE', 'MENSAJE', 'TRANSPORTE', 'DESTINO'];
       const rows = asset.events.map((e: any) => {
         const d = e.data || {};
         return [
           e.eventType,
           new Date(e.createdAt).toISOString(),
           e.signerAlias || e.signerId || '',
           e.hash,
           d.message || '',
           d.carrierAlias || d.carrierWorkspaceId || '',
           d.receiverAlias || d.receiverWorkspaceId || ''
         ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')
       });
       const csvContent = [header.join(','), ...rows].join('\n');
       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
       const url = URL.createObjectURL(blob);
       const link = document.createElement('a');
       link.setAttribute('href', url);
       link.setAttribute('download', `trazabilidad_${asset.id.slice(0,8)}.csv`);
       document.body.appendChild(link);
       link.click();
       document.body.removeChild(link);
     } catch (err) {
       console.error("Error generating CSV")
     }
  }

  return (
    <div className="flex flex-col gap-8 pb-12 animate-in fade-in duration-300 max-w-5xl mx-auto w-full">
      {/* Header and Back navigation */}
      <div className="flex items-start justify-between w-full">
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
            <StatusPill status={asset.status} />
          </div>
          <p className="text-text-secondary text-sm font-mono flex items-center gap-1.5 mt-1">
            <IconHash size={14} className="text-primary/70" />
            {asset.id}
          </p>
        </div>
        </div>
        
        <div className="flex gap-2">
            <Button 
                variant="outline" 
                size="icon"
                title="Descargar PDF (Vectorial)" 
                className="text-text-secondary"
                onClick={() => {
                  window.open(`/print/w/${workspaceId}/assets/${assetId}`, '_blank');
                }}
            >
                <IconFileDownload size={18} />
            </Button>
            <Button 
                variant="outline" 
                size="icon"
                title="Descargar CSV (Dataset)" 
                className="text-text-secondary"
                onClick={downloadCSV}
            >
                <IconFileExport size={18} />
            </Button>
            <Button 
                variant="outline" 
                size="icon"
                title="Imprimir" 
                className="text-text-secondary"
                onClick={() => window.open(`/print/w/${workspaceId}/assets/${assetId}`, '_blank')}
            >
                <IconPrinter size={18} />
            </Button>
            <Button 
                variant="outline" 
                size="icon"
                title="Compartir Trazabilidad" 
                className="text-text-secondary"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Pasaporte Biffco',
                      text: `Trazabilidad inmutable para el activo ${assetId}`,
                      url: verifyUrl
                    }).catch(err => console.error("Error compartiendo:", err));
                  } else {
                    navigator.clipboard.writeText(verifyUrl);
                    alert("Enlace público copiado al portapapeles.");
                  }
                }}
            >
                <IconShare size={18} />
            </Button>
            
            {asset.status === 'ACTIVE' && (asset.holds || []).length === 0 && (
              <Button 
                  variant="outline" 
                  size="icon"
                  title="Transformar Industrialmente (Split)" 
                  className="text-emerald-600 dark:text-emerald-400 border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 ml-2"
                  onClick={() => window.location.href = `/w/${workspaceId}/assets/${assetId}/split`}
              >
                  <IconArrowsSplit size={18} />
              </Button>
            )}
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

        {/* Columna Derecha: Trazabilidad y Ledger */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Lineage Box (Parents & Children) */}
          {(asset.parentIds?.length > 0 || asset.derivedChildren?.length > 0) && (
            <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-text-primary flex items-center gap-2 border-b border-border pb-3 mb-4">
                <IconArrowsSplit size={20} className="text-primary" />
                Genealogía Logística (Lineage)
              </h2>
              
              <div className="flex flex-col gap-4">
                {asset.parentIds?.length > 0 && (
                  <div>
                    <h3 className="text-xs uppercase tracking-wider font-semibold text-text-muted mb-2">Origen (Padres)</h3>
                    <div className="flex flex-wrap gap-2">
                       {asset.parentIds.map((pId: string) => (
                         <a key={pId} href={`/w/${workspaceId}/assets/${pId}`} className="text-sm border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors">
                            <IconArrowUpLeft size={16} />
                            {pId.split('_').pop()?.slice(0, 8)}...
                         </a>
                       ))}
                    </div>
                  </div>
                )}
                
                {asset.derivedChildren?.length > 0 && (
                  <div>
                    <h3 className="text-xs uppercase tracking-wider font-semibold text-text-muted mb-2">Derivaciones Industriales (Hijos)</h3>
                    <div className="flex flex-wrap gap-2">
                       {(asset as any).derivedChildren.map((child: any) => (
                         <a key={child.id} href={`/w/${workspaceId}/assets/${child.id}`} className="text-sm border border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors">
                            <IconArrowDownRight size={16} />
                            {child.type} - {child.id.split('_').pop()?.slice(0, 8)}...
                         </a>
                       ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Event Ledger */}
          <div className="flex flex-col gap-4">
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
                  
                  type VisualConf = { icon: React.ElementType, textColor: string, bgColor: string, ringColor: string, title: string };
                  const eventNameMap: Record<string, VisualConf> = {
                    'ASSET_CREATED': { icon: IconBox, textColor: 'text-blue-600', bgColor: 'bg-blue-100', ringColor: 'ring-blue-50', title: 'Registro Inicial' },
                    'LIVESTOCK_ORIGINATED': { icon: IconBox, textColor: 'text-blue-600', bgColor: 'bg-blue-100', ringColor: 'ring-blue-50', title: 'Nacimiento Registrado' },
                    'ASSET_DISPATCHED': { icon: IconTruck, textColor: 'text-amber-600', bgColor: 'bg-amber-100', ringColor: 'ring-amber-50', title: 'Despacho Logístico' },
                    'ASSET_TRANSIT_SCAN': { icon: IconMapPin, textColor: 'text-indigo-600', bgColor: 'bg-indigo-100', ringColor: 'ring-indigo-50', title: 'Punto de Control' },
                    'ASSET_RECEIVED': { icon: IconBuildingStore, textColor: 'text-emerald-600', bgColor: 'bg-emerald-100', ringColor: 'ring-emerald-50', title: 'Recepción en Destino' },
                    'ASSET_REJECTED': { icon: IconHistory, textColor: 'text-red-500', bgColor: 'bg-red-100', ringColor: 'ring-red-50', title: 'Carga Observada / Destino Rechazado' },
                  }
                  const defaultConf: VisualConf = { icon: IconCheck, textColor: 'text-primary', bgColor: 'bg-primary/10', ringColor: 'ring-bg', title: event.eventType.replace(/_/g, ' ') };
                  const v: VisualConf = eventNameMap[event.eventType] || defaultConf;
                  const displayDesc = eData.message || (isGenesis ? 'Activo dado de alta en la red Biffco' : 'Actualización de estado');

                  return (
                    <div key={event.id} className="relative pl-8 md:pl-12 pb-6">
                       {/* Timeline Marker (Iconized and Colored) */}
                       <div className={`absolute w-8 h-8 rounded-full left-[-16px] top-0 flex items-center justify-center ring-4 ${v.ringColor} ${v.bgColor} ${v.textColor}`}>
                         <v.icon size={16} stroke={2.5}/>
                       </div>
                       
                       {/* Event Card */}
                       <div className="flex flex-col gap-2">
                         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <h4 className={`font-bold text-base flex items-center gap-2 ${v.textColor}`}>
                              {v.title}
                              {isGenesis && <span className="bg-primary/10 text-primary text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">Génesis</span>}
                            </h4>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-text-muted font-medium bg-surface-raised px-2.5 py-1 rounded-full border border-border/50 w-max mt-1 sm:mt-0">
                                {new Date(event.createdAt).toLocaleDateString()} — {new Date(event.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                              <button
                                aria-label="Imprimir Certificado de Movimiento"
                                onClick={() => window.open(`/print/w/${workspaceId}/assets/${assetId}?eventId=${event.id}`, '_blank')}
                                className="text-text-muted hover:text-primary transition-colors p-1"
                                title="Imprimir Comprobante"
                              >
                                <IconPrinter size={16} />
                              </button>
                            </div>
                         </div>
                         
                         <p className="text-sm text-text-primary mt-1">{displayDesc}</p>
                         
                         {/* Optional Humanized Data Blocks */}
                         {(eData.carrierAlias || eData.receiverAlias) && (
                           <div className="flex flex-col gap-1 mt-1 bg-surface-raised/40 p-2 rounded border border-border/40">
                              {eData.carrierAlias && (
                                <span className="text-xs text-text-muted"><strong className="text-text-primary/90 font-medium">Logística:</strong> {eData.carrierAlias}</span>
                              )}
                              {eData.receiverAlias && (
                                <span className="text-xs text-text-muted"><strong className="text-text-primary/90 font-medium">Destino Pautado:</strong> {eData.receiverAlias}</span>
                              )}
                           </div>
                         )}
                         
                         {/* Blockchain Anchor Status */}
                         {(event as any).polygonTxHash && (
                           <div className="mt-2 inline-flex items-center gap-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-xs font-semibold px-2.5 py-1 rounded-md border border-purple-200 dark:border-purple-800/50 w-max shadow-sm">
                              <svg className="w-3.5 h-3.5" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.564 6.77L16.48 3.256a.956.956 0 00-1 0L9.4 6.772a.965.965 0 00-.5.84v7.03c0 .341.184.654.496.835L15.48 18.99v7.033a.965.965 0 001.004.835h.001c.17 0 .338-.046.488-.133l6.084-3.513a.965.965 0 00.496-.835V15.35c0-.341-.184-.654-.496-.835L16.97 10.999V3.972l5.594 3.23v1.85a.96.96 0 00.496.835l6.084 3.514a.956.956 0 001 0l6.084-3.513a.965.965 0 00.496-.835v-7.03a.965.965 0 00-.496-.835l-6.084-3.514a.956.956 0 00-1 0l-6.084 3.514a.965.965 0 00-.496.835v1.656z" fill="currentColor"/><path d="M9.4 17.202a.965.965 0 00-.496-.835L2.82 12.853a.956.956 0 00-1 0L-3.264 16.368a.965.965 0 00-.5.84v7.03c0 .341.184.654.496.835L2.816 28.586a.956.956 0 001 0l6.084-3.513a.965.965 0 00.496-.835V17.202h.004zm-5.594 6.544l-5.594-3.23V18.667l5.594 3.23v1.85z" fill="currentColor"/></svg>
                              Validado en Polygon: {(event as any).polygonTxHash.slice(0, 10)}...
                           </div>
                         )}
                         
                         <div className="flex items-center gap-1.5 text-xs text-text-muted mt-1">
                           <span className="opacity-70">Responsable:</span> 
                           <span className="font-mono bg-surface-raised px-1.5 py-0.5 rounded border border-border/50 text-text-primary">
                             {(event as any).signerAlias || event.signerId}
                           </span>
                         </div>

                         {/* First Level Accordion: Crypto Metadata */}
                         <details className="group mt-3">
                           <summary className="w-max cursor-pointer text-xs font-semibold text-text-secondary flex items-center gap-1.5 px-3 py-1.5 bg-surface-raised border border-border rounded-lg hover:bg-surface-raised/80 hover:text-text-primary transition-colors outline-none select-none">
                             <div className="group-open:hidden flex items-center gap-1.5"><IconPolygon size={14}/> Ver Evidencia Matemática </div>
                             <div className="hidden group-open:flex items-center gap-1.5"><IconPolygon size={14}/> Ocultar Evidencia </div>
                           </summary>
                           
                           <div className="bg-surface border border-border/60 rounded-xl p-4 text-xs text-text-secondary font-mono overflow-x-auto mt-2 shadow-sm flex flex-col gap-4">
                              <div className="flex flex-col gap-3 pb-3 border-b border-border/40">
                                <div className="flex flex-col gap-1">
                                  <span className="text-text-muted font-bold text-[10px] uppercase tracking-wider">SHA-256 Hash del Bloque</span>
                                  <span className="text-primary/90 break-all">{event.hash}</span>
                                </div>
                                {event.polygonTxHash && (
                                  <div className="flex flex-col gap-1">
                                    <span className="text-text-muted font-bold text-[10px] uppercase tracking-wider">Certificado Blockhain Polygon</span>
                                    <a href={`https://amoy.polygonscan.com/tx/${event.polygonTxHash}`} target="_blank" rel="noreferrer" className="text-[#8247E5] flex items-center gap-1 w-max hover:underline bg-[#8247E5]/10 px-2 py-1 rounded">
                                      TX: {event.polygonTxHash.slice(0, 16)}... <IconPolygon size={12}/>
                                    </a>
                                  </div>
                                )}
                              </div>

                              {/* Second Level Accordion: JSON Payload */}
                              <details className="group/json">
                                <summary className="w-max cursor-pointer text-xs font-medium text-text-muted flex items-center gap-1 hover:text-text-primary outline-none select-none">
                                  <span className="group-open/json:hidden border-b border-dashed border-text-muted/50 pb-0.5">Inspeccionar Payload Crudo (JSON)</span>
                                  <span className="hidden group-open/json:inline border-b border-dashed border-text-muted/50 pb-0.5">Ocultar Payload</span>
                                </summary>
                                <pre className="text-text-muted/80 mt-3 p-3 bg-bg-subtle rounded-lg border border-border/50">
                                  {JSON.stringify(eData, null, 2)}
                                </pre>
                              </details>
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
  </div>
  )
}

