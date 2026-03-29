"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferOffers = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const workspaces_1 = require("./workspaces");
const assets_1 = require("./assets");
const cuid2_1 = require("@paralleldrive/cuid2");
exports.transferOffers = (0, pg_core_1.pgTable)("transfer_offers", {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, cuid2_1.createId)()),
    fromWorkspaceId: (0, pg_core_1.text)('from_workspace_id').notNull().references(() => workspaces_1.workspaces.id),
    toWorkspaceId: (0, pg_core_1.text)('to_workspace_id').notNull().references(() => workspaces_1.workspaces.id),
    assetId: (0, pg_core_1.text)('asset_id').notNull().references(() => assets_1.assets.id),
    status: (0, pg_core_1.text)('status').notNull().default('pending'), // pending, accepted, rejected, cancelled
    conditions: (0, pg_core_1.jsonb)('conditions').notNull().default({}),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
    resolvedAt: (0, pg_core_1.timestamp)('resolved_at', { withTimezone: true })
}, (table) => [
    (0, pg_core_1.index)('idx_transfer_offers_from_workspace').on(table.fromWorkspaceId),
    (0, pg_core_1.index)('idx_transfer_offers_to_workspace').on(table.toWorkspaceId),
    (0, pg_core_1.index)('idx_transfer_offers_asset_id').on(table.assetId),
    (0, pg_core_1.index)('idx_transfer_offers_status').on(table.status)
]);
//# sourceMappingURL=operations.js.map