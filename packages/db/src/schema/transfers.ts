import { pgTable, text, timestamp, jsonb, pgEnum, index } from 'drizzle-orm/pg-core'
import { workspaces } from './workspaces'
import { createId } from '@paralleldrive/cuid2'

export const transferStatusEnum = pgEnum('transfer_status', [
  'DRAFT_DISPATCH',             // En preparación en la estancia
  'PENDING_CARRIER_ACCEPTANCE', // Listo, esperando que el camionero escanee y acepte la carga
  'IN_TRANSIT',                 // Viajando. Los activos están inhibidos (locked).
  'COMPLETED',                  // Frigorífico aceptó. Se transfirió el workspaceId.
  'REJECTED',                   // Frigorífico rechazó, cediendo la responsabilidad legal.
  'DISPUTED'                    // Estado de resolución. Productor debe re-asignar.
])

export const assetTransfers = pgTable("asset_transfers", {
  id:                  text('id').primaryKey().$defaultFn(() => createId()),
  
  senderWorkspaceId:   text('sender_workspace_id').notNull().references(() => workspaces.id),
  carrierWorkspaceId:  text('carrier_workspace_id').references(() => workspaces.id), // Null si no pasamos transportista estricto en el draft
  receiverWorkspaceId: text('receiver_workspace_id').notNull().references(() => workspaces.id),
  
  // Array de AssetIds (Vacas enviadas en este lote)
  assetIds:            jsonb('asset_ids').$type<string[]>().notNull().default([]),
  
  status:              transferStatusEnum('status').notNull().default('DRAFT_DISPATCH'),
  
  // Puntero para encadenar transferencias (ej. si fue rechazada y este es el viaje de vuelta)
  resolutionChainId:   text('resolution_chain_id'),
  
  // Custom Metadata (Documentos adjuntos de transporte, etc)
  metadata:            jsonb('metadata').notNull().default({}),
  
  // Tiempos
  createdAt:           timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  dispatchedAt:        timestamp('dispatched_at', { withTimezone: true }),
  carrierAcceptedAt:   timestamp('carrier_accepted_at', { withTimezone: true }),
  receivedAt:          timestamp('received_at', { withTimezone: true }),
  rejectedAt:          timestamp('rejected_at', { withTimezone: true }),
}, (table) => [
  index('idx_transfers_sender').on(table.senderWorkspaceId),
  index('idx_transfers_carrier').on(table.carrierWorkspaceId),
  index('idx_transfers_receiver').on(table.receiverWorkspaceId),
  index('idx_transfers_status').on(table.status),
  // Índice inverso opcional sobre la cadena de resoluciones
  index('idx_transfers_chain').on(table.resolutionChainId)
])
