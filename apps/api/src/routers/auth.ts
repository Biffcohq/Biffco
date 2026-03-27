import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createId } from '@paralleldrive/cuid2'
import { router, publicProcedure, protectedProcedure } from '../trpc'
import { workspaces, workspaceMembers } from '@biffco/db/schema'
import { eq } from 'drizzle-orm'


export const authRouter = router({
  // ─── REGISTER ─────────────────────────────────────────────────
  // El signup se completa en 8 pasos en el frontend.
  // Este endpoint procesa el último paso cuando el usuario confirma el mnemonic.
  // La clave PÚBLICA se envía aquí — la privada NUNCA llega al servidor.
  register: publicProcedure
    .input(z.object({
      workspaceName: z.string().min(2).max(100),
      workspaceSlug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/),
      verticalId: z.string().min(1),  
      initialRoles: z.array(z.string()).min(1),
      personName: z.string().min(2).max(100),
      email: z.string().email(),
      passwordHash: z.string().min(64), // Hash Argon2id del password
      publicKey: z.string().min(64).max(130), // Ed25519 public key hex
      wsIdx: z.number().int().min(0),          
    }))
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx
      
      // NOTA MOCK FASE A.1: Aún no cargamos verticals reales,
      // Usaremos validaciones de MOCK.

      // 3. Verificar que el slug no está tomado
      const existing = await db.select()
        .from(workspaces)
        .where(eq(workspaces.slug, input.workspaceSlug))
        .limit(1)

      if (existing.length > 0) {
        throw new TRPCError({ code: "CONFLICT", message: "El slug ya está en uso" })
      }

      // 4. Crear el Workspace
      const workspaceId = createId()
      await db.insert(workspaces).values({
        id: workspaceId,
        name: input.workspaceName,
        slug: input.workspaceSlug,
        verticalId: input.verticalId,
        plan: "free",
        settings: {},
      })

      // 5. Crear el WorkspaceMember con la clave PÚBLICA (Aquí muere el conocimiento de PrivateKeys)
      const memberId = createId()
      const personId = createId() // Mock for person reference
      await db.insert(workspaceMembers).values({
        id: memberId,
        workspaceId,
        personId,
        publicKey: input.publicKey, 
        roles: input.initialRoles,
        status: "active",
        acceptedAt: new Date(),
      })

      // 6. Generar el JWT
      const accessToken = await ctx.request.server.jwt.sign({
        workspaceId,
        memberId,
        permissions: ["assets.read", "events.append"], // Mocks por ahora
        wsIdx: input.wsIdx,
      }, { expiresIn: "15m" })

      const refreshToken = await ctx.request.server.jwt.sign({
        memberId,
        type: "refresh",
      }, { expiresIn: "30d" })

      return { accessToken, refreshToken, workspaceId, memberId }
    }),

  // ─── LOGIN & LOGOUT MOCKS FASE A.2 ────────────────────────────
  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      passwordHash: z.string().min(64),
      workspaceSlug: z.string(),
    }))
    .mutation(async () => {
      // Mock login until fully baked in B.1
      return { accessToken: "mock_jwt", refreshToken: "mock_refresh" }
    }),

  logout: protectedProcedure
    .mutation(async () => {
      return { ok: true }
    }),

  refresh: publicProcedure
    .input(z.object({ refreshToken: z.string() }))
    .mutation(async () => {
      return { accessToken: "refreshed_mock" }
    }),
})
