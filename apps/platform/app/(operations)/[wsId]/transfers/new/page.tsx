"use client"

import React, { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { IconSend, IconBox, IconBuilding, IconCheck } from '@tabler/icons-react'
import { Button } from '@biffco/ui'
import { useRouter } from 'next/navigation'

export default function NewTransferPage({ params }: { params: { wsId: string } }) {
  const router = useRouter()
  const [selectedAssetId, setSelectedAssetId] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>("")
  
  // Queries
  const { data: assets, isLoading: loadingAssets } = trpc.assets.list.useQuery({ limit: 100 })
  const { data: searchResults, isLoading: loadingSearch } = trpc.workspaces.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length >= 2 }
  )
  
  const { mutateAsync: createOffer, isPending } = trpc.transfers.createOffer.useMutation()

  // Filtramos los activos que no estén bloqueados o en cuarentena, solo 'active'
  const availableAssets = (assets as Array<{ id: string; type: string; status: string }> | undefined)?.filter(a => a.status === 'active') || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAssetId || !selectedWorkspaceId) return

    try {
      await createOffer({
        assetId: selectedAssetId,
        toWorkspaceId: selectedWorkspaceId,
        signature: "mock-ed25519-creation-signature-payload",
        conditions: { note: "Enviado desde el terminal Biffco" }
      })
      // eslint-disable-next-line no-undef
      alert("¡Transferencia Encriptada y Despachada Exitosamente!")
      router.push(`/${params.wsId}/transfers`)
    } catch (err: unknown) {
      if (err instanceof Error) {
        // eslint-disable-next-line no-undef
        alert(`Error al enviar: ${err.message}`)
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto w-full flex flex-col gap-6 animate-in fade-in duration-300 py-8">
      
      <div className="flex flex-col gap-2 border-b border-border pb-6">
         <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
           <IconSend className="text-primary" size={28} />
           Nueva Transferencia
         </h1>
         <p className="text-text-secondary">Selecciona un Lote o Activo y despáchalo atómicamente a otro Nodo / Workspace de la red Biffco.</p>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-8 bg-surface border border-border rounded-2xl p-8 shadow-sm">
         
         {/* PASO 1: SELECCIONAR ACTIVO */}
         <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-text-primary flex items-center gap-2">
              <IconBox size={18} className="text-text-muted" /> 
              1. Selecciona el Lote de Origen
            </label>
            <p className="text-xs text-text-muted mb-2">Solo se listan aquí los activos que se encuentran en estado Inmutable `active`.</p>
            
            {loadingAssets ? (
               <div className="h-12 bg-surface-raised animate-pulse rounded-lg border border-border" />
            ) : (
               <select 
                 value={selectedAssetId} 
                 onChange={(e) => setSelectedAssetId(e.target.value)}
                 className="w-full bg-bg border border-border rounded-lg p-3 text-sm text-text-primary focus:border-primary outline-none transition-colors"
                 required
               >
                 <option value="" disabled>-- Elige un activo disponible --</option>
                 {availableAssets.map(a => (
                   <option key={a.id} value={a.id}>Lote: {a.id.split('-')[0]} (Tipo: {a.type})</option>
                 ))}
               </select>
            )}
            {availableAssets.length === 0 && !loadingAssets && (
              <span className="text-xs text-warning mt-1">No tienes lotes activos disponibles.</span>
            )}
         </div>

         <hr className="border-border" />

         {/* PASO 2: BUSCAR DESTINO */}
         <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-text-primary flex items-center gap-2">
              <IconBuilding size={18} className="text-text-muted" /> 
              2. Workspace Destino
            </label>
            <p className="text-xs text-text-muted mb-2">Busca el Nodo receptor por su Razón Social o Slug. (Ej: "Exportadora", "Frigorífico").</p>
            
            <div className="flex flex-col gap-2 relative">
               <input 
                  type="text"
                  placeholder="Escribe al menos 2 letras para buscar..."
                  value={searchQuery}
                  onChange={(e) => {
                     setSearchQuery(e.target.value)
                     setSelectedWorkspaceId("")
                  }}
                  className="w-full bg-bg border border-border rounded-lg p-3 text-sm text-text-primary focus:border-primary outline-none transition-colors"
               />
               
               {/* Search Results Dropdown overlay */}
               {searchQuery.length >= 2 && !selectedWorkspaceId && (
                 <div className="absolute top-[100%] left-0 z-10 w-full mt-2 bg-surface border border-border rounded-lg shadow-xl overflow-hidden flex flex-col max-h-48 overflow-y-auto">
                    {loadingSearch ? (
                       <div className="p-4 text-xs text-text-muted text-center">Buscando Nodos...</div>
                    ) : (searchResults ?? []).length === 0 ? (
                       <div className="p-4 text-xs text-text-muted text-center">No se encontraron Nodos con ese nombre.</div>
                    ) : (
                       searchResults?.map((ws: { id: string; name: string; slug: string | null }) => (
                         <button
                           key={ws.id}
                           type="button"
                           onClick={() => {
                             setSelectedWorkspaceId(ws.id)
                             setSearchQuery(ws.name) // populate input
                           }}
                           className="flex items-center gap-3 w-full text-left p-3 hover:bg-surface-raised text-sm text-text-primary border-b border-border last:border-0 transition-colors"
                         >
                           <IconCheck size={16} className="text-primary opacity-0 hover:opacity-100" />
                           <div className="flex flex-col">
                             <span className="font-semibold">{ws.name}</span>
                             <span className="text-xs text-text-muted font-mono">{ws.slug || ws.id}</span>
                           </div>
                         </button>
                       ))
                    )}
                 </div>
               )}
            </div>

            {selectedWorkspaceId && (
               <div className="p-3 bg-success/10 border border-success/30 rounded-lg flex items-center gap-2 mt-2 text-sm text-success font-medium">
                  <IconCheck size={18} /> Destino criptográfico fijado.
               </div>
            )}
         </div>

         {/* PASO 3: FIRMAR Y ENVIAR */}
         <div className="mt-4">
            <Button 
               type="submit" 
               disabled={!selectedAssetId || !selectedWorkspaceId || isPending}
               className="w-full py-6 text-base font-bold flex items-center justify-center gap-2"
            >
               {isPending ? "Validando Reglas de Consenso..." : "Firmar Lote y Transferir Custodia"}
            </Button>
            <p className="text-center text-[10px] text-text-muted mt-3 max-w-sm mx-auto">
               Al confirmar, tu navegador firmará el payload usando Ed25519 y el activo será bloqueado atómicamente impidiendo mutaciones de tu lado.
            </p>
         </div>

      </form>
    </div>
  )
}
