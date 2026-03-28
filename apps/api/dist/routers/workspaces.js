"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workspacesRouter = void 0;
const zod_1 = require("zod");
const server_1 = require("@trpc/server");
const trpc_1 = require("../trpc");
const schema_1 = require("@biffco/db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const rbac_1 = require("@biffco/core/rbac");
exports.workspacesRouter = (0, trpc_1.router)({
    getProfile: trpc_1.protectedProcedure
        .query(async ({ ctx }) => {
        const workspace = await ctx.db.query.workspaces.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.workspaces.id, ctx.workspaceId),
        });
        if (!workspace) {
            throw new server_1.TRPCError({ code: "NOT_FOUND", message: "Workspace not found" });
        }
        return workspace;
    }),
    updateProfile: (0, trpc_1.requirePermission)(rbac_1.Permission.ORG_MANAGE)
        .input(zod_1.z.object({
        name: zod_1.z.string().min(2).max(100).optional(),
        slug: zod_1.z.string().min(2).max(50).regex(/^[a-z0-9-]+$/).optional(),
        settings: zod_1.z.record(zod_1.z.unknown()).optional(),
    }))
        .mutation(async ({ input, ctx }) => {
        const [updated] = await ctx.db.update(schema_1.workspaces)
            .set({
            ...input,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(schema_1.workspaces.id, ctx.workspaceId))
            .returning();
        return updated;
    }),
});
//# sourceMappingURL=workspaces.js.map