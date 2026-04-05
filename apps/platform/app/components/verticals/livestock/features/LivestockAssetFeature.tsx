'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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

import { trpc } from '@/lib/trpc'
import { Skeleton } from '@/app/components/ui/Skeleton'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LivestockAssetFeature({ workspace, roleId }: { workspace: any, roleId: string }) {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [searchQuery, setSearchQuery] = useState('')

  const { data: realAssets, isLoading } = trpc.assets.list.useQuery()
  const { data: realFacilities } = trpc.facilities.list.useQuery()

  const facilityLookup = React.useMemo(() => {
    const map: Record<string, string> = {}
    realFacilities?.forEach(f => {
      map[f.id] = f.name
    })
    return map
  }, [realFacilities])
  
  const formattedAssets = realAssets?.filter(a => a.type === 'AnimalAsset' || a.verticalId === 'livestock').map(asset => {
    const d = asset.metadata as any;
    return {
      id: d?.externalId || asset.id.slice(0, 10),
      category: d?.initialState?.breed || 'Sin Especificar',
      weight: d?.initialState?.weight ? `${d.initialState.weight} kg` : '--',
      age: d?.initialState?.dateOfBirth ? d.initialState.dateOfBirth : '--',
      status: asset.status,
      facility: d?.facilityId ? (facilityLookup[d.facilityId] || d.facilityId.slice(0, 8)) : 'En tránsito'
    }
  }) || []

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
           
           <Link href={`/w/${workspace?.id}/roles/${roleId}/origination`} className="h-10 ml-2 px-5 rounded-full bg-primary hover:bg-primary-hover text-white font-medium text-sm transition-colors flex items-center gap-2 shadow-sm active:scale-95">
              <IconPlus size={18} stroke={2.5} />
              <span>Alta Individual</span>
           </Link>
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
                 {isLoading && (
                    <tr>
                       <td colSpan={6} className="px-6 py-6">
                         <Skeleton className="h-10 w-full" />
                       </td>
                    </tr>
                 )}
                 {formattedAssets.map(asset => (
                    <tr 
                       key={asset.id} 
                       className="hover:bg-bg-subtle/40 transition-colors cursor-pointer group"
                       onClick={() => router.push(`/w/${workspace.id}/roles/${roleId}/asset-passport?assetId=${asset.id}`)}
                    >
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
                             asset.status === 'ACTIVE' ? 'bg-success/10 text-success' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {asset.status}
                          </span>
                       </td>
                    </tr>
                 ))}
                 {!isLoading && formattedAssets.length === 0 && (
                    <tr>
                       <td colSpan={6} className="px-6 py-12 text-center text-text-muted">
                          No se encontraron animales registrados. Registra tu primer animal en Nacimientos y Altas.
                       </td>
                    </tr>
                 )}
              </tbody>
           </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
           {isLoading && <Skeleton className="h-[200px] rounded-xl w-full" />}
           {formattedAssets.map(asset => (
              <div 
                 key={asset.id} 
                 className="bg-surface border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between h-[200px]"
                 onClick={() => router.push(`/w/${workspace.id}/roles/${roleId}/asset-passport?assetId=${asset.id}`)}
              >
                 <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 bg-primary/10 text-primary px-2 py-1 rounded font-mono text-xs font-bold">
                       <IconBox size={14} />
                       {asset.id}
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-full ${
                       asset.status === 'ACTIVE' ? 'bg-success/10 text-success' : 'bg-amber-100 text-amber-700'
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
