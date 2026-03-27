import { describe, it, expect } from 'vitest'
import { deriveKeyFromMnemonic } from './crypto/slip0010'
import { signEvent, verifyEvent } from './crypto/ed25519'
import { PostgresEventStore, type EventStoreDb } from './event-store/postgres-event-store'
import type { DomainEvent, SignableEventPayload } from './domain/event'
import _sodium from 'libsodium-wrappers'

// Base de datos Mock para aislar la validación del core de la infraestructura
class MockDb implements EventStoreDb {
  events: DomainEvent[] = []
  
  async insertEvent(event: DomainEvent): Promise<void> {
    this.events.push(event)
  }
  
  async getEventsByAssetId(assetId: any, workspaceId: any): Promise<DomainEvent[]> {
    return this.events.filter(e => e.assetId === assetId && e.workspaceId === workspaceId)
  }
  
  async getAllEventsByWorkspace(workspaceId: any): Promise<DomainEvent[]> {
    return this.events.filter(e => e.workspaceId === workspaceId)
  }
  
  async getAssetById(assetId: any, _workspaceId: any): Promise<{ parentIds: any[] } | null> {
    // Simular un árbol para el test de linaje (ancestors)
    if (assetId === "asset-child") return { parentIds: ["asset-parent-1", "asset-parent-2"] }
    if (assetId === "asset-parent-1") return { parentIds: ["asset-grandparent-1"] }
    return { parentIds: [] }
  }
}

const TEST_MNEMONIC = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
const WORKSPACE_ID = "ws-test-001"
const ACTOR_ID = "actor-member-001"

describe("D09: Core Trust Layer Integration Flow", () => {
  it("Flujo Completo: deriveKey -> sign -> verify -> append -> replay -> lineage", async () => {
    // 1. Derivación de Clave (Criptografía)
    // El usuario (actor) ingresa su mnemonic en el browser. 
    // Derivamos sus claves Ed25519 con el método SLIP-0010.
    const wsIdx = 1
    const memberIdx = 0
    await _sodium.ready
    const keypair = deriveKeyFromMnemonic(TEST_MNEMONIC, wsIdx, memberIdx)
    
    const kp = _sodium.crypto_sign_seed_keypair(keypair.privateKey)
    const publicKeyHex = _sodium.to_hex(kp.publicKey)
    console.log("HD_KEY PUBKEY:", publicKeyHex)

    // 2. Generación del Evento (Dominio)
    // El actor decide registrar el nacimiento de un ternero.
    const assetId = "asset-child"
    const signableOrigin: SignableEventPayload = {
      type: "ANIMAL_REGISTERED",
      schemaVersion: 1,
      assetId: assetId,
      workspaceId: WORKSPACE_ID,
      actorId: ACTOR_ID,
      occurredAt: new Date("2024-03-27T10:00:00.000Z").toISOString(),
      payload: { breed: "angus", origin: "natural" }
    }

    // 3. Firma del Evento (Criptografía)
    // Se firma con Ed25519 bajo el canonicalJson del payload
    const signatureHex = await signEvent(signableOrigin, keypair.privateKey)
    expect(signatureHex).toBeTypeOf("string")
    expect(signatureHex.length).toBeGreaterThan(64)

    // Este es el DomainEvent concreto que se enviará al servidor
    const domainEvent: DomainEvent = {
        id: "evt-001" as any,
        type: signableOrigin.type,
        schemaVersion: signableOrigin.schemaVersion,
        assetId: signableOrigin.assetId as any,
        workspaceId: signableOrigin.workspaceId as any,
        actorId: signableOrigin.actorId as any,
        employeeId: null,
        occurredAt: new Date(signableOrigin.occurredAt),
        createdAt: new Date(),
        correlationId: null,
        payload: signableOrigin.payload,
        signature: signatureHex,
        publicKey: publicKeyHex
    }

    // 4. Recepción en el Servidor y Verificación (Event Store)
    const db = new MockDb()
    const hooks = {
        beforeOperation: async () => ({ ok: true, value: undefined } as any),
        afterOperation: async () => {}
    }
    const store = new PostgresEventStore(db, hooks)

    // El servidor recibe el domainEvent y lo intenta append. 
    // Internalmente llamará a verifyEvent.
    const appendResult = await store.append(domainEvent)
    if (!appendResult.ok) console.log("APPEND ERROR:", appendResult)
    expect(appendResult.ok).toBe(true)

    // 5. Verificamos explícitamente que la función crypto funcionó
    const isValid = await verifyEvent(signableOrigin, signatureHex, publicKeyHex)
    expect(isValid).toBe(true)

    // Si hubiese firmado otro workspace/actor o payload mutado
    const mutatedSignable = { ...signableOrigin, payload: { breed: "hereford" } }
    const isMutatedValid = await verifyEvent(mutatedSignable, signatureHex, publicKeyHex)
    expect(isMutatedValid).toBe(false)

    // 6. Replay (Event Store)
    // Ahora probamos la reconstrucción temporal del timeline
    const replayEvents = await store.replay(WORKSPACE_ID as any)
    expect(replayEvents).toHaveLength(1)
    expect(replayEvents[0]?.id).toBe("evt-001")

    // 7. Traversal (Linaje de Activos)
    // El ternero ("asset-child") proviene de un padre y madre.
    // El ancestry nos debe arrojar sus predecesores exactos usando recurrencia de parentIds.
    const ancestors = await store.getAncestors("asset-child" as any, WORKSPACE_ID as any)
    
    // Basandonos en el MockDb:
    // child -> ["asset-parent-1", "asset-parent-2"] 
    // parent-1 -> ["asset-grandparent-1"]
    expect(ancestors).toContain("asset-parent-1")
    expect(ancestors).toContain("asset-parent-2")
    expect(ancestors).toContain("asset-grandparent-1")
    expect(ancestors.length).toBe(3)
  })
})
