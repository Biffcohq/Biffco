"use client"

import { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { IconTruck, IconBox, IconMapPin } from '@tabler/icons-react'
import { Button, toast } from '@biffco/ui'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { StatusPill } from '@/app/components/StatusPill'

export default function LogisticsClient() {
  const [tab, setTab] = useState<'OUTGOING' | 'INCOMING' | 'CARRIER'>('OUTGOING')
  const utils = trpc.useUtils()

  const { data: outgoing } = trpc.transfers.listOutgoingLogistics.useQuery(undefined, { enabled: tab === 'OUTGOING' })
  const { data: incoming } = trpc.transfers.listIncomingLogistics.useQuery(undefined, { enabled: tab === 'INCOMING' })
  const { data: asCarrier } = trpc.transfers.listAsCarrier.useQuery(undefined, { enabled: tab === 'CARRIER' })

  const carrierAcceptMutation = trpc.transfers.carrierAccept.useMutation({
    onSuccess: () => {
      toast.success('Guía de porte escaneada. Activos en Custodia.')
      utils.transfers.listAsCarrier.invalidate()
    },
    onError: (e) => toast.error(e.message)
  })

  const resolveMutation = trpc.transfers.destinationResolve.useMutation({
    onSuccess: (data) => {
      toast.success(data.newStatus === 'COMPLETED' ? 'Tropas ingresadas al inventario' : 'Tropas Rechazadas en disputa')
      utils.transfers.listIncomingLogistics.invalidate()
    },
    onError: (e) => toast.error(e.message)
  })

  // Helper para renderizar
  const renderList = (// eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[], type: 'OUTGOING' | 'INCOMING' | 'CARRIER') => {
    if (!items || items.length === 0) return <div className="text-text-muted p-8 text-center border border-dashed border-border rounded-lg bg-bg-subtle/30">Ninguna carga en estado pendiente para esta sección.</div>
    return (
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.id} className="p-4 border border-border rounded-lg bg-surface flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
            <div>
               <p className="text-sm font-semibold flex items-center gap-2">
                 <IconBox size={16} className="text-primary"/> 
                 Manifiesto: {item.id.slice(0, 8).toUpperCase()}
                 <StatusPill status={item.status} className="!text-[10px] !px-2 !py-0.5" />
              </p>
              <p className="text-xs text-text-muted mt-1">
                 Activos: {(item.assetIds as string[]).length} cabezas. 
                 {item.dispatchedAt ? ` Creado hace ${formatDistanceToNow(new Date(item.dispatchedAt), { addSuffix: true, locale: es })}.` : ''}
              </p>
              <details className="mt-2 text-xs flex flex-col gap-1 text-text-secondary group">
                 <summary className="cursor-pointer text-primary hover:underline w-max mb-1 list-none font-medium text-[11px] uppercase tracking-wider">
                   {type === 'OUTGOING' ? 'Ver Detalles Logísticos' : type === 'INCOMING' ? 'Ver Datos de Origen' : 'Inspeccionar Partes'}
                 </summary>
                 <div className="pl-2 border-l-2 border-border flex flex-col gap-1 py-1 mt-1">
                   {type === 'OUTGOING' ? (
                      <div className="flex items-center gap-1"><IconMapPin size={12}/> Destino Pautado: <strong>{(item as any).receiverAlias || item.receiverWorkspaceId}</strong></div>
                   ) : (
                      <div className="flex items-center gap-1"><IconMapPin size={12}/> Remitente Original: <strong>{(item as any).senderAlias || item.senderWorkspaceId}</strong></div>
                   )}
                   <div className="flex items-center gap-1"><IconTruck size={12}/> Transporte Legal: <strong>{(item as any).carrierAlias || item.carrierWorkspaceId || 'Vehículo Propio / No Asignado'}</strong></div>
                   
                   <div className="mt-2 text-[10px] text-text-muted/60 border-t border-border/50 pt-2 flex flex-col gap-0.5">
                     <p>Origen ID: {item.senderWorkspaceId}</p>
                     <p>Destino ID: {item.receiverWorkspaceId}</p>
                     {item.carrierWorkspaceId && <p>Carrier ID: {item.carrierWorkspaceId}</p>}
                   </div>
                 </div>
              </details>
            </div>
            
            <div className="flex items-center gap-2">
              {type === 'CARRIER' && item.status === 'PENDING_CARRIER_ACCEPTANCE' && (
                <Button onClick={() => carrierAcceptMutation.mutate({ transferId: item.id })} disabled={carrierAcceptMutation.isPending} className="bg-primary text-white">Escanear y Cargar Camión</Button>
              )}
              {type === 'INCOMING' && item.status === 'IN_TRANSIT' && (
                <>
                  <Button onClick={() => resolveMutation.mutate({ transferId: item.id, action: 'REJECT', reason: 'Rechazo en Báscula' })} variant="outline" className="text-error border-error/50">Rechazar</Button>
                  <Button onClick={() => resolveMutation.mutate({ transferId: item.id, action: 'ACCEPT' })} disabled={resolveMutation.isPending} className="bg-success text-white">Aceptar Recepción</Button>
                </>
              )}
              {item.status === 'COMPLETED' && <span className="text-success text-sm font-medium">Finalizado</span>}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 border-b border-border pb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <IconTruck className="text-primary"/> Operaciones Logísticas B2B
        </h1>
        <p className="text-sm text-text-secondary">Cartas de porte digital y firmas criptográficas bilaterales durante el transporte.</p>
      </div>

      <div className="flex gap-2">
        <Button variant={tab === 'OUTGOING' ? 'solid' : 'outline'} onClick={() => setTab('OUTGOING')}>Envíos Salientes (DRAFT)</Button>
        <Button variant={tab === 'INCOMING' ? 'solid' : 'outline'} onClick={() => setTab('INCOMING')}>Recepción en Puerta</Button>
        <Button variant={tab === 'CARRIER' ? 'solid' : 'outline'} onClick={() => setTab('CARRIER')}>Como Transportista</Button>
      </div>

      <div className="mt-4">
        {tab === 'OUTGOING' && renderList(outgoing || [], 'OUTGOING')}
        {tab === 'INCOMING' && renderList(incoming || [], 'INCOMING')}
        {tab === 'CARRIER' && renderList(asCarrier || [], 'CARRIER')}
      </div>
    </div>
  )
}
