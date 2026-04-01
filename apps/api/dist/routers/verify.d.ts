export declare const verifyRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../trpc").TRPCContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    getAssetById: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: {
            events: {
                globalId: number;
                id: string;
                workspaceId: string;
                streamId: string;
                streamType: string;
                eventType: string;
                data: unknown;
                hash: string;
                previousHash: string | null;
                signature: string | null;
                signerId: string | null;
                createdAt: Date;
            }[];
            holds: {
                id: string;
                assetId: string;
                workspaceId: string;
                reason: string;
                isActive: boolean;
                issuerId: string;
                createdAt: Date;
                releasedAt: Date | null;
            }[];
            anchor: null;
            id: string;
            workspaceId: string;
            groupId: string | null;
            verticalId: string;
            type: string;
            status: string;
            locationId: string | null;
            metadata: unknown;
            parentIds: string[];
            createdAt: Date;
            updatedAt: Date;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=verify.d.ts.map