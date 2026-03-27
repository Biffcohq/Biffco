import { derivePath } from 'ed25519-hd-key'
import { mnemonicToSeedSync } from 'bip39'

export function buildDerivationPath(wsIdx: number, memberIdx: number): string {
  return `m/0'/${wsIdx}'/${memberIdx}'`
}

export function deriveKeyFromMnemonic(
  mnemonic: string,
  wsIdx: number,
  memberIdx: number,
): { privateKey: Uint8Array; publicKey: Uint8Array } {
  const seed = mnemonicToSeedSync(mnemonic)
  const path = buildDerivationPath(wsIdx, memberIdx)
  
  // Derivar la clave privada
  const { key: privateKeyBuffer } = derivePath(path, seed.toString("hex"))
  
  // Extraer la respectiva public key
  const { getPublicKey } = require('ed25519-hd-key')
  const publicKeyBuffer = getPublicKey(privateKeyBuffer)
  
  return {
    privateKey: new Uint8Array(privateKeyBuffer),
    publicKey: new Uint8Array(publicKeyBuffer),
  }
}

export function deriveKeyFromSeed(
  seed: Buffer,
  wsIdx: number,
  memberIdx: number,
): { privateKey: Uint8Array; publicKey: Uint8Array; publicKeyHex: string } {
  const path = buildDerivationPath(wsIdx, memberIdx)
  const { key: privateKeyBuffer } = derivePath(path, seed.toString("hex"))
  
  const { getPublicKey } = require('ed25519-hd-key')
  const publicKeyBuffer = getPublicKey(privateKeyBuffer)
  
  return {
    privateKey: new Uint8Array(privateKeyBuffer),
    publicKey: new Uint8Array(publicKeyBuffer),
    publicKeyHex: publicKeyBuffer.toString("hex"),
  }
}
