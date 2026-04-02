"use client"

import { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { IconShieldCheck, IconKey, IconLoader2, IconEye, IconAlertTriangle } from '@tabler/icons-react'
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Input, toast } from '@biffco/ui'

export default function WalletSettingsPage() {
  const { data: userProfile, isLoading } = trpc.auth.me.useQuery()
  const publicKey = userProfile?.publicKey

  const [isRevealOpen, setIsRevealOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [isRevealed, setIsRevealed] = useState(false)
  const [isDecrypting, setIsDecrypting] = useState(false)

  // Esta función es un mockup. En el mundo real, aquí se abriría un input seguro,
  // y en caso de semi-custodial se desencriptaría el blob con el password.
  const handleReveal = () => {
    if (!password) {
      toast.error('Por favor ingresa tu contraseña')
      return
    }
    setIsDecrypting(true)
    setTimeout(() => {
      setIsDecrypting(false)
      if (password === 'admin123') { // Mockup check
        setIsRevealed(true)
        toast.success('Bóveda desencriptada')
      } else {
        toast.error('Contraseña incorrecta')
      }
    }, 1200)
  }

  const handleCloseReveal = () => {
    setIsRevealOpen(false)
    setIsRevealed(false)
    setPassword('')
  }

  return (
    <div className="w-full flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-text-primary">Billetera Criptográfica</h1>
        <p className="text-text-secondary text-base">
          Gestiona la clave privada de tu cuenta, vital para firmar transacciones en la red EUDR y emitir trazabilidad inmutable.
        </p>
      </div>

      {/* Network Anchor Card */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-sm flex flex-col items-start gap-4">
        <div className="flex flex-col gap-1 w-full">
          <h2 className="text-lg font-bold text-text-primary">Estado de tu Billetera (Network Anchor)</h2>
          <p className="text-text-secondary text-sm">
            Esta cuenta posee una billetera no-custodial integrada. Aquí verás su estado y salud operativa.
          </p>
        </div>

        <div className="w-full bg-surface-raised border border-border rounded-lg p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-success/10 text-success rounded-full flex items-center justify-center border border-success/20">
              <IconShieldCheck size={24} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-text-primary">Billetera Segura</span>
                <span className="bg-success text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Operativa</span>
              </div>
              <div className="text-text-secondary font-mono text-sm mt-0.5 max-w-[200px] sm:max-w-xs truncate">
                {isLoading ? 'Cargando llave pública...' : publicKey || 'Sin llave vinculada'}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end text-sm">
             <span className="text-text-muted">Conectado a:</span>
             <span className="font-semibold text-text-primary flex items-center gap-1.5">
               <span className="size-3 rounded-full bg-blue border-2 border-surface shadow-[0_0_0_1px_#3A86FF] box-content"></span>
               Biffco Subnet (L2)
             </span>
          </div>
        </div>
      </div>

      {/* Key Rotation Card */}
      <div className="bg-surface border border-border rounded-xl shadow-sm flex flex-col items-start overflow-hidden">
        <div className="p-6 flex flex-col gap-1 w-full">
           <h2 className="text-lg font-bold text-text-primary">Rotación de Claves (Key Rotation)</h2>
           <p className="text-text-secondary text-sm">
             Si crees que tu clave privada ha sido comprometida en el ambiente local, re-genera una nueva bóveda.
           </p>

           <div className="mt-4 bg-error-subtle border border-error/20 p-4 rounded-lg flex items-start gap-3">
              <IconKey size={20} className="text-error shrink-0 mt-0.5" />
              <p className="text-error text-sm font-medium leading-relaxed">
                Regenerar una clave anula toda firma criptográfica delegada a partir del momento actual. Todos los certificados pendientes fallarán y deberás volver a emitirlos con tu nueva bóveda.
              </p>
           </div>
        </div>
        <div className="bg-surface-raised border-t border-border px-6 py-4 w-full flex items-center justify-between">
           <span className="text-xs text-text-muted">
              Atención: Esta es una operación de alto riesgo. Perderás asociación previa si no tienes backup.
           </span>
           <div className="flex gap-3">
             <Button 
                variant="outline" 
                onClick={() => setIsRevealOpen(true)}
             >
                <IconEye size={16} /> Revelar Clave Actual
             </Button>
           </div>
        </div>
      </div>

      {/* REVEAL MODAL */}
      <Dialog open={isRevealOpen} onOpenChange={setIsRevealOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Revelar Clave Privada</DialogTitle>
            <DialogDescription>
              Para acceder al material criptográfico en texto plano, es necesario desencriptar tu sesión local accediendo a la bóveda en memoria.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 py-4">
             {!isRevealed ? (
                <>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-text-primary">Ingresa tu contraseña de bóveda</label>
                    <Input 
                      type="password" 
                      placeholder="Contraseña (Tip: admin123)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isDecrypting}
                    />
                  </div>
                  <div className="bg-surface-raised p-3 rounded border border-border flex items-start gap-2">
                    <IconAlertTriangle size={18} className="text-warning shrink-0 mt-0.5" />
                    <p className="text-xs text-text-secondary leading-tight">
                       Nunca revelaremos tu clave sobre una red insegura. La desencriptación ocurre 100% de lado del cliente en este dispositivo.
                    </p>
                  </div>
                </>
             ) : (
                <div className="flex flex-col gap-4 animate-in fade-in zoom-in-95">
                   <div className="bg-error-subtle p-3 rounded border border-error/30">
                     <p className="text-error text-sm font-bold text-center">COMPROMISO CRÍTICO</p>
                     <p className="text-error/80 text-xs text-center mt-1">Cualquiera con esta frase puede firmar por ti.</p>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-2 text-center select-all">
                     <div className="bg-surface rounded border border-border py-2 text-sm font-mono font-bold text-navy">cargo</div>
                     <div className="bg-surface rounded border border-border py-2 text-sm font-mono font-bold text-navy">zebra</div>
                     <div className="bg-surface rounded border border-border py-2 text-sm font-mono font-bold text-navy">planet</div>
                     <div className="bg-surface rounded border border-border py-2 text-sm font-mono font-bold text-navy">derive</div>
                     <div className="col-span-2 text-xs text-text-muted flex justify-center py-2">(Frase mnemónica de prueba visual)</div>
                   </div>
                </div>
             )}
          </div>

          <DialogFooter className="sm:justify-end gap-2">
            {!isRevealed ? (
              <>
                <Button variant="ghost" onClick={handleCloseReveal} disabled={isDecrypting}>Cancelar</Button>
                <Button onClick={handleReveal} disabled={isDecrypting}>
                  {isDecrypting ? <><IconLoader2 className="animate-spin" size={16} /> Desencriptando...</> : 'Autorizar & Mostrar'}
                </Button>
              </>
            ) : (
              <Button onClick={handleCloseReveal} className="w-full">Entendido, cerrar ahora.</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
