"use client"
/* global document */
import React from 'react'

import { useUIStore } from '../../stores/useUIStore'
import {
  IconBuilding,
  IconUsers,
  IconFileCheck,
  IconLeaf,
  IconChartBar,
  IconChevronLeft,
  IconChevronRight,
  IconSettings,
  IconLogout,
  IconBox,
  IconChartDonut,
  IconMoodSmile,
  IconSun,
  IconMoon,
  IconHome,
  IconPencil,
  IconHelp,
  IconBook
} from '@tabler/icons-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@biffco/ui'
import Link from 'next/link'
import { LogoutButton } from '../auth/LogoutButton'
import { trpc } from '@/lib/trpc'
import { usePathname, useParams } from 'next/navigation'
// eslint-disable-next-line no-restricted-imports
import { getVerticalDictionary } from '@/app/lib/verticals/registry'

interface NavGroup {
  label: string
  items: {
    label: string
    href: string
    icon: React.ElementType
    roles?: string[] // Opcional, si no se provee es para todos
  }[]
}

// Generador dinámico de navegación para un workspace específico
const getWorkspaceNavGroups = (workspaceId: string, roles: string[] = ['PRODUCER']): NavGroup[] => {
  const hasRole = (requiredRoles?: string[]) => {
    if (!requiredRoles) return true
    return requiredRoles.some(r => roles.includes(r))
  }
  
  const groups: NavGroup[] = [
    {
      label: "Gestión General",
      items: [
        { label: "Mis Roles (Hub)", href: `/w/${workspaceId}`, icon: IconBuilding },
        { label: "Personal y Roles", href: `/w/${workspaceId}/members`, icon: IconUsers },
      ]
    },
    {
      label: "Consolidación de Registros",
      items: [
        { label: "Libro de Eventos Universal", href: `/w/${workspaceId}/events`, icon: IconFileCheck },
        { label: "Reportes Agregados", href: `/w/${workspaceId}/reports`, icon: IconChartDonut },
        { label: "Alertas EUDR Globales", href: `/w/${workspaceId}/eudr`, icon: IconLeaf, roles: ['PRODUCER'] },
      ]
    }
  ]

  // Filter items in each group based on roles
  return groups.map(group => ({
    ...group,
    items: group.items.filter(item => hasRole(item.roles))
  })).filter(group => group.items.length > 0)
}

// Navegación Global (Nivel Cuenta Administradora)
const globalNavGroups: NavGroup[] = [
  {
    label: "Hub",
    items: [
      { label: "Workspaces", href: "/", icon: IconBuilding },
      { label: "Estadísticas Globales", href: "/analytics", icon: IconChartBar },
    ]
  }
]

// --- Collapsible Nav Group Utility Component ---
function CollapsibleNavGroup({ group, effectiveIsCollapsed, pathname, isFirst }: { group: NavGroup, effectiveIsCollapsed: boolean, pathname: string, isFirst: boolean }) {
  // Inicializa cerrado, A MENOS que tenga la ruta activa adentro.
  const [isOpen, setIsOpen] = React.useState(() => {
    return group.items.some((item) => pathname === item.href);
  });
  
  return (
    <div className="flex flex-col gap-1 mb-1">
      {!effectiveIsCollapsed && (
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between text-xs font-semibold text-text-muted hover:text-text-primary transition-colors tracking-widest px-3 mb-1 mt-2 w-full text-left"
        >
          <span className="uppercase truncate">{group.label}</span>
          <IconChevronRight size={12} className={`transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-90' : ''}`} />
        </button>
      )}
      
      {/* Divider if collapsed */}
      {effectiveIsCollapsed && !isFirst && <div className="h-px bg-slate-200/50 mx-auto w-6 mb-2 mt-2" />}

      {/* Group Items */}
      <div className={`flex flex-col gap-1 overflow-hidden transition-all duration-300 ${!effectiveIsCollapsed && !isOpen ? 'max-h-0 opacity-0 mb-0' : 'max-h-[1000px] opacity-100 mb-1'}`}>
         {group.items.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 h-9 rounded-lg transition-colors overflow-hidden shrink-0 ${
                  effectiveIsCollapsed 
                     ? 'justify-center mx-auto w-9 px-0' 
                     : 'px-3'
                } ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                title={effectiveIsCollapsed ? item.label : undefined}
              >
                <div className="shrink-0 flex items-center justify-center w-5">
                  <Icon size={20} stroke={isActive ? 2 : 1.5} />
                </div>
                {!effectiveIsCollapsed && (
                  <span className="text-sm whitespace-nowrap transition-opacity duration-200">{item.label}</span>
                )}
              </Link>
            )
          })}
      </div>
    </div>
  )
}

export function Sidebar() {
  const isCollapsed = useUIStore(s => s.isSidebarCollapsed)
  const toggle = useUIStore(s => s.toggleSidebar)
  const pathname = usePathname()
  const params = useParams()
  const { data: profile } = trpc.workspaces.getProfile.useQuery()
  const { data: userProfile } = trpc.auth.me.useQuery()

  const isWorkspaceContext = pathname.startsWith('/w/')
  const workspaceId = typeof params?.workspaceId === 'string' ? params.workspaceId : null
  const roleContext = typeof params?.roleId === 'string' ? params.roleId.toUpperCase() : null

  let currentNavGroups = globalNavGroups;

  if (isWorkspaceContext && workspaceId) {
    if (roleContext) {
      // 1. CONTEXTUAL ROLE SIDEBAR
      const dict = getVerticalDictionary(profile?.verticalId || 'agnostic');
      const verticalNavs = typeof dict.getRoleNavs === 'function' ? dict.getRoleNavs(workspaceId, roleContext) : null;

      if (verticalNavs) {
        currentNavGroups = verticalNavs;
      } else {
        currentNavGroups = [
          {
            label: `Gestión ${roleContext}`,
            items: [
              { label: `Panel de Control`, href: `/w/${workspaceId}/roles/${params?.roleId}`, icon: IconBuilding },
              { label: "Volver a Mis Roles", href: `/w/${workspaceId}`, icon: IconHome },
            ]
          }
        ];
      }
    } else {
      // 2. ROOT WORKSPACE SIDEBAR (Gerencial)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      currentNavGroups = getWorkspaceNavGroups(workspaceId, (profile as any)?.roles || []);
    }
  }

  const isMobileSidebarOpen = useUIStore(s => s.isMobileSidebarOpen)
  const closeMobileSidebar = useUIStore(s => s.closeMobileSidebar)

  // On Mobile, if the drawer is open, we MUST force un-collapsed mode visually
  const effectiveIsCollapsed = isMobileSidebarOpen ? false : isCollapsed;

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={closeMobileSidebar}
        />
      )}

      <aside 
        className={`flex flex-col transition-all duration-300 border-r border-border shrink-0 bg-surface 
          ${isMobileSidebarOpen ? 'fixed inset-y-0 left-0 z-50 w-[260px] shadow-2xl' : 'hidden md:flex relative'}
          ${!isMobileSidebarOpen && effectiveIsCollapsed ? 'w-16' : ''}
          ${!isMobileSidebarOpen && !effectiveIsCollapsed ? 'w-[240px]' : ''}
          h-full`}
      >
        {/* Header */}
        <div className={`h-14 flex items-center shrink-0 ${effectiveIsCollapsed ? 'justify-center' : 'px-6'}`}>
          <Link href="/" onClick={closeMobileSidebar} className="flex items-center overflow-hidden h-full" title="Ir al Global Hub">
            {effectiveIsCollapsed ? (
               <img src="/biffco-iso-color.svg" alt="Biffco Iso" className="w-[18px] h-[18px] object-contain transition-all drop-shadow-sm" />
            ) : (
               <img src="/biffco-logo-color.svg" alt="Biffco Logo" className="h-[18px] w-auto object-contain transition-all" />
            )}
          </Link>
        </div>

        {/* Role Context Header/Switcher if inside a specific role */}
        {!effectiveIsCollapsed && roleContext && (
           <div className="px-4 py-2 mx-3 mb-2 mt-2 bg-surface-raised border border-border rounded-xl">
             <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Estás en el rol:</span>
             <div className="flex items-center justify-between mt-1">
               <span className="text-sm font-semibold text-primary truncate flex items-center gap-1.5"><IconBox size={14}/> {roleContext}</span>
             </div>
           </div>
        )}

        {/* Toggle Button Edge Hitbox (Desktop Only) */}
        {!isMobileSidebarOpen && (
          <div className="absolute right-[-12px] top-0 bottom-0 w-6 z-20 group/toggle hidden md:flex items-center justify-center">
            <button 
              onClick={toggle}
              className="opacity-0 group-hover/toggle:opacity-100 bg-surface text-text-secondary hover:text-text-primary rounded-full size-6 flex items-center justify-center border border-border shadow-sm hover:bg-surface-raised cursor-pointer transition-all hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              aria-label="Toggle sidebar"
            >
              {effectiveIsCollapsed ? <IconChevronRight size={14} stroke={2} /> : <IconChevronLeft size={14} stroke={2} />}
            </button>
          </div>
        )}

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 flex flex-col gap-1 scrollbar-hide">
        {currentNavGroups.map((group, idx) => (
          <CollapsibleNavGroup 
            key={idx} 
            group={group} 
            effectiveIsCollapsed={effectiveIsCollapsed} 
            pathname={pathname}
            isFirst={idx === 0}
          />
        ))}
      </div>

      {/* Footer User Profile with Gear Menu */}
      <div className="p-2 border-t border-border shrink-0 mt-auto bg-surface-raised/30">
        {/* @ts-ignore */}
        <DropdownMenu>
          {/* @ts-ignore */}
          <DropdownMenuTrigger asChild>
            <button className={`w-full flex items-center gap-3 rounded-lg hover:bg-surface-raised transition-colors overflow-hidden group outline-none ${
              effectiveIsCollapsed ? 'justify-center p-0 mx-auto w-9 h-9' : 'p-2'
            }`}>
              <div className="shrink-0 rounded-full bg-primary size-8 flex items-center justify-center text-white font-medium text-xs shadow-sm uppercase">
                {userProfile?.name ? userProfile.name.substring(0,2) : "WK"}
              </div>
              {!effectiveIsCollapsed && (
                <div className="flex flex-col min-w-0 flex-1 text-left">
                  <span className="text-sm font-medium text-text-primary truncate">{userProfile?.name || "Cargando..."}</span>
                  <span className="text-xs text-text-secondary truncate">{profile?.name || "Workspace"}</span>
                </div>
              )}
              {!effectiveIsCollapsed && (
                <IconSettings size={16} className="text-text-muted group-hover:text-text-primary transition-colors shrink-0" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" sideOffset={10} className="w-[260px] bg-surface border border-border shadow-md rounded-xl p-1.5 flex flex-col gap-[2px]">
            <div className="flex flex-col space-y-1 p-2 mb-1">
              <p className="text-[13px] font-medium leading-none text-text-primary">{userProfile?.name || "BiffcoHQ"}</p>
              <p className="text-[12px] leading-none text-text-secondary">{userProfile?.email || "Cargando email..."}</p>
            </div>
            {/* @ts-ignore */}
            <DropdownMenuSeparator className="bg-border mb-1" />
            
            {/* @ts-ignore */}
            <DropdownMenuItem className="cursor-pointer text-text-primary focus:bg-surface-raised rounded-md py-1.5 px-2 text-[13px]">
               <IconMoodSmile className="mr-2 h-4 w-4 opacity-70" />
               <span>Feedback</span>
            </DropdownMenuItem>
            {/* @ts-ignore */}
            <DropdownMenuItem className="cursor-pointer text-text-primary focus:bg-surface-raised rounded-md py-1.5 px-2 text-[13px] flex justify-between items-center group/theme">
               <div className="flex items-center">
                 <IconSun className="mr-2 h-4 w-4 opacity-70" />
                 <span>Theme</span>
               </div>
               <div className="flex gap-1 opacity-0 group-hover/theme:opacity-100 transition-opacity">
                  <div className="p-0.5 rounded-sm hover:bg-border"><IconSun size={12}/></div>
                  <div className="p-0.5 rounded-sm hover:bg-border"><IconMoon size={12}/></div>
               </div>
            </DropdownMenuItem>
            
            <Link href={isWorkspaceContext && workspaceId ? `/w/${workspaceId}/settings` : "/settings"}>
              {/* @ts-ignore */}
              <DropdownMenuItem className="cursor-pointer text-text-primary focus:bg-surface-raised rounded-md py-1.5 px-2 text-[13px]">
                <IconSettings className="mr-2 h-4 w-4 opacity-70" />
                <span>Configuración {isWorkspaceContext ? 'de Cadena' : 'Global'}</span>
              </DropdownMenuItem>
            </Link>

            {/* @ts-ignore */}
            <DropdownMenuItem className="cursor-pointer text-text-primary focus:bg-surface-raised rounded-md py-1.5 px-2 text-[13px]">
               <IconHome className="mr-2 h-4 w-4 opacity-70" />
               <span>Home Page</span>
            </DropdownMenuItem>
            {/* @ts-ignore */}
            <DropdownMenuItem className="cursor-pointer text-text-primary focus:bg-surface-raised rounded-md py-1.5 px-2 text-[13px]">
               <IconPencil className="mr-2 h-4 w-4 opacity-70" />
               <span>Changelog</span>
            </DropdownMenuItem>
            {/* @ts-ignore */}
            <DropdownMenuItem className="cursor-pointer text-text-primary focus:bg-surface-raised rounded-md py-1.5 px-2 text-[13px]">
               <IconHelp className="mr-2 h-4 w-4 opacity-70" />
               <span>Help</span>
            </DropdownMenuItem>
            {/* @ts-ignore */}
            <DropdownMenuItem className="cursor-pointer text-text-primary focus:bg-surface-raised rounded-md py-1.5 px-2 text-[13px]">
               <IconBook className="mr-2 h-4 w-4 opacity-70" />
               <span>Docs</span>
            </DropdownMenuItem>
            
            {/* @ts-ignore */}
            <DropdownMenuItem 
              className="cursor-pointer text-text-primary focus:bg-surface-raised rounded-md py-1.5 px-2 text-[13px]" 
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onSelect={(e: any) => {
                 e.preventDefault();
                 const wrapper = document.getElementById('hidden-logout-wrapper');
                 if (wrapper) {
                   const btn = wrapper.querySelector('button');
                   if (btn) btn.click();
                 }
              }}
            >
              <IconLogout className="mr-2 h-4 w-4 opacity-70" />
              <span>Log Out</span>
            </DropdownMenuItem>

            {/* @ts-ignore */}
            <DropdownMenuSeparator className="bg-border my-1" />

            {/* Upgrade to Pro Button */}
            <div className="px-1 py-1">
               <button className="w-full bg-[#0F1623] hover:bg-[#000000] text-white rounded-md py-1.5 text-[13px] font-medium transition-colors">
                 Upgrade to Pro
               </button>
            </div>

            {/* @ts-ignore */}
            <DropdownMenuSeparator className="bg-transparent my-0.5" />

            {/* Platform Status */}
            <div className="flex items-center justify-between px-2 py-1.5 mb-1 group cursor-pointer hover:bg-surface-raised rounded-md transition-colors">
               <div className="flex flex-col">
                  <span className="text-[11px] text-text-secondary group-hover:text-text-primary transition-colors">Platform Status</span>
                  <span className="text-[12px] text-text-primary mt-0.5">All systems normal.</span>
               </div>
               <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
            </div>

          </DropdownMenuContent>
        </DropdownMenu>

        <div id="hidden-logout-wrapper" className="hidden">
           <LogoutButton />
        </div>
      </div>
    </aside>
    </>
  )
}
