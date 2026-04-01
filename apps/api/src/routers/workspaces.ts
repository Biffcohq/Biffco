import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, protectedProcedure, requirePermission } from '../trpc'
import { workspaces } from '@biffco/db/schema'
import { eq } from '@biffco/db'
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
    
  search: protectedProcedure
    .input(z.object({
      query: z.string().min(2),
      limit: z.number().min(1).max(20).default(5)
    }))
    .query(async ({ input, ctx }) => {
       const lowerQuery = input.query.toLowerCase();
       // Drizzle ilike no siempre está expuesto directo en el core si no se importa bien, usaremos select
       // Pero asumiendo DB sqlite/pg podemos usar like o un select general filtrado
       const allWorkspaces = await ctx.db.query.workspaces.findMany({
         limit: 100 // Busqueda simple en memoria para esta prueba PoC
       });
       
       return allWorkspaces
         .filter(w => w.id !== ctx.workspaceId && (w.name.toLowerCase().includes(lowerQuery) || (w.slug && w.slug.toLowerCase().includes(lowerQuery))))
         .slice(0, input.limit)
         .map(w => ({ id: w.id, name: w.name, slug: w.slug }));
    })
})
