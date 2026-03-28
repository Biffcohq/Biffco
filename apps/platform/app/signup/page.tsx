"use client"

import { AnimatePresence } from 'framer-motion'
import { useSignupStore } from '../stores/useSignupStore'
import { Step1Credentials } from './components/Step1Credentials'
import { Step2Mnemonic } from './components/Step2Mnemonic'
import { Step3Organization } from './components/Step3Organization'
import { Step4Vertical } from './components/Step4Vertical'
import { Step5Roles } from './components/Step5Roles'
import { MotionDiv } from '../components/ui/MotionDiv'
import { AuthLayout } from '../components/auth/AuthLayout'
import Link from 'next/link'

export default function SignupPage() {
  const step = useSignupStore(s => s.step)

  return (
    <AuthLayout
      heading="Join Us and Unlock Endless Possibilities!"
      subheading="Welcome to BIFFCO, where your journey begins. Sign up now to access exclusive features, deploy your trust infrastructure, and completely trace your assets."
      quote={
        <div className="bg-white/10 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
          <p className="font-medium text-lg italic tracking-tight opacity-90 leading-snug">
            "Once we integrated Biffco's zero-knowledge proofs, our entire supply chain audit took seconds instead of weeks. We knew exactly what kind of infrastructure we needed."
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-[4px] text-lg text-yellow-400 mb-2">
            {'★★★★★'}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">SM</div>
            <div>
              <p className="font-bold text-sm">Sara M.</p>
              <p className="text-xs opacity-70">Compliance Manager</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="w-full flex flex-col h-full">
        {step > 1 && (
           <header className="mb-8 flex flex-col items-start gap-4">
             <div className="flex items-center gap-1.5 w-full">
               {[1, 2, 3, 4, 5].map(s => (
                 <div 
                   key={s} 
                   className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                     s <= step ? 'bg-primary' : 'bg-surface-overlay'
                   }`}
                 />
               ))}
             </div>
             <div>
               <p className="text-xs text-text-secondary font-semibold uppercase tracking-widest font-mono">
                 Step {step} of 5
               </p>
             </div>
           </header>
        )}

        {step === 1 && (
          <div className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight text-navy mb-2">Create Account</h2>
            <p className="text-text-secondary">
              Already a member?{' '}
              <Link href="/login" className="text-primary font-semibold hover:text-primary-hover hover:underline decoration-primary/30 underline-offset-4 transition-colors">
                Log in here
              </Link>
            </p>
          </div>
        )}

        <div className="flex-1 overflow-visible">
          <AnimatePresence mode="wait">
            <MotionDiv
              key={step}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.25, ease: "easeOut" } }}
              exit={{ opacity: 0, x: -10, transition: { duration: 0.15, ease: "easeIn" } }}
            >
              {step === 1 && <Step1Credentials />}
              {step === 2 && <Step2Mnemonic />}
              {step === 3 && <Step3Organization />}
              {step === 4 && <Step4Vertical />}
              {step === 5 && <Step5Roles />}
            </MotionDiv>
          </AnimatePresence>
        </div>
      </div>
    </AuthLayout>
  )
}
