import dynamic from 'next/dynamic'
const MapWrapper = dynamic(
  () => import('./MapWrapper').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-surface-raised border border-border rounded-xl">
        <div className="animate-pulse flex items-center justify-center rounded-full h-12 w-12 bg-surface text-primary border border-border mb-4 font-bold text-xs">Map</div>
        <p className="text-sm text-text-secondary font-medium">Cargando motor geográfico...</p>
      </div>
    ),
  }
)

export function MapView(props: Record<string, unknown>) {
  return <MapWrapper {...props} />
}
