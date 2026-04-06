'use client'

import React, { useState } from 'react'
import { IconTruckDelivery, IconSearch, IconBarcode, IconCheck, IconX, IconClock } from '@tabler/icons-react'
import { trpc } from '@/lib/trpc'
import { Skeleton } from '@/app/components/ui/Skeleton'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LivestockCarrierRoutesFeature({ workspace }: { workspace: any }) {
  const trpcCtx = trpc.useUtils()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<{ id: string, message: string } | null>(null)

  const { data: transfers, isLoading } = trpc.transfers.listAsCarrier.useQuery()
  const { mutateAsync: carrierAccept } = trpc.transfers.carrierAccept.useMutation()

  const formattedRoutes = transfers?.filter(t => {
      const q = searchQuery.toLowerCase()
      return (t.senderAlias || '').toLowerCase().includes(q) || 
             (t.receiverAlias || '').toLowerCase().includes(q) || 
             t.id.toLowerCase().includes(q)
  }) || []

  const handleScanLoad = async (transferId: string) => {
     try {
         setProcessingId(transferId)
         setErrorMsg(null)
         await carrierAccept({ transferId })
         await trpcCtx.transfers.listAsCarrier.invalidate()
     } catch (err: any) {
         setErrorMsg({ id: transferId, message: err.message || 'Error escaneando carga.' })
     } finally {
         setProcessingId(null)
     }
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500 pb-12 w-full max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-text-primary">
            Hojas de Ruta
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Gestión de manifiestos logísticos para el transportista {workspace?.name}.
          </p>
        </div>
        <div className="relative flex-1 md:max-w-xs w-full">
          <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
             type="text" 
             placeholder="Buscar ID, Origen o Destino..." 
             className="w-full h-9 pl-9 pr-4 rounded text-sm bg-surface border border-border focus:outline-none focus:ring-1 focus:ring-primary/40 placeholder:text-text-muted"
             value={searchQuery}
             onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main Table Container */}
      <div className="border border-border rounded-lg bg-surface flex flex-col overflow-hidden min-h-[400px]">
         <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-bg-subtle/50 text-[10px] uppercase font-semibold text-text-muted tracking-wider border-b border-border">
               <tr>
                  <th className="px-5 py-3 w-[150px]">Manifiesto</th>
                  <th className="px-5 py-3">Ruta (Origen &rarr; Destino)</th>
                  <th className="px-5 py-3 text-center">Precintos (Cabezas)</th>
                  <th className="px-5 py-3">Estado de Ruta</th>
                  <th className="px-5 py-3 text-right">Acción</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-border">
               {isLoading && (
                  <tr>
                     <td colSpan={5} className="p-6 text-center text-text-muted">
                        Cargando hojas de ruta...
                     </td>
                  </tr>
               )}
               {!isLoading && formattedRoutes.length === 0 && (
                  <tr>
                     <td colSpan={5} className="p-12 text-center text-text-muted">
                        <IconTruckDelivery size={36} className="mx-auto mb-3 opacity-20" />
                        <p>No tienes traslados asignados u operativos.</p>
                     </td>
                  </tr>
               )}
               {formattedRoutes.map((tx: any) => {
                  const isPending = tx.status === 'PENDING_CARRIER_ACCEPTANCE'
                  const isInTransit = tx.status === 'IN_TRANSIT'
                  const isCompleted = tx.status === 'COMPLETED'
                  const isRejected = tx.status === 'REJECTED' || tx.status === 'REJECTED_IN_TRANSIT'
                  
                  const isProcessingThis = processingId === tx.id
                  const thisError = errorMsg?.id === tx.id ? errorMsg.message : null

                  return (
                    <React.Fragment key={tx.id}>
                        <tr className="hover:bg-bg-subtle/30 transition-colors group">
                           <td className="px-5 py-4 font-mono text-xs font-semibold text-text-primary">
                              {tx.id.slice(0, 13)}...
                           </td>
                           <td className="px-5 py-4">
                              <div className="flex items-center gap-2 text-[13px]">
                                 <span className="font-semibold text-text-primary max-w-[140px] truncate" title={tx.senderAlias || tx.senderWorkspaceId}>
                                    {tx.senderAlias || tx.senderWorkspaceId}
                                 </span>
                                 <span className="text-text-muted">&rarr;</span>
                                 <span className="font-semibold text-text-primary max-w-[140px] truncate" title={tx.receiverAlias || tx.receiverWorkspaceId}>
                                    {tx.receiverAlias || tx.receiverWorkspaceId}
                                 </span>
                              </div>
                           </td>
                           <td className="px-5 py-4 font-mono font-medium text-text-primary text-center">
                              {((tx.assetIds as string[]) || []).length}
                           </td>
                           <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                 {isPending && <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-orange-500"><IconClock size={14}/> Aguardando Recolección</span>}
                                 {isInTransit && <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-blue-500"><IconTruckDelivery size={14}/> En Tránsito</span>}
                                 {isCompleted && <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-emerald-500"><IconCheck size={14}/> Entregado</span>}
                                 {isRejected && <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-rose-500"><IconX size={14}/> Rechazado / Disputa</span>}
                              </div>
                           </td>
                           <td className="px-5 py-4 text-right">
                              {isPending ? (
                                 <button 
                                   onClick={() => handleScanLoad(tx.id)}
                                   disabled={isProcessingThis}
                                   className="inline-flex items-center gap-2 px-4 py-1.5 rounded bg-primary text-white text-xs font-semibold hover:bg-primary-hover disabled:opacity-50 transition-colors"
                                 >
                                    <IconBarcode size={16} /> 
                                    {isProcessingThis ? 'Procesando...' : 'Escanear Carga'}
                                 </button>
                              ) : (
                                 <span className="text-xs text-text-muted">--</span>
                              )}
                           </td>
                        </tr>
                        {thisError && (
                           <tr>
                              <td colSpan={5} className="px-5 pb-4 pt-0">
                                 <div className="text-[11px] text-rose-500 bg-rose-500/10 px-3 py-1.5 rounded inline-block">
                                    {thisError}
                                 </div>
                              </td>
                           </tr>
                        )}
                    </React.Fragment>
                  )
               })}
            </tbody>
         </table>
      </div>
    </div>
  )
}
