import { create } from 'zustand'

export interface AuthState {
  workspaceId: string | null
  memberId: string | null
  personName: string | null
  isAuthenticated: boolean
  // eslint-disable-next-line no-unused-vars
  setSession: (data: { workspaceId: string, memberId: string, personName: string }) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  workspaceId: null,
  memberId: null,
  personName: null,
  isAuthenticated: false,
  setSession: (data) => set({
    workspaceId: data.workspaceId,
    memberId: data.memberId,
    personName: data.personName,
    isAuthenticated: true,
  }),
  clearSession: () => set({
    workspaceId: null,
    memberId: null,
    personName: null,
    isAuthenticated: false,
  }),
}))
