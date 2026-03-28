"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const fastify_2 = require("@trpc/server/adapters/fastify");
const trpc_1 = require("./trpc");
const index_1 = require("./routers/index");
const config_1 = require("@biffco/config");
const db_1 = require("@biffco/db");
const vertical_engine_1 = require("@biffco/core/vertical-engine");
const livestock_1 = require("@biffco/livestock");
// --- MOCK VERTICAL PACK ---
vertical_engine_1.VerticalRegistry.register(livestock_1.livestockVertical);
const app = (0, fastify_1.default)({ logger: { level: "info" } });
const buildServer = async () => {
    // ─── Plugins ─────────────────────────────────────────────────────
    // Register the main web, platform, verify URLs for CORS from config 
    const allowedOrigins = [config_1.env.PLATFORM_URL, config_1.env.VERIFY_URL, config_1.env.WEB_URL].filter(Boolean);
    await app.register(cors_1.default, { origin: allowedOrigins.length > 0 ? allowedOrigins : "*" });
    await app.register(helmet_1.default, {
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: false,
        crossOriginOpenerPolicy: false
    });
    await app.register(rate_limit_1.default, { max: 100, timeWindow: '1 minute' });
    // JWT Setup.
    if (!config_1.env.JWT_SECRET) {
        app.log.warn("JWT_SECRET no encontrada, usando secreto fallback para entorno local.");
    }
    await app.register(jwt_1.default, { secret: config_1.env.JWT_SECRET || "biffco_local_dev_secret_fallback_12345" });
    // ─── tRPC ─────────────────────────────────────────────────────────
    await app.register(fastify_2.fastifyTRPCPlugin, {
        prefix: '/trpc',
        trpcOptions: { router: index_1.appRouter, createContext: trpc_1.createContext }
    });
    // ─── Health check ─────────────────────────────────────────────────
    app.get('/health', async () => {
        try {
            // Verificar DB Connection.
            await db_1.db.execute(`SELECT 1`);
            return { status: "ok", db: "connected", api_version: "v0.1.0-A.2" };
        }
        catch (error) {
            app.log.error(error, "Error conectando a db en /health:");
            return { status: "degraded", db: "error" };
        }
    });
    return app;
};
// ─── Run Server ───────────────────────────────────────────────────
const start = async () => {
    try {
        await buildServer();
        const port = Number(process.env.PORT) || 3001;
        await app.listen({ port, host: "0.0.0.0" });
        app.log.info(`[BIFFCO API] Corriendo en puerto ${port}`);
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=index.js.map