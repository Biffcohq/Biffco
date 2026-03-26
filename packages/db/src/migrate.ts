/* eslint-disable no-undef, no-console */
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'

const databaseUrl = process.env.DATABASE_URL_UNPOOLED || "postgresql://biffco:biffco_pass@localhost:5432/biffco";
const migrationClient = postgres(databaseUrl, { max: 1 });
const db = drizzle(migrationClient);

async function main() {
  console.log("🚀 Iniciando migración de la Base de Datos BIFFCO...");
  await migrate(db, { migrationsFolder: './src/migrations' });
  console.log("✅ Migraciones aplicadas existosamente.");
  process.exit(0);
}

main().catch(err => {
  console.error("❌ Error durante la migración:", err);
  process.exit(1);
});
