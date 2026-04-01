"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const actor_types_1 = require("../actor-types");
const rbac_1 = require("@biffco/core/rbac");
(0, vitest_1.describe)('Livestock Actor Types', () => {
    (0, vitest_1.it)('should export exactly 11 actor types', () => {
        (0, vitest_1.expect)(actor_types_1.livestockActorTypes.length).toBe(11);
    });
    // Helper function to find actor
    const getActor = (id) => actor_types_1.livestockActorTypes.find(a => a.id === id);
    (0, vitest_1.describe)('1. BovineProducer', () => {
        const actor = getActor('BovineProducer');
        (0, vitest_1.it)('should have ASSETS_CREATE permission', () => {
            (0, vitest_1.expect)(actor?.permissions).toContain(rbac_1.Permission.ASSETS_CREATE);
        });
        (0, vitest_1.it)('should have EVENTS_APPEND permission', () => {
            (0, vitest_1.expect)(actor?.permissions).toContain(rbac_1.Permission.EVENTS_APPEND);
        });
        (0, vitest_1.it)('should NOT have ASSETS_TRANSFORM permission', () => {
            (0, vitest_1.expect)(actor?.permissions).not.toContain(rbac_1.Permission.ASSETS_TRANSFORM);
        });
    });
    (0, vitest_1.describe)('2. Veterinarian', () => {
        const actor = getActor('Veterinarian');
        (0, vitest_1.it)('should have HOLDS_IMPOSE permission', () => {
            (0, vitest_1.expect)(actor?.permissions).toContain(rbac_1.Permission.HOLDS_IMPOSE);
        });
        (0, vitest_1.it)('should have EVENTS_APPEND permission', () => {
            (0, vitest_1.expect)(actor?.permissions).toContain(rbac_1.Permission.EVENTS_APPEND);
        });
        (0, vitest_1.it)('should NOT have ASSETS_CREATE permission', () => {
            (0, vitest_1.expect)(actor?.permissions).not.toContain(rbac_1.Permission.ASSETS_CREATE);
        });
    });
    (0, vitest_1.describe)('3. SenasaInspector', () => {
        const actor = getActor('SenasaInspector');
        (0, vitest_1.it)('should have HOLDS_LIFT permission', () => {
            (0, vitest_1.expect)(actor?.permissions).toContain(rbac_1.Permission.HOLDS_LIFT);
        });
        (0, vitest_1.it)('should have HOLDS_IMPOSE permission', () => {
            (0, vitest_1.expect)(actor?.permissions).toContain(rbac_1.Permission.HOLDS_IMPOSE);
        });
        (0, vitest_1.it)('should NOT have ASSETS_CREATE permission', () => {
            (0, vitest_1.expect)(actor?.permissions).not.toContain(rbac_1.Permission.ASSETS_CREATE);
        });
    });
    (0, vitest_1.describe)('4. LivestockCarrier', () => {
        const actor = getActor('LivestockCarrier');
        (0, vitest_1.it)('should have EVENTS_APPEND permission', () => {
            (0, vitest_1.expect)(actor?.permissions).toContain(rbac_1.Permission.EVENTS_APPEND);
        });
        (0, vitest_1.it)('should have ASSETS_READ permission', () => {
            (0, vitest_1.expect)(actor?.permissions).toContain(rbac_1.Permission.ASSETS_READ);
        });
        (0, vitest_1.it)('should NOT have HOLDS_IMPOSE permission', () => {
            (0, vitest_1.expect)(actor?.permissions).not.toContain(rbac_1.Permission.HOLDS_IMPOSE);
        });
    });
    (0, vitest_1.describe)('5. FeedlotOperator', () => {
        const actor = getActor('FeedlotOperator');
        (0, vitest_1.it)('should have ASSETS_CREATE permission', () => {
            (0, vitest_1.expect)(actor?.permissions).toContain(rbac_1.Permission.ASSETS_CREATE);
        });
        (0, vitest_1.it)('should have TRANSFERS_ACCEPT permission', () => {
            (0, vitest_1.expect)(actor?.permissions).toContain(rbac_1.Permission.TRANSFERS_ACCEPT);
        });
        (0, vitest_1.it)('should NOT have ASSETS_TRANSFORM permission', () => {
            (0, vitest_1.expect)(actor?.permissions).not.toContain(rbac_1.Permission.ASSETS_TRANSFORM);
        });
    });
    (0, vitest_1.describe)('6. SlaughterhouseOperator', () => {
        const actor = getActor('SlaughterhouseOperator');
        (0, vitest_1.it)('should have ASSETS_TRANSFORM permission (CRITICAL)', () => {
            (0, vitest_1.expect)(actor?.permissions).toContain(rbac_1.Permission.ASSETS_TRANSFORM);
        });
        (0, vitest_1.it)('should have ASSETS_SPLIT permission', () => {
            (0, vitest_1.expect)(actor?.permissions).toContain(rbac_1.Permission.ASSETS_SPLIT);
        });
        (0, vitest_1.it)('should NOT have HOLDS_IMPOSE permission', () => {
            (0, vitest_1.expect)(actor?.permissions).not.toContain(rbac_1.Permission.HOLDS_IMPOSE);
        });
    });
    (0, vitest_1.describe)('7. AccreditedLaboratory', () => {
        const actor = getActor('AccreditedLaboratory');
        (0, vitest_1.it)('should have CERTIFICATIONS_LINK permission', () => {
            (0, vitest_1.expect)(actor?.permissions).toContain(rbac_1.Permission.CERTIFICATIONS_LINK);
        });
        (0, vitest_1.it)('should have EVENTS_APPEND permission', () => {
            (0, vitest_1.expect)(actor?.permissions).toContain(rbac_1.Permission.EVENTS_APPEND);
        });
        (0, vitest_1.it)('should NOT have TRANSFERS_INITIATE permission', () => {
            (0, vitest_1.expect)(actor?.permissions).not.toContain(rbac_1.Permission.TRANSFERS_INITIATE);
        });
    });
    (0, vitest_1.describe)('8. Exporter', () => {
        const actor = getActor('Exporter');
        (0, vitest_1.it)('should have TRANSFERS_INITIATE permission', () => {
            (0, vitest_1.expect)(actor?.permissions).toContain(rbac_1.Permission.TRANSFERS_INITIATE);
        });
        (0, vitest_1.it)('should have ASSETS_MERGE permission', () => {
            (0, vitest_1.expect)(actor?.permissions).toContain(rbac_1.Permission.ASSETS_MERGE);
        });
        (0, vitest_1.it)('should NOT have ASSETS_TRANSFORM permission', () => {
            (0, vitest_1.expect)(actor?.permissions).not.toContain(rbac_1.Permission.ASSETS_TRANSFORM);
        });
    });
    (0, vitest_1.describe)('9. EUImporter', () => {
        const actor = getActor('EUImporter');
        (0, vitest_1.it)('should have TRANSFERS_ACCEPT permission', () => {
            (0, vitest_1.expect)(actor?.permissions).toContain(rbac_1.Permission.TRANSFERS_ACCEPT);
        });
        (0, vitest_1.it)('should have ASSETS_SPLIT permission', () => {
            (0, vitest_1.expect)(actor?.permissions).toContain(rbac_1.Permission.ASSETS_SPLIT);
        });
        (0, vitest_1.it)('should NOT have ASSETS_TRANSFORM permission', () => {
            (0, vitest_1.expect)(actor?.permissions).not.toContain(rbac_1.Permission.ASSETS_TRANSFORM);
        });
    });
    (0, vitest_1.describe)('10. RetailerProcessor', () => {
        const actor = getActor('RetailerProcessor');
        (0, vitest_1.it)('should have ASSETS_SPLIT permission', () => {
            (0, vitest_1.expect)(actor?.permissions).toContain(rbac_1.Permission.ASSETS_SPLIT);
        });
        (0, vitest_1.it)('should have EVENTS_APPEND permission', () => {
            (0, vitest_1.expect)(actor?.permissions).toContain(rbac_1.Permission.EVENTS_APPEND);
        });
        (0, vitest_1.it)('should NOT have ASSETS_CREATE permission', () => {
            (0, vitest_1.expect)(actor?.permissions).not.toContain(rbac_1.Permission.ASSETS_CREATE);
        });
    });
    (0, vitest_1.describe)('11. ExternalAuditor', () => {
        const actor = getActor('ExternalAuditor');
        (0, vitest_1.it)('should have REPORTS_GENERATE permission', () => {
            (0, vitest_1.expect)(actor?.permissions).toContain(rbac_1.Permission.REPORTS_GENERATE);
        });
        (0, vitest_1.it)('should have AUDIT_READ permission', () => {
            (0, vitest_1.expect)(actor?.permissions).toContain(rbac_1.Permission.AUDIT_READ);
        });
        (0, vitest_1.it)('should NOT have EVENTS_APPEND permission (Read-only actor)', () => {
            (0, vitest_1.expect)(actor?.permissions).not.toContain(rbac_1.Permission.EVENTS_APPEND);
        });
    });
});
//# sourceMappingURL=actor-types.test.js.map