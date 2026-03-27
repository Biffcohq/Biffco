import type { Meta, StoryObj } from '@storybook/react'
import { DynamicFormRenderer } from './DynamicFormRenderer'
import type { UISchema } from './schema'

const meta: Meta<typeof DynamicFormRenderer> = {
  title: 'VerticalEngine/DynamicFormRenderer',
  component: DynamicFormRenderer,
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#F3F4F6' },
      ],
    },
  },
  args: {
    onSubmit: (data: Record<string, any>) => alert("Submit disparado al Core:\n\n" + JSON.stringify(data, null, 2)),
    onCancel: () => console.log("Cancel clicked")
  }
}
export default meta

type Story = StoryObj<typeof DynamicFormRenderer>

const BovineSchemaMock: UISchema = {
  id: "bovin-inspection-schema",
  title: "Inspección de Lote (Bovine Vertical)",
  fields: [
    {
      id: "inspector_name",
      label: "Nombre del Inspector",
      type: "text",
      required: true,
      placeholder: "Ej: Dr. Biff Tannen"
    },
    {
      id: "animal_weight",
      label: "Peso en Pie Promedio (kg)",
      type: "number",
      required: true,
      validation: { min: 200, max: 1500 }
    },
    {
      id: "inspection_date",
      label: "Fecha de Inspección Oficial",
      type: "date",
      required: true
    },
    {
      id: "breed",
      label: "Raza Dominante",
      type: "select",
      required: true,
      options: [
        { label: "Aberdeen Angus", value: "angus" },
        { label: "Hereford", value: "hereford" },
        { label: "Braford", value: "braford" },
        { label: "Wagyu", value: "wagyu" }
      ]
    },
    {
      id: "health_checks",
      label: "Controles Sanitarios Verificados",
      type: "multiselect",
      options: [
        { label: "Vacunación Antiaftosa", value: "aftosa" },
        { label: "Control de Brucelosis", value: "brucelosis" },
        { label: "Trazabilidad Electrónica (Caravana)", value: "rfid" }
      ]
    },
    {
      id: "health_certificate",
      label: "Certificado Sanitario SENASA",
      type: "file-upload",
      required: true
    },
    {
      id: "geo_location",
      label: "Delimitación del Lote Analizado",
      type: "geo-polygon",
      required: true
    }
  ]
}

export const CompleteFormMock: Story = {
  args: {
    schema: BovineSchemaMock,
  }
}
