import React from 'react';
import { cn } from '../lib/utils';
import { IconCheck, IconX, IconClock } from '@tabler/icons-react';

export type SignatureStatus = 'valid' | 'invalid' | 'pending' | 'skipped';

export interface SignatureBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: SignatureStatus;
}

export function SignatureBadge({ status, className, ...props }: SignatureBadgeProps) {
  const config = {
    valid: {
      label: 'Firma válida',
      icon: IconCheck,
      classes: 'bg-[var(--color-success-subtle)] text-[var(--color-success)]',
      iconClass: 'text-[var(--color-success)]'
    },
    invalid: {
      label: 'Firma inválida',
      icon: IconX,
      classes: 'bg-[var(--color-error-subtle)] text-[var(--color-error)]',
      iconClass: 'text-[var(--color-error)]'
    },
    pending: {
      label: 'Verificando...',
      icon: IconClock,
      classes: 'bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)]',
      iconClass: 'animate-spin'
    },
    skipped: {
      label: 'Sin verificar',
      icon: null,
      classes: 'bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)]',
      iconClass: ''
    }
  };

  const { label, icon: Icon, classes, iconClass } = config[status];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
        classes,
        className
      )}
      {...props}
    >
      {Icon && <Icon className={cn('h-3.5 w-3.5', iconClass)} stroke={2.5} />}
      {label}
    </div>
  );
}
