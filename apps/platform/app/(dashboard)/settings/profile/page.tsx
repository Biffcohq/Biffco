"use client"

import React from "react"
import { Input, Label, Avatar, AvatarImage, AvatarFallback } from "@biffco/ui"
import { SectionCard } from "../components/SectionCard"

export default function ProfileSettingsPage() {
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Perfil Personal</h1>
        <p className="text-text-secondary mt-1 text-sm">Gestiona tu información pública, alias de sistema y datos de contacto.</p>
      </div>

      <SectionCard
        title="Avatar"
        description="Esta es la imagen de perfil que te representará en todo el hub."
        footerText="Recomendación: Usa una imagen cuadrada de al menos 96x96px."
        actionLabel="Subir Imagen"
      >
        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20 text-xl border border-border">
            <AvatarImage src="" />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-text-primary">Click en Guardar para aplicar cambios</span>
            <span className="text-xs text-text-secondary">Se acepta JPG, GIF o PNG. Máximo 2MB.</span>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Biffco Alias (Slug)"
        description="Este es tu identificador corto (slug) que puede ser usado al mencionarte o compartir tus espacios operacionales."
        footerText="Los alias deben ser alfanuméricos."
      >
        <div className="max-w-md flex flex-col gap-2">
          <Label htmlFor="alias" className="sr-only">Alias</Label>
          <div className="relative flex items-center">
             <span className="absolute left-3 text-text-secondary font-mono text-sm">@</span>
             <Input id="alias" defaultValue="admin-user" className="pl-8 bg-surface text-text-primary font-mono text-sm w-full" />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Información de Contacto"
        description="Tus medios de contacto registrados para notificaciones operativas."
        footerText="Asegúrate de que tu correo sea accesible."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="flex flex-col gap-2">
             <Label htmlFor="fullname">Nombre Completo</Label>
             <Input id="fullname" defaultValue="Administrador Global" className="bg-surface" />
           </div>
           
           <div className="flex flex-col gap-2">
             <Label htmlFor="email">Correo Electrónico</Label>
             <Input id="email" type="email" defaultValue="admin@biffco.co" className="bg-surface" />
           </div>

           <div className="flex flex-col gap-2">
             <Label htmlFor="phone">Número de Teléfono</Label>
             <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="bg-surface" />
           </div>

           <div className="flex flex-col gap-2">
             <Label htmlFor="address">Dirección de Sede</Label>
             <Input id="address" placeholder="Ej. Calle Falsa 123, BA" className="bg-surface" />
           </div>
        </div>
      </SectionCard>
    </>
  )
}
