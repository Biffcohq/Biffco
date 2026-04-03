'use client'

import React, { useState } from 'react'
import { Modal, Button, Input, toast } from '@biffco/ui'
import { useForm } from 'react-hook-form'
import { trpc } from '@/lib/trpc'
import { IconBox, IconHash } from '@tabler/icons-react'
import { useAuthStore } from '@/app/stores/useAuthStore'
import { createHash } from 'crypto' // Para fallback SHA-256 en browser (pseudo o polyfill)

type FormData = {
  breed: string;
  rfid: string;
  dateOfBirth: string;
}

export default function LivestockOriginationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()
  const utils = trpc.useUtils()
  const { publicKey } = useAuthStore() // Se usaría luego con KMS
  const [isSubmitting, setIsSubmitting] = useState(false)

  const mutation = trpc.assets.create.useMutation({
    onSuccess: () => {
      toast.success('Activo Ganadero minteado e inscripto en la cadena')
      utils.assets.list.invalidate()
      reset()
      onClose()
      setIsSubmitting(false)
    },
    onError: (err) => {
      toast.error(err.message || 'Error al mintear el activo')
      setIsSubmitting(false)
    }
  })

  // Generador de Hash simple (SHA-256) del Payload del Evento
  const generatePayloadHash = async (payload: any) => {
    const text = JSON.stringify(payload, Object.keys(payload).sort())
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)

    // El Payload puro y duro del evento
    const payload = {
      action: 'LIVESTOCK_ORIGINATED',
      breed: data.breed,
      rfid: data.rfid,
      dateOfBirth: data.dateOfBirth,
      weight: 0, // Peso inicial por defecto
      origin: 'platform-onboarding'
    }

    try {
      const hash = await generatePayloadHash(payload)

      // Ejecutar la creación en el Core con la Transacción ACID
      mutation.mutate({
        type: 'Bovine', // Identificador en db.assets
        initialState: payload,
        externalId: data.rfid,
        genesisEvent: {
          eventType: 'LIVESTOCK_ORIGINATED',
          payload: payload,
          hash: hash,
          // signature y publicKey quedan como undefined por ahora (System-Signed)
          // hasta que integremos el Hook de LocalStorage KMS de Biffco.
        }
      })
    } catch (e: any) {
       toast.error("Error generando hash criptográfico: " + e.message)
       setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Originación de Activo (Vaca)">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-2">
        <div className="bg-surface-raised border border-border rounded-lg p-4 flex gap-3 text-sm text-text-secondary items-start">
           <IconHash className="shrink-0 text-primary mt-0.5" size={20} />
           <p>
             Este proceso creará una identidad inmutable en el Ledger y minteará el bloque <span className="font-mono text-text-primary bg-surface p-0.5 rounded">0</span> (Génesis) para este animal.
           </p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-primary">Especie / Raza</label>
          <Input 
            {...register('breed', { required: 'La raza es obligatoria' })}
            placeholder="Ej. Aberdeen Angus, Hereford, Braford..."
            className="w-full"
            autoComplete="off"
          />
          {errors.breed && <span className="text-error text-xs">{errors.breed.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-primary">Caravana Electrónica (RFID) / DTE</label>
          <Input 
            {...register('rfid', { required: 'El identificador físico es obligatorio' })}
            placeholder="Ej. 840003123456789"
            className="w-full font-mono text-sm"
            autoComplete="off"
          />
          {errors.rfid && <span className="text-error text-xs">{errors.rfid.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-primary">Fecha de Nacimiento Estimada</label>
          <Input 
            type="date"
            {...register('dateOfBirth', { required: 'La fecha es obligatoria' })}
            className="w-full"
          />
          {errors.dateOfBirth && <span className="text-error text-xs">{errors.dateOfBirth.message}</span>}
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
          <Button type="submit" isLoading={isSubmitting} className="bg-primary text-white">
            <IconBox size={18} className="mr-2" /> Mintear en Cadena
          </Button>
        </div>
      </form>
    </Modal>
  )
}
