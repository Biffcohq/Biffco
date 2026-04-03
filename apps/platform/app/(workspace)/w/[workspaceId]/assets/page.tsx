"use client"

import { IconBox, IconPlus } from '@tabler/icons-react'
import { trpc } from '@/lib/trpc'
import { Button, toast } from '@biffco/ui'
import { useState } from 'react'
// eslint-disable-next-line no-restricted-imports
import { VerticalAssetTable } from '../../../../lib/verticals/registry'

export default function AssetsPage() {
  const { data: workspaceData } = trpc.workspaces.getProfile.useQuery()
  const { data: assetsList, isLoading } = trpc.assets.list.useQuery()
  const [filter, setFilter] = useState<'all' | 'active'>('all')

  const filteredAssets = filter === 'active' 
    ? assetsList?.filter(a => a.status === 'ACTIVE') 
    : assetsList

  const verticalId = workspaceData?.verticalId || 'livestock'; // Fallback mientras impacta migracion

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
          onClick={() => toast.info("Modal de originación de Activos dependiente del Vertical Pack instalado en este Workspace.")}
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

      {/* Grid list / Vertical Table */}
      <div className="pb-8">
        <VerticalAssetTable 
          verticalId={verticalId} 
          assets={filteredAssets || []} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  )
}
