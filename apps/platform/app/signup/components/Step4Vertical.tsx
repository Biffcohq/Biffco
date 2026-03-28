import { useSignupStore } from '../../stores/useSignupStore'
import { trpc } from '../../../lib/trpc'
import { IconArrowLeft, IconArrowRight, IconLayersLinked, IconBoxMargin, IconCircleCheckFilled, IconLoader2, IconAlertCircle } from '@tabler/icons-react'

export function Step4Vertical() {
  const store = useSignupStore()
  const { data: verticals, isLoading, isError } = trpc.verticals.list.useQuery()

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="text-3xl font-bold flex items-center gap-2 text-navy mb-2">
          Industry Vertical
        </h2>
        <p className="text-text-secondary text-base">
          BIFFCO will load specific compliance rules (e.g. EUDR) and cryptographic schemas tailored to your supply chain.
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto mb-4 pr-2">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-10 opacity-60">
            <IconLoader2 size={32} className="animate-spin text-primary mb-2" />
            <p className="text-sm font-medium text-text-muted">Loading industry models...</p>
          </div>
        )}
        
        {isError && (
          <div className="p-4 bg-error-subtle text-error rounded-md text-sm font-medium border border-error/20 flex gap-2 items-center">
            <IconAlertCircle size={18} className="shrink-0" />
            Failed to load vertical engines. Please ensure backend is running.
          </div>
        )}

        {verticals?.map((v: any) => {
          const isSelected = store.verticalId === v.id
          
          return (
            <button
              key={v.id}
              onClick={() => store.setVertical(v.id)}
              className={`w-full text-left p-4 rounded-xl border flex gap-4 transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/40 relative group ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20 bg-primary-subtle border-primary-hover shadow-primary/10' 
                  : 'border-border bg-surface hover:border-border-strong hover:shadow-sm'
              }`}
            >
              <div className={`p-2.5 rounded-lg shrink-0 transition-colors ${isSelected ? 'bg-primary text-white shadow-sm' : 'bg-surface-raised border border-border text-text-muted group-hover:text-text-primary'}`}>
                <IconBoxMargin size={24} stroke={1.5} />
              </div>
              <div className="flex-1 mt-0.5">
                <h3 className={`font-bold text-lg leading-none mb-1.5 ${isSelected ? 'text-primary' : 'text-text-primary'}`}>
                  {v.name}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed opacity-90 pr-6">
                  Rules: {v.complianceFrameworks?.map((x: string) => x.toUpperCase()).join(', ')} • 
                  Traceability for {v.assetLabel} based on {v.geoRequirements ? 'geospatial' : 'cryptographic'} parameters.
                </p>
              </div>
              {isSelected && (
                <IconCircleCheckFilled className="absolute top-4 right-4 text-primary w-5 h-5 animate-in zoom-in duration-200" />
              )}
            </button>
          )
        })}
      </div>

      <div className="flex justify-between items-center mt-auto pt-6 border-t border-border">
        <button 
          onClick={store.prevStep}
          className="flex items-center justify-center gap-2 w-32 h-11 bg-surface text-text-primary border border-border hover:bg-surface-raised active:scale-95 rounded-full font-bold transition-all duration-200"
        >
          <IconArrowLeft size={18} stroke={2} /> Back
        </button>

        <button 
          onClick={store.nextStep}
          disabled={!store.verticalId}
          className="flex items-center justify-center gap-2 w-48 h-11 bg-primary text-white hover:bg-primary-hover active:scale-95 disabled:opacity-50 disabled:active:scale-100 rounded-full font-bold transition-all duration-200"
        >
          Continue <IconArrowRight size={18} stroke={2.5}/>
        </button>
      </div>
    </div>
  )
}
