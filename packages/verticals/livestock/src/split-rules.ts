export interface SplitRule {
  inputTypes: string[]
  outputTypes: string[]
  quantitativeField: string
}

export const livestockSplitRules: SplitRule[] = [
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
]
