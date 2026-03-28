"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePermission = exports.protectedProcedure = exports.publicProcedure = exports.router = void 0;
exports.createContext = createContext;
const server_1 = require("@trpc/server");
const db_1 = require("@biffco/db");
const vertical_engine_1 = require("@biffco/core/vertical-engine");
const redis_1 = require("./redis");
// ─── Crear el contexto desde el request de Fastify ──────────────
async function createContext({ req }) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return { workspaceId: null, memberId: null, memberPermissions: [], jti: null, db: db_1.db, verticalRegistry: vertical_engine_1.VerticalRegistry, request: req };
    }
    const token = authHeader.slice(7);
    try {
        const payload = await req.server.jwt.verify(token);
        if (payload.jti) {
            const isRevoked = await redis_1.redis.get(`revoked:${payload.jti}`);
            if (isRevoked) {
                throw new Error("Token revoked");
            }
        }
        // Activar RLS para este request
        // Usamos execute() para inyectar este local session parameter.
        // Esto es vital para el aislamiento multi-tenant a nivel de PostgreSQL.
        await db_1.db.execute(`SET app.current_workspace = '${payload.workspaceId}'`);
        return {
            workspaceId: payload.workspaceId,
            memberId: payload.memberId,
            memberPermissions: payload.permissions,
            jti: payload.jti || null,
            db: db_1.db,
            verticalRegistry: vertical_engine_1.VerticalRegistry,
            request: req
        };
    }
    catch {
        return { workspaceId: null, memberId: null, memberPermissions: [], jti: null, db: db_1.db, verticalRegistry: vertical_engine_1.VerticalRegistry, request: req };
    }
}
const t = server_1.initTRPC.context().create();
// ─── Middlewares ─────────────────────────────────────────────────
exports.router = t.router;
exports.publicProcedure = t.procedure;
// Solo accesible con JWT válido
exports.protectedProcedure = t.procedure.use(({ ctx, next }) => {
    if (!ctx.workspaceId || !ctx.memberId) {
        throw new server_1.TRPCError({ code: "UNAUTHORIZED", message: "Sesión requerida" });
    }
    return next({ ctx: { ...ctx, workspaceId: ctx.workspaceId, memberId: ctx.memberId } });
});
// Require un permiso específico
const requirePermission = (permission) => exports.protectedProcedure.use(({ ctx, next }) => {
    if (!ctx.memberPermissions.includes(permission)) {
        throw new server_1.TRPCError({ code: "FORBIDDEN", message: `Permiso requerido: ${permission}` });
    }
    return next({ ctx });
});
exports.requirePermission = requirePermission;
//# sourceMappingURL=trpc.js.map