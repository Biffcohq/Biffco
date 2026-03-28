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
          async headers() {
            if (typeof window !== 'undefined') {
              const storageStr = localStorage.getItem('biffco-auth-storage')
              if (storageStr) {
                 try {
                   const parsed = JSON.parse(storageStr)
                   const token = parsed?.state?.accessToken
                   if (token) {
                     return { Authorization: `Bearer ${token}` }
                   }
                 } catch (e) {}
              }
            }
            return {}
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
