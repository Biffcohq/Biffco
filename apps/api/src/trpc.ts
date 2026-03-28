import { initTRPC, TRPCError } from '@trpc/server'
import type { FastifyRequest } from 'fastify'
import { db } from '@biffco/db'
import { VerticalRegistry } from '@biffco/core/vertical-engine'
import type { WorkspaceId, WorkspaceMemberId } from '@biffco/shared'
import { redis } from './redis'

export interface TRPCContext {
  readonly workspaceId: WorkspaceId | null
  readonly memberId: WorkspaceMemberId | null
  readonly memberPermissions: readonly string[]
  readonly jti: string | null
  readonly db: typeof db
  readonly verticalRegistry: typeof VerticalRegistry
  readonly request: FastifyRequest
}

// ─── Crear el contexto desde el request de Fastify ──────────────
export async function createContext({ req }: { req: FastifyRequest }): Promise<TRPCContext> {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith("Bearer ")) {
    return { workspaceId: null, memberId: null, memberPermissions: [], jti: null, db, verticalRegistry: VerticalRegistry, request: req }
  }

  const token = authHeader.slice(7)

  try {
    const payload = await req.server.jwt.verify<{
      workspaceId: string
      memberId: string
      permissions: string[]
      jti?: string
    }>(token)

    if (payload.jti) {
      const isRevoked = await redis.get(`revoked:${payload.jti}`)
      if (isRevoked) {
        throw new Error("Token revoked")
      }
    }

    // Activar RLS para este request
    // Usamos execute() para inyectar este local session parameter.
    // Esto es vital para el aislamiento multi-tenant a nivel de PostgreSQL.
    await db.execute(`SET app.current_workspace = '${payload.workspaceId}'`)

    return {
      workspaceId: payload.workspaceId as WorkspaceId,
      memberId: payload.memberId as WorkspaceMemberId,
      memberPermissions: payload.permissions,
      jti: payload.jti || null,
      db,
      verticalRegistry: VerticalRegistry,
      request: req
    }
  } catch {
    return { workspaceId: null, memberId: null, memberPermissions: [], jti: null, db, verticalRegistry: VerticalRegistry, request: req }
  }
}

const t = initTRPC.context<TRPCContext>().create()

// ─── Middlewares ─────────────────────────────────────────────────
export const router = t.router
export const publicProcedure = t.procedure

// Solo accesible con JWT válido
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.workspaceId || !ctx.memberId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Sesión requerida" })
  }
  return next({ ctx: { ...ctx, workspaceId: ctx.workspaceId, memberId: ctx.memberId } })
})

// Require un permiso específico
export const requirePermission = (permission: string) =>
  protectedProcedure.use(({ ctx, next }) => {
    if (!ctx.memberPermissions.includes(permission)) {
      throw new TRPCError({ code: "FORBIDDEN", message: `Permiso requerido: ${permission}` })
    }
    return next({ ctx })
  })
