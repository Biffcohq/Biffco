import type { Buffer } from 'buffer';
export declare function buildDerivationPath(wsIdx: number, memberIdx: number): string;
export declare function deriveKeyFromMnemonic(mnemonic: string, wsIdx: number, memberIdx: number): {
    privateKey: Uint8Array;
    publicKey: Uint8Array;
};
export declare function deriveKeyFromSeed(seed: Buffer, wsIdx: number, memberIdx: number): {
    privateKey: Uint8Array;
    publicKey: Uint8Array;
    publicKeyHex: string;
};
//# sourceMappingURL=slip0010.d.ts.map