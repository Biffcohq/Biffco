export declare const employeesRouter: import("@trpc/server").TRPCBuiltRouter<{
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
            role: string;
            dni: string | null;
            supervisorId: string | null;
            memberId: string | null;
            isActive: boolean;
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
            name: string;
            createdAt: Date;
            isActive: boolean;
            workspaceId: string;
            role: string;
            dni: string | null;
            supervisorId: string | null;
            memberId: string | null;
        };
        meta: object;
    }>;
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            name: string;
            role: string;
            dni?: string | undefined;
        };
        output: {
            id: string;
            name: string;
            createdAt: Date;
            isActive: boolean;
            workspaceId: string;
            role: string;
            dni: string | null;
            supervisorId: string | null;
            memberId: string | null;
        } | undefined;
        meta: object;
    }>;
    update: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            name?: string | undefined;
            role?: string | undefined;
            dni?: string | undefined;
        };
        output: {
            id: string;
            workspaceId: string;
            name: string;
            role: string;
            dni: string | null;
            supervisorId: string | null;
            memberId: string | null;
            isActive: boolean;
            createdAt: Date;
        } | undefined;
        meta: object;
    }>;
    deactivate: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
            id: string;
            workspaceId: string;
            name: string;
            role: string;
            dni: string | null;
            supervisorId: string | null;
            memberId: string | null;
            isActive: boolean;
            createdAt: Date;
        } | undefined;
        meta: object;
    }>;
}>>;
//# sourceMappingURL=employees.d.ts.map