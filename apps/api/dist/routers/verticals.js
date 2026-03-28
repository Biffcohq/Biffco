"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verticalsRouter = void 0;
const trpc_1 = require("../trpc");
exports.verticalsRouter = (0, trpc_1.router)({
    list: trpc_1.publicProcedure
        .query(async ({ ctx }) => {
        // Retorna todos los VerticalPacks registrados en el registry
        // Esto servirá para renderizar dinámicamente el Paso 2 del Wizard
        return ctx.verticalRegistry.listPacks();
    })
});
//# sourceMappingURL=verticals.js.map