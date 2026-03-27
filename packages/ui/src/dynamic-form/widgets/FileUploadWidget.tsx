import React, { useState } from 'react'
import type { UISchemaField } from '../schema'

export function FileUploadWidget({ field, value, onChange }: { field: UISchemaField, value: any, onChange: (v: string) => void }) {
  const [isUploading, setIsUploading] = useState(false)

  const handleFakeUpload = () => {
    setIsUploading(true)
    setTimeout(() => {
      setIsUploading(false)
      onChange(`s3://biffco-vault/${field.id}-${Date.now()}.pdf`)
    }, 1500)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
        {field.label} {field.required && <span className="text-[var(--color-error)]">*</span>}
      </label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[var(--color-border)] border-dashed rounded-md hover:border-[var(--color-primary)] transition-colors">
        <div className="space-y-1 text-center">
          <svg className="mx-auto h-12 w-12 text-[var(--color-text-muted)]" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="flex text-sm text-[var(--color-text-secondary)] justify-center">
            {value ? (
              <span className="font-medium text-green-600 truncate max-w-xs">{value}</span>
            ) : isUploading ? (
              <span className="font-medium text-[var(--color-primary)] animate-pulse">Subiendo a bóveda segregada...</span>
            ) : (
              <label 
                className="relative cursor-pointer bg-[var(--color-surface)] rounded-md font-medium text-[var(--color-primary)] hover:text-[var(--color-primary)] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[var(--color-primary)]"
                onClick={handleFakeUpload}
              >
                <span>Sube un archivo</span>
                <span className="text-[var(--color-text-secondary)] ml-1 font-normal">o arrastra aquí</span>
              </label>
            )}
          </div>
          {!value && !isUploading && <p className="text-xs text-[var(--color-text-secondary)]">Documentos PDF validados hasta 15MB</p>}
        </div>
      </div>
    </div>
  )
}
