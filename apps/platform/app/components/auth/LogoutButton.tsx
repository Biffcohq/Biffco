"use client"

import { IconLogout } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc'

export function LogoutButton() {
  const router = useRouter()
  const utils = trpc.useUtils()
  // const logoutState = useUIStore(s => s.resetStore) // Si hubiera una función para limpiar estado local
  
  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => {
      // Limpiar el cache de trpc
      utils.client.clear()
      // Redireccionar al login
      router.push('/login')
    },
    onError: (err: any) => {
      console.error("Logout error", err)
      // Incluso si falla, forzamos salida localmente
      router.push('/login')
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
