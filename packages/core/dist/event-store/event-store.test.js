"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any, no-unused-vars */
const vitest_1 = require("vitest");
const postgres_event_store_1 = require("./postgres-event-store");
const ed25519_1 = require("../crypto/ed25519");
const libsodium_wrappers_1 = __importDefault(require("libsodium-wrappers"));
const mockEvent = {
    id: "test-event-1",
    type: "ANIMAL_REGISTERED",
    schemaVersion: 1,
    assetId: "asset-1",
    workspaceId: "ws-1",
    actorId: "actor-1",
    employeeId: null,
    signature: "",
    publicKey: "",
    occurredAt: new Date("2024-01-15T10:00:00.000Z"),
    createdAt: new Date("2024-01-15T10:00:01.000Z"),
    correlationId: null,
    payload: { breed: "angus" }
};
class MockDb {
    events = [];
    async insertEvent(event) {
        this.events.push(event);
    }
    async getEventsByAssetId(assetId, workspaceId) {
        return this.events.filter(e => e.assetId === assetId && e.workspaceId === workspaceId);
    }
    async getAllEventsByWorkspace(workspaceId) {
        return this.events.filter(e => e.workspaceId === workspaceId);
    }
    async getAssetById(_assetId, _workspaceId) {
        return { parentIds: [] };
    }
}
(0, vitest_1.describe)("PostgresEventStore", () => {
    (0, vitest_1.it)("append rechaza evento con firma inválida", async () => {
        const db = new MockDb();
        const store = new postgres_event_store_1.PostgresEventStore(db);
        const result = await store.append({ ...mockEvent, signature: "firma-invalida" });
        (0, vitest_1.expect)(result.ok).toBe(false);
        if (!result.ok) {
            (0, vitest_1.expect)(result.error).toBe("INVALID_SIGNATURE");
        }
    });
    (0, vitest_1.it)("append acepta evento con firma válida", async () => {
        await libsodium_wrappers_1.default.ready;
        const keypair = libsodium_wrappers_1.default.crypto_sign_keypair();
        const signable = {
            type: mockEvent.type,
            schemaVersion: mockEvent.schemaVersion,
            assetId: mockEvent.assetId,
            workspaceId: mockEvent.workspaceId,
            actorId: mockEvent.actorId,
            occurredAt: mockEvent.occurredAt.toISOString(),
            payload: mockEvent.payload,
        };
        const sig = await (0, ed25519_1.signEvent)(signable, keypair.privateKey);
        const validEvent = {
            ...mockEvent,
            signature: sig,
            publicKey: libsodium_wrappers_1.default.to_hex(keypair.publicKey)
        };
        const db = new MockDb();
        const store = new postgres_event_store_1.PostgresEventStore(db);
        const result = await store.append(validEvent);
        (0, vitest_1.expect)(result.ok).toBe(true);
        (0, vitest_1.expect)(db.events.length).toBe(1);
    });
    (0, vitest_1.it)("replay es determinístico y ordena por occurredAt luego createdAt", async () => {
        const db = new MockDb();
        db.events = [
            { ...mockEvent, id: "3", occurredAt: new Date("2024-01-15T10:00:05.000Z"), createdAt: new Date("2024-01-15T10:00:05.000Z") },
            { ...mockEvent, id: "1", occurredAt: new Date("2024-01-15T10:00:00.000Z"), createdAt: new Date("2024-01-15T10:00:01.000Z") },
            { ...mockEvent, id: "2", occurredAt: new Date("2024-01-15T10:00:05.000Z"), createdAt: new Date("2024-01-15T10:00:02.000Z") }
        ];
        const store = new postgres_event_store_1.PostgresEventStore(db);
        const replay1 = await store.replay("ws-1");
        const replay2 = await store.replay("ws-1");
        (0, vitest_1.expect)(replay1.map(e => e.id)).toEqual(["1", "2", "3"]);
        (0, vitest_1.expect)(replay2.map(e => e.id)).toEqual(["1", "2", "3"]);
    });
    (0, vitest_1.it)("beforeOperation hook puede rechazar la inserción de eventos", async () => {
        await libsodium_wrappers_1.default.ready;
        const keypair = libsodium_wrappers_1.default.crypto_sign_keypair();
        const event = { ...mockEvent, type: "REJECTED_EVENT" };
        const signable = {
            type: event.type,
            schemaVersion: event.schemaVersion,
            assetId: event.assetId,
            workspaceId: event.workspaceId,
            actorId: event.actorId,
            occurredAt: event.occurredAt.toISOString(),
            payload: event.payload,
        };
        const sig = await (0, ed25519_1.signEvent)(signable, keypair.privateKey);
        const validEvent = { ...event, signature: sig, publicKey: libsodium_wrappers_1.default.to_hex(keypair.publicKey) };
        const db = new MockDb();
        const hooks = {
            beforeOperation: async (e) => {
                if (e.type === "REJECTED_EVENT")
                    return { ok: false, error: "Not allowed" };
                return { ok: true, value: undefined };
            },
            afterOperation: async () => { }
        };
        const store = new postgres_event_store_1.PostgresEventStore(db, hooks);
        const result = await store.append(validEvent);
        (0, vitest_1.expect)(result.ok).toBe(false);
        if (!result.ok) {
            (0, vitest_1.expect)(result.error).toBe("HOOK_REJECTED");
        }
        (0, vitest_1.expect)(db.events.length).toBe(0);
    });
});
//# sourceMappingURL=event-store.test.js.map