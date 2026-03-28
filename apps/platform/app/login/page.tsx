"use client"

import { useState, useEffect } from 'react'
import { IconLoader2, IconAlertCircle, IconEye, IconEyeOff } from '@tabler/icons-react'
import { trpc } from '../../lib/trpc'
import { useAuthStore } from '../stores/useAuthStore'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthLayout } from '../components/auth/AuthLayout'
import { SocialAuthPrompt } from '../components/auth/SocialAuthPrompt'
import { MotionDiv } from '../components/ui/MotionDiv'

export default function LoginPage() {
  const router = useRouter()
  const setSession = useAuthStore(s => s.setSession)
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
      setErrorMsg('Please enter both email and password.')
      return
    }

    setErrorMsg('')
    setIsHashing(true)

    try {
      const sodiumModule = await import('libsodium-wrappers')
      await sodiumModule.default.ready
      const sodium = sodiumModule.default

      const passwordBytes = new TextEncoder().encode(password)
      const hashBytes = sodium.crypto_generichash(64, passwordBytes, null)
      const passwordHash = sodium.to_hex(hashBytes)

      loginMutation.mutate({
        email,
        passwordHash,
      })
    } catch (err: any) {
      setErrorMsg('Error processing cryptographic proof.')
      setIsHashing(false)
    }
  }

  const isLoading = isHashing || loginMutation.isPending

  return (
    <AuthLayout
      heading="Welcome back to BIFFCO."
      subheading="Sign in to your account to monitor your supply chain, verify documents, and guarantee absolute trust."
      quote={
        <div className="bg-white/10 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
          <p className="font-medium text-lg italic tracking-tight opacity-90 leading-snug">
            "BIFFCO's cryptographic proofs saved our enterprise from compliance risks in less time than our previous software took to boot up."
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">AJ</div>
            <div>
              <p className="font-bold text-sm">Alejandro J.</p>
              <p className="text-xs opacity-70">Supply Chain Director</p>
            </div>
          </div>
        </div>
      }
    >
      <MotionDiv
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-navy mb-2">Sign in to Biffco</h2>
          <p className="text-text-secondary">
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary font-semibold hover:text-primary-hover hover:underline decoration-primary/30 underline-offset-4 transition-colors">
              Create a free workspace
            </Link>
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          {errorMsg && (
            <div className="p-3 bg-error-subtle text-error rounded-md text-sm flex gap-2 items-center border border-error/20">
              <IconAlertCircle size={18} className="shrink-0" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-text-primary block">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full px-4 py-2.5 bg-surface-raised border border-border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-text-primary block">Master Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-4 pr-10 py-2.5 bg-surface-raised border border-border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm font-mono"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
              </button>
            </div>
            <div className="flex justify-end mt-1">
              <button type="button" className="text-xs text-primary font-medium hover:underline p-0 m-0">
                Forgot password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`mt-2 flex items-center justify-center gap-2 w-full h-11 rounded-full font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 relative overflow-hidden ${
              isLoading
                ? 'bg-surface-raised text-text-muted border border-border cursor-not-allowed shadow-none'
                : 'bg-primary text-white hover:bg-primary-hover active:scale-95'
            }`}
          >
            {isLoading ? (
              <><IconLoader2 size={18} stroke={2} className="animate-spin" /> Authenticating...</>
            ) : (
              <>Sign In</>
            )}
          </button>
        </form>

        <SocialAuthPrompt />
      </MotionDiv>
    </AuthLayout>
  )
}
