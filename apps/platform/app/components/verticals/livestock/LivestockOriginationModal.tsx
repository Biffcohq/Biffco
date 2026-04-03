/* eslint-env browser */
/* global TextEncoder, crypto */
'use client'

import React, { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalTitle, Button, Input, toast } from '@biffco/ui'
import { useForm } from 'react-hook-form'
import { trpc } from '@/lib/trpc'
import { IconKey } from '@tabler/icons-react'
import { useBiffcoKMS } from '../../../lib/crypto/useBiffcoKMS'
// createHash removed

type FormData = {
  breed: string;
  rfid: string;
  dateOfBirth: string;
}

export default function LivestockOriginationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()
  const utils = trpc.useUtils()
  const { isReady: isKmsReady, signPayload, publicKey } = useBiffcoKMS()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const mutation = trpc.assets.create.useMutation({
    onSuccess: () => {
      toast.success('Activo Ganadero minteado e inscripto en la cadena')
      utils.assets.list.invalidate()
      reset()
      onClose()
      setIsSubmitting(false)
    },
    onError: (err: unknown) => {
      const error = err as Error;
      toast.error(error.message || 'Error al mintear el activo')
      setIsSubmitting(false)
    }
  })

  // Generador de Hash simple (SHA-256) del Payload del Evento
  // Generador de Firma del Payload del Evento usando KMS
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const processEventSignature = async (payload: any) => {
    // Si bien el backend pide el hash puro también, el signPayload se encarga matemáticamente de blindarlo.
    const sigData = await signPayload(payload);
    
    // Hash local manual (Sha-256 fallback para validadores visuales)
    const text = JSON.stringify(payload, Object.keys(payload).sort())
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const rawHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    return { ...sigData, hash: rawHash }
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
      const cryptoProof = await processEventSignature(payload)

      // Ejecutar la creación en el Core con la Transacción ACID
      mutation.mutate({
        type: 'AnimalAsset', // Identificador validado por el Motor Vertical
        initialState: payload,
        externalId: data.rfid,
        genesisEvent: {
          eventType: 'LIVESTOCK_ORIGINATED',
          payload: payload,
          hash: cryptoProof.hash,
          signature: cryptoProof.signature,
          publicKey: cryptoProof.publicKey,
        }
      })
    } catch (e: unknown) {
       const error = e as Error;
       toast.error("Error generando hash criptográfico: " + error.message)
       setIsSubmitting(false)
    }
  }

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent className="sm:max-w-[500px]">
        <ModalHeader>
          {/* @ts-expect-error type inference from DialogPrimitive */}
          <ModalTitle>Originación de Activo (Vaca)</ModalTitle>
        </ModalHeader>
        <form onSubmit={(e) => { void handleSubmit(onSubmit)(e) }} className="flex flex-col gap-5 mt-2">
          <div className="bg-surface-raised border border-border rounded-lg p-4 flex gap-3 text-sm text-text-secondary items-start">
             <IconKey className="shrink-0 text-primary mt-0.5" size={20} />
             <div className="flex flex-col gap-1">
               <p>
                 Este proceso creará una identidad inmutable en el Ledger y minteará el bloque <span className="font-mono text-text-primary bg-surface p-0.5 rounded">0</span> (Génesis) para este animal.
               </p>
               {publicKey && (
                 <p className="text-xs bg-bg-subtle p-1.5 rounded font-mono break-all mt-1 border border-border/40">
                   Firma Local: <span className="text-primary">{publicKey.slice(0,16)}...</span>
                 </p>
               )}
             </div>
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
            <Button type="submit" disabled={isSubmitting || !isKmsReady} className={isSubmitting ? "opacity-70 bg-primary text-white" : "bg-primary text-white"}>
              <IconKey size={18} className="mr-2" /> 
              {isSubmitting ? "Firmando y Minteando..." : "Firmar Evento y Mintear"}
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  )
}
