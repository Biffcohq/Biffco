"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const zod_1 = require("zod");
const server_1 = require("@trpc/server");
const cuid2_1 = require("@paralleldrive/cuid2");
const trpc_1 = require("../trpc");
const schema_1 = require("@biffco/db/schema");
const db_1 = require("@biffco/db");
const redis_1 = require("../redis");
const rbac_1 = require("@biffco/core/rbac");
exports.authRouter = (0, trpc_1.router)({
    checkEmail: trpc_1.publicProcedure
        .input(zod_1.z.object({ email: zod_1.z.string().email().toLowerCase() }))
        .query(async ({ input, ctx }) => {
        const { db } = ctx;
        const existing = await db.select().from(schema_1.persons).where((0, db_1.eq)(schema_1.persons.email, input.email)).limit(1);
        return { available: existing.length === 0 };
    }),
    checkSlug: trpc_1.publicProcedure
        .input(zod_1.z.object({ slug: zod_1.z.string().min(2).max(50).regex(/^[a-z0-9-]+$/) }))
        .query(async ({ input, ctx }) => {
        const { db } = ctx;
        const existing = await db.select().from(schema_1.workspaces).where((0, db_1.eq)(schema_1.workspaces.slug, input.slug)).limit(1);
        return { available: existing.length === 0 };
    }),
    register: trpc_1.publicProcedure
        .input(zod_1.z.object({
        workspaceName: zod_1.z.string().min(2).max(100),
        workspaceSlug: zod_1.z.string().min(2).max(50).regex(/^[a-z0-9-]+$/),
        country: zod_1.z.string().length(2),
        verticalId: zod_1.z.string().min(1),
        initialRoles: zod_1.z.array(zod_1.z.string()).min(1),
        personName: zod_1.z.string().min(2).max(100),
        email: zod_1.z.string().email().toLowerCase(),
        passwordHash: zod_1.z.string().min(64), // Hash Argon2id del password
        publicKey: zod_1.z.string().min(64).max(130), // Ed25519 public key hex
        wsIdx: zod_1.z.number().int().min(0),
    }))
        .mutation(async ({ input, ctx }) => {
        const { db } = ctx;
        // 3. Verificar que el slug no está tomado
        const existing = await db.select()
            .from(schema_1.workspaces)
            .where((0, db_1.eq)(schema_1.workspaces.slug, input.workspaceSlug))
            .limit(1);
        if (existing.length > 0) {
            throw new server_1.TRPCError({ code: "CONFLICT", message: "El slug ya está en uso" });
        }
        // Check if person email already exists
        const existingPerson = await db.select()
            .from(schema_1.persons)
            .where((0, db_1.eq)(schema_1.persons.email, input.email))
            .limit(1);
        if (existingPerson.length > 0) {
            throw new server_1.TRPCError({ code: "CONFLICT", message: "El correo electrónico ya está registrado" });
        }
        const workspaceId = (0, cuid2_1.createId)();
        const personId = (0, cuid2_1.createId)();
        const memberId = (0, cuid2_1.createId)();
        const credentialId = (0, cuid2_1.createId)();
        try {
            await db.transaction(async (tx) => {
                // 4. Create Person
                await tx.insert(schema_1.persons).values({
                    id: personId,
                    name: input.personName,
                    email: input.email,
                });
                // 5. Create Credentials
                await tx.insert(schema_1.credentials).values({
                    id: credentialId,
                    personId,
                    passwordHash: input.passwordHash,
                });
                // 6. Create Workspace
                await tx.insert(schema_1.workspaces).values({
                    id: workspaceId,
                    name: input.workspaceName,
                    slug: input.workspaceSlug,
                    verticalId: input.verticalId,
                    plan: "free",
                    settings: { country: input.country },
                });
                // 7. Create WorkspaceMember
                await tx.insert(schema_1.workspaceMembers).values({
                    id: memberId,
                    workspaceId,
                    personId,
                    publicKey: input.publicKey,
                    roles: input.initialRoles,
                    status: "active",
                    acceptedAt: new Date(),
                });
            });
        }
        catch (err) {
            throw new server_1.TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: `DB_ERR: ${err?.message || 'unknown'} | Code: ${err?.code || err?.routine} | Detail: ${err?.detail}`
            });
        }
        // 6. Generar el JWT con permisos
        const pack = ctx.verticalRegistry.get(input.verticalId);
        // Base permissions any member has
        const finalPerms = new Set(["events.read", "assets.read"]);
        // If admin, grant all standard perms
        if (input.initialRoles.includes("admin")) {
            Object.values(rbac_1.Permission).forEach(p => finalPerms.add(p));
            if (pack) {
                pack.customPermissions.forEach(p => finalPerms.add(p));
            }
        }
        const accessToken = await ctx.request.server.jwt.sign({
            workspaceId,
            memberId,
            permissions: Array.from(finalPerms),
            wsIdx: input.wsIdx,
            jti: (0, cuid2_1.createId)(),
        }, { expiresIn: "15m" });
        const refreshToken = await ctx.request.server.jwt.sign({
            memberId,
            type: "refresh",
            jti: (0, cuid2_1.createId)(),
        }, { expiresIn: "30d" });
        return { accessToken, refreshToken, workspaceId, memberId };
    }),
    // ─── LOGIN & LOGOUT ───────────────────────────────────────────
    login: trpc_1.publicProcedure
        .input(zod_1.z.object({
        email: zod_1.z.string().email().toLowerCase(),
        passwordHash: zod_1.z.string().min(64),
    }))
        .mutation(async ({ input, ctx }) => {
        const { db } = ctx;
        // 1. Encontrar la persona
        const personArr = await db.select().from(schema_1.persons).where((0, db_1.eq)(schema_1.persons.email, input.email)).limit(1);
        const person = personArr[0];
        if (!person) {
            throw new server_1.TRPCError({ code: "UNAUTHORIZED", message: "Credenciales inválidas" });
        }
        // 2. Verificar el hash del password
        const credArr = await db.select().from(schema_1.credentials).where((0, db_1.eq)(schema_1.credentials.personId, person.id)).limit(1);
        const cred = credArr[0];
        if (!cred || cred.passwordHash !== input.passwordHash) {
            // Zero-Knowledge Proof: Comprobamos el hash enviado cliente vs hash guardado servidor
            throw new server_1.TRPCError({ code: "UNAUTHORIZED", message: "Credenciales inválidas" });
        }
        // 3. Obtener el workspace primario del usuario
        const memberArr = await db.select().from(schema_1.workspaceMembers).where((0, db_1.eq)(schema_1.workspaceMembers.personId, person.id)).limit(1);
        const member = memberArr[0];
        if (!member) {
            throw new server_1.TRPCError({ code: "FORBIDDEN", message: "Usuario sin espacios de trabajo activos" });
        }
        // 4. Generar Tokens
        const workspaceId = member.workspaceId;
        const memberId = member.id;
        // Construir permisos reales
        const finalPerms = new Set(["events.read", "assets.read"]);
        if (member.roles.includes("admin")) {
            Object.values(rbac_1.Permission).forEach(p => finalPerms.add(p));
            // Asumiendo que obtenemos el pack del workspace
            const wsArr = await db.select().from(schema_1.workspaces).where((0, db_1.eq)(schema_1.workspaces.id, member.workspaceId)).limit(1);
            if (wsArr[0]) {
                const pack = ctx.verticalRegistry.get(wsArr[0].verticalId);
                if (pack)
                    pack.customPermissions.forEach(p => finalPerms.add(p));
            }
        }
        const accessToken = await ctx.request.server.jwt.sign({
            workspaceId,
            memberId,
            permissions: Array.from(finalPerms),
            wsIdx: 0,
            jti: (0, cuid2_1.createId)(),
        }, { expiresIn: "15m" });
        const refreshToken = await ctx.request.server.jwt.sign({
            memberId,
            type: "refresh",
            jti: (0, cuid2_1.createId)(),
        }, { expiresIn: "30d" });
        return { accessToken, refreshToken, workspaceId, memberId, personName: person.name };
    }),
    logout: trpc_1.protectedProcedure
        .mutation(async ({ ctx }) => {
        // Guardar el jti en redis (15 min expire)
        if (ctx.jti) {
            await redis_1.redis.set(`revoked:${ctx.jti}`, "1", "EX", 900);
        }
        return { ok: true };
    }),
    refresh: trpc_1.publicProcedure
        .input(zod_1.z.object({ refreshToken: zod_1.z.string() }))
        .mutation(async () => {
        return { accessToken: "refreshed_mock" };
    }),
});
//# sourceMappingURL=auth.js.map