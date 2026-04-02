/* global setTimeout, clearTimeout */
/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState, useEffect } from 'react'
import { useSignupStore } from '../../stores/useSignupStore'
import { IconArrowRight, IconEye, IconEyeOff, IconAlertCircle, IconLoader2, IconCheck } from '@tabler/icons-react'
import { trpc } from '../../../lib/trpc'
import { SocialAuthPrompt } from '../../components/auth/SocialAuthPrompt'

export function Step1Credentials() {
  const store = useSignupStore()
  
  const [name, setName] = useState(store.adminName)
  const [email, setEmail] = useState(store.adminEmail)
  const [password, setPassword] = useState('') // No persisto pass cruda en store por mas de 1 paso
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(store.termsAccepted)
  
  const [emailError, setEmailError] = useState('')
  const [passError, setPassError] = useState('')
  const [isHashing, setIsHashing] = useState(false)
  const [isValidatingEmail, setIsValidatingEmail] = useState(false)

  // tRPC Utils for debounced live validation
  const utils = trpc.useUtils()

  // Debounce email check
  useEffect(() => {
    if (!email || !email.includes('@')) {
      setEmailError('')
      return
    }

    const timer = setTimeout(async () => {
      setIsValidatingEmail(true)
      try {
        const res = await utils.auth.checkEmail.fetch({ email })
        if (!res.available) {
          setEmailError('This email is already registered.')
        } else {
          setEmailError('')
        }
      } catch {
        setEmailError('') // ignore network errors
      } finally {
        setIsValidatingEmail(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [email, utils])

  const onNext = async (e: React.FormEvent) => {
    e.preventDefault()

    if (emailError) return
    if (!name || !email || !password || !confirmPassword) return
    
    if (password !== confirmPassword) {
      setPassError('Passwords do not match.')
      return
    }
    
    if (password.length < 8) {
      setPassError('Password must be at least 8 characters long.')
      return
    }
    
    if (!termsAccepted) {
      setPassError('You must explicitly agree to the Terms of Service to create an account.')
      return
    }

    setPassError('')
    setIsHashing(true)

    // Generate local hash of the password
    // Pass raw password to store (C-03 Remediado, backend handles Scrypt)
    store.setAdmin({
      adminName: name,
      adminEmail: email.toLowerCase(),
      passwordHash: password, // Mantengo la prop en el estado interno por retrocompatibilidad temporal, pero envío raw pass
      termsAccepted
    })
    
    store.nextStep()
  }

  return (
    <form onSubmit={onNext} className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
      
      {passError && (
        <div className="p-3 bg-error-subtle text-error rounded-md text-sm flex gap-2 items-center border border-error/20">
          <IconAlertCircle size={18} className="shrink-0" />
          <span className="font-medium">{passError}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-text-primary block">Your Full Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Jane Doe"
          className="w-full px-4 py-2.5 bg-surface-raised border border-border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-text-primary block">Your Email Address</label>
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="jane@company.com"
            className={`w-full px-4 pr-10 py-2.5 bg-surface-raised border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-sm ${
              emailError ? 'border-error focus:border-error focus:ring-error/20' : 'border-border focus:border-primary'
            }`}
            required
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            {isValidatingEmail ? (
              <IconLoader2 size={16} className="animate-spin text-text-muted" />
            ) : emailError ? (
              <IconAlertCircle size={16} className="text-error" />
            ) : (email && email.includes('@')) ? (
              <IconCheck size={16} className="text-success" />
            ) : null}
          </div>
        </div>
        {emailError && <p className="text-xs text-error font-medium">{emailError}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-text-primary block">Create a Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Min 8 characters"
            className="w-full pl-4 pr-12 py-2.5 bg-surface-raised border border-border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm font-mono"
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
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-text-primary block">Confirm Your Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Min 8 characters"
            className="w-full pl-4 pr-12 py-2.5 bg-surface-raised border border-border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm font-mono"
            required
          />
        </div>
      </div>

      <label className="flex items-start gap-3 mt-1 cursor-pointer group">
        <div className="relative flex items-center justify-center mt-0.5">
          <input 
            type="checkbox" 
            className="peer appearance-none w-5 h-5 border-2 border-border rounded bg-surface-raised checked:bg-primary checked:border-primary transition-all focus:ring-2 focus:ring-primary/30 focus:outline-none cursor-pointer"
            checked={termsAccepted}
            onChange={e => setTermsAccepted(e.target.checked)}
            required
          />
          <IconCheck size={14} stroke={3} className="absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-all duration-200" />
        </div>
        <span className="text-sm text-text-secondary select-none leading-tight">
          By signing up, you explicitly agree to our <span className="font-semibold text-text-primary group-hover:underline">Terms of Service</span> and <span className="font-semibold text-text-primary group-hover:underline">Privacy Policy</span>.
        </span>
      </label>

      <button 
        type="submit"
        disabled={isHashing || isValidatingEmail || !!emailError || !termsAccepted}
        className="mt-2 flex items-center justify-center gap-2 w-full h-11 bg-primary text-white hover:bg-primary-hover active:scale-95 disabled:opacity-50 disabled:active:scale-100 rounded-md font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        {isHashing ? (
          <><IconLoader2 size={18} className="animate-spin" /> Securing credentials...</>
        ) : (
          <>Create Account <IconArrowRight size={18} stroke={2.5}/></>
        )}
      </button>

      <SocialAuthPrompt />
    </form>
  )
}
