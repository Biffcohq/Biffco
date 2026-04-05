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
  IconBox,
  IconChevronDown
} from '@tabler/icons-react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LivestockAssetFeature({ workspace, roleId }: { workspace: any, roleId: string }) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [searchQuery, setSearchQuery] = useState('')

  // Placeholder Data
  const MOCK_ASSETS = [
    { id: 'EID-908123', category: 'Novillo', weight: '340 kg', age: '14 meses', status: 'Activo', facility: 'La Josefina' },
    { id: 'EID-908124', category: 'Vaca', weight: '450 kg', age: '36 meses', status: 'Activo', facility: 'La Josefina' },
    { id: 'EID-908125', category: 'Ternero', weight: '120 kg', age: '5 meses', status: 'Cuarentena', facility: 'El Ombú' }
  ]

  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500 pb-12 w-full">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            Rodeo
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Inventario individual de cabezas activas en {workspace?.name}.
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
              <IconShare size={16} />
              <span className="hidden sm:inline">Compartir</span>
           </button>
           <button className="h-9 px-3 rounded-lg bg-surface border border-border text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors flex items-center gap-2 shadow-sm">
              <IconPrinter size={16} />
            </button>
           <button className="h-9 px-3 rounded-lg bg-surface border border-border text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors flex items-center gap-2 shadow-sm">
              <IconDownload size={16} />
              <span className="hidden leading-none sm:flex items-center gap-1">Exportar <IconChevronDown size={14} className="mt-0.5 opacity-60"/></span>
           </button>
           
           <button className="h-9 ml-2 px-4 rounded-lg bg-primary hover:bg-primary-hover text-white font-medium text-sm transition-colors flex items-center gap-2 shadow-sm">
              <IconPlus size={18} stroke={2.5} />
              <span>Alta Individual</span>
           </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
             type="text" 
             placeholder="Buscar por EID, caravana o lote..." 
             className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-text-muted"
             value={searchQuery}
             onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="h-10 px-4 rounded-lg bg-surface border border-border font-medium text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center gap-2 shadow-sm whitespace-nowrap">
          <IconFilter size={18} />
          <span>Filtros Avanzados</span>
        </button>
      </div>

      {/* Main Content Area */}
      {viewMode === 'list' ? (
        <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden min-h-[400px]">
           <table className="w-full text-left text-sm">
              <thead className="bg-bg-subtle border-b border-border text-xs uppercase tracking-wider text-text-secondary">
                 <tr>
                    <th className="px-6 py-4 font-semibold">Identificador</th>
                    <th className="px-6 py-4 font-semibold cursor-pointer hover:text-text-primary flex items-center gap-1">Categoría <IconChevronDown size={14}/></th>
                    <th className="px-6 py-4 font-semibold">Peso Act.</th>
                    <th className="px-6 py-4 font-semibold">Edad</th>
                    <th className="px-6 py-4 font-semibold">Establecimiento</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-border">
                 {MOCK_ASSETS.map(asset => (
                    <tr key={asset.id} className="hover:bg-bg-subtle/40 transition-colors cursor-pointer group">
                       <td className="px-6 py-4 font-mono font-medium text-primary group-hover:underline">
                          <div className="flex items-center gap-2">
                             <IconBox size={16} className="text-text-muted" />
                             {asset.id}
                          </div>
                       </td>
                       <td className="px-6 py-4 text-text-primary">{asset.category}</td>
                       <td className="px-6 py-4 text-text-secondary">{asset.weight}</td>
                       <td className="px-6 py-4 text-text-secondary">{asset.age}</td>
                       <td className="px-6 py-4 text-text-secondary">{asset.facility}</td>
                       <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                             asset.status === 'Activo' ? 'bg-success/10 text-success' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {asset.status}
                          </span>
                       </td>
                    </tr>
                 ))}
                 {MOCK_ASSETS.length === 0 && (
                    <tr>
                       <td colSpan={6} className="px-6 py-12 text-center text-text-muted">
                          No se encontraron animales.
                       </td>
                    </tr>
                 )}
              </tbody>
           </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
           {MOCK_ASSETS.map(asset => (
              <div key={asset.id} className="bg-surface border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between h-[200px]">
                 <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 bg-primary/10 text-primary px-2 py-1 rounded font-mono text-xs font-bold">
                       <IconBox size={14} />
                       {asset.id}
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-full ${
                       asset.status === 'Activo' ? 'bg-success/10 text-success' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {asset.status}
                    </span>
                 </div>
                 <div className="mt-auto">
                    <h3 className="text-lg font-bold text-text-primary leading-tight">{asset.category}</h3>
                    <div className="flex gap-4 mt-2 text-sm text-text-secondary">
                       <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Peso</span>
                          <span className="font-medium">{asset.weight}</span>
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Locación</span>
                          <span className="font-medium truncate max-w-[80px]">{asset.facility}</span>
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
