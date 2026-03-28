import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, protectedProcedure, requirePermission } from '../trpc'
import { workspaceMembers } from '@biffco/db/schema'
import { eq } from 'drizzle-orm'
import { Permission } from '@biffco/core/rbac'
import { createId } from '@paralleldrive/cuid2'

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
      // Crear un member "pending" sin public key por ahora
      // Se reemplaza la publicKey con empty y status=invited
      const [newMember] = await ctx.db.insert(workspaceMembers).values({
        workspaceId: ctx.workspaceId!,
        personId: createId(), // Mock person ID for uninvited
        publicKey: "",
        roles: input.roles,
        status: "invited",
        invitedAt: new Date(),
      }).returning()
      
      return newMember
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
