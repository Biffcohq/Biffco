"use client"

import { IconBox, IconPlus, IconActivity, IconAlertCircle } from '@tabler/icons-react'
import { trpc } from '@/lib/trpc'
import { Skeleton, Button, Badge } from '@biffco/ui'
import { useState } from 'react'

export default function AssetsPage() {
  const { data: assetsList, isLoading } = trpc.assets.list.useQuery()
  const [filter, setFilter] = useState<'all' | 'active'>('all')

  const filteredAssets = filter === 'active' 
    ? assetsList?.filter(a => a.status === 'ACTIVE') 
    : assetsList

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <IconBox size={24} className="text-primary" />
            Inventario de Activos (Assets)
          </h1>
          <p className="text-text-secondary text-sm">Registro inmutable de unidades trazables físicas o lógicas dentro de tu cadena de suministro.</p>
        </div>
        <Button 
          onClick={() => window.alert("Modal de originación de Activos dependiente del Vertical Pack instalado en este Workspace.")}
          className="whitespace-nowrap w-fit bg-primary text-white hover:bg-primary-dark"
        >
          <IconPlus size={18} />
          Registrar / Importar Activos
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between bg-surface-raised p-1.5 rounded-lg border border-border">
         <div className="flex items-center gap-1">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === 'all' ? 'bg-surface shadow-sm text-text-primary border border-border/50' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Todos
            </button>
            <button 
              onClick={() => setFilter('active')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === 'active' ? 'bg-surface shadow-sm text-primary border border-border/50' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Activos (On-hold / Transit)
            </button>
         </div>
      </div>

      {/* Grid list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-8">
        {isLoading ? (
          Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)
        ) : filteredAssets && filteredAssets.length > 0 ? (
          filteredAssets.map((asset) => (
             <div 
               key={asset.id}
               className="bg-surface border border-border rounded-xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-md hover:border-primary/40 cursor-pointer transition-all group"
             >
                <div className="flex justify-between items-start">
                   <div className="flex items-center justify-center size-10 rounded-lg bg-surface-raised border border-border text-text-secondary group-hover:text-primary transition-colors">
                      <IconBox size={20} stroke={1.5} />
                   </div>
                   <Badge variant={asset.status === 'ACTIVE' ? 'blue' : 'gray'}>
                     {asset.status}
                   </Badge>
                </div>
                
                <div className="mt-1">
                   <h3 className="font-semibold text-text-primary text-base truncate">{asset.type}</h3>
                   <div className="text-xs text-text-muted font-mono mt-1 w-full truncate">RID: {asset.id}</div>
                </div>

                <div className="flex items-center gap-4 mt-auto pt-3 border-t border-border text-xs text-text-secondary">
                   <div className="flex items-center gap-1.5" title="Último evento registrado">
                      <IconActivity size={14} className="opacity-70" />
                      <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
                   </div>
                   {asset.metadata && (asset.metadata as Record<string, unknown>).penId && (
                      <div className="flex items-center gap-1.5 text-warning" title="Localizado en Hold/Cuarentena">
                        <IconAlertCircle size={14} />
                      </div>
                   )}
                </div>
             </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-12 bg-surface-raised/50 border border-border border-dashed rounded-xl text-center">
             <IconBox size={48} className="text-text-muted mb-4 opacity-50" stroke={1} />
             <h3 className="text-text-primary font-medium">Bóveda Vacía</h3>
             <p className="text-text-secondary text-sm max-w-sm mt-1">
                Aún no existen registros físicos encriptados ni inventariado en esta partición operativa.
             </p>
          </div>
        )}
      </div>
    </div>
  )
}
