"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
/* eslint-disable no-undef */
/* eslint-disable no-console */
const zod_1 = require("zod");
// ─── Schema de variables requeridas (siempre) ────────────────────────
const baseSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'staging', 'production']),
    // ─── Database (Neon)
    DATABASE_URL: zod_1.z.string().url().startsWith("postgresql://"),
    DATABASE_URL_UNPOOLED: zod_1.z.string().url().startsWith("postgresql://"),
    // ─── URLs internas
    APP_URL: zod_1.z.string().url(),
    WEB_URL: zod_1.z.string().url(),
    PLATFORM_URL: zod_1.z.string().url(),
    VERIFY_URL: zod_1.z.string().url(),
});
// ─── Schema de variables opcionales (se agregan por fase) ───────────
const optionalSchema = zod_1.z.object({
    // Fase A.2 — Auth
    JWT_SECRET: zod_1.z.string().min(64).optional(),
    JWT_REFRESH_SECRET: zod_1.z.string().min(64).optional(),
    // Fase A.3 — Redis (Upstash en staging/prod, Docker local en dev)
    REDIS_URL: zod_1.z.string().optional(),
    UPSTASH_REDIS_URL: zod_1.z.string().url().optional(),
    UPSTASH_REDIS_TOKEN: zod_1.z.string().optional(),
    // Fase A.3 — Blockchain
    POLYGON_RPC_URL: zod_1.z.string().url().optional(),
    POLYGON_PRIVATE_KEY: zod_1.z.string().optional(),
    // Fase B.1 — Email
    RESEND_API_KEY: zod_1.z.string().optional(),
    // Fase B.3 — Storage
    AWS_S3_BUCKET: zod_1.z.string().optional(),
    AWS_ACCESS_KEY_ID: zod_1.z.string().optional(),
    AWS_SECRET_ACCESS_KEY: zod_1.z.string().optional(),
    AWS_REGION: zod_1.z.string().optional(),
    // Fase A.3 — Observabilidad
    SENTRY_DSN: zod_1.z.string().url().optional(),
});
const envSchema = baseSchema.merge(optionalSchema);
// ─── Parsear y exportar ──────────────────────────────────────────────
const _parsed = envSchema.safeParse(process.env);
if (!_parsed.success) {
    console.error("❌ Variables de entorno inválidas o faltantes:");
    console.error(_parsed.error.flatten().fieldErrors);
    console.error("");
    console.error("Asegurarse de que Doppler está configurado:");
    console.error("  doppler setup");
    console.error("  doppler run -- [tu comando]");
    process.exit(1);
}
exports.env = _parsed.data;
//# sourceMappingURL=env.js.map