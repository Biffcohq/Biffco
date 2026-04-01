/* eslint-disable @typescript-eslint/no-explicit-any, no-undef, @typescript-eslint/no-unused-vars */
"use client"

import React from 'react'
import { Input } from './Input'
import { Label } from './Label'
import { Checkbox } from './Checkbox' // assuming Checkbox exists since UI has it

export interface FormField {
  type: 'string' | 'number' | 'boolean' | 'enum'
  label: string
  placeholder?: string
  required?: boolean
  options?: { label: string; value: string }[]
}

export interface FormSchema {
  [key: string]: FormField
}

interface DynamicFormRendererProps {
  schema: FormSchema
  data: Record<string, any>
  onChange: (newData: Record<string, any>) => void
  disabled?: boolean
}

export function DynamicFormRenderer({ schema, data, onChange, disabled = false }: DynamicFormRendererProps) {
  const handleChange = (key: string, value: any) => {
    onChange({
      ...data,
      [key]: value
    })
  }

  // Si no hay esquema, no renderizamos nada extra
  if (!schema || Object.keys(schema).length === 0) {
    return null
  }

  return (
    <div className="grid gap-4 bg-surface-raised p-4 rounded-lg border border-border/50">
      {Object.entries(schema).map(([key, field]) => {
        return (
          <div key={key} className="grid gap-2">
            <Label htmlFor={key} className="text-text-secondary">
              {field.label} {field.required && <span className="text-error">*</span>}
            </Label>

            {field.type === 'string' && (
              <Input
                id={key}
                type="text"
                placeholder={field.placeholder}
                value={data[key] || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(key, e.target.value)}
                required={field.required}
                disabled={disabled}
              />
            )}

            {field.type === 'number' && (
              <Input
                id={key}
                type="number"
                placeholder={field.placeholder}
                value={data[key] || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(key, Number(e.target.value))}
                required={field.required}
                disabled={disabled}
              />
            )}

            {field.type === 'enum' && field.options && (
              <select
                id={key}
                value={data[key] || ''}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(key, e.target.value)}
                required={field.required}
                disabled={disabled}
                className="flex h-10 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" disabled>Seleccionar opción...</option>
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}

            {field.type === 'boolean' && (
              <div className="flex items-center space-x-2 h-10">
                <Checkbox
                  id={key}
                  checked={!!data[key]}
                  onCheckedChange={(checked: boolean) => handleChange(key, checked)}
                  disabled={disabled}
                />
                <Label htmlFor={key} className="text-text-primary cursor-pointer hover:text-text-secondary transition-colors text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {field.label}
                </Label>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
