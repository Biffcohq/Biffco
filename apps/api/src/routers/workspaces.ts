import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, protectedProcedure, requirePermission } from '../trpc'
import { workspaces } from '@biffco/db/schema'
import { eq } from 'drizzle-orm'
import { Permission } from '@biffco/core/rbac'

export const workspacesRouter = router({
  getProfile: protectedProcedure
    .query(async ({ ctx }) => {
      const workspace = await ctx.db.query.workspaces.findFirst({
        where: eq(workspaces.id, ctx.workspaceId!),
      })
      if (!workspace) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Workspace not found" })
      }
      return workspace
    }),

  updateProfile: requirePermission(Permission.ORG_MANAGE)
    .input(z.object({
      name: z.string().min(2).max(100).optional(),
      slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/).optional(),
      settings: z.record(z.unknown()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const [updated] = await ctx.db.update(workspaces)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(eq(workspaces.id, ctx.workspaceId!))
        .returning()
      
      return updated
    }),
})
