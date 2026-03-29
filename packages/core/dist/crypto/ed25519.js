"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signEvent = signEvent;
exports.verifyEvent = verifyEvent;
/* global TextEncoder */
const libsodium_wrappers_1 = __importDefault(require("libsodium-wrappers"));
const shared_1 = require("@biffco/shared");
let _ready = false;
async function ensureReady() {
    if (_ready)
        return;
    await libsodium_wrappers_1.default.ready;
    _ready = true;
}
/**
 * Firma el payload de un evento con una clave privada Ed25519.
 *
 * Lo que se firma: canonicalJson(payload) — siempre el mismo string
 * para el mismo payload, independientemente del orden de las keys.
 *
 * @returns signature en formato hex
 */
async function signEvent(payload, privateKey) {
    await ensureReady();
    const message = new TextEncoder().encode((0, shared_1.canonicalJson)(payload));
    let activeKey = privateKey;
    // HD derivation outputs 32-byte seeds. Libsodium expects 64-byte secret keys.
    if (privateKey.length === 32) {
        const kp = libsodium_wrappers_1.default.crypto_sign_seed_keypair(privateKey);
        activeKey = kp.privateKey;
    }
    const signature = libsodium_wrappers_1.default.crypto_sign_detached(message, activeKey);
    return libsodium_wrappers_1.default.to_hex(signature);
}
/**
 * Verifica la firma Ed25519 de un evento.
 *
 * @returns true si la firma es válida, false en cualquier otro caso
 * NUNCA lanza una excepción — siempre retorna un boolean.
 */
async function verifyEvent(payload, signatureHex, publicKeyHex) {
    await ensureReady();
    try {
        const message = new TextEncoder().encode((0, shared_1.canonicalJson)(payload));
        const signature = libsodium_wrappers_1.default.from_hex(signatureHex);
        const publicKey = libsodium_wrappers_1.default.from_hex(publicKeyHex);
        return libsodium_wrappers_1.default.crypto_sign_verify_detached(signature, message, publicKey);
    }
    catch {
        // Firma o clave malformada — tratar como inválida
        return false;
    }
}
//# sourceMappingURL=ed25519.js.map