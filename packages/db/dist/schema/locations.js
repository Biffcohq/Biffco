"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parcels = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const workspaces_1 = require("./workspaces");
const cuid2_1 = require("@paralleldrive/cuid2");
exports.parcels = (0, pg_core_1.pgTable)("parcels", {
    id: (0, pg_core_1.text)('id').primaryKey().$defaultFn(() => (0, cuid2_1.createId)()),
    workspaceId: (0, pg_core_1.text)('workspace_id').notNull().references(() => workspaces_1.workspaces.id),
    name: (0, pg_core_1.text)('name').notNull(),
    geoJson: (0, pg_core_1.jsonb)('geo_json').notNull(), // Contiene properties, geometry, etc. En el futuro migrable a custom_type Geometry
    areaHectares: (0, pg_core_1.text)('area_hectares'),
    isActive: (0, pg_core_1.boolean)('is_active').notNull().default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).notNull().defaultNow()
});
//# sourceMappingURL=locations.js.map