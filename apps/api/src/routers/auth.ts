import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createId } from '@paralleldrive/cuid2'
import { router, publicProcedure, protectedProcedure } from '../trpc'
import { workspaces, workspaceMembers, persons, credentials } from '@biffco/db/schema'
import { eq } from 'drizzle-orm'

export const authRouter = router({
  register: publicProcedure
    .input(z.object({
      workspaceName: z.string().min(2).max(100),
      workspaceSlug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/),
      country: z.string().length(2),
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
      
      // 3. Verificar que el slug no está tomado
      const existing = await db.select()
        .from(workspaces)
        .where(eq(workspaces.slug, input.workspaceSlug))
        .limit(1)

      if (existing.length > 0) {
        throw new TRPCError({ code: "CONFLICT", message: "El slug ya está en uso" })
      }

      // Check if person email already exists
      const existingPerson = await db.select()
        .from(persons)
        .where(eq(persons.email, input.email))
        .limit(1)
        
      if (existingPerson.length > 0) {
        throw new TRPCError({ code: "CONFLICT", message: "El correo electrónico ya está registrado" })
      }

      const workspaceId = createId()
      const personId = createId()
      const memberId = createId()
      const credentialId = createId()

      try {
        await db.transaction(async (tx) => {
          // 4. Create Person
          await tx.insert(persons).values({
            id: personId,
            name: input.personName,
            email: input.email,
          })
          
          // 5. Create Credentials
          await tx.insert(credentials).values({
            id: credentialId,
            personId,
            passwordHash: input.passwordHash,
          })

          // 6. Create Workspace
          await tx.insert(workspaces).values({
            id: workspaceId,
            name: input.workspaceName,
            slug: input.workspaceSlug,
            verticalId: input.verticalId,
            plan: "free",
            settings: { country: input.country },
          })

          // 7. Create WorkspaceMember
          await tx.insert(workspaceMembers).values({
            id: memberId,
            workspaceId,
            personId,
            publicKey: input.publicKey, 
            roles: input.initialRoles,
            status: "active",
            acceptedAt: new Date(),
          })
        })
      } catch (err: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `DB_ERR: ${err?.message || 'unknown'} | Code: ${err?.code || err?.routine} | Detail: ${err?.detail}`
        })
      }

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

  // ─── LOGIN & LOGOUT ───────────────────────────────────────────
  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      passwordHash: z.string().min(64),
    }))
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx

      // 1. Encontrar la persona
      const personArr = await db.select().from(persons).where(eq(persons.email, input.email)).limit(1)
      const person = personArr[0]
      if (!person) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Credenciales inválidas" })
      }

      // 2. Verificar el hash del password
      const credArr = await db.select().from(credentials).where(eq(credentials.personId, person.id)).limit(1)
      const cred = credArr[0]
      if (!cred || cred.passwordHash !== input.passwordHash) {
        // Zero-Knowledge Proof: Comprobamos el hash enviado cliente vs hash guardado servidor
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Credenciales inválidas" })
      }

      // 3. Obtener el workspace primario del usuario
      const memberArr = await db.select().from(workspaceMembers).where(eq(workspaceMembers.personId, person.id)).limit(1)
      const member = memberArr[0]
      if (!member) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Usuario sin espacios de trabajo activos" })
      }

      // 4. Generar Tokens
      const workspaceId = member.workspaceId
      const memberId = member.id
      
      const accessToken = await ctx.request.server.jwt.sign({
        workspaceId,
        memberId,
        permissions: member.roles, // Asumiendo que roles dicta sus permisos por ahora
        wsIdx: 0,
      }, { expiresIn: "15m" })

      const refreshToken = await ctx.request.server.jwt.sign({
        memberId,
        type: "refresh",
      }, { expiresIn: "30d" })

      return { accessToken, refreshToken, workspaceId, memberId, personName: person.name }
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
