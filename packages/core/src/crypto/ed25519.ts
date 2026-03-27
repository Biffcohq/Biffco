/* global TextEncoder */
import _sodium from 'libsodium-wrappers'
import { canonicalJson } from '@biffco/shared'
import type { SignableEventPayload } from '../domain/event'

let _ready = false
async function ensureReady(): Promise<void> {
  if (_ready) return
  await _sodium.ready
  _ready = true
}

/**
 * Firma el payload de un evento con una clave privada Ed25519.
 *
 * Lo que se firma: canonicalJson(payload) — siempre el mismo string
 * para el mismo payload, independientemente del orden de las keys.
 *
 * @returns signature en formato hex
 */
export async function signEvent(
  payload: SignableEventPayload,
  privateKey: Uint8Array,
): Promise<string> {
  await ensureReady()
  const message = new TextEncoder().encode(canonicalJson(payload))
  const signature = _sodium.crypto_sign_detached(message, privateKey)
  return _sodium.to_hex(signature)
}

/**
 * Verifica la firma Ed25519 de un evento.
 *
 * @returns true si la firma es válida, false en cualquier otro caso
 * NUNCA lanza una excepción — siempre retorna un boolean.
 */
export async function verifyEvent(
  payload: SignableEventPayload,
  signatureHex: string,
  publicKeyHex: string,
): Promise<boolean> {
  await ensureReady()
  try {
    const message = new TextEncoder().encode(canonicalJson(payload))
    const signature = _sodium.from_hex(signatureHex)
    const publicKey = _sodium.from_hex(publicKeyHex)
    return _sodium.crypto_sign_verify_detached(signature, message, publicKey)
  } catch {
    // Firma o clave malformada — tratar como inválida
    return false
  }
}
