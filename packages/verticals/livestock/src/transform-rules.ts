export interface TransformRule {
  id: string
  inputTypes: string[]
  outputTypes: string[]
  validations: string[]
}

export const livestockTransformRules: TransformRule[] = [
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
]
