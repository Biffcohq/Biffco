'use client'

import React from 'react'
import { trpc } from '@/lib/trpc'
import { useSearchParams, useRouter } from 'next/navigation'
import { Skeleton } from '@/app/components/ui/Skeleton'
import { IconArrowLeft, IconBox, IconVaccine, IconMapPin, IconScale, IconQrcode, IconLink } from '@tabler/icons-react'
import { Button } from '@biffco/ui'

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
      <div className="flex flex-col gap-6 animate-pulse w-full">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
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
  const facilityName = facilities?.find(f => f.id === metadata?.facilityId)?.name || metadata?.facilityId?.slice(0, 8) || 'En tránsito'
  const breed = metadata?.initialState?.breed || 'Bovino'
  const weight = metadata?.initialState?.weight || '--'

  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500 pb-12 w-full">
      <div className="flex items-center gap-4 border-b border-border pb-4">
        <Button variant="ghost" className="size-10 p-0 rounded-full" onClick={() => router.back()}>
           <IconArrowLeft size={20} />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            Pasaporte Individual
          </h2>
          <p className="text-sm text-text-muted mt-1 font-mono">
            EID: {metadata?.externalId || asset.id}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-1 flex flex-col gap-4">
            <div className="bg-surface border border-border rounded-xl p-6 flex flex-col items-center text-center shadow-sm">
               <div className="size-24 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <IconBox size={40} />
               </div>
               <h3 className="text-xl font-bold text-text-primary">{breed}</h3>
               <span className={`mt-2 px-3 py-1 text-xs font-bold uppercase rounded-full ${asset.status === 'ACTIVE' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                 {asset.status === 'ACTIVE' ? 'ACTIVO' : asset.status}
               </span>
               <div className="w-full h-px bg-border my-6" />
               <div className="w-full flex justify-between items-center text-sm mb-4">
                  <span className="text-text-muted font-medium">Establecimiento actual</span>
                  <span className="font-bold text-text-primary text-right">{facilityName}</span>
               </div>
               
               <div className="bg-bg-subtle border border-border rounded-lg p-4 w-full flex flex-col items-center gap-2">
                  <IconQrcode size={100} stroke={1.5} className="text-text-primary" />
                  <p className="text-[10px] uppercase font-bold text-text-muted tracking-wider text-center mt-2">
                     Pasaporte Digital<br/>Escanea para verificar
                  </p>
               </div>
            </div>
         </div>

         <div className="md:col-span-2 flex flex-col gap-6">
            <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
               <h4 className="text-lg font-bold text-text-primary mb-4">Datos Fisiológicos</h4>
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-bg-subtle p-4 rounded-lg border border-border/50">
                     <IconScale size={20} className="text-primary mb-2" />
                     <p className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Peso Registrado</p>
                     <p className="text-lg font-bold text-text-primary mt-1">{weight} kg</p>
                  </div>
                  <div className="bg-bg-subtle p-4 rounded-lg border border-border/50">
                     <IconVaccine size={20} className="text-primary mb-2" />
                     <p className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Raza / Tipo</p>
                     <p className="text-lg font-bold text-text-primary mt-1">{breed}</p>
                  </div>
                  <div className="bg-bg-subtle p-4 rounded-lg border border-border/50">
                     <IconMapPin size={20} className="text-primary mb-2" />
                     <p className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Origen</p>
                     <p className="text-sm font-bold text-text-primary mt-1 truncate" title={asset.workspaceId}>{asset.workspaceId.slice(0, 12)}...</p>
                  </div>
               </div>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
               <h4 className="text-lg font-bold text-text-primary mb-4">Línea de Tiempo (Blockchain)</h4>
               <div className="relative pl-6 border-l-2 border-border/60 ml-3 flex flex-col gap-8">
                  {asset.events?.map((ev: any, index: number) => (
                    <div key={ev.id} className="relative">
                       <div className={`absolute -left-[35px] top-0 size-4 rounded-full ring-4 ring-bg-subtle ${index === 0 ? 'bg-success' : 'bg-primary'}`} />
                       <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                           <p className="text-sm font-bold text-text-primary">{ev.eventType}</p>
                           {ev.polygonTxHash && (
                               <a href={`https://amoy.polygonscan.com/tx/${ev.polygonTxHash}`} target="_blank" rel="noreferrer" className="text-[10px] uppercase font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded flex items-center gap-1 w-max">
                                  <IconLink size={12} /> Amoy Testnet
                               </a>
                           )}
                       </div>
                       <p className="text-xs text-text-muted mt-1">{new Date(ev.createdAt).toLocaleString()} por {ev.signerAlias || 'N/A'}</p>
                       <div className="mt-3 p-3 bg-bg-subtle rounded-md border border-border text-xs font-mono text-text-secondary overflow-x-auto">
                         {JSON.stringify(ev.data, null, 2)}
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}
