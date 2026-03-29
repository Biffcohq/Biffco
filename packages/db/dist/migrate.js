"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-undef, no-console */
const migrator_1 = require("drizzle-orm/postgres-js/migrator");
const postgres_1 = __importDefault(require("postgres"));
const postgres_js_1 = require("drizzle-orm/postgres-js");
const databaseUrl = process.env.DATABASE_URL_UNPOOLED || "postgresql://biffco:biffco_pass@localhost:5432/biffco";
const migrationClient = (0, postgres_1.default)(databaseUrl, { max: 1 });
const db = (0, postgres_js_1.drizzle)(migrationClient);
async function main() {
    console.log("🚀 Iniciando migración de la Base de Datos BIFFCO...");
    await (0, migrator_1.migrate)(db, { migrationsFolder: './src/migrations' });
    console.log("✅ Migraciones aplicadas existosamente.");
    process.exit(0);
}
main().catch(err => {
    console.error("❌ Error durante la migración:", err);
    process.exit(1);
});
//# sourceMappingURL=migrate.js.map