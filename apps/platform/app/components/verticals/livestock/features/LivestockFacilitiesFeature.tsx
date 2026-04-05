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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LivestockFacilitiesFeature({ workspace, roleId }: { workspace: any, roleId: string }) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid')
  const [searchQuery, setSearchQuery] = useState('')

  const MOCK_FACILITIES = [
    { id: 'FAC-991', renspa: '01.023.0.00192/01', name: 'La Josefina', location: 'Buenos Aires, ARG', zones: 12, area: '450 ha', status: 'Habilitado' },
    { id: 'FAC-992', renspa: '01.023.0.00412/03', name: 'El Ombú', location: 'Santa Fe, ARG', zones: 4, area: '120 ha', status: 'Habilitado' }
  ]

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
           
           <button className="h-10 ml-2 px-5 rounded-full bg-primary hover:bg-primary-hover text-white font-medium text-sm transition-colors flex items-center gap-2 shadow-sm active:scale-95">
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
                 {MOCK_FACILITIES.map(fac => (
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
              </tbody>
           </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           {MOCK_FACILITIES.map(fac => (
              <div key={fac.id} className="bg-surface border border-border rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col overflow-hidden group">
                 <div className="bg-bg-subtle border-b border-border px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2 font-mono text-xs font-bold text-text-secondary">
                       <IconBuildingEstate size={14} />
                       {fac.renspa}
                    </div>
                    <span className="text-[10px] uppercase font-bold text-success flex items-center gap-1 bg-success/10 px-2 py-0.5 rounded-full border border-success/20">
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
    </div>
  )
}
