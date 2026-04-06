'use client'

import React from 'react'
import { IconTruckDelivery, IconMapPins, IconClipboardList } from '@tabler/icons-react'
import Link from 'next/link'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LivestockCarrierDashboard({ workspace }: { workspace: any }) {
  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-500 pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
          Panel Logístico
        </h1>
        <p className="text-text-muted">
          Gestor de manifiestos y despacho para {workspace?.name}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-surface border border-border rounded-xl p-6 flex flex-col gap-3">
            <div className="text-blue-500 mb-2">
               <IconClipboardList size={32} stroke={1.5} />
            </div>
            <h3 className="text-lg font-bold text-text-primary">Cargas Asignadas</h3>
            <p className="text-sm text-text-muted flex-1">
               Ver manifiestos pendientes de origen que aguardan recolección por su flota.
            </p>
            <Link 
               href={`/w/${workspace?.id}/roles/carrier/routes`}
               className="text-sm font-semibold text-primary hover:underline mt-2"
            >
               Ir a Hojas de Ruta &rarr;
            </Link>
         </div>

         <div className="bg-surface border border-border rounded-xl p-6 flex flex-col gap-3">
            <div className="text-emerald-500 mb-2">
               <IconTruckDelivery size={32} stroke={1.5} />
            </div>
            <h3 className="text-lg font-bold text-text-primary">Camiones en Tránsito</h3>
            <p className="text-sm text-text-muted flex-1">
               Monitorear viajes activos hasta su confirmación por el frigorífico o destino.
            </p>
            <Link 
               href={`/w/${workspace?.id}/roles/carrier/routes`}
               className="text-sm font-semibold text-primary hover:underline mt-2"
            >
               Ver Tránsito &rarr;
            </Link>
         </div>

         <div className="bg-surface border border-border rounded-xl p-6 flex flex-col gap-3">
            <div className="text-text-secondary mb-2">
               <IconMapPins size={32} stroke={1.5} />
            </div>
            <h3 className="text-lg font-bold text-text-primary">Historial Operativo</h3>
            <p className="text-sm text-text-muted flex-1">
               Consulte registros históricos de fletes concretados o rechazados.
            </p>
            <Link 
               href={`/w/${workspace?.id}/roles/carrier/routes`}
               className="text-sm font-semibold text-text-primary hover:underline mt-2"
            >
               Revisar Archivo &rarr;
            </Link>
         </div>
      </div>
    </div>
  )
}
