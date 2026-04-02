"use client"

import React from "react"
import { Button } from "@biffco/ui"

interface SectionCardProps {
  title: string
  description?: string
  children: React.ReactNode
  footerText?: string
  actionLabel?: string
  onAction?: () => void
  disabled?: boolean
}

export function SectionCard({
  title,
  description,
  children,
  footerText,
  actionLabel = "Save",
  onAction,
  disabled
}: SectionCardProps) {
  return (
    <section className="flex flex-col border border-border rounded-lg bg-surface shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="p-6">
        <div className="flex flex-col gap-1 mb-6">
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          {description && <p className="text-sm text-text-secondary">{description}</p>}
        </div>
        <div className="w-full">
          {children}
        </div>
      </div>
      {(footerText || onAction) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-raised border-t border-border px-6 py-4">
          <span className="text-sm text-text-secondary">{footerText || ""}</span>
          {onAction && (
            <Button onClick={onAction} disabled={disabled} size="sm" className="w-full sm:w-auto">
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </section>
  )
}
