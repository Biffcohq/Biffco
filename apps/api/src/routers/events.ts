import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, protectedProcedure, requirePermission } from '../trpc'
import { domainEvents, assets } from '@biffco/db/schema'
import { randomUUID } from 'crypto'
import { eq, and } from '@biffco/db'
import { Permission } from '@biffco/core/rbac'

export const eventsRouter = router({
  
  // Endpoint clave para TRAZABILIDAD
  list: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(200).default(50),
      cursor: z.string().nullish(),
      streamId: z.string().optional(), // Puede ser el ID de un Asset
      eventType: z.string().optional()
    }).optional())
    .query(async ({ input, ctx }) => {
      const conditions = []
      // Tenant Isolation implicito evaluando assets.workspaceId no es facil porque la tabla event no tiene workspaceId directo.
      // Se debe hacer JOIN o los eventos asumen que el cliente consulta por un streamId al que tiene acceso.
      if (input?.streamId) {
        conditions.push(eq(domainEvents.streamId, input.streamId))
      }
      if (input?.eventType) {
        conditions.push(eq(domainEvents.eventType, input.eventType))
      }

      const items = await ctx.db.query.domainEvents.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        orderBy: (domainEvents, { desc }) => [desc(domainEvents.createdAt)],
        limit: input?.limit,
      })
      
      return items
    }),

  // APÉNDICE INMUTABLE: Agrega un evento a un 'stream' (Asset)
  append: requirePermission(Permission.EVENTS_APPEND) // Si tu sistema de RBAC usa EVENTS_APPEND. Ajusta si es ASSETS_UPDATE.
    .input(z.object({
      streamId: z.string(),
      eventType: z.string(),
      payload: z.record(z.unknown()),
      signature: z.string().optional(),
      publicKey: z.string().optional(),
      hash: z.string() // El ID inmutable precomputado o generado por el arbol de merkle local
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, workspaceId } = ctx
      
      // 1. Verificar existencia y propiedad del asset en este workspace
      const asset = await db.query.assets.findFirst({
        where: and(eq(assets.id, input.streamId), eq(assets.workspaceId, workspaceId!))
      })

      if (!asset) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Activo (Stream) no encontrado." })
      }

      // 2. Validación Mock ED25519 (Lógica Placeholder)
      // En un entorno de producción, aquí se usa @noble/ed25519 para regenerar el Payload Stringified 
      // y compararlo contra input.signature usando input.publicKey
      if (input.signature && input.publicKey) {
         const isValidSignature = true // MOCK: Cambiar a ED25519Verify()
         if (!isValidSignature) {
           throw new TRPCError({ code: "UNAUTHORIZED", message: "Firma Criptográfica Inválida" })
         }
      }

      // 3. Persistir Evento en el Ledger
      const [newEvent] = await db.insert(domainEvents).values({
        id: randomUUID(),
        streamId: input.streamId,
        version: 1, // Autoincremental basado en query(max version where streamId)
        eventType: input.eventType,
        payload: input.payload,
        signature: input.signature,
        publicKey: input.publicKey,
        hash: input.hash,
        createdBy: ctx.personId || "system"
      }).returning()

      // 4. Actualizar estado derivado del Asset en cascada si es necesario 
      // ej: si eventType = "QUARANTINE_APPLIED", db.update(assets).set({ status: "QUARANTINE" })
      
      return newEvent
    }),
    
    // BATCH PROCESSING: Aplicar el mismo evento a N assets al mismo tiempo
    batch: requirePermission(Permission.EVENTS_APPEND)
      .input(z.object({
         streamIds: z.array(z.string()).min(1),
         eventType: z.string(),
         payload: z.record(z.unknown()),
         correlationId: z.string().optional() // ID para tracking del batch completo
      }))
      .mutation(async ({ input }) => {
         // Lógica para Batch Events a desarrollar...
         return { success: true, processed: input.streamIds.length }
      })
})
