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
    let loc = f.location as any
    if (typeof loc === 'string') {
       try { loc = JSON.parse(loc) } catch (e) {}
    }
    return {
      id: f.id,
      renspa: loc?.renspa || loc?.properties?.renspa || 'S/N',
      name: f.name,
      location: loc?.address || loc?.properties?.address || 'Sin especificar',
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
              <div key={fac.id} className="bg-surface border border-border rounded-xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer flex flex-col overflow-hidden group relative">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-0 transition-opacity opacity-0 group-hover:opacity-100" />
                 
                 <div className="px-5 py-4 flex justify-between items-start z-10 border-b border-border/40">
                     <div className="flex flex-col gap-1">
                         <span className="text-[10px] uppercase font-bold text-primary/70 tracking-wider flex items-center gap-1.5">
                             <IconBuildingEstate size={14} />
                             RENSPA: {fac.renspa}
                         </span>
                         <h3 className="text-lg font-bold text-text-primary mt-1">
                             {fac.name}
                         </h3>
                         <p className="text-sm text-text-secondary flex items-center gap-1 mt-0.5">
                             <IconMapPins size={14} className="text-text-muted"/>
                             {fac.location}
                         </p>
                     </div>
                     <span className="text-[10px] uppercase font-bold text-success flex items-center justify-center gap-1 bg-success/10 px-2 py-1 rounded-md border border-success/20 tracking-wider shrink-0 mt-1">
                         {fac.status}
                     </span>
                 </div>
                 
                 <div className="px-5 py-4 flex gap-6 z-10 bg-bg-subtle/30">
                     <div className="flex flex-col">
                         <span className="text-[10px] uppercase text-text-muted font-bold tracking-wider">Superficie</span>
                         <span className="text-sm font-semibold text-text-primary font-mono mt-0.5">{fac.area}</span>
                     </div>
                     <div className="w-px bg-border/60"></div>
                     <div className="flex flex-col">
                         <span className="text-[10px] uppercase text-text-muted font-bold tracking-wider">Zonas</span>
                         <span className="text-sm font-semibold text-text-primary font-mono mt-0.5">{fac.zones}</span>
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
