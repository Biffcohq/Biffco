"use client"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSignupStore } from '../../stores/useSignupStore'
import { IconArrowRight, IconBuilding, IconGlobe } from '@tabler/icons-react'
import { useEffect } from 'react'

const step1Schema = z.object({
  workspaceName: z.string().min(2, "La razón social debe tener al menos 2 caracteres").max(100),
  workspaceSlug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/, "El slug solo puede contener minúsculas, números y guiones"),
  country: z.string().min(2, "Selecciona tu país de operación")
})

export function Step1Organization() {
  const { workspaceName, workspaceSlug, country, setWorkspace, nextStep } = useSignupStore()
  
  const form = useForm<z.infer<typeof step1Schema>>({
    resolver: zodResolver(step1Schema),
    defaultValues: { workspaceName, workspaceSlug, country }
  })

  // Autofill slug based on name
  const currentName = form.watch("workspaceName")
  const currentSlug = form.watch("workspaceSlug")
  useEffect(() => {
    if (currentName && (!currentSlug || currentSlug === currentName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))) {
      const genned = currentName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      form.setValue("workspaceSlug", genned)
    }
  }, [currentName, form])

  const onSubmit = (data: z.infer<typeof step1Schema>) => {
    setWorkspace(data)
    nextStep()
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-navy mb-1">
          <IconBuilding size={28} stroke={1.5} className="text-primary" /> 
          Configura tu Espacio
        </h2>
        <p className="text-text-secondary text-sm">
          Este será el entorno digital de tu corporación donde almacenarás todas las operaciones irrefutables.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-text-primary">Razón Social</label>
            <input 
              {...form.register("workspaceName")}
              className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-text-primary"
              placeholder="Ej: AgroGanadera S.A."
            />
            {form.formState.errors.workspaceName && <span className="text-xs text-error mt-1 block">{form.formState.errors.workspaceName.message}</span>}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 text-text-primary">Identificador Único (Slug)</label>
              <div className="flex items-center text-sm group">
                <span className="h-10 px-3 bg-surface-raised border border-r-0 border-border rounded-l-md flex items-center text-text-muted font-mono transition-colors group-focus-within:border-primary">
                  biffco.co/
                </span>
                <input 
                  {...form.register("workspaceSlug")}
                  className="flex-1 h-10 px-3 rounded-r-md bg-surface border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-text-primary font-mono text-sm"
                  placeholder="agro-ganadera"
                />
              </div>
              {form.formState.errors.workspaceSlug && <span className="text-xs text-error mt-1 block">{form.formState.errors.workspaceSlug.message}</span>}
            </div>

            <div className="sm:w-1/3">
              <label className="block text-sm font-medium mb-1 text-text-primary">País Sede</label>
              <div className="relative">
                <IconGlobe size={16} stroke={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <select 
                  {...form.register("country")}
                  className="h-10 w-full rounded-md border border-border bg-surface pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-text-primary appearance-none"
                >
                  <option value="AR">Argentina</option>
                  <option value="BR">Brasil</option>
                  <option value="UY">Uruguay</option>
                  <option value="CO">Colombia</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button 
            type="submit" 
            className="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 active:scale-95 bg-primary hover:bg-primary-hover text-white h-10 px-4 text-sm"
          >
            Siguiente Paso
            <IconArrowRight size={16} stroke={2} />
          </button>
        </div>
      </form>
    </div>
  )
}
