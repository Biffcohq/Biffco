"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any, no-unused-vars */
const vitest_1 = require("vitest");
const slip0010_1 = require("./crypto/slip0010");
const ed25519_1 = require("./crypto/ed25519");
const postgres_event_store_1 = require("./event-store/postgres-event-store");
const libsodium_wrappers_1 = __importDefault(require("libsodium-wrappers"));
// Base de datos Mock para aislar la validación del core de la infraestructura
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
    async getAssetById(assetId, _workspaceId) {
        // Simular un árbol para el test de linaje (ancestors)
        if (assetId === "asset-child")
            return { parentIds: ["asset-parent-1", "asset-parent-2"] };
        if (assetId === "asset-parent-1")
            return { parentIds: ["asset-grandparent-1"] };
        return { parentIds: [] };
    }
}
const TEST_MNEMONIC = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
const WORKSPACE_ID = "ws-test-001";
const ACTOR_ID = "actor-member-001";
(0, vitest_1.describe)("D09: Core Trust Layer Integration Flow", () => {
    (0, vitest_1.it)("Flujo Completo: deriveKey -> sign -> verify -> append -> replay -> lineage", async () => {
        // 1. Derivación de Clave (Criptografía)
        // El usuario (actor) ingresa su mnemonic en el browser. 
        // Derivamos sus claves Ed25519 con el método SLIP-0010.
        const wsIdx = 1;
        const memberIdx = 0;
        await libsodium_wrappers_1.default.ready;
        const keypair = (0, slip0010_1.deriveKeyFromMnemonic)(TEST_MNEMONIC, wsIdx, memberIdx);
        const kp = libsodium_wrappers_1.default.crypto_sign_seed_keypair(keypair.privateKey);
        const publicKeyHex = libsodium_wrappers_1.default.to_hex(kp.publicKey);
        // 2. Generación del Evento (Dominio)
        // El actor decide registrar el nacimiento de un ternero.
        const assetId = "asset-child";
        const signableOrigin = {
            type: "ANIMAL_REGISTERED",
            schemaVersion: 1,
            assetId: assetId,
            workspaceId: WORKSPACE_ID,
            actorId: ACTOR_ID,
            occurredAt: new Date("2024-03-27T10:00:00.000Z").toISOString(),
            payload: { breed: "angus", origin: "natural" }
        };
        // 3. Firma del Evento (Criptografía)
        // Se firma con Ed25519 bajo el canonicalJson del payload
        const signatureHex = await (0, ed25519_1.signEvent)(signableOrigin, keypair.privateKey);
        (0, vitest_1.expect)(signatureHex).toBeTypeOf("string");
        (0, vitest_1.expect)(signatureHex.length).toBeGreaterThan(64);
        // Este es el DomainEvent concreto que se enviará al servidor
        const domainEvent = {
            id: "evt-001",
            type: signableOrigin.type,
            schemaVersion: signableOrigin.schemaVersion,
            assetId: signableOrigin.assetId,
            workspaceId: signableOrigin.workspaceId,
            actorId: signableOrigin.actorId,
            employeeId: null,
            occurredAt: new Date(signableOrigin.occurredAt),
            createdAt: new Date(),
            correlationId: null,
            payload: signableOrigin.payload,
            signature: signatureHex,
            publicKey: publicKeyHex
        };
        // 4. Recepción en el Servidor y Verificación (Event Store)
        const db = new MockDb();
        const hooks = {
            beforeOperation: async () => ({ ok: true, value: undefined }),
            afterOperation: async () => { }
        };
        const store = new postgres_event_store_1.PostgresEventStore(db, hooks);
        // El servidor recibe el domainEvent y lo intenta append. 
        // Internalmente llamará a verifyEvent.
        const appendResult = await store.append(domainEvent);
        (0, vitest_1.expect)(appendResult.ok).toBe(true);
        // 5. Verificamos explícitamente que la función crypto funcionó
        const isValid = await (0, ed25519_1.verifyEvent)(signableOrigin, signatureHex, publicKeyHex);
        (0, vitest_1.expect)(isValid).toBe(true);
        // Si hubiese firmado otro workspace/actor o payload mutado
        const mutatedSignable = { ...signableOrigin, payload: { breed: "hereford" } };
        const isMutatedValid = await (0, ed25519_1.verifyEvent)(mutatedSignable, signatureHex, publicKeyHex);
        (0, vitest_1.expect)(isMutatedValid).toBe(false);
        // 6. Replay (Event Store)
        // Ahora probamos la reconstrucción temporal del timeline
        const replayEvents = await store.replay(WORKSPACE_ID);
        (0, vitest_1.expect)(replayEvents).toHaveLength(1);
        (0, vitest_1.expect)(replayEvents[0]?.id).toBe("evt-001");
        // 7. Traversal (Linaje de Activos)
        // El ternero ("asset-child") proviene de un padre y madre.
        // El ancestry nos debe arrojar sus predecesores exactos usando recurrencia de parentIds.
        const ancestors = await store.getAncestors("asset-child", WORKSPACE_ID);
        // Basandonos en el MockDb:
        // child -> ["asset-parent-1", "asset-parent-2"] 
        // parent-1 -> ["asset-grandparent-1"]
        (0, vitest_1.expect)(ancestors).toContain("asset-parent-1");
        (0, vitest_1.expect)(ancestors).toContain("asset-parent-2");
        (0, vitest_1.expect)(ancestors).toContain("asset-grandparent-1");
        (0, vitest_1.expect)(ancestors.length).toBe(3);
    });
});
//# sourceMappingURL=integration.test.js.map