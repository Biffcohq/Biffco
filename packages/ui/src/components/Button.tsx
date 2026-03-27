import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]',
        secondary: 'bg-[var(--color-surface)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-surface-raised)]',
        ghost: 'bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-surface-overlay)]',
        destructive: 'bg-[var(--color-error)] text-white hover:bg-red-700',
        outline: 'bg-transparent text-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-[var(--color-primary-subtle)]',
      },
      size: {
        xs: 'h-6 px-2 text-[11px] [&>svg]:size-3',
        sm: 'h-8 px-3 text-xs [&>svg]:size-3.5',
        md: 'h-10 px-4 text-sm [&>svg]:size-4',
        lg: 'h-12 px-5 text-base [&>svg]:size-[18px]',
        xl: 'h-14 px-6 text-lg [&>svg]:size-5',
        icon: 'h-10 w-10 [&>svg]:size-4',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"
