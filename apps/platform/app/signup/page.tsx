"use client"

import { AnimatePresence } from 'framer-motion'
import { useSignupStore } from '../stores/useSignupStore'
import { Step1Organization } from './components/Step1Organization'
import { Step2Vertical } from './components/Step2Vertical'
import { Step3Roles } from './components/Step3Roles'
import { Step4Admin } from './components/Step4Admin'
import { Step5Mnemonic } from './components/Step5Mnemonic'
import { MotionDiv } from '../components/ui/MotionDiv'
import { IconShieldCheck } from '@tabler/icons-react'

export default function SignupPage() {
  const step = useSignupStore(s => s.step)

  return (
    <main className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-xl z-10 relative">
        <header className="mb-8 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-navy mb-1">
            <IconShieldCheck size={32} stroke={2} className="text-primary" />
            <span className="font-bold text-3xl tracking-tight">BIFFCO</span>
          </div>
          
          <div className="flex items-center gap-1.5 w-full max-w-sm mx-auto px-4">
            {[1, 2, 3, 4, 5].map(s => (
              <div 
                key={s} 
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-primary' : 'bg-border'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-center w-full max-w-sm pt-1">
            <p className="text-xs text-text-secondary font-medium uppercase tracking-widest font-mono">
              Paso {step} de 5
            </p>
          </div>
        </header>

        <div className="bg-surface border border-border rounded-xl p-8 sm:p-10 shadow-lg min-h-[460px] relative overflow-hidden">
          <AnimatePresence mode="wait">
            <MotionDiv
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.3 } }}
              exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
              className="h-full"
            >
              {step === 1 && <Step1Organization />}
              {step === 2 && <Step2Vertical />}
              {step === 3 && <Step3Roles />}
              {step === 4 && <Step4Admin />}
              {step === 5 && <Step5Mnemonic />}
            </MotionDiv>
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}
