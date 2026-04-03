'use client';

import React from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { trpc } from '../../../lib/trpc';
// eslint-disable-next-line no-restricted-imports
import { VerticalAssetTable } from '../../lib/verticals/registry';

export default function AssetsDashboardPage() {
  const { workspaceId } = useAuthStore();
  
  // Trer datos genéricos del Workspace actual
  const { data: workspaceData, isLoading: isLoadingWs } = trpc.workspaces.getProfile.useQuery(
    undefined,
    { enabled: !!workspaceId }
  );

  // Traer Assets del Core (Totalmente Agnósticos)
  const { data: assets, isLoading: isLoadingAssets } = trpc.assets.list.useQuery(
    { limit: 100 },
    { enabled: !!workspaceId }
  );

  if (isLoadingWs) {
    return <div className="p-8 text-text-muted animate-pulse">Cargando entorno Biffco...</div>
  }

  if (!workspaceData) {
    return <div className="p-8 text-red-500">Workspace no encontrado</div>
  }

  // La magia de la IoC (Inversión de Control). El Dashboard no sabe de Vacas. Solo sabe que hay un Vertical.
  const vericalId = workspaceData.verticalId || 'livestock'; // Fallback a livestock para demos legacy si falta el campo

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 fade-in">
      
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text">Tus Activos Registrados</h1>
          <p className="text-text-muted mt-2">
            Mostrando visualización nativa para el motor vertical: <code className="bg-bg-subtle text-accent px-1 py-0.5 rounded ml-1">{vericalId}</code>
          </p>
        </div>
        <button className="bg-text text-bg px-4 py-2 rounded-md font-medium hover:opacity-90 transition-opacity">
          + Nuevo Registro
        </button>
      </div>

      <div className="bg-bg border border-border shadow-sm rounded-xl overflow-hidden">
        {/* Aquí Biffco inyecta el Componente Ganadero (o Minero, o Real Estate) pasándole los Assets puros del Core */}
        <VerticalAssetTable 
          verticalId={vericalId} 
          assets={assets || []} 
          isLoading={isLoadingAssets} 
        />
      </div>

    </div>
  )
}
