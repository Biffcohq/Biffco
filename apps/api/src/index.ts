/* global process */
/* eslint-env node */
import 'dotenv/config'
import './instrument'
import './telemetry'
import './workers/anchor'
import { scheduleExpirationCron } from './workers/cron-worker'

import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import jwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { createContext } from './trpc'
import { appRouter } from './routers/index'
import { setupPdfRoutes } from './routers/pdf-route'
import { env } from '@biffco/config'
import { db } from '@biffco/db'
import { verticalRegistry } from '@biffco/core/vertical-engine'
import { livestockVerticalPack } from '@biffco/livestock'

export type { AppRouter } from './routers/index'

// Registro dinámico de la Fase C: Vertical Ganadero
verticalRegistry.register(livestockVerticalPack)

const app = Fastify({ logger: { level: "info" } })

const buildServer = async () => {
  // ─── Plugins ─────────────────────────────────────────────────────
  // Register the main web, platform, verify URLs for CORS from config 
  const allowedOrigins = [env.PLATFORM_URL, env.VERIFY_URL, env.WEB_URL].filter(Boolean) as string[]
  await app.register(cors, { 
    origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
    credentials: true // Necesario para cookies HttpOnly (C-05)
  })

  await app.register(helmet, { 
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false
  })
  await app.register(rateLimit, { max: 100, timeWindow: '1 minute' })

  // Registrar fastify-cookie (C-05)
  await app.register(fastifyCookie, {
    secret: env.JWT_SECRET || "biffco_cookie_secret_fallback", // for signed cookies
  })

  // JWT Setup.
  if (!env.JWT_SECRET) {
    if (process.env.NODE_ENV !== "development") {
       throw new Error('FATAL: JWT_SECRET is required in non-development environments');
    }
    app.log.warn("JWT_SECRET no encontrada, usando secreto fallback para entorno local.")
  }
  await app.register(jwt, { secret: env.JWT_SECRET || "biffco_local_dev_secret_fallback_12345" })

  // ─── tRPC ─────────────────────────────────────────────────────────
  await app.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: { router: appRouter, createContext }
  })

  // ─── Native REST / PDF Endpoints ──────────────────────────────────
  await setupPdfRoutes(app)

  // ─── Health check ─────────────────────────────────────────────────
  app.get('/health', async () => {
    try {
      // Verificar DB Connection.
      await db.execute(`SELECT 1`)
      return { status: "ok", db: "connected", api_version: "v0.1.0-A.3" }
    } catch (error) {
      app.log.error(error, "Error conectando a db en /health:")
      return { status: "degraded", db: "error" }
    }
  })

  app.get('/', async () => {
    return { status: "ok", service: "Biffco API" }
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

    // Arrancar cronjobs asincrónicos integrados
    await scheduleExpirationCron()
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

void start()
