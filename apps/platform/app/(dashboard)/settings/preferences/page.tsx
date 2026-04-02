"use client"

import { Card } from '@biffco/ui'

export default function PreferencesSettingsPage() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in">
      <div className="border-b border-border pb-6">
        <h1 className="text-2xl font-semibold text-text-primary">Preferencias de Interfaz</h1>
        <p className="text-sm text-text-secondary mt-1">Ajusta cómo visualizas Biffco en este dispositivo.</p>
      </div>

      <Card className="p-6 bg-surface border border-border flex flex-col gap-6">
        <div className="flex justify-between items-center pb-4 border-b border-border border-dashed">
           <div className="flex flex-col">
              <span className="font-semibold text-text-primary text-sm">Tema Visual</span>
              <span className="text-text-secondary text-xs mt-1">Elige un tema claro, oscuro o alineado a tu sistema.</span>
           </div>
           <select className="border border-border rounded-md px-3 py-1.5 text-sm bg-surface-raised focus:outline-none focus:ring-1 focus:ring-primary/50 text-text-primary">
              <option>Usar configuración del sistema</option>
              <option>Tema Claro</option>
              <option>Tema Oscuro</option>
           </select>
        </div>

        <div className="flex justify-between items-center pb-4 border-b border-border border-dashed">
           <div className="flex flex-col">
              <span className="font-semibold text-text-primary text-sm">Idioma y Región</span>
              <span className="text-text-secondary text-xs mt-1">Idioma principal para el tablero operativo.</span>
           </div>
           <select className="border border-border rounded-md px-3 py-1.5 text-sm bg-surface-raised focus:outline-none focus:ring-1 focus:ring-primary/50 text-text-primary">
              <option>Español (Latinoamérica)</option>
              <option>English (US)</option>
           </select>
        </div>
        
        <div className="flex justify-between items-center">
           <div className="flex flex-col">
              <span className="font-semibold text-text-primary text-sm">Formato de Moneda Numerico</span>
              <span className="text-text-secondary text-xs mt-1">Cómo se muestran los valores financieros.</span>
           </div>
           <select className="border border-border rounded-md px-3 py-1.5 text-sm bg-surface-raised focus:outline-none focus:ring-1 focus:ring-primary/50 text-text-primary">
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>ARS ($)</option>
           </select>
        </div>
      </Card>
    </div>
  )
}
