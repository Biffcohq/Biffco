import { Topbar } from '../components/layout/Topbar'
import { Sidebar } from '../components/layout/Sidebar'
import { AuthGuard } from '../components/auth/AuthGuard'

export default function HubLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-bg-base overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            <div className="mx-auto w-full max-w-[var(--content-max-width,1280px)] p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
