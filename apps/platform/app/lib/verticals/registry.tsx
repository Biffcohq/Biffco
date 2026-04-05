import React, { lazy, Suspense } from 'react';

const LivestockAssetTable = lazy(() => import('../../components/verticals/livestock/LivestockAssetTable'));
const LivestockOriginationModal = lazy(() => import('../../components/verticals/livestock/LivestockOriginationModal'));
const LivestockAssetProfile = lazy(() => import('../../components/verticals/livestock/LivestockAssetProfile'));

// --- Diccionarios de Dominio Vertical ---
import { IconBox, IconVaccine, IconStethoscope, IconScale, IconFileCheck, IconPackageExport } from '@tabler/icons-react'

const livestockDictionary = {
  assetTypeName: "Animal (Bovino)",
  derivedAssetTypeName: "Corte / Derivado",
  splitDefaultInputs: [{ type: 'MeatCut', metadata: { weight: 10, category: 'A' }, quantity: 1 }],
  events: {
    'LIVESTOCK_ORIGINATED': { title: 'Nacimiento Registrado', icon: IconBox, bgColor: 'bg-blue-100', textColor: 'text-blue-600', ringColor: 'ring-blue-50' },
    'HEALTH_CERT_ISSUED': { title: 'Certificado de DTE (Senasa)', icon: IconFileCheck, bgColor: 'bg-emerald-100', textColor: 'text-emerald-600', ringColor: 'ring-emerald-50' },
    'TREATMENT_ADMINISTERED': { title: 'Tratamiento Sanitario', icon: IconStethoscope, bgColor: 'bg-red-100', textColor: 'text-red-600', ringColor: 'ring-red-50' },
    'VACCINE_ADMINISTERED': { title: 'Vacunación', icon: IconVaccine, bgColor: 'bg-indigo-100', textColor: 'text-indigo-600', ringColor: 'ring-indigo-50' },
    'SLAUGHTER_COMPLETED': { title: 'Faena Completada', icon: IconScale, bgColor: 'bg-rose-100', textColor: 'text-rose-600', ringColor: 'ring-rose-50' },
  }
}

const agnosticDictionary = {
  assetTypeName: "Activo Base",
  derivedAssetTypeName: "Fracción / Derivado",
  splitDefaultInputs: [{ type: 'Fraction', metadata: { weight: 0 }, quantity: 1 }],
  events: {}
}

export function getVerticalDictionary(verticalId: string): any {
  if (['livestock', 'bif-bovine-ar'].includes(verticalId)) return livestockDictionary
  return agnosticDictionary
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const registry: Record<string, any> = {
  'livestock': { AssetTable: LivestockAssetTable, NewAssetModal: LivestockOriginationModal, AssetProfile: LivestockAssetProfile },
  'bif-bovine-ar': { AssetTable: LivestockAssetTable, NewAssetModal: LivestockOriginationModal, AssetProfile: LivestockAssetProfile }
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

export function VerticalAssetModal({ verticalId, isOpen, onClose }: { verticalId: string, isOpen: boolean, onClose: () => void }) {
  const VerticalComponents = registry[verticalId];
  if (!VerticalComponents || !VerticalComponents.NewAssetModal) return null;

  const Modal = VerticalComponents.NewAssetModal;
  return (
    <Suspense fallback={null}>
      <Modal isOpen={isOpen} onClose={onClose} />
    </Suspense>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function VerticalAssetProfile({ verticalId, asset }: { verticalId: string, asset: any }) {
  const VerticalComponents = registry[verticalId];
  if (!VerticalComponents || !VerticalComponents.AssetProfile) return (
     <div className="bg-surface border border-border p-4 rounded-lg text-text-muted text-sm text-center">
       Perfil biológico no disponible para la vertical <code className="bg-bg-subtle px-1 py-0.5 rounded">{verticalId}</code>
     </div>
  );

  const Profile = VerticalComponents.AssetProfile;
  return (
    <Suspense fallback={<div className="animate-pulse bg-surface-raised h-48 rounded-xl w-full"></div>}>
      <Profile asset={asset} />
    </Suspense>
  )
}
