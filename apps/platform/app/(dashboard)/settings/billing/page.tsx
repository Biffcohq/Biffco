"use client"

import { Card, Button } from '@biffco/ui'

export default function BillingSettingsPage() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in">
      <div className="border-b border-border pb-6">
        <h1 className="text-2xl font-semibold text-text-primary">Facturación y Planes</h1>
        <p className="text-sm text-text-secondary mt-1">Gestiona tu método de pago y el escalado de activos tokenizados.</p>
      </div>

      <Card className="p-6 bg-surface border border-border flex flex-col gap-4 overflow-hidden relative">
        <div className="flex justify-between items-start">
          <div>
             <h3 className="text-lg font-semibold text-text-primary capitalize">Plan Startup (Fase Beta)</h3>
             <p className="text-text-secondary text-sm max-w-md">Estás utilizando la cuota gratuita para operaciones en la vertical ganadera según el Roadmap v3.1 Fase C.</p>
          </div>
          <div className="text-right">
             <span className="text-2xl font-bold text-text-primary">$0</span><span className="text-text-secondary">/mes</span>
          </div>
        </div>
        
        <div className="h-px w-full bg-border my-2" />
        
        <div className="flex justify-between text-sm">
           <span className="text-text-secondary">Límite de Activos Creados</span>
           <span className="font-medium text-text-primary">Ilimitado</span>
        </div>
        <div className="flex justify-between text-sm">
           <span className="text-text-secondary">Eventos Registrados en Blockchain</span>
           <span className="font-medium text-text-primary">Ilimitado</span>
        </div>

        <div className="mt-4">
           <Button className="w-full sm:w-auto" variant="outline" disabled>Añadir Tarjeta de Crédito (Próximamente)</Button>
        </div>
      </Card>
    </div>
  )
}
