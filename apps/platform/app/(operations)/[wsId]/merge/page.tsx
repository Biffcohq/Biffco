"use client"

import React, { useState, useMemo } from 'react'
import { trpc } from '@/lib/trpc'
import { IconArrowRight, IconAlertTriangle, IconLayersDifference, IconCheck } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
// @ts-ignore
import { Button, Input, toast, Badge } from '@biffco/ui'

export default function MergePage({ params }: { params: { wsId: string } }) {
  const router = useRouter()
  
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([])
  const [outputType, setOutputType] = useState('BulkAsset')
  const [outputName, setOutputName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch only operable assets to populate the selector
  const { data: assets, isLoading } = trpc.assets.list.useQuery({ limit: 100 })

  const mergeMutation = trpc.merge.createMerge.useMutation({
    onSuccess: (data: { childId: string, consumedCount: number }) => {
      toast.success(`Fusión Exitosa: ${data.consumedCount} activos unificados en el ID ${data.childId.slice(0, 8)}.`)
      router.push(`/${params.wsId}/assets`)
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message || "Error al realizar la fusión")
    }
  })

  // Derive selection data
  const selectedAssets = useMemo(() => {
    if (!assets) return []
    return selectedAssetIds.map(id => assets.find((a: { id: string }) => a.id === id)).filter(Boolean)
  }, [selectedAssetIds, assets])

  // Worst-Case Compliance Check based on status
  const infectedAssets = selectedAssets.filter((a: { status?: string }) => a.status === 'QUARANTINE' || a.status === 'LOCKED')
  const hasComplianceRisk = infectedAssets.length > 0

  const toggleAsset = (id: string) => {
    if (selectedAssetIds.includes(id)) {
      setSelectedAssetIds(prev => prev.filter(a => a !== id))
    } else {
      setSelectedAssetIds(prev => [...prev, id])
    }
  }

  const handleMerge = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedAssetIds.length < 2 || mergeMutation.isPending) return

    setIsSubmitting(true)
    mergeMutation.mutate({
       inputAssetIds: selectedAssetIds,
       outputType: outputType,
       outputMetadata: { mergedName: outputName || 'Activo Unificado' }
    }, {
      onSettled: () => setIsSubmitting(false)
    })
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 max-w-5xl mx-auto h-full p-6">
      
      <div className="flex flex-col gap-2 border-b border-border pb-6">
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <IconLayersDifference size={24} className="text-primary" />
          Fusión Logística (Merge)
        </h1>
        <p className="text-text-secondary text-sm">
          Ensambla múltiples activos independientes en uno solo. La inmutabilidad topológica
          propagará automáticamente el riesgo del peor caso sanitario hacia el activo final.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-8 mt-4">
        
        {/* Columna Izquierda: Entradas (Inputs) */}
        <div className="md:col-span-5 flex flex-col gap-6 border-r border-border pr-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-text-primary text-sm uppercase tracking-wider">Lotes de Origen</h3>
            <Badge variant="secondary">{selectedAssetIds.length} Seleccionados</Badge>
          </div>

          <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden flex flex-col max-h-[400px]">
            <div className="p-3 border-b border-border bg-bg/50">
               <p className="text-xs text-text-muted">Selecciona al menos 2 activos operativos para la unificación.</p>
            </div>
            
            <div className="overflow-y-auto p-2 flex flex-col gap-1 flex-1">
               {isLoading ? (
                 <p className="text-xs text-center p-4 text-text-muted animate-pulse">Cargando inventario...</p>
               ) : assets?.filter((a: { status: string }) => !['CLOSED_BY_SPLIT', 'CLOSED_BY_MERGE', 'SLAUGHTERED'].includes(a.status)).map((asset: { id: string, status: string, type: string }) => {
                 const isSelected = selectedAssetIds.includes(asset.id)
                 const isRisk = asset.status === 'QUARANTINE' || asset.status === 'LOCKED'
                 return (
                   <div 
                     key={asset.id}
                     onClick={() => toggleAsset(asset.id)}
                     className={`flex items-center justify-between p-3 rounded-lg border text-sm cursor-pointer transition-all ${
                       isSelected 
                         ? (isRisk ? 'bg-error/10 border-error/50 ring-1 ring-error/50' : 'bg-primary/10 border-primary/50 ring-1 ring-primary/50')
                         : 'bg-surface border-transparent hover:border-border'
                     }`}
                   >
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-text-primary">{asset.id.slice(0, 8)}</span>
                        <span className="text-xs text-text-muted">{asset.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isRisk && <IconAlertTriangle size={14} className="text-error" />}
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? (isRisk ? 'bg-error text-white border-error' : 'bg-primary text-white border-primary') : 'border-border'
                        }`}>
                           {isSelected && <IconCheck size={12} stroke={3} />}
                        </div>
                      </div>
                   </div>
                 )
               })}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Topología y Output */}
        <div className="md:col-span-7 flex flex-col gap-6">
          <div className="bg-surface border border-border rounded-xl p-5 shadow-sm space-y-4">
             <h3 className="font-semibold text-text-primary text-sm uppercase tracking-wider">Topología de Ensamblaje</h3>
             
             <div className="h-48 rounded-lg bg-bg/50 border border-dashed border-border flex items-center justify-between px-8 relative overflow-hidden">
                {selectedAssetIds.length === 0 ? (
                   <p className="text-text-muted text-sm w-full text-center">Selecciona activos a la izquierda para armar el ensamble.</p>
                ) : (
                   <>
                     {/* Entradas */}
                     <div className="flex flex-col gap-2 relative z-10 w-1/3">
                        {selectedAssets.slice(0, 4).map((a: { id: string, status: string }) => (
                          <div key={a.id} className={`w-full py-1.5 px-3 rounded text-xs font-mono text-center border shadow-sm ${
                            ['QUARANTINE', 'LOCKED'].includes(a.status) ? 'bg-error text-white border-error/50' : 'bg-surface border-border text-text-primary'
                          }`}>
                            {a.id.slice(0, 6)}
                          </div>
                        ))}
                        {selectedAssets.length > 4 && (
                           <div className="text-xs text-center text-text-muted font-bold pt-1">+{selectedAssets.length - 4} más</div>
                        )}
                     </div>

                     {/* Flechas Convergentes */}
                     <div className="flex-1 flex flex-col items-center justify-center relative z-0 opacity-50">
                        <IconArrowRight size={32} className={`transition-colors ${hasComplianceRisk ? 'text-error' : 'text-primary'}`} />
                     </div>

                     {/* Salida */}
                     <div className="w-1/3 flex justify-end relative z-10">
                        <div className={`w-24 h-24 rounded-full border-4 shadow-xl flex items-center justify-center ${
                           hasComplianceRisk ? 'border-error bg-error/10' : 'border-primary bg-primary/10'
                        }`}>
                           <IconLayersDifference size={32} className={hasComplianceRisk ? 'text-error animate-pulse' : 'text-primary'} />
                        </div>
                     </div>
                   </>
                )}
             </div>

             {/* GUARDIA DE CUMPLIMIENTO (WORST-CASE) */}
             {hasComplianceRisk && (
                <div className="bg-error/10 border border-error/30 rounded-lg p-4 animate-in fade-in slide-in-from-top-4">
                  <div className="flex items-start gap-3">
                    <IconAlertTriangle className="text-error shrink-0 mt-0.5" size={20} />
                    <div className="flex flex-col">
                      <h4 className="text-sm font-bold text-error">Riesgo Sistémico Detectado</h4>
                      <p className="text-xs text-error/80 mt-1">
                        Has incluido {infectedAssets.length} activo(s) bajo restricción preventiva. Al unificarlos,
                        el super-activo resultante <strong>heredará ineludiblemente la clausura o cuarentena</strong>.
                        El Agnosticismo Físico no permite diluir componentes marcados.
                      </p>
                    </div>
                  </div>
                </div>
              )}
          </div>

          <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
             <div className="p-5 space-y-4">
                <h3 className="font-semibold text-text-primary text-sm uppercase tracking-wider">Atributos del Titán (Output)</h3>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <label className="text-xs text-text-secondary">Tipo Técnico del Vertical</label>
                     <Input 
                       value={outputType}
                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOutputType(e.target.value)}
                       placeholder="Ej. LiquidContainer"
                       disabled={isSubmitting}
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-xs text-text-secondary">Nombre / Identificador Logístico</label>
                     <Input 
                       value={outputName}
                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOutputName(e.target.value)}
                       placeholder="Cisterna #09"
                       disabled={isSubmitting}
                     />
                   </div>
                </div>
                <p className="text-[10.5px] text-text-muted italic bg-bg p-2 rounded">
                   *Agnosticismo Radical: El motor transaccional delega operaciones de conversión de densidades/pesos a la interfaz del Vertical Pack. El Backend firmará y aislará volumetrías arbitrarias asegurando netamente las garantías regulatorias heredadas.
                </p>
             </div>
             
             <div className="p-4 border-t border-border bg-bg/50">
                <Button 
                  variant={hasComplianceRisk ? "destructive" : "primary"}
                  className="w-full relative overflow-hidden group py-6"
                  onClick={handleMerge}
                  disabled={isSubmitting || selectedAssetIds.length < 2 || !outputType}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 font-bold text-base">
                    {isSubmitting ? (
                      <span className="animate-pulse">Fusionando de forma atómica...</span>
                    ) : hasComplianceRisk ? (
                      <>Validar Fusión Restringida <IconAlertTriangle size={20} /></>
                    ) : (
                      <>Ejecutar Fusión Logística <IconLayersDifference size={20} /></>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </Button>
              </div>
          </div>
        </div>

      </div>
    </div>
  )
}
