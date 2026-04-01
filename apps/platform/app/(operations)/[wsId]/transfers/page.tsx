"use client"

import React, { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { IconInbox, IconSend, IconQrcode, IconCheck } from '@tabler/icons-react'
import { Modal, Button } from '@biffco/ui'
import { format } from 'date-fns'

type TabType = 'incoming' | 'outgoing'

interface OfferInfo {
  id: string;
  assetId: string;
  status: string;
  fromWorkspaceId: string;
  toWorkspaceId: string;
  createdAt: string | Date;
}

export default function TransfersInboxPage({ params }: { params: { wsId: string } }) {
  const [activeTab, setActiveTab] = useState<TabType>('incoming')
  const [selectedOffer, setSelectedOffer] = useState<OfferInfo | null>(null)
  
  const utils = trpc.useUtils()
  
  // Queries
  const { data: incoming, isLoading: loadingIn } = trpc.transfers.listIncoming.useQuery()
  const { data: outgoing, isLoading: loadingOut } = trpc.transfers.listOutgoing.useQuery()
  
  // Mutations
  const { mutateAsync: acceptOffer, isPending: isAccepting } = trpc.transfers.acceptOffer.useMutation()

  const handleAccept = async () => {
     if (!selectedOffer) return;
     try {
       await acceptOffer({ offerId: selectedOffer.id, signature: "mock-ed25519-sig" });
       setSelectedOffer(null);
       utils.transfers.listIncoming.invalidate();
       utils.assets.list.invalidate(); // refrescar lista global de assets
     } catch (err: unknown) {
       if (err instanceof Error) {
         // eslint-disable-next-line no-undef
         alert(`Error: ${err.message}`);
       }
     }
  }

  const renderOfferCard = (offer: OfferInfo, type: TabType) => (
    <div key={offer.id} className="p-5 border border-border rounded-xl bg-surface shadow-sm hover:border-primary/50 transition-colors flex flex-col gap-4">
       <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-surface-raised border border-border rounded-lg">
                <IconQrcode className="text-primary/70" />
             </div>
             <div>
               <h3 className="font-bold text-text-primary uppercase tracking-wide">Lote {offer.assetId.split('-')[0]}</h3>
               <p className="text-xs text-text-muted font-mono">{offer.assetId}</p>
             </div>
          </div>
          
          {offer.status === 'completed' ? (
             <span className="px-2.5 py-0.5 rounded-full text-xs box-border border bg-success/10 text-success border-success/30 uppercase font-bold tracking-wider">
               Completado
             </span>
          ) : (
             <span className="px-2.5 py-0.5 rounded-full text-xs box-border border bg-warning/10 text-warning border-warning/30 uppercase font-bold tracking-wider">
               Pendiente
             </span>
          )}
       </div>

       <div className="flex items-center justify-between mt-2 pt-4 border-t border-border/50">
          <div className="flex flex-col gap-1">
             <span className="text-xs text-text-muted">
               {type === 'incoming' ? 'Enviado desde:' : 'Destinatario:'}
             </span>
             <span className="text-sm font-medium text-text-primary">
               {type === 'incoming' ? offer.fromWorkspaceId : offer.toWorkspaceId}
             </span>
          </div>
          <div className="flex flex-col gap-1 text-right">
             <span className="text-xs text-text-muted">Iniciado el:</span>
             <span className="text-sm font-medium text-text-primary">
               {format(new Date(offer.createdAt), "dd MMM, HH:mm")}
             </span>
          </div>
       </div>

       {type === 'incoming' && offer.status === 'pending' && (
          <Button 
            onClick={() => setSelectedOffer(offer)}
            className="w-full mt-2" 
            variant="default"
          >
            Revisar y Aceptar
          </Button>
       )}
    </div>
  )

  return (
    <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-6 animate-in fade-in duration-300">
      
      <div className="flex flex-col gap-2">
         <h1 className="text-2xl font-bold text-text-primary">Transferencias de Custodia</h1>
         <p className="text-text-secondary">Gestiona la recepción y envío criptográfico de activos hacia y desde tu perímetro.</p>
      </div>

      <div className="flex items-center gap-4 border-b border-border">
         <button 
           onClick={() => setActiveTab('incoming')}
           className={`relative px-4 py-3 text-sm font-semibold flex items-center gap-2 transition-colors ${activeTab === 'incoming' ? 'text-primary' : 'text-text-muted hover:text-text-primary'}`}
         >
           <IconInbox size={18} />
           Bandeja de Entrada
           {activeTab === 'incoming' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />}
         </button>
         <button 
           onClick={() => setActiveTab('outgoing')}
           className={`relative px-4 py-3 text-sm font-semibold flex items-center gap-2 transition-colors ${activeTab === 'outgoing' ? 'text-primary' : 'text-text-muted hover:text-text-primary'}`}
         >
           <IconSend size={18} />
           Enviados
           {activeTab === 'outgoing' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />}
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8 min-h-[400px]">
          {/* Main List */}
          <div className="flex flex-col gap-4">
             {activeTab === 'incoming' && (
                loadingIn ? <p className="text-text-muted text-sm">Cargando bandeja...</p> : 
                incoming?.length === 0 ? <p className="text-text-muted text-sm border-2 border-dashed border-border p-6 rounded-xl text-center">Bandeja vacía.</p> :
                incoming?.map((offer: any) => renderOfferCard(offer, 'incoming'))
             )}
             
             {activeTab === 'outgoing' && (
                loadingOut ? <p className="text-text-muted text-sm">Cargando salidas...</p> : 
                outgoing?.length === 0 ? <p className="text-text-muted text-sm border-2 border-dashed border-border p-6 rounded-xl text-center">No hay envíos pendientes.</p> :
                outgoing?.map((offer: any) => renderOfferCard(offer, 'outgoing'))
             )}
          </div>

          {/* Side Info Panel */}
          <div className="hidden lg:flex flex-col gap-6 p-6 border border-border bg-surface-raised rounded-2xl h-fit">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-primary/10 rounded border border-primary/20"><IconCheck className="text-primary"/></div>
               <h3 className="font-bold text-sm">Seguridad Transaccional</h3>
             </div>
             <p className="text-sm text-text-secondary leading-relaxed">
               Todas las transferencias son procesadas atómicamente por Biffco. Cuando aceptas un Activo, el sistema realiza una cesión de Ed25519 (Event Sourcing) en tiempo real, invalidando las reglas preexistentes para el emisor.
             </p>
          </div>
      </div>

      <Modal 
        isOpen={!!selectedOffer} 
        onClose={() => !isAccepting && setSelectedOffer(null)}
        title="Validación de Custodia Criptográfica"
      >
         <div className="flex flex-col gap-4 py-4">
            <p className="text-sm text-text-secondary">
               Estás a punto de firmar criptográficamente la recepción del lote <strong>{selectedOffer?.assetId}</strong>.
               Al presionar el botón inferior, tu Navegador forjará una firma irreversible y el Lote pasará formalmente a la contabilidad de este Workspace.
            </p>
            <div className="bg-bg p-4 rounded-xl border border-border/50 text-xs font-mono text-text-muted break-all">
               Payload: {JSON.stringify({ action: "ACCEPT_CUSTODY", asset: selectedOffer?.assetId, to: params.wsId })}
            </div>
            
            <Button 
               onClick={handleAccept} 
               disabled={isAccepting}
               className="w-full mt-4 flex items-center justify-center gap-2"
            >
               {isAccepting ? "Sellando Cadena de Custodia..." : "Firmar Digitalmente y Aceptar Lote"}
            </Button>
         </div>
      </Modal>

    </div>
  )
}
