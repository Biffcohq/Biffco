"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workspaceMembersRouter = void 0;
const zod_1 = require("zod");
const server_1 = require("@trpc/server");
const trpc_1 = require("../trpc");
const schema_1 = require("@biffco/db/schema");
const db_1 = require("@biffco/db");
const rbac_1 = require("@biffco/core/rbac");
const cuid2_1 = require("@paralleldrive/cuid2");
const redis_1 = require("../redis");
const email_1 = require("@biffco/email");
const config_1 = require("@biffco/config");
exports.workspaceMembersRouter = (0, trpc_1.router)({
    list: trpc_1.protectedProcedure
        .query(async ({ ctx }) => {
        // Middleware RLS ensures we only fetch for the current workspace
        return ctx.db.select().from(schema_1.workspaceMembers).where((0, db_1.eq)(schema_1.workspaceMembers.workspaceId, ctx.workspaceId));
    }),
    getById: trpc_1.protectedProcedure
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .query(async ({ input, ctx }) => {
        const member = await ctx.db.query.workspaceMembers.findFirst({
            where: (0, db_1.eq)(schema_1.workspaceMembers.id, input.id),
        });
        if (!member)
            throw new server_1.TRPCError({ code: "NOT_FOUND" });
        return member;
    }),
    invite: (0, trpc_1.requirePermission)(rbac_1.Permission.MEMBERS_INVITE)
        .input(zod_1.z.object({
        email: zod_1.z.string().email(),
        roles: zod_1.z.array(zod_1.z.string()).min(1),
    }))
        .mutation(async ({ input, ctx }) => {
        // 1. Obtener información del workspace actual
        const workspace = await ctx.db.query.workspaces.findFirst({
            where: (0, db_1.eq)(schema_1.workspaces.id, ctx.workspaceId)
        });
        if (!workspace)
            throw new server_1.TRPCError({ code: "NOT_FOUND" });
        // 2. Crear un member "pending" sin public key por ahora
        const [newMember] = await ctx.db.insert(schema_1.workspaceMembers).values({
            workspaceId: ctx.workspaceId,
            personId: (0, cuid2_1.createId)(), // Mock person ID for uninvited
            publicKey: "",
            roles: input.roles,
            status: "invited",
            invitedAt: new Date(),
        }).returning();
        // 3. Generar token y guardarlo en Redis con TTL de 72h
        const inviteToken = (0, cuid2_1.createId)();
        const inviteData = {
            workspaceId: ctx.workspaceId,
            memberId: newMember.id,
            email: input.email
        };
        await redis_1.redis.set(`INVITE:${inviteToken}`, JSON.stringify(inviteData), 'EX', 72 * 60 * 60);
        // 4. Enviar email de invitación
        const acceptUrl = `${config_1.env.PLATFORM_URL ?? 'http://localhost:3000'}/invite/accept?token=${inviteToken}`;
        const verticalLabel = workspace.verticalId === 'livestock' ? 'Ganadería' : 'Minería';
        await (0, email_1.sendEmail)({
            to: input.email,
            subject: `Invitación a ${workspace.name}`,
            component: email_1.InvitationEmail,
            props: {
                workspaceName: workspace.name,
                inviterName: 'Un administrador', // Podríamos buscar el nombre del llamador
                verticalLabel,
                acceptUrl
            }
        });
        return newMember;
    }),
    acceptInvite: trpc_1.publicProcedure
        .input(zod_1.z.object({
        inviteToken: zod_1.z.string(),
        publicKey: zod_1.z.string().min(64),
        wsIdx: zod_1.z.number().int().min(0),
    }))
        .mutation(async ({ input, ctx }) => {
        // 1. Validar token
        const inviteDataStr = await redis_1.redis.get(`INVITE:${input.inviteToken}`);
        if (!inviteDataStr) {
            throw new server_1.TRPCError({ code: "BAD_REQUEST", message: "Token de invitación inválido o expirado." });
        }
        const inviteData = JSON.parse(inviteDataStr);
        // 2. Marcar como activo y asentar clave pública
        const [updated] = await ctx.db.update(schema_1.workspaceMembers)
            .set({ status: "active", publicKey: input.publicKey, acceptedAt: new Date() })
            .where((0, db_1.eq)(schema_1.workspaceMembers.id, inviteData.memberId))
            .returning();
        if (!updated)
            throw new server_1.TRPCError({ code: "NOT_FOUND", message: "Miembro no encontrado" });
        // 3. Destruir token
        await redis_1.redis.del(`INVITE:${input.inviteToken}`);
        // 4. Obtener nombre del workspace para el email de bienvenida
        const workspace = await ctx.db.query.workspaces.findFirst({
            where: (0, db_1.eq)(schema_1.workspaces.id, inviteData.workspaceId)
        });
        // 5. Email de bienvenida
        if (workspace) {
            await (0, email_1.sendEmail)({
                to: inviteData.email,
                subject: `Bienvenido a ${workspace.name}`,
                component: email_1.WelcomeEmail,
                props: {
                    workspaceName: workspace.name,
                    memberName: 'Miembro',
                    verticalLabel: workspace.verticalId === 'livestock' ? 'Ganadería' : 'Minería',
                    dashboardUrl: config_1.env.PLATFORM_URL ?? 'http://localhost:3000',
                    firstSteps: ['Configurá tu cuenta', 'Revisá los activos', 'Invitá a tu equipo']
                }
            });
        }
        // NOTA: Para obtener un JWT de sesión, el cliente o bien se loguea 
        // o le disparamos un token nuevo (pero el auth router suele encargarse).
        // Devolvemos el miembro activado.
        return updated;
    }),
    revoke: (0, trpc_1.requirePermission)(rbac_1.Permission.MEMBERS_REVOKE)
        .input(zod_1.z.object({ memberId: zod_1.z.string() }))
        .mutation(async ({ input, ctx }) => {
        if (input.memberId === ctx.memberId) {
            throw new server_1.TRPCError({ code: "BAD_REQUEST", message: "Cannot revoke yourself" });
        }
        const [revoked] = await ctx.db.update(schema_1.workspaceMembers)
            .set({ status: "revoked", revokedAt: new Date() })
            .where((0, db_1.eq)(schema_1.workspaceMembers.id, input.memberId))
            .returning();
        return revoked;
    }),
});
//# sourceMappingURL=workspace-members.js.map