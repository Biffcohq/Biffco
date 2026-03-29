"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const bip39_1 = require("./bip39");
(0, vitest_1.describe)("BIP-39 Mnemonic", () => {
    (0, vitest_1.it)("generateMnemonic crea un seed de 24 palabras (256 bits de entropía)", () => {
        const mnemonic = (0, bip39_1.generateMnemonic)();
        const words = mnemonic.split(" ");
        (0, vitest_1.expect)(words.length).toBe(24);
    });
    (0, vitest_1.it)("isValidMnemonic verifica el checksum correctamente", () => {
        const mnemonic = (0, bip39_1.generateMnemonic)();
        (0, vitest_1.expect)((0, bip39_1.isValidMnemonic)(mnemonic)).toBe(true);
        (0, vitest_1.expect)((0, bip39_1.isValidMnemonic)("abandon invalid text test")).toBe(false);
    });
    (0, vitest_1.it)("mnemonicToSeed es determinista", () => {
        const m = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
        const seed1 = (0, bip39_1.mnemonicToSeed)(m);
        const seed2 = (0, bip39_1.mnemonicToSeed)(m);
        (0, vitest_1.expect)(seed1.toString("hex")).toBe(seed2.toString("hex"));
    });
});
//# sourceMappingURL=bip39.test.js.map