"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.livestockTransformRules = void 0;
exports.livestockTransformRules = [
    {
        id: "SLAUGHTER_COMPLETED",
        inputTypes: ["AnimalAsset"],
        outputTypes: ["DerivedAsset"],
        validations: [
            "ACTIVE_STATUS",
            "NO_ACTIVE_HOLDS",
            "VALID_DTE",
            "EUDR_POLYGON",
            "RECENT_VET_INSPECTION"
        ]
    }
];
//# sourceMappingURL=transform-rules.js.map