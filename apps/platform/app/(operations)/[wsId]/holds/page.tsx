"use client"

import React, { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { IconAlertTriangle, IconShieldCheck, IconLock, IconGavel } from '@tabler/icons-react'
// @ts-ignore
import { Button, Input, toast, Badge } from '@biffco/ui'

export default function HoldsDashboard() {
  const trpcUtils = trpc.useUtils()
  const { data: holds, isLoading } = trpc.holds.list.useQuery()

  // Modals & State
  const [targetAssetId, setTargetAssetId] = useState('')
  const [imposeReason, setImposeReason] = useState('')
  const [isImposing, setIsImposing] = useState(false)

  // Mutations
  const imposeMutation = trpc.holds.impose.useMutation({
    onSuccess: () => {
      toast.success("Cuarentena impuesta con éxito. Activo clausurado.")
      setTargetAssetId('')
      setImposeReason('')
      setIsImposing(false)
      trpcUtils.holds.list.invalidate()
    },
    onError: (err: { message?: string }) => toast.error(err.message || "Error al imponer cuarentena")
  })

  const liftMutation = trpc.holds.lift.useMutation({
    onSuccess: (res) => {
      if (res.remainedInQuarantine) {
         toast.success("Cuarentena absuelta, pero el activo continúa sancionado por otros holds activos.")
      } else {
         toast.success("Cuarentena absuelta íntegramente. El activo ha sido liberado (ACTIVE).")
      }
      trpcUtils.holds.list.invalidate()
    },
    onError: (err: { message?: string }) => toast.error(err.message || "Error al absolver cuarentena")
  })

  const handleImpose = (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetAssetId || !imposeReason || imposeMutation.isPending) return
    setIsImposing(true)
    imposeMutation.mutate({ assetId: targetAssetId, reason: imposeReason })
  }

  const handleLift = (holdId: string) => {
    // eslint-disable-next-line no-alert, no-undef
    if (!window.confirm("¿Tienes la autorización legal para levantar esta clausura operativa?")) return
    liftMutation.mutate({ holdId, reason: "Absolución manual administrativa" })
  }

  const activeHolds = holds?.filter((h: { isActive: boolean }) => h.isActive) || []
  const inactiveHolds = holds?.filter((h: { isActive: boolean }) => !h.isActive) || []

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300 max-w-6xl mx-auto h-full p-6">
      
      {/* HEADER */}
      <div className="flex flex-col gap-2 border-b border-border pb-6">
        <div className="flex justify-between items-start">
           <div>
             <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
               <IconAlertTriangle size={24} className="text-error" />
               Aduana & Cuarentenas (Holds)
             </h1>
             <p className="text-text-secondary text-sm max-w-2xl mt-1">
               Tablero global de riesgos sanitarios o legales. Los activos `QUARANTINE` y `LOCKED` propagarán genéticamente 
               su condena hacia cualquier lote unificado o fraccionado mientras esta clausura siga sin absolverse (`isActive=true`).
             </p>
           </div>
           
           <div className="flex gap-4">
             <div className="bg-surface border border-border px-4 py-2 rounded-lg text-center">
                <span className="block text-2xl font-mono text-error font-bold">{activeHolds.length}</span>
                <span className="text-[10px] uppercase tracking-wider text-text-muted">Activas</span>
             </div>
             <div className="bg-surface border border-border px-4 py-2 rounded-lg text-center">
                <span className="block text-2xl font-mono text-primary font-bold">{inactiveHolds.length}</span>
                <span className="text-[10px] uppercase tracking-wider text-text-muted">Absueltas</span>
             </div>
           </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
         
         {/* PANEL IZQUIERDO: IMPONER (IMPOSE) */}
         <div className="md:col-span-1 border border-border rounded-xl bg-surface p-6 shadow-sm flex flex-col gap-5 h-fit sticky top-6">
            <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2 text-text-primary">
               <IconGavel size={18} /> Castigar / Clausurar
            </h3>
            
            <form onSubmit={handleImpose} className="flex flex-col gap-4">
               <div>
                  <label className="text-xs text-text-secondary block mb-1">Asset ID Problemático</label>
                  <Input 
                     value={targetAssetId}
                     onChange={(e: { target: { value: React.SetStateAction<string> } }) => setTargetAssetId(e.target.value)}
                     placeholder="cux901b..."
                     disabled={isImposing}
                  />
               </div>
               <div>
                  <label className="text-xs text-text-secondary block mb-1">Razón Oficial del Hold</label>
                  <textarea 
                     value={imposeReason}
                     onChange={(e: { target: { value: React.SetStateAction<string> } }) => setImposeReason(e.target.value)}
                     className="w-full bg-bg border border-border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-error"
                     placeholder="Ej. Fiebre Aftosa. Lote paralizado según ordenanza #193."
                     rows={4}
                     disabled={isImposing}
                  />
               </div>
               
               <Button 
                  type="submit"
                  variant="destructive" 
                  disabled={!targetAssetId || imposeReason.length < 5 || isImposing}
                  className="w-full py-5"
               >
                  {imposeMutation.isPending ? "Aplicando Clausura Inmutable..." : "Imponer Cuarentena"}
               </Button>
            </form>
         </div>

         {/* PANEL DERECHO: LISTADO Y ABSOLUCIÓN */}
         <div className="md:col-span-2 flex flex-col gap-6">
            
            <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2 text-text-primary">
               Registro Total de Restricciones
            </h3>

            {isLoading ? (
               <div className="animate-pulse space-y-4">
                  <div className="h-20 bg-surface rounded-xl border border-border"></div>
                  <div className="h-20 bg-surface rounded-xl border border-border"></div>
               </div>
            ) : holds?.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-xl bg-surface/50 text-text-muted">
                  <IconShieldCheck size={48} className="text-primary/50 mb-4" />
                  <p>Inmaculado. Tu Workspace nunca ha sufrido embargos.</p>
               </div>
            ) : (
               <div className="flex flex-col gap-3">
                  {holds?.map((h: { id: string, assetId: string, reason: string, isActive: boolean, createdAt: string, issuerId: string }) => (
                     <div key={h.id} className={`flex flex-col p-4 rounded-xl border transition-all ${
                        h.isActive ? 'bg-error/5 border-error/30 hover:border-error/50 relative overflow-hidden' : 'bg-surface border-border opacity-70'
                     }`}>
                        
                        {/* Red band warning tape if active */}
                        {h.isActive && (
                           <div className="absolute top-0 left-0 w-1 h-full bg-error rounded-l-xl"></div>
                        )}

                        <div className="flex items-start justify-between">
                           <div className="flex flex-col gap-1 pl-2">
                              <span className="font-mono font-bold text-text-primary text-sm flex items-center gap-2">
                                 {h.isActive ? <IconLock size={14} className="text-error" /> : <IconShieldCheck size={14} className="text-primary" />}
                                 Asset #{h.assetId.slice(0, 8)}
                              </span>
                              <p className={`text-xs mt-1 ${h.isActive ? 'text-text-primary' : 'text-text-secondary line-through'}`}>
                                 {h.reason}
                              </p>
                              <div className="flex gap-3 text-[10px] text-text-muted font-mono mt-2">
                                 <span>{new Date(h.createdAt).toLocaleDateString()}</span>
                                 <span>•</span>
                                 <span>Issuer: {h.issuerId.slice(0, 8)}</span>
                              </div>
                           </div>
                           
                           <div className="flex flex-col items-end gap-2">
                              <Badge variant={h.isActive ? 'destructive' : 'secondary'}>
                                 {h.isActive ? 'ACTIVA (QUARANTINE)' : 'ABSUELTA (LIFTED)'}
                              </Badge>

                              {h.isActive && (
                                 <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-xs hover:border-primary hover:text-primary mt-2 group relative overflow-hidden"
                                    onClick={() => handleLift(h.id)}
                                    disabled={liftMutation.isPending}
                                 >
                                    <span className="relative z-10">Levantar Clausura 🔨</span>
                                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                                 </Button>
                              )}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>

      </div>
    </div>
  )
}
