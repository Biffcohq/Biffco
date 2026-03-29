import type { Permission } from './permissions';
export declare function can(actorPermissions: readonly string[], permission: Permission): boolean;
export declare function canAll(actorPermissions: readonly string[], permissions: readonly Permission[]): boolean;
export declare function canAny(actorPermissions: readonly string[], permissions: readonly Permission[]): boolean;
export declare function assertCan(actorPermissions: readonly string[], permission: Permission, message?: string): void;
//# sourceMappingURL=can.d.ts.map