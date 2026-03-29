import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, protectedProcedure, requirePermission } from '../trpc'
import { employees } from '@biffco/db/schema'
import { eq } from '@biffco/db'
import { Permission } from '@biffco/core/rbac'

export const employeesRouter = router({
  list: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.select().from(employees).where(eq(employees.workspaceId, ctx.workspaceId!))
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const employee = await ctx.db.query.employees.findFirst({
        where: eq(employees.id, input.id),
      })
      if (!employee) throw new TRPCError({ code: "NOT_FOUND" })
      return employee
    }),

  create: requirePermission(Permission.EMPLOYEES_MANAGE)
    .input(z.object({
      name: z.string().min(2).max(100),
      role: z.string().min(2).max(50),
      dni: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const [newEmployee] = await ctx.db.insert(employees).values({
        workspaceId: ctx.workspaceId!,
        name: input.name,
        role: input.role,
        dni: input.dni ?? null,
        supervisorId: ctx.memberId!,
      }).returning()
      
      return newEmployee
    }),

  update: requirePermission(Permission.EMPLOYEES_MANAGE)
    .input(z.object({
      id: z.string(),
      name: z.string().min(2).max(100).optional(),
      role: z.string().min(2).max(50).optional(),
      dni: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { id, ...updates } = input
      const [updated] = await ctx.db.update(employees)
        .set(updates)
        .where(eq(employees.id, id))
        .returning()
      
      return updated
    }),

  deactivate: requirePermission(Permission.EMPLOYEES_MANAGE)
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const [deactivated] = await ctx.db.update(employees)
        .set({ isActive: false })
        .where(eq(employees.id, input.id))
        .returning()
      
      return deactivated
    }),
})
