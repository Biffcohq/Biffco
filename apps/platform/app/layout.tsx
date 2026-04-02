/* global Buffer, console */
import './globals.css'
import React from 'react'
import { Providers } from './providers'
import ServiceWorkerRegister from '../components/ServiceWorkerRegister'
import { SessionHydrator } from './components/auth/SessionHydrator'
import { cookies } from 'next/headers'
import { Inter, JetBrains_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ["400", "500", "600", "700"],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ["400", "500"],
})

import { Toaster } from '@biffco/ui'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('accessToken')?.value
  const hasRefreshToken = cookieStore.get('refreshToken')?.value !== undefined
  
  let initialSession = null
  if (token) {
    try {
      const payloadBase64 = token.split('.')[1]
      if (payloadBase64) {
        const payloadStr = Buffer.from(payloadBase64, 'base64').toString('utf8');
        const payload = JSON.parse(payloadStr);
        if (payload.exp * 1000 > Date.now()) {
          initialSession = {
            workspaceId: payload.workspaceId,
            memberId: payload.memberId,
            personName: payload.personName,
          }
        }
      }
    } catch (err: unknown) {
      console.error("[AUTH] Error decodificando JWT SSR:", err)
    }
  }

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans font-normal antialiased min-h-screen flex flex-col bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
        <SessionHydrator session={initialSession} hasRefreshToken={hasRefreshToken} />
        <Providers>
          {children}
          <Toaster position="top-right" />
          <ServiceWorkerRegister />
        </Providers>
      </body>
    </html>
  );
}
