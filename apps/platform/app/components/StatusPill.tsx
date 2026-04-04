import React from 'react';

type StatusType = 'ACTIVE' | 'DISPUTED' | 'REJECTED_IN_TRANSIT' | 'COMPLETED' | 'IN_TRANSIT' | 'PENDING_CARRIER_ACCEPTANCE' | 'REJECTED' | string;

export function StatusPill({ status, className = '' }: { status: StatusType, className?: string }) {
  let colors = 'bg-surface-raised text-text-muted border-border';

  switch (status) {
    case 'ACTIVE':
    case 'COMPLETED':
      colors = 'bg-green-500/10 text-green-500 border-green-500/20';
      break;
    case 'IN_TRANSIT':
    case 'PENDING_CARRIER_ACCEPTANCE':
      colors = 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      break;
    case 'DISPUTED':
    case 'REJECTED_IN_TRANSIT':
    case 'REJECTED':
      colors = 'bg-red-500/10 text-red-500 border-red-500/20';
      break;
  }

  let label = status.replace(/_/g, ' ');
  if (status === 'ACTIVE') label = 'Trazable Activo';
  if (status === 'IN_TRANSIT') label = 'En Tránsito';
  if (status === 'PENDING_CARRIER_ACCEPTANCE') label = 'En Espera Logística';
  if (status === 'REJECTED_IN_TRANSIT') label = 'Rechazado en Ruta';
  if (status === 'DISPUTED') label = 'En Disputa';
  if (status === 'COMPLETED') label = 'Finalizado';

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border whitespace-nowrap ${colors} ${className}`}>
      {label}
    </span>
  );
}
