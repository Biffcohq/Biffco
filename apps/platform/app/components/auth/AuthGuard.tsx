"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../../stores/useAuthStore'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  // Prevenir un "flash" de contenido no autenticado durante hidratación en Server Components
  if (!isClient || !isAuthenticated) {
    // Retornamos un div vacío con el background para que la transición sea suave
    return <div className="h-screen w-screen bg-bg"></div>
  }

  return <>{children}</>
}
