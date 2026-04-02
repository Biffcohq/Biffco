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
    } else if (!hasRefreshToken) {
      useAuthStore.getState().clearSession()
    } else {
      useAuthStore.getState().setHasRefreshToken(true)
    }
    initialized.current = true
  }
  return null
}
