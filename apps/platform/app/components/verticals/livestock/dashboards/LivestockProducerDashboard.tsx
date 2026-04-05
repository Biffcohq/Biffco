import React from 'react'
import {
  IconBox,
  IconPackages,
  IconMapPins,
  IconBuildingEstate,
  IconShieldCheck,
  IconAlertTriangle,
  IconHeartbeat,
  IconPlus,
  IconLayoutGridAdd,
  IconReportMedical,
  IconClock,
  IconPackageExport,
  IconChevronRight
} from '@tabler/icons-react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LivestockProducerDashboard({ workspace }: { workspace: any }) {
  // En el futuro, estos KPIs vendrán vía trpc.workspaces.getLivestockMetrics.useQuery()
  const MOCK_DATA = {
    cabezasTotales: 2150,
    lotesActivos: 14,
    establecimientos: 2,
    alertasEUDR: {
      sinPoligono: 45,
      highRisk: 0,
      limpios: 2105,
    },
    incidencias: {
      cuarentena: 0,
      extraviados: 2,
      muertesMes: 3
    },
    categorias: [
      { name: 'Vacas', count: 950 },
      { name: 'Terneros', count: 680 },
      { name: 'Novillos', count: 420 },
      { name: 'Toros', count: 100 },
    ],
    actividad: [
      { actor: 'Tú', action: 'Registró Nacimiento', asset: 'EID 4920', time: 'hace 2 horas' },
      { actor: 'Vet. Díaz', action: 'Administró Tratamiento', asset: 'Lote Recría A', time: 'hace 5 horas' },
      { actor: 'Tú', action: 'Movimiento a Corral 3', asset: 'Tropa Destete', time: 'ayer' }
    ]
  }

  const eudrColor = MOCK_DATA.alertasEUDR.highRisk > 0 ? 'text-error bg-error/10 border-error/20' 
                  : MOCK_DATA.alertasEUDR.sinPoligono > 0 ? 'text-amber-600 bg-amber-50 border-amber-200' 
                  : 'text-success bg-success/10 border-success/20';

  return (
    <div className="flex flex-col gap-6 md:gap-8 pb-12 animate-in fade-in zoom-in-95 duration-500">
      
      {/* HEADER & CTAs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            Panel Operativo: Productor Ganadero
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Gestión centralizada de hacienda, compliance EUDR y operaciones diarias para {workspace?.name}.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <button className="h-10 px-4 rounded-lg bg-surface border border-border font-medium text-sm text-text-primary hover:bg-bg-subtle transition-colors flex items-center gap-2 shadow-sm">
              <IconLayoutGridAdd size={18} />
              <span className="hidden sm:inline">Formar Tropa</span>
           </button>
           <button className="h-10 px-4 rounded-lg bg-primary hover:bg-primary-hover text-white font-medium text-sm transition-colors flex items-center gap-2 shadow-sm">
              <IconPlus size={18} stroke={2.5} />
              <span>Registrar Animal</span>
           </button>
        </div>
      </div>

      {/* KPI PRINCIPALES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-border p-4 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
             <span className="text-sm font-medium text-text-secondary">Cabezas Activas</span>
             <IconBox size={20} className="text-text-muted" />
          </div>
          <div className="mt-4">
             <span className="text-3xl font-bold text-text-primary">{MOCK_DATA.cabezasTotales.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="bg-surface border border-border p-4 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
             <span className="text-sm font-medium text-text-secondary">Tropas / Lotes</span>
             <IconPackages size={20} className="text-text-muted" />
          </div>
          <div className="mt-4">
             <span className="text-3xl font-bold text-text-primary">{MOCK_DATA.lotesActivos}</span>
          </div>
        </div>

        <div className="bg-surface border border-border p-4 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
             <span className="text-sm font-medium text-text-secondary">Establecimientos</span>
             <IconBuildingEstate size={20} className="text-text-muted" />
          </div>
          <div className="mt-4">
             <span className="text-3xl font-bold text-text-primary">{MOCK_DATA.establecimientos}</span>
             <p className="text-xs text-text-muted mt-1">Con RENSPA verificado</p>
          </div>
        </div>

        <div className={`border p-4 rounded-2xl shadow-sm flex flex-col justify-between ${eudrColor}`}>
          <div className="flex justify-between items-start">
             <span className="text-sm font-bold uppercase tracking-wider">Status EUDR</span>
             <IconShieldCheck size={20} />
          </div>
          <div className="mt-4 flex flex-col">
             <span className="text-2xl font-black">{((MOCK_DATA.alertasEUDR.limpios / MOCK_DATA.cabezasTotales) * 100).toFixed(1)}%</span>
             <p className="text-xs font-medium opacity-80 mt-1 uppercase tracking-tight">Hacienda Libre Deforestación</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* LEFT COL: DISTRIBUCIÓN & ALERTAS (2/3) */}
         <div className="lg:col-span-2 flex flex-col gap-6">
            
            <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
               <div className="p-5 border-b border-border bg-bg-subtle/50 flex justify-between items-center">
                  <h3 className="font-semibold text-text-primary">Distribución de Hacienda</h3>
                  <button className="text-xs font-semibold text-primary hover:underline">Ver inventario completo</button>
               </div>
               <div className="p-6">
                  {/* Fake Bar Chart / Progress */}
                  <div className="flex h-6 w-full rounded-full overflow-hidden antialiased">
                     <div className="bg-primary/90 h-full" style={{width: `${(MOCK_DATA.categorias[0].count / MOCK_DATA.cabezasTotales)*100}%`}}></div>
                     <div className="bg-teal-500/90 h-full" style={{width: `${(MOCK_DATA.categorias[1].count / MOCK_DATA.cabezasTotales)*100}%`}}></div>
                     <div className="bg-indigo-500/90 h-full" style={{width: `${(MOCK_DATA.categorias[2].count / MOCK_DATA.cabezasTotales)*100}%`}}></div>
                     <div className="bg-amber-500/90 h-full" style={{width: `${(MOCK_DATA.categorias[3].count / MOCK_DATA.cabezasTotales)*100}%`}}></div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                     {MOCK_DATA.categorias.map(c => (
                        <div key={c.name} className="flex flex-col">
                           <span className="text-2xl font-bold text-text-primary">{c.count}</span>
                           <span className="text-xs font-medium text-text-secondary uppercase">{c.name}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
               <div className="p-5 border-b border-border bg-bg-subtle/50">
                  <h3 className="font-semibold text-text-primary flex items-center gap-2">
                     <IconAlertTriangle size={18} className="text-amber-500" />
                     Bajas e Incidencias Críticas
                  </h3>
               </div>
               {MOCK_DATA.incidencias.extraviados > 0 || MOCK_DATA.incidencias.muertesMes > 0 || MOCK_DATA.alertasEUDR.sinPoligono > 0 ? (
                  <div className="p-0 flex flex-col divide-y divide-border">
                     {MOCK_DATA.alertasEUDR.sinPoligono > 0 && (
                        <div className="p-4 flex items-start gap-4 hover:bg-bg-subtle/30 transition-colors">
                           <div className="mt-0.5 size-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shrink-0">
                              <IconMapPins size={16} />
                           </div>
                           <div className="flex-1">
                              <p className="text-sm font-medium text-text-primary">Animales sin polígono de origen detectados</p>
                              <p className="text-xs text-text-secondary line-clamp-1">Hay {MOCK_DATA.alertasEUDR.sinPoligono} cabezas que no tienen su `Zone` asignado a nivel de coordenadas geológicas.</p>
                           </div>
                           <button className="text-xs font-semibold px-3 py-1.5 border border-border rounded-md hover:bg-surface-raised">Asignar Zone</button>
                        </div>
                     )}
                     {MOCK_DATA.incidencias.extraviados > 0 && (
                        <div className="p-4 flex items-start gap-4 hover:bg-bg-subtle/30 transition-colors">
                           <div className="mt-0.5 size-8 bg-error/10 text-error rounded-full flex items-center justify-center shrink-0">
                              <IconAlertTriangle size={16} />
                           </div>
                           <div className="flex-1">
                              <p className="text-sm font-medium text-text-primary">Incidencia de Extravío Abierta</p>
                              <p className="text-xs text-text-secondary line-clamp-1">{MOCK_DATA.incidencias.extraviados} animales reportados como perdidos. Status: LOST.</p>
                           </div>
                           <button className="text-xs font-semibold px-3 py-1.5 border border-border rounded-md hover:bg-surface-raised">Ver detalle</button>
                        </div>
                     )}
                  </div>
               ) : (
                  <div className="p-8 text-center text-text-muted">
                     <IconHeartbeat size={40} className="mx-auto opacity-20 mb-3" />
                     <p className="text-sm">Todo en orden. No hay alertas mayores en el rodeo.</p>
                  </div>
               )}
            </div>

         </div>

         {/* RIGHT COL: TIMELINE (1/3) */}
         <div className="bg-surface border border-border rounded-xl shadow-sm flex flex-col h-full max-h-[600px]">
            <div className="p-5 border-b border-border">
               <h3 className="font-semibold text-text-primary flex items-center gap-2">
                  <IconClock size={18} className="text-text-muted" />
                  Actividad Reciente
               </h3>
            </div>
            
            <div className="p-5 flex-1 overflow-y-auto">
               <div className="relative border-l border-border ml-3 pb-4 space-y-6">
                  {MOCK_DATA.actividad.map((act, i) => (
                     <div key={i} className="pl-6 relative">
                        <div className="absolute w-3 h-3 bg-white border-2 border-primary rounded-full -left-[6.5px] top-1"></div>
                        <p className="text-xs text-text-muted mb-1">{act.time}</p>
                        <p className="text-sm font-medium text-text-primary">{act.action}</p>
                        <p className="text-xs text-text-secondary mt-0.5">
                           <span className="font-semibold">{act.actor}</span> sobre <span className="bg-bg-subtle px-1.5 py-0.5 rounded text-text-primary font-mono">{act.asset}</span>
                        </p>
                     </div>
                  ))}
               </div>
            </div>

            <div className="p-3 border-t border-border bg-bg-subtle/30 text-center">
               <button className="text-xs font-semibold text-text-secondary hover:text-text-primary w-full py-1">Ver Event Store completo</button>
            </div>
         </div>
      </div>
    </div>
  )
}
