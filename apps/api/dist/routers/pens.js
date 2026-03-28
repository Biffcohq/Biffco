"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pensRouter = void 0;
const zod_1 = require("zod");
const trpc_1 = require("../trpc");
// MOCK: La tabla pens no existe aún en el schema de Prisma/Drizzle.
// Se devolverán arreglos vacíos o mock para interactuar con Playwright/Frontend temporalmente.
exports.pensRouter = (0, trpc_1.router)({
    create: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        name: zod_1.z.string().min(1),
        capacity: zod_1.z.number().optional(),
    }))
        .mutation(async ({ input }) => {
        return { id: "mock-pen-1", name: input.name, capacity: input.capacity };
    }),
    list: trpc_1.protectedProcedure
        .query(async () => {
        return [];
    }),
    getById: trpc_1.protectedProcedure
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .query(async ({ input }) => {
        return { id: input.id, name: "Mock Pen" };
    }),
    updateOccupancy: trpc_1.protectedProcedure
        .input(zod_1.z.object({ id: zod_1.z.string(), delta: zod_1.z.number() }))
        .mutation(async () => {
        return { ok: true };
    })
});
//# sourceMappingURL=pens.js.map