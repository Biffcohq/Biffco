import { IconEye, IconFileReport, IconGavel } from '@tabler/icons-react'
import Link from 'next/link'

export function AuditorDashboard({ workspace }: { workspace: any }) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold border-b border-border pb-2 text-text-primary flex items-center gap-2">
        <IconEye className="text-blue-500" size={20} />
        Panel de Auditoría y Control Exclusivo
      </h2>

      {/* KPI Cards especiales para Auditor */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[ 
          { label: "Alertas Leves (Observación)", value: "24", icon: IconFileReport, color: "text-blue-600", bg: "bg-blue-100" },
          { label: "Sanciones / Bloqueos Activos", value: "3", icon: IconGavel, color: "text-red-600", bg: "bg-red-100" },
          { label: "Score de Transparencia Global", value: "A+", icon: IconEye, color: "text-indigo-600", bg: "bg-indigo-100" },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-surface border border-border rounded-xl p-5 shadow-sm flex items-center justify-between">
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
      
      <div className="bg-surface border border-border rounded-xl p-6 text-center shadow-sm">
         <p className="text-sm text-text-primary mb-2">Este rol pertenece a un agente externo o gubernamental y mantiene permisos <strong>Solo Lectura (Read Only)</strong>.</p>
         <Link href={`/w/${workspace?.id}/assets`} className="text-primary hover:text-primary-hover text-sm font-medium">
            Acceder al motor de búsqueda de trazabilidad (Ledger) -&gt;
         </Link>
      </div>
    </div>
  )
}
