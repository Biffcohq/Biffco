"use client"

import React, { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { IconArrowRight, IconAlertTriangle, IconScissors, IconLayersDifference } from '@tabler/icons-react'
import { useRouter, useSearchParams } from 'next/navigation'
// @ts-ignore
import { Button, Input, toast } from '@biffco/ui'

export default function SplitPage({ params }: { params: { wsId: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialAssetId = searchParams.get('assetId') || ''
  
  const [assetId, setAssetId] = useState(initialAssetId)
  const [outputCount, setOutputCount] = useState<number>(2)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch parent asset details and holds to enforce Worst-case compliance warning
  const { data: asset, isLoading: isLoadingAsset, error } = trpc.assets.getById.useQuery(
    { id: assetId },
    { enabled: assetId.length > 5, retry: false }
  )

  const splitMutation = trpc.split.createSplit.useMutation({
    onSuccess: (data) => {
      toast.success(`Fraccionamiento completado: Se generaron ${data.childrenCount} nuevos activos.`)
      router.push(`/${params.wsId}/assets`)
    },
    onError: (err: any) => {
      toast.error(err.message || "Error al realizar el fraccionamiento")
    }
  })

  const hasHolds = asset && asset.holds && asset.holds.length > 0

  const handleSplit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!asset || splitMutation.isPending) return

    // Construcción de N particiones idénticas y agnósticas (sin peso impuesto obligatorialmente por el framework)
    const allocations = Array.from({ length: outputCount }).map((_, i) => ({
      metadata: { splitIndex: i + 1, expectedFraction: `1/${outputCount}` }
    }))

    setIsSubmitting(true)
    splitMutation.mutate({
       inputAssetId: asset.id,
       outputAllocations: allocations
    }, {
      onSettled: () => setIsSubmitting(false)
    })
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 max-w-4xl mx-auto h-full p-6">
      
      <div className="flex flex-col gap-2 border-b border-border pb-6">
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <IconScissors size={24} className="text-primary" />
          Fraccionamiento Logístico (Split)
        </h1>
        <p className="text-text-secondary text-sm">
          Divide un activo existente en múltiples partes. El linaje asegurará la trazabilidad retrospectiva
          y heredará obligatoriamente cualquier retención de compliance activa.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-4">
        
        {/* Lado izquierdo: Configuración */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface border border-border rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-text-primary text-sm uppercase tracking-wider">Activo de Origen</h3>
            <div className="space-y-2">
              <label className="text-sm text-text-secondary">ID del Activo a fraccionar</label>
              <Input 
                value={assetId}
                onChange={(e: any) => setAssetId(e.target.value)}
                placeholder="Ej. cux82... o pega el ID"
                disabled={isSubmitting}
              />
            </div>
            {error && <p className="text-xs text-error font-medium">{error.message}</p>}
          </div>

          <div className="bg-surface border border-border rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-text-primary text-sm uppercase tracking-wider">Plan de Partición</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-text-secondary block mb-1">Cantidad resultante (N Hijos)</label>
                <Input 
                  type="number" 
                  min={2}
                  max={100}
                  value={outputCount}
                  onChange={(e: any) => setOutputCount(parseInt(e.target.value) || 2)}
                  disabled={isSubmitting || !asset}
                />
                <p className="text-xs text-text-muted mt-2">
                  *Agnosticismo de Volumen activado: El Core delegará la declaración de pesos específicos
                  a la lectura del VerticalPack, garantizando únicamente la herencia inmutable.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lado derecho: Preview y Compliance */}
        <div className="flex flex-col gap-6">
          
          {isLoadingAsset ? (
            <div className="h-48 border-2 border-dashed border-border rounded-xl flex items-center justify-center animate-pulse">
              <p className="text-text-muted text-sm text-center">Buscando activo...</p>
            </div>
          ) : asset ? (
            <div className="border border-border rounded-xl shadow-sm bg-surface overflow-hidden flex flex-col">
              <div className="bg-surface-raised p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-text-primary">Preview de Operación</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
                    {asset.type}
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex flex-col items-center justify-center space-y-6">
                
                {/* Visualizador Grafo simple */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-surface-raised border-2 border-primary flex items-center justify-center shadow-lg relative">
                     <span className="text-xs font-mono font-bold">{asset.id.slice(0,4)}..</span>
                     {hasHolds && (
                       <span className="absolute -top-1 -right-1 w-4 h-4 bg-error rounded-full animate-pulse border-2 border-surface"></span>
                     )}
                  </div>
                  <div className="h-8 w-px bg-primary/50 relative">
                     <IconArrowRight size={14} className="absolute -bottom-2 -translate-x-1/2 left-1/2 text-primary rotate-90" />
                  </div>
                </div>

                <div className="flex items-center gap-4 justify-center flex-wrap max-w-[200px]">
                   {Array.from({ length: Math.min(outputCount, 5) }).map((_, i) => (
                      <div key={i} className="w-10 h-10 rounded-full border border-primary/50 bg-surface-raised flex items-center justify-center shrink-0 relative">
                        <IconLayersDifference size={16} className="text-text-muted" />
                        {hasHolds && (
                          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-error rounded-full border border-surface"></span>
                        )}
                      </div>
                   ))}
                   {outputCount > 5 && (
                     <span className="text-xs text-text-muted font-bold">+{outputCount - 5}</span>
                   )}
                </div>

              </div>

              {/* WORST-CASE COMPLIANCE GUARD */}
              {hasHolds && (
                <div className="m-4 mt-0 bg-error/10 border border-error/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <IconAlertTriangle className="text-error shrink-0 mt-0.5" size={20} />
                    <div className="flex flex-col">
                      <h4 className="text-sm font-bold text-error">Advertencia de Seguridad Logística</h4>
                      <p className="text-xs text-error/80 mt-1">
                        El activo padre posee <strong>{asset.holds.length} retención(es) activa(s)</strong>.
                        Si procedes con el fraccionamiento atómico, la regla <em className="font-mono">Worst-case inheritance</em> del Core
                        clonará estas retenciones a todos los {outputCount} hijos resultantes, bloqueándolos preventivamente.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 border-t border-border bg-bg/50">
                <Button 
                  variant={hasHolds ? "destructive" : "primary"}
                  className="w-full relative overflow-hidden group"
                  onClick={handleSplit}
                  disabled={isSubmitting || outputCount < 2}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <span className="animate-pulse">Ejecutando Transacción Atómica...</span>
                    ) : hasHolds ? (
                      <>Autorizar Fraccionamiento Restringido <IconScissors size={18} /></>
                    ) : (
                      <>Confirmar Fraccionamiento <IconArrowRight size={18} /></>
                    )}
                  </span>
                  {/* Glare effect */}
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </Button>
              </div>

            </div>
          ) : (
             <div className="h-48 border border-dashed border-border rounded-xl flex items-center justify-center bg-surface-raised/50">
               <p className="text-text-muted text-sm text-center px-8">
                 Ingresa un ID de activo válido a la izquierda para cargar el preview topológico de la ruta de partición.
               </p>
             </div>
          )}
          
        </div>

      </div>
    </div>
  )
}
