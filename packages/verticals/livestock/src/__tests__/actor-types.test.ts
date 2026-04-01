import { describe, it, expect } from 'vitest'
import { livestockActorTypes } from '../actor-types'
import { Permission } from '@biffco/core/rbac'

describe('Livestock Actor Types', () => {
  it('should export exactly 11 actor types', () => {
    expect(livestockActorTypes.length).toBe(11)
  })

  // Helper function to find actor
  const getActor = (id: string) => livestockActorTypes.find(a => a.id === id)

  describe('1. BovineProducer', () => {
    const actor = getActor('BovineProducer')
    it('should have ASSETS_CREATE permission', () => {
      expect(actor?.permissions).toContain(Permission.ASSETS_CREATE)
    })
    it('should have EVENTS_APPEND permission', () => {
      expect(actor?.permissions).toContain(Permission.EVENTS_APPEND)
    })
    it('should NOT have ASSETS_TRANSFORM permission', () => {
      expect(actor?.permissions).not.toContain(Permission.ASSETS_TRANSFORM)
    })
  })

  describe('2. Veterinarian', () => {
    const actor = getActor('Veterinarian')
    it('should have HOLDS_IMPOSE permission', () => {
      expect(actor?.permissions).toContain(Permission.HOLDS_IMPOSE)
    })
    it('should have EVENTS_APPEND permission', () => {
      expect(actor?.permissions).toContain(Permission.EVENTS_APPEND)
    })
    it('should NOT have ASSETS_CREATE permission', () => {
      expect(actor?.permissions).not.toContain(Permission.ASSETS_CREATE)
    })
  })

  describe('3. SenasaInspector', () => {
    const actor = getActor('SenasaInspector')
    it('should have HOLDS_LIFT permission', () => {
      expect(actor?.permissions).toContain(Permission.HOLDS_LIFT)
    })
    it('should have HOLDS_IMPOSE permission', () => {
      expect(actor?.permissions).toContain(Permission.HOLDS_IMPOSE)
    })
    it('should NOT have ASSETS_CREATE permission', () => {
      expect(actor?.permissions).not.toContain(Permission.ASSETS_CREATE)
    })
  })

  describe('4. LivestockCarrier', () => {
    const actor = getActor('LivestockCarrier')
    it('should have EVENTS_APPEND permission', () => {
      expect(actor?.permissions).toContain(Permission.EVENTS_APPEND)
    })
    it('should have ASSETS_READ permission', () => {
      expect(actor?.permissions).toContain(Permission.ASSETS_READ)
    })
    it('should NOT have HOLDS_IMPOSE permission', () => {
      expect(actor?.permissions).not.toContain(Permission.HOLDS_IMPOSE)
    })
  })

  describe('5. FeedlotOperator', () => {
    const actor = getActor('FeedlotOperator')
    it('should have ASSETS_CREATE permission', () => {
      expect(actor?.permissions).toContain(Permission.ASSETS_CREATE)
    })
    it('should have TRANSFERS_ACCEPT permission', () => {
      expect(actor?.permissions).toContain(Permission.TRANSFERS_ACCEPT)
    })
    it('should NOT have ASSETS_TRANSFORM permission', () => {
      expect(actor?.permissions).not.toContain(Permission.ASSETS_TRANSFORM)
    })
  })

  describe('6. SlaughterhouseOperator', () => {
    const actor = getActor('SlaughterhouseOperator')
    it('should have ASSETS_TRANSFORM permission (CRITICAL)', () => {
      expect(actor?.permissions).toContain(Permission.ASSETS_TRANSFORM)
    })
    it('should have ASSETS_SPLIT permission', () => {
      expect(actor?.permissions).toContain(Permission.ASSETS_SPLIT)
    })
    it('should NOT have HOLDS_IMPOSE permission', () => {
      expect(actor?.permissions).not.toContain(Permission.HOLDS_IMPOSE)
    })
  })

  describe('7. AccreditedLaboratory', () => {
    const actor = getActor('AccreditedLaboratory')
    it('should have CERTIFICATIONS_LINK permission', () => {
      expect(actor?.permissions).toContain(Permission.CERTIFICATIONS_LINK)
    })
    it('should have EVENTS_APPEND permission', () => {
      expect(actor?.permissions).toContain(Permission.EVENTS_APPEND)
    })
    it('should NOT have TRANSFERS_INITIATE permission', () => {
      expect(actor?.permissions).not.toContain(Permission.TRANSFERS_INITIATE)
    })
  })

  describe('8. Exporter', () => {
    const actor = getActor('Exporter')
    it('should have TRANSFERS_INITIATE permission', () => {
      expect(actor?.permissions).toContain(Permission.TRANSFERS_INITIATE)
    })
    it('should have ASSETS_MERGE permission', () => {
      expect(actor?.permissions).toContain(Permission.ASSETS_MERGE)
    })
    it('should NOT have ASSETS_TRANSFORM permission', () => {
      expect(actor?.permissions).not.toContain(Permission.ASSETS_TRANSFORM)
    })
  })

  describe('9. EUImporter', () => {
    const actor = getActor('EUImporter')
    it('should have TRANSFERS_ACCEPT permission', () => {
      expect(actor?.permissions).toContain(Permission.TRANSFERS_ACCEPT)
    })
    it('should have ASSETS_SPLIT permission', () => {
      expect(actor?.permissions).toContain(Permission.ASSETS_SPLIT)
    })
    it('should NOT have ASSETS_TRANSFORM permission', () => {
      expect(actor?.permissions).not.toContain(Permission.ASSETS_TRANSFORM)
    })
  })

  describe('10. RetailerProcessor', () => {
    const actor = getActor('RetailerProcessor')
    it('should have ASSETS_SPLIT permission', () => {
      expect(actor?.permissions).toContain(Permission.ASSETS_SPLIT)
    })
    it('should have EVENTS_APPEND permission', () => {
      expect(actor?.permissions).toContain(Permission.EVENTS_APPEND)
    })
    it('should NOT have ASSETS_CREATE permission', () => {
      expect(actor?.permissions).not.toContain(Permission.ASSETS_CREATE)
    })
  })

  describe('11. ExternalAuditor', () => {
    const actor = getActor('ExternalAuditor')
    it('should have REPORTS_GENERATE permission', () => {
      expect(actor?.permissions).toContain(Permission.REPORTS_GENERATE)
    })
    it('should have AUDIT_READ permission', () => {
      expect(actor?.permissions).toContain(Permission.AUDIT_READ)
    })
    it('should NOT have EVENTS_APPEND permission (Read-only actor)', () => {
      expect(actor?.permissions).not.toContain(Permission.EVENTS_APPEND)
    })
  })
})
