import { pgTable, text, timestamp, jsonb, boolean, pgEnum, index } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

export const workspacePlanEnum = pgEnum('workspace_plan', ['free', 'starter', 'pro', 'enterprise'])

export const workspaces = pgTable("workspaces", {
  id:          text('id').primaryKey().$defaultFn(() => createId()),
  name:        text('name').notNull(),
  slug:        text('slug').notNull().unique(),
  verticalId:  text('vertical_id').notNull(),  // 'livestock' | 'mining' | ...
  plan:        workspacePlanEnum('plan').notNull().default('free'),
  settings:    jsonb('settings').notNull().default('{}'),
  isActive:    boolean('is_active').notNull().default(true),
  createdAt:   timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:   timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// ─── WorkspaceMembers ────────────────────────────────────────────
export const workspaceMembers = pgTable("workspace_members", {
  id:           text('id').primaryKey().$defaultFn(() => createId()),
  workspaceId:  text('workspace_id').notNull().references(() => workspaces.id),
  personId:     text('person_id').notNull(),  // FK a persons (se agrega en Fase A)
  publicKey:    text('public_key').notNull(),  // Ed25519 public key hex
  roles:        text('roles').array().notNull().default(['{}']),
  status:       text('status').notNull().default('active'),  // active|suspended|revoked
  invitedAt:    timestamp('invited_at', { withTimezone: true }).notNull().defaultNow(),
  acceptedAt:   timestamp('accepted_at', { withTimezone: true }),
  revokedAt:    timestamp('revoked_at', { withTimezone: true }),
  createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('idx_workspace_members_workspace_id').on(table.workspaceId)
])

// ─── Teams ───────────────────────────────────────────────────────
export const teams = pgTable("teams", {
  id:           text('id').primaryKey().$defaultFn(() => createId()),
  workspaceId:  text('workspace_id').notNull().references(() => workspaces.id),
  name:         text('name').notNull(),
  description:  text('description'),
  createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('idx_teams_workspace_id').on(table.workspaceId)
])

// ─── Employees ───────────────────────────────────────────────────
export const employees = pgTable("employees", {
  id:           text('id').primaryKey().$defaultFn(() => createId()),
  workspaceId:  text('workspace_id').notNull().references(() => workspaces.id),
  name:         text('name').notNull(),
  role:         text('role').notNull(),  // label descriptivo (peón, capataz, etc.)
  dni:          text('dni'),
  supervisorId: text('supervisor_id').references(() => workspaceMembers.id),
  memberId:     text('member_id').references(() => workspaceMembers.id),  // si tiene cuenta
  isActive:     boolean('is_active').notNull().default(true),
  createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('idx_employees_workspace_id').on(table.workspaceId)
])
