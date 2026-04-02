"use client"

import { Card, Input, Label, Button } from '@biffco/ui'

export default function GeneralSettingsPage() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in">
      <div className="border-b border-border pb-6">
        <h1 className="text-2xl font-semibold text-text-primary">Workspace General</h1>
        <p className="text-sm text-text-secondary mt-1">Configuraciones básicas y metadatos de tu entorno operativo Biffco.</p>
      </div>

      <Card className="p-6 bg-surface border border-border">
        <h3 className="text-base font-semibold text-text-primary mb-4">Detalles del Workspace</h3>
        <div className="flex flex-col gap-4 max-w-xl">
          <div className="grid gap-2">
            <Label htmlFor="wsName" className="text-slate-900">Nombre del Workspace</Label>
            <Input id="wsName" value="Biffco Corp" readOnly className="bg-surface-raised cursor-not-allowed text-text-secondary" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="wsId" className="text-slate-900">ID Único (Verificable)</Label>
            <Input id="wsId" value="ws_XT9021cfsDAxK..." readOnly className="bg-surface-raised cursor-not-allowed text-text-secondary font-mono text-xs" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="vertical" className="text-slate-900">Vertical Asignada</Label>
            <Input id="vertical" value="Ganadería Bovina (Argentine Livestock Pack)" readOnly className="bg-surface-raised cursor-not-allowed text-text-secondary" />
          </div>
        </div>
      </Card>
      
      <div className="flex justify-end gap-3 mt-4 opacity-50 pointer-events-none">
         <Button variant="outline">Cancelar</Button>
         <Button>Guardar Cambios</Button>
      </div>
    </div>
  )
}
