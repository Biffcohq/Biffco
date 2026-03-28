"use client"

import { IconPackage, IconPlus, IconMapPin, IconBuildingStore } from '@tabler/icons-react'
import { useState } from 'react'

export default function FacilitiesPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list')

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 h-full">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <IconBuildingStore size={24} className="text-primary" />
            Facilities (Establecimientos)
          </h1>
          <p className="text-text-secondary text-sm">Gestiona tus áreas operativas geolocalizadas según EUDR.</p>
        </div>
        <button className="bg-primary text-white hover:bg-primary-hover px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
          <IconPlus size={18} />
          Nuevo Facility
        </button>
      </div>

      <div className="flex items-center gap-2 bg-surface-raised p-1 rounded-lg w-fit border border-border">
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
          Vista de Mapa
        </button>
      </div>

      {activeTab === 'list' ? (
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
           {/* Facility Card Mock */}
           <div className="bg-surface border border-border rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col cursor-default">
             <div className="h-32 bg-surface-raised border-b border-border relative">
               {/* Map snippet mock inside card */}
               <div className="absolute inset-0 opacity-20 bg-[url('https://maps.wikimedia.org/osm-intl/12/1209/1539.png')] bg-cover bg-center"></div>
               <div className="absolute top-3 right-3 bg-success/20 text-success border border-success/30 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                 Activo
               </div>
               <div className="absolute bottom-3 left-3 bg-surface/80 backdrop-blur-sm p-1.5 rounded-md border border-border text-text-primary shadow-sm">
                 <IconMapPin size={18} />
               </div>
             </div>
             <div className="p-5 flex flex-col flex-1 gap-4">
               <div>
                 <h3 className="text-lg font-bold text-text-primary">Estancia La Esperanza</h3>
                 <p className="text-text-secondary text-sm mt-1">Buenos Aires, Argentina</p>
               </div>
               
               <div className="grid grid-cols-2 gap-3 mt-auto border-t border-border pt-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-text-muted font-medium uppercase tracking-wider">Lotes</span>
                    <span className="text-text-primary font-semibold">12 Zonas</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-text-muted font-medium uppercase tracking-wider">Hectáreas</span>
                    <span className="text-text-primary font-semibold">1,240 ha</span>
                  </div>
               </div>
             </div>
           </div>

           {/* Add New Mock Card */}
           <button className="bg-surface-raised border-2 border-dashed border-border rounded-xl shadow-sm hover:bg-surface hover:border-primary/50 hover:text-primary transition-all flex flex-col items-center justify-center p-8 gap-3 min-h-[280px] text-text-secondary group">
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
         <div className="flex-1 bg-surface border border-border rounded-xl shadow-sm min-h-[500px] overflow-hidden relative flex flex-col">
            <div className="absolute inset-0 bg-surface-raised flex items-center justify-center flex-col z-0">
               {/* Temporary Mock for the Map */}
               <IconMapPin size={48} className="text-border mb-4" stroke={1} />
               <p className="text-text-secondary text-sm text-balance max-w-sm text-center">
                 La integración oficial de Leaflet se habilitará en el próximo checkpoint del Sprint.
               </p>
            </div>
         </div>
      )}
    </div>
  )
}
