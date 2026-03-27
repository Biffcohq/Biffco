import React from 'react'
import type { UISchemaField } from '../schema'

export function SelectWidget({ field, value, onChange }: { field: UISchemaField, value: any, onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
        {field.label} {field.required && <span className="text-[var(--color-error)]">*</span>}
      </label>
      <select
        required={field.required}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-[var(--color-border)] focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm rounded-md shadow-sm border"
      >
        <option value="" disabled>Seleccione una opción...</option>
        {field.options?.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}
