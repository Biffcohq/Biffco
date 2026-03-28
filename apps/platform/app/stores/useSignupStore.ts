import { create } from 'zustand'

export interface SignupState {
  step: number
  adminName: string
  adminEmail: string
  passwordHash: string
  publicKey: string
  termsAccepted: boolean
  
  // Organization
  workspaceName: string
  workspaceSlug: string
  country: string
  
  // Vertical & Roles
  verticalId: string
  initialRoles: string[]
  
  // Actions
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  setAdmin: (data: { adminName: string, adminEmail: string, passwordHash: string, termsAccepted: boolean }) => void
  setWorkspace: (data: { workspaceName: string, workspaceSlug: string, country: string }) => void
  setVertical: (id: string) => void
  setRoles: (roles: string[]) => void
}

export const useSignupStore = create<SignupState>((set) => ({
  step: 1,
  
  adminName: '',
  adminEmail: '',
  passwordHash: '',
  publicKey: '',
  termsAccepted: false,
  
  workspaceName: '',
  workspaceSlug: '',
  country: 'AR',
  
  verticalId: '',
  initialRoles: [],

  setStep: (step) => set(() => ({ step })),
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 6) })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
  
  setAdmin: (data) => set(() => data),
  setWorkspace: (data) => set(() => data),
  setVertical: (verticalId) => set(() => ({ verticalId })),
  setRoles: (initialRoles) => set(() => ({ initialRoles })),
}))
