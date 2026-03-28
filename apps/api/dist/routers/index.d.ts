export declare const appRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../trpc").TRPCContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    auth: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("../trpc").TRPCContext;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
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
    workspaces: import("@trpc/server").TRPCBuiltRouter<{
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
    workspaceMembers: import("@trpc/server").TRPCBuiltRouter<{
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
    teams: import("@trpc/server").TRPCBuiltRouter<{
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
                description: string | null;
                createdAt: Date;
            }[];
            meta: object;
        }>;
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
                description?: string | undefined;
            };
            output: {
                id: string;
                name: string;
                createdAt: Date;
                workspaceId: string;
                description: string | null;
            } | undefined;
            meta: object;
        }>;
        update: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                name?: string | undefined;
                description?: string | undefined;
            };
            output: {
                id: string;
                workspaceId: string;
                name: string;
                description: string | null;
                createdAt: Date;
            } | undefined;
            meta: object;
        }>;
    }>>;
    employees: import("@trpc/server").TRPCBuiltRouter<{
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
    facilities: import("@trpc/server").TRPCBuiltRouter<{
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
    zones: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("../trpc").TRPCContext;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
                areaHectares?: number | undefined;
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
                geoJson: unknown;
                areaHectares: string | null;
            } | undefined;
            meta: object;
        }>;
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                id: string;
                workspaceId: string;
                name: string;
                geoJson: unknown;
                areaHectares: string | null;
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
                geoJson: unknown;
                areaHectares: string | null;
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
                geoJson: unknown;
                areaHectares: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            } | undefined;
            meta: object;
        }>;
    }>>;
    pens: import("@trpc/server").TRPCBuiltRouter<{
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
    verticals: import("@trpc/server").TRPCBuiltRouter<{
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
}>>;
export type AppRouter = typeof appRouter;
//# sourceMappingURL=index.d.ts.map