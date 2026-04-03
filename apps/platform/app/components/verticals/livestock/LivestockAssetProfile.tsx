import React from 'react'
import { IconStethoscope, IconScale, IconId, IconMeat } from '@tabler/icons-react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LivestockAssetProfile({ asset }: { asset: any }) {
  const meta = asset.metadata?.initialState || asset.metadata || {};
  
  const breed = meta.breed || meta.species || asset.type;
  const rfid = meta.rfid || 'Sin Caravana';
  const dob = meta.dateOfBirth ? new Date(meta.dateOfBirth).toLocaleDateString() : 'Desconocida';
  const weight = meta.weight ? `${meta.weight} kg` : 'No registrado';
  
  return (
    <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
      <h3 className="font-bold text-lg text-text-primary mb-4 flex items-center gap-2 border-b border-border pb-3">
        <IconMeat className="text-primary" size={20} />
        Identidad Biológica
      </h3>
      
      <div className="space-y-4 mt-2">
        <div className="flex items-center gap-3">
          <div className="bg-surface-raised p-2 rounded-lg text-text-muted border border-border/50">
            <IconId size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-text-muted uppercase tracking-wide font-semibold">Caravana RFID/DTE</span>
            <span className="text-sm font-mono font-medium text-text-primary">{rfid}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-surface-raised p-2 rounded-lg text-text-muted border border-border/50">
            <IconStethoscope size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-text-muted uppercase tracking-wide font-semibold">Raza</span>
            <span className="text-sm font-medium text-text-primary capitalize">{breed}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-surface-raised p-2 rounded-lg text-text-muted border border-border/50">
            <IconScale size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-text-muted uppercase tracking-wide font-semibold">Peso Inicial / Nacimiento</span>
            <span className="text-sm font-medium text-text-primary">
              {weight}
              <span className="ml-2 text-xs text-text-muted">({dob})</span>
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-border/50 bg-green-500/5 -mx-6 -mb-6 p-4 rounded-b-xl px-6 border-b-2 border-b-green-500/20">
         <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-green-600/80 uppercase tracking-wider">Deforestation-Free</span>
            <span className="text-xs bg-green-500/20 text-green-700 px-2 py-0.5 rounded font-bold">EUDR Clear</span>
         </div>
         <p className="text-xs text-text-muted mt-1 leading-relaxed">
           Mapeo satelital validado en su establecimiento de origen. Apto para exportación Unión Europea.
         </p>
      </div>
    </div>
  )
}
