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
                globalId: number;
                streamId: string;
                streamType: string;
                eventType: string;
                hash: string;
                previousHash: string | null;
                signature: string | null;
                signerId: string | null;
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
        } | undefined;
        meta: object;
    }>;
}>>;
//# sourceMappingURL=assets.d.ts.map