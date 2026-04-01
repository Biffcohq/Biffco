export declare const mergeRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../trpc").TRPCContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    createMerge: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            inputAssetIds: string[];
            outputType: string;
            outputMetadata?: Record<string, unknown> | undefined;
        };
        output: {
            success: boolean;
            childId: string;
            consumedCount: number;
            holdsInherited: number;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=merge.d.ts.map