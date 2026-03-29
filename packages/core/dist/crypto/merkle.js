"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerkleTree = void 0;
const crypto_1 = require("crypto");
/**
 * Árbol de Merkle con SHA-256.
 * Se usa para calcular la raíz de un batch de eventos antes de anclarlos en Polygon.
 * La raíz del árbol es lo que se publica en el smart contract.
 * Cada evento puede ser verificado contra la raíz sin necesidad de todos los demás.
 */
class MerkleTree {
    leaves;
    tree;
    constructor(leaves) {
        if (leaves.length === 0)
            throw new Error("MerkleTree: al menos 1 hoja requerida");
        this.leaves = leaves.map(l => this.hash(l));
        this.tree = this.buildTree(this.leaves);
    }
    /** SHA-256 de un string, retorna hex */
    hash(data) {
        return (0, crypto_1.createHash)("sha256").update(data).digest("hex");
    }
    buildTree(leaves) {
        if (leaves.length === 1)
            return [leaves];
        const levels = [leaves];
        let current = leaves;
        while (current.length > 1) {
            const next = [];
            for (let i = 0; i < current.length; i += 2) {
                const left = current[i] ?? "";
                const right = current[i + 1] ?? current[i] ?? ""; // Duplicar si número impar
                next.push(this.hash(left + right));
            }
            levels.push(next);
            current = next;
        }
        return levels;
    }
    /** La raíz del árbol — lo que se ancla en Polygon */
    getRoot() {
        const lastLevel = this.tree[this.tree.length - 1];
        if (!lastLevel || !lastLevel[0])
            throw new Error("MerkleTree: árbol vacío");
        return lastLevel[0];
    }
    /** Prueba de que una hoja pertenece al árbol */
    getProof(leafIndex) {
        const proof = [];
        let index = leafIndex;
        for (let level = 0; level < this.tree.length - 1; level++) {
            const currentLevel = this.tree[level];
            const isRight = index % 2 === 1;
            const siblingIndex = isRight ? index - 1 : index + 1;
            if (siblingIndex < currentLevel.length) {
                proof.push(currentLevel[siblingIndex]);
            }
            index = Math.floor(index / 2);
        }
        return proof;
    }
}
exports.MerkleTree = MerkleTree;
//# sourceMappingURL=merkle.js.map