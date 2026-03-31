"use client"
import React from 'react'

import { useUIStore } from '../../stores/useUIStore'
import {
  IconArrowLeft,
  IconBox,
  IconFileCheck,
  IconListDetails,
  IconShape,
  IconChartDonut,
  IconChevronLeft,
  IconChevronRight
} from '@tabler/icons-react'
import Link from 'next/link'
import { LogoutButton } from '../auth/LogoutButton'
import { trpc } from '@/lib/trpc'
import { usePathname } from 'next/navigation'

interface NavGroup {
  label: string
  items: {
    label: string
    // eslint-disable-next-line no-unused-vars
    href: (ws: string) => string
    icon: React.ElementType
  }[]
}

const navGroups: NavGroup[] = [
  {
    label: "Trazabilidad",
    items: [
      { label: "Activos (Assets)", href: (ws) => `/${ws}/assets`, icon: IconBox },
      { label: "Eventos Clínicos", href: (ws) => `/${ws}/events`, icon: IconListDetails },
      { label: "Agrupaciones (Lotes)", href: (ws) => `/${ws}/groups`, icon: IconShape },
    ]
  },
  {
    label: "Validación",
    items: [
      { label: "Auditorías", href: (ws) => `/${ws}/audits`, icon: IconFileCheck },
      { label: "Reportes", href: (ws) => `/${ws}/reports`, icon: IconChartDonut },
    ]
  }
]

export function OperationsSidebar({ wsId }: { wsId: string }) {
  const isCollapsed = useUIStore(s => s.isSidebarCollapsed)
  const toggle = useUIStore(s => s.toggleSidebar)
  const pathname = usePathname()
  
  // Obtenemos el profile para el usuario (global)
  const { data: profile } = trpc.workspaces.getProfile.useQuery()
  // También podríamos obtener el detalle del workspace actual si existiera el endpoint workspaces.getById
  
  return (
    <aside 
      className={`relative h-full flex flex-col transition-all duration-300 border-r border-border shrink-0 bg-surface ${
        isCollapsed ? 'w-16' : 'w-[240px]'
      }`}
    >
      {/* Header operations back to Management */}
      <div className="h-14 flex items-center px-4 border-b border-border shrink-0">
        <Link href="/" className="flex items-center gap-2 overflow-hidden h-full py-2 hover:opacity-80 transition-opacity w-full">
          <div className="flex items-center justify-center bg-surface-raised border border-border rounded-md w-8 h-8 shrink-0 text-text-secondary">
            <IconArrowLeft size={18} stroke={2} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col whitespace-nowrap overflow-hidden">
               <span className="font-bold text-sm leading-tight text-text-primary tracking-wide truncate">Volver a Admin</span>
               <span className="text-[10px] text-text-muted uppercase tracking-widest truncate">Workspace: {wsId.substring(0,8)}</span>
            </div>
          )}
        </Link>
      </div>

      {/* Toggle Button */}
      <button 
        onClick={toggle}
        className="absolute -right-3 top-16 bg-surface text-text-primary rounded-full size-6 flex items-center justify-center border border-border shadow-sm hover:bg-surface-raised cursor-pointer transition-transform hover:scale-110 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        aria-label="Toggle sidebar"
      >
        {isCollapsed ? <IconChevronRight size={14} stroke={2} /> : <IconChevronLeft size={14} stroke={2} />}
      </button>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 flex flex-col gap-6 scrollbar-hide">
        {navGroups.map((group, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            {!isCollapsed && (
              <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-widest px-3 mb-1">
                {group.label}
              </h3>
            )}
            
            {isCollapsed && idx > 0 && <div className="h-px bg-border mx-auto w-6 mb-2 mt-1" />}

            {group.items.map((item) => {
              const href = item.href(wsId)
              const isActive = pathname.startsWith(href)
              const Icon = item.icon
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 h-10 px-3 rounded-lg transition-colors overflow-hidden shrink-0 ${
                    isActive 
                      ? 'bg-primary/10 text-primary font-medium border border-primary/20' 
                      : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary border border-transparent'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="shrink-0 flex items-center justify-center w-5">
                    <Icon size={20} stroke={isActive ? 2 : 1.5} />
                  </div>
                  {!isCollapsed && (
                    <span className="text-sm whitespace-nowrap transition-opacity duration-200">{item.label}</span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </div>

      {/* Footer User Profile */}
      <div className="p-3 border-t border-border shrink-0 mx-2 mb-2 rounded-lg bg-surface-raised mt-auto">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="shrink-0 rounded-full bg-orange size-8 flex items-center justify-center text-white font-medium text-xs shadow-sm uppercase">
            {profile?.name ? profile.name.substring(0,2) : "WK"}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 pr-2">
              <span className="text-sm font-medium text-text-primary truncate">{profile?.name || "Cargando..."}</span>
              <span className="text-[10px] text-success flex items-center gap-1"><span className="size-1.5 rounded-full bg-success block"></span> Operador Local</span>
            </div>
          )}
          {!isCollapsed && (
            <LogoutButton />
          )}
        </div>
      </div>
    </aside>
  )
}
