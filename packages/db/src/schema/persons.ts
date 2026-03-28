import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

// ─── Persons ───────────────────────────────────────────────────
// Una persona física real (o entidad legal). Identidad agnóstica a un Workspace.
export const persons = pgTable("persons", {
  id:           text('id').primaryKey().$defaultFn(() => createId()),
  name:         text('name').notNull(),
  email:        text('email').notNull().unique(),
  phone:        text('phone'),
  createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:    timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// ─── Credentials ───────────────────────────────────────────────
// Credenciales de acceso para una Person. El password está hasheado en Argon2id.
export const credentials = pgTable("credentials", {
  id:           text('id').primaryKey().$defaultFn(() => createId()),
  personId:     text('person_id').notNull().references(() => persons.id).unique(), // 1:1 for now
  passwordHash: text('password_hash').notNull(),
  updatedAt:    timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
