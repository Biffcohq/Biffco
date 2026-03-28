import React from 'react'

export function SocialAuthPrompt() {
  return (
    <div className="mt-8 flex flex-col gap-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-surface px-2 text-text-muted font-mono tracking-widest">Or continue with</span>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <button
          type="button"
          disabled
          className="w-full h-11 border border-border bg-surface hover:bg-surface-raised rounded-md text-sm font-medium text-text-primary transition-colors flex items-center justify-center gap-3 opacity-60 cursor-not-allowed group"
          title="Social login will be available soon"
        >
          <svg className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all opacity-50" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.36,22 12.22,22C17,22 21.97,18.37 21.97,12.89C21.97,11.23 21.35,11.1 21.35,11.1Z"
            />
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  )
}
