import React from 'react'
import { OperationsSidebar } from '../../components/layout/OperationsSidebar'
import { Topbar } from '../../components/layout/Topbar'
import { AuthGuard } from '../../components/auth/AuthGuard'

export default function OperationsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { wsId: string }
}) {
  return (
    <AuthGuard>
      <div className="flex h-screen w-full bg-bg font-sans overflow-hidden">
        {/* Sidebar Operativo (inyecta id del workspace en la nav) */}
        <OperationsSidebar wsId={params.wsId} />

        {/* Main Column: Topbar + Content Area */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative border-l border-border-strong bg-bg h-full">
          <Topbar />
          
          {/* Scrollable Content Container */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 py-6 sm:px-6 w-full">
            <div className="mx-auto w-full max-w-[var(--content-max-width,1280px)]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
