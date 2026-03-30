"use client"

import { useUIStore } from '../../stores/useUIStore'
import {
  IconBuilding,
  IconUsers,
  IconPackage,
  IconFileCheck,
  IconLeaf,
  IconChartBar,
  IconLogout,
  IconChevronLeft,
  IconChevronRight,
  IconShieldCheck
} from '@tabler/icons-react'
import Link from 'next/link'
import { LogoutButton } from '../auth/LogoutButton'
import { trpc } from '@/lib/trpc'
import { usePathname } from 'next/navigation'

interface NavGroup {
  label: string
  items: {
    label: string
    href: string
    icon: React.ElementType
  }[]
}

const navGroups: NavGroup[] = [
  {
    label: "Gestión",
    items: [
      { label: "Mi Workspace", href: "/", icon: IconBuilding },
      { label: "Equipo", href: "/members", icon: IconUsers },
      { label: "Equipos/Roles", href: "/teams", icon: IconUsers },
      { label: "Empleados", href: "/employees", icon: IconUsers },
      { label: "Wallet (Claves)", href: "/settings/wallet", icon: IconShieldCheck },
    ]
  },
  {
    label: "Operaciones",
    items: [
      { label: "Facilities", href: "/facilities", icon: IconPackage },
      { label: "Eventos", href: "/events", icon: IconFileCheck },
    ]
  },
  {
    label: "Compliance",
    items: [
      { label: "EUDR", href: "/eudr", icon: IconLeaf },
      { label: "Analytics", href: "/analytics", icon: IconChartBar },
    ]
  }
]

export function Sidebar() {
  const isCollapsed = useUIStore(s => s.isSidebarCollapsed)
  const toggle = useUIStore(s => s.toggleSidebar)
  const pathname = usePathname()
  const { data: profile } = trpc.workspaces.getProfile.useQuery()

  return (
    <aside 
      className={`relative h-full flex flex-col transition-all duration-300 border-r border-white/10 shrink-0 ${
        isCollapsed ? 'w-16' : 'w-[240px]'
      }`}
      style={{ backgroundColor: 'var(--color-navy)' }}
    >
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-white/10 shrink-0">
        <Link href="/" className="flex items-center gap-2 overflow-hidden h-full py-2">
          {/* Logo / Isotipo */}
          <div className="flex items-center justify-center bg-primary rounded-md w-8 h-8 shrink-0 shadow-sm text-white">
            <IconShieldCheck size={20} stroke={2} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col whitespace-nowrap">
              <span className="font-bold text-sm leading-tight text-white tracking-wide">Biffco Corp</span>
              <span className="text-[10px] text-white/50 uppercase tracking-widest">Ganadería Bovina</span>
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
              <h3 className="text-[11px] font-semibold text-white/40 uppercase tracking-widest px-3 mb-1">
                {group.label}
              </h3>
            )}
            
            {/* Si está colapsado, una rayita divisoria para separar el primer grupo del resto */}
            {isCollapsed && idx > 0 && <div className="h-px bg-white/10 mx-auto w-6 mb-2 mt-1" />}

            {group.items.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 h-10 px-3 rounded-lg transition-colors overflow-hidden shrink-0 ${
                    isActive 
                      ? 'bg-white/10 text-white font-medium' 
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
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
      <div className="p-3 border-t border-white/10 shrink-0 mx-2 mb-2 rounded-lg bg-surface-overlay/30 mt-auto">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="shrink-0 rounded-full bg-orange size-8 flex items-center justify-center text-white font-medium text-xs shadow-sm uppercase">
            {profile?.name ? profile.name.substring(0,2) : "WK"}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 pr-2">
              <span className="text-sm font-medium text-white truncate">{profile?.name || "Cargando..."}</span>
              <span className="text-xs text-white/50 truncate">Workspace</span>
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
