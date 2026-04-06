'use client'

import React, { useState } from 'react'
import LivestockTransferDetailModal from '../LivestockTransferDetailModal'
import {
  IconSearch,
  IconTruckDelivery,
  IconArrowRight,
  IconArrowLeft,
  IconCheck,
  IconX,
  IconClock
} from '@tabler/icons-react'
import { trpc } from '@/lib/trpc'
import { Skeleton } from '@/app/components/ui/Skeleton'
import LivestockDispatchModal from '../LivestockDispatchModal'
import LivestockReceiveModal from '../LivestockReceiveModal'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LivestockTransfersFeature({ workspace, roleId }: { workspace: any, roleId: string }) {
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('outgoing')
  const [searchQuery, setSearchQuery] = useState('')
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false)
  
  // State to hold the transfer being received
  const [transferToReceive, setTransferToReceive] = useState<string | null>(null)
  const [detailTransferId, setDetailTransferId] = useState<string | null>(null)

  const { data: incomingLogistics, isLoading: loadingIn } = trpc.transfers.listIncomingLogistics.useQuery()
  const { data: outgoingLogistics, isLoading: loadingOut } = trpc.transfers.listOutgoingLogistics.useQuery()

  const currentData = activeTab === 'incoming' ? incomingLogistics : outgoingLogistics
  const isLoading = activeTab === 'incoming' ? loadingIn : loadingOut

  const formattedTransfers = currentData?.filter(t => {
      const alias = activeTab === 'incoming' ? t.senderAlias : t.receiverAlias
      const id = t.id
      const query = searchQuery.toLowerCase()
      return alias?.toLowerCase().includes(query) || id.toLowerCase().includes(query)
  }) || []

  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500 pb-12 w-full">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            Movimientos y Tránsito
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Gestión de despachos (DTEs) y recepciones de hacienda.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
           <button onClick={() => setIsDispatchModalOpen(true)} className="h-10 ml-2 px-5 rounded-full bg-primary hover:bg-primary-hover text-white font-medium text-sm transition-colors flex items-center gap-2 shadow-sm active:scale-95">
              <IconTruckDelivery size={18} stroke={2.5} />
              <span>Nuevo Despacho</span>
           </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex p-1 bg-surface border border-border rounded-lg shadow-sm w-full sm:w-max">
           <button
             onClick={() => setActiveTab('outgoing')}
             className={`flex-1 sm:flex-none px-6 py-2 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'outgoing' ? 'bg-bg-subtle text-primary shadow-sm ring-1 ring-border/50' : 'text-text-muted hover:text-text-primary hover:bg-bg-subtle/50'}`}
           >
              <IconArrowRight size={16} /> Envíos
           </button>
           <button
             onClick={() => setActiveTab('incoming')}
             className={`flex-1 sm:flex-none px-6 py-2 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'incoming' ? 'bg-bg-subtle text-primary shadow-sm ring-1 ring-border/50' : 'text-text-muted hover:text-text-primary hover:bg-bg-subtle/50'}`}
           >
              <IconArrowLeft size={16} /> Recepciones
           </button>
        </div>

        <div className="relative flex-1 sm:max-w-xs w-full">
          <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
             type="text" 
             placeholder="Buscar manifiesto..." 
             className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-text-muted"
             value={searchQuery}
             onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden min-h-[400px]">
         <table className="w-full text-left text-sm">
            <thead className="bg-bg-subtle border-b border-border text-text-muted font-medium uppercase tracking-wider text-[11px]">
               <tr>
                  <th className="px-6 py-4">ID Transito</th>
                  <th className="px-6 py-4">{activeTab === 'outgoing' ? 'Destino' : 'Origen'}</th>
                  <th className="px-6 py-4">Cabezas</th>
                  <th className="px-6 py-4 hidden sm:table-cell">Estado</th>
                  <th className="px-6 py-4 hidden md:table-cell">Despacho</th>
                  <th className="px-6 py-4">Acciones</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-border">
               {isLoading && (
                  <tr>
                     <td colSpan={6} className="p-6">
                         <div className="flex flex-col gap-3">
                            <Skeleton className="h-8 w-full rounded" />
                            <Skeleton className="h-8 w-full rounded" />
                         </div>
                     </td>
                  </tr>
               )}
               {formattedTransfers.length === 0 && !isLoading && (
                  <tr>
                     <td colSpan={6} className="text-center py-16 text-text-muted">
                        <IconTruckDelivery size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No se encontraron movimientos logísticos en esta bandeja.</p>
                     </td>
                  </tr>
               )}
               {formattedTransfers.map((tx: any) => {
                  const itemsCount = (tx.assetIds as string[])?.length || 0
                  
                  let statusColor = "bg-bg-subtle text-text-secondary border-border"
                  let StatusIcon = IconClock
                  
                  if (tx.status === 'IN_TRANSIT' || tx.status === 'PENDING_CARRIER_ACCEPTANCE') {
                      statusColor = "bg-amber-500/10 text-amber-600 border-amber-500/20"
                      StatusIcon = IconTruckDelivery
                  } else if (tx.status === 'COMPLETED') {
                      statusColor = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      StatusIcon = IconCheck
                  } else if (tx.status === 'REJECTED') {
                      statusColor = "bg-rose-500/10 text-rose-600 border-rose-500/20"
                      StatusIcon = IconX
                  }

                  const isPendingReceive = activeTab === 'incoming' && tx.status === 'IN_TRANSIT'

                  return (
                    <tr key={tx.id} className="hover:bg-bg-subtle/40 transition-colors group">
                       <td className="px-6 py-4 font-mono font-bold text-text-primary text-xs w-[120px]">
                          {tx.id.slice(0, 13)}...
                       </td>
                       <td className="px-6 py-4 font-bold text-text-primary">
                          {activeTab === 'outgoing' ? (tx.receiverAlias || tx.receiverWorkspaceId) : (tx.senderAlias || tx.senderWorkspaceId)}
                       </td>
                       <td className="px-6 py-4 font-mono font-medium text-text-primary">
                          <button 
                             onClick={(e) => { e.stopPropagation(); setDetailTransferId(tx.id) }}
                             className="bg-primary/10 text-primary hover:bg-primary/20 px-2.5 py-1 rounded-md text-xs font-bold transition-colors"
                          >
                             {itemsCount} cabezas
                          </button>
                       </td>
                       <td className="px-6 py-4 hidden sm:table-cell text-text-secondary">
                          <span className={`flex items-center gap-1.5 w-max px-2.5 py-1 rounded text-[10px] uppercase font-black tracking-wider border ${statusColor}`}>
                             <StatusIcon size={12} stroke={3} />
                             {tx.status.replace(/_/g, ' ')}
                          </span>
                       </td>
                       <td className="px-6 py-4 hidden md:table-cell text-xs text-text-muted">
                          {tx.dispatchedAt ? new Date(tx.dispatchedAt).toLocaleDateString() : '--'}
                       </td>
                       <td className="px-6 py-4">
                          {isPendingReceive ? (
                             <button onClick={() => setTransferToReceive(tx.id)} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 font-bold text-xs uppercase hover:bg-emerald-500/20 transition-colors w-max">
                                Dictaminar
                             </button>
                          ) : (
                             <span className="text-xs font-medium text-text-muted">--</span>
                          )}
                       </td>
                    </tr>
                  )
               })}
            </tbody>
         </table>
      </div>

      {isDispatchModalOpen && (
         <LivestockDispatchModal 
            isOpen={isDispatchModalOpen} 
            onClose={() => {
              setIsDispatchModalOpen(false)
            }} 
            workspaceId={workspace.id} 
         />
      )}

      {!!transferToReceive && (
         <LivestockReceiveModal 
            isOpen={!!transferToReceive} 
            onClose={() => setTransferToReceive(null)} 
            transferId={transferToReceive} 
            workspaceId={workspace.id} 
         />
      )}

      {!!detailTransferId && (
         <LivestockTransferDetailModal
            isOpen={!!detailTransferId}
            onClose={() => setDetailTransferId(null)}
            transferId={detailTransferId}
            roleId={roleId}
         />
      )}
    </div>
  )
}
