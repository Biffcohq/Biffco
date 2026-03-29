"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeesRouter = void 0;
const zod_1 = require("zod");
const server_1 = require("@trpc/server");
const trpc_1 = require("../trpc");
const schema_1 = require("@biffco/db/schema");
const db_1 = require("@biffco/db");
const rbac_1 = require("@biffco/core/rbac");
exports.employeesRouter = (0, trpc_1.router)({
    list: trpc_1.protectedProcedure
        .query(async ({ ctx }) => {
        return ctx.db.select().from(schema_1.employees).where((0, db_1.eq)(schema_1.employees.workspaceId, ctx.workspaceId));
    }),
    getById: trpc_1.protectedProcedure
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .query(async ({ input, ctx }) => {
        const employee = await ctx.db.query.employees.findFirst({
            where: (0, db_1.eq)(schema_1.employees.id, input.id),
        });
        if (!employee)
            throw new server_1.TRPCError({ code: "NOT_FOUND" });
        return employee;
    }),
    create: (0, trpc_1.requirePermission)(rbac_1.Permission.EMPLOYEES_MANAGE)
        .input(zod_1.z.object({
        name: zod_1.z.string().min(2).max(100),
        role: zod_1.z.string().min(2).max(50),
        dni: zod_1.z.string().optional(),
    }))
        .mutation(async ({ input, ctx }) => {
        const [newEmployee] = await ctx.db.insert(schema_1.employees).values({
            workspaceId: ctx.workspaceId,
            name: input.name,
            role: input.role,
            dni: input.dni ?? null,
            supervisorId: ctx.memberId,
        }).returning();
        return newEmployee;
    }),
    update: (0, trpc_1.requirePermission)(rbac_1.Permission.EMPLOYEES_MANAGE)
        .input(zod_1.z.object({
        id: zod_1.z.string(),
        name: zod_1.z.string().min(2).max(100).optional(),
        role: zod_1.z.string().min(2).max(50).optional(),
        dni: zod_1.z.string().optional(),
    }))
        .mutation(async ({ input, ctx }) => {
        const { id, ...updates } = input;
        const [updated] = await ctx.db.update(schema_1.employees)
            .set(updates)
            .where((0, db_1.eq)(schema_1.employees.id, id))
            .returning();
        return updated;
    }),
    deactivate: (0, trpc_1.requirePermission)(rbac_1.Permission.EMPLOYEES_MANAGE)
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .mutation(async ({ input, ctx }) => {
        const [deactivated] = await ctx.db.update(schema_1.employees)
            .set({ isActive: false })
            .where((0, db_1.eq)(schema_1.employees.id, input.id))
            .returning();
        return deactivated;
    }),
});
//# sourceMappingURL=employees.js.map