/* eslint-disable no-undef */
/* eslint-disable no-console */
import { z } from 'zod'

// ─── Schema de variables requeridas (siempre) ────────────────────────
const baseSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  
  // ─── Database (Neon)
  DATABASE_URL: z.string().url().startsWith("postgresql://"),
  DATABASE_URL_UNPOOLED: z.string().url().startsWith("postgresql://"),
  
  // ─── URLs internas
  APP_URL: z.string().url(),
  WEB_URL: z.string().url(),
  PLATFORM_URL: z.string().url(),
  VERIFY_URL: z.string().url(),
})

// ─── Schema de variables opcionales (se agregan por fase) ───────────
const optionalSchema = z.object({
  // Fase A.2 — Auth
  JWT_SECRET: z.string().min(64).optional(),
  JWT_REFRESH_SECRET: z.string().min(64).optional(),
  
  // Fase A.3 — Redis (Upstash en staging/prod, Docker local en dev)
  REDIS_URL: z.string().optional(),
  UPSTASH_REDIS_URL: z.string().url().optional(),
  UPSTASH_REDIS_TOKEN: z.string().optional(),
  
  // Fase A.3 — Blockchain
  POLYGON_RPC_URL: z.string().url().optional(),
  POLYGON_PRIVATE_KEY: z.string().optional(),
  
  // Fase B.1 — Email
  RESEND_API_KEY: z.string().optional(),
  
  // Fase B.3 — Storage
  AWS_S3_BUCKET: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  
  // Fase A.3 — Observabilidad
  SENTRY_DSN: z.string().url().optional(),
})

const envSchema = baseSchema.merge(optionalSchema)

// ─── Parsear y exportar ──────────────────────────────────────────────
const _parsed = envSchema.safeParse(process.env)

if (!_parsed.success) {
  console.error("❌ Variables de entorno inválidas o faltantes:")
  console.error(_parsed.error.flatten().fieldErrors)
  console.error("")
  console.error("Asegurarse de que Doppler está configurado:")
  console.error("  doppler setup")
  console.error("  doppler run -- [tu comando]")
  process.exit(1)
}

export const env = _parsed.data
export type Env = typeof env
