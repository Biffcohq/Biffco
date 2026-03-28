import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSignupStore } from '../../stores/useSignupStore'
import { IconArrowLeft, IconUserPlus, IconFingerprint, IconLoader2 } from '@tabler/icons-react'
import { useState } from 'react'
import _sodium from 'libsodium-wrappers'

const step4Schema = z.object({
  adminName: z.string().min(2, "Ingresa tu nombre"),
  adminEmail: z.string().email("Ingresa un email válido"),
  password: z.string().min(8, "La clave debe tener al menos 8 caracteres")
})

export function Step4Admin() {
  const store = useSignupStore()
  const { adminName, adminEmail, setAdmin } = store
  
  const [isHashing, setIsHashing] = useState(false)
  const [success, setSuccess] = useState(false)

  const form = useForm<z.infer<typeof step4Schema>>({
    resolver: zodResolver(step4Schema),
    defaultValues: { adminName, adminEmail, password: '' }
  })

  const onSubmit = async (data: z.infer<typeof step4Schema>) => {
    try {
      setIsHashing(true)
      
      await _sodium.ready
      const sodium = _sodium
      
      // Argon2id hash - Client Side Zero Knowledge 
      // biffco API doesn't know the plain password
      const passwordHashResult = sodium.crypto_pwhash_str(
        data.password, 
        sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE, 
        sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE
      )
      
      const pwd = typeof passwordHashResult === 'string' 
                  ? passwordHashResult 
                  : new TextDecoder().decode(passwordHashResult)

      setAdmin({ adminName: data.adminName, adminEmail: data.adminEmail })
      console.log('--- WIZARD COMPLETED ---')
      console.log('Payload Ready for API (Task-028):', {
        workspaceName: store.workspaceName,
        slug: store.workspaceSlug,
        country: store.country,
        verticalId: store.verticalId,
        roles: store.initialRoles,
        adminName: data.adminName,
        adminEmail: data.adminEmail,
        passwordHash: pwd
      })
      setSuccess(true)
      
      // Simulate API call for now since we are in Sprint A.2 Task-027
      setTimeout(() => alert("El password hash generado es:\n" + pwd.substring(0, 30) + "..."), 500)
    } catch (e) {
      console.error(e)
      alert("Error en criptografía cliente")
    } finally {
      setIsHashing(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col h-full items-center justify-center animate-in fade-in zoom-in duration-300 text-center">
        <div className="w-16 h-16 bg-success-subtle text-success rounded-full flex items-center justify-center mb-6">
          <IconFingerprint size={32} stroke={1.5} />
        </div>
        <h2 className="text-2xl font-bold text-navy mb-2">¡Identidad Criptográfica Generada!</h2>
        <p className="text-text-secondary text-sm mb-6 max-w-sm">
          Tu Workspace ha concluido la fase de recolección de datos local.
          Se ha impreso en la consola el Payload con el Hash Argon2id.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 active:scale-95 h-10 px-4 text-sm bg-primary hover:bg-primary-hover text-white"
        >
          Volver a Landing
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-navy mb-1">
          <IconUserPlus size={28} stroke={1.5} className="text-primary" /> 
          Perfil de Administrador
        </h2>
        <p className="text-text-secondary text-sm">
          Este perfil tendrá permisos Root para gestionar <strong>{store.workspaceName}</strong>. 
          Su clave no viajará en texto plano (Zero-Knowledge).
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 flex-1 flex flex-col justify-between overflow-y-auto mb-2 pr-2">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-text-primary">Nombre Completo</label>
            <input 
              {...form.register("adminName")}
              className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-text-primary"
              placeholder="Ej: Laura Méndez"
            />
            {form.formState.errors.adminName && <span className="text-xs text-error mt-1 block">{form.formState.errors.adminName.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-text-primary">Correo Electrónico Corporativo</label>
            <input 
              type="email"
              {...form.register("adminEmail")}
              className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-text-primary"
              placeholder="laura@empresa.com"
            />
            {form.formState.errors.adminEmail && <span className="text-xs text-error mt-1 block">{form.formState.errors.adminEmail.message}</span>}
          </div>

          <div className="bg-warning-subtle border border-warning/30 rounded-md p-4">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-warning-subtle text-warning border border-warning/20 rounded-md shrink-0">
                <IconFingerprint size={20} stroke={2} />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-warning mb-2">Master Password</label>
                <input 
                  type="password"
                  {...form.register("password")}
                  className="h-10 w-full rounded-md border border-warning/40 bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-warning/30 focus:border-warning font-mono"
                  placeholder="Mínimo 8 caracteres"
                />
                <p className="text-xs text-warning/80 mt-2">
                  Hashearemos esta clave en tu navegador (<strong>Argon2id</strong>) ANTES de enviarla a BIFFCO. Jamás veremos tu texto puro.
                </p>
                {form.formState.errors.password && <span className="text-xs text-error mt-1 block">{form.formState.errors.password.message}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-auto pt-4 border-t border-border">
          <button 
            type="button"
            onClick={store.prevStep}
            className="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 active:scale-95 bg-surface text-text-primary border border-border hover:bg-surface-raised h-10 px-4 text-sm"
          >
            <IconArrowLeft size={16} stroke={2} /> Atrás
          </button>

          <button 
            type="submit" 
            disabled={isHashing}
            className="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 active:scale-95 h-10 px-4 text-sm bg-success hover:bg-success/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isHashing ? (
              <><IconLoader2 size={16} stroke={2} className="animate-spin" /> Hasheando...</>
            ) : (
              <><IconFingerprint size={16} stroke={2} /> Finalizar Registro</>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
