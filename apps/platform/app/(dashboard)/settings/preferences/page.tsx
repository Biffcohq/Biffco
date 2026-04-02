"use client"

import React from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Label, RadioGroup, RadioGroupItem } from "@biffco/ui"
import { SectionCard } from "../components/SectionCard"
import { IconDeviceDesktop, IconMoon, IconSun } from '@tabler/icons-react'

export default function PreferencesSettingsPage() {
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Preferencias de Interfaz</h1>
        <p className="text-text-secondary mt-1 text-sm">Ajusta el entorno gráfico, región y estándares monetarios para tu uso personal.</p>
      </div>

      <SectionCard
        title="Tema Visual (Theme)"
        description="Selecciona si prefieres trabajar con el motor gráfico en Modo Claro o Modo Oscuro."
        footerText="Tu preferencia se guardará en tu cuenta."
      >
        <RadioGroup defaultValue="system" className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {/* Light Mode */}
           <div className="flex flex-col items-center">
              <label 
                htmlFor="theme-light" 
                className="w-full aspect-[4/3] rounded-lg border-2 border-border hover:border-primary/50 bg-[#F5F5F5] overflow-hidden flex flex-col cursor-pointer transition-colors"
                has-parent-group="true"
              >
                  <div className="h-6 bg-white border-b border-[#E5E5E5] px-2 flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-400"></div>
                      <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 p-2 flex gap-2">
                     <div className="w-6 bg-white rounded border border-[#E5E5E5]"></div>
                     <div className="flex-1 bg-white rounded border border-[#E5E5E5]"></div>
                  </div>
              </label>
              <div className="flex items-center gap-2 mt-3 cursor-pointer">
                 <RadioGroupItem value="light" id="theme-light" />
                 <Label htmlFor="theme-light" className="text-sm font-medium flex gap-2 items-center"><IconSun size={14} className="text-amber-500" /> Claro (Light)</Label>
              </div>
           </div>

           {/* Dark Mode */}
           <div className="flex flex-col items-center">
              <label 
                htmlFor="theme-dark" 
                className="w-full aspect-[4/3] rounded-lg border-2 border-border hover:border-primary/50 bg-[#1A1A1A] overflow-hidden flex flex-col cursor-pointer transition-colors"
              >
                  <div className="h-6 bg-[#000000] border-b border-[#333333] px-2 flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500/80"></div>
                      <div className="w-2 h-2 rounded-full bg-amber-500/80"></div>
                      <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
                  </div>
                  <div className="flex-1 p-2 flex gap-2">
                     <div className="w-6 bg-[#000000] rounded border border-[#333333]"></div>
                     <div className="flex-1 bg-[#000000] rounded border border-[#333333]"></div>
                  </div>
              </label>
              <div className="flex items-center gap-2 mt-3 cursor-pointer">
                 <RadioGroupItem value="dark" id="theme-dark" />
                 <Label htmlFor="theme-dark" className="text-sm font-medium flex gap-2 items-center"><IconMoon size={14} className="text-indigo-400" /> Oscuro (Dark)</Label>
              </div>
           </div>

           {/* System Mode */}
           <div className="flex flex-col items-center">
              <label 
                htmlFor="theme-system" 
                className="w-full aspect-[4/3] rounded-lg border-2 border-primary bg-gradient-to-br from-[#F5F5F5] to-[#1A1A1A] overflow-hidden flex flex-col cursor-pointer transition-colors relative"
              >
                  <div className="absolute inset-0 flex items-center justify-center opacity-30">
                      <IconDeviceDesktop size={48} className="text-primary"/>
                  </div>
              </label>
              <div className="flex items-center gap-2 mt-3 cursor-pointer">
                 <RadioGroupItem value="system" id="theme-system" />
                 <Label htmlFor="theme-system" className="text-sm font-medium flex gap-2 items-center"><IconDeviceDesktop size={14} className="text-text-secondary" /> Sistema</Label>
              </div>
           </div>
        </RadioGroup>
      </SectionCard>

      <SectionCard
        title="Idioma de la Interfaz"
        description="Selecciona tu lenguaje base."
      >
        <div className="max-w-xs">
          <Select defaultValue="es" disabled>
             <SelectTrigger>
               <SelectValue placeholder="Idioma..." />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="es">Español (América Latina)</SelectItem>
               <SelectItem value="en">English (US)</SelectItem>
             </SelectContent>
          </Select>
        </div>
      </SectionCard>

      <SectionCard
        title="Estándares Regionales"
        description="Tu Huso Horario y Moneda determinan cómo se visualizan los reportes consolidados en toda la plataforma."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
           <div className="flex flex-col gap-2">
             <Label>Huso Horario</Label>
             <Select defaultValue="ba">
                <SelectTrigger>
                  <SelectValue placeholder="Zona..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ba">America/Argentina/Buenos_Aires (GMT-3)</SelectItem>
                  <SelectItem value="ny">America/New_York (EST)</SelectItem>
                  <SelectItem value="mad">Europe/Madrid (CET)</SelectItem>
                </SelectContent>
             </Select>
           </div>
           
           <div className="flex flex-col gap-2">
             <Label>Moneda Base</Label>
             <Select defaultValue="usd">
                <SelectTrigger>
                  <SelectValue placeholder="Moneda..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">Dólar Estadounidense (USD)</SelectItem>
                  <SelectItem value="ars">Peso Argentino (ARS)</SelectItem>
                  <SelectItem value="eur">Euro (EUR)</SelectItem>
                </SelectContent>
             </Select>
           </div>
        </div>
      </SectionCard>
    </>
  )
}
