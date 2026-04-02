"use client"
import { useRef } from 'react'
import { useAuthStore } from '../../stores/useAuthStore'

interface SessionData {
  workspaceId: string
  memberId: string
  personName: string
}

export function SessionHydrator({ session, hasRefreshToken }: { session: SessionData | null, hasRefreshToken?: boolean }) {
  const initialized = useRef(false)
  if (!initialized.current) {
    if (session) {
      useAuthStore.getState().setSession(session)
      useAuthStore.getState().setHydrated()
    } else if (!hasRefreshToken) {
      useAuthStore.getState().clearSession() // already sets isHydrated
    } else {
      useAuthStore.getState().setHasRefreshToken(true)
      useAuthStore.getState().setHydrated()
    }
    initialized.current = true
  }
  return null
}
