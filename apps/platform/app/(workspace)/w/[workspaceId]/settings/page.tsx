"use client"
import React, { useState, useEffect } from 'react'
import { trpc } from '@/lib/trpc'
import { Button, toast } from '@biffco/ui'
import { IconBuildingStore, IconTruck, IconBox, IconVaccine } from '@tabler/icons-react'

const AVAILABLE_ROLES = [
  { id: 'PRODUCER', label: 'Productor (Estancia)', icon: IconBox, desc: 'Cría y origena animales' },
  { id: 'TRANSPORTER', label: 'Transportista', icon: IconTruck, desc: 'Mueve tropas a través de rutas' },
  { id: 'PROCESSOR', label: 'Procesador (Frigorífico)', icon: IconBuildingStore, desc: 'Recibe y faena el ganado' },
  { id: 'VET', label: 'Veterinario', icon: IconVaccine, desc: 'Auditor y emisor de vacunas' },
]

export default function WorkspaceSettingsPage() {
  const { data: workspace, isLoading } = trpc.workspaces.getProfile.useQuery()
  const utils = trpc.useUtils()
  
  const [alias, setAlias] = useState('')
  const [roles, setRoles] = useState<string[]>([])

  useEffect(() => {
    if (workspace) {
      setAlias(workspace.alias || '')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setRoles((workspace as any).roles || ['PRODUCER'])
    }
  }, [workspace])

  const mutation = trpc.workspaces.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Ajustes de Cadena guardados. Tu panel se actualizará.")
      utils.workspaces.getProfile.invalidate()
      window.location.reload() // Forzar reseteo de Sidebar
    },
    onError: (e) => toast.error(e.message)
  })

  const handleSave = () => {
    let cleanAlias = alias.trim().toUpperCase()
    mutation.mutate({ 
      alias: cleanAlias === '' ? null : cleanAlias, 
      roles 
    })
  }

  const toggleRole = (r: string) => {
    if (roles.includes(r)) {
      if (roles.length === 1) return toast.error("Debe existir al menos 1 rol en el Workspace")
      setRoles(roles.filter(x => x !== r))
    } else {
      setRoles([...roles, r])
    }
  }

  return (
    <div className="w-full max-w-2xl flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold text-text-primary">Configuración de la Empresa B2B</h1>
        <p className="text-text-secondary text-sm">
           Gestiona tu identidad pública y los roles que cumples en la cadena de Biffco.
        </p>
      </div>

      {isLoading ? <div className="p-10 border border-border rounded-xl bg-surface animate-pulse" /> : (
        <div className="bg-surface border border-border rounded-xl p-6 flex flex-col gap-8">
          
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-lg">Tu Biffco Alias (CBU Logístico)</h3>
            <p className="text-sm text-text-secondary">En lugar de compartir el identificador <code>{workspace?.id}</code> para que te envíen transferencias, puedes reclamar un nombre único global.</p>
            <div className="flex items-center gap-2">
              <input 
                value={alias}
                onChange={e => setAlias(e.target.value.toUpperCase())}
                placeholder="EJ: EXPRESO-ROBERTO"
                className="w-full max-w-sm p-2 border border-border rounded-lg bg-bg-subtle text-sm focus:outline-primary focus:ring-1 focus:ring-primary uppercase"
              />
            </div>
            <p className="text-xs text-text-muted">Solo letras mayúsculas, números y guiones. Sin espacios.</p>
          </div>

          <hr className="border-border" />

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-lg">Roles Operacionales de la Red</h3>
            <p className="text-sm text-text-secondary">Selecciona qué tareas cumple esta organización. Tu panel lateral y permisos de firma se adaptarán a ti.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {AVAILABLE_ROLES.map(r => {
                 const isSelected = roles.includes(r.id)
                 return (
                   <div 
                     key={r.id} 
                     onClick={() => toggleRole(r.id)}
                     className={`p-3 border rounded-lg flex items-start gap-3 cursor-pointer transition-colors ${isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-text-muted'}`}
                   >
                     <div className={`mt-0.5 ${isSelected ? 'text-primary' : 'text-text-muted'}`}>
                       <r.icon size={20} />
                     </div>
                     <div className="flex flex-col">
                        <span className={`font-medium text-sm ${isSelected ? 'text-primary' : 'text-text-primary'}`}>{r.label}</span>
                        <span className="text-xs text-text-secondary leading-tight mt-1">{r.desc}</span>
                     </div>
                   </div>
                 )
              })}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border mt-4">
            <Button onClick={handleSave} disabled={mutation.isPending} className="bg-primary text-white">
              {mutation.isPending ? 'Guardando...' : 'Guardar y Aplicar Ajustes'}
            </Button>
          </div>

        </div>
      )}
    </div>
  )
}
