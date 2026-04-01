/* eslint-disable @typescript-eslint/no-explicit-any, no-undef, @typescript-eslint/no-unused-vars */
"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc'
import { IconSignature, IconLockSquareRounded, IconArrowLeft, IconQrcode, IconFileCheck } from '@tabler/icons-react'
import Link from 'next/link'
// @ts-ignore
import { Button, Input, Label, toast, Badge, DynamicFormRenderer, FormSchema } from '@biffco/ui'
import { createId } from '@paralleldrive/cuid2'

// MOCK REGISTRY: En Fase D esto vendrá hidratado globalmente por el paquete de cada industria (VerticalPack)
const SCHEMA_REGISTRY: Record<string, { label: string, schema: FormSchema }> = {
  'ANIMAL_VACCINATED': {
    label: 'Vacunación (Salud Animal)',
    schema: {
       vaccineName: { type: 'string', label: 'Nombre de la Vacuna', required: true, placeholder: 'Ej. Aftosa Bivalente' },
       dose: { type: 'number', label: 'Dosis Aplicada (ml)', required: true },
       veterinarian: { type: 'string', label: 'Matrícula Veterinario', required: true }
    }
  },
  'GPS_CHECK_IN': {
    label: 'Check-in Geográfico',
    schema: {
      latitude: { type: 'number', label: 'Latitud', required: true, placeholder: '-31.4201' },
      longitude: { type: 'number', label: 'Longitud', required: true, placeholder: '-64.1888' },
      notes: { type: 'string', label: 'Observaciones', placeholder: 'Terreno despejado...' }
    }
  },
  'OWNERSHIP_TRANSFER': {
    label: 'Traspaso de Propiedad',
    schema: {
      newOwnerId: { type: 'string', label: 'ID del Nuevo Propietario', required: true },
      salePrice: { type: 'number', label: 'Precio de Venta (Opcional)' },
      requiresInspection: { type: 'boolean', label: 'Requiere inspección sanitaria previa' }
    }
  }
}

export default function NewEventPage({ params }: { params: { wsId: string, id: string } }) {
  const router = useRouter()
  const trpcUtils = trpc.useUtils()
  
  // Estado local para construir el JSON del evento (Mocking DynamicFormRenderer)
  const [eventType, setEventType] = useState('ANIMAL_VACCINATED')
  const [payloadForm, setPayloadForm] = useState<Record<string, any>>({})

  // Simulación del "Firmador Operativo" 
  const [isSigning, setIsSigning] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)

  const appendMutation = trpc.events.append.useMutation({
    onSuccess: (data) => {
      setTxHash(data.hash)
      toast.success("Evento sellado criptográficamente con éxito en el Ledger.")
      trpcUtils.assets.getById.invalidate({ id: params.id })
    },
    onError: (err: any) => {
      toast.error(err.message || "Error al estampar evento")
      setIsSigning(false)
    }
  })

  // 1. Capturar Intención
  const handleSignIntent = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSigning(true)

    // Simulando inyección de "Wallet Local" via sessionStorage y firma Offline
    setTimeout(() => {
       const userConfirmed = window.confirm(
         `Estás a punto de firmar irrevocablemente este evento:\n\n` + 
         `Asset ID: ${params.id}\nTipo: ${eventType}\nPayload: ${JSON.stringify(payloadForm)}\n\n` + 
         `¿Autorizas estampar este bloque en la red de BIFFCO?`
       )

       if (userConfirmed) {
         // Proceder al POST (Generar hash sha-256 dummy de la data)
         const mockHash = `0x${createId()}${createId()}`
         appendMutation.mutate({
            streamId: params.id,
            streamType: 'asset',
            eventType,
            payload: payloadForm,
            hash: mockHash,
            signature: "MOCK_ED25519_SIG_OF_" + mockHash, // MOCK de firma de dispositivo
            publicKey: "MOCK_OPERATOR_PUBLIC_KEY"
         })
       } else {
         setIsSigning(false)
         toast("Firma cancelada por el operario")
       }
    }, 1500)
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 max-w-4xl mx-auto py-8">
      {/* Header / Breadcrumb */}
      <div className="flex items-center gap-4 border-b border-border pb-6 shrink-0">
        <Link 
           href={`/${params.wsId}/assets/${params.id}`}
           className="p-2 border border-border rounded-lg bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-colors"
        >
          <IconArrowLeft size={20} />
        </Link>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[10px] bg-warning/10 text-warning border-warning/30">Módulo Registral</Badge>
          </div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <IconSignature size={24} className="text-primary" />
            Certificar Nuevo Evento Operativo
          </h1>
          <p className="text-text-secondary text-sm">El evento generado será inmutable e inextirpable del ciclo de vida del Activo.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Formulario a la izquierda (3 columnas) */}
        <div className="md:col-span-3 flex flex-col gap-6">
          <form id="event-form" onSubmit={handleSignIntent} className="bg-surface border border-border rounded-xl p-6 shadow-sm flex flex-col gap-5">
             <div className="flex gap-2 items-center text-text-primary border-b border-border pb-3 mb-2">
               <IconFileCheck size={18} className="text-primary"/>
               <h3 className="font-bold">Datos del Evento (Payload)</h3>
             </div>

             <div className="grid gap-2">
                <Label htmlFor="eventType" className="text-text-primary">Tipo de Operación</Label>
                <select 
                  id="eventType"
                  value={eventType}
                  onChange={(e) => {
                    setEventType(e.target.value)
                    setPayloadForm({}) // Reset form on vertical/event change
                  }}
                  className="flex h-10 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSigning || txHash !== null}
                >
                   {Object.entries(SCHEMA_REGISTRY).map(([key, item]) => (
                     <option key={key} value={key}>{item.label}</option>
                   ))}
                </select>
             </div>

             {/* UI Inyectada agnósticamente según el JSON Schema seleccionado */}
             <DynamicFormRenderer 
               schema={SCHEMA_REGISTRY[eventType]?.schema || {}}
               data={payloadForm}
               onChange={setPayloadForm}
               disabled={isSigning || txHash !== null}
             />

             {/* UI de Botón de Firma Estilizado */}
             {!txHash ? (
               <Button 
                type="submit" 
                variant="primary" 
                className="w-full mt-4 py-6 shadow-md shadow-primary/20 relative overflow-hidden group"
                disabled={isSigning}
               >
                 <span className="relative z-10 flex items-center justify-center gap-2 text-base font-semibold">
                   {isSigning ? "Invocando Firmador Local..." : (
                     <>
                     <IconLockSquareRounded size={20} />
                     Firmar y Sellar Evento
                     </>
                   )}
                 </span>
                 <div className="absolute inset-0 bg-gradient-to-r from-primary-hover to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
               </Button>
             ) : (
                <div className="w-full mt-4 p-4 border border-success/30 bg-success/10 text-success rounded-xl flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <IconFileCheck size={24} />
                     <div className="flex flex-col">
                       <span className="font-bold">Evento Sellado Correctamente</span>
                       <span className="text-xs opacity-80">El registro se propagó a la cadena de custodia.</span>
                     </div>
                   </div>
                   <Link href={`/${params.wsId}/assets/${params.id}`}>
                      <Button variant="outline" className="bg-surface text-text-primary hover:bg-surface-raised border-success/30">
                        Volver al Asset
                      </Button>
                   </Link>
                </div>
             )}
          </form>
        </div>

        {/* Previsualizador JSON on the right (2 columns) */}
        <div className="md:col-span-2 flex flex-col gap-4">
           {txHash && (
             <div className="bg-surface border border-primary/20 p-4 rounded-xl shadow-sm flex flex-col items-center justify-center gap-2 text-center relative overflow-hidden">
               <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-primary to-orange left-0"></div>
               <IconQrcode size={48} className="text-primary mt-2" stroke={1.5} />
               <p className="text-xs text-text-secondary mt-1">Sello de Integridad (SHA-256)</p>
               <p className="font-mono text-xs text-primary font-bold break-all px-2">{txHash}</p>
             </div>
           )}

           <div className="bg-surface border border-border rounded-xl flex flex-col overflow-hidden h-full">
             <div className="bg-surface-raised border-b border-border p-3 text-xs font-mono text-text-secondary flex justify-between items-center">
               <span>/payload_preview.json</span>
               <Badge variant="outline" className="text-[9px] height-auto py-0">RAW</Badge>
             </div>
             <pre className="p-4 text-xs font-mono text-text-muted overflow-auto whitespace-pre-wrap">
{JSON.stringify({
  action: "APPEND_EVENT",
  context: {
    workspaceId: params.wsId,
    timestamp: new Date().toISOString(),
    streamId: params.id,
    streamType: "asset"
  },
  payload: {
    eventType: eventType,
    data: payloadForm
  },
  security: {
    signerType: "BROWSER_WALLET",
    algorithm: "ED25519",
    status: txHash ? "SIGNED_OK" : "PENDING_SIGNATURE"
  }
}, null, 2)}
             </pre>
           </div>
        </div>
      </div>
    </div>
  )
}
