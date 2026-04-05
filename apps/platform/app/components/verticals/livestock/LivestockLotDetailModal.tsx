'use client'

import React, { useMemo } from 'react'
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@biffco/ui'
import { IconPackages, IconBox } from '@tabler/icons-react'
import { trpc } from '@/lib/trpc'
import { Skeleton } from '@/app/components/ui/Skeleton'

type Props = {
  isOpen: boolean
  onClose: () => void
  lotId?: string
  workspaceId: string
}

export default function LivestockLotDetailModal({ isOpen, onClose, lotId, workspaceId }: Props) {
  const { data: lots, isLoading: loadingLots } = trpc.assetGroups.getWithAssets.useQuery({ verticalId: 'livestock' }, { enabled: isOpen })
  const { data: realAssets, isLoading: loadingAssets } = trpc.assets.list.useQuery(undefined, { enabled: isOpen })
  
  const lot = useMemo(() => lots?.find(l => l.id === lotId), [lots, lotId])
  
  const lotAssets = useMemo(() => {
    if (!lotId || !realAssets) return []
    return realAssets
      .filter(a => a.groupId === lotId && a.status === 'ACTIVE')
      .map(asset => {
        const d = asset.metadata as any
        return {
          id: d?.externalId || asset.id.slice(0, 10),
          realId: asset.id,
          category: d?.initialState?.breed || 'Sin Especificar',
          weight: d?.initialState?.weight ? `${d.initialState.weight} kg` : '--'
        }
      })
  }, [realAssets, lotId])

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent className="max-w-2xl bg-surface border-border overflow-hidden flex flex-col max-h-[85vh]">
        <ModalHeader className="border-b border-border pb-4 p-6 shrink-0">
          <ModalTitle className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <IconPackages size={24} />
            </div>
            <div>
               <div className="text-xl">{lot ? lot.name : <Skeleton className="h-6 w-32" />}</div>
               <div className="text-sm font-normal text-text-muted mt-1">
                  Activos asignados a esta tropa
               </div>
            </div>
          </ModalTitle>
        </ModalHeader>

        <div className="p-6 overflow-y-auto flex-1">
           {(loadingLots || loadingAssets) ? (
              <div className="flex flex-col gap-3">
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-10 w-full" />
              </div>
           ) : lotAssets.length === 0 ? (
              <div className="py-12 text-center text-text-muted border border-dashed border-border rounded-xl">
                 <IconBox size={48} className="mx-auto mb-3 opacity-20" />
                 <p>No hay animales activos asignados a este lote.</p>
              </div>
           ) : (
             <div className="border border-border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                   <thead className="bg-bg-subtle border-b border-border text-xs uppercase text-text-secondary tracking-wider">
                      <tr>
                         <th className="px-4 py-3 font-semibold">Identificador</th>
                         <th className="px-4 py-3 font-semibold">Categoría</th>
                         <th className="px-4 py-3 font-semibold text-right">Peso</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-border">
                      {lotAssets.map(a => (
                         <tr key={a.realId} className="hover:bg-bg-subtle/50 transition-colors">
                            <td className="px-4 py-3 font-mono font-bold text-primary flex items-center gap-2">
                               <IconBox size={14} className="text-text-muted" />
                               {a.id}
                            </td>
                            <td className="px-4 py-3 text-text-primary">{a.category}</td>
                            <td className="px-4 py-3 text-right text-text-secondary">{a.weight}</td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
           )}
        </div>
      </ModalContent>
    </Modal>
  )
}
