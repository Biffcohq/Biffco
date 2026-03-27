import { generateMnemonic as _generateMnemonic, validateMnemonic, mnemonicToSeedSync } from 'bip39'
import type { Buffer } from 'buffer'

/**
 * Genera un mnemonic BIP-39 de 24 palabras.
 *
 * SEGURIDAD: Esta función SOLO se llama en el browser durante el signup.
 * NUNCA se llama en apps/api ni en ningún servidor.
 * NUNCA se almacena el mnemonic en la DB ni en ningún log.
 *
 * El mnemonic se muestra UNA SOLA VEZ al usuario.
 * Después de que el usuario confirma las 3 palabras, el mnemonic
 * se elimina de la memoria del browser.
 */
export function generateMnemonic(): string {
  // 256 bits de entropía = 24 palabras
  return _generateMnemonic(256)
}

/**
 * Valida que un mnemonic tiene el formato correcto.
 */
export function isValidMnemonic(mnemonic: string): boolean {
  return validateMnemonic(mnemonic)
}

/**
 * Convierte un mnemonic a seed para SLIP-0010.
 * Usado internamente por deriveKeyFromMnemonic en slip0010.ts.
 */
export function mnemonicToSeed(mnemonic: string): Buffer {
  return mnemonicToSeedSync(mnemonic)
}
