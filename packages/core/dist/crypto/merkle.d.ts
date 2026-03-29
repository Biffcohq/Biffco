/**
 * Árbol de Merkle con SHA-256.
 * Se usa para calcular la raíz de un batch de eventos antes de anclarlos en Polygon.
 * La raíz del árbol es lo que se publica en el smart contract.
 * Cada evento puede ser verificado contra la raíz sin necesidad de todos los demás.
 */
export declare class MerkleTree {
    private readonly leaves;
    private readonly tree;
    constructor(leaves: string[]);
    /** SHA-256 de un string, retorna hex */
    private hash;
    private buildTree;
    /** La raíz del árbol — lo que se ancla en Polygon */
    getRoot(): string;
    /** Prueba de que una hoja pertenece al árbol */
    getProof(leafIndex: number): string[];
}
//# sourceMappingURL=merkle.d.ts.map