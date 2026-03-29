export declare const pensRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../trpc").TRPCContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            name: string;
            facilityId: string;
            capacity?: number | undefined;
            zoneId?: string | undefined;
        };
        output: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            workspaceId: string;
            facilityId: string;
            capacity: string | null;
            zoneId: string | null;
            currentOccupancy: string;
        } | undefined;
        meta: object;
    }>;
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            id: string;
            facilityId: string;
            zoneId: string | null;
            workspaceId: string;
            name: string;
            capacity: string | null;
            currentOccupancy: string;
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
            facilityId: string;
            capacity: string | null;
            zoneId: string | null;
            currentOccupancy: string;
        };
        meta: object;
    }>;
    updateOccupancy: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            delta: number;
        };
        output: {
            id: string;
            facilityId: string;
            zoneId: string | null;
            workspaceId: string;
            name: string;
            capacity: string | null;
            currentOccupancy: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | undefined;
        meta: object;
    }>;
}>>;
//# sourceMappingURL=pens.d.ts.map