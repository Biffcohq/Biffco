import type { Permission } from './permissions'

export function can(
  actorPermissions: readonly string[],
  permission: Permission,
): boolean {
  return actorPermissions.includes(permission)
}

export function canAll(
  actorPermissions: readonly string[],
  permissions: readonly Permission[],
): boolean {
  return permissions.every(p => can(actorPermissions, p))
}

export function canAny(
  actorPermissions: readonly string[],
  permissions: readonly Permission[],
): boolean {
  return permissions.some(p => can(actorPermissions, p))
}

export function assertCan(
  actorPermissions: readonly string[],
  permission: Permission,
  message?: string,
): void {
  if (!can(actorPermissions, permission)) {
    throw new Error(message ?? `Permission denied: ${permission}`)
  }
}
