import React from 'react'
import type { UISchemaField } from '../schema'
import { Input } from '../../components/Input'

export function NumberWidget({ field, value, onChange }: { field: UISchemaField, value: any, onChange: (v: number) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
        {field.label} {field.required && <span className="text-[var(--color-error)]">*</span>}
      </label>
      <Input
        type="number"
        placeholder={field.placeholder ?? ''}
        required={field.required}
        value={value ?? ''}
        onChange={e => onChange(Number(e.target.value))}
        min={field.validation?.min}
        max={field.validation?.max}
        className="w-full"
      />
    </div>
  )
}
