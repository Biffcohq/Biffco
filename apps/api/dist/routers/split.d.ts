export declare const splitRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../trpc").TRPCContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    createSplit: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            inputAssetId: string;
            outputAllocations: {
                quantity?: number | undefined;
                metadata?: Record<string, unknown> | undefined;
            }[];
        };
        output: {
            success: boolean;
            parent: string;
            childrenCount: number;
            holdsInherited: number;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=split.d.ts.map