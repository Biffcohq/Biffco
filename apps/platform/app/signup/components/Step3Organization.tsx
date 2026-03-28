import { useState, useEffect } from 'react'
import { useSignupStore } from '../../stores/useSignupStore'
import { IconArrowLeft, IconArrowRight, IconBuilding, IconCheck, IconLoader2, IconAlertCircle } from '@tabler/icons-react'
import { trpc } from '../../../lib/trpc'

export function Step3Organization() {
  const store = useSignupStore()
  
  const [workspaceName, setWorkspaceName] = useState(store.workspaceName)
  const [workspaceSlug, setWorkspaceSlug] = useState(store.workspaceSlug)
  const [country, setCountry] = useState(store.country)
  
  const [slugError, setSlugError] = useState('')
  const [isValidatingSlug, setIsValidatingSlug] = useState(false)
  
  const utils = trpc.useUtils()

  // Auto-generate slug when name or country changes if user hasn't typed a custom slug
  const [userEditedSlug, setUserEditedSlug] = useState(!!store.workspaceSlug)
  
  useEffect(() => {
    if (!userEditedSlug && workspaceName) {
      const generated = `${workspaceName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${country.toLowerCase()}`
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
      setWorkspaceSlug(generated)
    }
  }, [workspaceName, country, userEditedSlug])

  // Debounced live validation for Slug
  useEffect(() => {
    if (!workspaceSlug) {
      setSlugError('')
      return
    }

    const timer = setTimeout(async () => {
      // Regex check
      if (!/^[a-z0-9-]+$/.test(workspaceSlug)) {
        setSlugError('Slug can only contain lowercase letters, numbers, and hyphens.')
        return
      }
      
      setIsValidatingSlug(true)
      try {
        const res = await utils.auth.checkSlug.fetch({ slug: workspaceSlug })
        if (!res.available) {
          setSlugError('This slug is already taken. Try adding your city or another identifier.')
        } else {
          setSlugError('')
        }
      } catch (e) {
        setSlugError('')
      } finally {
        setIsValidatingSlug(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [workspaceSlug, utils])

  const onNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (!workspaceName || !workspaceSlug || !country) return
    if (slugError || isValidatingSlug) return
    
    store.setWorkspace({ workspaceName, workspaceSlug, country })
    store.nextStep()
  }

  return (
    <form onSubmit={onNext} className="flex flex-col h-full animate-in fade-in duration-300">
      <div className="mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-2 text-navy mb-2">
          Organization Details
        </h2>
        <p className="text-text-secondary">
          Tell us about the company or establishment you are representing.
        </p>
      </div>

      <div className="flex-1 flex flex-col gap-6 pt-2">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-text-primary block">Organization Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IconBuilding className="text-text-muted" size={18} />
            </div>
            <input
              type="text"
              value={workspaceName}
              onChange={e => setWorkspaceName(e.target.value)}
              placeholder="e.g. Acme Farms LLC"
              className="w-full pl-10 pr-4 py-2.5 bg-surface-raised border border-border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-text-primary block">Country of Operation</label>
          <select
            value={country}
            onChange={e => setCountry(e.target.value)}
            className="w-full px-3 py-2.5 bg-surface-raised border border-border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm appearance-none"
            required
          >
            <option value="AR">Argentina</option>
            <option value="BR">Brazil</option>
            <option value="US">United States</option>
            <option value="EU">European Union</option>
            <option value="UY">Uruguay</option>
            <option value="PY">Paraguay</option>
            <option value="OT">Other</option>
          </select>
        </div>
        
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-text-primary block">Workspace Slug</label>
          <div className="relative">
            <input
              type="text"
              value={workspaceSlug}
              onChange={e => {
                setWorkspaceSlug(e.target.value.toLowerCase())
                setUserEditedSlug(true)
              }}
              placeholder="acme-farms-ar"
              className={`w-full pl-4 pr-10 py-2.5 bg-surface-raised border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-sm font-mono ${
                slugError ? 'border-error focus:border-error focus:ring-error/20' : 'border-border focus:border-primary'
              }`}
              required
            />
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              {isValidatingSlug ? (
                <IconLoader2 size={16} className="animate-spin text-text-muted" />
              ) : slugError ? (
                <IconAlertCircle size={16} className="text-error" />
              ) : (workspaceSlug && workspaceSlug.length >= 2) ? (
                <IconCheck size={16} className="text-success" />
              ) : null}
            </div>
          </div>
          {slugError ? (
             <p className="text-xs text-error font-medium">{slugError}</p>
          ) : (
            <p className="text-xs text-text-secondary mt-1">This will be your unique identifier on the Biffco Network (e.g. workspace.biffco.co).</p>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-auto pt-6 border-t border-border">
        <button 
          onClick={store.prevStep}
          type="button"
          className="flex items-center justify-center gap-2 w-32 h-11 bg-surface text-text-primary border border-border hover:bg-surface-raised active:scale-95 rounded-full font-bold transition-all duration-200"
        >
          <IconArrowLeft size={18} stroke={2} /> Back
        </button>

        <button 
          type="submit"
          disabled={!workspaceName || !workspaceSlug || !!slugError || isValidatingSlug}
          className="flex items-center justify-center gap-2 w-48 h-11 bg-primary text-white hover:bg-primary-hover active:scale-95 disabled:opacity-50 disabled:active:scale-100 rounded-full font-bold transition-all duration-200"
        >
          Continue <IconArrowRight size={18} stroke={2.5}/>
        </button>
      </div>
    </form>
  )
}
