"use client"

import React, { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { IconBox, IconSearch, IconFilter, IconPlus, IconArrowRight, IconLayersDifference } from '@tabler/icons-react'
import Link from 'next/link'
import { format } from 'date-fns'

export default function AssetsPage({ params }: { params: { wsId: string } }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Query al nuevo router creado en Step 2
  const { data: assets, isLoading } = trpc.assets.list.useQuery({
    limit: 50,
    status: statusFilter || undefined
    // La búsqueda local se aplicará en memoria por ahora, o podrías pasar el query al router.
  })

  type AssetData = { id: string, type: string, status: string, createdAt: Date | string }

  const filteredAssets = assets?.filter((a: AssetData) => 
    !searchTerm || 
    a.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderStatusBadge = (status: string) => {
    switch(status.toUpperCase()) {
      case 'ACTIVE': return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-success/20 text-success border border-success/30">Activo</span>
      case 'QUARANTINE': return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-warning/20 text-warning border border-warning/30">Cuarentena</span>
      case 'SLAUGHTERED': return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-text-muted/20 text-text-muted border border-border">Faenado</span>
      default: return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">{status}</span>
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 h-[calc(100vh-6rem)]">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <IconBox size={24} className="text-primary" />
            Directorio de Activos
          </h1>
          <p className="text-text-secondary text-sm">Gestiona el ciclo de vida unitario de los activos de este workspace.</p>
        </div>
        
        <div className="flex gap-3">
          {/* Action Buttons */}
          <button className="bg-surface border border-border text-text-primary hover:bg-surface-raised px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
            <IconLayersDifference size={18} />
            Agrupar
          </button>
          <button className="bg-primary text-white hover:bg-primary-hover px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm">
            <IconPlus size={18} />
            Alta de Activo
          </button>
        </div>
      </div>

      {/* Toolbar: Filtros & Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between shrink-0 bg-surface p-4 rounded-xl border border-border shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Buscar por ID o Tipo..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-bg border border-border rounded-md pl-9 pr-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center text-sm font-medium text-text-secondary">
            <IconFilter size={16} className="mr-1.5" />
            Estado:
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-bg border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
          >
            <option value="">Todos</option>
            <option value="ACTIVE">Activos</option>
            <option value="QUARANTINE">Cuarentena</option>
          </select>
        </div>
      </div>

      {/* Table Area */}
      <div className="flex-1 bg-surface border border-border rounded-xl shadow-sm overflow-hidden flex flex-col min-h-0">
        <div className="overflow-x-auto overflow-y-auto flex-1">
          <table className="w-full text-left text-sm text-text-secondary">
            <thead className="text-xs uppercase bg-surface-raised text-text-muted sticky top-0 border-b border-border z-10 font-bold">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">Activo ID (Hash)</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Tipo (Vertical)</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Estado</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Creado</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                // Skeleton loading state
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-border/50 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-border/50 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-border/50 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-border/50 rounded w-32"></div></td>
                    <td className="px-6 py-4"></td>
                  </tr>
                ))
              ) : filteredAssets?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                    No se encontraron activos para este criterio.
                  </td>
                </tr>
              ) : (
                filteredAssets?.map((asset: AssetData) => (
                  <tr key={asset.id} className="hover:bg-surface-raised/50 transition-colors group">
                    <td className="px-6 py-4 font-mono text-text-primary text-xs">
                       <span className="text-text-muted truncate inline-block w-8">{asset.id.split('-')[0]}</span>
                       {asset.id.substring(asset.id.indexOf('-'))}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium bg-bg border border-border px-2 py-1 rounded text-xs">
                        {asset.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {renderStatusBadge(asset.status)}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {asset.createdAt ? format(new Date(asset.createdAt), "dd MMM, yyyy HH:mm") : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/${params.wsId}/assets/${asset.id}`}
                        className="inline-flex items-center justify-center p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Ver detalle completo"
                      >
                        <IconArrowRight size={18} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="bg-surface-raised border-t border-border p-4 flex items-center justify-between text-xs text-text-muted shrink-0">
          <span>Mostrando {filteredAssets?.length || 0} de {assets?.length || 0} activos</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-border rounded hover:bg-surface disabled:opacity-50">Anterior</button>
            <button className="px-3 py-1 border border-border rounded hover:bg-surface disabled:opacity-50">Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  )
}
