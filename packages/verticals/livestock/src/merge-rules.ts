/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
export interface MergeRule {
  inputTypes: string[]
  outputType: string
  worstCaseFields: string[]
  computedFields: Record<string, (inputs: any[]) => any>
}

export const livestockMergeRules: MergeRule[] = [
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
        const weights = inputs.map(a => a.payload.lastWeight).filter(Boolean)
        return weights.length > 0 ? weights.reduce((a,b) => a+b, 0) / weights.length : null
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
]
