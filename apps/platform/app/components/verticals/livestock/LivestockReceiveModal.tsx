'use client'

import React, { useState, useMemo } from 'react'
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@biffco/ui'
import { IconClipboardCheck, IconBox, IconAlertTriangle, IconCheck, IconX } from '@tabler/icons-react'
import { trpc } from '@/lib/trpc'
import { Skeleton } from '@/app/components/ui/Skeleton'

type Props = {
  isOpen: boolean
  onClose: () => void
  transferId: string
  workspaceId: string
}

export default function LivestockReceiveModal({ isOpen, onClose, transferId, workspaceId }: Props) {
  const trpcCtx = trpc.useUtils()
  
  const { data: incomingLogistics, isLoading: loadingLogistics } = trpc.transfers.listIncomingLogistics.useQuery(undefined, { enabled: isOpen })
  const { data: assets, isLoading: loadingAssets } = trpc.assets.list.useQuery(undefined, { enabled: isOpen }) // we fetch all workspace assets, but wait, the receiver MIGHT NOT own them yet if they are IN_TRANSIT!
  // Wait, if the receiver doesn't own them yet, assets.list won't return them because it filters by workspaceId.
  // We need a specific query, or we can just show the raw Asset IDs for the MVP. Let's show raw IDs if we can't get metadata.

  const { mutateAsync: destinationResolve, isPending } = trpc.transfers.destinationResolve.useMutation()

  const [rejectedIds, setRejectedIds] = useState<Set<string>>(new Set())
  const [reason, setReason] = useState('')
  const [errorObj, setErrorObj] = useState<{message: string} | null>(null)

  const transfer = useMemo(() => {
     return incomingLogistics?.find(t => t.id === transferId)
  }, [incomingLogistics, transferId])

  const transferAssets = useMemo(() => {
     if (!transfer) return []
     return (transfer.assetIds as string[]).map(id => {
        // Try to find it if we have it (unlikely unless we are testing in same workspace)
        const a: any = assets?.find(ast => ast.id === id)
        return {
           id,
           category: a?.metadata?.initialState?.category || 'Desconocido (Bovino)',
           weight: a?.metadata?.initialState?.weight || '--'
        }
     })
  }, [transfer, assets])

  const handleToggleReject = (id: string) => {
     setRejectedIds(prev => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
     })
  }

  const handleResolve = async (action: 'ACCEPT' | 'REJECT') => {
     setErrorObj(null)
     if (!transfer) return
     if (action === 'REJECT' && !reason) {
        setErrorObj({ message: 'Debes justificar el motivo del rechazo total del camión.' })
        return
     }

     try {
       await destinationResolve({
          transferId: transfer.id,
          action,
          reason,
          rejectedAssetIds: action === 'ACCEPT' ? Array.from(rejectedIds) : []
       })

       await trpcCtx.transfers.listIncomingLogistics.invalidate()
       await trpcCtx.assets.list.invalidate()
       onClose()
     } catch(err: any) {
        setErrorObj({ message: err.message || 'Error al dictaminar la recepción.' })
     }
  }

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent className="max-w-2xl bg-surface border-border overflow-hidden flex flex-col max-h-[90vh]">
        <ModalHeader className="border-b border-border pb-4 p-6 shrink-0 bg-primary/5">
           <ModalTitle className="flex items-center gap-3">
             <div className="size-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-md">
               <IconClipboardCheck size={24} />
             </div>
             <div>
                <div className="text-xl font-bold font-mono">Manifiesto {transferId?.slice(0, 8)}...</div>
                <div className="text-sm font-normal text-text-muted mt-0.5">
                   Dictamen de Recepción de Lote
                </div>
             </div>
           </ModalTitle>
        </ModalHeader>

        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
           {errorObj && (
             <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-lg text-sm font-medium">
                {errorObj.message}
             </div>
           )}

           {(loadingLogistics || loadingAssets) ? (
              <div className="flex flex-col gap-3">
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-10 w-full" />
              </div>
           ) : !transfer ? (
              <div className="text-center py-6 text-text-muted">
                 No se encontró la transferencia solicitada.
              </div>
           ) : (
             <>
               <div className="bg-bg-subtle p-4 rounded-xl border border-border text-sm flex flex-col gap-2">
                 <p className="flex items-center gap-2 text-text-secondary"><strong className="text-text-primary">Origen:</strong> {transfer.senderAlias || transfer.senderWorkspaceId}</p>
                 <p className="flex items-center gap-2 text-text-secondary"><strong className="text-text-primary">Transporte:</strong> {transfer.carrierAlias || transfer.carrierWorkspaceId || 'Directo'}</p>
                 <p className="flex items-center gap-2 text-text-secondary"><strong className="text-text-primary">Total Cabezas:</strong> {(transfer.assetIds as string[])?.length} animales</p>
               </div>

               <div className="flex flex-col gap-2">
                   <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
                      <IconBox size={18} /> Detalle de Cabezas
                   </h4>
                   <p className="text-xs text-text-muted mb-2">
                     Revisa los animales y marca con alerta roja aquellos que hayan llegado muertos o extraviados (Bajas). El resto será admitido a tu rodeo.
                   </p>
                   
                   <div className="border border-border rounded-xl shadow-sm overflow-hidden divide-y divide-border max-h-[250px] overflow-y-auto">
                      {transferAssets.map(a => {
                         const isRejected = rejectedIds.has(a.id)
                         return (
                           <div key={a.id} className={`flex items-center justify-between p-3 transition-colors ${isRejected ? 'bg-rose-500/5' : 'hover:bg-bg-subtle/50'}`}>
                              <div className="flex flex-col">
                                 <span className={`font-mono font-bold ${isRejected ? 'text-rose-600 line-through' : 'text-primary'}`}>{a.id}</span>
                                 <span className="text-xs text-text-muted">{a.category} • {a.weight}</span>
                              </div>
                              <button 
                                onClick={() => handleToggleReject(a.id)}
                                className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${isRejected ? 'bg-rose-500 text-white shadow-sm' : 'bg-surface border border-border text-text-secondary hover:bg-bg-subtle'}`}
                              >
                                {isRejected ? <><IconAlertTriangle size={14}/> Baja</> : 'Marcar Baja'}
                              </button>
                           </div>
                         )
                      })}
                   </div>
               </div>

               <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-text-secondary">Observaciones Opcionales (Solo para incidencias/rechazos)</label>
                  <textarea 
                     className="w-full bg-surface border border-border rounded-lg p-3 text-sm focus:ring-2 outline-none resize-none"
                     rows={2}
                     placeholder="Ej: Faltan precintos, peaje demorado..."
                     value={reason}
                     onChange={e => setReason(e.target.value)}
                  />
               </div>
             </>
           )}
        </div>

        <div className="p-6 border-t border-border bg-bg-subtle/30 flex justify-between gap-3 items-center">
           <button 
             onClick={() => handleResolve('REJECT')}
             disabled={isPending || !transfer} 
             className="px-4 py-2 text-xs uppercase tracking-widest font-bold text-rose-600 hover:bg-rose-500/10 rounded-lg transition-colors flex items-center gap-1"
             title="Devolver todo el camión al remitente"
           >
              <IconX size={16} /> Rechazar Camión
           </button>

           <div className="flex gap-2">
              <button onClick={onClose} disabled={isPending} className="px-5 py-2.5 rounded-lg text-sm font-bold text-text-secondary hover:bg-border transition-colors">
                 Cerrar sin firmar
              </button>
              <button 
                onClick={() => handleResolve('ACCEPT')}
                disabled={isPending || !transfer} 
                className="px-6 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                 {isPending ? 'Validando...' : `Aceptar ${transferAssets.length - rejectedIds.size} Cabezas`}
                 {!isPending && <IconCheck size={18} />}
              </button>
           </div>
        </div>
      </ModalContent>
    </Modal>
  )
}
