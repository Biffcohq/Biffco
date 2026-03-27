export * from './components/Button'
export * from './components/Input'
export * from './components/Card'
export * from './components/Badge'

// Skeleton y Spinner agregados como placeholders exportados directamente
export function Spinner() {
  return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
}
