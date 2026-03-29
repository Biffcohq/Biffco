import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, protectedProcedure, publicProcedure, requirePermission } from '../trpc'
import { workspaceMembers, workspaces } from '@biffco/db/schema'
import { eq } from '@biffco/db'
import { Permission } from '@biffco/core/rbac'
import { createId } from '@paralleldrive/cuid2'
import { redis } from '../redis'
import { sendEmail, InvitationEmail, WelcomeEmail } from '@biffco/email'
import { env } from '@biffco/config'

export const workspaceMembersRouter = router({
  list: protectedProcedure
    .query(async ({ ctx }) => {
      // Middleware RLS ensures we only fetch for the current workspace
      return ctx.db.select().from(workspaceMembers).where(eq(workspaceMembers.workspaceId, ctx.workspaceId!))
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const member = await ctx.db.query.workspaceMembers.findFirst({
        where: eq(workspaceMembers.id, input.id),
      })
      if (!member) throw new TRPCError({ code: "NOT_FOUND" })
      return member
    }),

  invite: requirePermission(Permission.MEMBERS_INVITE)
    .input(z.object({
      email: z.string().email(),
      roles: z.array(z.string()).min(1),
    }))
    .mutation(async ({ input, ctx }) => {
      // 1. Obtener información del workspace actual
      const workspace = await ctx.db.query.workspaces.findFirst({
        where: eq(workspaces.id, ctx.workspaceId!)
      })
      if (!workspace) throw new TRPCError({ code: "NOT_FOUND" })

      // 2. Crear un member "pending" sin public key por ahora
      const [newMember] = await ctx.db.insert(workspaceMembers).values({
        workspaceId: ctx.workspaceId!,
        personId: createId(), // Mock person ID for uninvited
        publicKey: "",
        roles: input.roles,
        status: "invited",
        invitedAt: new Date(),
      }).returning()
      
      // 3. Generar token y guardarlo en Redis con TTL de 72h
      const inviteToken = createId()
      const inviteData = {
        workspaceId: ctx.workspaceId!,
        memberId: newMember!.id,
        email: input.email
      }
      await redis.set(`INVITE:${inviteToken}`, JSON.stringify(inviteData), 'EX', 72 * 60 * 60)
      
      // 4. Enviar email de invitación
      const acceptUrl = `${env.PLATFORM_URL ?? 'http://localhost:3000'}/invite/accept?token=${inviteToken}`
      const verticalLabel = workspace.verticalId === 'livestock' ? 'Ganadería' : 'Minería'
      
      await sendEmail({
        to: input.email,
        subject: `Invitación a ${workspace.name}`,
        component: InvitationEmail,
        props: {
          workspaceName: workspace.name,
          inviterName: 'Un administrador', // Podríamos buscar el nombre del llamador
          verticalLabel,
          acceptUrl
        }
      })
      
      return newMember
    }),

  acceptInvite: publicProcedure
    .input(z.object({
      inviteToken: z.string(),
      publicKey: z.string().min(64),
      wsIdx: z.number().int().min(0),
    }))
    .mutation(async ({ input, ctx }) => {
      // 1. Validar token
      const inviteDataStr = await redis.get(`INVITE:${input.inviteToken}`)
      if (!inviteDataStr) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Token de invitación inválido o expirado." })
      }
      const inviteData = JSON.parse(inviteDataStr) as { workspaceId: string, memberId: string, email: string }
      
      // 2. Marcar como activo y asentar clave pública
      const [updated] = await ctx.db.update(workspaceMembers)
        .set({ status: "active", publicKey: input.publicKey, acceptedAt: new Date() })
        .where(eq(workspaceMembers.id, inviteData.memberId))
        .returning()
        
      if (!updated) throw new TRPCError({ code: "NOT_FOUND", message: "Miembro no encontrado" })

      // 3. Destruir token
      await redis.del(`INVITE:${input.inviteToken}`)
      
      // 4. Obtener nombre del workspace para el email de bienvenida
      const workspace = await ctx.db.query.workspaces.findFirst({
        where: eq(workspaces.id, inviteData.workspaceId)
      })

      // 5. Email de bienvenida
      if (workspace) {
        await sendEmail({
          to: inviteData.email,
          subject: `Bienvenido a ${workspace.name}`,
          component: WelcomeEmail,
          props: {
            workspaceName: workspace.name,
            memberName: 'Miembro',
            verticalLabel: workspace.verticalId === 'livestock' ? 'Ganadería' : 'Minería',
            dashboardUrl: env.PLATFORM_URL ?? 'http://localhost:3000',
            firstSteps: ['Configurá tu cuenta', 'Revisá los activos', 'Invitá a tu equipo']
          }
        })
      }
      
      // NOTA: Para obtener un JWT de sesión, el cliente o bien se loguea 
      // o le disparamos un token nuevo (pero el auth router suele encargarse).
      
      // Devolvemos el miembro activado.
      return updated
    }),

  revoke: requirePermission(Permission.MEMBERS_REVOKE)
    .input(z.object({ memberId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (input.memberId === ctx.memberId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot revoke yourself" })
      }
      const [revoked] = await ctx.db.update(workspaceMembers)
        .set({ status: "revoked", revokedAt: new Date() })
        .where(eq(workspaceMembers.id, input.memberId))
        .returning()
      
      return revoked
    }),
})
