import { describe, it, expect } from 'vitest'
import { PostgresEventStore, type EventStoreDb } from './postgres-event-store'
import { signEvent } from '../crypto/ed25519'
import type { DomainEvent, SignableEventPayload } from '../domain/event'
import _sodium from 'libsodium-wrappers'

const mockEvent: DomainEvent = {
  id: "test-event-1" as any,
  type: "ANIMAL_REGISTERED",
  schemaVersion: 1,
  assetId: "asset-1" as any,
  workspaceId: "ws-1" as any,
  actorId: "actor-1" as any,
  employeeId: null,
  signature: "",
  publicKey: "",
  occurredAt: new Date("2024-01-15T10:00:00.000Z"),
  createdAt: new Date("2024-01-15T10:00:01.000Z"),
  correlationId: null,
  payload: { breed: "angus" }
}

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
  
  async getAssetById(_assetId: any, _workspaceId: any): Promise<{ parentIds: any[] } | null> {
    return { parentIds: [] }
  }
}

describe("PostgresEventStore", () => {
  it("append rechaza evento con firma inválida", async () => {
    const db = new MockDb()
    const store = new PostgresEventStore(db)

    const result = await store.append({ ...mockEvent, signature: "firma-invalida" })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBe("INVALID_SIGNATURE")
    }
  })

  it("append acepta evento con firma válida", async () => {
    await _sodium.ready
    const keypair = _sodium.crypto_sign_keypair()

    const signable: SignableEventPayload = {
      type: mockEvent.type,
      schemaVersion: mockEvent.schemaVersion,
      assetId: mockEvent.assetId as string,
      workspaceId: mockEvent.workspaceId as string,
      actorId: mockEvent.actorId as string,
      occurredAt: mockEvent.occurredAt.toISOString(),
      payload: mockEvent.payload as Record<string, unknown>,
    }

    const sig = await signEvent(signable, keypair.privateKey)
    const validEvent = {
      ...mockEvent,
      signature: sig,
      publicKey: _sodium.to_hex(keypair.publicKey)
    }

    const db = new MockDb()
    const store = new PostgresEventStore(db)
    const result = await store.append(validEvent)
    
    expect(result.ok).toBe(true)
    expect(db.events.length).toBe(1)
  })

  it("replay es determinístico y ordena por occurredAt luego createdAt", async () => {
    const db = new MockDb()
    db.events = [
      { ...mockEvent, id: "3" as any, occurredAt: new Date("2024-01-15T10:00:05.000Z"), createdAt: new Date("2024-01-15T10:00:05.000Z") },
      { ...mockEvent, id: "1" as any, occurredAt: new Date("2024-01-15T10:00:00.000Z"), createdAt: new Date("2024-01-15T10:00:01.000Z") },
      { ...mockEvent, id: "2" as any, occurredAt: new Date("2024-01-15T10:00:05.000Z"), createdAt: new Date("2024-01-15T10:00:02.000Z") }
    ]

    const store = new PostgresEventStore(db)
    const replay1 = await store.replay("ws-1" as any)
    const replay2 = await store.replay("ws-1" as any)

    expect(replay1.map(e => e.id)).toEqual(["1", "2", "3"])
    expect(replay2.map(e => e.id)).toEqual(["1", "2", "3"])
  })

  it("beforeOperation hook puede rechazar la inserción de eventos", async () => {
    await _sodium.ready
    const keypair = _sodium.crypto_sign_keypair()

    const event = { ...mockEvent, type: "REJECTED_EVENT" }
    const signable: SignableEventPayload = {
      type: event.type,
      schemaVersion: event.schemaVersion,
      assetId: event.assetId as string,
      workspaceId: event.workspaceId as string,
      actorId: event.actorId as string,
      occurredAt: event.occurredAt.toISOString(),
      payload: event.payload as Record<string, unknown>,
    }

    const sig = await signEvent(signable, keypair.privateKey)
    const validEvent = { ...event, signature: sig, publicKey: _sodium.to_hex(keypair.publicKey) }

    const db = new MockDb()
    const hooks = {
      beforeOperation: async (e: DomainEvent) => {
        if (e.type === "REJECTED_EVENT") return { ok: false, error: "Not allowed" } as any
        return { ok: true, value: undefined } as any
      },
      afterOperation: async () => {}
    }

    const store = new PostgresEventStore(db, hooks)
    const result = await store.append(validEvent)
    
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBe("HOOK_REJECTED")
    }
    expect(db.events.length).toBe(0)
  })
})
