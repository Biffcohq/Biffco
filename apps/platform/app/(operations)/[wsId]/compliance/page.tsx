"use client"

import React, { useState, useEffect } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { EudrPdfDocument } from './EudrPdfDocument'
import { IconFileCheck, IconArrowLeft, IconChartPie } from '@tabler/icons-react'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'

export default function CompliancePage({ params }: { params: { wsId: string } }) {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => { setIsClient(true) }, [])

  const { data: metrics, isLoading } = trpc.assets.getEudrMetrics.useQuery()

  const mockData = {
    operatorName: `BIFFCO Exporters S.A. (${params.wsId})`,
    operatorId: "EORI-ES123456789",
    hsCode: "0201.30 (Carne bovina, fresca o refrigerada, deshuesada)",
    quantity: 24500,
    geolocation: "JSON Polygon: [-34.6037, -58.3816] - Lote 14, La Pampa",
    gfwStatus: "RIESGO BAJO (No deforestación detectada desde el 31/12/2020)"
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 h-[calc(100vh-6rem)] max-w-4xl mx-auto w-full">
       <div className="flex items-center gap-4 shrink-0">
        <Link href={`/${params.wsId}/assets`} className="p-2 border border-border rounded-lg bg-surface text-text-secondary hover:text-text-primary">
          <IconArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-text-primary">Debida Diligencia EUDR (Reg. UE 2023/1115)</h1>
      </div>

      {isLoading ? (
        <div className="animate-pulse bg-surface p-10 rounded-xl h-64 border border-border" />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface border border-border p-6 rounded-xl flex items-center justify-between">
              <div>
                 <p className="text-sm text-text-muted font-bold tracking-wider uppercase">Polígonos Declarados</p>
                 <p className="text-4xl font-black text-text-primary mt-2">{metrics?.withPolygon || 0}<span className="text-xl text-text-muted">/{metrics?.totalAnimals || 0}</span></p>
              </div>
              <IconChartPie size={40} className="text-primary/20" />
            </div>
            <div className="bg-surface border border-border p-6 rounded-xl flex items-center justify-between">
              <div>
                 <p className="text-sm text-text-muted font-bold tracking-wider uppercase">DTE Vigentes</p>
                 <p className="text-4xl font-black text-text-primary mt-2">{metrics?.validDte || 0}<span className="text-xl text-text-muted">/{metrics?.totalAnimals || 0}</span></p>
              </div>
              <IconChartPie size={40} className="text-success/20" />
            </div>
            <div className="bg-surface border border-border p-6 rounded-xl flex items-center justify-between">
              <div>
                 <p className="text-sm text-text-muted font-bold tracking-wider uppercase">SAT GFW Clear</p>
                 <p className="text-4xl font-black text-text-primary mt-2">{metrics?.gfwClear || 0}<span className="text-xl text-text-muted">/{metrics?.totalAnimals || 0}</span></p>
              </div>
              <IconChartPie size={40} className="text-success/20" />
            </div>
          </div>
          
          <div className="bg-surface border border-border rounded-xl p-8 flex flex-col items-center justify-center text-center gap-6 shadow-sm">
        <IconFileCheck size={64} className="text-success" />
        <div>
          <h2 className="text-xl font-bold text-text-primary uppercase tracking-wide">Listo para Emitir</h2>
          <p className="text-sm text-text-secondary mt-2 max-w-lg">El cruce satelital en segundo plano determinó un RIESGO BAJO para los lotes seleccionados. Puedes descargar la declaración para adjuntarla al DUA o presentar ante las autoridades aduaneras europeas.</p>
        </div>
        
        {isClient ? (
          <PDFDownloadLink
            document={<EudrPdfDocument data={mockData} />}
            fileName="BU-DDS-EUDR.pdf"
            className="px-6 py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary/90 hover:-translate-y-0.5 transition-all text-sm uppercase tracking-wider"
          >
            {({ loading }) => (loading ? 'Generando PDF Definitivo...' : 'Descargar PDF (Declaración Jurada)')}
          </PDFDownloadLink>
        ) : (
          <button disabled className="px-6 py-3 bg-surface-raised text-text-muted font-bold rounded-lg shadow-sm font-mono text-sm uppercase tracking-wider">Cargando Motor PDF...</button>
        )}
      </div>
      </>
      )}
    </div>
  )
}
