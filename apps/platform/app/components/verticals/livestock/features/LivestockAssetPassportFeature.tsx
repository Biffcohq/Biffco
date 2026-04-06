'use client'

import React from 'react'
import { trpc } from '@/lib/trpc'
import { useSearchParams, useRouter } from 'next/navigation'
import { Skeleton } from '@/app/components/ui/Skeleton'
import { IconArrowLeft, IconBox, IconVaccine, IconMapPin, IconScale, IconExternalLink, IconTimeline, IconHash, IconPackages, IconChevronDown, IconCategory, IconTag } from '@tabler/icons-react'
import { Button } from '@biffco/ui'

import { QRCodeSVG } from 'qrcode.react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LivestockAssetPassportFeature({ workspace }: { workspace: any, roleId: string }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const assetId = searchParams.get('assetId')

  const { data: asset, isLoading } = trpc.assets.getById.useQuery(
    { id: assetId as string },
    { enabled: !!assetId }
  )

  const { data: facilities } = trpc.facilities.list.useQuery()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse w-full mx-auto pb-12">
        <Skeleton className="h-10 w-1/3 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mt-6">
           <Skeleton className="h-[400px] w-full rounded-lg" />
           <Skeleton className="h-[400px] w-full rounded-lg md:col-span-3" />
        </div>
      </div>
    )
  }

  if (!asset) {
    return (
      <div className="p-12 text-center text-text-muted">
         No se encontró el activo solicitado o no tienes permiso para visualizarlo.
      </div>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const metadata = asset.metadata as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const facilityName = facilities?.find((f: any) => f.id === metadata?.facilityId)?.name || metadata?.facilityId?.slice(0, 8) || 'Multi-tránsito'
  const breed = metadata?.initialState?.breed || 'Sin Especificar'
  const category = metadata?.initialState?.category || '--'
  const sex = metadata?.initialState?.sex || '--'
  const weight = metadata?.initialState?.weight || '--'

  const verificationUrl = `https://verify.biffco.co/${asset.id}`
  const registrationDate = asset.createdAt ? new Date(asset.createdAt).toLocaleDateString() : 'Desconocido'

  return (
    <div className="flex flex-col animate-in fade-in zoom-in-95 duration-500 pb-12 w-full mx-auto">
      
      {/* Header */}
      <div className="flex items-center gap-4 pb-4">
        <Button variant="ghost" className="size-8 p-0 rounded-full border border-transparent hover:border-border/50 text-text-muted hover:text-text-primary" onClick={() => router.back()}>
           <IconArrowLeft size={18} />
        </Button>
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-text-primary">
            Pasaporte Digital
          </h2>
          <p className="text-sm text-text-muted">
            Registro autogestionado por blockchain
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-y-12 md:gap-x-12 mt-6">
         {/* Identity Column (Left) */}
         <div className="md:col-span-1 flex flex-col items-start gap-8 bg-surface border border-border/50 rounded-[2rem] p-8 shadow-sm h-max">
            <div className="flex flex-col items-start gap-1 w-full">
               <div className="text-primary mb-2">
                  <IconBox size={32} stroke={1.5} />
               </div>
               
               <h3 className="text-xl font-bold text-text-primary tracking-tight">{metadata?.externalId || asset.id.slice(0,10)}</h3>
               <p className="text-xs font-mono text-text-muted" title={asset.id}>
                  Ref: {asset.id.slice(0, 10)}
               </p>
               
               <div className={`mt-2 text-xs font-semibold ${asset.status === 'ACTIVE' ? 'text-success' : 'text-text-secondary'}`}>
                 {asset.status === 'ACTIVE' ? 'Activo (Vivo)' : asset.status}
               </div>
            </div>

            <div className="w-full h-px bg-border/50" />
            
            <div className="w-full flex flex-col gap-4 text-sm">
               <div className="flex flex-col gap-1">
                  <span className="text-[11px] uppercase tracking-wider text-text-muted">Desplegado</span>
                  <span className="text-text-primary">{registrationDate}</span>
               </div>
               <div className="flex flex-col gap-1">
                  <span className="text-[11px] uppercase tracking-wider text-text-muted">Localidad</span>
                  <span className="text-text-primary">{facilityName}</span>
               </div>
               <div className="flex flex-col gap-1">
                  <span className="text-[11px] uppercase tracking-wider text-text-muted flex items-center gap-1"><IconHash size={12}/> Hash Raíz</span>
                  <span className="font-mono text-[10px] text-text-secondary break-all" title={asset.id}>{asset.id}</span>
               </div>
            </div>
            
            <div className="w-full flex flex-col gap-4">
               <div className="p-2 border border-border/50 bg-white inline-block">
                  <QRCodeSVG 
                     value={verificationUrl}
                     size={120}
                     bgColor={"#ffffff"}
                     fgColor={"#0f172a"}
                     level={"M"}
                     includeMargin={false}
                  />
               </div>
               <a 
                 href={verificationUrl} 
                 target="_blank" 
                 rel="noreferrer"
                 className="text-xs text-primary hover:underline flex items-center gap-1.5 font-medium"
               >
                  <IconExternalLink size={14} /> Portal Público
               </a>
            </div>
         </div>

         {/* Content Column (Right) */}
         <div className="md:col-span-3 flex flex-col gap-12 bg-surface/50 border border-border/50 rounded-[2rem] p-8 md:p-10 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            
            {/* Stats */}
            <div>
               <h4 className="text-[11px] uppercase text-text-muted tracking-widest font-semibold mb-4">Métricas Biológicas</h4>
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                  <div className="flex flex-col gap-1">
                     <span className="text-[11px] uppercase text-text-muted tracking-widest flex items-center gap-1.5">
                        <IconTag size={14} className="text-orange-500/70" /> Raza
                     </span>
                     <span className="text-base font-medium text-text-primary">{breed}</span>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                     <span className="text-[11px] uppercase text-text-muted tracking-widest flex items-center gap-1.5">
                        <IconCategory size={14} className="text-blue-500/70" /> Categoría
                     </span>
                     <span className="text-base font-medium text-text-primary">{category} ({sex})</span>
                  </div>

                  <div className="flex flex-col gap-1">
                     <span className="text-[11px] uppercase text-text-muted tracking-widest flex items-center gap-1.5">
                        <IconScale size={14} className="text-emerald-500/70" /> Peso
                     </span>
                     <span className="text-base font-medium text-text-primary">{weight} kg</span>
                  </div>

                  <div className="flex flex-col gap-1 col-span-2 lg:col-span-1">
                     <span className="text-[11px] uppercase text-text-muted tracking-widest flex items-center gap-1.5">
                        <IconMapPin size={14} className="text-indigo-500/70" /> Dominio
                     </span>
                     <span className="text-sm font-medium text-text-primary line-clamp-2" title={workspace?.name || asset.workspaceId}>{workspace?.name || asset.workspaceId}</span>
                  </div>
               </div>
            </div>

            <div className="w-full h-px bg-border/50" />

            {/* Timeline */}
            <div className="flex flex-col">
               <div className="flex items-center gap-2 mb-8 text-text-primary">
                  <IconTimeline size={18} className="text-primary/70" />
                  <h4 className="text-lg font-semibold">Trazabilidad Web3</h4>
               </div>
               
               <div className="relative pl-[11px] border-l border-border/80 ml-2 flex flex-col gap-10">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(asset as any).events?.length === 0 && (
                     <p className="text-sm text-text-muted italic -ml-4">Sin eventos registrados.</p>
                  )}
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(asset as any).events?.map((ev: any, index: number) => {
                     const isGroup = ev.eventType.includes('LOT') || ev.eventType.includes('GROUP');
                     const isVaccine = ev.eventType.includes('VACCINE') || ev.eventType.includes('HEALTH');
                     const isReceive = ev.eventType.includes('RECEIVED');
                     const isDispatch = ev.eventType.includes('DISPATCHED');
                     
                     let EventIcon = IconTimeline;
                     let iconColor = 'text-text-muted';
                     
                     if (isGroup) { EventIcon = IconPackages; iconColor = 'text-blue-500'; }
                     else if (isVaccine) { EventIcon = IconVaccine; iconColor = 'text-orange-500'; }
                     else if (isDispatch || isReceive) { EventIcon = IconMapPin; iconColor = 'text-emerald-500'; }
                     if (index === 0) iconColor = 'text-primary';

                     return (
                       <div key={ev.id} className="relative group/event -ml-6 pl-10">
                          <div className={`absolute left-[-2px] top-1 size-3.5 rounded-full bg-surface border-2 outline outline-2 outline-surface ${index === 0 ? 'border-primary' : 'border-border/80'}`} />
                          
                          <div className="flex flex-col gap-2 w-full max-w-2xl bg-white border border-border/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex items-center gap-2">
                                 <EventIcon size={16} className={`${iconColor}`} />
                                 <h5 className="text-base font-semibold text-text-primary capitalize">{ev.eventType.replace(/_/g, ' ').toLowerCase()}</h5>
                              </div>
                              
                              <div className="text-xs text-text-secondary flex flex-wrap items-center gap-1.5 mb-1">
                                 <span className="font-mono">{new Date(ev.createdAt).toLocaleString()}</span>
                                 <span className="text-text-muted/50">&bull;</span>
                                 <span>Firmado por <span className="font-medium text-text-primary">{ev.signerAlias || 'Sistema Maestro'}</span></span>
                              </div>
                              
                              {ev.anchorTxHash && (
                                  <a 
                                    href={`https://amoy.polygonscan.com/tx/${ev.anchorTxHash}`} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-[10px] uppercase font-black bg-[#8247E5]/10 text-[#8247E5] border border-[#8247E5]/20 hover:bg-[#8247E5]/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 w-max transition-colors shadow-sm mt-2"
                                  >
                                     Polygon Amoy <IconExternalLink size={10} />
                                  </a>
                              )}
                             
                              <details className="mt-1">
                                <summary className="text-[11px] text-text-muted hover:text-text-primary cursor-pointer list-none flex items-center gap-1 select-none w-max transition-colors">
                                  Datos de auditoría <IconChevronDown size={12} className="opacity-50" />
                                </summary>
                                <div className="mt-3 p-3 bg-bg-subtle/40 rounded border border-border/40 text-[10px] font-mono text-text-secondary flex flex-col gap-2">
                                   <div>
                                     <span className="uppercase text-text-muted block mb-0.5 opacity-70">Hash Raíz Evento</span>
                                     <span className="break-all">{ev.hash || '--'}</span>
                                   </div>
                                   <div>
                                     <span className="uppercase text-text-muted block mb-0.5 opacity-70">Payload JSON</span>
                                     <span className="break-all whitespace-pre-wrap">{JSON.stringify(ev.data, null, 2)}</span>
                                   </div>
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
