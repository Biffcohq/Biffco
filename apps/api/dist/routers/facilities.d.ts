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
            polygon?: {
                type: "Polygon";
                coordinates: number[][][];
            } | undefined;
            country?: string | undefined;
            address?: string | undefined;
            licenseNumber?: string | undefined;
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
            zones: {
                pens: {
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
                }[];
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                workspaceId: string;
                type: string;
                facilityId: string;
                capacity: string | null;
                polygon: unknown;
                gfwStatus: string;
            }[];
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