"use client"
import React from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from './stores/useAuthStore'
import { IconLoader2 } from '@tabler/icons-react'

export default function RootPage() {
  const router = useRouter()
  const workspaceId = useAuthStore(s => s.workspaceId)
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)

  useEffect(() => {
    if (isAuthenticated && workspaceId) {
       router.replace(`/w/${workspaceId}`)
    } else {
       router.replace('/login')
    }
  }, [isAuthenticated, workspaceId, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base">
      <div className="flex flex-col items-center gap-4">
         <IconLoader2 size={32} className="text-primary animate-spin" />
         <p className="text-sm font-medium text-text-muted animate-pulse">Iniciando Biffco Hub...</p>
      </div>
    </div>
  )
}
