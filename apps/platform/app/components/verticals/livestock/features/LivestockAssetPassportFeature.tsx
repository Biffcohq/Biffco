'use client'

import React from 'react'
import { trpc } from '@/lib/trpc'
import { useSearchParams, useRouter } from 'next/navigation'
import { Skeleton } from '@/app/components/ui/Skeleton'
import { IconArrowLeft, IconBox, IconVaccine, IconMapPin, IconScale, IconExternalLink, IconTimeline, IconHash } from '@tabler/icons-react'
import { Button } from '@biffco/ui'

import { QRCodeSVG } from 'qrcode.react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LivestockAssetPassportFeature({ workspace, roleId }: { workspace: any, roleId: string }) {
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
      <div className="flex flex-col gap-6 animate-pulse w-full max-w-5xl mx-auto pb-12">
        <Skeleton className="h-20 w-1/3 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Skeleton className="h-[500px] w-full rounded-xl" />
           <Skeleton className="h-[500px] w-full rounded-xl md:col-span-2" />
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

  const metadata = asset.metadata as any
  const facilityName = facilities?.find(f => f.id === metadata?.facilityId)?.name || metadata?.facilityId?.slice(0, 8) || 'Multi-tránsito'
  const breed = metadata?.initialState?.breed || 'Bovino'
  const weight = metadata?.initialState?.weight || '--'

  const verificationUrl = `https://verify.biffco.co/${asset.id}`
  const registrationDate = asset.createdAt ? new Date(asset.createdAt).toLocaleDateString() : 'Desconocido'

  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500 pb-12 w-full max-w-6xl mx-auto">
      <div className="flex items-center gap-4 pb-2 border-b border-border/50">
        <Button variant="ghost" className="size-10 p-0 rounded-full border border-border/50 bg-surface shadow-sm hover:bg-bg-subtle" onClick={() => router.back()}>
           <IconArrowLeft size={18} className="text-text-secondary" />
        </Button>
        <div>
          <h2 className="text-3xl font-black tracking-tight text-text-primary flex items-center gap-2">
            Pasaporte Digital
          </h2>
          <p className="text-sm text-text-muted font-medium mt-0.5">
            Registro inmutable validado en blockchain
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Identity Sidebar */}
         <div className="md:col-span-1 flex flex-col gap-4">
            <div className="bg-surface border border-border rounded-xl p-6 flex flex-col items-center text-center shadow-sm relative overflow-hidden">
               <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-primary/10 to-transparent" />
               
               <div className="size-20 rounded-2xl bg-white shadow-md border border-primary/20 text-primary flex items-center justify-center mb-4 relative z-10">
                  <IconBox size={36} stroke={1.5} />
               </div>
               
               <h3 className="text-2xl font-black text-text-primary relative z-10">{breed}</h3>
               <p className="text-sm font-mono text-text-secondary mt-1 flex items-center gap-1.5 relative z-10">
                  EID: <span className="font-bold text-text-primary">{metadata?.externalId || asset.id.slice(0,10)}</span>
               </p>
               
               <span className={`mt-3 px-3.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-full relative z-10 border ${asset.status === 'ACTIVE' ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'}`}>
                 {asset.status === 'ACTIVE' ? 'ACTIVO (VIVO)' : asset.status}
               </span>
               
               <div className="w-full h-px bg-border/60 my-6 relative z-10" />
               
               <div className="w-full flex flex-col gap-3 text-sm relative z-10 text-left">
                  <div className="flex justify-between items-center bg-bg-subtle/50 px-3 py-2 rounded-lg border border-border/40">
                     <span className="text-[11px] uppercase font-bold text-text-muted tracking-wider">Creado</span>
                     <span className="font-medium text-text-primary">{registrationDate}</span>
                  </div>
                  <div className="flex justify-between items-center bg-bg-subtle/50 px-3 py-2 rounded-lg border border-border/40">
                     <span className="text-[11px] uppercase font-bold text-text-muted tracking-wider">Locación</span>
                     <span className="font-bold text-text-primary truncate max-w-[120px]">{facilityName}</span>
                  </div>
                  <div className="flex justify-between items-center bg-bg-subtle/50 px-3 py-2 rounded-lg border border-border/40">
                     <span className="text-[11px] uppercase font-bold text-text-muted tracking-wider flex items-center gap-1"><IconHash size={12}/> Hash Core</span>
                     <span className="font-mono text-xs font-semibold text-text-primary text-right break-all ml-4" title={asset.id}>{asset.id}</span>
                  </div>
               </div>
               
               <div className="w-full mt-6 flex flex-col items-center">
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200">
                     <QRCodeSVG 
                        value={verificationUrl}
                        size={140}
                        bgColor={"#ffffff"}
                        fgColor={"#0f172a"}
                        level={"Q"}
                        includeMargin={false}
                     />
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-3 bg-bg-subtle text-primary border-primary/20 hover:bg-primary/5 text-xs font-bold"
                    onClick={() => window.open(verificationUrl, '_blank')}
                  >
                     <IconExternalLink size={14} className="mr-1.5" />
                     Abrir Portal de Verificación
                  </Button>
               </div>
            </div>
         </div>

         {/* Timeline & Details */}
         <div className="md:col-span-2 flex flex-col gap-6">
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
               <div className="bg-surface border border-border rounded-xl p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex flex-col gap-1 items-start">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-2">
                     <IconScale size={18} stroke={2} />
                  </div>
                  <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Peso Actual</p>
                  <p className="text-2xl font-black text-text-primary">{weight} kg</p>
               </div>
               <div className="bg-surface border border-border rounded-xl p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex flex-col gap-1 items-start">
                  <div className="h-8 w-8 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center mb-2">
                     <IconVaccine size={18} stroke={2} />
                  </div>
                  <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Fenotipo</p>
                  <p className="text-2xl font-black text-text-primary">{breed}</p>
               </div>
               <div className="bg-surface border border-border rounded-xl p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex flex-col gap-1 items-start col-span-2 sm:col-span-1">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center mb-2">
                     <IconMapPin size={18} stroke={2} />
                  </div>
                  <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Dominio Raíz</p>
                  <p className="text-sm font-bold text-text-primary mt-1 line-clamp-2" title={workspace?.name || asset.workspaceId}>{workspace?.name || asset.workspaceId}</p>
               </div>
            </div>

            <div className="bg-surface border border-border rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
               <div className="px-6 py-5 border-b border-border/50 bg-bg-subtle/30 flex items-center gap-3">
                  <div className="p-1.5 bg-primary/10 rounded-md text-primary">
                    <IconTimeline size={20} />
                  </div>
                  <h4 className="text-lg font-bold text-text-primary">Trazabilidad Web3</h4>
               </div>
               
               <div className="p-6">
                  <div className="relative pl-6 border-l-2 border-border/60 ml-3 flex flex-col gap-8">
                     {(asset as any).events?.length === 0 && (
                        <p className="text-sm text-text-muted italic -ml-4">Aún no hay eventos registrados en este pasaporte.</p>
                     )}
                     {(asset as any).events?.map((ev: any, index: number) => (
                       <div key={ev.id} className="relative group">
                          <div className={`absolute -left-[35px] top-1 size-4 rounded-full ring-4 ring-surface ${index === 0 ? 'bg-primary' : 'bg-slate-300'}`} />
                          
                          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3 bg-bg-subtle/30 p-4 rounded-xl border border-border/50 hover:border-border transition-colors">
                              <div className="flex flex-col gap-1">
                                 <p className="text-base font-bold text-text-primary capitalize">{ev.eventType.replace(/_/g, ' ').toLowerCase()}</p>
                                 <p className="text-xs text-text-muted flex items-center gap-1.5">
                                    <span className="font-mono">{new Date(ev.createdAt).toLocaleString()}</span>
                                    <span>&bull;</span>
                                    <span>Autenticado por <span className="font-bold text-text-secondary">{ev.signerAlias || 'Sistema Maestro'}</span></span>
                                 </p>
                              </div>
                              
                              {ev.anchorTxHash && (
                                  <a 
                                    href={`https://amoy.polygonscan.com/tx/${ev.anchorTxHash}`} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-[10px] uppercase font-black bg-[#8247E5]/10 text-[#8247E5] border border-[#8247E5]/20 hover:bg-[#8247E5]/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 w-max transition-colors shadow-sm"
                                  >
                                     <svg viewBox="0 0 40 40" className="size-3.5 fill-current"><path d="M28.8 17.6l-7-4.1a3.5 3.5 0 00-3.5 0l-7 4.1a3.5 3.5 0 00-1.8 3v8.1a3.5 3.5 0 001.8 3l7 4.1a3.5 3.5 0 003.5 0l7-4.1a3.5 3.5 0 001.8-3v-8.1a3.5 3.5 0 00-1.8-3zm-10.5 9.7l-4.5-2.6a1.2 1.2 0 01-.6-1v-5.1c0-.4.3-.8.6-1l4.5-2.6a1.2 1.2 0 011.2 0l4.5 2.6c.4.2.6.6.6 1v5.1c0 .4-.3.8-.6 1l-4.5 2.6a1.2 1.2 0 01-1.2 0z"/></svg>
                                     Polygon Amoy
                                  </a>
                              )}
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}
