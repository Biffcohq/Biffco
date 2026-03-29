"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamsRouter = void 0;
const zod_1 = require("zod");
const trpc_1 = require("../trpc");
const schema_1 = require("@biffco/db/schema");
const db_1 = require("@biffco/db");
const rbac_1 = require("@biffco/core/rbac");
exports.teamsRouter = (0, trpc_1.router)({
    list: trpc_1.protectedProcedure
        .query(async ({ ctx }) => {
        // Returns all teams with an array of their member IDs.
        const allTeams = await ctx.db.select().from(schema_1.teams).where((0, db_1.eq)(schema_1.teams.workspaceId, ctx.workspaceId));
        const allMembers = await ctx.db.select().from(schema_1.teamMembers);
        // Group members by teamId
        return allTeams.map(t => ({
            ...t,
            memberIds: allMembers.filter(m => m.teamId === t.id).map(m => m.memberId)
        }));
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
            .where((0, db_1.eq)(schema_1.teams.id, id))
            .returning();
        return updated;
    }),
    delete: (0, trpc_1.requirePermission)(rbac_1.Permission.ORG_MANAGE)
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .mutation(async ({ input, ctx }) => {
        const [deleted] = await ctx.db.delete(schema_1.teams)
            .where((0, db_1.and)((0, db_1.eq)(schema_1.teams.id, input.id), (0, db_1.eq)(schema_1.teams.workspaceId, ctx.workspaceId)))
            .returning();
        return deleted;
    }),
    addMember: (0, trpc_1.requirePermission)(rbac_1.Permission.ORG_MANAGE)
        .input(zod_1.z.object({
        teamId: zod_1.z.string(),
        memberId: zod_1.z.string(),
    }))
        .mutation(async ({ input, ctx }) => {
        // Validar que el team pertenece al workspace
        const team = await ctx.db.query.teams.findFirst({
            where: (0, db_1.and)((0, db_1.eq)(schema_1.teams.id, input.teamId), (0, db_1.eq)(schema_1.teams.workspaceId, ctx.workspaceId))
        });
        if (!team)
            throw new Error("Team not found");
        const [newMember] = await ctx.db.insert(schema_1.teamMembers).values({
            teamId: input.teamId,
            memberId: input.memberId,
        }).returning();
        return newMember;
    }),
    removeMember: (0, trpc_1.requirePermission)(rbac_1.Permission.ORG_MANAGE)
        .input(zod_1.z.object({
        teamId: zod_1.z.string(),
        memberId: zod_1.z.string(),
    }))
        .mutation(async ({ input, ctx }) => {
        const team = await ctx.db.query.teams.findFirst({
            where: (0, db_1.and)((0, db_1.eq)(schema_1.teams.id, input.teamId), (0, db_1.eq)(schema_1.teams.workspaceId, ctx.workspaceId))
        });
        if (!team)
            throw new Error("Team not found");
        const [removed] = await ctx.db.delete(schema_1.teamMembers)
            .where((0, db_1.and)((0, db_1.eq)(schema_1.teamMembers.teamId, input.teamId), (0, db_1.eq)(schema_1.teamMembers.memberId, input.memberId)))
            .returning();
        return removed;
    }),
});
//# sourceMappingURL=teams.js.map