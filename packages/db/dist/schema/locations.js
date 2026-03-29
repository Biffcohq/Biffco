"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pens = exports.zones = exports.facilities = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const workspaces_1 = require("./workspaces");
const cuid2_1 = require("@paralleldrive/cuid2");
exports.facilities = (0, pg_core_1.pgTable)("facilities", {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, cuid2_1.createId)()),
    workspaceId: (0, pg_core_1.text)('workspace_id').notNull().references(() => workspaces_1.workspaces.id),
    name: (0, pg_core_1.text)('name').notNull(),
    type: (0, pg_core_1.text)('type').notNull(), // ej: 'slaughterhouse', 'mine'
    location: (0, pg_core_1.jsonb)('location').notNull(), // geojson point
    isActive: (0, pg_core_1.boolean)('is_active').notNull().default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => [
    (0, pg_core_1.index)('idx_facilities_workspace_id').on(table.workspaceId)
]);
exports.zones = (0, pg_core_1.pgTable)("zones", {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, cuid2_1.createId)()),
    facilityId: (0, pg_core_1.text)('facility_id').notNull().references(() => exports.facilities.id),
    workspaceId: (0, pg_core_1.text)('workspace_id').notNull().references(() => workspaces_1.workspaces.id),
    name: (0, pg_core_1.text)('name').notNull(),
    type: (0, pg_core_1.text)('type').notNull(),
    capacity: (0, pg_core_1.text)('capacity'), // numeric stored as string, or use int depending on vertical needs.
    polygon: (0, pg_core_1.jsonb)('polygon'), // GeoJSON
    gfwStatus: (0, pg_core_1.text)('gfw_status').default('pending').notNull(), // EUDR compliance (pending, compliant, violation)
    isActive: (0, pg_core_1.boolean)('is_active').notNull().default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => [
    (0, pg_core_1.index)('idx_zones_workspace_id').on(table.workspaceId),
    (0, pg_core_1.index)('idx_zones_facility_id').on(table.facilityId)
]);
exports.pens = (0, pg_core_1.pgTable)("pens", {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, cuid2_1.createId)()),
    facilityId: (0, pg_core_1.text)('facility_id').notNull().references(() => exports.facilities.id),
    zoneId: (0, pg_core_1.text)('zone_id').references(() => exports.zones.id), // a pen usually belongs to a zone
    workspaceId: (0, pg_core_1.text)('workspace_id').notNull().references(() => workspaces_1.workspaces.id),
    name: (0, pg_core_1.text)('name').notNull(),
    capacity: (0, pg_core_1.text)('capacity'),
    currentOccupancy: (0, pg_core_1.text)('current_occupancy').default('0').notNull(), // Counter that must be <= capacity
    isActive: (0, pg_core_1.boolean)('is_active').notNull().default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => [
    (0, pg_core_1.index)('idx_pens_workspace_id').on(table.workspaceId),
    (0, pg_core_1.index)('idx_pens_facility_id').on(table.facilityId),
    (0, pg_core_1.index)('idx_pens_zone_id').on(table.zoneId)
]);
//# sourceMappingURL=locations.js.map