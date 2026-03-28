import type { FastifyRequest } from 'fastify';
import { db } from '@biffco/db';
import { VerticalRegistry } from '@biffco/core/vertical-engine';
import type { WorkspaceId, WorkspaceMemberId } from '@biffco/shared';
export interface TRPCContext {
    readonly workspaceId: WorkspaceId | null;
    readonly memberId: WorkspaceMemberId | null;
    readonly memberPermissions: readonly string[];
    readonly jti: string | null;
    readonly db: typeof db;
    readonly verticalRegistry: typeof VerticalRegistry;
    readonly request: FastifyRequest;
}
export declare function createContext({ req }: {
    req: FastifyRequest;
}): Promise<TRPCContext>;
export declare const router: import("@trpc/server").TRPCRouterBuilder<{
    ctx: TRPCContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}>;
export declare const publicProcedure: import("@trpc/server").TRPCProcedureBuilder<TRPCContext, object, object, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
export declare const protectedProcedure: import("@trpc/server").TRPCProcedureBuilder<TRPCContext, object, {
    workspaceId: WorkspaceId;
    memberId: WorkspaceMemberId;
    jti: string | null;
    db: import("drizzle-orm/postgres-js").PostgresJsDatabase<typeof import("@biffco/db/schema")> & {
        $client: import("postgres").Sql<{}>;
    };
    verticalRegistry: {
        plugins: Map<string, import("@biffco/core/vertical-engine").VerticalPack>;
        register(pack: import("@biffco/core/vertical-engine").VerticalPack): void;
        get(id: string): import("@biffco/core/vertical-engine").VerticalPack | undefined;
        listPacks(): import("@biffco/core/vertical-engine").VerticalPack[];
    };
    request: FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
    memberPermissions: readonly string[];
}, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
export declare const requirePermission: (permission: string) => import("@trpc/server").TRPCProcedureBuilder<TRPCContext, object, {
    workspaceId: WorkspaceId;
    memberId: WorkspaceMemberId;
    jti: string | null;
    db: import("drizzle-orm/postgres-js").PostgresJsDatabase<typeof import("@biffco/db/schema")> & {
        $client: import("postgres").Sql<{}>;
    };
    verticalRegistry: {
        plugins: Map<string, import("@biffco/core/vertical-engine").VerticalPack>;
        register(pack: import("@biffco/core/vertical-engine").VerticalPack): void;
        get(id: string): import("@biffco/core/vertical-engine").VerticalPack | undefined;
        listPacks(): import("@biffco/core/vertical-engine").VerticalPack[];
    };
    request: FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
    memberPermissions: readonly string[];
}, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
//# sourceMappingURL=trpc.d.ts.map