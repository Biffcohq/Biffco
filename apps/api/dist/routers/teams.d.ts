export declare const teamsRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../trpc").TRPCContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            memberIds: string[];
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
    delete: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
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
    addMember: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            teamId: string;
            memberId: string;
        };
        output: {
            id: string;
            createdAt: Date;
            teamId: string;
            memberId: string;
        } | undefined;
        meta: object;
    }>;
    removeMember: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            teamId: string;
            memberId: string;
        };
        output: {
            id: string;
            createdAt: Date;
            teamId: string;
            memberId: string;
        } | undefined;
        meta: object;
    }>;
}>>;
//# sourceMappingURL=teams.d.ts.map