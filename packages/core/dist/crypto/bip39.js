"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMnemonic = generateMnemonic;
exports.isValidMnemonic = isValidMnemonic;
exports.mnemonicToSeed = mnemonicToSeed;
const bip39_1 = require("bip39");
/**
 * Genera un mnemonic BIP-39 de 24 palabras.
 *
 * SEGURIDAD: Esta función SOLO se llama en el browser durante el signup.
 * NUNCA se llama en apps/api ni en ningún servidor.
 * NUNCA se almacena el mnemonic en la DB ni en ningún log.
 *
 * El mnemonic se muestra UNA SOLA VEZ al usuario.
 * Después de que el usuario confirma las 3 palabras, el mnemonic
 * se elimina de la memoria del browser.
 */
function generateMnemonic() {
    // 256 bits de entropía = 24 palabras
    return (0, bip39_1.generateMnemonic)(256);
}
/**
 * Valida que un mnemonic tiene el formato correcto.
 */
function isValidMnemonic(mnemonic) {
    return (0, bip39_1.validateMnemonic)(mnemonic);
}
/**
 * Convierte un mnemonic a seed para SLIP-0010.
 * Usado internamente por deriveKeyFromMnemonic en slip0010.ts.
 */
function mnemonicToSeed(mnemonic) {
    return (0, bip39_1.mnemonicToSeedSync)(mnemonic);
}
//# sourceMappingURL=bip39.js.map