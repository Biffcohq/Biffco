"use client"

import { Card, Input, Label, Button } from '@biffco/ui'
import { trpc } from '@/lib/trpc'

export default function ProfileSettingsPage() {
  const { data: profile } = trpc.workspaces.getProfile.useQuery()

  return (
    <div className="flex flex-col gap-8 animate-in fade-in">
      <div className="border-b border-border pb-6">
        <h1 className="text-2xl font-semibold text-text-primary">Tu Perfil</h1>
        <p className="text-sm text-text-secondary mt-1">Información de tu cuenta personal dentro de Biffco.</p>
      </div>

      <Card className="p-6 bg-surface border border-border flex flex-col gap-6">
        <div className="flex items-center gap-6 pb-6 border-b border-border border-dashed">
           <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold uppercase shadow-sm">
             {profile?.name ? profile.name.substring(0,2) : "US"}
           </div>
           <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm">Cambiar Avatar</Button>
              <span className="text-xs text-text-muted">Recomendado 256x256px PNG o JPG</span>
           </div>
        </div>

        <div className="flex flex-col gap-4 max-w-xl mt-2">
          <div className="grid gap-2">
            <Label htmlFor="fullname" className="text-slate-900">Nombre Completo</Label>
            <Input id="fullname" defaultValue={profile?.name || "Cargando..."} className="bg-surface text-text-primary" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-slate-900">Correo Electrónico Privado</Label>
            <Input id="email" defaultValue="admin@tu-workspace.com" className="bg-surface text-text-primary" />
          </div>
        </div>
      </Card>
      
      <div className="flex justify-start gap-3 mt-2">
         <Button>Guardar Perfil</Button>
      </div>
    </div>
  )
}
