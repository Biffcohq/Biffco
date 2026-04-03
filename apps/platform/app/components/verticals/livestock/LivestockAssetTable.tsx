import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LivestockAssetTable({ assets, isLoading }: { assets: any[], isLoading?: boolean }) {
  if (isLoading) return <div className="text-text-muted p-4">Cargando rodeo...</div>;
  if (!assets || assets.length === 0) return (
    <div className="text-text-muted p-8 text-center border border-dashed border-border rounded-lg bg-bg-subtle/30">
      No hay animales registrados en este establecimiento.
    </div>
  );

  return (
    <div className="overflow-x-auto w-full border border-border rounded-lg bg-bg">
      <table className="w-full text-left text-sm text-text-muted">
        <thead className="bg-bg-subtle text-text border-b border-border">
          <tr>
            <th className="px-4 py-3 font-medium">Biffco ID (Core)</th>
            <th className="px-4 py-3 font-medium">Especie / Raza</th>
            <th className="px-4 py-3 font-medium">Identificador (Caravana)</th>
            <th className="px-4 py-3 font-medium">Nacimiento</th>
            <th className="px-4 py-3 font-medium text-right">Estatus Legal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {assets.map((asset: any) => {
            const meta = asset.metadata?.initialState || asset.metadata || {};
            // El Core no sabe qué es "breed", pero este Inyector Frontend SÍ sabe
            const breedDisplay = meta.breed || meta.species || asset.type;
            const idDisplay = meta.rfid ? meta.rfid : (meta.headCount ? `${meta.headCount} Cabezas` : 'Sin Identificar');
            
            return (
              <tr key={asset.id} className="hover:bg-bg-subtle/50 transition-colors">
                <td className="px-4 py-4 font-mono text-xs text-text-muted/70" title={asset.id}>
                  {asset.id.slice(0, 10)}...
                </td>
                <td className="px-4 py-4 capitalize">{breedDisplay}</td>
                <td className="px-4 py-4 font-medium text-text">{idDisplay}</td>
                <td className="px-4 py-4">
                  {meta.dateOfBirth ? new Date(meta.dateOfBirth).toLocaleDateString() : '-'}
                </td>
                <td className="px-4 py-4 text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${asset.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}`}>
                    {asset.status === 'ACTIVE' ? 'Trazable' : asset.status}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
