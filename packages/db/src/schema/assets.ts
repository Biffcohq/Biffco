import { pgTable, text, timestamp, jsonb, boolean, integer } from 'drizzle-orm/pg-core'
import { workspaces } from './workspaces'
import { createId } from '@paralleldrive/cuid2'

export const assetGroups = pgTable("asset_groups", {
  id:           text('id').primaryKey().$defaultFn(() => createId()),
  workspaceId:  text('workspace_id').notNull().references(() => workspaces.id),
  verticalId:   text('vertical_id').notNull(),  // ej: 'livestock'
  name:         text('name').notNull(),
  quantity:     integer('quantity').notNull().default(1),
  isActive:     boolean('is_active').notNull().default(true),
  metadata:     jsonb('metadata').notNull().default({}),
  createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:    timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
})

export const assets = pgTable("assets", {
  id:           text('id').primaryKey().$defaultFn(() => createId()),
  workspaceId:  text('workspace_id').notNull().references(() => workspaces.id),
  groupId:      text('group_id').references(() => assetGroups.id), // Null si es res individual
  verticalId:   text('vertical_id').notNull(),  // ej: 'livestock'
  type:         text('type').notNull(),         // ej: 'cattle', 'mineral_batch'
  status:       text('status').notNull().default('active'),
  locationId:   text('location_id'),            // FK a locations
  metadata:     jsonb('metadata').notNull().default({}),
  createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:    timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
})
