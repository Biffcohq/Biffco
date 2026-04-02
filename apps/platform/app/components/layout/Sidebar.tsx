"use client"
import React from 'react'

import { useUIStore } from '../../stores/useUIStore'
import {
  IconBuilding,
  IconUsers,
  IconPackage,
  IconFileCheck,
  IconLeaf,
  IconChartBar,
  IconChevronLeft,
  IconChevronRight,
  IconShieldCheck,
  IconAlertTriangle,
  IconSettings,
  IconLogout
} from '@tabler/icons-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@biffco/ui'
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
      { label: "Equipo y Roles", href: "/members", icon: IconUsers },
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
      { label: "Cuarentenas", href: "/holds", icon: IconAlertTriangle },
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
      className={`group relative h-full flex flex-col transition-all duration-300 border-r border-border shrink-0 bg-surface ${
        isCollapsed ? 'w-16' : 'w-[240px]'
      }`}
    >
      {/* Header */}
      <div className="h-16 flex items-center px-4 shrink-0 mt-2 mb-2">
        <Link href="/" className="flex items-center overflow-hidden h-full">
          {isCollapsed ? (
             <img src="/biffco-iso-color.svg" alt="Biffco Iso" className="w-8 h-8 object-contain transition-all" />
          ) : (
             <img src="/biffco-logo-color.svg" alt="Biffco Logo" className="h-8 object-contain transition-all" />
          )}
        </Link>
      </div>

      {/* Toggle Button */}
      <button 
        onClick={toggle}
        className="opacity-0 group-hover:opacity-100 absolute -right-3 top-1/2 -translate-y-1/2 bg-surface text-text-secondary hover:text-text-primary rounded-full size-6 flex items-center justify-center border border-border shadow-sm hover:bg-surface-raised cursor-pointer transition-all hover:scale-110 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
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
            
            {/* Si está colapsado, una rayita divisoria para separar el primer grupo del resto */}
            {isCollapsed && idx > 0 && <div className="h-px bg-slate-200 mx-auto w-6 mb-2 mt-1" />}

            {group.items.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 h-10 px-3 rounded-lg transition-colors overflow-hidden shrink-0 ${
                    isActive 
                      ? 'bg-primary/10 text-primary font-medium' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
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

      {/* Footer User Profile with Gear Menu */}
      <div className="p-2 border-t border-border shrink-0 mt-auto bg-surface-raised/30">
        {/* @ts-ignore */}
        <DropdownMenu>
          {/* @ts-ignore */}
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-surface-raised transition-colors overflow-hidden group outline-none">
              <div className="shrink-0 rounded-full bg-primary size-8 flex items-center justify-center text-white font-medium text-xs shadow-sm uppercase">
                {profile?.name ? profile.name.substring(0,2) : "WK"}
              </div>
              {!isCollapsed && (
                <div className="flex flex-col min-w-0 flex-1 text-left">
                  <span className="text-sm font-medium text-text-primary truncate">{profile?.name || "Cargando..."}</span>
                  <span className="text-[10px] text-text-secondary truncate">Ajustes de cuenta</span>
                </div>
              )}
              {!isCollapsed && (
                <IconSettings size={16} className="text-text-muted group-hover:text-text-primary transition-colors shrink-0" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" sideOffset={10} className="w-[240px] bg-surface border border-border shadow-md rounded-xl p-1">
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium leading-none text-text-primary">{profile?.name || "Workspace"}</p>
              <p className="text-xs leading-none text-text-secondary">Admin</p>
            </div>
            {/* @ts-ignore */}
            <DropdownMenuSeparator className="bg-border" />
            <Link href="/settings">
              {/* @ts-ignore */}
              <DropdownMenuItem className="cursor-pointer text-text-primary focus:bg-surface-raised rounded-md m-1">
                <IconSettings className="mr-2 h-4 w-4 opacity-70" />
                <span>Configuración</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/settings/wallet">
              {/* @ts-ignore */}
              <DropdownMenuItem className="cursor-pointer text-text-primary focus:bg-surface-raised rounded-md m-1">
                <IconShieldCheck className="mr-2 h-4 w-4 opacity-70" />
                <span>Claves Incriptadas</span>
              </DropdownMenuItem>
            </Link>
            {/* @ts-ignore */}
            <DropdownMenuSeparator className="bg-border" />
            {/* @ts-ignore */}
            <DropdownMenuItem 
              className="cursor-pointer text-error focus:bg-error/10 focus:text-error rounded-md m-1" 
              onSelect={(e: any) => {
                 e.preventDefault();
                 const wrapper = document.getElementById('hidden-logout-wrapper');
                 if (wrapper) {
                   const btn = wrapper.querySelector('button');
                   if (btn) btn.click();
                 }
              }}
            >
              <IconLogout className="mr-2 h-4 w-4" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div id="hidden-logout-wrapper" className="hidden">
           <LogoutButton />
        </div>
      </div>
    </aside>
  )
}
