'use client'

import { useState, useEffect } from 'react'
import { generateMnemonic, deriveKeyFromMnemonic, signEvent } from '@biffco/core/crypto'

export function useBiffcoKMS() {
  const [isReady, setIsReady] = useState(false)
  const [keys, setKeys] = useState<{ publicKeyHex: string; privateKey: Uint8Array } | null>(null)

  useEffect(() => {
    // Inicializar KMS local
    const initKms = async () => {
      let mnemonic = localStorage.getItem('biffco_kms_mnemonic')
      if (!mnemonic) {
        mnemonic = generateMnemonic()
        localStorage.setItem('biffco_kms_mnemonic', mnemonic)
      }

      // En fase demo usamos workspace 0, user 0. A futuro extraemos del Context.
      const { privateKey, publicKey } = deriveKeyFromMnemonic(mnemonic, 0, 0)
      
      // Convertir publicKey a Hex
      const crypto = await import('@biffco/core/crypto') // Asegurar imports si hay libsodium errors de sync
      // Actually publicKey is Uint8Array, we can convert it to hex manually or using libsodium
      const pubHex = Array.from(publicKey).map(b => b.toString(16).padStart(2, '0')).join('')
      
      setKeys({
        privateKey,
        publicKeyHex: pubHex
      })
      setIsReady(true)
    }

    initKms().catch(console.error)
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const signPayload = async (payload: any) => {
    if (!keys) throw new Error("KMS no está listo")
    const signatureHex = await signEvent(payload, keys.privateKey)
    return {
      signature: signatureHex,
      publicKey: keys.publicKeyHex
    }
  }

  return { isReady, signPayload, publicKey: keys?.publicKeyHex }
}
