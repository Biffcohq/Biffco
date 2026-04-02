"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../../stores/useAuthStore'
import { trpc } from '@/app/lib/trpc'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, hasRefreshToken, setSession, clearSession } = useAuthStore()
  const [isClient, setIsClient] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const refreshMutation = trpc.auth.refresh.useMutation()

  useEffect(() => {
    setIsClient(true)
    if (!isAuthenticated && !isRefreshing) {
      if (hasRefreshToken) {
        setIsRefreshing(true)
        refreshMutation.mutate(undefined, {
          onSuccess: (data) => {
            if (data.workspaceId && data.memberId && data.personName) {
              setSession({
                workspaceId: data.workspaceId,
                memberId: data.memberId,
                personName: data.personName
              })
            } else {
               clearSession()
               router.push('/login')
            }
            setIsRefreshing(false)
          },
          onError: () => {
            clearSession()
            router.push('/login')
            setIsRefreshing(false)
          }
        })
      } else {
        router.push('/login')
      }
    }
  }, [isAuthenticated, hasRefreshToken, router, isRefreshing])

  // Prevenir un "flash" de contenido no autenticado durante hidratación o refresh
  if (!isClient || !isAuthenticated || isRefreshing) {
    // Retornamos un div vacío con el background para que la transición sea suave
    return <div className="h-screen w-screen bg-bg"></div>
  }

  return <>{children}</>
}
