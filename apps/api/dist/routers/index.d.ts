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
        acceptInvite: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                publicKey: string;
                wsIdx: number;
                inviteToken: string;
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
            };
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
        delete: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
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
        addMember: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                teamId: string;
                memberId: string;
            };
            output: {
                id: string;
                createdAt: Date;
                teamId: string;
                memberId: string;
            } | undefined;
            meta: object;
        }>;
        removeMember: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                teamId: string;
                memberId: string;
            };
            output: {
                id: string;
                createdAt: Date;
                teamId: string;
                memberId: string;
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
                memberId: string | null;
                role: string;
                dni: string | null;
                supervisorId: string | null;
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
                memberId: string | null;
                role: string;
                dni: string | null;
                supervisorId: string | null;
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
    zones: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("../trpc").TRPCContext;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
                type: string;
                facilityId: string;
                capacity?: number | undefined;
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
                facilityId: string;
                capacity: string | null;
                polygon: unknown;
                gfwStatus: string;
            } | undefined;
            meta: object;
        }>;
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                id: string;
                facilityId: string;
                workspaceId: string;
                name: string;
                type: string;
                capacity: string | null;
                polygon: unknown;
                gfwStatus: string;
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
                facilityId: string;
                capacity: string | null;
                polygon: unknown;
                gfwStatus: string;
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
                facilityId: string;
                workspaceId: string;
                name: string;
                type: string;
                capacity: string | null;
                polygon: unknown;
                gfwStatus: string;
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