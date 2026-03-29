"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const slip0010_1 = require("./slip0010");
const buffer_1 = require("buffer");
const TEST_MNEMONIC = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
(0, vitest_1.describe)("SLIP-0010 derivación", () => {
    (0, vitest_1.it)("misma semilla + mismo path → mismo keypair (determinista)", () => {
        const kp1 = (0, slip0010_1.deriveKeyFromMnemonic)(TEST_MNEMONIC, 1, 0);
        const kp2 = (0, slip0010_1.deriveKeyFromMnemonic)(TEST_MNEMONIC, 1, 0);
        (0, vitest_1.expect)(buffer_1.Buffer.from(kp1.publicKey).toString("hex"))
            .toBe(buffer_1.Buffer.from(kp2.publicKey).toString("hex"));
    });
    (0, vitest_1.it)("distintos wsIdx → claves matemáticamente distintas", () => {
        const ws1 = (0, slip0010_1.deriveKeyFromMnemonic)(TEST_MNEMONIC, 1, 0);
        const ws2 = (0, slip0010_1.deriveKeyFromMnemonic)(TEST_MNEMONIC, 2, 0);
        (0, vitest_1.expect)(buffer_1.Buffer.from(ws1.publicKey).toString("hex"))
            .not.toBe(buffer_1.Buffer.from(ws2.publicKey).toString("hex"));
    });
    (0, vitest_1.it)("distintos memberIdx → claves distintas (miembros distintos del mismo WS)", () => {
        const m0 = (0, slip0010_1.deriveKeyFromMnemonic)(TEST_MNEMONIC, 1, 0);
        const m1 = (0, slip0010_1.deriveKeyFromMnemonic)(TEST_MNEMONIC, 1, 1);
        (0, vitest_1.expect)(buffer_1.Buffer.from(m0.publicKey).toString("hex"))
            .not.toBe(buffer_1.Buffer.from(m1.publicKey).toString("hex"));
    });
    (0, vitest_1.it)("path de derivación tiene el formato correcto", () => {
        (0, vitest_1.expect)((0, slip0010_1.buildDerivationPath)(1, 0)).toBe("m/0'/1'/0'");
        (0, vitest_1.expect)((0, slip0010_1.buildDerivationPath)(5, 3)).toBe("m/0'/5'/3'");
    });
});
//# sourceMappingURL=slip0010.test.js.map