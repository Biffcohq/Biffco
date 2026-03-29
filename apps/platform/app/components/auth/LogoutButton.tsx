"use client"

import { IconLogout } from '@tabler/icons-react'

import { trpc } from '@/lib/trpc'
import { useAuthStore } from '@/app/stores/useAuthStore'
export function LogoutButton() {

  const utils = trpc.useUtils()
  // const logoutState = useUIStore(s => s.resetStore) // Si hubiera una función para limpiar estado local
  
  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.client.clear()
      useAuthStore.getState().clearSession() // Important: clears Zustand state
      window.location.href = process.env.NEXT_PUBLIC_WEB_URL || 'https://biffco.co'
    },
    onError: (err: any) => {
      console.error("Logout error", err)
      useAuthStore.getState().clearSession() 
      window.location.href = process.env.NEXT_PUBLIC_WEB_URL || 'https://biffco.co'
    }
  })

  return (
    <button 
      onClick={() => logout.mutate()}
      disabled={logout.isPending}
      className={`ml-auto text-white/50 hover:text-white shrink-0 cursor-pointer p-1 transition-colors ${logout.isPending ? 'opacity-50' : ''}`}
      aria-label="Cerrar sesión"
      title="Cerrar sesión"
    >
      <IconLogout size={16} stroke={1.5} />
    </button>
  )
}
