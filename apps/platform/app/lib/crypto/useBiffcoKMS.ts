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
      const { privateKey } = deriveKeyFromMnemonic(mnemonic, 0, 0)
      
      // Asegurar sincronicidad estricta entre la clave de firmado (libsodium) y la clave devuelta.
      // hd-key a veces devuelve prefijos '00' de sign bit que rompen el crypto de Curve25519 original.
      const _sodium = (await import('libsodium-wrappers')).default
      await _sodium.ready
      
      const kp = _sodium.crypto_sign_seed_keypair(privateKey)
      const pubHex = _sodium.to_hex(kp.publicKey)
      
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
