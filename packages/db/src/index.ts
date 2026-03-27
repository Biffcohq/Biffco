import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '@biffco/config';

// ─── Conexión a Base de Datos Central Biffco ───────────
// En entornos productivos utilizaríamos Neon Serverless.
// Por ahora, configuramos postgres.js estándar.

const connectionString = env.DATABASE_URL || "postgresql://biffco:biffco_pass@localhost:5432/biffco";
const queryClient = postgres(connectionString);

export const db = drizzle(queryClient, { schema, logger: env.NODE_ENV === "development" });
export * as schema from './schema';
