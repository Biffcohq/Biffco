/* eslint-disable @typescript-eslint/no-explicit-any */
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
  IconChevronDown,
  IconPackages,
  IconCheck
} from '@tabler/icons-react'

import { trpc } from '@/lib/trpc'
import { Skeleton } from '@/app/components/ui/Skeleton'
import { Button, toast } from '@biffco/ui'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LivestockAssetFeature({ workspace, roleId }: { workspace: any, roleId: string }) {
  const router = useRouter()
  const utils = trpc.useUtils()
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set())
  const [selectedLotId, setSelectedLotId] = useState<string>('')

  const { data: realAssets, isLoading } = trpc.assets.list.useQuery()
  const { data: realFacilities } = trpc.facilities.list.useQuery()
  const { data: lots } = trpc.assetGroups.getWithAssets.useQuery({ verticalId: 'livestock' })
  
  const addAssetsMutation = trpc.assetGroups.addAssets.useMutation({
    onSuccess: (data: any) => {
      toast.success(`${data.count} cabezas asignadas al lote exitosamente.`)
      setSelectedAssets(new Set())
      utils.assets.list.invalidate()
      utils.assetGroups.getWithAssets.invalidate()
    },
    onError: (err: any) => toast.error('Error al agrupar: ' + err.message)
  })

  const facilityLookup = React.useMemo(() => {
    const map: Record<string, string> = {}
    realFacilities?.forEach((f: any) => {
      map[f.id] = f.name
    })
    return map
  }, [realFacilities])

  const lotLookup = React.useMemo(() => {
    const map: Record<string, {name: string, purpose: string}> = {}
    lots?.forEach((l: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map[l.id] = { name: l.name, purpose: (l.metadata as Record<string, any>)?.purpose || 'General' }
    })
    return map
  }, [lots])
  
  const formattedAssets = realAssets?.filter((a: any) => a.type === 'AnimalAsset' || a.verticalId === 'livestock').map((asset: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d = asset.metadata as Record<string, any>;
    // Prefer explicitly mapped category, fallback to breed for legacy data
    let catText = d?.initialState?.category ? `${d.initialState.breed} - ${d.initialState.category}` : (d?.initialState?.breed || 'Sin Especificar');
    if (d?.initialState?.sex) {
      catText += ` (${d.initialState.sex})`;
    }
    return {
      id: d?.externalId || asset.id.slice(0, 10),
      realId: asset.id,
      category: catText,
      weight: d?.initialState?.weight ? `${d.initialState.weight} kg` : '--',
      age: d?.initialState?.dateOfBirth ? d.initialState.dateOfBirth : '--',
      status: asset.status,
      facility: d?.facilityId ? (facilityLookup[d.facilityId] || d.facilityId.slice(0, 8)) : 'En tránsito',
      groupId: asset.groupId,
      lotName: asset.groupId ? lotLookup[asset.groupId]?.name : null
    }
  }).filter((a: any) => 
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.lotName && a.lotName.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || []

  const toggleSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newSet = new Set(selectedAssets)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setSelectedAssets(newSet)
  }

  const toggleAll = () => {
    if (selectedAssets.size === formattedAssets.length && formattedAssets.length > 0) {
      setSelectedAssets(new Set())
    } else {
      setSelectedAssets(new Set(formattedAssets.map(a => a.realId)))
    }
  }

  const handleGroupAction = () => {
    if (!selectedLotId) {
      toast.error('Selecciona un lote de destino primero.')
      return
    }
    addAssetsMutation.mutate({
      groupId: selectedLotId,
      assetIds: Array.from(selectedAssets)
    })
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500 pb-12 w-full relative">
      
      {/* Grouping Action Bar (Floating) */}
      {selectedAssets.size > 0 && (
         <div className="sticky top-0 z-10 bg-surface border border-primary/30 shadow-lg rounded-xl p-3 mb-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-top-4">
            <div className="flex items-center gap-3">
               <div className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold font-mono">
                  {selectedAssets.size}
               </div>
               <span className="font-medium text-text-primary">cabezas seleccionadas</span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
               <select 
                 className="flex-1 sm:w-64 h-10 px-3 rounded-md border border-border bg-bg-subtle text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary"
                 value={selectedLotId}
                 onChange={(e) => setSelectedLotId(e.target.value)}
                 disabled={lots?.length === 0}
               >
                  <option value="">-- Seleccionar Tropa / Lote --</option>
                  {lots?.map((l: any) => (
                     // eslint-disable-next-line @typescript-eslint/no-explicit-any
                     <option key={l.id} value={l.id}>{l.name} ({(l.metadata as Record<string, any>)?.purpose || 'General'})</option>
                  ))}
               </select>
               <Button onClick={handleGroupAction} disabled={addAssetsMutation.isPending || lots?.length === 0}>
                  {addAssetsMutation.isPending ? 'Agrupando...' : 'Asignar Lote'}
               </Button>
            </div>
         </div>
      )}

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
                    <th className="px-4 py-4 w-12 text-center">
                       <input 
                         type="checkbox" 
                         className="rounded border-border text-primary focus:ring-primary/50 cursor-pointer size-4"
                         checked={selectedAssets.size > 0 && selectedAssets.size === formattedAssets.length}
                         ref={input => { if (input) input.indeterminate = selectedAssets.size > 0 && selectedAssets.size < formattedAssets.length }}
                         onChange={toggleAll}
                       />
                    </th>
                    <th className="px-6 py-4 font-semibold">Identificador</th>
                    <th className="px-6 py-4 font-semibold cursor-pointer hover:text-text-primary flex items-center gap-1">Categoría <IconChevronDown size={14}/></th>
                    <th className="px-6 py-4 font-semibold">Lote / Tropa</th>
                    <th className="px-6 py-4 font-semibold">Peso Act.</th>
                    <th className="px-6 py-4 font-semibold">Establecimiento</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-border">
                 {isLoading && (
                    <tr>
                       <td colSpan={7} className="px-6 py-6">
                         <Skeleton className="h-10 w-full" />
                       </td>
                    </tr>
                 )}
                 {formattedAssets.map((asset: any) => {
                    const isSelected = selectedAssets.has(asset.realId)
                    return (
                    <tr 
                       key={asset.realId} 
                       className={`transition-colors cursor-pointer group ${isSelected ? 'bg-primary/5' : 'hover:bg-bg-subtle/40'}`}
                       onClick={() => router.push(`/w/${workspace.id}/roles/${roleId}/asset-passport?assetId=${asset.realId}`)}
                    >
                       <td className="px-4 py-4 w-12 text-center" onClick={(e) => e.stopPropagation()}>
                          <input 
                            type="checkbox" 
                            className="rounded border-border text-primary focus:ring-primary/50 cursor-pointer size-4"
                            checked={isSelected}
                            onChange={(e) => toggleSelection(asset.realId, e as any)}
                          />
                       </td>
                       <td className="px-6 py-4 font-mono font-medium text-primary group-hover:underline">
                          <div className="flex items-center gap-2">
                             <IconBox size={16} className="text-text-muted" />
                             {asset.id}
                          </div>
                       </td>
                       <td className="px-6 py-4 text-text-primary">{asset.category}</td>
                       <td className="px-6 py-4">
                          {asset.lotName ? (
                             <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-bg-subtle border border-border text-xs font-bold text-text-secondary">
                                <IconPackages size={14} />
                                {asset.lotName}
                             </span>
                          ) : (
                             <span className="text-xs text-text-muted">Ninguno</span>
                          )}
                       </td>
                       <td className="px-6 py-4 text-text-secondary">{asset.weight}</td>
                       <td className="px-6 py-4 text-text-secondary">{asset.facility}</td>
                       <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                             asset.status === 'ACTIVE' ? 'bg-success/10 text-success' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {asset.status}
                          </span>
                       </td>
                    </tr>
                    )
                 })}
                 {!isLoading && formattedAssets.length === 0 && (
                    <tr>
                       <td colSpan={7} className="px-6 py-12 text-center text-text-muted">
                          No se encontraron animales registrados o coincidentes con la búsqueda.
                       </td>
                    </tr>
                 )}
              </tbody>
           </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
           {isLoading && <Skeleton className="h-[200px] rounded-xl w-full" />}
           {formattedAssets.map(asset => {
              const isSelected = selectedAssets.has(asset.realId)
              return (
              <div 
                 key={asset.realId} 
                 className={`bg-surface border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between h-[200px] relative overflow-hidden ${isSelected ? 'border-primary ring-1 ring-primary/50' : 'border-border'}`}
                 onClick={() => router.push(`/w/${workspace.id}/roles/${roleId}/asset-passport?assetId=${asset.realId}`)}
              >
                 {/* Multi-select check on the card */}
                 <div 
                   className={`absolute top-0 right-0 p-3 pt-4 pr-4 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                   onClick={(e) => toggleSelection(asset.realId, e as any)}
                 >
                    <div className={`size-5 rounded flex items-center justify-center border ${isSelected ? 'bg-primary border-primary text-white' : 'border-border bg-surface'}`}>
                       {isSelected && <IconCheck size={14} stroke={3} />}
                    </div>
                 </div>

                 <div className="flex justify-between items-start pr-8">
                    <div className="flex items-center gap-2 bg-primary/10 text-primary px-2 py-1 rounded font-mono text-xs font-bold">
                       <IconBox size={14} />
                       {asset.id}
                    </div>
                 </div>
                 <div className="mt-auto">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-text-primary leading-tight">{asset.category}</h3>
                      {asset.lotName && (
                        <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-text-muted border border-border px-1.5 py-0.5 rounded truncate max-w-[90px]" title={asset.lotName}>
                           <IconPackages size={10} /> {asset.lotName}
                        </div>
                      )}
                    </div>
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
              )
           })}
        </div>
      )}
    </div>
  )
}
