import React from 'react'
import { IconShieldCheck } from '@tabler/icons-react'

interface AuthLayoutProps {
  children: React.ReactNode
  heading?: string
  subheading?: React.ReactNode
  quote?: React.ReactNode
}

export function AuthLayout({
  children,
  heading = "Trust Infrastructure for Global Value Chains.",
  subheading = "Welcome to BIFFCO. Sign in to access your dashboard, trace your assets, and continue building trust across your entire supply chain.",
  quote,
}: AuthLayoutProps) {
  return (
    <main className="h-[100dvh] bg-bg flex flex-col lg:grid lg:grid-cols-12 font-sans overflow-hidden">
      {/* ─── LEFT PANEL (Branding) ─── */}
      <aside className="hidden lg:flex flex-col justify-between col-span-5 bg-primary text-white p-12 lg:p-16 relative overflow-hidden h-full">
        {/* Decorative subtle pattern or gradient could go here */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <IconShieldCheck size={40} stroke={2} className="text-white" />
            <span className="font-bold text-3xl tracking-tight">BIFFCO</span>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              {heading}
            </h1>
            <p className="text-lg text-white/80 max-w-md leading-relaxed">
              {subheading}
            </p>
          </div>

          {/* Optional Testimonial / Quote */}
          {quote && (
            <div className="mt-12 text-white/90">
              {quote}
            </div>
          )}
        </div>
      </aside>

      {/* ─── RIGHT PANEL (Form Area) ─── */}
      <section className="flex-1 lg:col-span-7 relative bg-surface overflow-y-auto h-full w-full">
        <div className="min-h-full w-full flex flex-col justify-center items-center p-6 sm:p-12 lg:p-20">
          {/* Mobile Header (only visible on small screens) */}
          <div className="flex lg:hidden items-center gap-2 mb-10 text-navy w-full max-w-md">
            <IconShieldCheck size={32} stroke={2} className="text-primary" />
            <span className="font-bold text-2xl tracking-tight">BIFFCO</span>
          </div>

          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </section>
    </main>
  )
}
