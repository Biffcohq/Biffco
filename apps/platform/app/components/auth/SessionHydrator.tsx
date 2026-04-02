"use client"
import { useRef } from 'react'
import { useAuthStore } from '../../stores/useAuthStore'

interface SessionData {
  workspaceId: string
  memberId: string
  personName: string
}

export function SessionHydrator({ session }: { session: SessionData | null }) {
  const initialized = useRef(false)
  if (!initialized.current) {
    if (session) {
      useAuthStore.getState().setSession(session)
    } else {
      useAuthStore.getState().clearSession()
    }
    initialized.current = true
  }
  return null
}
