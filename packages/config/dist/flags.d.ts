export declare const flags: {
    readonly DEBUG_MODE: boolean;
    readonly BLOCKCHAIN_ENABLED: boolean;
    readonly EMAIL_PROVIDER: "console" | "resend";
};
export type FeatureFlag = keyof typeof flags;
export declare const getFlag: <K extends FeatureFlag>(key: K) => (typeof flags)[K];
//# sourceMappingURL=flags.d.ts.map