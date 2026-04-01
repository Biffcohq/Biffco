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
                memberIds: string[];
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
    assets: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("../trpc").TRPCContext;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                status?: string | undefined;
                type?: string | undefined;
                limit?: number | undefined;
                cursor?: string | null | undefined;
            } | undefined;
            output: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                verticalId: string;
                workspaceId: string;
                status: string;
                metadata: unknown;
                groupId: string | null;
                type: string;
                locationId: string | null;
                parentIds: string[];
            }[];
            meta: object;
        }>;
        getById: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: {
                events: {
                    id: string;
                    data: unknown;
                    createdAt: Date;
                    workspaceId: string;
                    hash: string;
                    globalId: number;
                    streamId: string;
                    streamType: string;
                    eventType: string;
                    previousHash: string | null;
                    signature: string | null;
                    signerId: string | null;
                }[];
                holds: {
                    id: string;
                    createdAt: Date;
                    isActive: boolean;
                    workspaceId: string;
                    assetId: string;
                    reason: string;
                    issuerId: string;
                    releasedAt: Date | null;
                }[];
                id: string;
                createdAt: Date;
                updatedAt: Date;
                verticalId: string;
                workspaceId: string;
                status: string;
                metadata: unknown;
                groupId: string | null;
                type: string;
                locationId: string | null;
                parentIds: string[];
            };
            meta: object;
        }>;
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                type: string;
                initialState: Record<string, unknown>;
                facilityId?: string | undefined;
                externalId?: string | undefined;
                penId?: string | undefined;
            };
            output: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                verticalId: string;
                workspaceId: string;
                status: string;
                metadata: unknown;
                groupId: string | null;
                type: string;
                locationId: string | null;
                parentIds: string[];
            } | undefined;
            meta: object;
        }>;
    }>>;
    assetGroups: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("../trpc").TRPCContext;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        getWithAssets: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                verticalId?: string | undefined;
            };
            output: {
                assets: {
                    id: string;
                    groupId: string | null;
                    status: string;
                }[];
                totalActive: number;
                id: string;
                workspaceId: string;
                verticalId: string;
                name: string;
                quantity: number;
                isActive: boolean;
                metadata: unknown;
                createdAt: Date;
                updatedAt: Date;
            }[];
            meta: object;
        }>;
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
                verticalId?: string | undefined;
                metadata?: Record<string, any> | undefined;
                initialQuantity?: number | undefined;
            };
            output: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                verticalId: string;
                isActive: boolean;
                workspaceId: string;
                quantity: number;
                metadata: unknown;
            } | undefined;
            meta: object;
        }>;
        addAssets: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                groupId: string;
                assetIds: string[];
            };
            output: {
                success: boolean;
                count: number;
            };
            meta: object;
        }>;
        dissolve: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                success: boolean;
                dissolvedGroup: string;
            };
            meta: object;
        }>;
    }>>;
    split: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("../trpc").TRPCContext;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        createSplit: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                inputAssetId: string;
                outputAllocations: {
                    quantity?: number | undefined;
                    metadata?: Record<string, unknown> | undefined;
                }[];
            };
            output: {
                success: boolean;
                parent: string;
                childrenCount: number;
                holdsInherited: number;
            };
            meta: object;
        }>;
    }>>;
    merge: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("../trpc").TRPCContext;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        createMerge: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                inputAssetIds: string[];
                outputType: string;
                outputMetadata?: Record<string, unknown> | undefined;
            };
            output: {
                success: boolean;
                childId: string;
                consumedCount: number;
                holdsInherited: number;
            };
            meta: object;
        }>;
    }>>;
    holds: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("../trpc").TRPCContext;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                id: string;
                createdAt: Date;
                isActive: boolean;
                workspaceId: string;
                assetId: string;
                reason: string;
                issuerId: string;
                releasedAt: Date | null;
            }[];
            meta: object;
        }>;
        impose: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                assetId: string;
                reason: string;
            };
            output: {
                id: string;
                createdAt: Date;
                isActive: boolean;
                workspaceId: string;
                assetId: string;
                reason: string;
                issuerId: string;
                releasedAt: Date | null;
            };
            meta: object;
        }>;
        lift: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                holdId: string;
                reason?: string | undefined;
            };
            output: {
                success: boolean;
                remainedInQuarantine: boolean;
            };
            meta: object;
        }>;
    }>>;
    upload: import("@trpc/server").TRPCBuiltRouter<{
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
    verify: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("../trpc").TRPCContext;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        getAssetById: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: {
                events: {
                    globalId: number;
                    id: string;
                    workspaceId: string;
                    streamId: string;
                    streamType: string;
                    eventType: string;
                    data: unknown;
                    hash: string;
                    previousHash: string | null;
                    signature: string | null;
                    signerId: string | null;
                    createdAt: Date;
                }[];
                holds: {
                    id: string;
                    assetId: string;
                    workspaceId: string;
                    reason: string;
                    isActive: boolean;
                    issuerId: string;
                    createdAt: Date;
                    releasedAt: Date | null;
                }[];
                anchor: null;
                id: string;
                workspaceId: string;
                groupId: string | null;
                verticalId: string;
                type: string;
                status: string;
                locationId: string | null;
                metadata: unknown;
                parentIds: string[];
                createdAt: Date;
                updatedAt: Date;
            };
            meta: object;
        }>;
    }>>;
    events: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("../trpc").TRPCContext;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                streamId?: string | undefined;
                eventType?: string | undefined;
                limit?: number | undefined;
                cursor?: string | null | undefined;
            } | undefined;
            output: {
                id: string;
                data: unknown;
                createdAt: Date;
                workspaceId: string;
                hash: string;
                globalId: number;
                streamId: string;
                streamType: string;
                eventType: string;
                previousHash: string | null;
                signature: string | null;
                signerId: string | null;
            }[];
            meta: object;
        }>;
        append: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                hash: string;
                streamId: string;
                eventType: string;
                payload: Record<string, unknown>;
                publicKey?: string | undefined;
                streamType?: "asset" | "asset_group" | undefined;
                previousHash?: string | undefined;
                signature?: string | undefined;
            };
            output: {
                id: string;
                data: unknown;
                createdAt: Date;
                workspaceId: string;
                hash: string;
                globalId: number;
                streamId: string;
                streamType: string;
                eventType: string;
                previousHash: string | null;
                signature: string | null;
                signerId: string | null;
            } | undefined;
            meta: object;
        }>;
        batch: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                eventType: string;
                payload: Record<string, unknown>;
                streamIds: string[];
                correlationId?: string | undefined;
            };
            output: {
                success: boolean;
                processed: number;
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