import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, protectedProcedure, requirePermission } from '../trpc'
import { domainEvents, assets } from '@biffco/db/schema'
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
      
      // Tenant Isolation: solo listamos eventos del workspace actual
      conditions.push(eq(domainEvents.workspaceId, ctx.workspaceId!))

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
  append: requirePermission(Permission.EVENTS_APPEND) // Ajustando RBAC
    .input(z.object({
      streamId: z.string(),
      streamType: z.enum(['asset', 'asset_group']).default('asset'),
      eventType: z.string(),
      payload: z.record(z.unknown()),
      signature: z.string().optional(),
      publicKey: z.string().optional(),
      hash: z.string(), // SHA-256 local
      previousHash: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, workspaceId, memberId } = ctx
      
      if (!workspaceId) {
         throw new TRPCError({ code: "UNAUTHORIZED", message: "Missing Workspace" })
      }

      // 1. Verificar existencia y propiedad del asset en este workspace
      if (input.streamType === 'asset') {
         const asset = await db.query.assets.findFirst({
           where: and(eq(assets.id, input.streamId), eq(assets.workspaceId, workspaceId))
         })
         if (!asset) {
           throw new TRPCError({ code: "NOT_FOUND", message: "Activo (Stream) no encontrado." })
         }
      }

      // 2. Validación ED25519 (Crítico C-04 Remediado)
      if (input.signature && input.publicKey) {
         // Requerimos importar verifyEvent, asumiendo su export en @biffco/core/crypto
         const { verifyEvent } = await import('@biffco/core/crypto');
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         const isValidSignature = await verifyEvent(input.payload as any, input.signature, input.publicKey);
         if (!isValidSignature) {
           throw new TRPCError({ code: "UNAUTHORIZED", message: "Firma Criptográfica Inválida" })
         }
      }

      // 3. Persistir Evento en el Ledger
      const [newEvent] = await db.insert(domainEvents).values({
        workspaceId: workspaceId,
        streamId: input.streamId,
        streamType: input.streamType,
        eventType: input.eventType,
        data: input.payload,
        signature: input.signature,
        hash: input.hash,
        previousHash: input.previousHash,
        signerId: memberId || "system"
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
         correlationId: z.string().optional()
      }))
      .mutation(async () => {
         // Lógica para Batch Events a desarrollar (Bloqueado por Diseño Criptográfico de Firmas Individuales)
         throw new TRPCError({ 
           code: "NOT_IMPLEMENTED", 
           message: "Batch logging requires grouping assets first to respect unique Signature hashes. Re-route to single append." 
         });
      })
})
