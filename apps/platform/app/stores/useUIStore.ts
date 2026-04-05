import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  isSidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  isMobileSidebarOpen: boolean
  toggleMobileSidebar: () => void
  closeMobileSidebar: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
      isMobileSidebarOpen: false,
      toggleMobileSidebar: () => set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),
      closeMobileSidebar: () => set({ isMobileSidebarOpen: false }),
    }),
    {
      name: 'biffco-ui-storage', // saves to localStorage
      partialize: (state) => ({ isSidebarCollapsed: state.isSidebarCollapsed }), // Only persist desktop collapse state
    }
  )
)
