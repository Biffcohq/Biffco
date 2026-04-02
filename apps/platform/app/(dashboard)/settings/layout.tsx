"use client"

import React from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const settingsNav = [
  { name: 'General', href: '/settings/general' },
  { name: 'Perfil', href: '/settings/profile' },
  { name: 'Facturación', href: '/settings/billing' },
  { name: 'Preferencias', href: '/settings/preferences' },
  { name: 'Claves Incriptadas', href: '/settings/wallet' },
]

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-[1200px] mx-auto min-h-[80vh] animate-in fade-in duration-300">
      <aside className="w-full md:w-56 shrink-0 md:border-r border-border min-h-full pr-4">
        <h2 className="text-lg font-semibold mb-6 text-text-primary px-2">Configuración</h2>
        <nav className="flex flex-col gap-1">
          {settingsNav.map((item) => {
            const isActive = pathname === item.href || (pathname === '/settings' && item.href === '/settings/general')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  px-3 py-2 rounded-md text-sm transition-colors font-medium
                  ${isActive 
                    ? 'bg-surface-raised text-primary' 
                    : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                  }
                `}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>
      </aside>
      
      <main className="flex-1 pb-12">
        {children}
      </main>
    </div>
  )
}
