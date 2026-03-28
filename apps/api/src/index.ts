import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import jwt from '@fastify/jwt'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { createContext } from './trpc'
import { appRouter } from './routers/index'
import { env } from '@biffco/config'
import { db } from '@biffco/db'
import { VerticalRegistry } from '@biffco/core/vertical-engine'
import { livestockVertical } from '@biffco/livestock'

export type { AppRouter } from './routers/index'

// --- MOCK VERTICAL PACK ---
VerticalRegistry.register(livestockVertical)

const app = Fastify({ logger: { level: "info" } })

const buildServer = async () => {
  // ─── Plugins ─────────────────────────────────────────────────────
  // Register the main web, platform, verify URLs for CORS from config 
  const allowedOrigins = [env.PLATFORM_URL, env.VERIFY_URL, env.WEB_URL].filter(Boolean) as string[]
  await app.register(cors, { origin: allowedOrigins.length > 0 ? allowedOrigins : "*" })

  await app.register(helmet, { 
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false
  })
  await app.register(rateLimit, { max: 100, timeWindow: '1 minute' })

  // JWT Setup.
  if (!env.JWT_SECRET) {
    app.log.warn("JWT_SECRET no encontrada, usando secreto fallback para entorno local.")
  }
  await app.register(jwt, { secret: env.JWT_SECRET || "biffco_local_dev_secret_fallback_12345" })

  // ─── tRPC ─────────────────────────────────────────────────────────
  await app.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: { router: appRouter, createContext }
  })

  // ─── Health check ─────────────────────────────────────────────────
  app.get('/health', async () => {
    try {
      // Verificar DB Connection.
      await db.execute(`SELECT 1`)
      return { status: "ok", db: "connected", api_version: "v0.1.0-A.2" }
    } catch (error) {
      app.log.error(error, "Error conectando a db en /health:")
      return { status: "degraded", db: "error" }
    }
  })

  return app
}

// ─── Run Server ───────────────────────────────────────────────────
const start = async () => {
  try {
    await buildServer()
    const port = Number(process.env.PORT) || 3001
    await app.listen({ port, host: "0.0.0.0" })
    app.log.info(`[BIFFCO API] Corriendo en puerto ${port}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
