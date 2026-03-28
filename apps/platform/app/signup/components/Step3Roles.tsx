"use client"
import { useSignupStore } from '../../stores/useSignupStore'
import { trpc } from '../../../lib/trpc'
import { IconArrowLeft, IconArrowRight, IconUserCheck, IconCheckbox, IconSquare } from '@tabler/icons-react'

export function Step3Roles() {
  const { verticalId, initialRoles, setRoles, nextStep, prevStep } = useSignupStore()
  const { data: verticals } = trpc.verticals.list.useQuery()
  
  const selectedVertical = verticals?.find((v: any) => v.id === verticalId)
  
  const toggleRole = (roleId: string) => {
    if (initialRoles.includes(roleId)) {
      setRoles(initialRoles.filter(r => r !== roleId))
    } else {
      setRoles([...initialRoles, roleId])
    }
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-navy mb-1">
          <IconUserCheck size={28} stroke={1.5} className="text-primary" /> 
          Define tus Capacidades
        </h2>
        <p className="text-text-secondary text-sm">
          Como Root, seleccionarás de qué partes de la cadena de valor participas bajo la industria <strong>{selectedVertical?.name || 'seleccionada'}</strong>.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto mb-6 pr-2">
        {selectedVertical && (selectedVertical as any).actorTypes ? (
          <div className="grid grid-cols-1 gap-3">
            {((selectedVertical as any).actorTypes || []).map((actor: any) => {
              const isSelected = initialRoles.includes(actor.id)
              return (
              <button
                key={actor.id}
                onClick={() => toggleRole(actor.id)}
                className={`flex items-start text-left gap-4 p-4 rounded-xl border transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-primary/30 cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-primary-subtle shadow-sm'
                    : 'border-border bg-surface hover:border-border-strong hover:bg-surface-raised shadow-sm hover:shadow'
                }`}
              >
                <div className={`mt-0.5 rounded-md transition-colors ${isSelected ? 'text-primary' : 'text-text-muted hover:text-navy'}`}>
                  {isSelected ? (
                    <IconCheckbox size={24} stroke={2} className="text-primary" />
                  ) : (
                    <IconSquare size={24} stroke={1.5} />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold text-base ${isSelected ? 'text-primary' : 'text-text-primary'}`}>
                    {actor.name}
                  </h4>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    Podrás emitir un total de {(selectedVertical as any).eventCatalog?.length || 0} tipos de eventos pre-codificados.
                  </p>
                </div>
              </button>
            )})}
          </div>
        ) : (
          <div className="text-center py-10 opacity-60 text-sm font-medium text-text-secondary">Cargando roles...</div>
        )}
      </div>

      <div className="flex justify-between items-center mt-auto pt-4 border-t border-border">
        <button 
          onClick={prevStep}
          className="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 active:scale-95 bg-surface text-text-primary border border-border hover:bg-surface-raised h-10 px-4 text-sm"
        >
          <IconArrowLeft size={16} stroke={2} /> Atrás
        </button>

        <button 
          onClick={nextStep}
          disabled={initialRoles.length === 0}
          className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 active:scale-95 h-10 px-4 text-sm ${
            initialRoles.length > 0
              ? 'bg-primary hover:bg-primary-hover text-white' 
              : 'bg-surface-raised border border-border text-text-muted cursor-not-allowed shadow-none'
          }`}
        >
          Continuar
          <IconArrowRight size={16} stroke={2} />
        </button>
      </div>
    </div>
  )
}
