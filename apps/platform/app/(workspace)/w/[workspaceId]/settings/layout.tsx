import Link from 'next/link'
import type { ReactNode } from 'react'

export default function SettingsLayout({ children, params }: { children: ReactNode, params: { workspaceId: string } }) {
  const wPath = `/w/${params.workspaceId}/settings`

  const navItems = [
    { name: 'General', path: wPath },
    { name: 'Perfil', path: `${wPath}/profile` },
    { name: 'Facturación', path: `${wPath}/billing` },
    { name: 'Preferencias', path: `${wPath}/preferences` },
  ]

  return (
    <div className="flex flex-col md:flex-row min-h-[max(calc(100vh-6rem),500px)] w-full max-w-7xl mx-auto items-start pt-6 px-4 gap-8">
      {/* Menú lateral */}
      <aside className="w-full md:w-56 shrink-0 flex flex-col gap-1">
        <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest pl-3 mb-4">Configuración</h2>
        <nav className="flex flex-col space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`px-3 py-2 text-sm rounded-md transition-colors font-medium border border-transparent ${
                item.name === 'Claves Encriptadas' 
                  ? 'text-primary bg-primary/5 hover:bg-primary/10' // Mock de estado activo para este caso
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-raised border-transparent'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Contenido */}
      <main className="flex-1 w-full bg-transparent">
        {children}
      </main>
    </div>
  )
}
