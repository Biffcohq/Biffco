export declare class PolygonProvider {
    private provider;
    private contract;
    private getContract;
    /**
     * Ancla una raíz de Merkle en Polygon.
     * @returns txHash de la transacción
     */
    anchor(merkleRoot: string, batchId: string): Promise<string>;
}
export declare const polygonProvider: PolygonProvider;
//# sourceMappingURL=polygon-provider.d.ts.map