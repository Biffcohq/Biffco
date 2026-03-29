"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const merkle_1 = require("./merkle");
const crypto_1 = require("crypto");
(0, vitest_1.describe)("MerkleTree", () => {
    (0, vitest_1.it)("construye la raíz y permite verificar una prueba de 100 eventos", () => {
        const leaves = Array.from({ length: 100 }, (_, i) => `evento-${i}`);
        const tree = new merkle_1.MerkleTree(leaves);
        const root = tree.getRoot();
        (0, vitest_1.expect)(typeof root).toBe("string");
        (0, vitest_1.expect)(root.length).toBe(64); // sha256
        // Verificamos prueba manual reconstruyendo hacia arriba
        const leafIndex = 42;
        const targetLeaf = leaves[leafIndex];
        const hashedTarget = (0, crypto_1.createHash)("sha256").update(targetLeaf).digest("hex");
        const proof = tree.getProof(leafIndex);
        let currentHash = hashedTarget;
        let idx = leafIndex;
        for (const siblingHash of proof) {
            const isRight = idx % 2 === 1;
            const left = isRight ? siblingHash : currentHash;
            const right = isRight ? currentHash : siblingHash;
            currentHash = (0, crypto_1.createHash)("sha256").update(left + right).digest("hex");
            idx = Math.floor(idx / 2);
        }
        (0, vitest_1.expect)(currentHash).toBe(root); // ¡Match! El evento es válido según la raíz
    });
    (0, vitest_1.it)("falla si intentamos inicializarlo vacío", () => {
        (0, vitest_1.expect)(() => new merkle_1.MerkleTree([])).toThrow();
    });
});
//# sourceMappingURL=merkle.test.js.map