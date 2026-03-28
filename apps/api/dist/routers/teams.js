"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamsRouter = void 0;
const zod_1 = require("zod");
const trpc_1 = require("../trpc");
const schema_1 = require("@biffco/db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const rbac_1 = require("@biffco/core/rbac");
exports.teamsRouter = (0, trpc_1.router)({
    list: trpc_1.protectedProcedure
        .query(async ({ ctx }) => {
        return ctx.db.select().from(schema_1.teams).where((0, drizzle_orm_1.eq)(schema_1.teams.workspaceId, ctx.workspaceId));
    }),
    create: (0, trpc_1.requirePermission)(rbac_1.Permission.ORG_MANAGE)
        .input(zod_1.z.object({
        name: zod_1.z.string().min(2).max(100),
        description: zod_1.z.string().optional(),
    }))
        .mutation(async ({ input, ctx }) => {
        const [newTeam] = await ctx.db.insert(schema_1.teams).values({
            workspaceId: ctx.workspaceId,
            name: input.name,
            description: input.description,
        }).returning();
        return newTeam;
    }),
    update: (0, trpc_1.requirePermission)(rbac_1.Permission.ORG_MANAGE)
        .input(zod_1.z.object({
        id: zod_1.z.string(),
        name: zod_1.z.string().min(2).max(100).optional(),
        description: zod_1.z.string().optional(),
    }))
        .mutation(async ({ input, ctx }) => {
        const { id, ...updates } = input;
        const [updated] = await ctx.db.update(schema_1.teams)
            .set(updates)
            .where((0, drizzle_orm_1.eq)(schema_1.teams.id, id))
            .returning();
        return updated;
    }),
});
//# sourceMappingURL=teams.js.map