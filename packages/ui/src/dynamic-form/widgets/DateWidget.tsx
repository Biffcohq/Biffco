import React from 'react'
import type { UISchemaField } from '../schema'
import { Input } from '../../components/Input'

export function DateWidget({ field, value, onChange }: { field: UISchemaField, value: any, onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
        {field.label} {field.required && <span className="text-[var(--color-error)]">*</span>}
      </label>
      <Input
        type="date"
        required={field.required}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        className="w-full"
      />
    </div>
  )
}
