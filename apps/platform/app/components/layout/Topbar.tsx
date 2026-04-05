"use client"

import {
  IconSearch,
  IconBell,
  IconSun,
  IconCheck,
  IconChevronRight,
  IconMenu2
} from '@tabler/icons-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useUIStore } from '@/app/stores/useUIStore'

export function Topbar() {
  const pathname = usePathname()
  const toggleMobileSidebar = useUIStore(s => s.toggleMobileSidebar)
  
  const isWorkspaceContext = pathname.startsWith('/w/')
  const workspaceId = isWorkspaceContext ? pathname.split('/')[2] : null

  // Smart breadcrumbs that hide ugly IDs
  let title = 'Workspace';
  if (pathname !== '/') {
    const segments = pathname.split('/').filter(Boolean);
    const cleanSegments = segments.filter(s => {
      if (s.toLowerCase() === 'w') return false;
      if (s === workspaceId) return false; // Hide the workspace ID / slug
      if (s.length > 18) return false; // Oculta IDs largos poco amigables
      return true;
    });
    title = cleanSegments.length > 0 
      ? cleanSegments.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' / ')
      : '';
  }



  return (
    <header className="h-14 bg-surface border-b border-border flex items-center justify-between px-4 md:px-6 shrink-0 shadow-xs z-10 w-full relative">
      {/* Mobile Hamburger Button */}
      <div className="md:hidden flex items-center shrink-0 mr-3">
        <button 
          onClick={toggleMobileSidebar}
          className="p-1.5 -ml-1.5 text-text-secondary hover:text-text-primary rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          aria-label="Menú principal"
        >
          <IconMenu2 size={22} stroke={1.5} />
        </button>
      </div>

      {/* Left Menu - Breadcrumbs (Desktop Only) */}
      <div className="hidden md:flex items-center gap-2 text-[13px] overflow-hidden whitespace-nowrap">
        <Link href="/" className="text-text-secondary font-medium hover:text-text-primary transition-colors">
          Biffco Corp
        </Link>
        <IconChevronRight size={14} className="text-text-muted shrink-0" stroke={2} />
        
        {isWorkspaceContext && workspaceId ? (
          <>
            <Link href={`/w/${workspaceId}`} className={`font-medium transition-colors ${!title ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}>
              Vertical Operacional
            </Link>
            {title && (
              <>
                <IconChevronRight size={14} className="text-text-muted" stroke={2} />
                <span className="text-text-primary font-semibold">
                  {title}
                </span>
              </>
            )}
          </>
        ) : (
          <span className="text-text-primary font-semibold">
            {title}
          </span>
        )}
      </div>

      {/* Mobile Centered Logo */}
      <div className="md:hidden absolute left-1/2 -translate-x-1/2 flex items-center pointer-events-none">
        <img src="/biffco-logo-color.svg" alt="Biffco" className="h-[16px] w-auto object-contain" />
      </div>

      {/* Center - SearchBar Placeholder (Desktop Only) */}
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
