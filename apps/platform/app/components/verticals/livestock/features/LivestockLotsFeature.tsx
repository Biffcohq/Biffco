'use client'

import React, { useState } from 'react'
import {
  IconSearch,
  IconFilter,
  IconLayoutGrid,
  IconList,
  IconDownload,
  IconPrinter,
  IconShare,
  IconPlus,
  IconPackages,
  IconChevronDown,
  IconLocation
} from '@tabler/icons-react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LivestockLotsFeature({ workspace, roleId }: { workspace: any, roleId: string }) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [searchQuery, setSearchQuery] = useState('')

  const MOCK_LOTS = [
    { id: 'LOT-A1', name: 'Tropa Destete 2026', headCount: 140, avgWeight: '180 kg', destination: 'Recría', facility: 'La Josefina' },
    { id: 'LOT-B2', name: 'Lote Novillos P1', headCount: 85, avgWeight: '410 kg', destination: 'Mercado', facility: 'El Ombú' },
    { id: 'LOT-C3', name: 'Vaquillonas Repo', headCount: 60, avgWeight: '250 kg', destination: 'Inseminación', facility: 'La Josefina' }
  ]

  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500 pb-12 w-full">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            Lotes y Tropas
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Gestor de agrupaciones de hacienda para {workspace?.name}.
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
              <span>Formar Lote / Tropa</span>
           </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
             type="text" 
             placeholder="Buscar lote por nombre o ID..." 
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
                    <th className="px-6 py-4 font-semibold">Identificador</th>
                    <th className="px-6 py-4 font-semibold">Nombre Tropa</th>
                    <th className="px-6 py-4 font-semibold text-right cursor-pointer hover:text-text-primary">Cabezas <IconChevronDown size={14} className="inline mb-0.5"/></th>
                    <th className="px-6 py-4 font-semibold text-right">Peso Prom.</th>
                    <th className="px-6 py-4 font-semibold">Destino Operativo</th>
                    <th className="px-6 py-4 font-semibold">Ubicación</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-border">
                 {MOCK_LOTS.map(lot => (
                    <tr key={lot.id} className="hover:bg-bg-subtle/40 transition-colors cursor-pointer group">
                       <td className="px-6 py-4 font-mono font-medium text-primary group-hover:underline">
                          <div className="flex items-center gap-2">
                             <IconPackages size={16} className="text-text-muted" />
                             {lot.id}
                          </div>
                       </td>
                       <td className="px-6 py-4 text-text-primary font-medium">{lot.name}</td>
                       <td className="px-6 py-4 text-right font-bold text-text-primary">{lot.headCount}</td>
                       <td className="px-6 py-4 text-right text-text-secondary">{lot.avgWeight}</td>
                       <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-bg-subtle text-xs rounded-md text-text-secondary border border-border">
                             {lot.destination}
                          </span>
                       </td>
                       <td className="px-6 py-4 text-text-secondary flex items-center gap-1">
                          <IconLocation size={14}/> {lot.facility}
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
           {MOCK_LOTS.map(lot => (
              <div key={lot.id} className="bg-surface border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col overflow-hidden">
                 <div className="bg-bg-subtle border-b border-border px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2 font-mono text-xs font-bold text-text-secondary">
                       <IconPackages size={14} />
                       {lot.id}
                    </div>
                    <span className="text-[10px] uppercase font-bold text-text-muted flex items-center gap-1">
                       <IconLocation size={12}/>
                       {lot.facility}
                    </span>
                 </div>
                 <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-text-primary">{lot.name}</h3>
                    <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">Destino: {lot.destination}</p>
                    
                    <div className="flex justify-between mt-6 bg-surface-raised rounded-lg p-3 border border-border">
                       <div className="text-center flex-1 border-r border-border">
                          <span className="block text-2xl font-bold text-text-primary leading-none">{lot.headCount}</span>
                          <span className="text-[10px] uppercase text-text-muted mt-1 font-semibold tracking-wider block">Cabezas</span>
                       </div>
                       <div className="text-center flex-1">
                          <span className="block text-xl font-bold text-text-secondary leading-none mt-1">{lot.avgWeight}</span>
                          <span className="text-[10px] uppercase text-text-muted mt-1 font-semibold tracking-wider block">Peso Prom</span>
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
