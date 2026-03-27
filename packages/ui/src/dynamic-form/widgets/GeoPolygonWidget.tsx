import React from 'react'
import type { UISchemaField } from '../schema'

export function GeoPolygonWidget({ field, value, onChange }: { field: UISchemaField, value: any, onChange: (v: any) => void }) {
  const hasPolygon = !!value
  
  const handleMockDraw = () => {
    onChange({
      type: "Polygon",
      coordinates: [[[-58.38,-34.60], [-58.38,-34.59], [-58.37,-34.59], [-58.37,-34.60], [-58.38,-34.60]]]
    })
  }
  const handleClear = () => onChange(null)

  return (
    <div>
      <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
        {field.label} {field.required && <span className="text-[var(--color-error)]">*</span>}
      </label>
      <div className="border border-[var(--color-border)] rounded-md overflow-hidden relative bg-[var(--color-surface-raised)]" style={{ height: '220px' }}>
        
        {/* Grilla que simula un mapa vacío */}
        <svg className="w-full h-full text-blue-200" width="100%" height="100%">
          <defs>
            <pattern id={`grid-${field.id}`} width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#grid-${field.id})`} />
          
          {hasPolygon && (
            <polygon 
              points="100,50 250,60 220,150 80,130" 
              fill="rgba(59, 130, 246, 0.4)" 
              stroke="rgb(37, 99, 235)" 
              strokeWidth="2"
            />
          )}
        </svg>

        {/* Action Overlay */}
        <div className="absolute inset-x-0 bottom-4 flex justify-center">
          <div className="bg-[var(--color-surface)] shadow-lg rounded-full px-4 py-2 border border-[var(--color-border)] flex space-x-4">
            {!hasPolygon ? (
              <button type="button" onClick={handleMockDraw} className="text-sm text-[var(--color-primary)] font-semibold hover:text-blue-800 transition">
                ✏️ Trazar Zona (Simulación)
              </button>
            ) : (
              <button type="button" onClick={handleClear} className="text-sm text-red-600 font-semibold hover:text-red-800 transition">
                🗑️ Borrar Polígono
              </button>
            )}
          </div>
        </div>
      </div>
      <p className="mt-1 text-xs text-[var(--color-text-secondary)]">Soporta GeoJSON Polygons strictos en Fase A.2</p>
    </div>
  )
}
