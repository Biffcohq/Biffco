// apps/api/src/workers/gfw-check.ts

export class GFWWorker {
  /**
   * Mock GFW check worker that simulates an explicit request to the Global Forest Watch API.
   */
  static async checkPolygonAgainstGFW(polygonGeoJson: any): Promise<{ isDeforested: boolean, riskLevel: 'LOW' | 'MEDIUM' | 'HIGH', reportId: string, timestamp: string }> {
    console.info("[GFW Worker] Iniciando análisis satelital de polígono contra base de Global Forest Watch (Corte 2020)...")
    
    // Simular un delay de API (2 segundos)
    await new Promise(r => setTimeout(r, 2000))

    // Simular la herencia del peor caso o prueba explícita inyectada por el usuario
    const stringified = JSON.stringify(polygonGeoJson)
    const isTestHighRisk = stringified.includes("HIGH_RISK_MOCK_EUDR") || stringified.includes("mock_deforestation")
    
    const riskLevel = isTestHighRisk ? 'HIGH' : 'LOW'
    console.info(`[GFW Worker] Análisis completado. Riesgo detectado: ${riskLevel}`)

    return {
      isDeforested: isTestHighRisk,
      riskLevel,
      reportId: `GFW-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    }
  }
}
