import { initTRPC, TRPCError } from '@trpc/server'
import type { FastifyRequest, FastifyReply } from 'fastify'
import { db } from '@biffco/db'
import { sql } from 'drizzle-orm'
import { verticalRegistry } from '@biffco/core/vertical-engine'
import type { WorkspaceId, WorkspaceMemberId } from '@biffco/shared'
import { redis } from './redis'

export interface TRPCContext {
  readonly workspaceId: WorkspaceId | null
  readonly memberId: WorkspaceMemberId | null
  readonly memberPermissions: readonly string[]
  readonly jti: string | null
  readonly db: typeof db
  readonly verticalRegistry: typeof verticalRegistry
  readonly request: FastifyRequest
  readonly reply: FastifyReply
}

// ─── Crear el contexto desde el request de Fastify ──────────────
export async function createContext({ req, res }: { req: FastifyRequest; res: FastifyReply }): Promise<TRPCContext> {
  // C-05: Leer el JWT de la cookie HttpOnly instead of Header
  const token = req.cookies?.accessToken

  if (!token) {
    return { workspaceId: null, memberId: null, memberPermissions: [], jti: null, db, verticalRegistry, request: req, reply: res }
  }

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

    // C-01: Activar RLS con mitigación de inyección SQL usando consulta tipada a set_config
    await db.execute(sql`SELECT set_config('app.current_workspace', ${payload.workspaceId}, true)`)

    return {
      workspaceId: payload.workspaceId as WorkspaceId,
      memberId: payload.memberId as WorkspaceMemberId,
      memberPermissions: payload.permissions,
      jti: payload.jti || null,
      db,
      verticalRegistry,
      request: req,
      reply: res
    }
  } catch {
    return { workspaceId: null, memberId: null, memberPermissions: [], jti: null, db, verticalRegistry, request: req, reply: res }
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
