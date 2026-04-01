export declare const assetGroupsRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../trpc").TRPCContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    /**
     * getWithAssets
     * Lista en forma retrospectiva todos los grupos del workspace con la cantidad actual
     * de activos que pertenecen a cada uno.
     */
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
    /**
     * create
     * Crea un nuevo AssetGroup lógico ("Lote", "Corral", "Embarque") y asigna un label.
     */
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
    /**
     * addAssets
     * Vincular un grupo de Assets individuales a un AssetGroup específico.
     * Esto asume que todos los assets pertenecen al mismo workspace
     */
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
    /**
     * dissolve
     * Marca el grupo como disuelto (isActive=false) y remueve el groupId de sus assets,
     * permitiendo que los activos vuelvan a ser tratados puramente de forma individual,
     * manteniendo el rastro histórico a traves de los eventos.
     */
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
//# sourceMappingURL=assetGroups.d.ts.map