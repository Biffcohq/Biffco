/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { IconPlus, IconMapPin, IconBuildingStore } from '@tabler/icons-react'
import { useState } from 'react'
import { trpc } from '@/lib/trpc'
// @ts-ignore: Next.js internal workspace resolution
import { Skeleton, Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, Button, Badge, toast } from '@biffco/ui'
import { MapView } from '@/app/components/MapView'

export default function FacilitiesPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list')
  const { data: facilitiesList, isLoading } = trpc.facilities.list.useQuery()
  
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null)
  
  // Fetch specific details (zones, pens) when a facility is selected
  const { data: activeFacilityDetail, isLoading: isLoadingDetail } = trpc.facilities.getById.useQuery(
    { id: selectedFacilityId! },
    { enabled: !!selectedFacilityId }
  )

  // Adapter para inyectar al mapa
  const mapFeatures = facilitiesList?.filter((f: any) => f.location).map((f: any) => ({
     id: f.id,
     type: 'Feature',
     properties: { ...f },
     geometry: f.location
  })) || []

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 h-[calc(100vh-6rem)]">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <IconBuildingStore size={24} className="text-primary" />
            Infraestructuras (Facilities)
          </h1>
          <p className="text-text-secondary text-sm">Gestiona tus áreas operativas geolocalizadas según el cumplimiento EUDR.</p>
        </div>
        <Button 
          onClick={() => toast.info("Modal de registro de Facility pendiente de conexión (Día 7)")}
          className="whitespace-nowrap w-fit"
        >
          <IconPlus size={18} />
          Registrar Infraestructura
        </Button>
      </div>

      <div className="flex items-center gap-2 bg-surface-raised p-1 rounded-lg w-fit border border-border shrink-0">
        <button 
          onClick={() => setActiveTab('list')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'list' ? 'bg-surface shadow-sm text-text-primary border border-border' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Vista de Lista
        </button>
        <button 
          onClick={() => setActiveTab('map')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'map' ? 'bg-surface shadow-sm text-text-primary border border-border' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Vista de Mapa (Geográfico)
        </button>
      </div>

      {activeTab === 'list' ? (
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pb-4">
           {isLoading ? (
             Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-[280px] w-full rounded-xl" />)
           ) : (
             facilitiesList?.map((facility: any) => (
                <div 
                  key={facility.id} 
                  onClick={() => setSelectedFacilityId(facility.id)}
                  className="bg-surface border border-border rounded-xl shadow-sm hover:shadow-md hover:border-primary/40 transition-all overflow-hidden flex flex-col cursor-pointer"
                >
                  <div className="h-32 bg-surface-raised border-b border-border relative">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://maps.wikimedia.org/osm-intl/12/1209/1539.png')] bg-cover bg-center"></div>
                    <div className="absolute top-3 right-3 bg-success/20 text-success border border-success/30 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                      Activo
                    </div>
                    <div className="absolute bottom-3 left-3 bg-surface/80 backdrop-blur-sm p-1.5 rounded-md border border-border text-text-primary shadow-sm flex gap-2 items-center">
                      <IconMapPin size={16} className="text-primary"/>
                      <span className="text-xs font-mono">{facility.type}</span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1 gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-text-primary">{facility.name}</h3>
                      <p className="text-text-secondary text-sm mt-1">{facility.country}</p>
                    </div>
                    
                    <div className="mt-auto border-t border-border pt-4 text-xs text-text-muted">
                       ID: <span className="font-mono">{facility.id}</span>
                    </div>
                  </div>
                </div>
             ))
           )}

           <button 
             onClick={() => toast.info("Modal de registro de Facility pendiente de conexión (Día 7)")}
             className="bg-surface-raised border-2 border-dashed border-border rounded-xl shadow-sm hover:bg-surface hover:border-primary/50 hover:text-primary transition-all flex flex-col items-center justify-center p-8 gap-3 min-h-[280px] text-text-secondary group"
           >
              <div className="size-12 rounded-full bg-surface border border-border flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-transform">
                 <IconPlus size={24} className="group-hover:text-primary" />
              </div>
              <div className="text-center">
                 <span className="font-semibold block text-text-primary group-hover:text-primary">Registrar Facility</span>
                 <span className="text-sm mt-1 block max-w-xs text-balance">Sube el polígono GeoJSON para cumplimiento EUDR.</span>
              </div>
           </button>
         </div>
      ) : (
         <div className="flex-1 bg-surface border border-border rounded-xl shadow-sm overflow-hidden relative flex flex-col z-0">
            {isLoading ? (
               <div className="absolute inset-0 flex items-center justify-center"><Skeleton className="h-full w-full" /></div>
            ) : (
               <MapView 
                  geoJsonData={mapFeatures} 
                  onFeatureClick={(feature: any) => setSelectedFacilityId(feature.properties.id)} 
               />
            )}
         </div>
      )}

      {/* Drawer Jerárquico al seleccionar un Facility */}
      <Drawer open={!!selectedFacilityId} onOpenChange={(open: boolean) => !open && setSelectedFacilityId(null)}>
        <DrawerContent className="p-0 right-0 left-auto h-full w-[400px] mt-0 rounded-l-2xl rounded-r-none border-l border-border bg-surface">
          <DrawerHeader className="border-b border-border text-left px-6 py-4 bg-surface-raised">
             <DrawerTitle className="text-xl flex items-center gap-2">
               {activeFacilityDetail?.name || 'Cargando...'}
             </DrawerTitle>
             <DrawerDescription>Jerarquía Operativa Geográfica</DrawerDescription>
          </DrawerHeader>
          <div className="p-6 overflow-y-auto">
             {isLoadingDetail ? (
               <div className="space-y-4">
                 <Skeleton className="h-20 w-full" />
                 <Skeleton className="h-20 w-full" />
                 <Skeleton className="h-20 w-full" />
               </div>
             ) : (
               <div className="flex flex-col gap-6">
                 {activeFacilityDetail?.zones?.length === 0 ? (
                    <div className="text-center p-8 bg-bg border border-border border-dashed rounded-xl">
                       <p className="text-text-muted text-sm">No hay Zonas / Lotes trazados dentro de este establecimiento.</p>
                       <Button variant="outline" size="sm" className="mt-4">Crear Zona</Button>
                    </div>
                 ) : (
                   activeFacilityDetail?.zones?.map((zone: any) => (
                     <div key={zone.id} className="border border-border rounded-xl bg-bg p-4 flex flex-col gap-3">
                       <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-text-primary">{zone.name}</h4>
                            <p className="text-xs font-mono text-text-secondary">{zone.type}</p>
                          </div>
                          <Badge variant={zone.gfwStatus === 'compliant' ? 'green' : 'gray'}>{zone.gfwStatus}</Badge>
                       </div>
                       
                       <div className="flex flex-col gap-2 border-t border-border pt-3 mt-1">
                          <span className="text-xs uppercase text-text-muted tracking-wider">Subdivisiones (Pens)</span>
                          {zone.pens?.length === 0 ? (
                             <span className="text-xs text-warning block p-2 bg-warning/10 rounded">Sin lotes internos</span>
                          ) : (
                            zone.pens?.map((pen: any) => (
                               <div key={pen.id} className="flex justify-between text-sm p-2 bg-surface-raised rounded border border-border/50">
                                 <span>{pen.name}</span>
                                 <span className="font-mono text-text-secondary">{pen.currentOccupancy}/{pen.capacity || '∞'}</span>
                               </div>
                            ))
                           )}
                       </div>
                     </div>
                   ))
                 )}
               </div>
             )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
