import type { FastifyRequest } from 'fastify';
import { db } from '@biffco/db';
import { verticalRegistry } from '@biffco/core/vertical-engine';
import type { WorkspaceId, WorkspaceMemberId } from '@biffco/shared';
export interface TRPCContext {
    readonly workspaceId: WorkspaceId | null;
    readonly memberId: WorkspaceMemberId | null;
    readonly memberPermissions: readonly string[];
    readonly jti: string | null;
    readonly db: typeof db;
    readonly verticalRegistry: typeof verticalRegistry;
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
    db: import("drizzle-orm/postgres-js").PostgresJsDatabase<typeof import("@biffco/db/schema")> & {
        $client: import("postgres").Sql<{}>;
    };
    jti: string | null;
    verticalRegistry: import("@biffco/core/vertical-engine").VerticalRegistry;
    request: FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
    memberPermissions: readonly string[];
}, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
export declare const requirePermission: (permission: string) => import("@trpc/server").TRPCProcedureBuilder<TRPCContext, object, {
    workspaceId: WorkspaceId;
    memberId: WorkspaceMemberId;
    db: import("drizzle-orm/postgres-js").PostgresJsDatabase<typeof import("@biffco/db/schema")> & {
        $client: import("postgres").Sql<{}>;
    };
    jti: string | null;
    verticalRegistry: import("@biffco/core/vertical-engine").VerticalRegistry;
    request: FastifyRequest<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown, import("fastify").FastifyBaseLogger, import("fastify/types/type-provider").ResolveFastifyRequestType<import("fastify").FastifyTypeProviderDefault, import("fastify").FastifySchema, import("fastify").RouteGenericInterface>>;
    memberPermissions: readonly string[];
}, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
//# sourceMappingURL=trpc.d.ts.map