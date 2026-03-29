"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDerivationPath = buildDerivationPath;
exports.deriveKeyFromMnemonic = deriveKeyFromMnemonic;
exports.deriveKeyFromSeed = deriveKeyFromSeed;
const ed25519_hd_key_1 = require("ed25519-hd-key");
const bip39_1 = require("bip39");
function buildDerivationPath(wsIdx, memberIdx) {
    return `m/0'/${wsIdx}'/${memberIdx}'`;
}
function deriveKeyFromMnemonic(mnemonic, wsIdx, memberIdx) {
    const seed = (0, bip39_1.mnemonicToSeedSync)(mnemonic);
    const path = buildDerivationPath(wsIdx, memberIdx);
    // Derivar la clave privada
    const { key: privateKeyBuffer } = (0, ed25519_hd_key_1.derivePath)(path, seed.toString("hex"));
    // Extraer la respectiva public key
    const publicKeyBuffer = (0, ed25519_hd_key_1.getPublicKey)(privateKeyBuffer);
    return {
        privateKey: new Uint8Array(privateKeyBuffer),
        publicKey: new Uint8Array(publicKeyBuffer),
    };
}
function deriveKeyFromSeed(seed, wsIdx, memberIdx) {
    const path = buildDerivationPath(wsIdx, memberIdx);
    const { key: privateKeyBuffer } = (0, ed25519_hd_key_1.derivePath)(path, seed.toString("hex"));
    const publicKeyBuffer = (0, ed25519_hd_key_1.getPublicKey)(privateKeyBuffer);
    return {
        privateKey: new Uint8Array(privateKeyBuffer),
        publicKey: new Uint8Array(publicKeyBuffer),
        publicKeyHex: publicKeyBuffer.toString("hex"),
    };
}
//# sourceMappingURL=slip0010.js.map