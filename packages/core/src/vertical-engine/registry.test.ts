import { describe, it, expect } from 'vitest'
import { VerticalRegistry } from './registry'
import type { VerticalPack } from './vertical-pack'

describe("VerticalRegistry", () => {
  const dummyPack: VerticalPack = {
    id: "bif-tester",
    version: "1.0.0",
    name: "Tester Vertical",
    customPermissions: ["tester.admin"],
    rules: { validateEvent: async () => ({ ok: true }) }
  }

  it("registra un pack correctamente", () => {
    const registry = new VerticalRegistry()
    const result = registry.registerPack(dummyPack)
    expect(result.ok).toBe(true)
    expect(registry.getPack("bif-tester")).toEqual(dummyPack)
  })

  it("previene colisión de IDs (no pisar packs existentes)", () => {
    const registry = new VerticalRegistry()
    registry.registerPack(dummyPack)
    const result = registry.registerPack(dummyPack) // Intentar registrar el mismo
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toContain("ya se encuentra registrado")
    }
  })

  it("deduplica y unifica permisos customs con los base", () => {
    const registry = new VerticalRegistry()
    registry.registerPack({
      ...dummyPack,
      customPermissions: ["base.read", "tester.admin"] // Tenta inyectar algo que ya existe
    })

    const base = ["base.read", "base.write"]
    const unified = registry.getAllPermissions(base)

    expect(unified.length).toBe(3)
    expect(unified).to.include("base.read")
    expect(unified).to.include("base.write")
    expect(unified).to.include("tester.admin")
  })
})
