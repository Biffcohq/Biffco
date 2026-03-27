import React from 'react';
import { cn } from '../lib/utils';
import { IconCheck, IconClock, IconAlertTriangle, IconWifi } from '@tabler/icons-react';

export type SyncStatus = 'synced' | 'syncing' | 'pending' | 'error' | 'offline';

export interface SyncStatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: SyncStatus;
  pendingCount?: number;
}

export function SyncStatusBadge({ status, pendingCount = 0, className, ...props }: SyncStatusBadgeProps) {
  const config = {
    synced: {
      label: 'Sincronizado',
      icon: IconCheck,
      classes: 'bg-[var(--color-teal)] text-white border-[var(--color-teal)] px-3',
      iconClass: 'text-white'
    },
    syncing: {
      label: `Anclando ${pendingCount} evento${pendingCount !== 1 ? 's' : ''}...`,
      icon: IconClock,
      classes: 'bg-teal-50 text-[var(--color-teal)] border-[var(--color-teal)] px-3',
      iconClass: 'animate-spin'
    },
    pending: {
      label: `${pendingCount} evento${pendingCount !== 1 ? 's' : ''} pendiente${pendingCount !== 1 ? 's' : ''}`,
      icon: IconClock,
      classes: 'bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)] border-[var(--color-border)]',
      iconClass: ''
    },
    error: {
      label: 'Error de sync',
      icon: IconAlertTriangle,
      classes: 'bg-[var(--color-error)] text-white border-[var(--color-error)]',
      iconClass: ''
    },
    offline: {
      label: 'Sin conexión',
      icon: IconWifi,
      classes: 'bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)] border-[var(--color-border)]',
      iconClass: ''
    }
  };

  const { label, icon: Icon, classes, iconClass } = config[status];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 py-1 rounded-full text-[12px] font-medium border shadow-xs',
        status === "pending" || status === "offline" || status === "error" ? "px-2.5" : "",
        classes,
        className
      )}
      {...props}
    >
      {Icon && <Icon className={cn('h-3.5 w-3.5', iconClass)} stroke={2} />}
      {label}
    </div>
  );
}
