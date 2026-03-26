import { pgTable, text, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core'
import { workspaces } from './workspaces'
import { createId } from '@paralleldrive/cuid2'

export const parcels = pgTable("parcels", {
  id:           text('id').primaryKey().$defaultFn(() => createId()),
  workspaceId:  text('workspace_id').notNull().references(() => workspaces.id),
  name:         text('name').notNull(),
  geoJson:      jsonb('geo_json').notNull(),  // Contiene properties, geometry, etc. En el futuro migrable a custom_type Geometry
  areaHectares: text('area_hectares'), 
  isActive:     boolean('is_active').notNull().default(true),
  createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:    timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
})
