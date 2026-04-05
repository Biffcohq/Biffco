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
           <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-1">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-bg-subtle text-text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'}`}
              >
                 <IconList size={18} />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-bg-subtle text-text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'}`}
              >
                 <IconLayoutGrid size={18} />
              </button>
           </div>
           
           <button className="h-9 px-3 rounded-lg bg-surface border border-border text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors flex items-center gap-2 shadow-sm">
              <IconMapPins size={16} />
              <span className="hidden sm:inline">Ver Mapa Global</span>
           </button>
           <button className="h-9 px-3 rounded-lg bg-surface border border-border text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors flex items-center gap-2 shadow-sm">
              <IconShare size={16} />
           </button>
           <button className="h-9 px-3 rounded-lg bg-surface border border-border text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors flex items-center gap-2 shadow-sm">
              <IconDownload size={16} />
              <span className="hidden leading-none sm:flex items-center gap-1">Exportar PDF <IconChevronDown size={14} className="mt-0.5 opacity-60"/></span>
           </button>
           
           <button className="h-9 ml-2 px-4 rounded-lg bg-primary hover:bg-primary-hover text-white font-medium text-sm transition-colors flex items-center gap-2 shadow-sm">
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
                 {/* Top header styling for Facility */}
                 <div className="h-24 bg-gradient-to-br from-bg-subtle to-border relative flex items-center justify-center border-b border-border">
                    <IconMap stroke={1} size={48} className="text-text-muted/30 absolute group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                       <span className="bg-surface/80 backdrop-blur border border-border font-mono text-[10px] px-2 py-1 rounded text-text-primary font-bold shadow-sm">
                          RENSPA: {fac.renspa}
                       </span>
                       <span className="bg-success/90 text-white text-[10px] px-2 py-1 rounded font-bold uppercase shadow-sm">
                          {fac.status}
                       </span>
                    </div>
                 </div>
                 
                 <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-text-primary mt-1 flex items-center gap-2">
                       <IconBuildingEstate size={20} className="text-primary"/>
                       {fac.name}
                    </h3>
                    <p className="text-sm text-text-secondary mt-1 flex items-center gap-1">
                       <IconMapPins size={14}/>
                       {fac.location}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 mt-6">
                       <div className="bg-bg-subtle rounded-lg p-3 border border-border/50">
                          <span className="block text-[10px] uppercase text-text-muted font-bold tracking-wider">Superficie</span>
                          <span className="block text-lg font-bold text-text-primary mt-0.5">{fac.area}</span>
                       </div>
                       <div className="bg-bg-subtle rounded-lg p-3 border border-border/50">
                          <span className="block text-[10px] uppercase text-text-muted font-bold tracking-wider">Zonas Asignadas</span>
                          <span className="block text-lg font-bold text-text-primary mt-0.5">{fac.zones}</span>
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
