"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const registry_1 = require("./registry");
(0, vitest_1.describe)("VerticalRegistry", () => {
    const dummyPack = {
        id: "bif-tester",
        version: "1.0.0",
        name: "Tester Vertical",
        customPermissions: ["tester.admin"],
        rules: { validateEvent: async () => ({ ok: true }) }
    };
    (0, vitest_1.it)("registra un pack correctamente", () => {
        const registry = new registry_1.VerticalRegistry();
        const result = registry.registerPack(dummyPack);
        (0, vitest_1.expect)(result.ok).toBe(true);
        (0, vitest_1.expect)(registry.getPack("bif-tester")).toEqual(dummyPack);
    });
    (0, vitest_1.it)("previene colisión de IDs (no pisar packs existentes)", () => {
        const registry = new registry_1.VerticalRegistry();
        registry.registerPack(dummyPack);
        const result = registry.registerPack(dummyPack); // Intentar registrar el mismo
        (0, vitest_1.expect)(result.ok).toBe(false);
        if (!result.ok) {
            (0, vitest_1.expect)(result.error).toContain("ya se encuentra registrado");
        }
    });
    (0, vitest_1.it)("deduplica y unifica permisos customs con los base", () => {
        const registry = new registry_1.VerticalRegistry();
        registry.registerPack({
            ...dummyPack,
            customPermissions: ["base.read", "tester.admin"] // Tenta inyectar algo que ya existe
        });
        const base = ["base.read", "base.write"];
        const unified = registry.getAllPermissions(base);
        (0, vitest_1.expect)(unified.length).toBe(3);
        (0, vitest_1.expect)(unified).to.include("base.read");
        (0, vitest_1.expect)(unified).to.include("base.write");
        (0, vitest_1.expect)(unified).to.include("tester.admin");
    });
});
//# sourceMappingURL=registry.test.js.map