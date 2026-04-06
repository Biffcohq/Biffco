'use client'
import React from 'react'
import { trpc } from '@/lib/trpc'
import { IconX, IconBox, IconExternalLink } from '@tabler/icons-react'
import { Skeleton } from '@/app/components/ui/Skeleton'

type Props = {
  isOpen: boolean
  onClose: () => void
  transferId: string
  roleId: string // PRODUCER, TRANSPORTER, MEATPACKER
}

export default function LivestockTransferDetailModal({ isOpen, onClose, transferId, roleId }: Props) {
  const { data: assets, isLoading } = trpc.transfers.getTransferAssets.useQuery(
    { transferId },
    { enabled: isOpen && !!transferId }
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
         className="bg-surface border border-border shadow-2xl rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
         onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-border bg-subtle">
           <div>
              <h2 className="text-xl font-bold text-text-primary">Detalle del Manifiesto</h2>
              <p className="text-xs text-text-muted mt-1 uppercase font-mono">ID: {transferId.slice(0, 15)}...</p>
           </div>
           <button onClick={onClose} className="p-2 rounded-full hover:bg-bg-subtle text-text-secondary transition-colors">
              <IconX size={20} />
           </button>
        </div>

        <div className="p-6 overflow-y-auto w-full flex-1">
           <h3 className="text-sm font-bold text-text-secondary mb-3">Animales Asociados ({assets?.length || 0})</h3>
           
           {isLoading ? (
              <div className="space-y-3">
                 <Skeleton className="h-16 rounded-xl w-full" />
                 <Skeleton className="h-16 rounded-xl w-full" />
                 <Skeleton className="h-16 rounded-xl w-full" />
              </div>
           ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 {assets?.map((asset: any) => {
                    const d = asset.metadata as Record<string, any>;
                    let catText = d?.initialState?.category ? `${d.initialState.breed} - ${d.initialState.category}` : (d?.initialState?.breed || 'Sin Especificar');
                    const externalId = d?.externalId || asset.id.slice(0, 10);
                    
                    return (
                       <div key={asset.id} className="bg-surface border border-border rounded-xl p-3 flex flex-col gap-2 hover:border-primary/50 transition-colors">
                          <div className="flex justify-between items-start">
                             <div className="flex items-center gap-2 text-primary font-mono text-sm font-bold">
                                <IconBox size={16} />
                                {externalId}
                             </div>
                             <a 
                               href={`/verify/${asset.id}`} 
                               target="_blank"
                               className="text-text-muted hover:text-primary transition-colors flex items-center gap-1 text-xs font-medium"
                             >
                                <IconExternalLink size={14} />
                                Pasaporte
                             </a>
                          </div>
                          <div className="flex flex-col">
                             <span className="text-sm font-medium text-text-primary">{catText}</span>
                             <span className="text-xs text-text-muted">{d?.initialState?.weight ? `${d.initialState.weight} kg` : 'Peso no const.'} | Status: {asset.status}</span>
                          </div>
                       </div>
                    )
                 })}
              </div>
           )}
        </div>
        
        <div className="p-5 border-t border-border bg-bg-subtle flex justify-end">
           <button 
             onClick={onClose}
             className="px-5 py-2.5 rounded-lg border border-border bg-surface font-medium text-sm text-text-primary hover:bg-surface-overlay transition-colors"
           >
              Cerrar
           </button>
        </div>
      </div>
    </div>
  )
}
