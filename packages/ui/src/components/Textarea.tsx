import React from 'react'
import { cn } from '../lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && <label className="text-sm font-medium text-text-primary]">{label}</label>}
        <textarea 
          ref={ref}
          className={cn(
            "min-h-[80px] w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-[var(--color-error)] focus:ring-[var(--color-error)]/30 focus:border-[var(--color-error)]",
            className
          )} 
          {...props} 
        />
        {error && <span className="text-xs text-[var(--color-error)]">{error}</span>}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"
