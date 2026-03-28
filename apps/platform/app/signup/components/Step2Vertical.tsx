import { useSignupStore } from '../../stores/useSignupStore'
import { trpc } from '../../../lib/trpc'
import { ArrowLeft, ArrowRight, Layers, BoxSelect, CheckCircle2 } from 'lucide-react'

export function Step2Vertical() {
  const { verticalId, setVertical, nextStep, prevStep } = useSignupStore()
  const { data: verticals, isLoading, isError } = trpc.verticals.list.useQuery()

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold flex items-center gap-3 text-navy mb-2 tracking-tight">
          <Layers className="text-primary opacity-90 h-7 w-7" /> 
          Elige la Industria Base
        </h2>
        <p className="text-text-secondary text-sm font-medium leading-relaxed max-w-sm">
          BIFFCO activará las reglas criptográficas y marcos normativos específicos (ej. EUDR) aplicables a tu negocio.
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto mb-6 pr-2">
        {isLoading && (
          <div className="flex justify-center py-10 opacity-60">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        )}
        
        {isError && (
          <div className="p-4 bg-error-subtle text-error rounded-xl text-sm font-bold border border-error/20">
            Error al consultar motores verticales. Asegúrate de tener el Backend encendido.
          </div>
        )}

        {verticals?.map((v: any) => {
          const vertical = v as any
          const isSelected = verticalId === vertical.id
          
          return (
          <button
            key={vertical.id}
            onClick={() => setVertical(vertical.id)}
            className={`w-full text-left p-5 rounded-2xl border flex gap-4 transition-all duration-300 cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-primary/20 relative ${
              isSelected
                ? 'border-primary bg-primary/5 shadow-[0_4px_20px_rgba(58,134,255,0.15)] scale-[1.02] ring-1 ring-primary/20' 
                : 'border-border/80 bg-white/60 backdrop-blur-sm hover:border-border-strong shadow-sm hover:shadow'
            }`}
          >
            <div className={`p-3 rounded-xl shrink-0 transition-colors ${isSelected ? 'bg-primary text-white shadow-md shadow-primary/30' : 'bg-surface-raised border border-border/50 text-text-muted'}`}>
              <BoxSelect className="w-6 h-6" />
            </div>
            <div className="flex-1 mt-0.5">
              <h3 className={`font-bold text-lg mb-1 leading-none ${isSelected ? 'text-primary' : 'text-navy'}`}>{vertical.name}</h3>
              <p className="text-xs text-text-secondary font-medium mt-1.5 pr-8 leading-relaxed opacity-90">
                Reglas: {vertical.complianceFrameworks?.map((x: string) => x.toUpperCase()).join(', ')} • 
                Trazabilidad para {vertical.assetLabel} en base a parámetros {vertical.geoRequirements ? 'Geoespaciales' : 'Criptográficas'}.
              </p>
            </div>
            {isSelected && (
              <CheckCircle2 className="absolute top-5 right-5 text-primary w-6 h-6 animate-in zoom-in duration-200" />
            )}
          </button>
        )})}
      </div>

      <div className="flex justify-between items-center mt-auto pt-4 border-t border-border/40">
        <button 
          onClick={prevStep}
          className="h-12 px-6 text-sm font-bold text-text-muted hover:text-navy hover:bg-surface-raised rounded-full transition-all"
        >
          <ArrowLeft className="w-4 h-4 inline-block mr-2" /> Atrás
        </button>

        <button 
          onClick={nextStep}
          disabled={!verticalId}
          className={`h-12 px-8 rounded-full font-medium flex items-center gap-3 transition-all ${
            verticalId 
              ? 'bg-primary hover:bg-primary-hover text-white shadow-[0_4px_14px_rgba(58,134,255,0.39)] hover:shadow-[0_6px_20px_rgba(58,134,255,0.23)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95' 
              : 'bg-surface-raised border border-border/80 text-text-muted cursor-not-allowed shadow-none'
          }`}
        >
          Continuar
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
