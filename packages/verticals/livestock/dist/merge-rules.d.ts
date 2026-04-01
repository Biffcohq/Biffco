export interface MergeRule {
    inputTypes: string[];
    outputType: string;
    worstCaseFields: string[];
    computedFields: Record<string, (inputs: any[]) => any>;
}
export declare const livestockMergeRules: MergeRule[];
//# sourceMappingURL=merge-rules.d.ts.map