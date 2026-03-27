import React, { useState } from 'react'
import type { UISchema, UISchemaField } from './schema'

// Widgets
import { TextWidget } from './widgets/TextWidget'
import { NumberWidget } from './widgets/NumberWidget'
import { DateWidget } from './widgets/DateWidget'
import { SelectWidget } from './widgets/SelectWidget'
import { MultiSelectWidget } from './widgets/MultiSelectWidget'
import { FileUploadWidget } from './widgets/FileUploadWidget'
import { GeoPolygonWidget } from './widgets/GeoPolygonWidget'
import { Button } from '../components/Button'

export interface DynamicFormRendererProps {
  schema: UISchema
  onSubmit: (data: Record<string, any>) => void
  onCancel?: () => void
}

export function DynamicFormRenderer({ schema, onSubmit, onCancel }: DynamicFormRendererProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})

  const handleChange = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const renderField = (field: UISchemaField) => {
    const value = formData[field.id]
    const onChange = (val: any) => handleChange(field.id, val)

    switch (field.type) {
      case 'text':
        return <TextWidget key={field.id} field={field} value={value} onChange={onChange} />
      case 'number':
        return <NumberWidget key={field.id} field={field} value={value} onChange={onChange} />
      case 'date':
        return <DateWidget key={field.id} field={field} value={value} onChange={onChange} />
      case 'select':
        return <SelectWidget key={field.id} field={field} value={value} onChange={onChange} />
      case 'multiselect':
        return <MultiSelectWidget key={field.id} field={field} value={value} onChange={onChange} />
      case 'file-upload':
        return <FileUploadWidget key={field.id} field={field} value={value} onChange={onChange} />
      case 'geo-polygon':
        return <GeoPolygonWidget key={field.id} field={field} value={value} onChange={onChange} />
      default:
        return <div key={field.id} className="text-[var(--color-error)] text-sm">Widget {field.type} no implementado</div>
    }
  }

  return (
    <div className="bg-[var(--color-surface)] shadow-md rounded-xl p-6 w-full border border-[var(--color-border)]">
      <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">{schema.title}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {schema.fields.map(renderField)}

        <div className="flex justify-end space-x-3 pt-6 border-t border-[var(--color-border)] mt-8">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit">
            Guardar
          </Button>
        </div>
      </form>
    </div>
  )
}
