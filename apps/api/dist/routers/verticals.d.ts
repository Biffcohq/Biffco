export declare const verticalsRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../trpc").TRPCContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: import("@biffco/core/vertical-engine").VerticalPack[];
        meta: object;
    }>;
}>>;
//# sourceMappingURL=verticals.d.ts.map