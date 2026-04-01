"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.livestockMergeRules = void 0;
exports.livestockMergeRules = [
    {
        inputTypes: ['AnimalAsset'],
        outputType: 'LotAsset',
        worstCaseFields: [
            'holds',
            'gfwAlerts',
            'quarantine',
        ],
        computedFields: {
            quantity: (inputs) => inputs.length,
            categories: (inputs) => [...new Set(inputs.map(a => a.payload.category))],
            avgWeight: (inputs) => {
                const weights = inputs.map(a => a.payload.lastWeight).filter(Boolean);
                return weights.length > 0 ? weights.reduce((a, b) => a + b, 0) / weights.length : null;
            }
        }
    },
    {
        inputTypes: ['LotAsset', 'LotAsset'],
        outputType: 'LotAsset',
        worstCaseFields: [
            'holds',
            'gfwAlerts',
            'quarantine',
        ],
        computedFields: {
            quantity: (inputs) => inputs.reduce((sum, l) => sum + (l.payload?.quantity ?? 0), 0),
            categories: (inputs) => [...new Set(inputs.flatMap(l => l.payload?.categories ?? []))]
        }
    }
];
//# sourceMappingURL=merge-rules.js.map