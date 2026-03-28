export declare const teamsRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../trpc").TRPCContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            id: string;
            workspaceId: string;
            name: string;
            description: string | null;
            createdAt: Date;
        }[];
        meta: object;
    }>;
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            name: string;
            description?: string | undefined;
        };
        output: {
            id: string;
            name: string;
            createdAt: Date;
            workspaceId: string;
            description: string | null;
        } | undefined;
        meta: object;
    }>;
    update: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            name?: string | undefined;
            description?: string | undefined;
        };
        output: {
            id: string;
            workspaceId: string;
            name: string;
            description: string | null;
            createdAt: Date;
        } | undefined;
        meta: object;
    }>;
}>>;
//# sourceMappingURL=teams.d.ts.map