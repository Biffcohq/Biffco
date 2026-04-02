/* global process, fetch, window */
"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import React, { useState } from 'react'
import { trpc } from '../lib/trpc'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 5 * 1000 } }
  }))
  
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/trpc',
          async fetch(url, options) {
            // @ts-expect-error known TRPC AbortSignal union mismatch with exactOptionalPropertyTypes
            let res = await fetch(url, { ...options, credentials: 'include' })
            
            // Interceptar 401s globales. Si el access token murió (dura 15 min),
            // TRPC arrojará un status 401. Silenciosamente intentamos refrescarlo.
            if (res.status === 401 && !url.toString().includes('auth.refresh') && !url.toString().includes('auth.login')) {
              const refreshUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/trpc'}/auth.refresh`
              const refreshRes = await fetch(refreshUrl, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({}),
                credentials: 'include'
              })

              // Si el Refresh Token aún está vivo (dura 30 días), la API nos devolvió 
              // un nuevo accessToken por Cookie. Re-lanzamos la petición original.
              if (refreshRes.ok) {
                // @ts-expect-error known TRPC AbortSignal union mismatch with exactOptionalPropertyTypes
                res = await fetch(url, { ...options, credentials: 'include' })
              } else {
                // El Refresh Token también murió. Forzamos limpiar la UX expulsando al usuario globalmente.
                if (typeof window !== 'undefined') window.location.href = '/login'
              }
            }
            return res
          },
        }),
      ],
    }),
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  )
}
