"use client"

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc'
import { Button } from '@biffco/ui'
import { IconArrowLeft, IconBox, IconArrowsSplit, IconPlus, IconTrash } from '@tabler/icons-react'

export default function SplitTransformationPage() {
  const params = useParams()
  const router = useRouter()
  const assetId = typeof params?.assetId === 'string' ? params.assetId : ''
  const workspaceId = typeof params?.workspaceId === 'string' ? params.workspaceId : ''

  const utils = trpc.useUtils()
  const { data: asset, isLoading } = trpc.assets.getById.useQuery(
    { id: assetId },
    { enabled: !!assetId }
  )

  const { data: workspaceData } = trpc.workspaces.getProfile.useQuery()
  const verticalId = workspaceData?.verticalId || 'livestock'

  const splitMutation = trpc.split.createSplit.useMutation({
    onSuccess: (data) => {
      alert(`Activos fraccionados con éxito! Total derivados: ${data.childrenCount}`);
      utils.assets.getById.invalidate({ id: assetId });
      router.push(`/w/${workspaceId}/assets/${assetId}`);
    },
    onError: (err) => {
      alert(`Error: ${err.message}`);
    }
  })

  const [outputs, setOutputs] = useState([
    { type: verticalId === 'livestock' ? 'MeatCut' : 'Fraction', metadata: { weight: 10, category: 'A' }, quantity: 1 }
  ])

  if (isLoading) return <div className="p-12 animate-pulse text-center">Cargando orígen industrial...</div>

  if (!asset || asset.status !== 'active') {
    return (
      <div className="p-12 text-center text-error bg-error/5 border border-error/50 rounded-xl max-w-2xl mx-auto mt-12">
        <h2 className="text-xl font-bold mb-2">Operación Bloqueada</h2>
        <p>El activo solicitado no se encuentra Activo o ya fue consumido.</p>
        <Button className="mt-4" onClick={() => router.back()}>Volver al Pasaporte</Button>
      </div>
    )
  }

  const handleSplit = () => {
    // Aplanar outputs por `quantity`
    const allocations: any[] = [];
    for (const out of outputs) {
      for (let i = 0; i < out.quantity; i++) {
        allocations.push({
           quantity: out.quantity,
           metadata: { 
             ...out.metadata, 
             type: out.type 
           }
        });
      }
    }

    if (allocations.length === 0) {
      return alert("Agregue al menos una salida");
    }

    if(confirm("Confirmar transformación irreversible? El activo padre quedará inactivo y nacerán los derivados con la rúbrica The Edge.")) {
       splitMutation.mutate({
         inputAssetId: assetId,
         outputAllocations: allocations
       })
    }
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 relative p-4">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-surface-raised transition-colors">
          <IconArrowLeft />
        </button>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <IconArrowsSplit className="text-primary" /> Transformación Industrial (Universal)
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Origen */}
        <div className="bg-surface border border-border p-6 rounded-xl">
          <h2 className="text-sm uppercase tracking-wider text-text-muted font-bold mb-4 border-b border-border/50 pb-2">Entrada (Consumido)</h2>
          <div className="flex bg-primary/10 border border-primary/30 p-4 rounded-lg flex-col gap-2">
             <div className="flex items-center gap-2 font-bold text-primary">
               <IconBox size={20}/>
               {asset.type}
             </div>
             <p className="text-xs font-mono break-all text-text-secondary">{asset.id}</p>
             <p className="text-sm mt-2 text-text-primary">Este activo perderá su vigencia activa y heredará toda su genealogía y holds a los derivados resultantes.</p>
          </div>
        </div>

        {/* Salidas */}
        <div className="bg-surface border border-border p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-2">
             <h2 className="text-sm uppercase tracking-wider text-text-muted font-bold">Salidas (Derivados)</h2>
             <button title="Agregar Derivado" onClick={() => setOutputs([...outputs, { type: 'NewCut', metadata: { weight: 0 }, quantity: 1 }])} className="text-emerald-600 hover:bg-emerald-50 p-1 rounded transition-colors">
               <IconPlus size={18} />
             </button>
          </div>

          <div className="flex flex-col gap-4">
            {outputs.map((out, idx) => (
              <div key={idx} className="flex flex-col gap-3 p-3 bg-surface-raised border border-border rounded-lg relative group">
                <button 
                  onClick={() => setOutputs(outputs.filter((_, i) => i !== idx))} 
                  className="absolute right-2 top-2 text-text-muted hover:text-red-500 transition-colors"
                >
                  <IconTrash size={16}/>
                </button>
                <div className="flex items-center gap-2 pr-6">
                  <input 
                    type="text" 
                    value={out.type} 
                    onChange={e => { const no = [...outputs]; no[idx].type = e.target.value; setOutputs(no) }}
                    className="flex-1 bg-surface border border-border rounded px-2 py-1 text-sm outline-none focus:border-primary"
                    placeholder="Tipo (Ej. Lomo, MineralA)"
                  />
                  <input 
                    type="number" 
                    value={out.quantity} 
                    onChange={e => { const no = [...outputs]; no[idx].quantity = Number(e.target.value); setOutputs(no) }}
                    className="w-16 bg-surface border border-border rounded px-2 py-1 text-sm outline-none focus:border-primary text-center"
                    min="1"
                    title="Cantidad de copias exactas a derivar"
                  />
                </div>
                <div className="flex flex-col gap-1">
                   <label className="text-xs text-text-muted">Metadatos (JSON):</label>
                   <textarea 
                     className="w-full bg-bg-subtle border border-border/50 rounded p-2 text-xs font-mono outline-none focus:border-primary h-20 resize-none"
                     value={JSON.stringify(out.metadata, null, 2)}
                     onChange={(e) => {
                       try {
                         const metadata = JSON.parse(e.target.value);
                         const no = [...outputs]; no[idx].metadata = metadata; setOutputs(no);
                       } catch (e) {
                         // ignore JSON parse error on edit, handled on blur/submit ideally
                       }
                     }}
                   />
                </div>
              </div>
            ))}
          </div>

          <Button 
            className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white border-0 py-5" 
            isLoading={splitMutation.isPending}
            onClick={handleSplit}
          >
            CONFIRMAR TRANSFORMACIÓN
          </Button>
        </div>
      </div>
    </div>
  )
}
