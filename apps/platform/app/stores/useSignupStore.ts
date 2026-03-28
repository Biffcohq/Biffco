import { create } from 'zustand'

export interface SignupState {
  step: number
  workspaceName: string
  workspaceSlug: string
  country: string
  verticalId: string
  initialRoles: string[]
  adminName: string
  adminEmail: string
  passwordHash: string
  // Actions
  nextStep: () => void
  prevStep: () => void
  setWorkspace: (data: { workspaceName: string, workspaceSlug: string, country: string }) => void
  setVertical: (id: string) => void
  setRoles: (roles: string[]) => void
  setAdmin: (data: { adminName: string, adminEmail: string, passwordHash: string }) => void
}

export const useSignupStore = create<SignupState>((set) => ({
  step: 1,
  workspaceName: '',
  workspaceSlug: '',
  country: 'AR',
  verticalId: '',
  initialRoles: [],
  adminName: '',
  adminEmail: '',
  passwordHash: '',

  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 8) })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
  
  setWorkspace: (data) => set(() => data),
  setVertical: (verticalId) => set(() => ({ verticalId })),
  setRoles: (initialRoles) => set(() => ({ initialRoles })),
  setAdmin: (data) => set(() => data)
}))
