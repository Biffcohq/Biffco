"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.can = can;
exports.canAll = canAll;
exports.canAny = canAny;
exports.assertCan = assertCan;
function can(actorPermissions, permission) {
    return actorPermissions.includes(permission);
}
function canAll(actorPermissions, permissions) {
    return permissions.every(p => can(actorPermissions, p));
}
function canAny(actorPermissions, permissions) {
    return permissions.some(p => can(actorPermissions, p));
}
function assertCan(actorPermissions, permission, message) {
    if (!can(actorPermissions, permission)) {
        throw new Error(message ?? `Permission denied: ${permission}`);
    }
}
//# sourceMappingURL=can.js.map