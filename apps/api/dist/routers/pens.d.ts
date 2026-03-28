export declare const pensRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../trpc").TRPCContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            name: string;
            capacity?: number | undefined;
        };
        output: {
            id: string;
            name: string;
            capacity: number | undefined;
        };
        meta: object;
    }>;
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: never[];
        meta: object;
    }>;
    getById: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: {
            id: string;
            name: string;
        };
        meta: object;
    }>;
    updateOccupancy: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            delta: number;
        };
        output: {
            ok: boolean;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=pens.d.ts.map