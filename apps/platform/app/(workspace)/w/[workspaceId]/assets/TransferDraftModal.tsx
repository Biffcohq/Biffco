"use client"
import React, { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { Button, toast } from '@biffco/ui'
import { IconTruck, IconX, IconBriefcase } from '@tabler/icons-react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TransferDraftModal({ isOpen, onClose, assetsList }: { isOpen: boolean, onClose: () => void, assetsList: any[] }) {
  const [carrierId, setCarrierId] = useState('')
  const [receiverId, setReceiverId] = useState('')
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([])
  
  const utils = trpc.useUtils()
  const transferMutation = trpc.transfers.createDraft.useMutation({
    onSuccess: (data) => {
      toast.success(`Carta de Porte Generada (ID: ${data.transferId.slice(0, 8)})`)
      onClose()
      utils.transfers.listOutgoingLogistics.invalidate()
      utils.assets.list.invalidate()
    },
    onError: (e) => toast.error(e.message)
  })

  if (!isOpen) return null

  // Filtramos solo los activos que están activos en el campo y no están ya en tránsito
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const availableAssets = (assetsList || []).filter((a: any) => a.status === 'ACTIVE')

  const toggleAsset = (id: string) => {
    setSelectedAssetIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedAssetIds.length === 0) return toast.error("Seleccione al menos una vaca")
    if (!receiverId) return toast.error("Destino es requerido")
    
    // Aquí invocaríamos al firma KMS igual que en LivestockOriginationModal
    // Para simplificar el demo simulamos una string dummy
    transferMutation.mutate({
      assetIds: selectedAssetIds,
      carrierWorkspaceId: carrierId || undefined,
      receiverWorkspaceId: receiverId,
      signature: "0xmock_signature_ed25519"
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-surface w-full max-w-lg rounded-xl border border-border shadow-xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-raised">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <IconTruck className="text-primary" size={20}/>
            Despachar Carga Logística
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-black/10 rounded-full"><IconX size={20}/></button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh] flex flex-col gap-5">
           <p className="text-sm text-text-secondary">Seleccione las reses a cargar en el acoplado y designe al transportista y frigorífico de destino. Los activos quedarán en estado IN_TRANSIT.</p>
           
           <form id="transfer-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
             <div className="flex flex-col gap-2">
               <label className="text-sm font-medium">Biffco ID o Alias del Transportista</label>
               <input value={carrierId} onChange={e => setCarrierId(e.target.value)} className="p-2 border border-border rounded-lg bg-bg-subtle text-sm focus:outline-primary focus:ring-1 focus:ring-primary" placeholder="Ej: EXPRESO-SURI (Opcional)" />
             </div>
             
             <div className="flex flex-col gap-2">
               <label className="text-sm font-medium flex items-center gap-1"><IconBriefcase size={16}/> Biffco ID o Alias del Destino</label>
               <input value={receiverId} onChange={e => setReceiverId(e.target.value)} required className="p-2 border border-border rounded-lg bg-bg-subtle text-sm focus:outline-primary focus:ring-1 focus:ring-primary" placeholder="Requerido. Ej: FRIGO-BERMEJO" />
             </div>

             <div className="flex flex-col gap-2 mt-2">
               <label className="text-sm font-medium">Lote a enviar ({selectedAssetIds.length} cabezas seleccionadas)</label>
               <div className="bg-bg-subtle border border-border rounded-lg p-2 flex flex-col max-h-48 overflow-y-auto gap-1">
                 {availableAssets.length === 0 ? <p className="text-xs text-text-muted p-2">No hay animales aptos para enviar.</p> : null}
                 {availableAssets.map(asset => (
                   <label key={asset.id} className="flex items-center gap-3 p-2 hover:bg-surface-raised rounded cursor-pointer border border-transparent hover:border-border transition-colors">
                     <input type="checkbox" checked={selectedAssetIds.includes(asset.id)} onChange={() => toggleAsset(asset.id)} className="w-4 h-4 rounded border-border text-primary focus:ring-primary"/>
                     <div className="flex flex-col">
                       <span className="text-sm font-medium">{asset.metadata?.rfid || asset.id.slice(0, 8)}</span>
                       <span className="text-[10px] text-text-muted">{asset.metadata?.breed || 'Bovino'} - {asset.metadata?.dateOfBirth ? new Date(asset.metadata.dateOfBirth).toLocaleDateString() : 'S/D'}</span>
                     </div>
                   </label>
                 ))}
               </div>
             </div>
           </form>
        </div>

        <div className="p-4 border-t border-border bg-surface-raised flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button form="transfer-form" type="submit" disabled={transferMutation.isPending} className="bg-primary text-white">
            {transferMutation.isPending ? 'Procesando Eventos...' : 'Firmar y Despachar'}
          </Button>
        </div>
      </div>
    </div>
  )
}
