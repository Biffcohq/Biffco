import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'

// MOCK: La tabla pens no existe aún en el schema de Prisma/Drizzle.
// Se devolverán arreglos vacíos o mock para interactuar con Playwright/Frontend temporalmente.

export const pensRouter = router({
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      capacity: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      return { id: "mock-pen-1", name: input.name, capacity: input.capacity }
    }),

  list: protectedProcedure
    .query(async () => {
      return []
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return { id: input.id, name: "Mock Pen" }
    }),

  updateOccupancy: protectedProcedure
    .input(z.object({ id: z.string(), delta: z.number() }))
    .mutation(async () => {
      return { ok: true }
    })
})
