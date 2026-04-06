import React, { lazy, Suspense } from 'react';

const LivestockAssetTable = lazy(() => import('../../components/verticals/livestock/LivestockAssetTable'));
const LivestockOriginationModal = lazy(() => import('../../components/verticals/livestock/LivestockOriginationModal'));
const LivestockAssetProfile = lazy(() => import('../../components/verticals/livestock/LivestockAssetProfile'));
const LivestockProducerDashboard = lazy(() => import('../../components/verticals/livestock/dashboards/LivestockProducerDashboard'));

// Fase 1 Pestañas de Inventario / Tablas
const LivestockAssetFeature = lazy(() => import('../../components/verticals/livestock/features/LivestockAssetFeature'));
const LivestockLotsFeature = lazy(() => import('../../components/verticals/livestock/features/LivestockLotsFeature'));
const LivestockFacilitiesFeature = lazy(() => import('../../components/verticals/livestock/features/LivestockFacilitiesFeature'));
const LivestockOriginationFeature = lazy(() => import('../../components/verticals/livestock/features/LivestockOriginationFeature'));
const LivestockAssetPassportFeature = lazy(() => import('../../components/verticals/livestock/features/LivestockAssetPassportFeature'));
const LivestockTransfersFeature = lazy(() => import('../../components/verticals/livestock/features/LivestockTransfersFeature'));

// --- Diccionarios de Dominio Vertical ---
import { 
  IconBox, IconVaccine, IconStethoscope, IconScale, IconFileCheck, IconPackageExport,
  IconBuildingEstate, IconMapPins, IconPackages, IconActivity, IconShieldCheck, IconTruckDelivery,
  IconUsers, IconDashboard, IconAlertTriangle
} from '@tabler/icons-react'

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
  },
  getRoleNavs: (workspaceId: string, roleContext: string) => {
    if (roleContext === 'PRODUCER') {
      return [
        {
          label: "Dashboard",
          items: [
            { label: "Dashboard Operativo", href: `/w/${workspaceId}/roles/producer`, icon: IconDashboard }
          ]
        },
        {
          label: "Hacienda y Ubicaciones",
          items: [
            { label: "Rodeo", href: `/w/${workspaceId}/roles/producer/assets`, icon: IconBox },
            { label: "Lotes / Tropas", href: `/w/${workspaceId}/roles/producer/lots`, icon: IconPackages },
            { label: "Establecimientos", href: `/w/${workspaceId}/roles/producer/facilities`, icon: IconBuildingEstate },
          ]
        },
        {
          label: "Operaciones",
          items: [
            { label: "Nacimientos / Registros", href: `/w/${workspaceId}/roles/producer/origination`, icon: IconActivity },
            { label: "Movimientos", href: `/w/${workspaceId}/roles/producer/moves`, icon: IconMapPins },
            { label: "Bajas / Incidencias", href: `/w/${workspaceId}/roles/producer/incidents`, icon: IconAlertTriangle }
          ]
        },
        {
          label: "Sanidad",
          items: [
            { label: "Vacunaciones", href: `/w/${workspaceId}/roles/producer/vaccines`, icon: IconVaccine },
            { label: "Tratamientos", href: `/w/${workspaceId}/roles/producer/health`, icon: IconStethoscope },
            { label: "Inspecciones", href: `/w/${workspaceId}/roles/producer/inspections`, icon: IconActivity },
          ]
        },
        {
          label: "Normativas y Certificaciones",
          items: [
            { label: "Compliance EUDR", href: `/w/${workspaceId}/roles/producer/eudr`, icon: IconShieldCheck },
            { label: "Certificados", href: `/w/${workspaceId}/roles/producer/certificates`, icon: IconFileCheck }
          ]
        },
        {
          label: "Transito",
          items: [
            { label: "Envios / Recepciones", href: `/w/${workspaceId}/roles/producer/transfers`, icon: IconTruckDelivery },
            { label: "DTE's", href: `/w/${workspaceId}/roles/producer/dte`, icon: IconFileCheck }
          ]
        },
        {
          label: "Organizacion",
          items: [
            { label: "Personal", href: `/w/${workspaceId}/settings/members`, icon: IconUsers },
            { label: "Inspectores", href: `/w/${workspaceId}/settings/inspectors`, icon: IconUsers }
          ]
        }
      ]
    }
    return null; // Fallback to agnostic Role header
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
  'livestock': { 
     AssetTable: LivestockAssetTable, 
     NewAssetModal: LivestockOriginationModal, 
     AssetProfile: LivestockAssetProfile,
     roles: {
       'PRODUCER': LivestockProducerDashboard
     },
     features: {
       // La key sigue el formato `roleId.featureId` o simplemente genérico si es para varios roles
       'PRODUCER.assets': LivestockAssetFeature,
       'PRODUCER.lots': LivestockLotsFeature,
       'PRODUCER.facilities': LivestockFacilitiesFeature,
       'PRODUCER.origination': LivestockOriginationFeature,
       'PRODUCER.asset-passport': LivestockAssetPassportFeature,
       'PRODUCER.transfers': LivestockTransfersFeature
     }
  },
  'bif-bovine-ar': { 
     AssetTable: LivestockAssetTable, 
     NewAssetModal: LivestockOriginationModal, 
     AssetProfile: LivestockAssetProfile,
     roles: {
       'PRODUCER': LivestockProducerDashboard
     },
     features: {
       'PRODUCER.assets': LivestockAssetFeature,
       'PRODUCER.lots': LivestockLotsFeature,
       'PRODUCER.facilities': LivestockFacilitiesFeature,
       'PRODUCER.origination': LivestockOriginationFeature,
       'PRODUCER.asset-passport': LivestockAssetPassportFeature,
       'PRODUCER.transfers': LivestockTransfersFeature
     }
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function VerticalRoleDashboard({ verticalId, roleId, workspace }: { verticalId: string, roleId: string, workspace: any }) {
  const VerticalComponents = registry[verticalId];
  
  if (VerticalComponents && VerticalComponents.roles && VerticalComponents.roles[roleId]) {
    const Dashboard = VerticalComponents.roles[roleId];
    return (
      <Suspense fallback={<div className="animate-pulse bg-surface-raised h-96 rounded-xl w-full mt-6"></div>}>
        <Dashboard workspace={workspace} />
      </Suspense>
    )
  }

  // Fallback to Agnostic generic layouts
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function VerticalRoleFeature({ verticalId, roleId, featureId, workspace }: { verticalId: string, roleId: string, featureId: string, workspace: any }) {
  const VerticalComponents = registry[verticalId];
  
  if (VerticalComponents && VerticalComponents.features) {
    // Intentamos buscar primero si el rol tiene un override para esta feature (ej. PRODUCER.assets)
    const exactOverrideKey = `${roleId}.${featureId}`;
    const FeatureComponent = VerticalComponents.features[exactOverrideKey] || VerticalComponents.features[featureId];

    if (FeatureComponent) {
      return (
        <Suspense fallback={<div className="animate-pulse bg-surface-raised h-[600px] rounded-xl w-full"></div>}>
          <FeatureComponent workspace={workspace} roleId={roleId} />
        </Suspense>
      )
    }
  }

  // Fallback si la feature aun no esta programada
  return (
    <div className="p-8 border border-border bg-surface rounded-xl">
        <h2 className="text-lg font-bold text-text-primary uppercase flex gap-2">
          Pestaña {featureId}
        </h2>
        <p className="text-sm text-text-muted mt-2">Módulo en construcción para el rol {roleId} y vertical {verticalId}.</p>
    </div>
  )
}
