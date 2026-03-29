export declare const authRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../trpc").TRPCContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    checkEmail: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            email: string;
        };
        output: {
            available: boolean;
        };
        meta: object;
    }>;
    checkSlug: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            slug: string;
        };
        output: {
            available: boolean;
        };
        meta: object;
    }>;
    register: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            email: string;
            passwordHash: string;
            verticalId: string;
            publicKey: string;
            workspaceName: string;
            workspaceSlug: string;
            country: string;
            initialRoles: string[];
            personName: string;
            wsIdx: number;
        };
        output: {
            accessToken: string;
            refreshToken: string;
            workspaceId: string;
            memberId: string;
        };
        meta: object;
    }>;
    login: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            email: string;
            passwordHash: string;
        };
        output: {
            accessToken: string;
            refreshToken: string;
            workspaceId: string;
            memberId: string;
            personName: string;
        };
        meta: object;
    }>;
    logout: import("@trpc/server").TRPCMutationProcedure<{
        input: void;
        output: {
            ok: boolean;
        };
        meta: object;
    }>;
    refresh: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            refreshToken: string;
        };
        output: {
            accessToken: string;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=auth.d.ts.map