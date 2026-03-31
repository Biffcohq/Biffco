import React from 'react'
import { cn } from '../lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && <label className="text-sm font-medium text-text-primary]">{label}</label>}
        <input 
          ref={ref}
          className={cn(
            "h-10 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]",
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
Input.displayName = "Input"
