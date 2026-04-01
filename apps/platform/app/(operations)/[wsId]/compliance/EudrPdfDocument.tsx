import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica' },
  header: { fontSize: 24, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  section: { margin: 10, padding: 10 },
  label: { fontSize: 10, color: 'gray', marginBottom: 4 },
  value: { fontSize: 14, marginBottom: 12 },
  title: { fontSize: 16, marginBottom: 10, fontWeight: 'bold' }
})

export const EudrPdfDocument = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Declaración de Debida Diligencia (DDS)</Text>
      <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 20 }}>Reglamento (UE) 2023/1115 - Artículo 4</Text>
      
      <View style={styles.section}>
        <Text style={styles.title}>1. Información del Operador</Text>
        <Text style={styles.label}>Nombre o Razón Social</Text>
        <Text style={styles.value}>{data.operatorName}</Text>
        
        <Text style={styles.label}>Nº EORI o Identificación de Registro</Text>
        <Text style={styles.value}>{data.operatorId}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>2. Descripción del Producto</Text>
        <Text style={styles.label}>Código Arancelario (SA)</Text>
        <Text style={styles.value}>{data.hsCode}</Text>

        <Text style={styles.label}>Asunto de la Declaración (Cantidad)</Text>
        <Text style={styles.value}>{data.quantity} kg</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>3. Trazabilidad y Geoubicación</Text>
        <Text style={styles.label}>Coordenadas Satelitales (Polígonos de Origen)</Text>
        <Text style={styles.value}>{data.geolocation}</Text>
        
        <Text style={styles.label}>Resultado del SAT (Global Forest Watch)</Text>
        <Text style={styles.value}>{data.gfwStatus}</Text>
      </View>
      
      <View style={{ marginTop: 40, borderTop: '1px solid #ccc', paddingTop: 20 }}>
        <Text style={{ fontSize: 10, textAlign: 'center' }}>Emitido el {new Date().toLocaleDateString()}</Text>
        <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 5 }}>"El operador certifica bajo su exclusiva responsabilidad que el producto amparado por la presente atiende requisitos de libre de deforestación."</Text>
      </View>
    </Page>
  </Document>
)
