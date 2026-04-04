"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employees = exports.teamMembers = exports.teams = exports.workspaceMembers = exports.workspaces = exports.workspacePlanEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const cuid2_1 = require("@paralleldrive/cuid2");
const persons_1 = require("./persons");
exports.workspacePlanEnum = (0, pg_core_1.pgEnum)('workspace_plan', ['free', 'starter', 'pro', 'enterprise']);
exports.workspaces = (0, pg_core_1.pgTable)("workspaces", {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, cuid2_1.createId)()),
    name: (0, pg_core_1.text)('name').notNull(),
    slug: (0, pg_core_1.text)('slug').notNull().unique(),
    verticalId: (0, pg_core_1.text)('vertical_id').notNull(), // 'livestock' | 'mining' | ...
    plan: (0, exports.workspacePlanEnum)('plan').notNull().default('free'),
    roles: (0, pg_core_1.jsonb)('roles').$type().notNull().default(['PRODUCER']),
    alias: (0, pg_core_1.text)('alias').unique(),
    settings: (0, pg_core_1.jsonb)('settings').notNull().default('{}'),
    isActive: (0, pg_core_1.boolean)('is_active').notNull().default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
    (0, pg_core_1.index)('idx_workspace_alias').on(table.alias)
]);
// ─── WorkspaceMembers ────────────────────────────────────────────
exports.workspaceMembers = (0, pg_core_1.pgTable)("workspace_members", {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, cuid2_1.createId)()),
    workspaceId: (0, pg_core_1.text)('workspace_id').notNull().references(() => exports.workspaces.id),
    personId: (0, pg_core_1.text)('person_id').notNull().references(() => persons_1.persons.id),
    publicKey: (0, pg_core_1.text)('public_key').notNull(), // Ed25519 public key hex
    roles: (0, pg_core_1.text)('roles').array().notNull().default(['{}']),
    status: (0, pg_core_1.text)('status').notNull().default('active'), // active|suspended|revoked
    invitedAt: (0, pg_core_1.timestamp)('invited_at', { withTimezone: true }).notNull().defaultNow(),
    acceptedAt: (0, pg_core_1.timestamp)('accepted_at', { withTimezone: true }),
    revokedAt: (0, pg_core_1.timestamp)('revoked_at', { withTimezone: true }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
    (0, pg_core_1.index)('idx_workspace_members_workspace_id').on(table.workspaceId)
]);
// ─── Teams ───────────────────────────────────────────────────────
exports.teams = (0, pg_core_1.pgTable)("teams", {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, cuid2_1.createId)()),
    workspaceId: (0, pg_core_1.text)('workspace_id').notNull().references(() => exports.workspaces.id),
    name: (0, pg_core_1.text)('name').notNull(),
    description: (0, pg_core_1.text)('description'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
    (0, pg_core_1.index)('idx_teams_workspace_id').on(table.workspaceId)
]);
// ─── Team Members ────────────────────────────────────────────────
exports.teamMembers = (0, pg_core_1.pgTable)("team_members", {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, cuid2_1.createId)()),
    teamId: (0, pg_core_1.text)('team_id').notNull().references(() => exports.teams.id, { onDelete: 'cascade' }),
    memberId: (0, pg_core_1.text)('member_id').notNull().references(() => exports.workspaceMembers.id, { onDelete: 'cascade' }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
    (0, pg_core_1.index)('idx_team_members_team_id').on(table.teamId),
    (0, pg_core_1.index)('idx_team_members_member_id').on(table.memberId)
]);
// ─── Employees ───────────────────────────────────────────────────
exports.employees = (0, pg_core_1.pgTable)("employees", {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, cuid2_1.createId)()),
    workspaceId: (0, pg_core_1.text)('workspace_id').notNull().references(() => exports.workspaces.id),
    name: (0, pg_core_1.text)('name').notNull(),
    role: (0, pg_core_1.text)('role').notNull(), // label descriptivo (peón, capataz, etc.)
    dni: (0, pg_core_1.text)('dni'),
    supervisorId: (0, pg_core_1.text)('supervisor_id').references(() => exports.workspaceMembers.id),
    memberId: (0, pg_core_1.text)('member_id').references(() => exports.workspaceMembers.id), // si tiene cuenta
    isActive: (0, pg_core_1.boolean)('is_active').notNull().default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
    (0, pg_core_1.index)('idx_employees_workspace_id').on(table.workspaceId)
]);
//# sourceMappingURL=workspaces.js.map