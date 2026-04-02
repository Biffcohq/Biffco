/* global Buffer, process, console */
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createId } from '@paralleldrive/cuid2'
import { router, publicProcedure, protectedProcedure } from '../trpc'
import { workspaces, workspaceMembers, persons, credentials } from '@biffco/db/schema'
import { eq } from '@biffco/db'
import { redis } from '../redis'
import { Permission } from '@biffco/core/rbac'
import crypto from 'crypto'

// Utilidades criptográficas nativas para prevenir el uso de BLAKE2b (Crítico C-03)
const SCRYPT_PARAMS = { N: 32768, r: 8, p: 1, maxmem: 34000000 };
const KEY_LEN = 32;

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, KEY_LEN, SCRYPT_PARAMS);
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

function verifyPassword(password: string, storedHashAndSalt: string): boolean {
  try {
    const [saltHex, hashHex] = storedHashAndSalt.split(':');
    if (!saltHex || !hashHex) return false;
    const salt = Buffer.from(saltHex, 'hex');
    const storedHash = Buffer.from(hashHex, 'hex');
    const computedHash = crypto.scryptSync(password, salt, KEY_LEN, SCRYPT_PARAMS);
    return crypto.timingSafeEqual(storedHash, computedHash);
  } catch {
    return false;
  }
}

// Función helper para inyectar Cookies seguras (Crítico C-05)
import type { FastifyReply } from 'fastify'
const setAuthCookies = (reply: FastifyReply, accessToken: string, refreshToken: string) => {
  const isProd = process.env.NODE_ENV === 'production';

  reply.setCookie('accessToken', accessToken, {
    httpOnly: true,
    secure: !isProd ? false : true,
    sameSite: 'lax',
    path: '/',
    ...(isProd ? { domain: '.biffco.co' } : {}),
    maxAge: 15 * 60 // 15 minutos
  })
  reply.setCookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: !isProd ? false : true,
    sameSite: 'lax',
    path: '/',
    ...(isProd ? { domain: '.biffco.co' } : {}),
    maxAge: 30 * 24 * 60 * 60 // 30 dias
  })
}

export const authRouter = router({
  checkEmail: publicProcedure
    .input(z.object({ email: z.string().email().toLowerCase() }))
    .query(async ({ input, ctx }) => {
      const { db } = ctx
      const existing = await db.select().from(persons).where(eq(persons.email, input.email)).limit(1)
      return { available: existing.length === 0 }
    }),

  checkSlug: publicProcedure
    .input(z.object({ slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/) }))
    .query(async ({ input, ctx }) => {
      const { db } = ctx
      const existing = await db.select().from(workspaces).where(eq(workspaces.slug, input.slug)).limit(1)
      return { available: existing.length === 0 }
    }),

  register: publicProcedure
    .input(z.object({
      workspaceName: z.string().min(2).max(100),
      workspaceSlug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/),
      country: z.string().length(2),
      verticalId: z.string().min(1),  
      initialRoles: z.array(z.string()).min(1),
      personName: z.string().min(2).max(100),
      email: z.string().email().toLowerCase(),
      password: z.string().min(8), // Recibe texto plano sobre HTTPS seguro (C-03)
      publicKey: z.string().min(64).max(130), // Ed25519 public key hex
      wsIdx: z.number().int().min(0),          
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, reply } = ctx
      
      const existing = await db.select()
        .from(workspaces)
        .where(eq(workspaces.slug, input.workspaceSlug))
        .limit(1)

      if (existing.length > 0) {
        throw new TRPCError({ code: "CONFLICT", message: "El slug ya está en uso" })
      }

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

      const securePasswordHash = hashPassword(input.password); // Aplicando Scrypt (C-03)

      try {
        await db.transaction(async (tx) => {
          await tx.insert(persons).values({
            id: personId,
            name: input.personName,
            email: input.email,
          })
          
          await tx.insert(credentials).values({
            id: credentialId,
            personId,
            passwordHash: securePasswordHash,
          })

          await tx.insert(workspaces).values({
            id: workspaceId,
            name: input.workspaceName,
            slug: input.workspaceSlug,
            verticalId: input.verticalId,
            plan: "free",
            settings: { country: input.country },
          })

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
      } catch (unknownErr: unknown) {
        // Enmascaramiento de errores reales de base de datos SQL (A-08)
        console.error(unknownErr);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error interno de escritura en base de datos. Por favor reintente.`
        })
      }

      const pack = ctx.verticalRegistry.get(input.verticalId)
      const finalPerms = new Set<string>(["events.read", "assets.read"])
      
      if (input.initialRoles.includes("admin")) {
        Object.values(Permission).forEach(p => finalPerms.add(p))
        if (pack) {
          pack.customPermissions.forEach(p => finalPerms.add(p))
        }
      }

      const accessToken = await ctx.request.server.jwt.sign({
        workspaceId,
        memberId,
        personName: input.personName,
        permissions: Array.from(finalPerms),
        wsIdx: input.wsIdx,
        jti: createId(),
      }, { expiresIn: "15m" })

      const refreshToken = await ctx.request.server.jwt.sign({
        memberId,
        type: "refresh",
        jti: createId(),
      }, { expiresIn: "30d" })

      setAuthCookies(reply, accessToken, refreshToken); // C-05

      return { success: true, workspaceId, memberId } // Ya no enviamos JWT en el body
    }),

  login: publicProcedure
    .input(z.object({
      email: z.string().email().toLowerCase(),
      password: z.string().min(1),
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, reply } = ctx

      const personArr = await db.select().from(persons).where(eq(persons.email, input.email)).limit(1)
      const person = personArr[0]
      if (!person) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Credenciales inválidas" })
      }

      const credArr = await db.select().from(credentials).where(eq(credentials.personId, person.id)).limit(1)
      const cred = credArr[0]
      
      // Validación real usando SCrypt en lugar de chequeo directo string != string (C-03)
      if (!cred || !verifyPassword(input.password, cred.passwordHash)) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Credenciales inválidas" })
      }

      const memberArr = await db.select().from(workspaceMembers).where(eq(workspaceMembers.personId, person.id)).limit(1)
      const member = memberArr[0]
      if (!member) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Usuario sin espacios de trabajo activos" })
      }

      const workspaceId = member.workspaceId
      const memberId = member.id
      
      const finalPerms = new Set<string>(["events.read", "assets.read"])
      if (member.roles.includes("admin")) {
        Object.values(Permission).forEach(p => finalPerms.add(p))
        const wsArr = await db.select().from(workspaces).where(eq(workspaces.id, member.workspaceId)).limit(1)
        if (wsArr[0]) {
           const pack = ctx.verticalRegistry.get(wsArr[0].verticalId)
           if (pack) pack.customPermissions.forEach(p => finalPerms.add(p))
        }
      }

      const accessToken = await ctx.request.server.jwt.sign({
        workspaceId,
        memberId,
        personName: person.name,
        permissions: Array.from(finalPerms),
        wsIdx: 0,
        jti: createId(),
      }, { expiresIn: "15m" })

      const refreshToken = await ctx.request.server.jwt.sign({
        memberId,
        type: "refresh",
        jti: createId(),
      }, { expiresIn: "30d" })

      setAuthCookies(reply, accessToken, refreshToken); // C-05

      return { success: true, workspaceId, memberId, personName: person.name }
    }),

  logout: protectedProcedure
    .mutation(async ({ ctx }) => {
      if (ctx.jti) {
        await redis.set(`revoked:${ctx.jti}`, "1", "EX", 900)
      }
      // Invalidar cookies client-side (C-05)
      ctx.reply.clearCookie('accessToken');
      ctx.reply.clearCookie('refreshToken');
      return { ok: true }
    }),

  me: protectedProcedure
    .query(async ({ ctx }) => {
      const { db } = ctx
      const data = await db.select({
        email: persons.email,
        name: persons.name,
        publicKey: workspaceMembers.publicKey
      })
      .from(workspaceMembers)
      .innerJoin(persons, eq(workspaceMembers.personId, persons.id))
      .where(eq(workspaceMembers.id, ctx.memberId!))
      .limit(1)

      return data[0] || null
    }),

  refresh: publicProcedure
    .mutation(async ({ ctx }) => {
      // Implementación Real de Refresh Token (Crítico C-06)
      const token = ctx.request.cookies?.refreshToken;
      if (!token) throw new TRPCError({ code: "UNAUTHORIZED", message: "No refresh token" });
      
      try {
        const payload = await ctx.request.server.jwt.verify<{
          memberId: string
          type: string
          jti?: string
        }>(token)

        if (payload.type !== "refresh") {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid token type" });
        }

        // Revisar revocación
        if (payload.jti) {
           const isRevoked = await redis.get(`revoked:${payload.jti}`)
           if (isRevoked) throw new TRPCError({ code: "UNAUTHORIZED", message: "Token revoked" });
        }

        const { db } = ctx;
        // Regenerar el contexto
        const memberArr = await db.select().from(workspaceMembers).where(eq(workspaceMembers.id, payload.memberId)).limit(1)
        const member = memberArr[0]
        if (!member) throw new TRPCError({ code: "UNAUTHORIZED", message: "Member invalid" });

        const workspaceId = member.workspaceId;
        const personArr = await db.select().from(persons).where(eq(persons.id, member.personId)).limit(1)
        const finalPerms = new Set<string>(["events.read", "assets.read"])
        if (member.roles.includes("admin")) {
          Object.values(Permission).forEach(p => finalPerms.add(p))
        }

        const personName = personArr[0]?.name || "Usuario";

        const accessToken = await ctx.request.server.jwt.sign({
          workspaceId,
          memberId: payload.memberId,
          personName,
          permissions: Array.from(finalPerms),
          wsIdx: 0,
          jti: createId(),
        }, { expiresIn: "15m" })

        const isProd = process.env.NODE_ENV === 'production';
        ctx.reply.setCookie('accessToken', accessToken, {
          httpOnly: true,
          secure: !isProd ? false : true,
          sameSite: 'lax',
          path: '/',
          ...(isProd ? { domain: '.biffco.co' } : {}),
          maxAge: 15 * 60
        })

        return { success: true, workspaceId, memberId: payload.memberId, personName }
      } catch (err: unknown) {
        console.error(err);
        ctx.reply.clearCookie('accessToken');
        ctx.reply.clearCookie('refreshToken');
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid refresh payload" });
      }
    }),
})
