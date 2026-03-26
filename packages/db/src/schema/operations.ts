import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core'
import { workspaces } from './workspaces'
import { assets } from './assets'
import { createId } from '@paralleldrive/cuid2'

export const transferOffers = pgTable("transfer_offers", {
  id:               text('id').primaryKey().$defaultFn(() => createId()),
  fromWorkspaceId:  text('from_workspace_id').notNull().references(() => workspaces.id),
  toWorkspaceId:    text('to_workspace_id').notNull().references(() => workspaces.id),
  assetId:          text('asset_id').notNull().references(() => assets.id),
  status:           text('status').notNull().default('pending'), // pending, accepted, rejected, cancelled
  conditions:       jsonb('conditions').notNull().default({}),
  createdAt:        timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  resolvedAt:       timestamp('resolved_at', { withTimezone: true })
})
