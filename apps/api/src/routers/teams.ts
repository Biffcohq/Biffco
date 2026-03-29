import { z } from 'zod'
import { router, protectedProcedure, requirePermission } from '../trpc'
import { teams, teamMembers } from '@biffco/db/schema'
import { eq, and } from '@biffco/db'
import { Permission } from '@biffco/core/rbac'

export const teamsRouter = router({
  list: protectedProcedure
    .query(async ({ ctx }) => {
      // Returns all teams with an array of their member IDs.
      const allTeams = await ctx.db.select().from(teams).where(eq(teams.workspaceId, ctx.workspaceId!))
      const allMembers = await ctx.db.select().from(teamMembers)
      // Group members by teamId
      return allTeams.map(t => ({
        ...t,
        memberIds: allMembers.filter(m => m.teamId === t.id).map(m => m.memberId)
      }))
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

  delete: requirePermission(Permission.ORG_MANAGE)
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const [deleted] = await ctx.db.delete(teams)
        .where(and(eq(teams.id, input.id), eq(teams.workspaceId, ctx.workspaceId!)))
        .returning()
      return deleted
    }),

  addMember: requirePermission(Permission.ORG_MANAGE)
    .input(z.object({
      teamId: z.string(),
      memberId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Validar que el team pertenece al workspace
      const team = await ctx.db.query.teams.findFirst({
        where: and(eq(teams.id, input.teamId), eq(teams.workspaceId, ctx.workspaceId!))
      })
      if (!team) throw new Error("Team not found")

      const [newMember] = await ctx.db.insert(teamMembers).values({
        teamId: input.teamId,
        memberId: input.memberId,
      }).returning()
      
      return newMember
    }),

  removeMember: requirePermission(Permission.ORG_MANAGE)
    .input(z.object({
      teamId: z.string(),
      memberId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const team = await ctx.db.query.teams.findFirst({
        where: and(eq(teams.id, input.teamId), eq(teams.workspaceId, ctx.workspaceId!))
      })
      if (!team) throw new Error("Team not found")

      const [removed] = await ctx.db.delete(teamMembers)
        .where(
          and(
            eq(teamMembers.teamId, input.teamId),
            eq(teamMembers.memberId, input.memberId)
          )
        )
        .returning()
      
      return removed
    }),
})
