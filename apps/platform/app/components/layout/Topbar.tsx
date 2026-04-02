"use client"

import {
  IconSearch,
  IconBell,
  IconSun,
  IconCheck,
  IconChevronRight
} from '@tabler/icons-react'
import { usePathname } from 'next/navigation'

export function Topbar() {
  const pathname = usePathname()
  
  // Smart breadcrumbs that hide ugly IDs
  let title = 'Workspaces Hub';
  if (pathname !== '/') {
    const segments = pathname.split('/').filter(Boolean);
    const cleanSegments = segments.filter(s => {
      if (s.toLowerCase() === 'w') return false;
      if (s.length > 18) return false; // Oculta IDs largos poco amigables
      return true;
    });
    title = cleanSegments.length > 0 
      ? cleanSegments.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' / ')
      : 'Workspace';
  }

  return (
    <header className="h-14 bg-surface border-b border-border flex items-center justify-between px-6 shrink-0 shadow-xs z-10 w-full">
      {/* Left Menu - Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-text-secondary font-medium hover:text-text-primary cursor-pointer transition-colors">
          Biffco Corp
        </span>
        <IconChevronRight size={14} className="text-text-muted" stroke={2} />
        <span className="text-text-primary font-semibold">
          {title}
        </span>
      </div>

      {/* Center - SearchBar Placeholder */}
      <div className="hidden flex-1 md:flex items-center justify-center max-w-lg mx-4">
        <div className="w-full max-w-sm flex items-center justify-between h-9 px-3 bg-surface-raised border border-border rounded-md text-sm text-text-muted cursor-pointer hover:border-border-strong transition-colors">
          <div className="flex items-center gap-2">
            <IconSearch size={16} stroke={1.5} />
            <span>Buscar (Eventos, EIDs, Assets...)</span>
          </div>
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded bg-bg px-1.5 font-mono text-[10px] font-medium text-text-secondary border border-border">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Right Menu - Widgets */}
      <div className="flex items-center gap-4 shrink-0">
        
        {/* Sync Status Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal/10 border border-teal/20 text-teal text-xs font-medium cursor-help" title="Conexión en línea y todos los eventos anclados.">
          <IconCheck size={14} stroke={2} />
          <span>Sincronizado</span>
        </div>

        <div className="w-px h-6 bg-border mx-1" />

        <button className="text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-full p-1.5 relative">
          <IconBell size={20} stroke={1.5} />
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange"></span>
          </span>
        </button>

        <button className="text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-full p-1.5">
          <IconSun size={20} stroke={1.5} />
        </button>

      </div>
    </header>
  )
}
