/* global navigator */
"use client"

import { trpc } from '@/lib/trpc'
import { IconShieldCheck, IconKey, IconAlertTriangle, IconCopy } from '@tabler/icons-react'
import { Button, toast } from '@biffco/ui'

export default function GlobalWalletPage() {
  const { data: userProfile, isLoading } = trpc.auth.me.useQuery()
  const publicKey = userProfile?.publicKey

  const handleRotate = () => {
    toast.info('La función de rotación de claves estará disponible en el próximo release. Requerirá tu frase semilla original enviada fuera de línea.')
  }

  return (
    <div className="w-full flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-text-primary">Billetera Global (Identidad Root)</h1>
        <p className="text-text-secondary text-base">
          Esta es tu identidad principal criptográfica. A partir de la Frase Semilla de esta cuenta se derivan todas tus sub-firmas para operar en las distintas Cadenas y Workspaces protegidos de Biffco.
        </p>
      </div>

      {/* Network Anchor Card */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-sm flex flex-col items-start gap-4">
        <div className="flex flex-col gap-1 w-full">
          <h2 className="text-lg font-bold text-text-primary">Estado de la Billetera (Network Anchor)</h2>
          <p className="text-text-secondary text-sm">
            La frase semilla original que obtuviste durante el Onboarding se requiere para firmar las operaciones o recuperar acceso. **Biffco no almacena tu frase semilla.**
          </p>
        </div>

        <div className="w-full bg-surface-raised border border-border rounded-lg p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-success/10 text-success rounded-full flex items-center justify-center border border-success/20 shrink-0">
              <IconShieldCheck size={24} />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-text-primary">Clave Pública Principal</span>
                <span className="bg-success text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">Vinculada</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="text-text-secondary font-mono text-sm break-all font-medium">
                  {isLoading ? 'Cargando llave...' : publicKey || 'Sin llave vinculada'}
                </div>
                {publicKey && (
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(publicKey)
                      toast.success('Clave copiada al portapapeles')
                    }}
                    className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                    title="Copiar Clave Pública"
                  >
                    <IconCopy size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="hidden sm:flex flex-col items-end text-sm shrink-0">
             <span className="text-text-muted">Protocolo Base:</span>
             <span className="font-semibold text-text-primary flex items-center gap-1.5">
               <span className="size-3 rounded-full bg-blue border-2 border-surface shadow-[0_0_0_1px_#3A86FF] box-content"></span>
               Ed25519 (BIP32)
             </span>
          </div>
        </div>
      </div>

      {/* Key Rotation Card */}
      <div className="bg-surface border border-border rounded-xl shadow-sm flex flex-col items-start overflow-hidden">
        <div className="p-6 flex flex-col gap-1 w-full">
           <h2 className="text-lg font-bold text-text-primary">Rotación y Recuperación</h2>
           <p className="text-text-secondary text-sm">
             Si crees que tu frase semilla ha sido comprometida en tu almacenamiento personal (ej. perdiste el papel donde la anotaste), debes vincular una nueva identidad HD.
           </p>

           <div className="mt-4 bg-error-subtle border border-error/20 p-4 rounded-lg flex items-start gap-3">
              <IconAlertTriangle size={20} className="text-error shrink-0 mt-0.5" />
              <p className="text-error text-sm font-medium leading-relaxed">
                Regenerar o rotar tu Identidad Root anula tus firmas delegadas en todos los Workspaces. Las transacciones pasadas mantendrán su inmutabilidad ligada a esta bóveda, pero no podrás emitir nuevas hasta que el Admin re-autorice tu nueva Clave.
              </p>
           </div>
        </div>
        <div className="bg-surface-raised border-t border-border px-6 py-4 w-full flex items-center justify-between">
           <span className="text-xs text-text-muted">
              Esta operación requiere tu frase semilla actual u obligará a transferencias de Workspace masivas.
           </span>
           <div className="flex gap-3">
             <Button 
                variant="outline" 
                onClick={handleRotate}
             >
                <IconKey size={16} /> Rotar Identidad
             </Button>
           </div>
        </div>
      </div>

    </div>
  )
}
