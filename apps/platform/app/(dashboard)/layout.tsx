import { Sidebar } from '../components/layout/Sidebar'
import { Topbar } from '../components/layout/Topbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
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
  )
}
