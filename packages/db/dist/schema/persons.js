"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.credentials = exports.persons = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const cuid2_1 = require("@paralleldrive/cuid2");
// ─── Persons ───────────────────────────────────────────────────
// Una persona física real (o entidad legal). Identidad agnóstica a un Workspace.
exports.persons = (0, pg_core_1.pgTable)("persons", {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, cuid2_1.createId)()),
    name: (0, pg_core_1.text)('name').notNull(),
    email: (0, pg_core_1.text)('email').notNull().unique(),
    phone: (0, pg_core_1.text)('phone'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
// ─── Credentials ───────────────────────────────────────────────
// Credenciales de acceso para una Person. El password está hasheado en Argon2id.
exports.credentials = (0, pg_core_1.pgTable)("credentials", {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, cuid2_1.createId)()),
    personId: (0, pg_core_1.text)('person_id').notNull().references(() => exports.persons.id).unique(), // 1:1 for now
    passwordHash: (0, pg_core_1.text)('password_hash').notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
//# sourceMappingURL=persons.js.map