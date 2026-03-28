import { router, publicProcedure } from '../trpc'

export const verticalsRouter = router({
  list: publicProcedure
    .query(async ({ ctx }) => {
      // Retorna todos los VerticalPacks registrados en el registry
      // Esto servirá para renderizar dinámicamente el Paso 2 del Wizard
      return ctx.verticalRegistry.listPacks()
    })
})
