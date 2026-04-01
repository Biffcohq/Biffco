export declare const assetsRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../trpc").TRPCContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            status?: string | undefined;
            type?: string | undefined;
            limit?: number | undefined;
            cursor?: string | null | undefined;
        } | undefined;
        output: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            verticalId: string;
            workspaceId: string;
            status: string;
            metadata: unknown;
            groupId: string | null;
            type: string;
            locationId: string | null;
            parentIds: string[];
        }[];
        meta: object;
    }>;
    getById: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: {
            events: {
                id: string;
                data: unknown;
                createdAt: Date;
                workspaceId: string;
                hash: string;
                globalId: number;
                streamId: string;
                streamType: string;
                eventType: string;
                previousHash: string | null;
                signature: string | null;
                signerId: string | null;
            }[];
            holds: {
                id: string;
                createdAt: Date;
                isActive: boolean;
                workspaceId: string;
                assetId: string;
                reason: string;
                issuerId: string;
                releasedAt: Date | null;
            }[];
            id: string;
            createdAt: Date;
            updatedAt: Date;
            verticalId: string;
            workspaceId: string;
            status: string;
            metadata: unknown;
            groupId: string | null;
            type: string;
            locationId: string | null;
            parentIds: string[];
        };
        meta: object;
    }>;
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            type: string;
            initialState: Record<string, unknown>;
            facilityId?: string | undefined;
            externalId?: string | undefined;
            penId?: string | undefined;
        };
        output: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            verticalId: string;
            workspaceId: string;
            status: string;
            metadata: unknown;
            groupId: string | null;
            type: string;
            locationId: string | null;
            parentIds: string[];
        } | undefined;
        meta: object;
    }>;
}>>;
//# sourceMappingURL=assets.d.ts.map