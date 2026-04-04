import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, protectedProcedure, requirePermission } from '../trpc'
import { assets, domainEvents, workspaces, workspaceMembers, persons } from '@biffco/db/schema'
import { eq, and } from '@biffco/db'
import { sql, inArray, desc } from 'drizzle-orm'
import { Permission } from '@biffco/core/rbac'
import { holds, anchoredEvents, anchorsLog } from '@biffco/db/schema'

export const assetsRouter = router({
  
  // Endpoint clave para el Dashboard: Listado de Activos
  list: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(50),
      cursor: z.string().nullish(), // Para paginación
      status: z.string().optional(),
      type: z.string().optional()
    }).optional())
    .query(async ({ input, ctx }) => {
      // Filtrar siempre por workspaceId garantiza tenant isolation.
      // Se debe usar la base de datos para recuperar todos los activos correspondientes al workspace
      const conditions = [eq(assets.workspaceId, ctx.workspaceId!)]
      
      if (input?.status) conditions.push(eq(assets.status, input.status))
      if (input?.type) conditions.push(eq(assets.type, input.type))

      const items = await ctx.db.query.assets.findMany({
        where: and(...conditions),
        orderBy: (assets, { desc }) => [desc(assets.createdAt)],
        limit: input?.limit,
      })
      
      return items
    }),

  // Vista de detalle: Trae el asset y sus últimos eventos
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const asset = await ctx.db.query.assets.findFirst({
        where: and(eq(assets.id, input.id), eq(assets.workspaceId, ctx.workspaceId!))
      })
      
      if (!asset) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Activo no encontrado en este workspace" })
      }

      const rawEvents = await ctx.db
        .select({
          event: domainEvents,
          anchorHash: anchorsLog.polygonTxHash
        })
        .from(domainEvents)
        .leftJoin(anchoredEvents, eq(domainEvents.id, anchoredEvents.eventId))
        .leftJoin(anchorsLog, eq(anchoredEvents.anchorId, anchorsLog.id))
        .where(eq(domainEvents.streamId, asset.id))
        .orderBy(desc(domainEvents.createdAt))
        .limit(10)

      const assetEventsRaw = rawEvents.map(r => ({ ...r.event, anchorTxHash: r.anchorHash }));

      const signerIds = [...new Set(assetEventsRaw.map(e => e.signerId).filter(id => id && id !== 'system'))] as string[];
      const signersMap = new Map<string, string>();
      
      const genericWorkspaceIds = new Set<string>();
      assetEventsRaw.forEach(e => {
        const d = e.data as Record<string, unknown>;
        if (d && typeof d.carrier === 'string') genericWorkspaceIds.add(d.carrier);
        if (d && typeof d.receiver === 'string') genericWorkspaceIds.add(d.receiver);
      });

      if (signerIds.length > 0) {
        const signersData = await ctx.db.select({
          memberId: workspaceMembers.id,
          alias: workspaces.alias,
          personName: persons.name
        })
        .from(workspaceMembers)
        .leftJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
        .leftJoin(persons, eq(workspaceMembers.personId, persons.id))
        .where(inArray(workspaceMembers.id, signerIds));

        signersData.forEach(sd => {
           signersMap.set(sd.memberId, `${sd.personName} (${sd.alias || 'Tenant'})`);
        })
      }

      const genericWorkspacesMap = new Map<string, string>();
      if (genericWorkspaceIds.size > 0) {
        const genericWps = await ctx.db.select({
          id: workspaces.id,
          alias: workspaces.alias
        }).from(workspaces).where(inArray(workspaces.id, [...genericWorkspaceIds]));

        genericWps.forEach(w => genericWorkspacesMap.set(w.id, w.alias || 'Tenant'));
      }

      const assetEventsMapped = assetEventsRaw.map(e => {
        const newData = { ...(e.data as Record<string, unknown> || {}) };
        if (newData.carrier && typeof newData.carrier === 'string' && genericWorkspacesMap.has(newData.carrier)) newData.carrierAlias = genericWorkspacesMap.get(newData.carrier);
        if (newData.receiver && typeof newData.receiver === 'string' && genericWorkspacesMap.has(newData.receiver)) newData.receiverAlias = genericWorkspacesMap.get(newData.receiver);

        return {
          ...e,
          data: newData,
          signerAlias: e.signerId === 'system' ? 'Proceso Automatizado' : (e.signerId ? (signersMap.get(e.signerId) || e.signerId) : 'Desconocido')
        }
      })

      const eventIds = assetEventsMapped.map(e => e.id)
      let eventsWithAnchors = assetEventsMapped as (typeof assetEventsMapped[0] & { polygonTxHash?: string | undefined })[]
      
      if (eventIds.length > 0) {
        // Buscar vínculos de anclaje para estos ids
        const linkages = await ctx.db.select({
          eventId: anchoredEvents.eventId,
          txHash: anchorsLog.polygonTxHash
        }).from(anchoredEvents)
        .leftJoin(anchorsLog, eq(anchoredEvents.anchorId, anchorsLog.id))
        .where(inArray(anchoredEvents.eventId, eventIds))

        eventsWithAnchors = assetEventsMapped.map(e => {
          const link = linkages.find(l => l.eventId === e.id)
          const newEvent = { ...e } as typeof assetEventsMapped[0] & { polygonTxHash?: string | undefined }
          if (link?.txHash) {
            newEvent.polygonTxHash = link.txHash
          }
          return newEvent
        })
      }

      // Traer los holds activos del activo (útil para Worst-case compliance warning)
      const assetHolds = await ctx.db.query.holds.findMany({
        where: and(
          eq(holds.assetId, asset.id),
          eq(holds.isActive, true)
        )
      })

      // Identificar herederos directos (Children)
      const children = await ctx.db.execute<{id: string, type: string, status: string, metadata: any}>(
         sql`SELECT id, type, status, metadata FROM "assets" WHERE "workspace_id" = ${ctx.workspaceId} AND "parent_ids" @> ${JSON.stringify([asset.id])}::jsonb`
      );

      return {
        ...asset,
        events: eventsWithAnchors,
        holds: assetHolds,
        derivedChildren: (children as any).rows || children || []
      }
    }),

  // Creación de un Asset puro inicial
  create: requirePermission(Permission.ASSETS_CREATE)
    .input(z.object({
      type: z.string(), // ejemplo: "Bovine", "DoreBar", "CoffeeSack"
      initialState: z.record(z.unknown()), // Estado inicial dinámico manejado por el VerticalPack
      externalId: z.string().optional(),
      facilityId: z.string().optional(),
      penId: z.string().optional(),
      genesisEvent: z.object({
        eventType: z.string(),
        payload: z.record(z.unknown()),
        signature: z.string().optional(),
        publicKey: z.string().optional(),
        hash: z.string()
      }).optional()
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, workspaceId, verticalRegistry } = ctx
      
      const workspace = await db.query.workspaces.findFirst({ where: eq(workspaces.id, workspaceId!) })
      if (!workspace) throw new TRPCError({ code: "NOT_FOUND" })
        
      // Delegar validación de tipo al VerticalPack activo
      const pack = verticalRegistry.get(workspace.verticalId) as any
      if (pack && pack.assetTypes && !pack.assetTypes.some((a: any) => a.id === input.type)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: `Tipo de activo "${input.type}" no válido para el vertical "${workspace.verticalId}"` })
      }

      // Validar firma del evento inicial si se provee
      if (input.genesisEvent?.signature && input.genesisEvent?.publicKey) {
         const { verifyEvent } = await import('@biffco/core/crypto');
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         const isValidSignature = await verifyEvent(input.genesisEvent.payload as any, input.genesisEvent.signature, input.genesisEvent.publicKey);
         if (!isValidSignature) {
           throw new TRPCError({ code: "UNAUTHORIZED", message: "Firma Criptográfica Inválida en Evento Semilla" })
         }
      }

      // Transacción ACID para asegurar Minteo puro
      const [newAsset] = await db.transaction(async (tx) => {
        // C-01: Configurar variable de RLS para el contexto de esta transacción (conexión asegurada)
        await tx.execute(sql`SELECT set_config('app.current_workspace', ${workspaceId}, true)`)

        const [insertedAsset] = await tx.insert(assets).values({
          workspaceId: workspaceId!,
          verticalId: workspace.verticalId,
          type: input.type,
          status: "ACTIVE", // Estatus por default al crear
          locationId: input.facilityId || input.penId || null,
          metadata: {
            initialState: input.initialState,
            externalId: input.externalId,
            facilityId: input.facilityId,
            penId: input.penId
          } as Record<string, unknown>
        }).returning()

        if (!insertedAsset) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to insert asset" })

        if (input.genesisEvent) {
          await tx.insert(domainEvents).values({
            workspaceId: workspaceId!,
            streamId: insertedAsset.id,
            streamType: 'asset',
            eventType: input.genesisEvent.eventType,
            data: input.genesisEvent.payload,
            signature: input.genesisEvent.signature,
            hash: input.genesisEvent.hash,
            signerId: ctx.memberId || "system"
          })
        }

        return [insertedAsset]
      })
      
      return newAsset
    }),

  getEudrMetrics: protectedProcedure
    .query(async ({ ctx }) => {
      const items = await ctx.db.query.assets.findMany({
        where: and(eq(assets.workspaceId, ctx.workspaceId!), eq(assets.type, "AnimalAsset")),
      })

      const total = items.length
      const withPolygon = items.filter(i => (i.metadata as Record<string, unknown>)?.locationId).length
      // Simulate DTEs being valid natively
      const validDte = items.filter(i => i.status === 'ACTIVE').length
      const gfwClear = items.filter(i => {
        const meta = i.metadata as Record<string, unknown> | null;
        return meta?.gfwStatus === 'clear' || meta?.gfwStatus === 'passed'
      }).length

      return {
        totalAnimals: total,
        withPolygon,
        validDte,
        gfwClear
      }
    })
})
