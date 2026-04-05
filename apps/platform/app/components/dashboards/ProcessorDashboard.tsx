import { IconBuildingFactory, IconArrowsSplit, IconArrowMerge, IconShieldCheck } from '@tabler/icons-react'
import Link from 'next/link'

export function ProcessorDashboard({ workspace }: { workspace: any }) {
  return (
    <div className="flex flex-col gap-6">
      {/* Label descriptivo de rol */}
      <h2 className="text-lg font-semibold border-b border-border pb-2 text-text-primary flex items-center gap-2">
        <IconBuildingFactory className="text-rose-500" size={20} />
        Panel de Manufactura / Planta Procesadora
      </h2>

      {/* KPI Cards especiales para transformador */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[ 
          { label: "Planta y Almacén", value: "89", icon: IconBuildingFactory, color: "text-rose-600", bg: "bg-rose-100" },
          { label: "Fraccionamientos", value: "4.2k", icon: IconArrowsSplit, color: "text-orange-600", bg: "bg-orange-100" },
          { label: "Consolidaciones", value: "112", icon: IconArrowMerge, color: "text-fuchsia-600", bg: "bg-fuchsia-100" },
          { label: "Activos Aprobados", value: "100%", icon: IconShieldCheck, color: "text-emerald-600", bg: "bg-emerald-100" },
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
        
        {/* Transform Log (takes 1/3 of grid) */}
        <div className="bg-surface border border-border rounded-xl shadow-sm min-h-[400px] flex flex-col">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-text-primary">Acciones Rápidas</h2>
          </div>
          <div className="flex-1 p-6 flex flex-col gap-3">
             <Link href={`/w/${workspace?.id}/assets`} className="w-full text-left p-4 border border-border rounded-xl hover:bg-surface-raised transition-colors flex items-center justify-between group">
               <div>
                 <span className="text-sm font-semibold text-text-primary block">Ver Inventario</span>
                 <span className="text-xs text-text-secondary block mt-1">Inspeccionar materia recibida</span>
               </div>
               <IconShieldCheck className="text-text-muted group-hover:text-primary transition-colors" />
             </Link>

             <button className="w-full text-left p-4 border border-border rounded-xl hover:bg-surface-raised transition-colors flex items-center justify-between group cursor-not-allowed opacity-50">
               <div>
                 <span className="text-sm font-semibold text-text-primary block">Nueva Transformación 1 a N</span>
                 <span className="text-xs text-text-secondary block mt-1">Requiere elegir un activo origen</span>
               </div>
               <IconArrowsSplit className="text-text-muted transition-colors" />
             </button>
             
             <button className="w-full text-left p-4 border border-border rounded-xl hover:bg-surface-raised transition-colors flex items-center justify-between group cursor-not-allowed opacity-50">
               <div>
                 <span className="text-sm font-semibold text-text-primary block">Consolidar Lotes (N a 1)</span>
                 <span className="text-xs text-text-secondary block mt-1">Armar expedición de exportación</span>
               </div>
               <IconArrowMerge className="text-text-muted transition-colors" />
             </button>
          </div>
        </div>

        {/* Process Log (takes 2/3) */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl shadow-sm min-h-[400px] flex flex-col">
          <div className="px-6 py-4 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-semibold text-text-primary">Últimas Transformaciones</h2>
            <button className="text-sm font-medium text-primary hover:text-primary-hover">Explorar registro</button>
          </div>
          <div className="flex-1 p-6 flex flex-col items-center justify-center gap-3 text-center">
             <div className="size-16 rounded-full bg-surface-raised flex items-center justify-center border border-border">
               <IconBuildingFactory size={28} className="text-text-muted" stroke={1.5} />
             </div>
             <div>
               <p className="text-sm font-medium text-text-primary">No hay historial industrial</p>
               <p className="text-xs text-text-secondary max-w-sm">No se han registrado procesos industriales. Selecciona un activo recibido para transformarlo.</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  )
}
