"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assets = exports.assetGroups = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const workspaces_1 = require("./workspaces");
const cuid2_1 = require("@paralleldrive/cuid2");
exports.assetGroups = (0, pg_core_1.pgTable)("asset_groups", {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, cuid2_1.createId)()),
    workspaceId: (0, pg_core_1.text)('workspace_id').notNull().references(() => workspaces_1.workspaces.id),
    verticalId: (0, pg_core_1.text)('vertical_id').notNull(), // ej: 'livestock'
    name: (0, pg_core_1.text)('name').notNull(),
    quantity: (0, pg_core_1.integer)('quantity').notNull().default(1),
    isActive: (0, pg_core_1.boolean)('is_active').notNull().default(true),
    metadata: (0, pg_core_1.jsonb)('metadata').notNull().default({}),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => [
    (0, pg_core_1.index)('idx_asset_groups_workspace_id').on(table.workspaceId),
    (0, pg_core_1.index)('idx_asset_groups_vertical_id').on(table.verticalId)
]);
exports.assets = (0, pg_core_1.pgTable)("assets", {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, cuid2_1.createId)()),
    workspaceId: (0, pg_core_1.text)('workspace_id').notNull().references(() => workspaces_1.workspaces.id),
    groupId: (0, pg_core_1.text)('group_id').references(() => exports.assetGroups.id), // Null si es res individual
    verticalId: (0, pg_core_1.text)('vertical_id').notNull(), // ej: 'livestock'
    type: (0, pg_core_1.text)('type').notNull(), // ej: 'cattle', 'mineral_batch'
    status: (0, pg_core_1.text)('status').notNull().default('active'),
    locationId: (0, pg_core_1.text)('location_id'), // FK a locations
    metadata: (0, pg_core_1.jsonb)('metadata').notNull().default({}),
    parentIds: (0, pg_core_1.jsonb)('parent_ids').$type().notNull().default([]),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => [
    (0, pg_core_1.index)('idx_assets_workspace_id').on(table.workspaceId),
    (0, pg_core_1.index)('idx_assets_group_id').on(table.groupId),
    (0, pg_core_1.index)('idx_assets_vertical_id').on(table.verticalId),
    (0, pg_core_1.index)('idx_assets_status').on(table.status),
    (0, pg_core_1.index)('idx_assets_location_id').on(table.locationId),
    (0, pg_core_1.index)('idx_assets_parent_ids').using('gin', table.parentIds)
]);
//# sourceMappingURL=assets.js.map