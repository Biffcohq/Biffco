import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, protectedProcedure, requirePermission } from '../trpc'
import { workspaces } from '@biffco/db/schema'
import { eq, and, or, ilike, ne } from '@biffco/db'
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

  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().min(2).max(100).optional(),
      slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/).optional(),
      alias: z.string().min(4).max(50).regex(/^[A-Z0-9-]+$/).optional().nullable(),
      roles: z.array(z.string()).optional(),
      settings: z.record(z.unknown()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (input.alias) {
         const existing = await ctx.db.query.workspaces.findFirst({
           where: and(
             eq(workspaces.alias, input.alias),
             ne(workspaces.id, ctx.workspaceId!)
           )
         })
         if (existing) throw new TRPCError({ code: 'CONFLICT', message: `El alias ${input.alias} ya ha sido reclamado por otra organización.` })
      }

      const [updated] = await ctx.db.update(workspaces)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(eq(workspaces.id, ctx.workspaceId!))
        .returning()
      
      return updated
    }),
    
  search: protectedProcedure
    .input(z.object({
      query: z.string().min(2),
      limit: z.number().min(1).max(20).default(5)
    }))
    .query(async ({ input, ctx }) => {
       const items = await ctx.db.query.workspaces.findMany({
         where: and(
           ne(workspaces.id, ctx.workspaceId!),
           or(
             ilike(workspaces.name, `%${input.query}%`),
             ilike(workspaces.slug, `%${input.query}%`)
           )
         ),
         limit: input.limit
       });
       
       return items.map(w => ({ id: w.id, name: w.name, slug: w.slug }));
    })
})
