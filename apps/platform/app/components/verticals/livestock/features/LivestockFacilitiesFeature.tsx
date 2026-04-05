'use client'

import React, { useState } from 'react'
import {
  IconSearch,
  IconLayoutGrid,
  IconList,
  IconDownload,
  IconPrinter,
  IconShare,
  IconPlus,
  IconBuildingEstate,
  IconChevronDown,
  IconMap,
  IconMapPins
} from '@tabler/icons-react'

import { trpc } from '@/lib/trpc'
import { Modal, ModalContent, ModalHeader, ModalTitle, Input, Button, toast } from '@biffco/ui'
import { useForm } from 'react-hook-form'
import { Skeleton } from '@/app/components/ui/Skeleton'

type FacilityForm = {
  name: string
  renspa: string
  location: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LivestockFacilitiesFeature({ workspace, roleId }: { workspace: any, roleId: string }) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const utils = trpc.useUtils()
  const { data: realFacilities, isLoading } = trpc.facilities.list.useQuery()
  
  const mutation = trpc.facilities.create.useMutation({
    onSuccess: () => {
      toast.success('Establecimiento registrado con éxito')
      utils.facilities.list.invalidate()
      setIsModalOpen(false)
    },
    onError: (e) => toast.error('Error al registrar: ' + e.message)
  })

  const { register, handleSubmit, reset } = useForm<FacilityForm>()

  const onSubmit = (data: FacilityForm) => {
    mutation.mutate({
      name: data.name,
      type: 'Farm', // Fixed type for Biffco
      licenseNumber: data.renspa,
      address: data.location,
      polygon: undefined // omit for now
    })
  }

  const facilities = realFacilities?.map(f => {
    const loc = f.location as any
    return {
      id: f.id,
      renspa: loc?.renspa || 'S/N',
      name: f.name,
      location: loc?.address || 'Sin especificar',
      zones: 0,
      area: '--',
      status: 'Habilitado'
    }
  }).filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.renspa.toLowerCase().includes(searchQuery.toLowerCase())) || []

  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500 pb-12 w-full">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            Establecimientos Registrados
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Gestión de predios, RENSPAs y geocercas base para {workspace?.name}.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
           <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-1 mr-1 shadow-xs">
              <button 
                onClick={() => setViewMode('list')}
                className={`size-8 flex items-center justify-center rounded transition-colors ${viewMode === 'list' ? 'bg-bg-subtle text-text-primary shadow-xs' : 'text-text-muted hover:text-text-primary hover:bg-surface-overlay'}`}
              >
                 <IconList size={18} />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`size-8 flex items-center justify-center rounded transition-colors ${viewMode === 'grid' ? 'bg-bg-subtle text-text-primary shadow-xs' : 'text-text-muted hover:text-text-primary hover:bg-surface-overlay'}`}
              >
                 <IconLayoutGrid size={18} />
              </button>
           </div>
           
           <button className="h-10 px-4 rounded-lg bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-surface-overlay transition-colors flex items-center justify-center shadow-xs" title="Ver Mapa Global">
              <IconMapPins size={18} className="mr-2" />
              <span className="text-sm font-medium">Global Map</span>
           </button>

           <button className="size-10 rounded-lg bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-surface-overlay transition-colors flex items-center justify-center shadow-xs" title="Compartir">
              <IconShare size={18} />
           </button>
           <button className="size-10 rounded-lg bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-surface-overlay transition-colors flex items-center justify-center shadow-xs" title="Imprimir">
              <IconPrinter size={18} />
            </button>
           <button className="size-10 rounded-lg bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-surface-overlay transition-colors flex items-center justify-center shadow-xs" title="Exportar">
              <IconDownload size={18} />
           </button>
           
           <button onClick={() => { reset(); setIsModalOpen(true); }} className="h-10 ml-2 px-5 rounded-full bg-primary hover:bg-primary-hover text-white font-medium text-sm transition-colors flex items-center gap-2 shadow-sm active:scale-95">
              <IconPlus size={18} stroke={2.5} />
              <span>Nuevo Establecimiento</span>
           </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
             type="text" 
             placeholder="Buscar por nombre o RENSPA..." 
             className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-text-muted"
             value={searchQuery}
             onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'list' ? (
        <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden min-h-[400px]">
           <table className="w-full text-left text-sm">
              <thead className="bg-bg-subtle border-b border-border text-xs uppercase tracking-wider text-text-secondary">
                 <tr>
                    <th className="px-6 py-4 font-semibold">RENSPA / Doc</th>
                    <th className="px-6 py-4 font-semibold">Nombre del Predio</th>
                    <th className="px-6 py-4 font-semibold">Ubicación Geográfica</th>
                    <th className="px-6 py-4 font-semibold text-right">Zonas (Parcelas)</th>
                    <th className="px-6 py-4 font-semibold text-right">Superficie Declarada</th>
                    <th className="px-6 py-4 font-semibold">Estado</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-border">
                 {isLoading && <tr><td colSpan={6} className="p-4"><Skeleton className="w-full h-10" /></td></tr>}
                 {facilities.map(fac => (
                    <tr key={fac.id} className="hover:bg-bg-subtle/40 transition-colors cursor-pointer group">
                       <td className="px-6 py-4 font-mono font-medium text-primary group-hover:underline">
                          {fac.renspa}
                       </td>
                       <td className="px-6 py-4 font-bold text-text-primary flex items-center gap-2">
                           <IconBuildingEstate size={16} className="text-text-muted" />
                           {fac.name}
                       </td>
                       <td className="px-6 py-4 text-text-secondary">{fac.location}</td>
                       <td className="px-6 py-4 text-right font-medium">{fac.zones}</td>
                       <td className="px-6 py-4 text-right text-text-secondary">{fac.area}</td>
                       <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full font-bold">
                             {fac.status}
                          </span>
                       </td>
                    </tr>
                 ))}
                 {!isLoading && facilities.length === 0 && (
                   <tr><td colSpan={6} className="text-center p-8 text-text-muted">No tienes establecimientos registrados. Haz click en Nuevo Establecimiento para comenzar.</td></tr>
                 )}
              </tbody>
           </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           {isLoading && <Skeleton className="w-full h-40 rounded-xl" />}
           {facilities.map(fac => (
              <div key={fac.id} className="bg-surface border border-border rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col overflow-hidden group">
                 <div className="bg-bg-subtle border-b border-border px-5 py-3.5 flex justify-between items-center">
                    <div className="flex items-center gap-2 font-mono text-sm font-bold text-text-secondary">
                       <IconBuildingEstate size={18} className="text-primary/70" />
                       {fac.renspa}
                    </div>
                    <span className="text-[10px] uppercase font-bold text-success flex items-center justify-center gap-1 bg-success/10 px-2.5 py-1 rounded-full border border-success/20 tracking-wider">
                       {fac.status}
                    </span>
                 </div>
                 
                 <div className="p-5 flex-1 flex flex-col relative overflow-hidden">
                    <IconMap stroke={1} size={120} className="text-text-muted/5 absolute -bottom-4 -right-4 group-hover:scale-110 transition-transform duration-500" />
                    
                    <div className="relative z-10">
                       <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                          {fac.name}
                       </h3>
                       <p className="text-sm text-text-secondary mt-1 flex items-center gap-1">
                          <IconMapPins size={14}/>
                          {fac.location}
                       </p>
                       
                       <div className="grid grid-cols-2 gap-3 mt-6">
                          <div className="bg-surface-raised rounded-lg p-3 border border-border">
                             <span className="block text-[10px] uppercase text-text-muted font-bold tracking-wider">Superficie</span>
                             <span className="block text-lg font-bold text-text-primary mt-0.5">{fac.area}</span>
                          </div>
                          <div className="bg-surface-raised rounded-lg p-3 border border-border">
                             <span className="block text-[10px] uppercase text-text-muted font-bold tracking-wider">Zonas Asignadas</span>
                             <span className="block text-lg font-bold text-text-primary mt-0.5">{fac.zones}</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      )}

      {/* Modal de Creación */}
      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent>
          <ModalHeader>
            {/* @ts-expect-error title type */}
            <ModalTitle>Alta de Establecimiento</ModalTitle>
          </ModalHeader>
          <form onSubmit={(e) => { void handleSubmit(onSubmit)(e) }} className="flex flex-col gap-4 mt-2">
             <div className="flex flex-col gap-2">
               <label className="text-sm font-medium text-text-primary">Nombre del Predio</label>
               <Input {...register('name')} placeholder="Ej: La Josefina" required />
             </div>
             <div className="flex flex-col gap-2">
               <label className="text-sm font-medium text-text-primary">Nº RENSPA o Licencia</label>
               <Input {...register('renspa')} placeholder="01.023.0.00192/01" required />
             </div>
             <div className="flex flex-col gap-2">
               <label className="text-sm font-medium text-text-primary">Ubicación</label>
               <Input {...register('location')} placeholder="Provincia, País" required />
             </div>
             <div className="flex justify-end gap-3 mt-4">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? 'Guardando...' : 'Crear Predio'}
                </Button>
             </div>
          </form>
        </ModalContent>
      </Modal>
    </div>
  )
}
