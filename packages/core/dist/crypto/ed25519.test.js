"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const ed25519_1 = require("./ed25519");
const libsodium_wrappers_1 = __importDefault(require("libsodium-wrappers"));
// Vector de prueba básico
const testPayload = {
    type: "ANIMAL_REGISTERED",
    schemaVersion: 1,
    assetId: "test-asset-001",
    workspaceId: "test-workspace-001",
    actorId: "test-actor-001",
    occurredAt: "2024-01-15T10:00:00.000Z",
    payload: { breed: "angus", sex: "male" }
};
(0, vitest_1.describe)("Ed25519 — signEvent + verifyEvent", () => {
    (0, vitest_1.it)("firma y verifica correctamente", async () => {
        await libsodium_wrappers_1.default.ready;
        const keypair = libsodium_wrappers_1.default.crypto_sign_keypair();
        const sig = await (0, ed25519_1.signEvent)(testPayload, keypair.privateKey);
        const valid = await (0, ed25519_1.verifyEvent)(testPayload, sig, libsodium_wrappers_1.default.to_hex(keypair.publicKey));
        (0, vitest_1.expect)(valid).toBe(true);
    });
    (0, vitest_1.it)("falla con payload modificado", async () => {
        await libsodium_wrappers_1.default.ready;
        const keypair = libsodium_wrappers_1.default.crypto_sign_keypair();
        const sig = await (0, ed25519_1.signEvent)(testPayload, keypair.privateKey);
        const modified = { ...testPayload, type: "MODIFIED_TYPE" };
        const valid = await (0, ed25519_1.verifyEvent)(modified, sig, libsodium_wrappers_1.default.to_hex(keypair.publicKey));
        (0, vitest_1.expect)(valid).toBe(false);
    });
    (0, vitest_1.it)("falla con clave pública incorrecta", async () => {
        await libsodium_wrappers_1.default.ready;
        const keypairA = libsodium_wrappers_1.default.crypto_sign_keypair();
        const keypairB = libsodium_wrappers_1.default.crypto_sign_keypair();
        const sig = await (0, ed25519_1.signEvent)(testPayload, keypairA.privateKey);
        const valid = await (0, ed25519_1.verifyEvent)(testPayload, sig, libsodium_wrappers_1.default.to_hex(keypairB.publicKey));
        (0, vitest_1.expect)(valid).toBe(false);
    });
    (0, vitest_1.it)("canonicalJson garantiza firma determinista", async () => {
        await libsodium_wrappers_1.default.ready;
        const keypair = libsodium_wrappers_1.default.crypto_sign_keypair();
        // Mismo payload, keys en distinto orden
        const payloadA = { ...testPayload, payload: { sex: "male", breed: "angus" } };
        const payloadB = { ...testPayload, payload: { breed: "angus", sex: "male" } };
        const sigA = await (0, ed25519_1.signEvent)(payloadA, keypair.privateKey);
        const sigB = await (0, ed25519_1.signEvent)(payloadB, keypair.privateKey);
        (0, vitest_1.expect)(sigA).toBe(sigB);
    });
});
//# sourceMappingURL=ed25519.test.js.map