"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { IconShieldCheck, IconLoader2, IconMail, IconLock, IconAlertCircle } from '@tabler/icons-react'
import { trpc } from '../../lib/trpc'
import { useAuthStore } from '../stores/useAuthStore'
import _sodium from 'libsodium-wrappers'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Bypass TS strict prop check on framer-motion v12 with NextJS
const MotionDiv = motion.div as any;

export default function LoginPage() {
  const router = useRouter()
  const setSession = useAuthStore(s => s.setSession)
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isHashing, setIsHashing] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data: any) => {
      setSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        workspaceId: data.workspaceId,
        memberId: data.memberId,
        personName: data.personName,
      })
      router.push('/')
    },
    onError: (error: any) => {
      let displayError = error.message
      try {
        const parsed = JSON.parse(error.message)
        if (Array.isArray(parsed) && parsed[0]?.message) {
          displayError = parsed[0].message
        }
      } catch (e) {}
      setErrorMsg(displayError)
      setIsHashing(false)
    }
  })

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setErrorMsg('Por favor completa ambos campos.')
      return
    }

    setErrorMsg('')
    setIsHashing(true)

    // Hash the password purely on the client (Zero-Knowledge)
    await _sodium.ready
    const sodium = _sodium
    try {
      const passwordBytes = new TextEncoder().encode(password)
      const hashBytes = sodium.crypto_generichash(64, passwordBytes, null)
      const passwordHash = sodium.to_hex(hashBytes)

      loginMutation.mutate({
        email,
        passwordHash,
      })
    } catch (err: any) {
      setErrorMsg('Error al procesar la criptografía local.')
      setIsHashing(false)
    }
  }

  const isLoading = isHashing || loginMutation.isPending

  return (
    <main className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[420px] z-10 relative">
        <header className="mb-8 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-navy mb-1">
            <IconShieldCheck size={36} stroke={2} className="text-primary" />
            <span className="font-bold text-3xl tracking-tight">BIFFCO</span>
          </div>
          <p className="text-text-secondary text-sm font-medium">
            Accede a tu cuenta institucional
          </p>
        </header>

        <MotionDiv 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-border rounded-xl p-8 shadow-lg relative overflow-hidden"
        >
          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            {errorMsg && (
              <div className="p-3 bg-error-subtle text-error rounded-md text-sm flex gap-2 items-center border border-error/20">
                <IconAlertCircle size={18} className="shrink-0" />
                <span className="font-medium">{errorMsg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-navy block">Correo Institucional</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconMail className="text-text-muted" size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="ejemplo@empresa.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-raised border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-navy block">Contraseña Maestra</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconLock className="text-text-muted" size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-raised border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm font-mono"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className={`mt-2 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 relative overflow-hidden ${
                isLoading
                  ? 'bg-surface-raised text-text-muted border border-border cursor-not-allowed shadow-none'
                  : 'bg-primary text-white hover:bg-primary-hover shadow-md hover:shadow-lg active:scale-[0.98]'
              }`}
            >
              {isLoading ? (
                <><IconLoader2 size={18} stroke={2} className="animate-spin" /> Conectando...</>
              ) : (
                <>Iniciar Sesión</>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-border pt-6">
            <p className="text-sm text-text-secondary">
              ¿No tienes un Workspace aún?{' '}
              <Link href="/signup" className="text-primary font-bold hover:underline underline-offset-4">
                Regístrate ahora
              </Link>
            </p>
          </div>
        </MotionDiv>
      </div>
    </main>
  )
}
