/* global alert */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSignupStore } from '../../stores/useSignupStore'
import { trpc } from '../../../lib/trpc'
import { IconArrowLeft, IconCheckbox, IconSquare, IconLoader2, IconShieldLock } from '@tabler/icons-react'
import { useAuthStore } from '../../stores/useAuthStore'
import { useRouter } from 'next/navigation'

export function Step5Roles() {
  const store = useSignupStore()
  const setSession = useAuthStore(s => s.setSession)
  const router = useRouter()

  const { data: verticals } = trpc.verticals.list.useQuery()
  const selectedVertical = verticals?.find((v: any) => v.id === store.verticalId)

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: (data: any) => {
      // Login with session
      setSession({
        workspaceId: data.workspaceId,
        memberId: data.memberId,
        personName: store.adminName,
      })
      alert(`Workspace Created successfully!\nWelcome to BIFFCO.\nYour Member ID is: ${data.memberId}`)
      router.push('/')
    },
    onError: (error: any) => {
      alert("Registration failed: " + error.message)
    }
  })

  const toggleRole = (roleId: string) => {
    if (store.initialRoles.includes(roleId)) {
      store.setRoles(store.initialRoles.filter(r => r !== roleId))
    } else {
      store.setRoles([...store.initialRoles, roleId])
    }
  }

  const onSubmit = () => {
    if (store.initialRoles.length === 0) return

    registerMutation.mutate({
      workspaceName: store.workspaceName,
      workspaceSlug: store.workspaceSlug,
      country: store.country,
      verticalId: store.verticalId,
      initialRoles: store.initialRoles,
      personName: store.adminName,
      email: store.adminEmail,
      password: store.passwordHash, // Mapeado a la key que la API espera tras remover hasheo client-side
      publicKey: store.publicKey,
      wsIdx: 0
    })
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="text-3xl font-bold flex items-center gap-2 text-navy mb-2">
          Define your Roles
        </h2>
        <p className="text-text-secondary text-base">
          Select which parts of the <strong>{selectedVertical?.name || 'selected'}</strong> supply chain you participate in.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 pr-2 space-y-3">
        {selectedVertical && (selectedVertical as any).actorTypes ? (
          ((selectedVertical as any).actorTypes || []).map((actor: any) => {
            const isSelected = store.initialRoles.includes(actor.id)
            return (
              <button
                key={actor.id}
                onClick={() => toggleRole(actor.id)}
                className={`w-full flex items-start text-left gap-4 p-4 rounded-xl border transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer group ${
                  isSelected
                    ? 'border-primary bg-primary-subtle shadow-sm'
                    : 'border-border bg-surface hover:border-border-strong hover:shadow-sm'
                }`}
              >
                <div className={`mt-0.5 rounded-md transition-colors ${isSelected ? 'text-primary' : 'text-text-muted group-hover:text-text-primary'}`}>
                  {isSelected ? (
                    <IconCheckbox size={24} stroke={2} />
                  ) : (
                    <IconSquare size={24} stroke={1.5} />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold text-base mb-1 ${isSelected ? 'text-primary' : 'text-text-primary'}`}>
                    {actor.name}
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed max-w-sm">
                    Can issue up to {(selectedVertical as any).eventCatalog?.length || 0} types of pre-encoded events.
                  </p>
                </div>
              </button>
            )
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-10 opacity-60">
            <IconLoader2 size={32} className="animate-spin text-primary mb-2" />
            <p className="text-sm font-medium text-text-muted">Loading roles...</p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-auto pt-6 border-t border-border">
        <button 
          onClick={store.prevStep}
          disabled={registerMutation.isPending}
          className="flex items-center justify-center gap-2 w-32 h-11 bg-surface text-text-primary border border-border hover:bg-surface-raised active:scale-95 disabled:opacity-50 disabled:active:scale-100 rounded-full font-bold transition-all duration-200"
        >
          <IconArrowLeft size={18} stroke={2} /> Back
        </button>

        <button 
          onClick={onSubmit}
          disabled={store.initialRoles.length === 0 || registerMutation.isPending}
          className="flex items-center justify-center gap-2 w-auto px-8 h-11 bg-primary text-white hover:bg-primary-hover active:scale-95 disabled:opacity-50 disabled:active:scale-100 rounded-full font-bold transition-all duration-200"
        >
          {registerMutation.isPending ? (
            <><IconLoader2 size={18} stroke={2} className="animate-spin" /> Provisioning Infrastructure...</>
          ) : (
            <><IconShieldLock size={18} stroke={2} /> Create Workspace</>
          )}
        </button>
      </div>
    </div>
  )
}
