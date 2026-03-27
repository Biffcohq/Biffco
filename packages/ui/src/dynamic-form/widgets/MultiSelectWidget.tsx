import React from 'react'
import type { UISchemaField } from '../schema'

export function MultiSelectWidget({ field, value, onChange }: { field: UISchemaField, value: string[], onChange: (v: string[]) => void }) {
  const currentValues = Array.isArray(value) ? value : []

  const handleToggle = (optValue: string) => {
    if (currentValues.includes(optValue)) {
      onChange(currentValues.filter(v => v !== optValue))
    } else {
      onChange([...currentValues, optValue])
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
        {field.label} {field.required && <span className="text-[var(--color-error)]">*</span>}
      </label>
      <div className="space-y-2 border border-[var(--color-border)] rounded-md p-3 max-h-48 overflow-y-auto">
        {field.options?.map(opt => (
          <label key={opt.value} className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={currentValues.includes(opt.value)}
              onChange={() => handleToggle(opt.value)}
              className="h-4 w-4 text-[var(--color-primary)] border-[var(--color-border)] rounded focus:ring-[var(--color-primary)]"
            />
            <span className="text-sm text-[var(--color-text-primary)]">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
