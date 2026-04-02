"use client"

import { IconShape, IconPlus, IconBox, IconUsersGroup } from '@tabler/icons-react'
import { trpc } from '@/lib/trpc'
import { Skeleton, Button, Badge, toast } from '@biffco/ui'

export default function GroupsPage() {
  const { data: groupsList, isLoading } = trpc.assetGroups.getWithAssets.useQuery({ verticalId: 'livestock' })

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <IconShape size={24} className="text-primary" />
            Agrupaciones y Lotes
          </h1>
          <p className="text-text-secondary text-sm">Gestiona colecciones lógicas de activos físicos operando conjuntamente como tropas, silos o embarques.</p>
        </div>
        <Button 
          onClick={() => toast.info("Modal de conformación de Lote pendiente.")}
          className="whitespace-nowrap w-fit bg-primary text-white hover:bg-primary-dark"
        >
          <IconPlus size={18} />
          Conformar Lote
        </Button>
      </div>

      {/* Grid list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-8">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-36 w-full rounded-xl" />)
        ) : groupsList && groupsList.length > 0 ? (
          groupsList.map((group) => (
             <div 
               key={group.id}
               className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md hover:border-primary/40 cursor-pointer transition-all group/card"
             >
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center size-10 rounded-lg bg-surface-raised border border-border text-primary group-hover/card:bg-primary/5 transition-colors">
                         <IconShape size={20} stroke={1.5} />
                      </div>
                      <div>
                         <h3 className="font-semibold text-text-primary text-base truncate max-w-[140px]">{group.name}</h3>
                         <div className="text-xs text-text-muted font-mono w-full truncate">ID: {group.id.split('-')[0]}</div>
                      </div>
                   </div>
                   <Badge variant={group.isActive ? 'green' : 'gray'}>
                     {group.isActive ? 'Activo' : 'Disuelto'}
                   </Badge>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border text-sm text-text-secondary">
                   <div className="flex items-center gap-1.5 font-medium text-text-primary">
                      <IconBox size={16} className="text-text-muted" stroke={1.5} />
                      {group.totalActive} Activos Reales
                   </div>
                   <div className="flex items-center gap-1.5 text-xs">
                      <IconUsersGroup size={14} className="text-text-muted" />
                      Inicial: {group.quantity || 0}
                   </div>
                </div>
             </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-12 bg-surface-raised/50 border border-border border-dashed rounded-xl text-center">
             <div className="size-16 rounded-full bg-surface border border-border flex items-center justify-center mb-4">
               <IconShape size={32} className="text-text-muted opacity-50" stroke={1.5} />
             </div>
             <h3 className="text-text-primary font-medium">No hay Lotes Conformados</h3>
             <p className="text-text-secondary text-sm max-w-sm mt-1">
                La trazabilidad a nivel de rebaño o embarque se logra agrupando activos sueltos en Lotes Lógicos.
             </p>
             <Button 
                onClick={() => toast.info("Modal de conformación de Lote pendiente.")}
                variant="outline"
                className="mt-6"
             >
                <IconPlus size={16} className="mr-2" />
                Crear tu primer Lote
             </Button>
          </div>
        )}
      </div>
    </div>
  )
}
