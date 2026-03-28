export declare const workspaceMembersRouter: import("@trpc/server").TRPCBuiltRouter<{
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
            personId: string;
            publicKey: string;
            roles: string[];
            status: string;
            invitedAt: Date;
            acceptedAt: Date | null;
            revokedAt: Date | null;
            createdAt: Date;
        }[];
        meta: object;
    }>;
    getById: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: {
            id: string;
            createdAt: Date;
            personId: string;
            workspaceId: string;
            publicKey: string;
            roles: string[];
            status: string;
            invitedAt: Date;
            acceptedAt: Date | null;
            revokedAt: Date | null;
        };
        meta: object;
    }>;
    invite: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            email: string;
            roles: string[];
        };
        output: {
            id: string;
            createdAt: Date;
            personId: string;
            workspaceId: string;
            publicKey: string;
            roles: string[];
            status: string;
            invitedAt: Date;
            acceptedAt: Date | null;
            revokedAt: Date | null;
        } | undefined;
        meta: object;
    }>;
    revoke: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            memberId: string;
        };
        output: {
            id: string;
            workspaceId: string;
            personId: string;
            publicKey: string;
            roles: string[];
            status: string;
            invitedAt: Date;
            acceptedAt: Date | null;
            revokedAt: Date | null;
            createdAt: Date;
        } | undefined;
        meta: object;
    }>;
}>>;
//# sourceMappingURL=workspace-members.d.ts.map