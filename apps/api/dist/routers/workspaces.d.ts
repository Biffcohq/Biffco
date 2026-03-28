export declare const workspacesRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../trpc").TRPCContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    getProfile: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            verticalId: string;
            plan: "free" | "starter" | "pro" | "enterprise";
            settings: unknown;
            isActive: boolean;
        };
        meta: object;
    }>;
    updateProfile: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            name?: string | undefined;
            slug?: string | undefined;
            settings?: Record<string, unknown> | undefined;
        };
        output: {
            id: string;
            name: string;
            slug: string;
            verticalId: string;
            plan: "free" | "starter" | "pro" | "enterprise";
            settings: unknown;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | undefined;
        meta: object;
    }>;
}>>;
//# sourceMappingURL=workspaces.d.ts.map