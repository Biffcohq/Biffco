export type WidgetType = 
  | 'text' 
  | 'number' 
  | 'date' 
  | 'select' 
  | 'multiselect' 
  | 'file-upload' 
  | 'geo-polygon'

export interface UISchemaField {
  id: string
  label: string
  type: WidgetType
  required?: boolean
  options?: { label: string; value: string }[] // Parámetro para select
  placeholder?: string
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

export interface UISchema {
  id: string
  title: string
  fields: UISchemaField[]
}
