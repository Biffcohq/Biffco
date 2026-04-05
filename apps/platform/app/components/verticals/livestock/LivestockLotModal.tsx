'use client'

import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalTitle, Input, Button } from '@biffco/ui'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconPackages } from '@tabler/icons-react'
import { trpc } from '@/lib/trpc'
import { toast } from 'sonner'

const lotSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  purpose: z.string().min(1, 'El propósito es requerido'),
  facilityId: z.string().optional()
})

type LotForm = z.infer<typeof lotSchema>

interface Props {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
}

export default function LivestockLotModal({ isOpen, onClose, workspaceId }: Props) {
  const utils = trpc.useUtils()
  const { data: facilities } = trpc.facilities.list.useQuery(undefined, { enabled: isOpen })

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<LotForm>({
    resolver: zodResolver(lotSchema),
    defaultValues: {
      name: '',
      purpose: ''
    }
  })

  const mutation = trpc.assetGroups.create.useMutation({
    onSuccess: () => {
      toast.success('Lote creado exitosamente')
      utils.assetGroups.getWithAssets.invalidate({ verticalId: 'livestock' })
      reset()
      onClose()
    },
    onError: (err) => {
      toast.error(err.message || 'Error al crear el lote')
    }
  })

  const onSubmit = (data: LotForm) => {
    mutation.mutate({
      name: data.name,
      verticalId: 'livestock',
      initialQuantity: 0,
      metadata: {
        purpose: data.purpose,
        facilityId: data.facilityId
      }
    })
  }

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent className="max-w-md bg-surface border-border">
        <ModalHeader className="border-b border-border pb-4">
          <ModalTitle className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <IconPackages size={18} />
            </div>
            Crear Lote Físico
          </ModalTitle>
        </ModalHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-5">
           
           <div className="flex flex-col gap-1.5">
             <label className="text-sm font-bold text-text-primary">Nombre / Identificador del Lote</label>
             <Input 
               {...register('name')} 
               placeholder="ej. Tropa Destete 26, Lote Engorde A..." 
               className="bg-bg-subtle border-border"
               autoFocus
             />
             {errors.name && <span className="text-xs text-error font-medium">{errors.name.message}</span>}
           </div>

           <div className="flex flex-col gap-1.5">
             <label className="text-sm font-bold text-text-primary">Estrategia / Propósito</label>
             <select 
               {...register('purpose')}
               className="h-10 px-3 rounded-md border border-border bg-bg-subtle text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary"
             >
               <option value="">Selecciona un propósito</option>
               <option value="Destete">Destete</option>
               <option value="Recría">Recría</option>
               <option value="Engorde/Feedlot">Engorde / Feedlot</option>
               <option value="Vientres/Inseminacion">Vientres / Inseminación</option>
               <option value="Mercado/Faena">Mercado / Faena inminente</option>
             </select>
             {errors.purpose && <span className="text-xs text-error font-medium">{errors.purpose.message}</span>}
           </div>

           <div className="flex flex-col gap-1.5">
             <label className="text-sm font-bold text-text-primary">Establecimiento (Actual)</label>
             <select 
               {...register('facilityId')}
               className="h-10 px-3 rounded-md border border-border bg-bg-subtle text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary"
             >
               <option value="">Sin Asignar (Genérico)</option>
               {facilities?.map(f => (
                 <option key={f.id} value={f.id}>{f.name} ({f.location?.renspa || 'S/N'})</option>
               ))}
             </select>
             <span className="text-[11px] text-text-muted mt-0.5">Puedes agrupar animales globalmente o confinarlos lógicamente a un establecimiento.</span>
           </div>

           <div className="pt-4 flex justify-end gap-3 mt-2">
             <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
               Cancelar
             </Button>
             <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
               {isSubmitting ? 'Creando...' : 'Crear Lote'}
             </Button>
           </div>
        </form>
      </ModalContent>
    </Modal>
  )
}
