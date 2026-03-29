"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assetCertifications = exports.holds = exports.anchoredEvents = exports.anchorsLog = exports.domainEvents = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const workspaces_1 = require("./workspaces");
const assets_1 = require("./assets");
const cuid2_1 = require("@paralleldrive/cuid2");
exports.domainEvents = (0, pg_core_1.pgTable)("domain_events", {
    globalId: (0, pg_core_1.bigserial)('global_id', { mode: 'number' }).primaryKey(),
    id: (0, pg_core_1.text)('id').notNull().unique().$defaultFn(() => (0, cuid2_1.createId)()),
    workspaceId: (0, pg_core_1.text)('workspace_id').notNull().references(() => workspaces_1.workspaces.id),
    streamId: (0, pg_core_1.text)('stream_id').notNull(), // The AssetID or GroupID
    streamType: (0, pg_core_1.text)('stream_type').notNull(), // 'asset' | 'asset_group'
    eventType: (0, pg_core_1.text)('event_type').notNull(), // ej: 'ASSET_MOVED', 'VACCINE_APPLIED'
    data: (0, pg_core_1.jsonb)('data').notNull(), // The Immutable payload
    hash: (0, pg_core_1.text)('hash').notNull().unique(), // SHA-256 of canonical JSON
    previousHash: (0, pg_core_1.text)('previous_hash'), // Chain linking
    signature: (0, pg_core_1.text)('signature'), // Client-side Ed25519 signature
    signerId: (0, pg_core_1.text)('signer_id'), // Quien firmó
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => [
    (0, pg_core_1.index)('idx_domain_events_workspace_id').on(table.workspaceId),
    (0, pg_core_1.index)('idx_domain_events_stream').on(table.streamId, table.globalId)
]);
exports.anchorsLog = (0, pg_core_1.pgTable)("anchors_log", {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, cuid2_1.createId)()),
    workspaceId: (0, pg_core_1.text)('workspace_id').notNull().references(() => workspaces_1.workspaces.id),
    polygonTxHash: (0, pg_core_1.text)('polygon_tx_hash').notNull().unique(),
    merkleRoot: (0, pg_core_1.text)('merkle_root').notNull(),
    ipfsCid: (0, pg_core_1.text)('ipfs_cid'),
    eventsCount: (0, pg_core_1.text)('events_count').notNull(),
    network: (0, pg_core_1.text)('network').notNull().default('polygon-amoy'),
    status: (0, pg_core_1.text)('status').notNull().default('confirmed'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => [
    (0, pg_core_1.index)('idx_anchors_log_workspace_id').on(table.workspaceId)
]);
// Tabla intermedia para vincular qué eventos corresponden a qué anclaje
// Evitamos agregar `anchorId` a `domain_events` para respetar el Trigger Append-Only Inmutable.
exports.anchoredEvents = (0, pg_core_1.pgTable)("anchored_events", {
    eventId: (0, pg_core_1.text)('event_id').notNull().references(() => exports.domainEvents.id),
    anchorId: (0, pg_core_1.text)('anchor_id').notNull().references(() => exports.anchorsLog.id),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => [
    (0, pg_core_1.index)('idx_anchored_events_anchor').on(table.anchorId)
]);
exports.holds = (0, pg_core_1.pgTable)("holds", {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, cuid2_1.createId)()),
    assetId: (0, pg_core_1.text)('asset_id').notNull().references(() => assets_1.assets.id),
    workspaceId: (0, pg_core_1.text)('workspace_id').notNull().references(() => workspaces_1.workspaces.id),
    reason: (0, pg_core_1.text)('reason').notNull(),
    isActive: (0, pg_core_1.boolean)('is_active').notNull().default(true),
    issuerId: (0, pg_core_1.text)('issuer_id').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
    releasedAt: (0, pg_core_1.timestamp)('released_at', { withTimezone: true })
}, (table) => [
    (0, pg_core_1.index)('idx_holds_asset_id').on(table.assetId),
    (0, pg_core_1.index)('idx_holds_workspace_id').on(table.workspaceId)
]);
exports.assetCertifications = (0, pg_core_1.pgTable)("asset_certifications", {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, cuid2_1.createId)()),
    assetId: (0, pg_core_1.text)('asset_id').notNull().references(() => assets_1.assets.id),
    certifierId: (0, pg_core_1.text)('certifier_id').notNull().references(() => workspaces_1.workspaces.id),
    metadata: (0, pg_core_1.jsonb)('metadata').notNull().default({}),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => [
    (0, pg_core_1.index)('idx_asset_certifications_asset_id').on(table.assetId),
    (0, pg_core_1.index)('idx_asset_certifications_certifier').on(table.certifierId)
]);
//# sourceMappingURL=core.js.map