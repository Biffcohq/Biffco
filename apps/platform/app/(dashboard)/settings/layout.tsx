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
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-[1000px] mx-auto min-h-[80vh] animate-in fade-in duration-300 mt-6">
      <aside className="w-full md:w-56 shrink-0 min-h-full pr-4">
        <h2 className="text-sm font-semibold mb-3 text-text-primary px-3 uppercase tracking-wider text-text-secondary">Configuración</h2>
        <nav className="flex flex-col gap-[2px]">
          {settingsNav.map((item) => {
            const isActive = pathname === item.href || (pathname === '/settings' && item.href === '/settings/general')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  px-3 py-2 rounded-md text-[14px] transition-all font-medium flex items-center gap-2
                  ${isActive 
                    ? 'bg-primary/10 text-primary font-semibold' 
                    : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary'
                  }
                `}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>
      </aside>
      
      <main className="flex-1 pb-16 flex flex-col gap-10">
        {children}
      </main>
    </div>
  )
}
