"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const can_1 = require("./can");
const permissions_1 = require("./permissions");
(0, vitest_1.describe)("RBAC can()", () => {
    (0, vitest_1.it)("deny-by-default para actor sin permisos", () => {
        (0, vitest_1.expect)((0, can_1.can)([], permissions_1.Permission.ASSETS_CREATE)).toBe(false);
    });
    (0, vitest_1.it)("permite si tiene el permiso", () => {
        (0, vitest_1.expect)((0, can_1.can)([permissions_1.Permission.ASSETS_READ], permissions_1.Permission.ASSETS_READ)).toBe(true);
        (0, vitest_1.expect)((0, can_1.can)([permissions_1.Permission.ASSETS_READ], permissions_1.Permission.ASSETS_CREATE)).toBe(false);
    });
    (0, vitest_1.it)("canAll requiere todos", () => {
        (0, vitest_1.expect)((0, can_1.canAll)([permissions_1.Permission.ASSETS_READ, permissions_1.Permission.ASSETS_CREATE], [permissions_1.Permission.ASSETS_READ, permissions_1.Permission.ASSETS_CREATE])).toBe(true);
        (0, vitest_1.expect)((0, can_1.canAll)([permissions_1.Permission.ASSETS_READ], [permissions_1.Permission.ASSETS_READ, permissions_1.Permission.ASSETS_CREATE])).toBe(false);
    });
    (0, vitest_1.it)("assertCan throws if denied", () => {
        (0, vitest_1.expect)(() => (0, can_1.assertCan)([], permissions_1.Permission.ASSETS_CREATE)).toThrow("Permission denied:");
        (0, vitest_1.expect)(() => (0, can_1.assertCan)([permissions_1.Permission.ASSETS_CREATE], permissions_1.Permission.ASSETS_CREATE)).not.toThrow();
    });
});
//# sourceMappingURL=can.test.js.map