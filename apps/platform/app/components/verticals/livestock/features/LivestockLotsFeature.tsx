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

import { trpc } from '@/lib/trpc'
import { Skeleton } from '@/app/components/ui/Skeleton'
import LivestockLotModal from '../LivestockLotModal'
import LivestockLotDetailModal from '../LivestockLotDetailModal'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LivestockLotsFeature({ workspace, roleId }: { workspace: any, roleId: string }) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [lotIdToView, setLotIdToView] = useState<string | undefined>()

  const { data: realLots, isLoading } = trpc.assetGroups.getWithAssets.useQuery({ verticalId: 'livestock' })
  const { data: facilities } = trpc.facilities.list.useQuery()

  const facilityLookup = React.useMemo(() => {
    const lookup: Record<string, string> = {}
    facilities?.forEach(f => {
      lookup[f.id] = f.name
    })
    return lookup
  }, [facilities])

  const formattedLots = realLots?.map(lot => {
    return {
      ...lot,
      destination: (lot.metadata as any)?.purpose || 'General',
      facilityName: (lot.metadata as any)?.facilityId ? (facilityLookup[(lot.metadata as any).facilityId] || '...') : 'Regional'
    }
  }).filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.destination.toLowerCase().includes(searchQuery.toLowerCase())) || []

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
           
           <button onClick={() => setIsModalOpen(true)} className="h-10 ml-2 px-5 rounded-full bg-primary hover:bg-primary-hover text-white font-medium text-sm transition-colors flex items-center gap-2 shadow-sm active:scale-95">
              <IconPlus size={18} stroke={2.5} />
              <span>Nueva Tropa</span>
           </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
             type="text" 
             placeholder="Buscar tropa por nombre o propósito..." 
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
              <thead className="bg-bg-subtle border-b border-border text-text-muted font-medium uppercase tracking-wider text-[11px]">
                 <tr>
                    <th className="px-6 py-4">Tropa / Identificador</th>
                    <th className="px-6 py-4">Cabezas (Total)</th>
                    <th className="px-6 py-4 hidden sm:table-cell">Propósito / Destino</th>
                    <th className="px-6 py-4 hidden md:table-cell">Establecimiento</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-border">
                 {isLoading && (
                    <tr>
                       <td colSpan={4} className="p-6">
                           <div className="flex flex-col gap-3">
                              <Skeleton className="h-8 w-full rounded" />
                              <Skeleton className="h-8 w-full rounded" />
                           </div>
                       </td>
                    </tr>
                 )}
                 {formattedLots.length === 0 && !isLoading && (
                    <tr>
                       <td colSpan={4} className="text-center py-16 text-text-muted">
                          <IconPackages size={48} className="mx-auto mb-4 opacity-20" />
                          <p>No se encontraron lotes ni tropas de hacienda.</p>
                       </td>
                    </tr>
                 )}
                 {formattedLots.map(lot => (
                    <tr key={lot.id} className="hover:bg-bg-subtle/40 transition-colors cursor-pointer group" onClick={() => setLotIdToView(lot.id)}>
                       <td className="px-6 py-4 font-bold text-primary group-hover:underline">
                          <div className="flex items-center gap-3">
                             <div className="size-8 rounded-lg bg-surface border border-border flex items-center justify-center text-text-muted">
                                <IconPackages size={16} />
                             </div>
                             {lot.name}
                          </div>
                       </td>
                       <td className="px-6 py-4 font-mono font-medium text-text-primary">
                          {lot.totalActive}
                       </td>
                       <td className="px-6 py-4 hidden sm:table-cell text-text-secondary">
                          <span className="bg-bg-subtle border border-border px-2 py-1 rounded text-xs">
                             {lot.destination}
                          </span>
                       </td>
                       <td className="px-6 py-4 hidden md:table-cell font-mono text-xs text-text-muted">
                          {lot.facilityName}
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
           {isLoading && <Skeleton className="h-40 rounded-xl w-full" />}
           {formattedLots.map(lot => (
              <div key={lot.id} onClick={() => setLotIdToView(lot.id)} className="bg-surface border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between h-[180px]">
                 <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 bg-primary/10 text-primary px-2 py-1 rounded font-mono text-xs font-bold whitespace-normal">
                       <IconPackages size={14} />
                       {lot.name.slice(0, 16)}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-text-muted tracking-wider border border-border rounded px-1.5 py-0.5 whitespace-nowrap">
                       {lot.destination}
                    </div>
                 </div>
                 <div>
                    <h3 className="text-3xl font-black text-text-primary font-mono">{lot.totalActive}</h3>
                    <p className="text-sm font-medium text-text-muted">Cabezas Activas</p>
                 </div>
                 <div className="w-full flex justify-between items-center pt-3 border-t border-border/50 text-xs">
                    <span className="text-text-muted flex items-center gap-1 min-w-0" title={lot.facilityName}>
                       <IconLocation size={14} className="shrink-0" /> <span className="truncate">{lot.facilityName}</span>
                    </span>
                 </div>
              </div>
           ))}
        </div>
      )}

      {isModalOpen && (
         <LivestockLotModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            workspaceId={workspace.id} 
         />
      )}

      {!!lotIdToView && (
         <LivestockLotDetailModal
            isOpen={!!lotIdToView}
            onClose={() => setLotIdToView(undefined)}
            lotId={lotIdToView}
            workspaceId={workspace.id}
         />
      )}
    </div>
  )
}
