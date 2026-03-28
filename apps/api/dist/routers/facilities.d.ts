export declare const facilitiesRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../trpc").TRPCContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            name: string;
            type: string;
            country?: string | undefined;
            licenseNumber?: string | undefined;
            address?: string | undefined;
            polygon?: {
                type: "Polygon";
                coordinates: number[][][];
            } | undefined;
        };
        output: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            workspaceId: string;
            type: string;
            location: unknown;
        } | undefined;
        meta: object;
    }>;
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            id: string;
            workspaceId: string;
            name: string;
            type: string;
            location: unknown;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
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
            updatedAt: Date;
            isActive: boolean;
            workspaceId: string;
            type: string;
            location: unknown;
        };
        meta: object;
    }>;
    update: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            name?: string | undefined;
            isActive?: boolean | undefined;
        };
        output: {
            id: string;
            workspaceId: string;
            name: string;
            type: string;
            location: unknown;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | undefined;
        meta: object;
    }>;
}>>;
//# sourceMappingURL=facilities.d.ts.map