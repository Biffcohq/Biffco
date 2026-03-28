"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workspaceMembersRouter = void 0;
const zod_1 = require("zod");
const server_1 = require("@trpc/server");
const trpc_1 = require("../trpc");
const schema_1 = require("@biffco/db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const rbac_1 = require("@biffco/core/rbac");
const cuid2_1 = require("@paralleldrive/cuid2");
exports.workspaceMembersRouter = (0, trpc_1.router)({
    list: trpc_1.protectedProcedure
        .query(async ({ ctx }) => {
        // Middleware RLS ensures we only fetch for the current workspace
        return ctx.db.select().from(schema_1.workspaceMembers).where((0, drizzle_orm_1.eq)(schema_1.workspaceMembers.workspaceId, ctx.workspaceId));
    }),
    getById: trpc_1.protectedProcedure
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .query(async ({ input, ctx }) => {
        const member = await ctx.db.query.workspaceMembers.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.workspaceMembers.id, input.id),
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
        // Crear un member "pending" sin public key por ahora
        // Se reemplaza la publicKey con empty y status=invited
        const [newMember] = await ctx.db.insert(schema_1.workspaceMembers).values({
            workspaceId: ctx.workspaceId,
            personId: (0, cuid2_1.createId)(), // Mock person ID for uninvited
            publicKey: "",
            roles: input.roles,
            status: "invited",
            invitedAt: new Date(),
        }).returning();
        return newMember;
    }),
    revoke: (0, trpc_1.requirePermission)(rbac_1.Permission.MEMBERS_REVOKE)
        .input(zod_1.z.object({ memberId: zod_1.z.string() }))
        .mutation(async ({ input, ctx }) => {
        if (input.memberId === ctx.memberId) {
            throw new server_1.TRPCError({ code: "BAD_REQUEST", message: "Cannot revoke yourself" });
        }
        const [revoked] = await ctx.db.update(schema_1.workspaceMembers)
            .set({ status: "revoked", revokedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.workspaceMembers.id, input.memberId))
            .returning();
        return revoked;
    }),
});
//# sourceMappingURL=workspace-members.js.map