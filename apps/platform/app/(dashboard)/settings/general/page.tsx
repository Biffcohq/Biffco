"use client"

import React from "react"
import { Input } from '@biffco/ui'
import { SectionCard } from "../components/SectionCard"
import { IconShare, IconFingerprint } from '@tabler/icons-react'

export default function GeneralSettingsPage() {
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Cuenta Estructural</h1>
        <p className="text-text-secondary mt-1 text-sm">Configuraciones de la bóveda maestra e identidad primaria de tu equipo Biffco.</p>
      </div>

      <SectionCard
        title="Nombre de la Organización"
        description="El nombre que aparecerá principal en todos los despliegues de tus paneles multiverticales."
        footerText="Puedes cambiar este nombre un máximo de 3 veces cada 30 días."
      >
        <div className="max-w-md">
          <Input id="wsName" defaultValue="Biffco Corp Enterprise" className="bg-surface text-text-primary w-full" />
        </div>
      </SectionCard>

      <SectionCard
        title="ID Único de Hub"
        description="Este es el identificador verificable en el Data Grid. Usado para conexiones B2B y API públicas."
        actionLabel="Copiar ID"
      >
         <div className="flex gap-4 items-center bg-surface-raised border border-border p-3 rounded-lg overflow-hidden">
            <IconFingerprint className="text-primary w-10 h-10 shrink-0 opacity-50" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-text-secondary">ORGANIZATION ROOT ID</span>
              <span className="font-mono text-sm tracking-wide text-text-primary">org_XT9021cfsDAxK911Z0LLp</span>
            </div>
         </div>
      </SectionCard>

      <SectionCard
        title="URL de Portal de Trazabilidad Pública"
        description="Tus consumidores pueden revisar eventos verificados en este portal público."
        actionLabel="Visitar Portal"
      >
        <div className="flex flex-col gap-2 max-w-lg">
          <div className="relative flex items-center">
             <span className="absolute left-3 text-text-secondary font-mono text-sm">https://trace.biffco.co/</span>
             <Input id="tracelink" defaultValue="biffco-corp-enterprise" className="pl-[165px] bg-surface text-text-primary font-mono text-sm w-full" />
          </div>
          <span className="flex gap-2 items-center text-xs text-text-secondary mt-1"><IconShare size={12}/> Los portales en plan básico incluyen el logo de Biffco.</span>
        </div>
      </SectionCard>
      
      <SectionCard
        title="Eliminar Cuenta"
        description="Borra permanentemente tu cuenta y todos los workspaces, instalaciones, y personal adjunto."
        footerText="Atención: Esta acción es irreversible."
        actionLabel="Eliminar Cuenta"
      >
         <div className="text-sm font-medium text-text-primary flex flex-col gap-2">
             <p>Al eliminar esta cuenta perderás el acceso al registro de blockchain histórico. Los lotes certificados seguirán existiendo en red inmutable pero ya no tendrás control administrativo sobre ellos.</p>
         </div>
      </SectionCard>
    </>
  )
}
