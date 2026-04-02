"use client"

import React from "react"
import { Badge } from "@biffco/ui"
import { SectionCard } from "../components/SectionCard"
import { IconKey, IconShieldExclamation, IconCpu } from '@tabler/icons-react'

export default function WalletSettingsPage() {
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Billetera Criptográfica</h1>
        <p className="text-text-secondary mt-1 text-sm">Gestiona la clave privada de tu cuenta, vital para firmar transacciones en la red EUDR y emitir trazabilidad inmutable.</p>
      </div>

      <SectionCard
        title="Estado de tu Billetera (Network Anchor)"
        description="Esta cuenta posee una billetera no-custodial integrada. Aquí verás su estado y salud operativa."
        actionLabel="Exportar Llave Pública"
      >
        <div className="flex flex-col gap-4">
           {/* Visual Wallet Status Panel */}
           <div className="p-4 border border-border rounded-lg bg-[#FAFAFA] dark:bg-[#111111] grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-4 items-center">
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                 <IconShieldExclamation className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex flex-col">
                 <div className="flex items-center gap-2">
                   <span className="font-semibold text-text-primary">Billetera Segura</span>
                   <Badge variant="green" className="py-0 px-2 h-5 text-[10px]">OPERATIVA</Badge>
                 </div>
                 <p className="text-sm text-text-secondary font-mono mt-1">bif_1H2x8Zq9LpM4RTY8vnN0...</p>
              </div>
              <div className="flex text-right flex-col">
                <span className="text-xs text-text-secondary">Conectado a:</span>
                <span className="font-bold flex items-center gap-1"><IconCpu size={14} className="text-primary"/> Biffco Subnet (L2)</span>
              </div>
           </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Rotación de Claves (Key Rotation)"
        description="Si crees que tu clave privada ha sido comprometida en el ambiente local, re-genera una nueva bóveda."
        footerText="Atención: Esta es una operación de alto riesgo. Perderás asociación previa si no tienes backup."
        actionLabel="Regenerar Claves"
      >
         <div className="bg-red-500/10 border border-red-500/20 rounded p-4 flex gap-3 text-red-600">
             <IconKey className="shrink-0 h-5 w-5" />
             <p className="text-sm">Regenerar una clave anula toda firma criptográfica delegada a partir del momento actual. Todos los certificados pendientes fallarán y deberás volver a emitirlos con tu nueva bóveda.</p>
         </div>
      </SectionCard>
      
    </>
  )
}
