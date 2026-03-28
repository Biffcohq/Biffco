"use client"
import { useState, useEffect } from 'react'
import { useSignupStore } from '../../stores/useSignupStore'
import { trpc } from '../../../lib/trpc'
import { IconArrowLeft, IconKey, IconShieldLock, IconCopy, IconCheck, IconLoader2 } from '@tabler/icons-react'
// Crypto modules are dynamically imported on client side
import { useAuthStore } from '../../stores/useAuthStore'
import { useRouter } from 'next/navigation'

export function Step5Mnemonic() {
  const store = useSignupStore()
  const setSession = useAuthStore(s => s.setSession)
  const router = useRouter()
  
  const [mnemonic, setMnemonic] = useState('')
  const [copied, setCopied] = useState(false)
  const [hasBackedUp, setHasBackedUp] = useState(false)
  const [isGenerating, setIsGenerating] = useState(true)
  const [keys, setKeys] = useState<{ publicKey: string, privateKey: string } | null>(null)
  
  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: (data: any) => {
      // Guardar sesión tras el registro
      setSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        workspaceId: data.workspaceId,
        memberId: data.memberId,
        personName: store.adminName,
      })
      alert(`¡Workspace Creado! Bienvenido.\nTu Member ID es: ${data.memberId}`)
      router.push('/')
    },
    onError: (error: any) => {
      alert("Error en el registro: " + error.message)
    }
  })

  // Generate Mnemonic and Keys on Mount
  useEffect(() => {
    let mounted = true
    const initCrypto = async () => {
      const bip39Module = await import('bip39')
      const edKeyModule = await import('ed25519-hd-key')
      const sodiumModule = await import('libsodium-wrappers')
      await sodiumModule.default.ready
      const sodium = sodiumModule.default
      
      // 1. Generate 12 words
      const words = bip39Module.generateMnemonic()
      
      // 2. Derive Seed
      const seed = bip39Module.mnemonicToSeedSync(words)
      
      // 3. Derive HD Path Private Seed (Solana/Biffco standard path)
      const path = "m/44'/501'/0'/0'"
      const derivedSeed = edKeyModule.derivePath(path, seed.toString('hex')).key
      
      // 4. Get Ed25519 Keypair via libsodium
      const keypair = sodium.crypto_sign_seed_keypair(derivedSeed)
      const pubKeyHex = sodium.to_hex(keypair.publicKey)
      const privKeyHex = sodium.to_hex(keypair.privateKey)
      
      if (mounted) {
        setMnemonic(words)
        setKeys({ publicKey: pubKeyHex, privateKey: privKeyHex })
        setIsGenerating(false)
      }
    }
    
    initCrypto()
    return () => { mounted = false }
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mnemonic)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const onSubmit = () => {
    if (!keys || !hasBackedUp) return
    
    // Complete Registration (Task-028)
    registerMutation.mutate({
      workspaceName: store.workspaceName,
      workspaceSlug: store.workspaceSlug,
      country: store.country,
      verticalId: store.verticalId,
      initialRoles: store.initialRoles,
      personName: store.adminName,
      email: store.adminEmail,
      passwordHash: store.passwordHash,
      publicKey: keys.publicKey,
      wsIdx: 0 // Default for root member
    })
  }

  if (isGenerating) {
    return (
      <div className="flex flex-col h-full items-center justify-center animate-in fade-in duration-300">
        <IconLoader2 size={40} className="animate-spin text-primary mb-4" />
        <h3 className="text-xl font-bold text-navy">Generando Arquitectura Zero-Knowledge...</h3>
        <p className="text-sm text-text-secondary mt-2">Derivando llaves Ed25519 de forma local.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-navy mb-1">
          <IconKey size={28} stroke={1.5} className="text-primary" /> 
          Frase de Recuperación
        </h2>
        <p className="text-text-secondary text-sm">
          BIFFCO no guarda tu Llave Privada. Con estas 12 palabras firmas operaciones on-chain y recuperas tu cuenta.
        </p>
      </div>

      <div className="flex-1 flex flex-col pt-2 mb-2 pr-2">
        <div className="bg-error-subtle border border-error/20 rounded-md p-4 mb-6 flex items-start gap-4 shadow-sm">
          <div className="shrink-0 p-2 bg-error text-white rounded-md mt-0.5">
            <IconShieldLock size={20} stroke={1.5} />
          </div>
          <div>
            <h4 className="text-error font-bold text-sm mb-1 leading-tight">No compartas esta frase con nadie</h4>
            <p className="text-error/90 text-xs leading-relaxed">
              Quien posea estas palabras tendrá control total sobre tu Identidad Digital y firmará en nombre de <strong>{store.workspaceName}</strong>. Guardálas en un lugar seguro (offline preferentemente).
            </p>
          </div>
        </div>

        <div className="bg-surface-raised border border-border rounded-lg p-5 relative group">
          <div className="grid grid-cols-3 gap-y-4 gap-x-2">
            {mnemonic.split(' ').map((word, idx) => (
              <div key={idx} className="flex items-center gap-2 text-[15px]">
                <span className="text-text-muted text-xs font-mono w-4 shrink-0 text-right select-none">{idx + 1}.</span>
                <span className="font-semibold text-navy tracking-wide select-all">{word}</span>
              </div>
            ))}
          </div>

          <div className="absolute top-2 right-2">
            <button 
              type="button"
              onClick={copyToClipboard}
              className="p-2 text-text-secondary hover:bg-surface hover:text-navy rounded-md transition-colors"
              title="Copiar al portapapeles"
            >
              {copied ? <IconCheck size={18} className="text-success" /> : <IconCopy size={18} />}
            </button>
          </div>
        </div>
        
        <div className="mt-8 bg-surface border border-border rounded-lg p-4 cursor-pointer hover:bg-surface-raised transition-colors" onClick={() => setHasBackedUp(!hasBackedUp)}>
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 w-5 h-5 rounded border flex justify-center items-center shrink-0 transition-colors ${hasBackedUp ? 'bg-primary border-primary text-white' : 'border-border text-transparent'}`}>
              <IconCheck size={14} stroke={3} />
            </div>
            <p className="text-sm font-medium text-text-primary select-none">
              Confirmo que he copiado las 12 palabras y entiendo que si las pierdo, pierdo mi identidad por siempre.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-auto pt-4 border-t border-border">
        <button 
          onClick={store.prevStep}
          disabled={registerMutation.isPending}
          className="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 active:scale-95 bg-surface text-text-primary border border-border hover:bg-surface-raised h-10 px-4 text-sm disabled:opacity-50"
        >
          <IconArrowLeft size={16} stroke={2} /> Atrás
        </button>

        <button 
          onClick={onSubmit}
          disabled={!hasBackedUp || registerMutation.isPending}
          className="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 active:scale-95 h-10 px-6 text-sm bg-primary hover:bg-primary-hover text-white disabled:bg-surface-raised disabled:text-text-muted disabled:border disabled:border-border disabled:cursor-not-allowed disabled:shadow-none shadow-sm shadow-primary/30"
        >
          {registerMutation.isPending ? (
            <><IconLoader2 size={16} stroke={2} className="animate-spin" /> Registrando Workspace...</>
          ) : (
            <><IconShieldLock size={16} stroke={2} /> Terminar y Crear Espacio</>
          )}
        </button>
      </div>
    </div>
  )
}
