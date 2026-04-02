"use client"

import { IconPackage, IconFileCheck, IconActivity, IconAlertCircle } from '@tabler/icons-react'
import { trpc } from '@/lib/trpc'
import { Skeleton } from '@/app/components/ui/Skeleton'
import Link from 'next/link'

export default function PlatformRoot() {
  const { data: workspace, isLoading } = trpc.workspaces.getProfile.useQuery()

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Header section */}
      <div className="flex flex-col gap-1">
        {isLoading ? (
          <Skeleton className="h-9 w-64 rounded-md" />
        ) : (
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Bienvenido a {workspace?.name}</h1>
        )}
        <p className="text-text-secondary text-base">Aquí tienes un resumen de la actividad reciente en tu espacio.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[ 
          { label: "Assets Activos", value: "245", icon: IconPackage, color: "text-primary", bg: "bg-primary/10" },
          { label: "Eventos Anclados", value: "1,204", icon: IconFileCheck, color: "text-teal", bg: "bg-teal/10" },
          { label: "Alertas EUDR", value: "3", icon: IconAlertCircle, color: "text-error", bg: "bg-error/10" },
          { label: "Nivel de Salud", value: "98%", icon: IconActivity, color: "text-success", bg: "bg-success/10" },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-surface border border-border rounded-xl p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow cursor-default">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{kpi.label}</span>
              <span className="text-2xl font-bold text-text-primary">{kpi.value}</span>
            </div>
            <div className={`size-10 rounded-full flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
              <kpi.icon size={22} stroke={2} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Events (takes 2/3 of grid) */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl shadow-sm min-h-[400px] flex flex-col">
          <div className="px-6 py-4 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-semibold text-text-primary">Eventos Recientes</h2>
            <button className="text-sm font-medium text-primary hover:text-primary-hover">Ver todos</button>
          </div>
          <div className="flex-1 p-6 flex items-center justify-center flex-col text-center gap-3">
             <div className="size-16 rounded-full bg-surface-raised flex items-center justify-center border border-border">
               <IconFileCheck size={28} className="text-text-muted" stroke={1.5} />
             </div>
             <div>
               <p className="text-sm font-medium text-text-primary">No hay eventos recientes</p>
               <p className="text-xs text-text-secondary">Parece que aún no has registrado operaciones en la cadena de custodia.</p>
             </div>
             <Link href={`/w/${workspace?.id}/events/new`} className="mt-2 text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-full text-sm font-medium transition-colors">
               Registrar primer evento
             </Link>
          </div>
        </div>

        {/* Quick Actions or Analytics (takes 1/3) */}
        <div className="bg-surface border border-border rounded-xl shadow-sm min-h-[400px] flex flex-col">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-text-primary">Riesgo Global (EUDR)</h2>
          </div>
          <div className="flex-1 p-6 flex flex-col items-center justify-center gap-4">
             {/* Chart placeholder */}
             <div className="size-32 rounded-full border-8 border-success flex items-center justify-center relative shadow-sm">
                <span className="text-3xl font-bold text-success flex items-baseline">
                  98<span className="text-lg">%</span>
                </span>
             </div>
             <div className="text-center mt-2">
                <p className="text-sm font-semibold text-text-primary">Compatibilidad Muy Alta</p>
                <p className="text-xs text-text-secondary mt-1">El 98% de tus lotes provienen de zonas sin deforestación registrada desde 2020.</p>
             </div>
          </div>
        </div>

        {/* Access to Vertical Engine (Agnostic Launcher) */}
        <div className="lg:col-span-3 bg-primary/5 border border-primary/20 rounded-xl shadow-sm p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-primary mb-1">Entorno de Producción Vertical</h2>
              <p className="text-sm text-text-secondary">Accede a la aplicación específica de tu industria para registrar procesos, despachos y transformaciones.</p>
            </div>
            {isLoading || !workspace?.id ? (
              <div className="flex items-center justify-center w-48 h-11 bg-primary/50 text-white rounded-full font-bold cursor-not-allowed">
                 Cargando...
              </div>
            ) : (
              <a href={`//verticals.biffco.co/${workspace.id}`} className="flex items-center justify-center gap-2 w-48 h-11 bg-primary text-white hover:bg-primary-hover active:scale-95 rounded-full font-bold transition-all duration-200">
                 Abrir Operativa Especializada <IconPackage size={18}/>
              </a>
            )}
        </div>

      </div>
    </div>
  );
}
