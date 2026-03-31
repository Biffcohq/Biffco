import * as React from 'react';
import { cn } from '../lib/utils';
import { IconPackage } from '@tabler/icons-react';
import { cva, type VariantProps } from "class-variance-authority"

const emptyStateVariants = cva(
  "flex flex-col items-center justify-center text-center animate-in fade-in max-w-sm mx-auto",
  {
    variants: {
      variant: {
        default: "p-8",
        minimal: "p-4",
        card: "p-10 rounded-xl border border-[var(--color-neutral-200)] bg-[var(--color-surface)] shadow-sm max-w-lg",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {
  icon?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  variant,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(emptyStateVariants({ variant }), className)}
      {...props}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-neutral-100)] text-[var(--color-text-secondary)]">
        {icon || <IconPackage className="h-8 w-8 stroke-1" />}
      </div>
      <h3 className="text-lg font-semibold text-text-primary] mb-1">
        {title}
      </h3>
      {description && (
        <div className="text-sm text-[var(--color-text-secondary)] mb-6 max-w-sm">
          {description}
        </div>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
