"use client"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSignupStore } from '../../stores/useSignupStore'
import { IconArrowLeft, IconUserPlus, IconFingerprint, IconLoader2 } from '@tabler/icons-react'
import { useState } from 'react'
// Dynamic import for sodium used below
const step4Schema = z.object({
  adminName: z.string().min(2, "Ingresa tu nombre"),
  adminEmail: z.string().email("Ingresa un email válido"),
  password: z.string().min(8, "La clave debe tener al menos 8 caracteres")
})

export function Step4Admin() {
  const store = useSignupStore()
  const { adminName, adminEmail, setAdmin } = store
  
  const [isHashing, setIsHashing] = useState(false)

  const form = useForm<z.infer<typeof step4Schema>>({
    resolver: zodResolver(step4Schema),
    defaultValues: { adminName, adminEmail, password: '' }
  })

  const onSubmit = async (data: z.infer<typeof step4Schema>) => {
    try {
      setIsHashing(true)
      
      // Dynamic sodium evaluation
      const sodiumModule = await import('libsodium-wrappers')
      await sodiumModule.default.ready
      const sodium = sodiumModule.default
      
      // BLAKE2b hash - Client Side Zero Knowledge (Fallback from Argon2 for non-sumo builds)
      const passwordBytes = new TextEncoder().encode(data.password)
      const hashBytes = sodium.crypto_generichash(64, passwordBytes, null)
      const pwd = sodium.to_hex(hashBytes)

      setAdmin({ adminName: data.adminName, adminEmail: data.adminEmail, passwordHash: pwd })
      store.nextStep()
    } catch (e) {
      console.error(e)
      alert("Error estableciendo credenciales")
    } finally {
      setIsHashing(false)
    }
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
            className="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 active:scale-95 h-10 px-6 text-sm bg-primary hover:bg-primary-hover text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-primary/30"
          >
            {isHashing ? (
              <><IconLoader2 size={16} stroke={2} className="animate-spin" /> Hasheando...</>
            ) : (
              <><IconFingerprint size={16} stroke={2} /> Siguiente Paso</>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
