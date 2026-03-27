import { describe, it, expect } from 'vitest'
import { can, canAll, assertCan } from './can'
import { Permission } from './permissions'

describe("RBAC can()", () => {
  it("deny-by-default para actor sin permisos", () => {
    expect(can([], Permission.ASSETS_CREATE)).toBe(false)
  })

  it("permite si tiene el permiso", () => {
    expect(can([Permission.ASSETS_READ], Permission.ASSETS_READ)).toBe(true)
    expect(can([Permission.ASSETS_READ], Permission.ASSETS_CREATE)).toBe(false)
  })

  it("canAll requiere todos", () => {
    expect(canAll([Permission.ASSETS_READ, Permission.ASSETS_CREATE], [Permission.ASSETS_READ, Permission.ASSETS_CREATE])).toBe(true)
    expect(canAll([Permission.ASSETS_READ], [Permission.ASSETS_READ, Permission.ASSETS_CREATE])).toBe(false)
  })

  it("assertCan throws if denied", () => {
    expect(() => assertCan([], Permission.ASSETS_CREATE)).toThrow("Permission denied:")
    expect(() => assertCan([Permission.ASSETS_CREATE], Permission.ASSETS_CREATE)).not.toThrow()
  })
})
