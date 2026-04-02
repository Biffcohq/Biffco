import type { ReactNode } from 'react'

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full max-w-7xl mx-auto pt-6 px-4">
      <main className="flex-1 w-full bg-transparent">
        {children}
      </main>
    </div>
  )
}
