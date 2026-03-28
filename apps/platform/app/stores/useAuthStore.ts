import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  workspaceId: string | null
  memberId: string | null
  personName: string | null
  isAuthenticated: boolean
  setSession: (data: { accessToken: string, refreshToken: string, workspaceId: string, memberId: string, personName: string }) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      workspaceId: null,
      memberId: null,
      personName: null,
      isAuthenticated: false,
      setSession: (data) => set({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        workspaceId: data.workspaceId,
        memberId: data.memberId,
        personName: data.personName,
        isAuthenticated: true,
      }),
      clearSession: () => set({
        accessToken: null,
        refreshToken: null,
        workspaceId: null,
        memberId: null,
        personName: null,
        isAuthenticated: false,
      }),
    }),
    {
      name: 'biffco-auth-storage',
    }
  )
)
