import React from 'react'

export default function WorkspaceSettingsPage() {
  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold text-text-primary">Configuración de la Cadena / Vertical</h1>
        <p className="text-text-secondary text-sm">
          Ajustes paramétricos específicos para esta vertical de operaciones.
        </p>
      </div>
      
      <div className="bg-surface border border-border rounded-xl p-8 flex flex-col items-center justify-center text-center gap-4 py-20">
        <div className="p-4 bg-primary/10 text-primary rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>
        </div>
        <div className="flex flex-col items-center gap-1">
          <h3 className="font-medium text-text-primary">Parámetros de Vertical en Desarrollo</h3>
          <p className="text-text-muted text-sm max-w-sm">
             Aquí se centralizarán las alertas, el onboarding de roles locales, los SLAs de cumplimiento, y otras normativas para la red.
          </p>
        </div>
      </div>
    </div>
  )
}
