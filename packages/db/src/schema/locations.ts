import { pgTable, text, timestamp, jsonb, boolean, index } from 'drizzle-orm/pg-core'
import { workspaces } from './workspaces'
import { createId } from '@paralleldrive/cuid2'

export const facilities = pgTable("facilities", {
  id:           text('id').primaryKey().$defaultFn(() => createId()),
  workspaceId:  text('workspace_id').notNull().references(() => workspaces.id),
  name:         text('name').notNull(),
  type:         text('type').notNull(), // ej: 'slaughterhouse', 'mine'
  location:     jsonb('location').notNull(), // geojson point
  isActive:     boolean('is_active').notNull().default(true),
  createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:    timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => [
  index('idx_facilities_workspace_id').on(table.workspaceId)
]);

export const zones = pgTable("zones", {
  id:           text('id').primaryKey().$defaultFn(() => createId()),
  facilityId:   text('facility_id').notNull().references(() => facilities.id),
  workspaceId:  text('workspace_id').notNull().references(() => workspaces.id),
  name:         text('name').notNull(),
  type:         text('type').notNull(),
  capacity:     text('capacity'), // numeric stored as string, or use int depending on vertical needs.
  polygon:      jsonb('polygon'), // GeoJSON
  gfwStatus:    text('gfw_status').default('pending').notNull(), // EUDR compliance (pending, compliant, violation)
  isActive:     boolean('is_active').notNull().default(true),
  createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:    timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => [
  index('idx_zones_workspace_id').on(table.workspaceId),
  index('idx_zones_facility_id').on(table.facilityId)
])

export const pens = pgTable("pens", {
  id:               text('id').primaryKey().$defaultFn(() => createId()),
  facilityId:       text('facility_id').notNull().references(() => facilities.id),
  zoneId:           text('zone_id').references(() => zones.id), // a pen usually belongs to a zone
  workspaceId:      text('workspace_id').notNull().references(() => workspaces.id),
  name:             text('name').notNull(),
  capacity:         text('capacity'), 
  currentOccupancy: text('current_occupancy').default('0').notNull(), // Counter that must be <= capacity
  isActive:         boolean('is_active').notNull().default(true),
  createdAt:        timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:        timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => [
  index('idx_pens_workspace_id').on(table.workspaceId),
  index('idx_pens_facility_id').on(table.facilityId),
  index('idx_pens_zone_id').on(table.zoneId)
])
