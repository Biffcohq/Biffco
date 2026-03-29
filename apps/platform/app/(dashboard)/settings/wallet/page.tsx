"use client"

import { IconWallet, IconKey, IconEye, IconEyeOff, IconDownload, IconUpload } from '@tabler/icons-react'
import { Card, Button, Input, toast, Label } from '@biffco/ui'
import { useState, useEffect } from 'react'

export default function WalletSettingsPage() {
  const [publicKey, setPublicKey] = useState<string>("Cargando...")
  const [mnemonic, setMnemonic] = useState<string>("cargando...")
  const [showMnemonic, setShowMnemonic] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importValue, setImportValue] = useState("")

  useEffect(() => {
    // Simulamos la carga desde el almacenamiento seguro (IndexedDB/localStorage)
    // En Fase B esto se lee de biffco-auth-storage o similar
    try {
      const storageStr = localStorage.getItem('biffco-auth-storage')
      if (storageStr) {
        const parsed = JSON.parse(storageStr)
        setPublicKey(parsed?.state?.wallet?.publicKey || "0xed25519... (No configurada)")
        setMnemonic("abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about")
      } else {
        setPublicKey("No se detectó billetera activa")
      }
    } catch (e) {
      setPublicKey("Error al leer billetera")
    }
  }, [])

  const handleCopy = (text: string, type: 'Clave pública' | 'Mnemonic') => {
    navigator.clipboard.writeText(text)
    toast.success(`${type} copiada al portapapeles`)
  }

  const handleImport = () => {
    if (importValue.split(" ").length !== 12 && importValue.split(" ").length !== 24) {
      toast.error("El Mnemonic debe tener 12 o 24 palabras")
      return
    }
    // Lógica de importación real iría aquí
    toast.success("Billetera importada exitosamente")
    setIsImporting(false)
    setImportValue("")
    setPublicKey("0xed25519..." + Math.random().toString(16).slice(2, 10))
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 max-w-4xl">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <IconWallet size={24} className="text-primary" />
            Billetera Criptográfica (Wallet)
          </h1>
          <p className="text-text-secondary text-sm text-balance">
            Gestiona tu material criptográfico Ed25519. Esta llave se usa para firmar digitalmente eventos y transferencias en el sistema WORM.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Public Key Card */}
        <Card className="p-6 bg-surface border-border flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-text-primary font-semibold">
              <IconKey size={20} className="text-primary" />
              Clave Pública Activa
            </div>
            <div className="px-3 py-1 bg-success/10 text-success border border-success/20 rounded-full text-xs font-medium">
              Conectada
            </div>
          </div>
          <div className="bg-bg border border-border rounded-lg p-4 flex items-center justify-between gap-4">
            <code className="text-sm font-mono text-text-secondary truncate w-full">
              {publicKey}
            </code>
            <Button variant="outline" size="sm" onClick={() => handleCopy(publicKey, 'Clave pública')} className="shrink-0 text-text-primary">
              Copiar
            </Button>
          </div>
          <p className="text-sm text-text-muted">
            Esta es tu identidad pública verificable en BIFFCO. Compártela libremente para recibir activos (Assets) o permitir que otros verifiquen tus firmas.
          </p>
        </Card>

        {/* Private Mnemonic Card */}
        <Card className="p-6 border-warning/30 bg-warning/5 flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-warning/10 rounded-bl-full -mr-10 -mt-10 pointer-events-none" />
          
          <div className="flex flex-col gap-1 relative z-10">
            <h3 className="text-lg font-bold text-warning flex items-center gap-2">
              Frase de Recuperación (Mnemonic)
            </h3>
            <p className="text-sm text-text-secondary">
              Tu frase semilla de 12 palabras. Es el <strong>único</strong> respaldo de tu identidad operativa. BIFFCO no almacena esta frase en sus servidores.
            </p>
          </div>

          {!isImporting ? (
             <div className="flex flex-col gap-4 mt-2">
                <div className="relative">
                  <div className={`p-4 rounded-lg border font-mono text-sm leading-relaxed transition-all ${showMnemonic ? 'bg-bg border-warning/50 text-text-primary' : 'bg-surface border-border text-transparent select-none blur-sm'}`}>
                    {mnemonic}
                  </div>
                  
                  {!showMnemonic && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button variant="outline" className="bg-surface/80 backdrop-blur-md" onClick={() => setShowMnemonic(true)}>
                        <IconEye size={16} className="mr-2" />
                        Revelar Frase Semilla
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {showMnemonic && (
                    <>
                      <Button variant="outline" onClick={() => setShowMnemonic(false)}>
                        <IconEyeOff size={16} className="mr-2" />
                        Ocultar
                      </Button>
                      <Button variant="outline" onClick={() => handleCopy(mnemonic, 'Mnemonic')}>
                        Copiar Frase
                      </Button>
                    </>
                  )}
                  <div className="flex-1" />
                  <Button variant="secondary" onClick={() => setIsImporting(true)} className="bg-surface-raised hover:bg-surface text-text-primary">
                    <IconUpload size={16} className="mr-2 text-primary" />
                    Importar Billetera Existente
                  </Button>
                </div>
             </div>
          ) : (
             <div className="flex flex-col gap-4 mt-2 bg-bg p-4 rounded-lg border border-border">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="mnemonic-input" className="text-text-primary">Ingresa tu Mnemonic (12 o 24 palabras)</Label>
                  <Input 
                    id="mnemonic-input"
                    value={importValue}
                    onChange={(e) => setImportValue(e.target.value)}
                    placeholder="palabra1 palabra2 palabra3..." 
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-text-muted mt-1">
                    Esto reemplazará la billetera actual en este navegador. Asegúrate de tener respaldo de la actual.
                  </p>
                </div>
                <div className="flex justify-end gap-3 mt-2">
                  <Button variant="ghost" onClick={() => { setIsImporting(false); setImportValue(""); }} className="text-text-secondary">
                    Cancelar
                  </Button>
                  <Button onClick={handleImport} className="bg-warning hover:bg-warning/90 text-white">
                    Confirmar Importación
                  </Button>
                </div>
             </div>
          )}
        </Card>
      </div>
    </div>
  )
}
