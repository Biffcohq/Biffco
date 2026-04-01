/* global console, setTimeout */
"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DynamicFormRenderer } from '@biffco/ui'
import { IconChevronLeft, IconInfoCircle } from '@tabler/icons-react'
import Link from 'next/link'
import { livestockVerticalPack } from '@biffco/livestock'

/**
 * Mapeo de la estructura Zod a una estructura UISchema consumible por el renderer.
 */
const animalAssetUISchema = {
  id: "animalAsset",
  title: "Alta de Animal Bovino (EID Trazable)",
  fields: [
    {
      id: "rfid",
      type: "text" as const,
      label: "Caravana Oficial / EID",
      description: "Identificador oficial (Ej. RENSPA completo u orejero)",
    },
    {
      id: "species",
      type: "select" as const,
      label: "Especie (Dominio Regulado)",
      options: [
        { label: "Bovino (bovine)", value: "bovine" }
      ]
    },
    {
      id: "sex",
      type: "select" as const,
      label: "Sexo",
      options: [
        { label: "Macho (M)", value: "M" },
        { label: "Hembra (F)", value: "F" }
      ]
    },
    {
      id: "breed",
      type: "select" as const,
      label: "Raza Predominante",
      options: [
        { label: "Angus", value: "Angus" },
        { label: "Brangus", value: "Brangus" },
        { label: "Hereford", value: "Hereford" },
        { label: "Braford", value: "Braford" },
        { label: "Cruza / Indefinida", value: "Cruza" }
      ]
    },
    {
      id: "dateOfBirth",
      type: "date" as const,
      label: "Fecha de Nacimiento (Opcional)",
    }
  ],
  required: ['rfid', 'species', 'sex']
}

export default function NewAssetPage({ params }: { params: { wsId: string } }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreate = (formData: Record<string, unknown>) => {
    setIsSubmitting(true)
    
    // Simulación de delay y submit al router.
    console.log("Creando Asset con vertical:", livestockVerticalPack.id)
    console.log("Payload Zod validado hipotéticamente en backend:", formData)
    
    setTimeout(() => {
      setIsSubmitting(false)
      // Redirect to assets dir
      router.push(`/${params.wsId}/assets`)
    }, 1200)
  }

  return (
    <div className="max-w-2xl mx-auto py-8 animate-in slide-in-from-bottom-4 duration-500">
      <Link 
        href={`/${params.wsId}/assets`} 
        className="inline-flex items-center text-sm font-medium text-text-muted hover:text-text-primary mb-6 transition-colors"
      >
        <IconChevronLeft size={16} className="mr-1" />
        Volver a Directorio
      </Link>
      
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-8 flex gap-3 text-sm text-primary">
        <IconInfoCircle className="shrink-0" />
        <div>
          <p className="font-semibold mb-1">Vertical Activa: {livestockVerticalPack.name}</p>
          <p className="opacity-90">Estás creando un ACTIVO de tipo <span className="font-mono bg-bg px-1 rounded">AnimalAsset</span>. El sistema exigirá trazabilidad de origen (geoRequired) de acuerdo al paquete vertical instanciado.</p>
        </div>
      </div>

      {isSubmitting ? (
        <div className="flex flex-col items-center justify-center p-12 bg-surface border border-border rounded-xl">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4"></div>
          <p className="font-medium text-text-primary">Firmando Transacción EID...</p>
          <p className="text-sm text-text-secondary mt-1">Sometiendo asset a Blockchain inmutable Biffco.</p>
        </div>
      ) : (
        <DynamicFormRenderer 
          schema={animalAssetUISchema}
          onSubmit={handleCreate}
          onCancel={() => router.push(`/${params.wsId}/assets`)}
        />
      )}
    </div>
  )
}
