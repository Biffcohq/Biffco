import { IconTruck, IconMapPin, IconClock, IconRoute } from '@tabler/icons-react'
import Link from 'next/link'

export function TransporterDashboard({ workspace }: { workspace: any }) {
  return (
    <div className="flex flex-col gap-6">
      {/* Label descriptivo de rol */}
      <h2 className="text-lg font-semibold border-b border-border pb-2 text-text-primary flex items-center gap-2">
        <IconTruck className="text-amber-500" size={20} />
        Panel del Transportista / Operador Logístico
      </h2>

      {/* KPI Cards especiales para transporte */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[ 
          { label: "En Tránsito Actuel", value: "14", icon: IconTruck, color: "text-amber-600", bg: "bg-amber-100" },
          { label: "Rutas Completadas", value: "342", icon: IconRoute, color: "text-indigo-600", bg: "bg-indigo-100" },
          { label: "Puntos de Control", value: "1,402", icon: IconMapPin, color: "text-teal-600", bg: "bg-teal-100" },
          { label: "Entregas a Tiempo", value: "99.2%", icon: IconClock, color: "text-emerald-600", bg: "bg-emerald-100" },
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
        
        {/* Custody Log (takes 2/3 of grid) */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl shadow-sm min-h-[400px] flex flex-col">
          <div className="px-6 py-4 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-semibold text-text-primary">Custodia Inmediata</h2>
            <button className="text-sm font-medium text-primary hover:text-primary-hover">Ver activos custodiados</button>
          </div>
          <div className="flex-1 p-6 flex flex-col gap-4">
            <div className="flex bg-surface-raised border border-border rounded-lg p-4 items-center gap-4">
               <div className="size-12 rounded-full bg-amber-100 flex items-center justify-center border border-amber-200">
                 <IconTruck size={24} className="text-amber-600" />
               </div>
               <div className="flex-1">
                 <p className="text-sm font-bold text-text-primary">Viaje #TRK-90022</p>
                 <p className="text-xs text-text-secondary w-full truncate">Origen: Estancia Don Alberto -&gt; Destino: Frigorífico Central</p>
               </div>
               <div>
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase rounded border border-amber-200">En Camino</span>
               </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center mt-4">
               <p className="text-sm text-text-muted">No hay más viajes pendientes de finalización.</p>
            </div>
          </div>
        </div>

        {/* Action Panel (takes 1/3) */}
        <div className="bg-surface border border-border rounded-xl shadow-sm min-h-[400px] flex flex-col">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-text-primary">Operaciones</h2>
          </div>
          <div className="flex-1 p-6 flex flex-col gap-3">
             <button className="w-full text-left p-4 border border-border rounded-xl hover:bg-surface-raised transition-colors flex items-center justify-between group">
               <div>
                 <span className="text-sm font-semibold text-text-primary block">Escanear Recepción (Hand-off)</span>
                 <span className="text-xs text-text-secondary block mt-1">Escanear pasaporte en punto de origen</span>
               </div>
               <IconMapPin className="text-text-muted group-hover:text-primary transition-colors" />
             </button>

             <button className="w-full text-left p-4 border border-border rounded-xl hover:bg-surface-raised transition-colors flex items-center justify-between group">
               <div>
                 <span className="text-sm font-semibold text-text-primary block">Reportar Punto de Control</span>
                 <span className="text-xs text-text-secondary block mt-1">Sellar ubicación actual en blockchain</span>
               </div>
               <IconClock className="text-text-muted group-hover:text-primary transition-colors" />
             </button>
          </div>
        </div>

      </div>
    </div>
  )
}
