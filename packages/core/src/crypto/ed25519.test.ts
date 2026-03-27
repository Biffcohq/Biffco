import { describe, it, expect } from 'vitest'
import { signEvent, verifyEvent } from './ed25519'
import type { SignableEventPayload } from '../domain/event'
import _sodium from 'libsodium-wrappers'

// Vector de prueba básico
const testPayload: SignableEventPayload = {
  type: "ANIMAL_REGISTERED",
  schemaVersion: 1,
  assetId: "test-asset-001",
  workspaceId: "test-workspace-001",
  actorId: "test-actor-001",
  occurredAt: "2024-01-15T10:00:00.000Z",
  payload: { breed: "angus", sex: "male" }
}

describe("Ed25519 — signEvent + verifyEvent", () => {
  it("firma y verifica correctamente", async () => {
    await _sodium.ready
    const keypair = _sodium.crypto_sign_keypair()
    const sig = await signEvent(testPayload, keypair.privateKey)
    const valid = await verifyEvent(testPayload, sig, _sodium.to_hex(keypair.publicKey))
    expect(valid).toBe(true)
  })

  it("falla con payload modificado", async () => {
    await _sodium.ready
    const keypair = _sodium.crypto_sign_keypair()
    const sig = await signEvent(testPayload, keypair.privateKey)
    const modified = { ...testPayload, type: "MODIFIED_TYPE" }
    const valid = await verifyEvent(modified, sig, _sodium.to_hex(keypair.publicKey))
    expect(valid).toBe(false)
  })

  it("falla con clave pública incorrecta", async () => {
    await _sodium.ready
    const keypairA = _sodium.crypto_sign_keypair()
    const keypairB = _sodium.crypto_sign_keypair()
    const sig = await signEvent(testPayload, keypairA.privateKey)
    const valid = await verifyEvent(testPayload, sig, _sodium.to_hex(keypairB.publicKey))
    expect(valid).toBe(false)
  })

  it("canonicalJson garantiza firma determinista", async () => {
    await _sodium.ready
    const keypair = _sodium.crypto_sign_keypair()
    // Mismo payload, keys en distinto orden
    const payloadA = { ...testPayload, payload: { sex: "male", breed: "angus" } }
    const payloadB = { ...testPayload, payload: { breed: "angus", sex: "male" } }
    const sigA = await signEvent(payloadA, keypair.privateKey)
    const sigB = await signEvent(payloadB, keypair.privateKey)
    expect(sigA).toBe(sigB)
  })
})
