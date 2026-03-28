import type { VerticalPack } from '../vertical-pack'

export const livestockMockPack: VerticalPack = {
  id: "bif-bovine-mock",
  version: "1.0.0",
  name: "Biffco Bovine (Mock)",
  customPermissions: [
    "assets.read",
    "assets.create",
    "assets.transfer",
    "events.append",
    "members.manage",
    "facilities.manage"
  ],
  rules: {
    validateEvent: async (event) => {
      // Mock basic verification
      if (!event.type) return { ok: false, error: "Event type is required" }
      return { ok: true }
    }
  }
}
