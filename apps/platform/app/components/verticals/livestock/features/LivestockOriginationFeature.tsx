'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { trpc } from '@/lib/trpc'
import { IconKey, IconCheck, IconBuildingEstate, IconPlus, IconBox } from '@tabler/icons-react'
import { useBiffcoKMS } from '../../../../lib/crypto/useBiffcoKMS'
import { Input, Button, toast } from '@biffco/ui'

type FormData = {
  breed: string;
  rfid: string;
  dateOfBirth: string;
  facilityId: string;
  weight: number;
}

// Listado oficial de razas y especies
const LIVESTOCK_BREEDS = [
  { code: 'AA', name: 'ABERDEEN ANGUS' },
  { code: 'BO', name: 'BOSMARA' },
  { code: 'BF', name: 'BRAFORD' },
  { code: 'B', name: 'BRAHMAN' },
  { code: 'BG', name: 'BRANGUS' },
  { code: 'CH', name: 'CHAROLAIS' },
  { code: 'CR', name: 'CRIOLLA' },
  { code: 'G', name: 'GALLOWAY' },
  { code: 'GC', name: 'GANADO CRUZA' },
  { code: 'H', name: 'HEREFORD' },
  { code: 'HA', name: 'HOLANDO ARGENTINO' },
  { code: 'J', name: 'JERSEY' },
  { code: 'K', name: 'KIWI' },
  { code: 'LA', name: 'LIMANGUS' },
  { code: 'L', name: 'LIMOUSINE' },
  { code: 'MG', name: 'MURRAY GREY' },
  { code: 'PH', name: 'POLLED HEREFORD' },
  { code: 'SI', name: 'SAN IGNACIO' },
  { code: 'SG', name: 'SANTA GERTRUDIS' },
  { code: 'SA', name: 'SENANGUS' },
  { code: 'SF', name: 'SENEFORD' },
  { code: 'SP', name: 'SENEPOL' },
  { code: 'SH', name: 'SHORTHORN' },
  { code: 'FS', name: 'SIMMENTAL' },
  { code: 'SRB', name: 'SUECA ROJA Y BLANCA' },
  { code: 'TL', name: 'TULI' },
  { code: 'W', name: 'WAGYU' },
  { code: 'OR', name: 'OTRA RAZA' }
].sort((a, b) => a.name.localeCompare(b.name));

export default function LivestockOriginationFeature({ workspace }: { workspace: any }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()
  const utils = trpc.useUtils()
  const { isReady: isKmsReady, signPayload, publicKey } = useBiffcoKMS()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [recentAssets, setRecentAssets] = useState<any[]>([])

  // Fetch real facilities
  const { data: facilities, isLoading: isLoadingFacilities } = trpc.facilities.list.useQuery()

  const mutation = trpc.assets.create.useMutation({
    onSuccess: (data) => {
      toast.success('Activo Ganadero minteado en la blockchain')
      utils.assets.list.invalidate()
      reset()
      setRecentAssets(prev => [data, ...prev].slice(0, 5))
      setIsSubmitting(false)
    },
    onError: (err: unknown) => {
      const error = err as Error;
      toast.error(error.message || 'Error al mintear el activo')
      setIsSubmitting(false)
    }
  })

  // Generador de Firma del Payload del Evento usando KMS
  const processEventSignature = async (payload: any) => {
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

    // Ensure fields are uppercase per Biffco rules before signing the payload
    const finalRfid = data.rfid.toUpperCase()
    const finalBreed = data.breed.toUpperCase()

    const payload = {
      action: 'LIVESTOCK_ORIGINATED',
      breed: finalBreed,
      rfid: finalRfid,
      dateOfBirth: data.dateOfBirth,
      weight: Number(data.weight) || 0,
      origin: 'platform-onboarding'
    }

    try {
      const cryptoProof = await processEventSignature(payload)

      mutation.mutate({
        type: 'AnimalAsset',
        initialState: payload,
        externalId: finalRfid,
        facilityId: data.facilityId,
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
       toast.error("Error generando firma criptográfica: " + error.message)
       setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500 pb-12 w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            Nacimientos y Altas
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Registro inicial de caravanas (EID) y minteo en Ledger para {workspace?.name}.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Main Form Section */}
        <div className="bg-surface border border-border rounded-xl shadow-sm p-6 flex-1">
           <form onSubmit={(e) => { void handleSubmit(onSubmit)(e) }} className="flex flex-col gap-6">
             <div className="bg-surface-raised border border-border rounded-lg p-4 flex gap-3 text-sm text-text-secondary items-start">
                 <IconKey className="shrink-0 text-primary mt-0.5" size={20} />
                 <div className="flex flex-col gap-1">
                   <p>
                     Este formulario crea un Activo en la BD e inyecta el evento Génesis firmado por ti en la cadena inmutable.
                   </p>
                   {publicKey && (
                     <p className="text-xs bg-bg-subtle p-1.5 rounded font-mono break-all mt-1 border border-border/40 inline-block w-fit">
                       Tu Llave (KMS): <span className="text-primary">{publicKey.slice(0,16)}...</span>
                     </p>
                   )}
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-text-primary">Especie / Raza</label>
                  <select 
                    {...register('breed', { required: 'La raza es obligatoria' })}
                    className="w-full h-10 px-3 rounded-md border border-border bg-bg-subtle text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all focus:bg-surface"
                  >
                    <option value="">Seleccione una raza...</option>
                    {LIVESTOCK_BREEDS.map(b => (
                       <option key={b.code} value={b.name}>{b.name} ({b.code})</option>
                    ))}
                  </select>
                  {errors.breed && <span className="text-error text-xs">{errors.breed.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-text-primary">Caravana Electrónica (EID) / DTE</label>
                  <Input 
                    {...register('rfid', { 
                      required: 'El identificador físico es obligatorio',
                      validate: async (value) => {
                        try {
                          const res = await utils.assets.checkExternalId.fetch({ externalId: value })
                          return res.exists ? 'Este identificador ya está registrado' : true
                        } catch (e) {
                          return true
                        }
                      }
                    })}
                    placeholder="Ej. 840003123456789"
                    className={`w-full font-mono text-sm bg-bg-subtle border-border focus:bg-surface ${errors.rfid ? 'border-error ring-1 ring-error' : ''}`}
                    autoComplete="off"
                  />
                  {errors.rfid && <span className="text-error text-xs flex items-center gap-1"><IconCheck size={14} className="hidden" /> {errors.rfid.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-text-primary">Fecha de Nacimiento</label>
                  <Input 
                    type="date"
                    {...register('dateOfBirth', { required: 'La fecha es obligatoria' })}
                    className="w-full bg-bg-subtle border-border focus:bg-surface"
                  />
                  {errors.dateOfBirth && <span className="text-error text-xs">{errors.dateOfBirth.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-text-primary">Peso Bruto al Nacer (Kg)</label>
                  <Input 
                    type="number"
                    step="0.1"
                    {...register('weight', { required: 'El peso es obligatorio' })}
                    placeholder="Ej. 35.5"
                    className="w-full bg-bg-subtle border-border focus:bg-surface"
                  />
                  {errors.weight && <span className="text-error text-xs">{errors.weight.message}</span>}
                </div>
                
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-medium text-text-primary flex items-center gap-2">
                    <IconBuildingEstate size={16} /> Establecimiento de Origen
                  </label>
                  <select 
                     {...register('facilityId', { required: 'Debe seleccionar un establecimiento' })}
                     className="w-full h-10 px-3 rounded-md border border-border bg-bg-subtle text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all focus:bg-surface"
                  >
                     <option value="">Seleccione un establecimiento...</option>
                     {facilities?.map(fac => (
                       <option key={fac.id} value={fac.id}>{fac.name} (RENSPA: {(fac.location as any)?.renspa || fac.type})</option>
                     ))}
                  </select>
                  {errors.facilityId && <span className="text-error text-xs">{errors.facilityId.message}</span>}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border mt-2">
                <Button type="submit" disabled={isSubmitting || !isKmsReady} className={isSubmitting ? "opacity-70 bg-primary text-white" : "bg-primary hover:bg-primary-hover text-white shadow-sm"}>
                  <IconKey size={18} className="mr-2" /> 
                  {isSubmitting ? "Registrando Transacción..." : "Firmar Evento y Registrar"}
                </Button>
              </div>
           </form>
        </div>

        {/* Info Column (Recent Assets) */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
           <div className="bg-surface border border-border rounded-xl p-5 shadow-sm min-h-[300px]">
              <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                 <IconCheck size={18} className="text-success" />
                 Últimos Registros
              </h3>
              {recentAssets.length === 0 ? (
                 <div className="text-sm text-text-muted text-center py-10 border border-dashed border-border rounded-lg bg-bg-subtle">
                    No has registrado nacimientos en esta sesión.
                 </div>
              ) : (
                 <ul className="flex flex-col gap-3">
                    {recentAssets.map((asset, i) => (
                       <li key={i} className="flex gap-3 items-center p-3 rounded-lg border border-border bg-bg-subtle">
                         <div className="size-8 rounded-full bg-success/10 flex items-center justify-center text-success shrink-0">
                           <IconBox size={16} />
                         </div>
                         <div className="flex flex-col overflow-hidden">
                           <span className="text-sm font-bold text-text-primary truncate">{asset.metadata.externalId || asset.id.slice(0,10)}</span>
                           <span className="text-[10px] text-text-secondary uppercase">{asset.type} • {asset.status}</span>
                         </div>
                       </li>
                    ))}
                 </ul>
              )}
           </div>
        </div>

      </div>
    </div>
  )
}
