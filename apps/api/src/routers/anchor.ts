import { router, protectedProcedure } from '../trpc'
import { domainEvents, anchorsLog, anchoredEvents } from '@biffco/db/schema'
import { env } from '@biffco/config'
import { TRPCError } from '@trpc/server'
import { sql, notInArray } from 'drizzle-orm'
import { MerkleTree } from '@biffco/core/crypto'
import { ethers } from 'ethers'

export const anchorRouter = router({
  // Fuerza el anclaje de todos los eventos no anclados en el Workspace activo
  triggerBatch: protectedProcedure
    .mutation(async ({ ctx }) => {
      const { db, workspaceId } = ctx

      // 1. Obtener eventos que no están en "anchoredEvents"
      // Es una subquery básica: SELECT * from domainEvents WHERE id NOT IN (SELECT eventId FROM anchoredEvents)
      const unanchoredEvents = await db.query.domainEvents.findMany({
        where: notInArray(
          domainEvents.id,
          db.select({ eventId: anchoredEvents.eventId }).from(anchoredEvents)
        ),
        orderBy: (domainEvents, { asc }) => [asc(domainEvents.createdAt)] // Viejo a nuevo
      })

      if (unanchoredEvents.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "No hay eventos pendientes de anclar" })
      }

      // 2. Construir Merkle Tree con los hashes
      const hashes = unanchoredEvents.map(e => e.hash)
      const merkleTree = new MerkleTree(hashes)
      const rootHashHex = merkleTree.getRoot()
      
      // Asegurar formato bytes32 para ethers
      const rootBytes32 = rootHashHex.startsWith('0x') ? rootHashHex : `0x${rootHashHex}`

      // 3. Impactar Polygon EVM
      if (!env.POLYGON_PRIVATE_KEY || !env.POLYGON_RPC_URL || !env.SIMPLE_ANCHOR_ADDRESS) {
        throw new TRPCError({ 
          code: "INTERNAL_SERVER_ERROR", 
          message: "El servidor no tiene configurada su bóveda criptográfica. Polygon Inaccesible." 
        })
      }

      let txHash = ''
      try {
        const provider = new ethers.JsonRpcProvider(env.POLYGON_RPC_URL)
        const wallet = new ethers.Wallet(env.POLYGON_PRIVATE_KEY, provider)
        
        // ABI Exacto del Smart Contract
        const abi = ["function anchor(bytes32 merkleRoot, string batchId) external"]
        const contract = new ethers.Contract(env.SIMPLE_ANCHOR_ADDRESS, abi, wallet)

        // Enviar Transacción a la Blockchain Pública con un BatchId temporal (la fecha)
        const batchId = new Date().toISOString()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tx = await (contract as any).anchor(rootBytes32, batchId)
        
        // Esperamos 1 confirmación del nodo
        const receipt = await tx.wait(1)
        txHash = receipt.hash
      } catch (err: unknown) {
        const error = err as Error
        throw new TRPCError({ 
          code: "INTERNAL_SERVER_ERROR", 
          message: `Fallo al escribir en Polygon: ${error.message}` 
        })
      }

      // 4. Actualizar Base de Datos
      const result = await db.transaction(async (tx) => {
        // Configuramos la variable RLS "app.current_workspace" para que las inserciones pasen el row level security
        await tx.execute(sql`SELECT set_config('app.current_workspace', ${workspaceId}, true)`)

        // Crear el registro del ancla
        const [anchor] = await tx.insert(anchorsLog).values({
          workspaceId: workspaceId!,
          polygonTxHash: txHash,
          merkleRoot: rootHashHex,
          eventsCount: unanchoredEvents.length.toString(),
          network: 'polygon-amoy', // o polygon-mainnet
          status: 'confirmed'
        }).returning()

        if (!anchor) throw new Error("Fallo al crear el registro del AnchorLog")

        // Crear las relaciones
        const linkages = unanchoredEvents.map(e => ({
          eventId: e.id,
          anchorId: anchor.id
        }))

        await tx.insert(anchoredEvents).values(linkages)

        return anchor
      })

      return result
    })
})
