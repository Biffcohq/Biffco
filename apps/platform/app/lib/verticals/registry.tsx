import React, { lazy, Suspense } from 'react';

const LivestockAssetTable = lazy(() => import('../../components/verticals/livestock/LivestockAssetTable'));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const registry: Record<string, any> = {
  livestock: {
    AssetTable: LivestockAssetTable
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function VerticalAssetTable({ verticalId, assets, isLoading }: { verticalId: string, assets: any[], isLoading?: boolean }) {
  const VerticalComponents = registry[verticalId];
  
  if (!VerticalComponents || !VerticalComponents.AssetTable) {
    return (
      <div className="p-8 text-center border border-dashed border-border rounded-lg text-text-muted">
        <p>No se encontró interfaz registrada para la vertical <code className="bg-bg-subtle px-1 py-0.5 rounded">{verticalId}</code>.</p>
        <p className="text-xs mt-2">Core Data: {assets?.length || 0} activos renderizables bajo el motor agnóstico.</p>
      </div>
    );
  }

  const Table = VerticalComponents.AssetTable;
  return (
    <Suspense fallback={<div className="animate-pulse bg-bg-subtle h-64 rounded-lg w-full"></div>}>
      <Table assets={assets} isLoading={isLoading} />
    </Suspense>
  )
}
