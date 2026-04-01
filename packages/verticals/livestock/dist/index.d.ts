import type { VerticalPack } from '@biffco/core/vertical-engine';
import { livestockActorTypes } from './actor-types';
import { livestockAssetTypes } from './asset-types';
import { livestockEventCatalog } from './events';
import { livestockTransformRules } from './transform-rules';
import { livestockSplitRules } from './split-rules';
import { livestockMergeRules } from './merge-rules';
export interface LivestockVerticalPack extends VerticalPack {
    eventCatalog: typeof livestockEventCatalog;
    assetTypes: typeof livestockAssetTypes;
    actorTypesMap?: typeof livestockActorTypes;
    labels: Record<string, string>;
    transformRules: typeof livestockTransformRules;
    splitRules: typeof livestockSplitRules;
    mergeRules: typeof livestockMergeRules;
}
export declare const livestockVerticalPack: LivestockVerticalPack;
export * from './actor-types';
export * from './asset-types';
export * from './events';
export * from './transform-rules';
export * from './split-rules';
export * from './merge-rules';
//# sourceMappingURL=index.d.ts.map