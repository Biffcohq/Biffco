'use client'

import React, { useState, useMemo } from 'react'
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@biffco/ui'
import { IconTruckDelivery, IconPackages, IconMapPin, IconSearch, IconTruck } from '@tabler/icons-react'
import { trpc } from '@/lib/trpc'
import { Skeleton } from '@/app/components/ui/Skeleton'

type Props = {
  isOpen: boolean
  onClose: () => void
  workspaceId: string
}

export default function LivestockDispatchModal({ isOpen, onClose, workspaceId }: Props) {
  const trpcCtx = trpc.useUtils()
  const { data: lots, isLoading: loadingLots } = trpc.assetGroups.getWithAssets.useQuery({ verticalId: 'livestock' }, { enabled: isOpen })
  const { mutateAsync: createDraft, isPending } = trpc.transfers.createDraft.useMutation()

  const [selectedLotId, setSelectedLotId] = useState<string>('')
  const [receiverWorkspaceId, setReceiverWorkspaceId] = useState('')
  const [carrierWorkspaceId, setCarrierWorkspaceId] = useState('')
  
  const [errorObj, setErrorObj] = useState<{message: string} | null>(null)

  const activeLots = useMemo(() => {
    return lots?.filter(l => l.isActive && l.totalActive > 0) || []
  }, [lots])

  const handleDispatch = async () => {
     setErrorObj(null)
     if (!selectedLotId) {
        setErrorObj({ message: 'Debes seleccionar una tropa origen.' })
        return
     }
     if (!receiverWorkspaceId) {
        setErrorObj({ message: 'Debes especificar el alias del Destino.' })
        return
     }

     const lot = activeLots.find(l => l.id === selectedLotId)
     if (!lot) return

     const activeAssetIds = lot.assets.filter((a: any) => a.status === 'ACTIVE').map((a: any) => a.id)
     if (activeAssetIds.length === 0) {
        setErrorObj({ message: 'La tropa seleccionada no posee animales activos para despachar.' })
        return
     }

     try {
       await createDraft({
         assetIds: activeAssetIds,
         receiverWorkspaceId: receiverWorkspaceId,
         carrierWorkspaceId: carrierWorkspaceId || undefined
       })
       
       await trpcCtx.transfers.listOutgoingLogistics.invalidate()
       await trpcCtx.assetGroups.getWithAssets.invalidate()
       onClose()
     } catch (err: any) {
       setErrorObj({ message: err.message || 'Error al despachar el lote.' })
     }
  }

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent className="max-w-xl bg-surface border-border overflow-hidden">
        <ModalHeader className="border-b border-border pb-4 p-6 shrink-0 bg-primary/5">
           <ModalTitle className="flex items-center gap-3">
             <div className="size-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-md">
               <IconTruckDelivery size={24} />
             </div>
             <div>
                <div className="text-xl font-bold">Generar Manifiesto de Despacho</div>
                <div className="text-sm font-normal text-text-muted mt-0.5">
                   Inicia un DTE en blockchain bloqueando el lote.
                </div>
             </div>
           </ModalTitle>
        </ModalHeader>

        <div className="p-6 flex flex-col gap-5">
           {errorObj && (
             <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-lg text-sm font-medium">
                {errorObj.message}
             </div>
           )}

           <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-secondary flex items-center gap-1.5"><IconPackages size={16}/> Tropa a Enviar</label>
              {loadingLots ? <Skeleton className="h-10 rounded-lg w-full" /> : (
                 <select 
                    className="w-full bg-surface border border-border rounded-lg p-2.5 text-sm focus:ring-2 outline-none font-medium text-text-primary"
                    value={selectedLotId}
                    onChange={e => setSelectedLotId(e.target.value)}
                 >
                    <option value="">Selecciona una agrupación...</option>
                    {activeLots.map(l => (
                       <option key={l.id} value={l.id}>{l.name} ({l.totalActive} cabezas)</option>
                    ))}
                 </select>
              )}
              {selectedLotId && (
                 <p className="text-xs text-text-muted mt-1 leading-relaxed">
                   Se enviarán {activeLots.find(l => l.id === selectedLotId)?.totalActive} cabezas y su estado pasará a "En Tránsito". La venta o re-asignación será prohibida matemáticamente hasta resolución.
                 </p>
              )}
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                 <label className="text-sm font-bold text-text-secondary flex items-center gap-1.5"><IconMapPin size={16}/> Destino (Alias/CBU)</label>
                 <div className="relative">
                    <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input 
                       type="text"
                       placeholder="Ej: FRIGORIFICO-CENTRAL"
                       className="w-full bg-surface border border-border rounded-lg p-2.5 pl-9 text-sm focus:ring-2 outline-none font-mono"
                       value={receiverWorkspaceId}
                       onChange={e => setReceiverWorkspaceId(e.target.value.toUpperCase())}
                    />
                 </div>
              </div>

              <div className="flex flex-col gap-2">
                 <label className="text-sm font-bold text-text-secondary flex items-center gap-1.5"><IconTruck size={16}/> Transportista (Alias)</label>
                 <div className="relative">
                    <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input 
                       type="text"
                       placeholder="Opcional. Ej: LOGISTICA-NORTE"
                       className="w-full bg-surface border border-border rounded-lg p-2.5 pl-9 text-sm focus:ring-2 outline-none font-mono"
                       value={carrierWorkspaceId}
                       onChange={e => setCarrierWorkspaceId(e.target.value.toUpperCase())}
                    />
                 </div>
              </div>
           </div>
        </div>

        <div className="p-6 border-t border-border bg-bg-subtle/30 flex justify-end gap-3">
           <button onClick={onClose} disabled={isPending} className="px-5 py-2.5 rounded-lg text-sm font-bold text-text-secondary hover:bg-border transition-colors">
              Cancelar
           </button>
           <button 
             onClick={handleDispatch}
             disabled={isPending || !selectedLotId || !receiverWorkspaceId} 
             className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors disabled:opacity-50 flex items-center gap-2"
           >
              {isPending ? 'Validando Blockchain...' : 'Firmar y Despachar'}
              {!isPending && <IconTruckDelivery size={18} />}
           </button>
        </div>
      </ModalContent>
    </Modal>
  )
}
