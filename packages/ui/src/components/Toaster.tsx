import { Toaster as Sonner } from "sonner"
import React from "react"

export function Toaster({ ...props }: React.ComponentProps<typeof Sonner>) {
  return (
    <Sonner
      theme="system"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[var(--color-surface)] group-[.toaster]:text-[var(--color-text-primary)] group-[.toaster]:border-[var(--color-border)] group-[.toaster]:shadow-lg font-sans",
          description: "group-[.toast]:text-[var(--color-text-secondary)]",
          actionButton:
            "group-[.toast]:bg-[var(--color-primary)] group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-[var(--color-surface-raised)] group-[.toast]:text-[var(--color-text-secondary)]",
          error: "group-[.toaster]:bg-red-950 group-[.toaster]:text-red-200 group-[.toaster]:border-red-900",
          success: "group-[.toaster]:bg-emerald-950 group-[.toaster]:text-emerald-200 group-[.toaster]:border-emerald-900",
          warning: "group-[.toaster]:bg-amber-950 group-[.toaster]:text-amber-200 group-[.toaster]:border-amber-900",
          info: "group-[.toaster]:bg-blue-950 group-[.toaster]:text-blue-200 group-[.toaster]:border-blue-900",
        },
      }}
      {...props}
    />
  )
}
export { toast } from "sonner"
