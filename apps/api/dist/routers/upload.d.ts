export declare const uploadRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../trpc").TRPCContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    getSignedUrl: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            filename: string;
            contentType: string;
            assetId?: string | undefined;
        };
        output: {
            url: string;
            key: string;
            expiresInSecs: number;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=upload.d.ts.map