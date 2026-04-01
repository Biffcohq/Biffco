"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.livestockSplitRules = void 0;
exports.livestockSplitRules = [
    {
        inputTypes: ['LotAsset'],
        outputTypes: ['LotAsset'],
        quantitativeField: 'quantity'
    },
    {
        inputTypes: ['LotAsset'],
        outputTypes: ['LotAsset', 'AnimalAsset'],
        quantitativeField: 'quantity'
    }
];
//# sourceMappingURL=split-rules.js.map