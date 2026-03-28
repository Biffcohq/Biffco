import { z } from 'zod'
import { router, protectedProcedure, requirePermission } from '../trpc'
import { teams } from '@biffco/db/schema'
import { eq } from 'drizzle-orm'
import { Permission } from '@biffco/core/rbac'

export const teamsRouter = router({
  list: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.select().from(teams).where(eq(teams.workspaceId, ctx.workspaceId!))
    }),

  create: requirePermission(Permission.ORG_MANAGE)
    .input(z.object({
      name: z.string().min(2).max(100),
      description: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const [newTeam] = await ctx.db.insert(teams).values({
        workspaceId: ctx.workspaceId!,
        name: input.name,
        description: input.description,
      }).returning()
      
      return newTeam
    }),

  update: requirePermission(Permission.ORG_MANAGE)
    .input(z.object({
      id: z.string(),
      name: z.string().min(2).max(100).optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { id, ...updates } = input
      const [updated] = await ctx.db.update(teams)
        .set(updates)
        .where(eq(teams.id, id))
        .returning()
      
      return updated
    }),
})
