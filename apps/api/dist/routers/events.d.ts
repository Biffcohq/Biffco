export declare const eventsRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../trpc").TRPCContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            streamId?: string | undefined;
            eventType?: string | undefined;
            limit?: number | undefined;
            cursor?: string | null | undefined;
        } | undefined;
        output: {
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
        meta: object;
    }>;
    append: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            streamId: string;
            eventType: string;
            hash: string;
            payload: Record<string, unknown>;
            publicKey?: string | undefined;
            streamType?: "asset" | "asset_group" | undefined;
            previousHash?: string | undefined;
            signature?: string | undefined;
        };
        output: {
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
        } | undefined;
        meta: object;
    }>;
    batch: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            eventType: string;
            payload: Record<string, unknown>;
            streamIds: string[];
            correlationId?: string | undefined;
        };
        output: {
            success: boolean;
            processed: number;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=events.d.ts.map