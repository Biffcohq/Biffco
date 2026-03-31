import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      color: {
        default: "text-text-primary]",
        secondary: "text-[var(--color-text-secondary)]",
        error: "text-[var(--color-error)]",
      },
    },
    defaultVariants: {
      color: "default",
    },
  }
)

export interface LabelProps 
  extends React.LabelHTMLAttributes<HTMLLabelElement>, 
    VariantProps<typeof labelVariants> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, color, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(labelVariants({ color, className }))}
      {...props}
    />
  )
)
Label.displayName = "Label"
