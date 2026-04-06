'use client'

import React from 'react'
import { trpc } from '@/lib/trpc'
import { useSearchParams, useRouter } from 'next/navigation'
import { Skeleton } from '@/app/components/ui/Skeleton'
import { IconArrowLeft, IconBox, IconVaccine, IconMapPin, IconScale, IconExternalLink, IconTimeline, IconHash, IconPackages, IconChevronDown, IconCategory, IconTag, IconFileCheck, IconStethoscope, IconTruckDelivery } from '@tabler/icons-react'
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
          <h2 className="text-xl font-bold tracking-tight text-text-primary">
            Pasaporte Digital
          </h2>
          <p className="text-sm font-medium text-text-muted mt-0.5">
            Registro autogestionado por blockchain
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-y-12 md:gap-x-12 mt-6">
         {/* Identity Column (Left) */}
         <div className="md:col-span-1 flex flex-col items-start gap-8 bg-surface border border-border/50 rounded-2xl p-8 shadow-sm h-max">
            <div className="flex flex-col items-start gap-1 w-full">
               <div className="text-primary mb-2 bg-primary/10 p-3 rounded-2xl">
                  <IconBox size={32} stroke={1.5} />
               </div>
               
               <h3 className="text-2xl font-black text-text-primary tracking-tight">{metadata?.externalId || asset.id.slice(0,10)}</h3>
               <p className="text-xs font-mono font-medium text-text-secondary" title={asset.id}>
                  Ref: {asset.id.slice(0, 10)}
               </p>
               
               <div className={`mt-2 text-sm font-bold ${asset.status === 'ACTIVE' ? 'text-success' : 'text-text-secondary'}`}>
                 {asset.status === 'ACTIVE' ? 'Activo (Vivo)' : asset.status}
               </div>
            </div>

            <div className="w-full h-px bg-border/50" />
            
            <div className="w-full flex flex-col gap-4 text-sm">
               <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Desplegado</span>
                  <span className="text-text-primary font-medium">{registrationDate}</span>
               </div>
               <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Localidad</span>
                  <span className="text-text-primary font-medium">{facilityName}</span>
               </div>
               <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1"><IconHash size={12}/> Hash Raíz</span>
                  <span className="font-mono text-[10px] text-text-secondary break-all font-medium" title={asset.id}>{asset.id}</span>
               </div>
            </div>
            
            <div className="w-full mt-4 flex flex-col items-center justify-center p-6 bg-white border border-border/50 rounded-2xl shadow-sm gap-4">
               <div className="text-center font-bold text-sm text-text-primary">Escanear para Verificar</div>
               <QRCodeSVG 
                  value={verificationUrl}
                  size={140}
                  bgColor={"#ffffff"}
                  fgColor={"#0f172a"}
                  level={"M"}
                  includeMargin={false}
               />
               <a 
                 href={verificationUrl} 
                 target="_blank" 
                 rel="noreferrer"
                 className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5"
               >
                  <IconExternalLink size={14} /> Portal Público
               </a>
            </div>
         </div>

         {/* Content Column (Right) */}
         <div className="md:col-span-3 flex flex-col gap-12 bg-surface/50 border border-border/50 rounded-2xl p-8 md:p-10 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            
            {/* Stats */}
            <div>
               <h4 className="text-[11px] uppercase text-text-muted tracking-widest font-bold mb-4">Métricas Biológicas</h4>
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                  <div className="flex flex-col gap-1.5">
                     <span className="text-[11px] font-bold uppercase text-text-muted tracking-widest flex items-center gap-1.5">
                        <IconTag size={14} className="text-orange-500/80" /> Raza
                     </span>
                     <span className="text-lg font-black text-text-primary">{breed}</span>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                     <span className="text-[11px] font-bold uppercase text-text-muted tracking-widest flex items-center gap-1.5">
                        <IconCategory size={14} className="text-blue-500/80" /> Categoría
                     </span>
                     <span className="text-lg font-black text-text-primary">{category} <span className="text-sm font-medium text-text-secondary w-max bg-bg-subtle px-1.5 py-0.5 rounded-md ml-1">{sex}</span></span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                     <span className="text-[11px] font-bold uppercase text-text-muted tracking-widest flex items-center gap-1.5">
                        <IconScale size={14} className="text-emerald-500/80" /> Peso
                     </span>
                     <span className="text-lg font-black text-text-primary">{weight} kg</span>
                  </div>

                  <div className="flex flex-col gap-1.5 col-span-2 lg:col-span-1">
                     <span className="text-[11px] font-bold uppercase text-text-muted tracking-widest flex items-center gap-1.5">
                        <IconMapPin size={14} className="text-indigo-500/80" /> Dominio
                     </span>
                     <span className="text-base font-bold text-text-primary line-clamp-2" title={workspace?.name || asset.workspaceId}>{workspace?.name || asset.workspaceId}</span>
                  </div>
               </div>
            </div>

            <div className="w-full h-px bg-border/50" />

            {/* Timeline */}
            <div className="flex flex-col">
               <div className="flex items-center gap-2 mb-8 text-text-primary">
                  <IconTimeline size={20} className="text-primary" />
                  <h4 className="text-xl font-bold tracking-tight">Trazabilidad Web3</h4>
               </div>
               
               <div className="relative pl-[11px] border-l border-border/80 ml-2 flex flex-col gap-10">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(asset as any).events?.length === 0 && (
                     <p className="text-sm text-text-muted italic -ml-4">Sin eventos registrados.</p>
                  )}
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(asset as any).events?.map((ev: any, index: number) => {
                     
                     // Helper Dictionary para humanizar eventos
                     const getEventMeta = (type: string) => {
                       const meta: Record<string, any> = {
                          'LIVESTOCK_ORIGINATED': { title: 'Nacimiento Registrado', icon: IconBox, color: 'text-blue-500' },
                          'HEALTH_CERT_ISSUED': { title: 'Certificado Sanitario Expedido', icon: IconFileCheck, color: 'text-emerald-500' },
                          'TREATMENT_ADMINISTERED': { title: 'Tratamiento Médico', icon: IconStethoscope, color: 'text-red-500' },
                          'VACCINE_ADMINISTERED': { title: 'Vacunación', icon: IconVaccine, color: 'text-orange-500' },
                          'ASSET_TRANSIT_SCAN': { title: 'Escaneo en Origen (Logística)', icon: IconTruckDelivery, color: 'text-indigo-500' },
                          'ASSET_RECEIVED': { title: 'Recepción en Destino', icon: IconMapPin, color: 'text-emerald-500' },
                          'GROUP_CREATED': { title: 'Asignación a Tropa/Lote', icon: IconPackages, color: 'text-purple-500' },
                          'SLAUGHTER_COMPLETED': { title: 'Faena Completada', icon: IconScale, color: 'text-rose-500' }
                       }
                       return meta[type] || { title: type.replace(/_/g, ' '), icon: IconTimeline, color: 'text-text-muted' };
                     }
                     
                     const { title: eventTitle, icon: EventIcon, color: iconColor } = getEventMeta(ev.eventType);

                     return (
                       <div key={ev.id} className="relative group/event -ml-6 pl-10">
                          <div className={`absolute left-[-2px] top-4 size-3.5 rounded-full bg-surface border-2 outline outline-2 outline-surface ${index === 0 ? 'border-primary' : 'border-border/80'}`} />
                          
                          <div className="flex flex-col gap-3 w-full max-w-2xl bg-white border border-border/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex items-center gap-2.5">
                                 <EventIcon size={18} className={`${iconColor}`} />
                                 <h5 className="text-lg font-bold text-text-primary capitalize">{eventTitle}</h5>
                              </div>
                              
                              <div className="text-sm text-text-secondary flex flex-wrap items-center gap-2 mb-1">
                                 <span className="font-mono font-medium">{new Date(ev.createdAt).toLocaleString()}</span>
                                 <span className="text-text-muted/50">&bull;</span>
                                 <span>Subida por <span className="font-bold text-text-primary">{ev.signerAlias || 'Sistema Maestro'}</span></span>
                              </div>
                              
                              {ev.anchorTxHash && (
                                  <a 
                                    href={`https://amoy.polygonscan.com/tx/${ev.anchorTxHash}`} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-[10px] uppercase font-black bg-[#8247E5]/10 text-[#8247E5] border border-[#8247E5]/20 hover:bg-[#8247E5]/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 w-max transition-colors shadow-sm mt-1"
                                  >
                                     Polygon Amoy <IconExternalLink size={10} stroke={2.5} />
                                  </a>
                              )}
                             
                              <details className="mt-2 group/details">
                                <summary className="text-[11px] font-bold uppercase text-text-muted hover:text-text-primary cursor-pointer list-none flex items-center gap-1 select-none w-max transition-colors">
                                  Datos Clave Web3 <IconChevronDown size={12} className="opacity-50 group-open/details:rotate-180 transition-transform" />
                                </summary>
                                <div className="mt-3 p-4 bg-bg-subtle/50 rounded-xl border border-border/50 text-[11px] font-mono text-text-secondary flex flex-col gap-3">
                                   <div>
                                     <span className="uppercase font-bold text-text-muted block mb-1">Firma Criptográfica (Vault ID)</span>
                                     <span className="break-all text-text-primary font-medium">{ev.accountId || 'Depositario en Custodia'}</span>
                                   </div>
                                   <div>
                                     <span className="uppercase font-bold text-text-muted block mb-1">Carga Integridad (Hash de Operación)</span>
                                     <span className="break-all text-text-primary">{ev.hash || '--'}</span>
                                   </div>
                                   <div>
                                     <span className="uppercase font-bold text-text-muted block mb-1">Detalle de Payload Registrado</span>
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
