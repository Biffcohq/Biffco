import { pgTable, text, timestamp, jsonb, boolean, bigserial, index } from 'drizzle-orm/pg-core'
import { workspaces } from './workspaces'
import { assets } from './assets'
import { createId } from '@paralleldrive/cuid2'

export const domainEvents = pgTable("domain_events", {
  globalId:     bigserial('global_id', { mode: 'number' }).primaryKey(),
  id:           text('id').notNull().unique().$defaultFn(() => createId()),
  workspaceId:  text('workspace_id').notNull().references(() => workspaces.id),
  streamId:     text('stream_id').notNull(),        // The AssetID or GroupID
  streamType:   text('stream_type').notNull(),      // 'asset' | 'asset_group'
  eventType:    text('event_type').notNull(),       // ej: 'ASSET_MOVED', 'VACCINE_APPLIED'
  data:         jsonb('data').notNull(),            // The Immutable payload
  hash:         text('hash').notNull().unique(),    // SHA-256 of canonical JSON
  previousHash: text('previous_hash'),              // Chain linking
  signature:    text('signature'),                  // Client-side Ed25519 signature
  signerId:     text('signer_id'),                  // Quien firmó
  createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => [
  index('idx_domain_events_workspace_id').on(table.workspaceId),
  index('idx_domain_events_stream').on(table.streamId, table.globalId)
])

export const anchorsLog = pgTable("anchors_log", {
  id:             text('id').primaryKey().$defaultFn(() => createId()),
  workspaceId:    text('workspace_id').notNull().references(() => workspaces.id),
  polygonTxHash:  text('polygon_tx_hash').notNull().unique(),
  merkleRoot:     text('merkle_root').notNull(),
  ipfsCid:        text('ipfs_cid'),
  eventsCount:    text('events_count').notNull(),
  createdAt:      timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => [
  index('idx_anchors_log_workspace_id').on(table.workspaceId)
])

export const holds = pgTable("holds", {
  id:           text('id').primaryKey().$defaultFn(() => createId()),
  assetId:      text('asset_id').notNull().references(() => assets.id),
  workspaceId:  text('workspace_id').notNull().references(() => workspaces.id),
  reason:       text('reason').notNull(),
  isActive:     boolean('is_active').notNull().default(true),
  issuerId:     text('issuer_id').notNull(),
  createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  releasedAt:   timestamp('released_at', { withTimezone: true })
}, (table) => [
  index('idx_holds_asset_id').on(table.assetId),
  index('idx_holds_workspace_id').on(table.workspaceId)
])

export const assetCertifications = pgTable("asset_certifications", {
  id:           text('id').primaryKey().$defaultFn(() => createId()),
  assetId:      text('asset_id').notNull().references(() => assets.id),
  certifierId:  text('certifier_id').notNull().references(() => workspaces.id),
  metadata:     jsonb('metadata').notNull().default({}),
  createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => [
  index('idx_asset_certifications_asset_id').on(table.assetId),
  index('idx_asset_certifications_certifier').on(table.certifierId)
])
