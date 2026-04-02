import React from 'react'
import { Sidebar } from '@/app/components/layout/Sidebar'
import { Topbar } from '@/app/components/layout/Topbar'
import { AuthGuard } from '@/app/components/auth/AuthGuard'

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="flex h-screen w-full bg-bg font-sans overflow-hidden">
        {/* Sidebar: Fixed left column */}
        <Sidebar />

        {/* Main Column: Topbar + Content Area */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative border-l border-border-strong bg-bg h-full">
          <Topbar />
          
          {/* Scrollable Content Container */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 py-6 sm:px-6 w-full">
            {/* Centered Content Area up to max-w-1280px */}
            <div className="mx-auto w-full max-w-[var(--content-max-width,1280px)]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
