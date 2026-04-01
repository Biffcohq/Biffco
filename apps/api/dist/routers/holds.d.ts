export declare const holdsRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../trpc").TRPCContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            id: string;
            createdAt: Date;
            isActive: boolean;
            workspaceId: string;
            assetId: string;
            reason: string;
            issuerId: string;
            releasedAt: Date | null;
        }[];
        meta: object;
    }>;
    impose: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            assetId: string;
            reason: string;
        };
        output: {
            id: string;
            createdAt: Date;
            isActive: boolean;
            workspaceId: string;
            assetId: string;
            reason: string;
            issuerId: string;
            releasedAt: Date | null;
        };
        meta: object;
    }>;
    lift: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            holdId: string;
            reason?: string | undefined;
        };
        output: {
            success: boolean;
            remainedInQuarantine: boolean;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=holds.d.ts.map